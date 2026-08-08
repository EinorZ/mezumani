import assert from "node:assert/strict";
import test from "node:test";
import {
  calcAnnualYasafTax,
  calcMarginalIncomeTax,
  calcMarginalTax,
  calcRsuNet,
  calcYasafTax,
} from "./israeli-tax";
import {
  CAPITAL_GAINS_RATE,
  YASAF_CAPITAL_RATE,
  YASAF_GENERAL_RATE,
  YASAF_THRESHOLD,
} from "./israeli-tax-config";

const EPSILON = 0.01;

function closeTo(actual: number, expected: number, message?: string) {
  assert.ok(
    Math.abs(actual - expected) <= EPSILON,
    message ?? `expected ${actual} to be within ${EPSILON} of ${expected}`,
  );
}

test("general surtax is zero while total taxable income remains below the threshold", () => {
  const result = calcYasafTax({
    baseTaxableIncome: 500_000,
    employmentIncome: 100_000,
    capitalIncome: 50_000,
  });

  closeTo(result.totalTax, 0);
});

test("annual surtax estimate includes both general and capital layers", () => {
  const result = calcAnnualYasafTax({
    employmentIncome: 800_000,
    capitalIncome: 800_000,
  });

  closeTo(result.generalTax, (1_600_000 - YASAF_THRESHOLD) * 0.03);
  closeTo(result.capitalTax, (800_000 - YASAF_THRESHOLD) * 0.02);
  closeTo(result.totalTax, result.generalTax + result.capitalTax);
});

test("general surtax applies only to the portion crossing the threshold", () => {
  const result = calcYasafTax({
    baseTaxableIncome: YASAF_THRESHOLD - 10_000,
    employmentIncome: 25_000,
    capitalIncome: 0,
  });

  closeTo(result.generalTax, 15_000 * YASAF_GENERAL_RATE);
  closeTo(result.capitalTax, 0);
});

test("employment income above the threshold is charged the general 3% only", () => {
  const result = calcYasafTax({
    baseTaxableIncome: 800_000,
    employmentIncome: 208_150.89,
    capitalIncome: 0,
  });

  closeTo(result.totalTax, 208_150.89 * YASAF_GENERAL_RATE);
});

test("capital income below its independent threshold is also charged only 3%", () => {
  const result = calcYasafTax({
    baseTaxableIncome: 800_000,
    employmentIncome: 45_629.29,
    capitalIncome: 162_521.6,
  });

  closeTo(result.generalTax, 208_150.89 * YASAF_GENERAL_RATE);
  closeTo(result.capitalTax, 0);
});

test("the screenshot's sell-now and wait scenarios produce the same basic surtax", () => {
  const sellNow = calcYasafTax({
    baseTaxableIncome: 800_000,
    employmentIncome: 208_150.89,
    capitalIncome: 0,
  });
  const wait = calcYasafTax({
    baseTaxableIncome: 800_000,
    employmentIncome: 45_629.29,
    capitalIncome: 162_521.6,
  });

  closeTo(sellNow.totalTax, 6_244.53);
  closeTo(wait.totalTax, sellNow.totalTax);
});

test("capital income above its independent threshold gets the additional 2% on the excess", () => {
  const capitalIncome = YASAF_THRESHOLD + 100_000;
  const result = calcYasafTax({
    baseTaxableIncome: 800_000,
    employmentIncome: 0,
    capitalIncome,
  });

  closeTo(result.generalTax, capitalIncome * YASAF_GENERAL_RATE);
  closeTo(result.capitalTax, 100_000 * YASAF_CAPITAL_RATE);
});

test("existing annual capital income is included in the additional 2% threshold", () => {
  const result = calcYasafTax({
    baseTaxableIncome: 800_000,
    baseCapitalIncome: YASAF_THRESHOLD - 20_000,
    employmentIncome: 0,
    capitalIncome: 50_000,
  });

  closeTo(result.capitalTax, 30_000 * YASAF_CAPITAL_RATE);
});

