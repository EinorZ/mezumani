"use client";

import {
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
} from "@/lib/types";
import { usePageConfig } from "@/contexts/page-config-context";
import { useOptimisticTransactions } from "@/hooks/use-optimistic-transactions";
import { useSort } from "@/hooks/use-sort";
import { useTransactionFilters } from "@/hooks/use-transaction-filters";
import { useBulkSelection } from "@/hooks/use-bulk-selection";

interface Props {
  transactions: Transaction[];
  sheetTitle: string;
  pagePath: string;
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
  tentative: false,
};

type SortKey = "expense" | "date" | "amount" | "category" | "card";

function parseMonthFromTitle(title: string): number {
  const idx = HEBREW_MONTHS.findIndex((m) => title.startsWith(m));
  if (idx >= 0) return idx + 1;
  // Vacation sheets: default to previous month
  const prevMonth = new Date().getMonth(); // 0-indexed, so this is already "previous" (current - 1 + 1)
  return prevMonth || 12;
}

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

function compareTransactions(
  a: Transaction,
  b: Transaction,
  key: SortKey,
): number {
  switch (key) {
    case "amount":
      return a.amount - b.amount;
    case "date":
      return parseDate(a.date) - parseDate(b.date);
    case "expense":
      return a.expense.localeCompare(b.expense, "he");
    case "category":
      return a.category.localeCompare(b.category, "he");
    case "card":
      return a.card.localeCompare(b.card, "he");
    default:
      return 0;
  }
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

export function TransactionTable({
  transactions,
  sheetTitle,
  pagePath,
  isVacation,
  vacationRows,
}: Props) {
  const {
    allCards: cards,
    colorMap,
    cardColorMap,
    categoryNames: categories,
    config: { categoryMappings },
  } = usePageConfig();
  const sheetMonth = String(parseMonthFromTitle(sheetTitle));
  const defaultAddForm = { ...emptyForm, month: sheetMonth };

  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [addForm, setAddForm] = useState(defaultAddForm);
  const [editForm, setEditForm] = useState(emptyForm);
  const [error, setError] = useState<string | null>(null);

  // Ref for the edit row element to detect outside clicks
  const editRowRef = useRef<HTMLDivElement>(null);

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
  const bulkTentativeAction = isVacation
    ? bulkToggleVacationTentative
    : bulkToggleTentative;

  const optimistic = useOptimisticTransactions({
    transactions,
    sheetTitle,
    pagePath,
    addAction,
    editAction,
    deleteAction,
    onError: (msg) => setError(msg),
  });

  // Server rows (positive row numbers) — sorted; pendingAdds always appended last
  const serverRows = useMemo(
    () => optimistic.displayRows.filter((t) => t.row >= 0),
    [optimistic.displayRows],
  );
  const { sortedRows: sortedServerRows, toggleSort, sortIndicator } = useSort(
    serverRows,
    compareTransactions,
  );
  const sortedRows = useMemo(
    () => [...sortedServerRows, ...optimistic.pendingAdds],
    [sortedServerRows, optimistic.pendingAdds],
  );

  const {
    searchQuery,
    setSearchQuery,
    filterCategories,
    setFilterCategories,
    excludeCategories,
    setExcludeCategories,
    filterCards,
    setFilterCards,
    filteredRows,
    hasActiveFilters,
    clearFilters,
  } = useTransactionFilters(sortedRows);

  const {
    selectedRows,
    bulkCategory,
    setBulkCategory,
    bulkCard,
    setBulkCard,
    toggleRow,
    selectAll,
    clearSelection,
  } = useBulkSelection(filteredRows);

  // Derive unique categories and cards from current transactions for filter options
  const activeCategories = useMemo(() => {
    const set = new Set<string>();
    for (const t of sortedRows) if (t.category) set.add(t.category);
    return [...set].sort((a, b) => a.localeCompare(b, "he"));
  }, [sortedRows]);

  const activeCards = useMemo(() => {
    const set = new Set<string>();
    for (const t of sortedRows) if (t.card) set.add(t.card);
    return [...set].sort((a, b) => a.localeCompare(b, "he"));
  }, [sortedRows]);

  function handleAdd() {
    if (!addForm.expense.trim() && !addForm.amount.trim()) return;
    const date = buildDate(addForm.day, sheetMonth);
    const amount = parseFloat(addForm.amount) || 0;
    setAddForm(defaultAddForm);
    optimistic.handleAdd({
      date,
      expense: addForm.expense,
      amount,
      category: addForm.category,
      card: addForm.card,
      notes: addForm.notes,
      tentative: addForm.tentative,
    });
  }

  function handleEdit(row: number) {
    const date = buildDate(editForm.day, sheetMonth);
    const amount = parseFloat(editForm.amount) || 0;
    setEditingRow(null);
    optimistic.handleEdit(row, {
      date,
      expense: editForm.expense,
      amount,
      category: editForm.category,
      card: editForm.card,
      notes: editForm.notes,
      tentative: editForm.tentative,
    });
  }

  function handleDelete(row: number) {
    optimistic.handleDelete(row);
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

    optimistic.applyBulkEdits(updates, filteredRows);
    clearSelection();

    optimistic.inflightRef.current++;
    bulkEditAction(sheetTitle, updates)
      .then(optimistic.onInflightDone)
      .catch((e) => {
        optimistic.onInflightDone();
        optimistic.revertBulkEdits(updates.map((u) => u.row));
        setError(e instanceof Error ? e.message : "שגיאה בעריכה מרובה");
      });
  }

  function handleBulkDelete() {
    if (selectedRows.size === 0) return;

    const rows = [...selectedRows];

    optimistic.applyBulkDeletes(rows);
    clearSelection();

    optimistic.inflightRef.current++;
    bulkDeleteAction(sheetTitle, rows)
      .then(optimistic.onInflightDone)
      .catch((e) => {
        optimistic.onInflightDone();
        optimistic.revertBulkDeletes(rows);
        setError(e instanceof Error ? e.message : "שגיאה במחיקה מרובה");
      });
  }

  function handleBulkTentative(tentative: boolean) {
    if (selectedRows.size === 0) return;

    const rows = [...selectedRows];

    optimistic.applyBulkTentative(rows, tentative, filteredRows);
    clearSelection();

    optimistic.inflightRef.current++;
    bulkTentativeAction(sheetTitle, rows, tentative)
      .then(optimistic.onInflightDone)
      .catch((e) => {
        optimistic.onInflightDone();
        optimistic.revertBulkEdits(rows);
        setError(e instanceof Error ? e.message : "שגיאה בעדכון משוער");
      });
  }

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
        optimistic.handleUndo();
        return;
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        if (editingRowRef.current !== null) {
          handleEditRef.current(editingRowRef.current);
        } else {
          handleAddRef.current();
        }
        optimistic.flushRevalidate();
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
  }, [optimistic.handleUndo, selectedRows.size]);

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
            onClick={clearFilters}
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
              filteredRows.filter((t) => t.row >= 0).length > 0 &&
              filteredRows
                .filter((t) => t.row >= 0)
                .every((t) => selectedRows.has(t.row))
            }
            onChange={() => selectAll(filteredRows)}
            title="בחר הכל"
          />
        </div>
        <div
          className="tx-header-col"
          style={{ flex: COL.date }}
          onClick={() => toggleSort("date")}
        >
          תאריך
          <span className="small text-secondary">{sortIndicator("date")}</span>
        </div>
        <div
          className="tx-header-col"
          style={{ flex: COL.expense }}
          onClick={() => toggleSort("expense")}
        >
          תיאור
          <span className="small text-secondary">
            {sortIndicator("expense")}
          </span>
        </div>
        <div
          className="tx-header-col"
          style={{ flex: COL.amount }}
          onClick={() => toggleSort("amount")}
        >
          סכום
          <span className="small text-secondary">
            {sortIndicator("amount")}
          </span>
        </div>
        <div
          className="tx-header-col"
          style={{ flex: COL.category }}
          onClick={() => toggleSort("category")}
        >
          קטגוריה
          <span className="small text-secondary">
            {sortIndicator("category")}
          </span>
        </div>
        <div
          className="tx-header-col"
          style={{ flex: COL.card }}
          onClick={() => toggleSort("card")}
        >
          אמצעי תשלום
          <span className="small text-secondary">{sortIndicator("card")}</span>
        </div>
      </div>

      {/* Add row */}
      {renderInputRow("add", addForm, setAddForm, handleAdd, "הוסף")}

      {/* Transaction rows */}
      {filteredRows.map((t) =>
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
                    toggleRow(t.row, e.shiftKey);
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

      {filteredRows.length === 0 && (
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
