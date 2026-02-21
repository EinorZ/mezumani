import { MATURATION_MONTHS } from "./israeli-tax-config";

/**
 * Parse a date string in DD/MM/YY or DD/MM/YYYY format.
 * Returns null if the string is invalid.
 */
export function parseSheetDate(dateStr: string): Date | null {
  if (!dateStr) return null;
  const parts = dateStr.split("/");
  if (parts.length < 3) return null;
  let year = parseInt(parts[2], 10);
  if (year < 100) year += 2000;
  return new Date(year, parseInt(parts[1], 10) - 1, parseInt(parts[0], 10));
}

/**
 * Return true if the vest/grant date is in the future.
 */
export function isFutureDate(dateStr: string): boolean {
  const d = parseSheetDate(dateStr);
  if (!d) return false;
  return d > new Date();
}

/**
 * Return the maturation date for a given grant date string.
 * Maturation = grant date + MATURATION_MONTHS.
 */
export function getMaturationDate(grantDate: string): Date | null {
  const d = parseSheetDate(grantDate);
  if (!d) return null;
  const mat = new Date(d);
  mat.setMonth(mat.getMonth() + MATURATION_MONTHS);
  return mat;
}

/**
 * Return true if the grant has passed its maturation period.
 */
export function isMatured(grantDate: string): boolean {
  const matDate = getMaturationDate(grantDate);
  if (!matDate) return false;
  return new Date() >= matDate;
}

/**
 * Return true if the vest date is within the next month.
 */
export function isVestComingSoon(vestDate: string): boolean {
  const d = parseSheetDate(vestDate);
  if (!d) return false;
  const now = new Date();
  const oneMonthFromNow = new Date(now);
  oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);
  return d > now && d <= oneMonthFromNow;
}

/**
 * Format a Date to the DD/MM/YY sheet format.
 */
export function formatSheetDate(d: Date): string {
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear() % 100}`;
}

/**
 * Convert an ISO date string (YYYY-MM-DD) to the DD/MM/YY sheet format.
 */
export function toSheetDate(isoDate: string): string {
  const [y, m, d] = isoDate.split("-");
  return `${d}/${m}/${y.slice(2)}`;
}

/**
 * Convert a DD/MM/YY sheet date string to ISO (YYYY-MM-DD).
 */
export function fromSheetDate(sheetDate: string): string {
  if (!sheetDate) return "";
  const parts = sheetDate.split("/");
  if (parts.length < 3) return "";
  const d = parts[0].padStart(2, "0");
  const m = parts[1].padStart(2, "0");
  let y = parts[2];
  if (y.length === 2) y = "20" + y;
  return `${y}-${m}-${d}`;
}
