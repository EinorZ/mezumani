/**
 * Israeli tax configuration — 2026 tax year.
 * Update these values each year or when rules change.
 */

// ── Income Tax Brackets (annual) ──
export const INCOME_TAX_BRACKETS = [
  { upTo: 84_120, rate: 0.1 },
  { upTo: 120_720, rate: 0.14 },
  { upTo: 193_800, rate: 0.2 },
  { upTo: 269_280, rate: 0.31 },
  { upTo: 560_280, rate: 0.35 },
  { upTo: 721_560, rate: 0.47 },
  { upTo: Infinity, rate: 0.5 },
];

// ── Bituach Leumi + Health Tax (monthly) ──
export const NI_THRESHOLD_MONTHLY = 7_703; // below this: low rates apply
export const NI_MAX_MONTHLY = 51_910; // above this: no NI/health tax

export const NI_LOW_RATE = 0.0104; // 1.04%
export const NI_HIGH_RATE = 0.07; // 7%
export const HEALTH_LOW_RATE = 0.0323; // 3.23%
export const HEALTH_HIGH_RATE = 0.0517; // 5.17%

// Combined rates (derived — update if individual rates change)
export const NI_AND_HEALTH_LOW_RATE = NI_LOW_RATE + HEALTH_LOW_RATE; // 4.27%
export const NI_AND_HEALTH_HIGH_RATE = NI_HIGH_RATE + HEALTH_HIGH_RATE; // 12.17%

// ── Capital Gains ──
export const CAPITAL_GAINS_RATE = 0.25;

// ── מס יסף ──
// 3% on total taxable income above the threshold, plus another 2% on
// capital-source income that independently exceeds the same threshold.
export const YASAF_GENERAL_RATE = 0.03;
export const YASAF_CAPITAL_RATE = 0.02;
export const YASAF_THRESHOLD = 721_560;

// ── Section 102 maturation period ──
export const MATURATION_MONTHS = 24;
