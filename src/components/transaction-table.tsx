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
import {
  addTransaction,
  editTransaction,
  deleteTransaction,
  addVacationTransaction,
  editVacationTransaction,
  deleteVacationTransaction,
  revalidatePageAction,
} from "@/lib/actions";
import type { Transaction, VacationMonthRow } from "@/lib/types";

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
}

const emptyForm = {
  day: "",
  month: "",
  expense: "",
  amount: "",
  category: "",
  card: "",
  notes: "",
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
  return idx >= 0 ? idx + 1 : 1;
}

type SortKey = "expense" | "date" | "amount" | "category" | "card";
type SortDir = "asc" | "desc";

function parseDate(d: string): number {
  const parts = d.split("/");
  if (parts.length < 2) return 0;
  const day = parseInt(parts[0], 10) || 0;
  const month = parseInt(parts[1], 10) || 0;
  const year = parts[2] ? parseInt(parts[2], 10) || 0 : 0;
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
  amount: "0 0 20%",
  category: "0 0 20%",
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

const REVALIDATE_DELAY = 5000; // 5 seconds after last change

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
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [addForm, setAddForm] = useState(defaultAddForm);
  const [editForm, setEditForm] = useState(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>("asc");

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
  const [undoStack, setUndoStack] = useState<UndoEntry[]>([]);
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

  function onInflightDone() {
    inflightRef.current--;
    scheduleRevalidate();
    // Optimistic state is cleared by the prevTxRef effect when fresh server data arrives
  }

  function handleAdd() {
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
      if (e.key === "Enter") {
        if (editingRowRef.current !== null) {
          handleEditRef.current(editingRowRef.current);
        } else {
          handleAddRef.current();
        }
        return;
      }
      if (e.key === "Escape" && editingRowRef.current !== null) {
        setEditingRow(null);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleUndo]);

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
    });
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
          />
        </div>
        <div style={{ flex: COL.amount, minWidth: 0 }}>
          <input
            type="number"
            className="form-control form-control-sm"
            placeholder="סכום"
            style={borderlessInput}
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

      {/* Header row */}
      <div className="tx-header">
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
      {sortedTransactions.map((t) =>
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
            className="tx-row"
            onDoubleClick={() => startEdit(t)}
            style={t.row < 0 ? { opacity: 0.5 } : undefined}
          >
            <div className="text-secondary small" style={{ flex: COL.date }}>
              {formatDateDisplay(t.date)}
            </div>
            <div style={{ flex: COL.expense }}>{t.expense}</div>
            <div style={{ flex: COL.amount }}>{formatCurrency(t.amount)}</div>
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

      {sortedTransactions.length === 0 && !vacationRows?.length && (
        <div className="text-center text-secondary py-4">אין הוצאות עדיין</div>
      )}

      {/* Vacation summary rows */}
      {vacationRows && vacationRows.length > 0 && (
        <>
          <div className="tx-row" style={{ cursor: "default" }}>
            <div
              className="text-center small fw-bold text-secondary"
              style={{ flexBasis: "100%" }}
            >
              חופשות
            </div>
          </div>
          {vacationRows.map((vr) => (
            <div
              key={vr.vacationSheetTitle}
              className="tx-row tx-row-vacation"
              style={{ cursor: "default" }}
            >
              <div style={{ flex: COL.date }} />
              <div style={{ flex: COL.expense }}>
                <Link
                  href={`/vacation/${vr.vacationSheetId}`}
                  className="text-decoration-none fw-medium"
                >
                  {vr.vacationName}
                </Link>
              </div>
              <div style={{ flex: COL.amount }}>
                {formatCurrency(vr.amount)}
              </div>
              <div style={{ flex: COL.category }}>
                <span
                  className="badge rounded-pill"
                  style={{
                    backgroundColor: colorMap["חופשה"] || "#6c757d",
                  }}
                >
                  חופשה
                </span>
              </div>
              <div style={{ flex: COL.card }} />
            </div>
          ))}
        </>
      )}
    </div>
  );
}
