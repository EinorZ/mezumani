"use client";

import { useRef, useState } from "react";
import * as XLSX from "xlsx";
import { addTransactionsBatch, revalidatePageAction } from "@/lib/actions";
import type {
  TransactionInput,
  RecurringExpense,
  CategoryMapping,
  ExpenseRenameRule,
  SheetInfo,
} from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { SearchableSelect } from "@/components/searchable-select";
import { usePageConfig } from "@/contexts/page-config-context";
import { detectCardFromFileName } from "@/lib/card-import";
import { isCalCreditHeader, parseCalCreditRows } from "@/lib/excel-import";

interface Props {
  sheetTitle: string;
  pagePath: string;
  vacationSheets?: SheetInfo[];
}

interface ParsedRow {
  id?: number; // assigned after parsing in handleFileSelect
  date: string;
  expense: string;
  amount: number;
  originalExpense?: string;
  originalAmount?: number;
  vacationSheet?: string; // title of destination vacation sheet, if any
  skipRecurring?: boolean; // exclude from recurring matching
}

interface RecurringMatch {
  date: string;
  originalExpense: string;
  originalAmount: number;
  recurring: RecurringExpense;
  _row: ParsedRow;
}

const CREDIT_HEADER_MARKER = "תאריך רכישה";
const CIBUS_HEADER_MARKER = "שם בית העסק";

function parseExcel(data: ArrayBuffer): ParsedRow[] {
  const workbook = XLSX.read(data, { type: "array" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows: unknown[][] = XLSX.utils.sheet_to_json(sheet, {
    header: 1,
    defval: "",
  });

  // Auto-detect format
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    if (isCalCreditHeader(row)) {
      return parseCalCreditRows(rows, i);
    }
    if (row.some((cell) => String(cell).includes(CIBUS_HEADER_MARKER))) {
      return parseCibusRows(rows, i);
    }
    if (row.some((cell) => String(cell).includes(CREDIT_HEADER_MARKER))) {
      return parseCreditRows(rows, i);
    }
  }
  throw new Error("לא נמצאה שורת כותרת בקובץ");
}

function parseCreditRows(rows: unknown[][], headerIdx: number): ParsedRow[] {
  const results: ParsedRow[] = [];
  for (let i = headerIdx + 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.length === 0) continue;

    const rawDate = String(row[0] ?? "").trim();
    const expense = String(row[1] ?? "").trim();
    const chargeAmount = Math.round(parseFloat(String(row[4] ?? "0")) || 0);

    if (chargeAmount === 0) continue;
    if (!rawDate && !expense) continue;
    if (expense.includes('סה"כ')) continue;

    let date = "";
    if (rawDate) {
      const parts = rawDate.split(/[/.\-]/);
      if (parts.length >= 2) {
        const day = parts[0].padStart(2, "0");
        const month = parts[1].padStart(2, "0");
        date = `${day}.${month}`;
      }
    }

    results.push({ date, expense, amount: chargeAmount });
  }
  return results;
}

/** Convert Excel serial date number to DD.MM string */
function excelSerialToDate(serial: number): string {
  // Excel epoch: 1899-12-30
  const epoch = new Date(1899, 11, 30);
  const d = new Date(epoch.getTime() + serial * 86400000);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  return `${day}.${month}`;
}

function parseCibusRows(rows: unknown[][], headerIdx: number): ParsedRow[] {
  const results: ParsedRow[] = [];
  for (let i = headerIdx + 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.length === 0) continue;

    const expense = String(row[0] ?? "").trim();
    if (!expense || expense.includes("סה''כ") || expense.includes('סה"כ'))
      continue;

    const rawDate = row[1];
    // Try col 8 (הסכום שחוייב) first, fall back to col 7 for older formats
    const chargeAmount = Math.round(
      parseFloat(String(row[8] ?? "0")) ||
      parseFloat(String(row[7] ?? "0")) || 0
    );

    if (chargeAmount === 0) continue;

    let date = "";
    if (typeof rawDate === "number") {
      date = excelSerialToDate(rawDate);
    } else if (rawDate) {
      const rawStr = String(rawDate).split(" ")[0]; // strip time part e.g. "2026-04-30 00:00"
      const parts = rawStr.split(/[/.\-]/);
      if (parts.length >= 3 && parts[0].length === 4) {
        // ISO format: YYYY-MM-DD
        const day = parts[2].padStart(2, "0");
        const month = parts[1].padStart(2, "0");
        date = `${day}.${month}`;
      } else if (parts.length >= 2) {
        // DD.MM or DD/MM
        const day = parts[0].padStart(2, "0");
        const month = parts[1].padStart(2, "0");
        date = `${day}.${month}`;
      }
    }

    results.push({ date, expense, amount: chargeAmount });
  }
  return results;
}

