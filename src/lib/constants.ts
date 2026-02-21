export const HEBREW_MONTHS = [
  "ינואר",
  "פברואר",
  "מרץ",
  "אפריל",
  "מאי",
  "יוני",
  "יולי",
  "אוגוסט",
  "ספטמבר",
  "אוקטובר",
  "נובמבר",
  "דצמבר",
] as const;

export const SETTINGS_SHEET_NAME = "הגדרות";
export const SETTINGS_RANGE_MONTHLY = "A2:A100";
export const SETTINGS_RANGE_VACATION = "B2:B100";
export const SETTINGS_RANGE_CARDS_EINOR = "C2:C100";
export const SETTINGS_RANGE_CARDS_ZIV = "D2:D100";
export const SETTINGS_RANGE_CARDS_SHARED = "E2:E100";
export const SETTINGS_RANGE_SUMMARY_LABELS = "F2:F100";
export const SETTINGS_RANGE_SUMMARY_CATEGORIES = "G2:G100";
export const SETTINGS_RANGE_RECURRING_NAMES = "H2:H100";
export const SETTINGS_RANGE_RECURRING_DATA = "I2:I100";
export const SETTINGS_RANGE_CATEGORY_MAP_NAMES = "J2:J100";
export const SETTINGS_RANGE_CATEGORY_MAP_CATEGORIES = "K2:K100";
export const SETTINGS_RANGE_RENAME_RULE_NAMES = "L2:L100";
export const SETTINGS_RANGE_RENAME_RULE_KEYWORDS = "M2:M100";
export const SETTINGS_RANGE_INCOME_NAMES = "N2:N100";
export const SETTINGS_RANGE_INCOME_DATA = "O2:O100";

export const DEFAULT_CATEGORY_COLOR = "#6c757d";

// Stock settings ranges (columns A-K in stocks spreadsheet הגדרות sheet)
export const SETTINGS_RANGE_STOCK_SYMBOLS = "A2:A100";
export const SETTINGS_RANGE_STOCK_NAMES = "B2:B100";
export const SETTINGS_RANGE_STOCK_SOURCES = "C2:C100";
export const SETTINGS_RANGE_STOCK_CURRENCIES = "D2:D100";
export const SETTINGS_RANGE_STOCK_LABELS = "E2:E100";
export const SETTINGS_RANGE_GOAL_TERMS = "F2:F100";
export const SETTINGS_RANGE_GOAL_LABELS = "G2:G100";
export const SETTINGS_RANGE_GOAL_AMOUNTS = "H2:H100";
export const SETTINGS_RANGE_BROKER_NAMES = "I2:I100";
export const SETTINGS_RANGE_BROKER_MGMT_FEES = "J2:J100";
export const SETTINGS_RANGE_BROKER_PURCHASE_FEES = "K2:K100";

// Label allocation target percentages (columns L-N in stocks הגדרות sheet)
export const SETTINGS_RANGE_ALLOC_LABELS = "L2:L100";
export const SETTINGS_RANGE_ALLOC_PERCENTS = "M2:M100";
export const SETTINGS_RANGE_ALLOC_STOCKS = "N2:N100";
export const SETTINGS_RANGE_ALLOC_COLORS = "O2:O100";

export const STOCKS_SHEET_NAME = "מניות";

export const STOCK_SHEET_HEADERS = [
  "תאריך",
  "סוג עסקה",
  "סימול",
  "כמות",
  "מחיר יחידה",
  "מטבע",
  "סוג",
  "בנק",
  "דמי ניהול קנייה",
  "הערות",
] as const;

export const SHEET_HEADERS = [
  "תאריך",
  "הוצאה",
  "כמה",
  "קטגוריה",
  "כרטיס",
  "הערות",
] as const;

// --- Stock term constants ---

import type { InvestmentTerm } from "@/lib/types";

export const ALL_TERMS: InvestmentTerm[] = ["קצר", "בינוני", "ארוך", "לימבו"];

export const TERM_LABELS: Record<InvestmentTerm, string> = {
  קצר: "טווח קצר",
  בינוני: "טווח בינוני",
  ארוך: "טווח ארוך",
  לימבו: "לימבו",
};

export const TERM_LABELS_SHORT: Record<InvestmentTerm, string> = {
  קצר: "קצר",
  בינוני: "בינוני",
  ארוך: "ארוך",
  לימבו: "לימבו",
};

export const TERM_COLORS: Record<InvestmentTerm, string> = {
  קצר: "#ffc107",
  בינוני: "#0dcaf0",
  ארוך: "#198754",
  לימבו: "#6f42c1",
};

export const TERM_TEXT_COLORS: Record<InvestmentTerm, string> = {
  קצר: "#000",
  בינוני: "#000",
  ארוך: "#fff",
  לימבו: "#fff",
};

// --- Chart palette ---

/** Deterministic color for a label — same label always gets the same color. */
export function getLabelColor(label: string): string {
  if (!label) return CHART_COLORS[CHART_COLORS.length - 1];
  let hash = 0;
  for (let i = 0; i < label.length; i++) {
    hash = (hash * 31 + label.charCodeAt(i)) | 0;
  }
  return CHART_COLORS[Math.abs(hash) % CHART_COLORS.length];
}

export const CHART_COLORS = [
  "#198754", // green
  "#0d6efd", // blue
  "#6f42c1", // purple
  "#fd7e14", // orange
  "#0dcaf0", // cyan
  "#dc3545", // red
  "#20c997", // teal
  "#ffc107", // amber
  "#d63384", // pink
  "#6610f2", // indigo
  "#adb5bd", // gray
  "#0a58ca", // dark blue
];
