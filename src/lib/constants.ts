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

export const DEFAULT_CATEGORY_COLOR = "#6c757d";

export const SHEET_HEADERS = [
  "תאריך",
  "הוצאה",
  "כמה",
  "קטגוריה",
  "כרטיס",
  "הערות",
] as const;
