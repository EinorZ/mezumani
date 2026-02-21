/**
 * Israeli tax calculation engine for RSU and ESPP income.
 * All constants are defined in israeli-tax-config.ts.
 */

import {
  INCOME_TAX_BRACKETS,
  NI_THRESHOLD_MONTHLY,
  NI_MAX_MONTHLY,
  NI_LOW_RATE,
  NI_HIGH_RATE,
  HEALTH_LOW_RATE,
  HEALTH_HIGH_RATE,
  CAPITAL_GAINS_RATE,
  MATURATION_MONTHS,
  YASAF_RATE,
  YASAF_THRESHOLD,
} from "./israeli-tax-config";

/**
 * Calculate progressive income tax on a given annual amount,
 * returning just the marginal tax on the additionalIncome portion.
 */
/** Returns bracket breakdown for only the marginal income (the ESPP gain), given the base yearly gross. */
export function calcIncomeTaxBrackets(
  baseYearlyGross: number,
  additionalIncome: number,
): { rate: number; tax: number }[] {
  const result: { rate: number; tax: number }[] = [];
  let remaining = additionalIncome;
  let prev = baseYearlyGross;

  for (const bracket of INCOME_TAX_BRACKETS) {
    if (remaining <= 0) break;
    if (prev >= bracket.upTo) { prev = bracket.upTo; continue; }
    const available = bracket.upTo - prev;
    const taxable = Math.min(remaining, available);
    if (taxable > 0) result.push({ rate: bracket.rate, tax: taxable * bracket.rate });
    remaining -= taxable;
    prev = bracket.upTo;
  }

  return result;
}

export function calcMarginalIncomeTax(
  baseYearlyGross: number,
  additionalIncome: number,
): number {
  const totalIncome = baseYearlyGross + additionalIncome;

  function taxOn(income: number): number {
    let tax = 0;
    let prev = 0;
    for (const bracket of INCOME_TAX_BRACKETS) {
      if (income <= prev) break;
      const taxable = Math.min(income, bracket.upTo) - prev;
      tax += taxable * bracket.rate;
      prev = bracket.upTo;
    }
    return tax;
  }

  return taxOn(totalIncome) - taxOn(baseYearlyGross);
}

/**
 * Calculate Bituach Leumi (National Insurance) on additional monthly income.
 * Takes the base monthly gross and the additional income for that month.
 */
function calcMonthlyNI(baseMonthly: number, additionalMonthly: number): number {
  function niOn(monthly: number): number {
    if (monthly <= 0) return 0;
    const low = Math.min(monthly, NI_THRESHOLD_MONTHLY);
    const high = Math.min(Math.max(monthly - NI_THRESHOLD_MONTHLY, 0), NI_MAX_MONTHLY - NI_THRESHOLD_MONTHLY);
    return low * NI_LOW_RATE + high * NI_HIGH_RATE;
  }

  const total = baseMonthly + additionalMonthly;
  return niOn(total) - niOn(baseMonthly);
}

/**
 * Calculate Health Tax on additional monthly income.
 */
function calcMonthlyHealthTax(baseMonthly: number, additionalMonthly: number): number {
  function healthOn(monthly: number): number {
    if (monthly <= 0) return 0;
    const low = Math.min(monthly, NI_THRESHOLD_MONTHLY);
    const high = Math.min(Math.max(monthly - NI_THRESHOLD_MONTHLY, 0), NI_MAX_MONTHLY - NI_THRESHOLD_MONTHLY);
    return low * HEALTH_LOW_RATE + high * HEALTH_HIGH_RATE;
  }

  const total = baseMonthly + additionalMonthly;
  return healthOn(total) - healthOn(baseMonthly);
}

/**
 * Full marginal tax calculation: income tax + NI + health tax
 * on additional employment income.
 */
export function calcMarginalTax(
  yearlyGross: number,
  additionalIncome: number,
): { incomeTax: number; nationalInsurance: number; healthTax: number; total: number } {
  const incomeTax = calcMarginalIncomeTax(yearlyGross, additionalIncome);

  // For NI/health, approximate the monthly base
  const baseMonthly = yearlyGross / 12;
  // Treat additional income as hitting one month (vest month)
  const ni = calcMonthlyNI(baseMonthly, additionalIncome);
  const health = calcMonthlyHealthTax(baseMonthly, additionalIncome);

  return {
    incomeTax,
    nationalInsurance: ni,
    healthTax: health,
    total: incomeTax + ni + health,
  };
}


/**
 * Check if a sell date is after the Section 102 maturation period (2 years from grant).
 * After maturation: entire gain taxed at 25% only (capital gains track).
 * Before maturation: marginal income tax + NI + health on vest income, plus 25% on post-vest gain.
 */
function isAfterMaturation(grantDate: string, sellDate: string): boolean {
  const gParts = grantDate.split("/");
  const sParts = sellDate.split("/");
  if (gParts.length < 3 || sParts.length < 3) return false;

  let gYear = parseInt(gParts[2], 10);
  let sYear = parseInt(sParts[2], 10);
  if (gYear < 100) gYear += 2000;
  if (sYear < 100) sYear += 2000;

  const grant = new Date(gYear, parseInt(gParts[1], 10) - 1, parseInt(gParts[0], 10));
  const sell = new Date(sYear, parseInt(sParts[1], 10) - 1, parseInt(sParts[0], 10));

  const maturationDate = new Date(grant);
  maturationDate.setMonth(maturationDate.getMonth() + MATURATION_MONTHS);

  return sell >= maturationDate;
}

