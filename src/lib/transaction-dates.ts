import { HEBREW_MONTHS } from "./constants";

/** Make a payment's year explicit before it leaves its original month sheet. */
export function withTransactionYear(
  date: string,
  fallbackYear: number,
): string {
  const match = date
    .trim()
    .match(/^(\d{1,2})[/.](\d{1,2})(?:[/.](\d{2}|\d{4}))?$/);
  if (!match) return date;
  const year = match[3] ? Number(match[3]) : fallbackYear;
  const fullYear = year < 100 ? 2000 + year : year;
  return `${match[1]}/${match[2]}/${fullYear}`;
}

/** Legacy yearless dates retain their current-year interpretation. */
export function extractMonthFromDate(
  date: string,
  fallbackYear = new Date().getFullYear(),
): string | null {
  const normalized = withTransactionYear(date, fallbackYear);
  const match = normalized.match(/^\d{1,2}\/(\d{1,2})\/(\d{4})$/);
  if (!match) return null;
  const month = Number(match[1]);
  if (month < 1 || month > 12) return null;
  return `${HEBREW_MONTHS[month - 1]} ${Number(match[2]) % 100}`;
}
