import type { RecurringExpense } from "./types";

export function matchRecurringExpense(
  expenseName: string,
  card: string,
  recurring: RecurringExpense[] | undefined,
): RecurringExpense | undefined {
  if (!recurring?.length || !expenseName.trim() || !card) return undefined;
  // Match recurring expenses assigned to this card OR with no card set (shared).
  const forCard = recurring.filter((r) => r.card === card || !r.card);
  const lower = expenseName.trim().toLowerCase();
  for (const r of forCard) {
    const keywords = r.keywords
      .split("|")
      .map((keyword) => keyword.trim().toLowerCase())
      .filter(Boolean);
    if (keywords.some((keyword) => lower.includes(keyword))) return r;
  }
  // Only configured keywords may match partially; expense names must match fully.
  return forCard.find((r) => r.name === expenseName.trim());
}