/**
 * Calculate RSU net for a single vest event.
 *
 * Tax treatment depends on Section 102 maturation:
 * - After maturation (2y from grant): 25% capital gains on entire gain (sell price × shares × rate)
 * - Before maturation: marginal income tax + NI + health on vest income, plus 25% on post-vest appreciation
 */
export function calcRsuNet(params: {
  shares: number;
  vestPriceUsd: number;
  usdRate: number;
  feesIls: number;
  yearlyGross: number;
  sellPriceUsd?: number;
  grantDate?: string;
  sellDate?: string;
}): {
  vestIncomeIls: number;
  incomeTax: number;
  nationalInsurance: number;
  healthTax: number;
  capitalGainsTax: number;
  yasafTax: number;
  totalTax: number;
  netIls: number;
  matured: boolean;
} {
  const { shares, vestPriceUsd, usdRate, feesIls, yearlyGross, sellPriceUsd, grantDate, sellDate } = params;

  const vestIncomeIls = shares * vestPriceUsd * usdRate;
  const matured = !!(grantDate && sellDate && isAfterMaturation(grantDate, sellDate));

  // Determine sell proceeds
  const proceeds = sellPriceUsd !== undefined
    ? shares * sellPriceUsd * usdRate
    : vestIncomeIls;

  let marginal: ReturnType<typeof calcMarginalTax>;
  let capitalGainsTax = 0;

  if (matured) {
    // Section 102 capital gains track:
    // - 0 → vest price: מס עבודה (income tax + NI on vest value)
    // - vest price → sell price: 25% capital gains on appreciation
    marginal = calcMarginalTax(yearlyGross, vestIncomeIls);
    if (sellPriceUsd !== undefined) {
      const gain = (sellPriceUsd - vestPriceUsd) * shares * usdRate;
      if (gain > 0) capitalGainsTax = gain * CAPITAL_GAINS_RATE;
    }
  } else {
    // Before maturation: entire proceeds taxed as מס עבודה (income + NI), no capital gains benefit
    const totalIncome = sellPriceUsd !== undefined ? proceeds : vestIncomeIls;
    marginal = calcMarginalTax(yearlyGross, totalIncome);
  }

  const incomeForYasaf = matured ? vestIncomeIls : (sellPriceUsd !== undefined ? proceeds : vestIncomeIls);
  const yasafTax = Math.max(0, Math.min(incomeForYasaf, yearlyGross + incomeForYasaf - YASAF_THRESHOLD)) * YASAF_RATE;

  const totalTax = marginal.incomeTax + marginal.nationalInsurance + marginal.healthTax + capitalGainsTax + yasafTax;
  const netIls = proceeds - totalTax - feesIls;

  return {
    vestIncomeIls,
    incomeTax: marginal.incomeTax,
    nationalInsurance: marginal.nationalInsurance,
    healthTax: marginal.healthTax,
    capitalGainsTax,
    yasafTax,
    totalTax,
    netIls,
    matured,
  };
}

/**
 * Calculate ESPP net for a single purchase event.
 *
 * Same Section 102 logic:
 * - After maturation: 25% on entire gain (proceeds - contribution cost)
 * - Before maturation: marginal tax on discount income + 25% on post-FMV appreciation
 */
export function calcEsppNet(params: {
  shares: number;
  marketPriceUsd: number;
  purchasePriceUsd: number;
  contributionUsd: number;
  usdRate: number;
  feesIls: number;
  yearlyGross: number;
  sellPriceUsd?: number;
  grantDate?: string;
  sellDate?: string;
}): {
  discountIncomeIls: number;
  incomeTax: number;
  nationalInsurance: number;
  healthTax: number;
  capitalGainsTax: number;
  totalTax: number;
  netIls: number;
  matured: boolean;
} {
  const {
    shares, marketPriceUsd, purchasePriceUsd, contributionUsd,
    usdRate, feesIls, yearlyGross, sellPriceUsd, grantDate, sellDate,
  } = params;

  const discountIncomeIls = (marketPriceUsd - purchasePriceUsd) * shares * usdRate;
  const matured = !!(grantDate && sellDate && isAfterMaturation(grantDate, sellDate));

  const proceeds = shares * (sellPriceUsd ?? marketPriceUsd) * usdRate;
  const costIls = contributionUsd * usdRate;

  if (matured) {
    // Section 102: 25% on gain (proceeds - cost)
    const gain = proceeds - costIls;
    const capitalGainsTax = gain > 0 ? gain * CAPITAL_GAINS_RATE : 0;
    const totalTax = capitalGainsTax;
    const netIls = proceeds - costIls - totalTax - feesIls;

    return {
      discountIncomeIls,
      incomeTax: 0,
      nationalInsurance: 0,
      healthTax: 0,
      capitalGainsTax,
      totalTax,
      netIls,
      matured,
    };
  }

  // Before maturation: income tax on discount + capital gains on post-FMV appreciation
  const marginal = calcMarginalTax(yearlyGross, discountIncomeIls);

  let capitalGainsTax = 0;
  if (sellPriceUsd !== undefined) {
    const gain = (sellPriceUsd - marketPriceUsd) * shares * usdRate;
    if (gain > 0) {
      capitalGainsTax = gain * CAPITAL_GAINS_RATE;
    }
  }

  const totalTax = marginal.incomeTax + marginal.nationalInsurance + marginal.healthTax + capitalGainsTax;
  const netIls = proceeds - costIls - totalTax - feesIls;

  return {
    discountIncomeIls,
    incomeTax: marginal.incomeTax,
    nationalInsurance: marginal.nationalInsurance,
    healthTax: marginal.healthTax,
    capitalGainsTax,
    totalTax,
    netIls,
    matured,
  };
}
