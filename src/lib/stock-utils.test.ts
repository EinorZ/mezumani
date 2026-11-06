import assert from "node:assert/strict";
import test from "node:test";
import type { StockHolding, StockTransaction } from "./types";
import {
  computeHoldingYtdGain,
  computePeriodPerformance,
  computeTimeWeightedReturnSince,
  computeViewYtd,
  latestBoundaryPrice,
  stockTransactionFingerprint,
} from "./stock-utils";

function transaction(
  date: string,
  type: "קניה" | "מכירה",
  quantity: number,
  pricePerUnitILS: number,
  purchaseFee = 0,
): StockTransaction {
  return {
    row: 1,
    date,
    type,
    symbol: "TEST",
    quantity,
    pricePerUnitILS,
    currency: "ILS",
    term: "ארוך",
    bank: "",
    purchaseFee,
    notes: "",
  };
}

test("boundary prices reject a successful but truncated provider range", () => {
  const points = [
    { date: "2025-11-12", price: 343.8 },
    { date: "2025-12-31", price: 351.3 },
  ];

  assert.equal(
    latestBoundaryPrice(points.slice(0, 1), "2025-12-31", true),
    null,
  );
  assert.equal(latestBoundaryPrice(points, "2025-12-31", true), 351.3);
});

test("YTD gain uses January value for old shares and purchase cost for new shares", () => {
  const result = computeHoldingYtdGain({
    transactions: [
      transaction("01/06/25", "קניה", 10, 80),
      transaction("01/06/26", "קניה", 5, 110),
    ],
    currentPriceILS: 120,
    ytdStartPriceILS: 100,
    currentYear: 2026,
  });

  assert.deepEqual(result, {
    gainILS: 250,
    basisILS: 1550,
    percent: (250 / 1550) * 100,
  });
});

test("YTD gain includes realized proceeds from shares sold this year", () => {
  const result = computeHoldingYtdGain({
    transactions: [
      transaction("01/06/25", "קניה", 10, 80),
      transaction("01/03/26", "מכירה", 4, 115),
    ],
    currentPriceILS: 120,
    ytdStartPriceILS: 100,
    currentYear: 2026,
  });

  assert.equal(result?.gainILS, 180);
  assert.equal(result?.basisILS, 1000);
  assert.equal(result?.percent, 18);
});

test("YTD gain preserves profit from a position fully sold this year", () => {
  const result = computeHoldingYtdGain({
    transactions: [
      transaction("01/06/25", "קניה", 10, 80),
      transaction("01/03/26", "מכירה", 10, 115),
    ],
    currentPriceILS: 120,
    ytdStartPriceILS: 100,
    currentYear: 2026,
  });

  assert.equal(result?.gainILS, 150);
  assert.equal(result?.basisILS, 1000);
  assert.equal(result?.percent, 15);
});

test("a portfolio opened this year does not require a January price", () => {
  const result = computeHoldingYtdGain({
    transactions: [transaction("01/06/26", "קניה", 5, 110)],
    currentPriceILS: 120,
    ytdStartPriceILS: null,
    currentYear: 2026,
  });

  assert.equal(result?.gainILS, 50);
  assert.equal(result?.basisILS, 550);
});

test("an opening position requires a January price", () => {
  const result = computeHoldingYtdGain({
    transactions: [transaction("01/06/25", "קניה", 10, 80)],
    currentPriceILS: 120,
    ytdStartPriceILS: null,
    currentYear: 2026,
  });

  assert.equal(result, null);
});

test("view YTD sums gain and basis instead of weighting current value", () => {
  const holdings = [
    { ytdProfitLossILS: 200, ytdBasisILS: 1000 },
    { ytdProfitLossILS: 50, ytdBasisILS: 550 },
  ] as StockHolding[];

  const result = computeViewYtd(holdings);
  assert.equal(result.ytdProfitLossILS, 250);
  assert.equal(result.ytdDisplay, (250 / 1550) * 100);
});

test("view YTD never presents a partial return when one holding is incomplete", () => {
  const result = computeViewYtd([
    { ytdProfitLossILS: 200, ytdBasisILS: 1000 },
    { ytdProfitLossILS: null, ytdBasisILS: null },
  ] as StockHolding[]);

  assert.equal(result.ytdDisplay, null);
  assert.equal(result.ytdProfitLossILS, 0);
});

test("period performance uses opening value for old shares and cost for new purchases", () => {
  const result = computePeriodPerformance({
    label: "2026",
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    transactions: [
      transaction("01/06/25", "קניה", 10, 80),
      transaction("01/06/26", "קניה", 5, 110),
    ],
    openingPricesILS: new Map([["TEST", 100]]),
    closingPricesILS: new Map([["TEST", 120]]),
  });

  assert.equal(result.openingValueILS, 1000);
  assert.equal(result.purchasesILS, 550);
  assert.equal(result.closingValueILS, 1800);
  assert.equal(result.profitLossILS, 250);
  assert.equal(result.returnPercent, (250 / 1550) * 100);
});

test("period performance includes proceeds for positions sold during the period", () => {
  const result = computePeriodPerformance({
    label: "2026",
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    transactions: [
      transaction("01/06/25", "קניה", 10, 80),
      transaction("01/03/26", "מכירה", 10, 115),
    ],
    openingPricesILS: new Map([["TEST", 100]]),
    closingPricesILS: new Map(),
  });

  assert.equal(result.salesILS, 1150);
  assert.equal(result.closingValueILS, 0);
  assert.equal(result.profitLossILS, 150);
  assert.equal(result.returnPercent, 15);
});

test("period performance treats transaction fees as part of the net gain", () => {
  const result = computePeriodPerformance({
    label: "2026",
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    transactions: [
      transaction("01/06/26", "קניה", 10, 100, 5),
      transaction("01/09/26", "מכירה", 4, 120, 3),
    ],
    openingPricesILS: new Map(),
    closingPricesILS: new Map([["TEST", 110]]),
  });

  assert.equal(result.purchasesILS, 1005);
  assert.equal(result.salesILS, 477);
  assert.equal(result.closingValueILS, 660);
  assert.equal(result.profitLossILS, 132);
  assert.equal(result.returnPercent, (132 / 1005) * 100);
});

test("period performance fails explicitly when a required boundary price is missing", () => {
  const result = computePeriodPerformance({
    label: "2026",
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    transactions: [transaction("01/06/25", "קניה", 10, 80)],
    openingPricesILS: new Map(),
    closingPricesILS: new Map([["TEST", 120]]),
  });

  assert.equal(result.returnPercent, null);
  assert.deepEqual(result.missingSymbols, ["TEST"]);
});

test("annual transaction fingerprint changes when a late dated transaction is added", () => {
  const before = stockTransactionFingerprint(
    [transaction("01/06/25", "קניה", 10, 80)],
    "2025-12-31",
  );
  const after = stockTransactionFingerprint(
    [
      transaction("01/06/25", "קניה", 10, 80),
      transaction("20/12/25", "קניה", 2, 90),
    ],
    "2025-12-31",
  );

  assert.notEqual(before, after);
});

test("time-weighted return excludes contributions and withdrawals", () => {
  const result = computeTimeWeightedReturnSince(
    [
      { date: "2026-01-02", value: 1000, invested: 1000 },
      // A ₪400 sale/withdrawal is not a ₪400 investment loss.
      { date: "2026-01-03", value: 600, invested: 600 },
      { date: "2026-01-04", value: 660, invested: 600 },
    ],
    "2026-01-01",
  );

  assert.ok(result !== null);
  assert.ok(Math.abs(result - 10) < 0.000001);
});
