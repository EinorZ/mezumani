"use client";

import {
  startTransition,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { HEBREW_MONTHS } from "@/lib/constants";
import { SearchableSelect } from "@/components/searchable-select";
import { MultiSearchableSelect } from "@/components/multi-searchable-select";
import {
  addTransaction,
  editTransaction,
  deleteTransaction,
  addVacationTransaction,
  editVacationTransaction,
  deleteVacationTransaction,
  revalidatePageAction,
  bulkEditTransactions,
  bulkEditVacationTransactions,
  bulkDeleteTransactions,
  bulkDeleteVacationTransactions,
  bulkToggleTentative,
  bulkToggleVacationTentative,
} from "@/lib/actions";
import type {
  Transaction,
  VacationMonthRow,
  CategoryMapping,
} from "@/lib/types";

interface Props {
  transactions: Transaction[];
  sheetTitle: string;
  pagePath: string;
  categories: string[];
  cards: string[];
  colorMap: Record<string, string>;
  cardColorMap?: Record<string, string>;
  isVacation?: boolean;
  vacationRows?: VacationMonthRow[];
  categoryMappings?: CategoryMapping[];
}

const emptyForm = {
  day: "",
  month: "",
  expense: "",
  amount: "",
  category: "",
  card: "",
  notes: "",
  tentative: false,
};

type TransactionData = {
  date: string;
  expense: string;
  amount: number;
  category: string;
  card: string;
  notes: string;
};

type UndoEntry =
  | { type: "add"; tempRow: number }
  | { type: "edit"; row: number; original: TransactionData }
  | { type: "delete"; row: number; data: TransactionData };

function parseMonthFromTitle(title: string): number {
  const idx = HEBREW_MONTHS.findIndex((m) => title.startsWith(m));
  if (idx >= 0) return idx + 1;
  // Vacation sheets: default to previous month
  const prevMonth = new Date().getMonth(); // 0-indexed, so this is already "previous" (current - 1 + 1)
  return prevMonth || 12;
}

type SortKey = "expense" | "date" | "amount" | "category" | "card";
type SortDir = "asc" | "desc";

function parseDate(d: string): number {
  const parts = d.split(/[/.]/);
  const day = parseInt(parts[0], 10) || 0;
  const month = parts.length >= 2 ? parseInt(parts[1], 10) || 0 : 0;
  const year =
    parts.length >= 3
      ? parseInt(parts[2], 10) || 0
      : new Date().getFullYear() % 100;
  return year * 10000 + month * 100 + day;
}

function sortTransactions(
  txs: Transaction[],
  key: SortKey,
  dir: SortDir,
): Transaction[] {
  return [...txs].sort((a, b) => {
    let cmp = 0;
    switch (key) {
      case "amount":
        cmp = a.amount - b.amount;
        break;
      case "date":
        cmp = parseDate(a.date) - parseDate(b.date);
        break;
      case "expense":
        cmp = a.expense.localeCompare(b.expense, "he");
        break;
      case "category":
        cmp = a.category.localeCompare(b.category, "he");
        break;
      case "card":
        cmp = a.card.localeCompare(b.card, "he");
        break;
    }
    return dir === "asc" ? cmp : -cmp;
  });
}

/** Column flex shorthand (grow shrink basis) */
const COL = {
  date: "0 0 10%",
  expense: "1 1 30%",
  amount: "0 0 18%",
  category: "0 0 22%",
  card: "0 0 17%",
} as const;

function formatDateDisplay(date: string): string {
  if (!date || date === "/") return "";
  return date.replace(/\//g, ".");
}

/** Parse day input — supports "14" (day only) or "14.02" / "14/02" (day.month override) */
function buildDate(dayInput: string, sheetMonth: string): string {
  const trimmed = dayInput.trim();
  if (!trimmed) return "";
  // Check if user typed XX.YY or XX/YY
  const match = trimmed.match(/^(\d{1,2})[./](\d{1,2})$/);
  if (match) {
    return `${match[1]}/${match[2]}`;
  }
  // Just a day number — append sheet month
  return `${trimmed}/${sheetMonth}`;
}

let optimisticId = -1;

const REVALIDATE_DELAY = 3000; // 3 seconds after last change

export function TransactionTable({
  transactions,
  sheetTitle,
  pagePath,
  categories,
  cards,
  colorMap,
  cardColorMap,
  isVacation,
  vacationRows,
  categoryMappings,
}: Props) {
  const sheetMonth = String(parseMonthFromTitle(sheetTitle));
  const defaultAddForm = { ...emptyForm, month: sheetMonth };

  // Debounced revalidation
  const revalidateTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  function scheduleRevalidate() {
    if (revalidateTimer.current) clearTimeout(revalidateTimer.current);
    revalidateTimer.current = setTimeout(() => {
      startTransition(() => {
        revalidatePageAction(pagePath);
      });
      revalidateTimer.current = null;
    }, REVALIDATE_DELAY);
  }
  function flushRevalidate() {
    if (revalidateTimer.current) clearTimeout(revalidateTimer.current);
    revalidateTimer.current = null;
    startTransition(() => {
      revalidatePageAction(pagePath);
    });
  }
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [addForm, setAddForm] = useState(defaultAddForm);
  const [editForm, setEditForm] = useState(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategories, setFilterCategories] = useState<Set<string>>(
    new Set(),
  );
  const [excludeCategories, setExcludeCategories] = useState<Set<string>>(
    new Set(),
  );
  const [filterCards, setFilterCards] = useState<Set<string>>(new Set());
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [bulkCategory, setBulkCategory] = useState("");
  const [bulkCard, setBulkCard] = useState("");

  // Optimistic local state
  const [pendingAdds, setPendingAdds] = useState<Transaction[]>([]);
  const [pendingEdits, setPendingEdits] = useState<Map<number, Transaction>>(
    new Map(),
  );
  const [pendingDeletes, setPendingDeletes] = useState<Set<number>>(new Set());
  const inflightRef = useRef(0);

  // Ref for the edit row element to detect outside clicks
  const editRowRef = useRef<HTMLDivElement>(null);

  // Undo stack
  const [_undoStack, setUndoStack] = useState<UndoEntry[]>([]);
  // Track tempRow → real row mapping for undoing adds after they've been saved
  const addedRowMapRef = useRef<Map<number, number>>(new Map());
  // Track cancelled adds so we auto-delete them when the server responds
  const cancelledAddsRef = useRef<Set<number>>(new Set());

  // Clear optimistic state when server data updates AND no ops are in flight
  const prevTxRef = useRef(transactions);
  useEffect(() => {
    if (prevTxRef.current !== transactions) {
      prevTxRef.current = transactions;
      if (inflightRef.current === 0) {
        setPendingAdds([]);
        setPendingEdits(new Map());
        setPendingDeletes(new Set());
      }
    }
  }, [transactions]);

  // Merge optimistic state with server data — pending adds always at the end
  const serverTransactions = useMemo(() => {
    return transactions
      .filter((t) => !pendingDeletes.has(t.row))
      .map((t) => pendingEdits.get(t.row) ?? t);
  }, [transactions, pendingEdits, pendingDeletes]);

  const sortedTransactions = useMemo(() => {
    const sorted = sortKey
      ? sortTransactions(serverTransactions, sortKey, sortDir)
      : serverTransactions;
    return [...sorted, ...pendingAdds];
  }, [serverTransactions, pendingAdds, sortKey, sortDir]);

  const filteredTransactions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return sortedTransactions.filter((t) => {
      if (
        q &&
        !t.expense.toLowerCase().includes(q) &&
        !t.notes.toLowerCase().includes(q)
      )
        return false;
      if (filterCategories.size > 0 && !filterCategories.has(t.category))
        return false;
      if (excludeCategories.size > 0 && excludeCategories.has(t.category))
        return false;
      if (filterCards.size > 0 && !filterCards.has(t.card)) return false;
      return true;
    });
  }, [
    sortedTransactions,
    searchQuery,
    filterCategories,
    excludeCategories,
    filterCards,
  ]);

  // Derive unique categories and cards from current transactions for filter options
  const activeCategories = useMemo(() => {
    const set = new Set<string>();
    for (const t of sortedTransactions) if (t.category) set.add(t.category);
    return [...set].sort((a, b) => a.localeCompare(b, "he"));
  }, [sortedTransactions]);

  const activeCards = useMemo(() => {
    const set = new Set<string>();
    for (const t of sortedTransactions) if (t.card) set.add(t.card);
    return [...set].sort((a, b) => a.localeCompare(b, "he"));
  }, [sortedTransactions]);

  const hasActiveFilters =
    searchQuery ||
    filterCategories.size > 0 ||
    excludeCategories.size > 0 ||
    filterCards.size > 0;

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      if (sortDir === "asc") {
        setSortDir("desc");
      } else {
        setSortKey(null);
        setSortDir("asc");
      }
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  function sortIndicator(key: SortKey) {
    if (sortKey !== key) return " ⇅";
    return sortDir === "asc" ? " ▲" : " ▼";
  }

  const addAction = isVacation ? addVacationTransaction : addTransaction;
  const editAction = isVacation ? editVacationTransaction : editTransaction;
  const deleteAction = isVacation
    ? deleteVacationTransaction
    : deleteTransaction;
  const bulkEditAction = isVacation
    ? bulkEditVacationTransactions
    : bulkEditTransactions;
  const bulkDeleteAction = isVacation
    ? bulkDeleteVacationTransactions
    : bulkDeleteTransactions;

  const lastCheckedRef = useRef<number | null>(null);

  function handleCheckboxChange(row: number, e: React.MouseEvent) {
    if (row < 0) return;

    if (e.shiftKey && lastCheckedRef.current !== null) {
      // Shift+click: select range between lastChecked and current
      const rows = filteredTransactions.map((t) => t.row).filter((r) => r >= 0);
      const from = rows.indexOf(lastCheckedRef.current);
      const to = rows.indexOf(row);
      if (from !== -1 && to !== -1) {
        const [start, end] = from < to ? [from, to] : [to, from];
        setSelectedRows((prev) => {
          const next = new Set(prev);
          for (let i = start; i <= end; i++) next.add(rows[i]);
          return next;
        });
        lastCheckedRef.current = row;
        return;
      }
    }

    lastCheckedRef.current = row;
    setSelectedRows((prev) => {
      const next = new Set(prev);
      if (next.has(row)) next.delete(row);
      else next.add(row);
      return next;
    });
  }

  function handleSelectAll() {
    const selectableRows = filteredTransactions.filter((t) => t.row >= 0);
    const allSelected = selectableRows.every((t) => selectedRows.has(t.row));
    if (allSelected) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(selectableRows.map((t) => t.row)));
    }
  }

  function clearSelection() {
    setSelectedRows(new Set());
    setBulkCategory("");
    setBulkCard("");
  }

  function handleBulkEdit() {
    if (selectedRows.size === 0) return;
    if (!bulkCategory && !bulkCard) return;

    const updates: { row: number; category?: string; card?: string }[] = [];
    for (const row of selectedRows) {
      const update: { row: number; category?: string; card?: string } = { row };
      if (bulkCategory) update.category = bulkCategory;
      if (bulkCard) update.card = bulkCard;
      updates.push(update);
    }

    // Optimistic: update selected rows immediately
    setPendingEdits((prev) => {
      const next = new Map(prev);
      for (const row of selectedRows) {
        const existing = filteredTransactions.find((t) => t.row === row);
        if (!existing) continue;
        const edited = { ...existing };
        if (bulkCategory) edited.category = bulkCategory;
        if (bulkCard) edited.card = bulkCard;
        next.set(row, edited);
      }
      return next;
    });

    clearSelection();

    // Save in background
    inflightRef.current++;
    bulkEditAction(sheetTitle, updates)
      .then(onInflightDone)
      .catch((e) => {
        onInflightDone();
        // Revert optimistic edits on error
        setPendingEdits((prev) => {
          const next = new Map(prev);
          for (const u of updates) next.delete(u.row);
          return next;
        });
        setError(e instanceof Error ? e.message : "שגיאה בעריכה מרובה");
      });
  }

  function handleBulkDelete() {
    if (selectedRows.size === 0) return;

    const rows = [...selectedRows];

    // Optimistic: hide all selected rows immediately
    setPendingDeletes((prev) => {
      const next = new Set(prev);
      for (const row of rows) next.add(row);
      return next;
    });

    clearSelection();

    // Delete in background
    inflightRef.current++;
    bulkDeleteAction(sheetTitle, rows)
      .then(onInflightDone)
      .catch((e) => {
        onInflightDone();
        // Revert optimistic deletes on error
        setPendingDeletes((prev) => {
          const next = new Set(prev);
          for (const row of rows) next.delete(row);
          return next;
        });
        setError(e instanceof Error ? e.message : "שגיאה במחיקה מרובה");
      });
  }

  const bulkTentativeAction = isVacation
    ? bulkToggleVacationTentative
    : bulkToggleTentative;

  function handleBulkTentative(tentative: boolean) {
    if (selectedRows.size === 0) return;

    const rows = [...selectedRows];

    // Optimistic: update tentative flag on selected rows
    setPendingEdits((prev) => {
      const next = new Map(prev);
      for (const row of rows) {
        const existing = filteredTransactions.find((t) => t.row === row);
        if (!existing) continue;
        next.set(row, { ...existing, tentative: tentative || undefined });
      }
      return next;
    });

    clearSelection();

    // Save in background
    inflightRef.current++;
    bulkTentativeAction(sheetTitle, rows, tentative)
      .then(onInflightDone)
      .catch((e) => {
        onInflightDone();
        // Revert optimistic edits on error
        setPendingEdits((prev) => {
          const next = new Map(prev);
          for (const row of rows) next.delete(row);
          return next;
        });
        setError(e instanceof Error ? e.message : "שגיאה בעדכון משוער");
      });
  }

  function onInflightDone() {
    inflightRef.current--;
    scheduleRevalidate();
    // Optimistic state is cleared by the prevTxRef effect when fresh server data arrives
  }

  function handleAdd() {
    if (!addForm.expense.trim() && !addForm.amount.trim()) return;
    const date = buildDate(addForm.day, sheetMonth);
    const amount = parseFloat(addForm.amount) || 0;

    // Optimistic: show immediately
    const tempRow = optimisticId--;
    const optimisticTx: Transaction = {
      row: tempRow,
      date,
      expense: addForm.expense,
      amount,
      category: addForm.category,
      card: addForm.card,
      notes: addForm.notes,
      tentative: addForm.tentative || undefined,
    };
    setPendingAdds((prev) => [...prev, optimisticTx]);
    setAddForm(defaultAddForm);
    setUndoStack((prev) => [...prev, { type: "add", tempRow }]);

    // Save in background
    inflightRef.current++;
    addAction(sheetTitle, {
      date,
      expense: addForm.expense,
      amount,
      category: addForm.category,
      card: addForm.card,
      notes: addForm.notes,
      tentative: addForm.tentative,
    })
      .then((realRow) => {
        addedRowMapRef.current.set(tempRow, realRow);
        // If this add was undone while in flight, delete it now
        if (cancelledAddsRef.current.has(tempRow)) {
          cancelledAddsRef.current.delete(tempRow);
          deleteAction(sheetTitle, realRow).finally(onInflightDone);
        } else {
          onInflightDone();
        }
      })
      .catch((e) => {
        onInflightDone();
        setPendingAdds((prev) => prev.filter((t) => t.row !== tempRow));
        setError(e instanceof Error ? e.message : "שגיאה בהוספת הוצאה");
      });
  }

  function handleEdit(row: number) {
    const date = buildDate(editForm.day, sheetMonth);
    const amount = parseFloat(editForm.amount) || 0;

    // Save original for undo
    const original = transactions.find((t) => t.row === row);
    if (original) {
      setUndoStack((prev) => [
        ...prev,
        {
          type: "edit",
          row,
          original: {
            date: original.date,
            expense: original.expense,
            amount: original.amount,
            category: original.category,
            card: original.card,
            notes: original.notes,
          },
        },
      ]);
    }

    // Optimistic: update immediately
    const optimisticTx: Transaction = {
      row,
      date,
      expense: editForm.expense,
      amount,
      category: editForm.category,
      card: editForm.card,
      notes: editForm.notes,
      tentative: editForm.tentative || undefined,
    };
    setPendingEdits((prev) => new Map(prev).set(row, optimisticTx));
    setEditingRow(null);

    // Save in background
    inflightRef.current++;
    editAction(sheetTitle, row, {
      date,
      expense: editForm.expense,
      amount,
      category: editForm.category,
      card: editForm.card,
      notes: editForm.notes,
      tentative: editForm.tentative,
    })
      .then(onInflightDone)
      .catch((e) => {
        onInflightDone();
        setPendingEdits((prev) => {
          const next = new Map(prev);
          next.delete(row);
          return next;
        });
        setError(e instanceof Error ? e.message : "שגיאה בעריכת הוצאה");
      });
  }

  function handleDelete(row: number) {
    // Save data for undo
    const original = transactions.find((t) => t.row === row);
    if (original) {
      setUndoStack((prev) => [
        ...prev,
        {
          type: "delete",
          row,
          data: {
            date: original.date,
            expense: original.expense,
            amount: original.amount,
            category: original.category,
            card: original.card,
            notes: original.notes,
          },
        },
      ]);
    }

    // Optimistic: hide immediately
    setPendingDeletes((prev) => new Set(prev).add(row));

    // Delete in background
    inflightRef.current++;
    deleteAction(sheetTitle, row)
      .then(onInflightDone)
      .catch((e) => {
        onInflightDone();
        setPendingDeletes((prev) => {
          const next = new Set(prev);
          next.delete(row);
          return next;
        });
        setError(e instanceof Error ? e.message : "שגיאה במחיקת הוצאה");
      });
  }

  const handleUndo = useCallback(() => {
    setUndoStack((prev) => {
      if (prev.length === 0) return prev;
      const next = [...prev];
      const entry = next.pop()!;

      switch (entry.type) {
        case "add": {
          // Remove from optimistic UI
          setPendingAdds((p) => p.filter((t) => t.row !== entry.tempRow));
          // If already saved, delete from server
          const realRow = addedRowMapRef.current.get(entry.tempRow);
          if (realRow !== undefined) {
            addedRowMapRef.current.delete(entry.tempRow);
            inflightRef.current++;
            deleteAction(sheetTitle, realRow)
              .then(onInflightDone)
              .catch(onInflightDone);
          } else {
            // Still in flight — mark as cancelled so it gets deleted on completion
            cancelledAddsRef.current.add(entry.tempRow);
          }
          break;
        }
        case "edit": {
          // Revert optimistic edit
          setPendingEdits((p) => {
            const m = new Map(p);
            m.delete(entry.row);
            return m;
          });
          // Revert on server
          inflightRef.current++;
          editAction(sheetTitle, entry.row, entry.original)
            .then(onInflightDone)
            .catch(onInflightDone);
          break;
        }
        case "delete": {
          // Show row again
          setPendingDeletes((p) => {
            const s = new Set(p);
            s.delete(entry.row);
            return s;
          });
          // Re-add on server
          inflightRef.current++;
          addAction(sheetTitle, entry.data)
            .then(onInflightDone)
            .catch(onInflightDone);
          break;
        }
      }

      return next;
    });
  }, [sheetTitle, addAction, deleteAction, editAction]);

  // Refs for current add/edit actions so the global listener always sees latest
  const handleAddRef = useRef(handleAdd);
  handleAddRef.current = handleAdd;
  const editingRowRef = useRef(editingRow);
  editingRowRef.current = editingRow;
  const handleEditRef = useRef(handleEdit);
  handleEditRef.current = handleEdit;

  // Global keyboard listener: Cmd/Ctrl+Z, Enter to save, Esc to cancel edit
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
        return;
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        if (editingRowRef.current !== null) {
          handleEditRef.current(editingRowRef.current);
        } else {
          handleAddRef.current();
        }
        flushRevalidate();
        return;
      }
      if (e.key === "Enter") {
        if (editingRowRef.current !== null) {
          handleEditRef.current(editingRowRef.current);
        } else {
          handleAddRef.current();
        }
        return;
      }
      if (e.key === "Escape") {
        if (selectedRows.size > 0) {
          clearSelection();
          return;
        }
        if (editingRowRef.current !== null) {
          setEditingRow(null);
        }
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleUndo, selectedRows.size]);

  // Click outside edit row → save and exit
  useEffect(() => {
    if (editingRow === null) return;
    function onMouseDown(e: MouseEvent) {
      const row = editRowRef.current;
      if (row && !row.contains(e.target as Node)) {
        handleEditRef.current(editingRowRef.current!);
      }
    }
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, [editingRow]);

  function startEdit(t: Transaction) {
    // Don't edit optimistic rows
    if (t.row < 0) return;
    clearSelection();
    setEditingRow(t.row);
    // Put full date in day field (e.g. "14.01"); buildDate will parse it back
    const dayDisplay = formatDateDisplay(t.date);
    setEditForm({
      day: dayDisplay,
      month: sheetMonth,
      expense: t.expense,
      amount: String(t.amount),
      category: t.category,
      card: t.card,
      notes: t.notes,
      tentative: t.tentative ?? false,
    });
  }

  function lookupCategoryMapping(expenseName: string): string | undefined {
    if (!categoryMappings?.length || !expenseName.trim()) return undefined;
    const trimmed = expenseName.trim().toLowerCase();
    for (const m of categoryMappings) {
      const names = m.expenseName
        .split(",")
        .map((n) => n.trim().toLowerCase())
        .filter(Boolean);
      for (const name of names) {
        if (name === trimmed || trimmed.includes(name)) return m.category;
      }
    }
    return undefined;
  }

  const borderlessInput: React.CSSProperties = {
    border: "none",
    background: "transparent",
    outline: "none",
    boxShadow: "none",
  };

  function renderInputRow(
    key: string,
    form: typeof emptyForm,
    setForm: (f: typeof emptyForm) => void,
    onSubmit: () => void,
    submitLabel: string,
    onCancel?: () => void,
    rowClass?: string,
    ref?: React.RefObject<HTMLDivElement | null>,
  ) {
    const isEdit = rowClass === "tx-row-edit";
    return (
      <div key={key} ref={ref} className={`tx-row ${rowClass || "tx-row-add"}`}>
        <div style={{ flex: COL.date, minWidth: 0 }}>
          <input
            className="form-control form-control-sm"
            placeholder="יום"
            style={{ width: "60px", ...borderlessInput }}
            value={form.day}
            onChange={(e) => setForm({ ...form, day: e.target.value })}
          />
        </div>
        <div style={{ flex: COL.expense, minWidth: 0 }}>
          <input
            className="form-control form-control-sm"
            placeholder="הוצאה"
            style={borderlessInput}
            value={form.expense}
            onChange={(e) => setForm({ ...form, expense: e.target.value })}
            onBlur={(e) => {
              if (!form.category) {
                const mapped = lookupCategoryMapping(e.target.value);
                if (mapped) setForm({ ...form, category: mapped });
              }
            }}
          />
        </div>
        <div style={{ flex: COL.amount, minWidth: 0, display: "flex", alignItems: "center" }}>
          <button
            type="button"
            className={`tentative-prefix${form.tentative ? " active" : ""}`}
            onClick={() => setForm({ ...form, tentative: !form.tentative })}
            title="משוער"
          >
            ~
          </button>
          <input
            type="number"
            className="form-control form-control-sm"
            placeholder="סכום"
            style={{
              ...borderlessInput,
              ...(form.tentative ? { color: "#c2770e", fontStyle: "italic" } : {}),
            }}
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
          />
        </div>
        <div style={{ flex: COL.category, minWidth: 0 }}>
          <SearchableSelect
            options={categories}
            colorMap={colorMap}
            value={form.category}
            onChange={(val) => setForm({ ...form, category: val })}
            placeholder="קטגוריה"
          />
        </div>
        <div
          style={{
            flex: COL.card,
            minWidth: 0,
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <SearchableSelect
            options={cards}
            colorMap={cardColorMap ?? {}}
            value={form.card}
            onChange={(val) => setForm({ ...form, card: val })}
            placeholder="כרטיס"
          />
          {isEdit && (
            <button
              className="btn btn-sm btn-link text-danger p-0"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(editingRowRef.current!);
                setEditingRow(null);
              }}
              title="מחיקה"
            >
              &#10005;
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      {error && (
        <div className="alert alert-danger alert-dismissible py-2 small">
          {error}
          <button
            type="button"
            className="btn-close"
            onClick={() => setError(null)}
          />
        </div>
      )}

      {/* Search & Filter */}
      <div className="d-flex gap-2 align-items-center mb-2 flex-wrap">
        <input
          className="form-control form-control-sm"
          style={{ maxWidth: 200 }}
          placeholder="חיפוש..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div style={{ minWidth: 140, maxWidth: 220 }}>
          <MultiSearchableSelect
            options={activeCategories}
            colorMap={colorMap}
            selected={filterCategories}
            onChange={setFilterCategories}
            placeholder="קטגוריה"
          />
        </div>
        <div style={{ minWidth: 140, maxWidth: 220 }}>
          <MultiSearchableSelect
            options={activeCategories}
            colorMap={colorMap}
            selected={excludeCategories}
            onChange={setExcludeCategories}
            placeholder="הסתר קטגוריה"
          />
        </div>
        <div style={{ minWidth: 140, maxWidth: 220 }}>
          <MultiSearchableSelect
            options={activeCards}
            colorMap={cardColorMap ?? {}}
            selected={filterCards}
            onChange={setFilterCards}
            placeholder="כרטיס"
          />
        </div>
        {hasActiveFilters && (
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={() => {
              setSearchQuery("");
              setFilterCategories(new Set());
              setExcludeCategories(new Set());
              setFilterCards(new Set());
            }}
          >
            נקה
          </button>
        )}
      </div>

      {/* Header row */}
      <div
        className={`tx-header${selectedRows.size > 0 ? " tx-has-selection" : ""}`}
      >
        <div className="tx-check-overlay tx-check-header">
          <input
            type="checkbox"
            className="form-check-input m-0"
            checked={
              filteredTransactions.filter((t) => t.row >= 0).length > 0 &&
              filteredTransactions
                .filter((t) => t.row >= 0)
                .every((t) => selectedRows.has(t.row))
            }
            onChange={handleSelectAll}
            title="בחר הכל"
          />
        </div>
        <div
          className="tx-header-col"
          style={{ flex: COL.date }}
          onClick={() => handleSort("date")}
        >
          תאריך
          <span className="small text-secondary">{sortIndicator("date")}</span>
        </div>
        <div
          className="tx-header-col"
          style={{ flex: COL.expense }}
          onClick={() => handleSort("expense")}
        >
          תיאור
          <span className="small text-secondary">
            {sortIndicator("expense")}
          </span>
        </div>
        <div
          className="tx-header-col"
          style={{ flex: COL.amount }}
          onClick={() => handleSort("amount")}
        >
          סכום
          <span className="small text-secondary">
            {sortIndicator("amount")}
          </span>
        </div>
        <div
          className="tx-header-col"
          style={{ flex: COL.category }}
          onClick={() => handleSort("category")}
        >
          קטגוריה
          <span className="small text-secondary">
            {sortIndicator("category")}
          </span>
        </div>
        <div
          className="tx-header-col"
          style={{ flex: COL.card }}
          onClick={() => handleSort("card")}
        >
          אמצעי תשלום
          <span className="small text-secondary">{sortIndicator("card")}</span>
        </div>
      </div>

      {/* Add row */}
      {renderInputRow("add", addForm, setAddForm, handleAdd, "הוסף")}

      {/* Transaction rows */}
      {filteredTransactions.map((t) =>
        editingRow === t.row ? (
          renderInputRow(
            `edit-${t.row}`,
            editForm,
            setEditForm,
            () => handleEdit(t.row),
            "שמור",
            () => setEditingRow(null),
            "tx-row-edit",
            editRowRef,
          )
        ) : (
          <div
            key={t.row}
            className={`tx-row${t.tentative ? " tx-row-tentative" : ""}${selectedRows.has(t.row) ? " tx-row-selected" : ""}${selectedRows.size > 0 ? " tx-has-selection" : ""}`}
            onDoubleClick={() => startEdit(t)}
            style={t.row < 0 ? { opacity: 0.5 } : undefined}
          >
            {t.row >= 0 && (
              <div className="tx-check-overlay">
                <input
                  type="checkbox"
                  className="form-check-input m-0"
                  checked={selectedRows.has(t.row)}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCheckboxChange(t.row, e);
                  }}
                  readOnly
                />
              </div>
            )}
            <div className="text-secondary small" style={{ flex: COL.date }}>
              {formatDateDisplay(t.date)}
            </div>
            <div style={{ flex: COL.expense }}>{t.expense}</div>
            <div style={{ flex: COL.amount }}>
              <span className={t.tentative ? "tx-amount-tentative" : undefined}>
                {t.amount !== 0 ? formatCurrency(t.amount) : ""}
              </span>
            </div>
            <div style={{ flex: COL.category }}>
              <span
                className="badge rounded-pill"
                style={{
                  backgroundColor: colorMap[t.category] || "#6c757d",
                }}
              >
                {t.category}
              </span>
            </div>
            <div style={{ flex: COL.card }}>
              <span
                className="badge rounded-pill"
                style={{
                  backgroundColor: cardColorMap?.[t.card] || "#6c757d",
                }}
              >
                {t.card}
              </span>
            </div>
          </div>
        ),
      )}

      {filteredTransactions.length === 0 && (
        <div className="text-center text-secondary py-4">אין הוצאות עדיין</div>
      )}

      {/* Bulk edit bar */}
      {selectedRows.size > 0 && (
        <div className="tx-bulk-bar">
          <span className="fw-bold small">{selectedRows.size} נבחרו</span>
          <div style={{ minWidth: 160 }}>
            <SearchableSelect
              options={categories}
              colorMap={colorMap}
              value={bulkCategory}
              onChange={setBulkCategory}
              placeholder="קטגוריה"
            />
          </div>
          <div style={{ minWidth: 140 }}>
            <SearchableSelect
              options={cards}
              colorMap={cardColorMap ?? {}}
              value={bulkCard}
              onChange={setBulkCard}
              placeholder="כרטיס"
            />
          </div>
          <button
            className="btn btn-sm btn-success"
            onClick={handleBulkEdit}
            disabled={!bulkCategory && !bulkCard}
          >
            עדכן
          </button>
          <button
            className="btn btn-sm btn-outline-warning"
            onClick={() => handleBulkTentative(true)}
          >
            ~
          </button>
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={() => handleBulkTentative(false)}
          >
            ביטול ~
          </button>
          <button className="btn btn-sm btn-danger" onClick={handleBulkDelete}>
            מחק
          </button>
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={clearSelection}
          >
            ביטול
          </button>
        </div>
      )}
    </div>
  );
}
