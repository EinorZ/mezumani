"use client";

import { useRef, useState } from "react";
import * as XLSX from "xlsx";
import { addTransactionsBatch, revalidatePageAction } from "@/lib/actions";
import type {
  TransactionInput,
  RecurringExpense,
  CategoryMapping,
  ExpenseRenameRule,
} from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { SearchableSelect } from "@/components/searchable-select";
import { usePageConfig } from "@/contexts/page-config-context";

interface Props {
  sheetTitle: string;
  pagePath: string;
}

interface ParsedRow {
  date: string;
  expense: string;
  amount: number;
  originalExpense?: string;
  originalAmount?: number;
}

interface RecurringMatch {
  date: string;
  originalExpense: string;
  originalAmount: number;
  recurring: RecurringExpense;
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
    const chargeAmount = Math.round(parseFloat(String(row[7] ?? "0")) || 0);

    if (chargeAmount === 0) continue;

    let date = "";
    if (typeof rawDate === "number") {
      date = excelSerialToDate(rawDate);
    } else if (rawDate) {
      const parts = String(rawDate).split(/[/.\-]/);
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

export function ExcelImportButton({ sheetTitle, pagePath }: Props) {
  const {
    allCards: cards,
    cardColorMap,
    config: { categoryMappings, expenseRenameRules, recurringExpenses },
  } = usePageConfig();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [renamedRows, setRenamedRows] = useState<ParsedRow[] | null>(null);
  const [selectedCard, setSelectedCard] = useState("");
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successCount, setSuccessCount] = useState<number | null>(null);

  // Split rows into recurring matches and regular transactions
  const recurringMatches: RecurringMatch[] = [];
  let regularRows: ParsedRow[] = [];

  if (renamedRows && selectedCard) {
    for (const row of renamedRows) {
      const match = matchRecurringExpense(
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

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = ev.target?.result as ArrayBuffer;
        const rows = parseExcel(data);
        if (rows.length === 0) {
          setError("לא נמצאו עסקאות בקובץ");
          return;
        }
        const renamed = rows.map((row) => {
          const expense = applyRenameRules(row.expense, expenseRenameRules);
          return expense !== row.expense
            ? { ...row, expense, originalExpense: row.expense }
            : row;
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
      // Build transactions: recurring use the config values, regular use Excel values
      const transactions: TransactionInput[] = [];

      for (const m of recurringMatches) {
        transactions.push({
          date: m.date,
          expense: m.recurring.name,
          amount: m.originalAmount,
          category:
            m.recurring.category ||
            lookupCategory(m.recurring.name, categoryMappings),
          card: selectedCard,
          notes: "",
          updateExisting: true,
        });
      }

      for (const row of regularRows) {
        transactions.push({
          date: row.date,
          expense: row.expense,
          amount: row.amount,
          category: lookupCategory(row.expense, categoryMappings),
          card: selectedCard,
          notes: "",
        });
      }

      // Sort oldest first (by day.month) so rows appear chronologically in the sheet
      transactions.sort((a, b) => {
        const [dA, mA] = a.date.split(/[./]/).map(Number);
        const [dB, mB] = b.date.split(/[./]/).map(Number);
        return (mA || 0) - (mB || 0) || (dA || 0) - (dB || 0);
      });

      const count = await addTransactionsBatch(sheetTitle, transactions);
      setSuccessCount(count);
      setRenamedRows(null);
      revalidatePageAction(pagePath);
    } catch (err) {
      setError(err instanceof Error ? err.message : "שגיאה בייבוא");
    } finally {
      setImporting(false);
    }
  }

  function handleClose() {
    setRenamedRows(null);
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
                  onChange={setSelectedCard}
                  placeholder="בחר כרטיס..."
                />
              </div>
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
                  </tr>
                </thead>
                <tbody>
                  {regularRows.map((row, i) => (
                    <tr key={i}>
                      <td className="small">{row.date}</td>
                      <td className="small">
                        {row.originalExpense != null ? (
                          <span title={`שם מקורי: ${row.originalExpense}`}>
                            <s className="text-secondary me-1">
                              {row.originalExpense}
                            </s>
                            <span className="text-info fw-bold">
                              {row.expense}
                            </span>
                          </span>
                        ) : (
                          row.expense
                        )}
                      </td>
                      <td className="small">{formatCurrency(row.amount)}</td>
                    </tr>
                  ))}
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