function lookupCategory(
  expenseName: string,
  mappings: CategoryMapping[] | undefined,
): string {
  if (!mappings?.length || !expenseName.trim()) return "";
  const trimmed = expenseName.trim().toLowerCase();
  for (const m of mappings) {
    const names = m.expenseName
      .split(",")
      .map((n) => n.trim().toLowerCase())
      .filter(Boolean);
    for (const name of names) {
      if (name === trimmed || trimmed.includes(name)) return m.category;
    }
  }
  return "";
}

function applyRenameRules(
  expense: string,
  rules: ExpenseRenameRule[] | undefined,
): string {
  if (!rules?.length || !expense.trim()) return expense;
  const lower = expense.trim().toLowerCase();
  for (const rule of rules) {
    const keywords = rule.keywords
      .split("|")
      .map((k) => k.trim().toLowerCase())
      .filter(Boolean);
    if (keywords.some((kw) => lower.includes(kw))) {
      return rule.targetName;
    }
  }
  return expense;
}

function matchRecurringExpense(
  expenseName: string,
  card: string,
  recurring: RecurringExpense[] | undefined,
): RecurringExpense | undefined {
  if (!recurring?.length || !expenseName.trim() || !card) return undefined;
  // Match recurring expenses assigned to this card OR with no card set (shared)
  const forCard = recurring.filter((r) => r.card === card || !r.card);
  if (!forCard.length) return undefined;
  const lower = expenseName.trim().toLowerCase();
  for (const r of forCard) {
    if (!r.keywords) continue;
    const kws = r.keywords
      .split("|")
      .map((k) => k.trim().toLowerCase())
      .filter(Boolean);
    if (kws.some((kw) => lower.includes(kw))) return r;
  }
  return (
    forCard.find((r) => r.name === expenseName.trim()) ??
    forCard.find((r) => lower.includes(r.name.toLowerCase()))
  );
}

