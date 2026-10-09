import assert from "node:assert/strict";
import test from "node:test";
import {
  calculateLimitDiscountPercent,
  calculateLimitPrice,
  calculateRebalance,
  computeRebalanceTableRows,
} from "./rebalance-calculator";

test("converts between a discount percent and a limit price", () => {
  assert.equal(calculateLimitPrice(29_750, 2), 29_155);
  assert.equal(calculateLimitDiscountPercent(29_750, 29_155), 2);
});

test("returns zero for a missing current market price", () => {
  assert.equal(calculateLimitPrice(0, 2), 0);
  assert.equal(calculateLimitDiscountPercent(0, 100), 0);
});

test("directs new investment to the underweight allocation", () => {
  const result = calculateRebalance({
    currentValueByLabel: { Equity: 80, Bonds: 20 },
    targetAllocations: [
      { label: "Equity", targetPercent: 50 },
      { label: "Bonds", targetPercent: 50 },
    ],
    newInvestment: 60,
  });

  assert.equal(
    result.find((item) => item.label === "Equity")?.recommendedAmount,
    0,
  );
  assert.equal(
    result.find((item) => item.label === "Bonds")?.recommendedAmount,
    60,
  );
  assert.equal(
    result.reduce((sum, item) => sum + item.recommendedAmount, 0),
    60,
  );
  assert.equal(
    result.find((item) => item.label === "Equity")?.projectedPercent,
    50,
  );
  assert.equal(
    result.find((item) => item.label === "Bonds")?.projectedPercent,
    50,
  );
});

test("returns safe zero projections when there is no portfolio value", () => {
  const result = calculateRebalance({
    currentValueByLabel: {},
    targetAllocations: [{ label: "Equity", targetPercent: 100 }],
    newInvestment: 0,
  });

  assert.deepEqual(result, [
    {
      label: "Equity",
      currentValue: 0,
      currentPercent: 0,
      recommendedAmount: 0,
      projectedValue: 0,
      projectedPercent: 0,
      targetPercent: 100,
    },
  ]);
});

test("respects manual share counts and reports the actual total cost", () => {
  const recommendations = calculateRebalance({
    currentValueByLabel: { Equity: 1_000 },
    targetAllocations: [{ label: "Equity", targetPercent: 100 }],
    newInvestment: 500,
  });
  const rows = computeRebalanceTableRows(
    recommendations,
    {},
    { Equity: "TEST" },
    { TEST: 125 },
    { Equity: 3 },
    { Equity: 1_000 },
    { Equity: [] },
  );

  assert.equal(rows[0].shareCount, 3);
  assert.equal(rows[0].actualCost, 375);
  assert.equal(rows[0].totalActualCost, 375);
  assert.equal(rows[0].projectedValue, 1_375);
});
