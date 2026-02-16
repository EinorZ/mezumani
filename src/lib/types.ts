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
  income: IncomeSource[];
  totalIncome: number;
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
  totalIncome: number;
  totalSavings: number;
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

export interface IncomeSource {
  name: string;
  amount: number;
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
  incomeSources: IncomeSource[];
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

// ── Stock types ──

export type TransactionType = "קניה" | "מכירה";
export type InvestmentTerm = "קצר" | "בינוני" | "ארוך" | "לימבו";
export type StockCurrency = "ILS" | "USD";
export type PriceSource = "funder" | "yahoo";

export interface StockDefinition {
  symbol: string;
  displayName: string;
  source: PriceSource;
  currency: StockCurrency;
  label: string;
}

export interface StockTransaction {
  row: number;
  date: string;
  type: TransactionType;
  symbol: string;
  quantity: number;
  pricePerUnitILS: number;
  currency: StockCurrency;
  term: InvestmentTerm;
  bank: string;
  purchaseFee: number;
  notes: string;
}

export interface StockGoal {
  term: InvestmentTerm;
  label: string;
  targetAmount: number;
}

export interface BrokerConfig {
  name: string;
  managementFeePercent: number;
  purchaseFeePercent: number;
}

export interface LabelAllocation {
  label: string;
  targetPercent: number;
  selectedStock?: string;
}

export interface StockConfig {
  stocks: StockDefinition[];
  goals: StockGoal[];
  brokers: BrokerConfig[];
  labelAllocations: LabelAllocation[];
}

export interface StockHolding {
  symbol: string;
  displayName: string;
  term: InvestmentTerm;
  totalShares: number;
  avgCostPerShareILS: number;
  totalInvestedILS: number;
  totalSoldILS: number;
  totalPurchaseFee: number;
  totalMgmtFees: number;
  currentPriceILS: number;
  currentValueILS: number;
  profitLoss: number;
  profitLossPercent: number;
  ytdChangePercent: number | null;
  bank: string;
  currency: StockCurrency;
  label: string;
  transactions: StockTransaction[];
}

export interface StockTermGroup {
  term: InvestmentTerm;
  holdings: StockHolding[];
  totalValueILS: number;
  totalInvestedILS: number;
  totalFees: number;
  profitLoss: number;
  profitLossPercent: number;
  allocationPercent: number;
  goals: StockGoal[];
}

export type ChartRange = "1M" | "6M" | "YTD" | "1Y" | "Max";

export interface PortfolioHistoryPoint {
  date: string;       // YYYY-MM-DD
  value: number;      // portfolio value in ILS
  invested: number;   // total invested up to this date in ILS
}

export interface PortfolioReturns {
  daily: number | null;
  mtd: number | null;
  ytd: number | null;
  periods: { label: string; returnPercent: number | null }[];
  annual: { year: number; returnPercent: number | null }[];
}

export interface StockDashboardData {
  holdings: StockHolding[];
  byTerm: StockTermGroup[];
  totals: {
    totalValueILS: number;
    totalInvestedILS: number;
    totalFees: number;
    totalProfitLoss: number;
    totalProfitLossPercent: number;
    estimatedCapitalGainsTax: number;
    ytdChangePercent: number | null;
  };
  currencyExposure: {
    usd: { amountILS: number; percent: number };
    ils: { amountILS: number; percent: number };
  };
  usdToIls: number;
  lastUpdated: string;
}