test("selling before Section 102 maturation classifies the full proceeds as employment income", () => {
  const result = calcRsuNet({
    shares: 100,
    vestPriceUsd: 100,
    sellPriceUsd: 200,
    usdRate: 3,
    feesIls: 0,
    yearlyGross: 800_000,
    grantDate: "01/01/25",
    sellDate: "31/12/26",
  });
  const proceeds = 100 * 200 * 3;

  assert.equal(result.matured, false);
  closeTo(result.capitalGainsTax, 0);
  closeTo(result.incomeTax, calcMarginalIncomeTax(800_000, proceeds));
  closeTo(result.yasafTax, proceeds * YASAF_GENERAL_RATE);
});

test("selling on the exact 24-month maturation date uses the capital-gains split", () => {
  const result = calcRsuNet({
    shares: 100,
    vestPriceUsd: 100,
    sellPriceUsd: 200,
    usdRate: 3,
    feesIls: 0,
    yearlyGross: 800_000,
    grantDate: "01/01/25",
    sellDate: "01/01/27",
  });

  assert.equal(result.matured, true);
  closeTo(result.vestIncomeIls, 30_000);
  closeTo(result.capitalGainsTax, 30_000 * CAPITAL_GAINS_RATE);
  closeTo(result.yasafTax, 60_000 * YASAF_GENERAL_RATE);
});

test("different grant prices retain their own employment and capital portions", () => {
  const common = {
    shares: 100,
    sellPriceUsd: 200,
    usdRate: 3,
    feesIls: 0,
    yearlyGross: 800_000,
    sellDate: "01/01/27",
  };
  const lowBasis = calcRsuNet({
    ...common,
    vestPriceUsd: 50,
    grantDate: "01/01/24",
  });
  const highBasis = calcRsuNet({
    ...common,
    vestPriceUsd: 150,
    grantDate: "01/01/24",
  });

  closeTo(lowBasis.vestIncomeIls, 15_000);
  closeTo(lowBasis.capitalGainsTax, 45_000 * CAPITAL_GAINS_RATE);
  closeTo(highBasis.vestIncomeIls, 45_000);
  closeTo(highBasis.capitalGainsTax, 15_000 * CAPITAL_GAINS_RATE);
  closeTo(lowBasis.vestIncomeIls + 45_000, 60_000);
  closeTo(highBasis.vestIncomeIls + 15_000, 60_000);
});

test("different grant dates determine maturation independently in one selection", () => {
  const common = {
    shares: 100,
    sellPriceUsd: 200,
    usdRate: 3,
    feesIls: 0,
    yearlyGross: 800_000,
    sellDate: "01/06/27",
  };
  const olderGrant = calcRsuNet({
    ...common,
    vestPriceUsd: 50,
    grantDate: "01/01/25",
  });
  const newerGrant = calcRsuNet({
    ...common,
    vestPriceUsd: 150,
    grantDate: "01/01/26",
  });

  assert.equal(olderGrant.matured, true);
  assert.equal(newerGrant.matured, false);
  assert.ok(olderGrant.capitalGainsTax > 0);
  closeTo(newerGrant.capitalGainsTax, 0);
});

test("multiple selected vests share progressive income-tax brackets", () => {
  const baseIncome = 550_000;
  const firstVestIncome = 8_000;
  const secondVestIncome = 8_000;
  const combined = calcMarginalTax(
    baseIncome,
    firstVestIncome + secondVestIncome,
  );

  // 10,280 remains in the 35% bracket, and the final 5,720 enters 47%.
  const expectedIncomeTax = 10_280 * 0.35 + 5_720 * 0.47;
  closeTo(combined.incomeTax, expectedIncomeTax);

  const incorrectlyCalculatedSeparately =
    calcMarginalIncomeTax(baseIncome, firstVestIncome) +
    calcMarginalIncomeTax(baseIncome, secondVestIncome);
  assert.notEqual(combined.incomeTax, incorrectlyCalculatedSeparately);
  assert.ok(combined.incomeTax > incorrectlyCalculatedSeparately);
});

test("no capital-gains tax is created when a matured RSU is sold below its basis", () => {
  const result = calcRsuNet({
    shares: 100,
    vestPriceUsd: 200,
    sellPriceUsd: 150,
    usdRate: 3,
    feesIls: 0,
    yearlyGross: 800_000,
    grantDate: "01/01/24",
    sellDate: "01/01/27",
  });

  assert.equal(result.matured, true);
  closeTo(result.capitalGainsTax, 0);
});
