export interface Transaction {
  row: number;
  date: string;
  expense: string;
  amount: number;
  category: string;
  card: string;
  notes: string;
  tentative?: boolean;
}

export interface TransactionInput {
  date: string;
  expense: string;
  amount: number;
  category: string;
  card: string;
  notes: string;
  updateExisting?: boolean;
  tentative?: boolean;
}

export interface SummaryCard {
  label: string;
  categories: string[];
}

export interface MonthSummary {
  total: number;
  cards: { label: string; amount: number; count: number }[];
}

export interface CategoryBreakdown {
  category: string;
  amount: number;
}

export interface CardBreakdown {
  card: string;
  amount: number;
}

export interface MonthlyData {
  title: string;
  transactions: Transaction[];
  summary: MonthSummary;
  categories: CategoryBreakdown[];
  cards: CardBreakdown[];
}

export interface AnnualRow {
  category: string;
  months: (number | null)[];
  average: number | null;
  total: number | null;
  percentage: number | null;
}

export interface AnnualData {
  year: number;
  rows: AnnualRow[];
  totals: {
    months: (number | null)[];
    average: number | null;
    total: number | null;
  };
}

export interface SheetInfo {
  sheetId: number;
  title: string;
  type: "monthly" | "annual" | "vacation" | "settings" | "other";
  monthIndex?: number;
  year?: number;
}

export interface CategoryItem {
  name: string;
  color: string;
}

export interface RecurringExpense {
  name: string;
  amount: number;
  category: string;
  card: string;
  keywords: string;
  tentative?: boolean;
}

export interface CategoryMapping {
  expenseName: string;
  category: string;
}

export interface ExpenseRenameRule {
  keywords: string; // pipe-separated keywords, e.g. "שופרסל|רמי לוי|סופר"
  targetName: string; // renamed expense, e.g. "סופרמרקט"
}

export interface AppConfig {
  monthlyCategories: CategoryItem[];
  vacationCategories: CategoryItem[];
  cardsEinor: string[];
  cardsZiv: string[];
  cardsShared: string[];
  summaryCards: SummaryCard[];
  recurringExpenses: RecurringExpense[];
  categoryMappings: CategoryMapping[];
  expenseRenameRules: ExpenseRenameRule[];
}

export interface VacationMonthRow {
  vacationName: string;
  vacationSheetTitle: string;
  vacationSheetId: number;
  amount: number;
}

export interface VacationData {
  title: string;
  transactions: Transaction[];
  total: number;
  totalWithoutFlights: number;
  countWithoutFlights: number;
  categories: CategoryBreakdown[];
  monthBreakdown: { month: string; amount: number }[];
}

export interface YearGroup {
  year: number;
  fullYear: number;
  months: SheetInfo[];
  vacations: SheetInfo[];
  hasAnnual: boolean;
}
