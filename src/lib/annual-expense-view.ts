import type { AnnualData } from "./types";

export type AnnualExpenseView = "all" | "normalized";

interface AnnualExpenseViewOptions {
  view: AnnualExpenseView;
  normalizedCategories: ReadonlySet<string>;
  filteredOutCategories: ReadonlySet<string>;
}

export function buildAnnualExpenseView(
  data: AnnualData,
  {
    view,
    normalizedCategories,
    filteredOutCategories,
  }: AnnualExpenseViewOptions,
): AnnualData {
  const completedMonths = data.totals.months
    .map((amount, monthIndex) => (amount !== null ? monthIndex : null))
    .filter((monthIndex): monthIndex is number => monthIndex !== null);

  const visibleRows = data.rows
    .filter((row) => row.category && !filteredOutCategories.has(row.category))
    .map((row) => {
      if (
        view !== "normalized" ||
        !normalizedCategories.has(row.category) ||
        completedMonths.length === 0
      ) {
        return row;
      }

      const monthlyAverage = (row.total ?? 0) / completedMonths.length;
      return {
        ...row,
        months: data.totals.months.map((amount) =>
          amount !== null ? monthlyAverage : null,
        ),
        average: monthlyAverage,
      };
    });

  const grandTotal = visibleRows.reduce(
    (sum, row) => sum + (row.total ?? 0),
    0,
  );
  const rows = visibleRows.map((row) => ({
    ...row,
    percentage:
      grandTotal > 0 && row.total ? (row.total / grandTotal) * 100 : null,
  }));
  const months = Array.from({ length: 12 }, (_, monthIndex) => {
    const sum = visibleRows.reduce(
      (total, row) => total + (row.months[monthIndex] ?? 0),
      0,
    );
    return sum || null;
  });
  const completedMonthTotals = months.filter(
    (amount): amount is number => amount !== null,
  );
  const total = completedMonthTotals.reduce((sum, amount) => sum + amount, 0);

  return {
    ...data,
    rows,
    totals: {
      months,
      average:
        completedMonthTotals.length > 0
          ? total / completedMonthTotals.length
          : null,
      total: total || null,
    },
  };
}
