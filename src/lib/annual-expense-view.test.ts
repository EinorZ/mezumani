import assert from "node:assert/strict";
import test from "node:test";
import { buildAnnualExpenseView } from "./annual-expense-view";
import type { AnnualData } from "./types";

function makeData(): AnnualData {
  return {
    year: 2026,
    rows: [
      {
        category: "Groceries",
        months: [
          100,
          200,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
        ],
        average: 150,
        total: 300,
        percentage: 75,
      },
      {
        category: "Vacation",
        months: [
          100,
          0,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
        ],
        average: 50,
        total: 100,
        percentage: 25,
      },
    ],
    totals: {
      months: [
        200,
        200,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
      ],
      average: 200,
      total: 400,
    },
    totalIncome: 1_000,
    totalEsppIncome: 0,
    totalRsuIncome: 0,
    totalIncomeWithoutEquity: 1_000,
    totalSavings: 600,
    monthIncome: {},
    monthIncomeWithoutEquity: {},
    monthAllocations: {},
    monthSheetTitles: {},
  };
}

test("filters selected categories from annual expense totals and rows", () => {
  const result = buildAnnualExpenseView(makeData(), {
    view: "all",
    normalizedCategories: new Set(),
    filteredOutCategories: new Set(["Vacation"]),
  });

  assert.deepEqual(
    result.rows.map((row) => row.category),
    ["Groceries"],
  );
  assert.deepEqual(result.totals.months.slice(0, 3), [100, 200, null]);
  assert.equal(result.totals.total, 300);
  assert.equal(result.totals.average, 150);
  assert.equal(result.rows[0]?.percentage, 100);
});

test("filters categories before applying normalization", () => {
  const result = buildAnnualExpenseView(makeData(), {
    view: "normalized",
    normalizedCategories: new Set(["Vacation"]),
    filteredOutCategories: new Set(["Vacation"]),
  });

  assert.deepEqual(
    result.rows.map((row) => row.category),
    ["Groceries"],
  );
  assert.equal(result.totals.total, 300);
});
