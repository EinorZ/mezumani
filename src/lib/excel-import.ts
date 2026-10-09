export interface BasicImportedRow {
  date: string;
  expense: string;
  amount: number;
}

function normalizeHeader(value: unknown): string {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .trim();
}

function excelSerialToDate(serial: number): string {
  const epoch = new Date(1899, 11, 30);
  const date = new Date(epoch.getTime() + serial * 86_400_000);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${day}.${month}`;
}

function formatImportedDate(rawDate: unknown): string {
  if (typeof rawDate === "number") return excelSerialToDate(rawDate);
  if (rawDate instanceof Date) {
    const day = String(rawDate.getDate()).padStart(2, "0");
    const month = String(rawDate.getMonth() + 1).padStart(2, "0");
    return `${day}.${month}`;
  }
  if (!rawDate) return "";

  const raw = String(rawDate).trim().split(" ")[0];
  const parts = raw.split(/[/.-]/);
  if (parts.length >= 3 && parts[0].length === 4) {
    return `${parts[2].padStart(2, "0")}.${parts[1].padStart(2, "0")}`;
  }
  if (parts.length >= 2) {
    return `${parts[0].padStart(2, "0")}.${parts[1].padStart(2, "0")}`;
  }
  return "";
}

function parseAmount(value: unknown): number {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  return Number.parseFloat(String(value ?? "").replace(/[,₪\s]/g, "")) || 0;
}

export function isCalCreditHeader(row: unknown[]): boolean {
  const headers = row.map(normalizeHeader);
  return headers.includes("תאריך עסקה") && headers.includes("שם בית עסק");
}

/** Parse CAL/Visa exports whose columns are identified by their Hebrew labels. */
export function parseCalCreditRows(
  rows: unknown[][],
  headerIdx: number,
): BasicImportedRow[] {
  const headers = rows[headerIdx].map(normalizeHeader);
  const dateIdx = headers.indexOf("תאריך עסקה");
  const expenseIdx = headers.indexOf("שם בית עסק");
  const transactionAmountIdx = headers.indexOf("סכום עסקה");
  const chargeAmountIdx = headers.indexOf("סכום חיוב");

  if (dateIdx < 0 || expenseIdx < 0 || transactionAmountIdx < 0) return [];

  const results: BasicImportedRow[] = [];
  for (let i = headerIdx + 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row?.length) continue;

    const expense = String(row[expenseIdx] ?? "").trim();
    if (!expense) continue;

    const chargedAmount =
      chargeAmountIdx >= 0 ? parseAmount(row[chargeAmountIdx]) : 0;
    const transactionAmount = parseAmount(row[transactionAmountIdx]);
    const amount = Math.round(chargedAmount || transactionAmount);
    if (amount === 0) continue;

    results.push({
      date: formatImportedDate(row[dateIdx]),
      expense,
      amount,
    });
  }
  return results;
}