export function ExcelImportButton({ sheetTitle, pagePath, vacationSheets }: Props) {
  const {
    allCards: cards,
    cardColorMap,
    config: {
      categoryMappings,
      expenseRenameRules,
      recurringExpenses,
      cardLastFourMappings,
    },
  } = usePageConfig();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [renamedRows, setRenamedRows] = useState<ParsedRow[] | null>(null);
  const [selectedCard, setSelectedCard] = useState("");
  const [detectedCard, setDetectedCard] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successCount, setSuccessCount] = useState<number | null>(null);

  // Split rows into recurring matches and regular transactions
  const recurringMatches: RecurringMatch[] = [];
  let regularRows: ParsedRow[] = [];

  if (renamedRows && selectedCard) {
    for (const row of renamedRows) {
      const match = !row.skipRecurring && matchRecurringExpense(
        row.expense,
        selectedCard,
        recurringExpenses,
      );
      if (match) {
        recurringMatches.push({
          date: row.date,
          originalExpense: row.expense,
          originalAmount: row.amount,
          recurring: match,
          _row: row,
        });
      } else {
        // Apply rename display for regular rows
        regularRows.push(row);
      }
    }
  } else if (renamedRows) {
    regularRows = renamedRows;
  }

  // Sort preview rows oldest first (by day.month)
  const dateSortKey = (d: string) => {
    const [day, month] = d.split(/[./]/).map(Number);
    return (month || 0) * 100 + (day || 0);
  };
  regularRows.sort((a, b) => dateSortKey(a.date) - dateSortKey(b.date));
  recurringMatches.sort((a, b) => dateSortKey(a.date) - dateSortKey(b.date));

  const allRows = renamedRows ?? [];
  const regularTotal = regularRows.reduce((sum, r) => sum + r.amount, 0);
  const recurringTotal = recurringMatches.reduce(
    (sum, m) => sum + m.originalAmount,
    0,
  );
  const grandTotal = regularTotal + recurringTotal;

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setSuccessCount(null);
    const detected = detectCardFromFileName(
      file.name,
      cardLastFourMappings,
      cards,
    );
    setSelectedCard(detected ?? "");
    setDetectedCard(detected);

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = ev.target?.result as ArrayBuffer;
        const rows = parseExcel(data);
        if (rows.length === 0) {
          setError("לא נמצאו עסקאות בקובץ");
          return;
        }
        const renamed = rows.map((row, i) => {
          const expense = applyRenameRules(row.expense, expenseRenameRules);
          return expense !== row.expense
            ? { ...row, id: i, expense, originalExpense: row.expense }
            : { ...row, id: i };
        });
        setRenamedRows(renamed);
      } catch (err) {
        setError(err instanceof Error ? err.message : "שגיאה בקריאת הקובץ");
      }
    };
    reader.readAsArrayBuffer(file);
    e.target.value = "";
  }

  async function handleImport() {
    if (!allRows.length || !selectedCard) return;
    setImporting(true);
    setError(null);

    try {
      const dateSortKey = (d: string) => {
        const [day, month] = d.split(/[./]/).map(Number);
        return (month || 0) * 100 + (day || 0);
      };

      // Recurring matches always go to the month sheet
      const monthTransactions: TransactionInput[] = recurringMatches.map((m) => ({
        date: m.date,
        expense: m.recurring.name,
        amount: m.originalAmount,
        category: m.recurring.category || lookupCategory(m.recurring.name, categoryMappings),
        card: selectedCard,
        notes: "",
        updateExisting: true,
      }));

      // Regular rows: split by destination
      const vacationGroups = new Map<string, TransactionInput[]>();
      for (const row of regularRows) {
        const tx: TransactionInput = {
          date: row.date,
          expense: row.expense,
          amount: row.amount,
          category: lookupCategory(row.expense, categoryMappings),
          card: selectedCard,
          notes: "",
        };
        if (row.vacationSheet) {
          if (!vacationGroups.has(row.vacationSheet)) vacationGroups.set(row.vacationSheet, []);
          vacationGroups.get(row.vacationSheet)!.push(tx);
        } else {
          monthTransactions.push(tx);
        }
      }

      monthTransactions.sort((a, b) => dateSortKey(a.date) - dateSortKey(b.date));

      let count = 0;
      if (monthTransactions.length > 0) {
        count += await addTransactionsBatch(sheetTitle, monthTransactions);
      }
      for (const [vacTitle, vacTxs] of vacationGroups) {
        vacTxs.sort((a, b) => dateSortKey(a.date) - dateSortKey(b.date));
        count += await addTransactionsBatch(vacTitle, vacTxs, true);
        const vs = vacationSheets?.find((s) => s.title === vacTitle);
        if (vs) revalidatePageAction(`/vacation/${vs.sheetId}`);
      }

      setSuccessCount(count);
      setRenamedRows(null);
      revalidatePageAction(pagePath);
    } catch (err) {
      setError(err instanceof Error ? err.message : "שגיאה בייבוא");
    } finally {
      setImporting(false);
    }
  }

  function handleDeleteRow(id: number | undefined) {
    setRenamedRows((prev) => prev?.filter((r) => r.id !== id) ?? null);
  }

  function handleUndoRecurring(id: number | undefined) {
    setRenamedRows((prev) =>
      prev?.map((r) => (r.id !== id ? r : { ...r, skipRecurring: true })) ?? null
    );
  }

  function handleUndoRename(id: number | undefined) {
    setRenamedRows((prev) =>
      prev?.map((r) => {
        if (r.id !== id || !r.originalExpense) return r;
        return { ...r, expense: r.originalExpense, originalExpense: undefined };
      }) ?? null
    );
  }

  function handleSetVacation(id: number | undefined, vacationTitle: string | undefined) {
    setRenamedRows((prev) =>
      prev?.map((r) => (r.id !== id ? r : { ...r, vacationSheet: vacationTitle })) ?? null
    );
  }

  function handleRenameRow(id: number | undefined, newExpense: string) {
    setRenamedRows((prev) =>
      prev?.map((r) => {
        if (r.id !== id) return r;
        const orig = r.originalExpense ?? r.expense;
        return { ...r, expense: newExpense, originalExpense: orig };
      }) ?? null
    );
  }

  function handleClose() {
    setRenamedRows(null);
    setDetectedCard(null);
    setError(null);
    setSuccessCount(null);
  }

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls"
        style={{ display: "none" }}
        onChange={handleFileSelect}
      />
      <button
        className="btn btn-sm btn-outline-success"
        onClick={() => fileInputRef.current?.click()}
        title="ייבוא מאקסל"
      >
        ייבוא אקסל
      </button>

      {successCount !== null && (
        <div className="text-success small mt-1">
          {successCount} הוצאות יובאו בהצלחה
        </div>
      )}

      {error && !renamedRows && (
        <div className="text-danger small mt-1">{error}</div>
      )}

      {/* Preview modal */}
      {renamedRows && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) handleClose();
          }}
        >
          <div
            className="card rounded-3 border p-4"
            style={{
              maxWidth: 700,
              width: "95%",
              maxHeight: "85vh",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0 fw-bold">ייבוא הוצאות מאקסל</h5>
              <button
                className="btn btn-sm btn-link text-secondary"
                onClick={handleClose}
              >
                &#10005;
              </button>
            </div>

            {error && (
              <div className="alert alert-danger py-2 small mb-3">{error}</div>
            )}

            {/* Card selector */}
            <div className="mb-3 d-flex align-items-center gap-2">
              <label className="form-label mb-0 small fw-bold">כרטיס:</label>
              <div style={{ maxWidth: 200 }}>
                <SearchableSelect
                  options={cards}
                  colorMap={cardColorMap}
                  value={selectedCard}
                  onChange={(value) => {
                    setSelectedCard(value);
                    if (value !== detectedCard) setDetectedCard(null);
                  }}
                  placeholder="בחר כרטיס..."
                />
              </div>
              {detectedCard && selectedCard === detectedCard && (
                <span className="small text-success">זוהה אוטומטית משם הקובץ</span>
              )}
            </div>

            {/* Summary */}
            <div className="small text-secondary mb-2">
              {allRows.length} הוצאות | סה&quot;כ: {formatCurrency(grandTotal)}
              {recurringMatches.length > 0 && (
                <span className="me-2">
                  {" "}
                  ({recurringMatches.length} הוצאות קבועות)
                </span>
              )}
            </div>

            <div style={{ overflowY: "auto", flex: 1 }}>
              {/* Recurring expenses section */}
              {recurringMatches.length > 0 && (
                <div className="mb-3">
                  <div
                    className="small fw-bold mb-1"
                    style={{ color: "#198754" }}
                  >
                    הוצאות קבועות ({recurringMatches.length})
                  </div>
                  <table className="table table-sm mb-0">
                    <thead>
                      <tr>
                        <th className="small text-secondary">תאריך</th>
                        <th className="small text-secondary">הוצאה</th>
                        <th className="small text-secondary">סכום</th>
                        <th />
                      </tr>
                    </thead>
                    <tbody>
                      {recurringMatches.map((m, i) => {
                        const amountChanged =
                          m.originalAmount !== m.recurring.amount;
                        const bg = amountChanged ? "#f8d7da" : "#d1e7dd";
                        return (
                          <tr key={i}>
                            <td
                              className="small"
                              style={{ backgroundColor: bg }}
                            >
                              {m.date}
                            </td>
                            <td
                              className="small"
                              style={{ backgroundColor: bg }}
                            >
                              <s className="text-secondary me-1">
                                {m.originalExpense}
                              </s>
                              <span className="fw-bold">
                                {m.recurring.name}
                              </span>
                            </td>
                            <td
                              className="small"
                              style={{ backgroundColor: bg }}
                            >
                              {amountChanged && (
                                <s className="text-secondary me-1">
                                  {formatCurrency(m.recurring.amount)}
                                </s>
                              )}
                              <span
                                className="fw-bold"
                                style={{
                                  color: amountChanged ? "#dc3545" : "#198754",
                                }}
                              >
                                {formatCurrency(m.originalAmount)}
                              </span>
                            </td>
                            <td className="small" style={{ backgroundColor: bg, whiteSpace: "nowrap" }}>
                              <button
                                className="btn btn-sm p-0 text-secondary opacity-75 me-1"
                                style={{ lineHeight: 1 }}
                                onClick={() => handleUndoRecurring(m._row.id)}
                                title="בטל התאמה לקבועה"
                              >
                                ↩
                              </button>
                              <button
                                className="btn btn-sm p-0 text-danger opacity-50"
                                style={{ lineHeight: 1 }}
                                onClick={() => handleDeleteRow(m._row.id)}
                                title="הסר"
                              >
                                &#10005;
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Regular transactions */}
              <table className="table table-sm table-hover mb-0">
                <thead>
                  <tr>
                    <th className="small text-secondary">תאריך</th>
                    <th className="small text-secondary">הוצאה</th>
                    <th className="small text-secondary">סכום</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {regularRows.map((row, i) => {
                    const renamed = row.originalExpense != null && row.originalExpense !== row.expense;
                    return (
                      <tr key={row.id ?? i}>
                        <td className="small">{row.date}</td>
                        <td className="small" style={{ minWidth: 120 }}>
                          <input
                            type="text"
                            value={row.expense}
                            onChange={(e) => handleRenameRow(row.id, e.target.value)}
                            style={{
                              border: "none",
                              background: "transparent",
                              outline: "none",
                              boxShadow: "none",
                              padding: 0,
                              width: "100%",
                              fontWeight: renamed ? "bold" : "normal",
                              color: renamed ? "#0dcaf0" : "inherit",
                            }}
                            title={row.originalExpense ? `שם מקורי: ${row.originalExpense}` : undefined}
                          />
                          {renamed && (
                            <div style={{ fontSize: "0.8em" }}>
                              <s className="text-secondary">{row.originalExpense}</s>
                              <button
                                className="btn btn-sm p-0 text-secondary opacity-75 ms-1"
                                style={{ lineHeight: 1, fontSize: "inherit" }}
                                onClick={() => handleUndoRename(row.id)}
                                title="בטל שינוי שם"
                              >
                                ↩
                              </button>
                            </div>
                          )}
                        </td>
                        <td className="small">{formatCurrency(row.amount)}</td>
                        <td className="small" style={{ whiteSpace: "nowrap" }}>
                          {vacationSheets && vacationSheets.length > 0 && (
                            <select
                              value={row.vacationSheet ?? ""}
                              onChange={(e) => handleSetVacation(row.id, e.target.value || undefined)}
                              className="me-1"
                              style={{
                                fontSize: "0.7em",
                                border: `1px solid ${row.vacationSheet ? "#0dcaf0" : "#dee2e6"}`,
                                borderRadius: 4,
                                padding: "1px 2px",
                                background: "transparent",
                                color: row.vacationSheet ? "#0dcaf0" : "#6c757d",
                                maxWidth: 90,
                                cursor: "pointer",
                              }}
                              title="יעד ייבוא"
                            >
                              <option value="">✈ חודש</option>
                              {vacationSheets.map((vs) => (
                                <option key={vs.sheetId} value={vs.title}>{vs.title}</option>
                              ))}
                            </select>
                          )}
                          <button
                            className="btn btn-sm p-0 text-danger opacity-50"
                            style={{ lineHeight: 1 }}
                            onClick={() => handleDeleteRow(row.id)}
                            title="הסר"
                          >
                            &#10005;
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Actions */}
            <div className="d-flex gap-2 mt-3 justify-content-end">
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={handleClose}
                disabled={importing}
              >
                ביטול
              </button>
              <button
                className="btn btn-sm btn-success"
                onClick={handleImport}
                disabled={importing || !selectedCard}
              >
                {importing ? "מייבא..." : "ייבוא"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
