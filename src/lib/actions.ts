"use server";

import { revalidatePath } from "next/cache";
import {
  appendTransaction,
  updateTransaction,
  clearTransaction,
  createMonthSheet,
  addConfigItem,
  removeConfigItem,
  addCategoryConfigItem,
  removeCategoryConfigItem,
  renameCategoryInSheets,
  renameSheet,
  moveSheet,
  createVacationSheet,
  ensureCurrentSheets,
  listSheets,
  addSummaryCardItem,
  removeSummaryCardItem,
  updateSummaryCardItem,
  addRecurringExpense,
  updateRecurringExpense,
  removeRecurringExpense,
  reorderRecurringExpenses,
  reorderSummaryCards as reorderSummaryCardsGS,
  batchImportTransactions,
  addCategoryMapping,
  updateCategoryMapping,
  removeCategoryMapping,
  addExpenseRenameRule,
  updateExpenseRenameRule,
  removeExpenseRenameRule,
  setCardLastFourMapping,
  removeCardLastFourMapping,
  batchUpdateFields,
  batchToggleTentativeFlag,
  setMonthDone,
  addIncomeSource,
  updateIncomeSource,
  removeIncomeSource,
  updateMonthIncome,
  updateMonthAllocations,
  addStockDefinition,
  updateStockDefinition,
  removeStockDefinition,
  addBrokerConfig,
  updateBrokerConfig,
  removeBrokerConfig,
  addStockGoal,
  updateStockGoal,
  removeStockGoal,
  addStockTransaction as addStockTx,
  updateStockTransaction as updateStockTx,
  deleteStockTransaction as deleteStockTx,
  saveLabelAllocations,
  addRsuVestRows,
  updateRsuRow,
  deleteRsuRow,
  toggleRsuSold,
  setRsuGrossData,
  setAnnualSavingsGoal,
  setAnnualGoalForYear,
  setIrregularExpenseCategoriesForYear,
} from "./google-sheets";
import { HEBREW_MONTHS } from "./constants";
import { OWNER_LABELS } from "./utils";
import {
  ensurePensionSheet,
  getPensionFunds,
  addPensionFund,
  updatePensionFund,
  deletePensionFund,
} from "./pension-sheets";
import type {
  TransactionInput,
  RecurringExpense,
  SummaryCard,
  IncomeSource,
  MonthAllocation,
  LabelAllocation,
  PriceSource,
  StockCurrency,
  InvestmentTerm,
  TransactionType,
  ChartRange,
  PortfolioHistoryPoint,
  PortfolioReturns,
  PensionOwner,
  PensionFundType,
} from "./types";
import {
  ActionInputError,
  assertArray,
  assertBoolean,
  assertEnum,
  assertFiniteNumber,
  assertIncomeSources,
  assertInteger,
  assertInternalPath,
  assertLabelAllocations,
  assertMonthAllocations,
  assertRecurringExpenses,
  assertSheetId,
  assertSheetRow,
  assertSheetRows,
  assertSheetTitle,
  assertStringList,
  assertSummaryCards,
  assertText,
  assertTransactionInput,
  assertTransactionInputs,
  assertYearSuffix,
} from "./action-validation";

const TRANSACTION_TYPES = ["קניה", "מכירה"] as const;
const INVESTMENT_TERMS = ["קצר", "בינוני", "ארוך", "לימבו"] as const;
const STOCK_CURRENCIES = ["ILS", "USD"] as const;
const PRICE_SOURCES = ["funder", "yahoo", "manual"] as const;
const PENSION_OWNERS = ["עינור", "זיו"] as const;
const PENSION_FUND_TYPES = ["פנסיה", "קרן השתלמות"] as const;
const CHART_RANGES = ["1M", "6M", "YTD", "1Y", "Max"] as const;

function assertOptionalText(value: unknown, field: string, maxLength = 500) {
  assertText(value, field, { allowEmpty: true, maxLength });
}

function assertNonNegativeNumber(value: unknown, field: string) {
  assertFiniteNumber(value, field, { min: 0, max: 1_000_000_000_000 });
}

function buildTransactionValues(data: TransactionInput, isVacation = false) {
  const amount = data.tentative ? "" : String(data.amount);
  const tentativeAmount = data.tentative ? String(data.amount) : "";
  if (isVacation) {
    // Vacation columns: D=card, E=category (swapped vs monthly)
    return [
      data.date,
      data.expense,
      amount,
      data.card,
      data.category,
      tentativeAmount,
    ];
  }
  return [
    data.date,
    data.expense,
    amount,
    data.category,
    data.card,
    tentativeAmount,
  ];
}

export async function addTransaction(
  sheetTitle: string,
  data: TransactionInput,
): Promise<number> {
  assertSheetTitle(sheetTitle);
  assertTransactionInput(data);
  return appendTransaction(sheetTitle, buildTransactionValues(data));
}

export async function editTransaction(
  sheetTitle: string,
  row: number,
  data: TransactionInput,
) {
  assertSheetTitle(sheetTitle);
  assertSheetRow(row);
  assertTransactionInput(data);
  await updateTransaction(sheetTitle, row, buildTransactionValues(data));
}

export async function deleteTransaction(sheetTitle: string, row: number) {
  assertSheetTitle(sheetTitle);
  assertSheetRow(row);
  await clearTransaction(sheetTitle, row);
}

export async function createMonth(monthIndex: number, yearSuffix: number) {
  assertInteger(monthIndex, "monthIndex", { min: 0, max: 11 });
  assertYearSuffix(yearSuffix);
  await createMonthSheet(HEBREW_MONTHS[monthIndex], yearSuffix);
  revalidatePath("/");
}

// ---- Settings actions ----

const COLUMN_MAP = {
  monthly: "A" as const,
  vacation: "B" as const,
};

export async function addCategory(
  type: "monthly" | "vacation",
  name: string,
  color: string,
) {
  assertEnum(type, "type", ["monthly", "vacation"] as const);
  assertText(name, "name");
  assertText(color, "color", { maxLength: 100 });
  await addCategoryConfigItem(COLUMN_MAP[type], name, color);
  revalidatePath("/settings");
}

export async function removeCategory(
  type: "monthly" | "vacation",
  name: string,
) {
  assertEnum(type, "type", ["monthly", "vacation"] as const);
  assertText(name, "name");
  await removeCategoryConfigItem(COLUMN_MAP[type], name);
  revalidatePath("/settings");
}

export async function renameCategory(
  type: "monthly" | "vacation",
  oldName: string,
  newName: string,
) {
  assertEnum(type, "type", ["monthly", "vacation"] as const);
  assertText(oldName, "oldName");
  assertText(newName, "newName");
  await renameCategoryInSheets(COLUMN_MAP[type], oldName, newName);
  revalidatePath("/settings");
  revalidatePath("/");
}

const CARD_COLUMN_MAP = {
  einor: "C" as const,
  ziv: "D" as const,
  shared: "E" as const,
};

export type CardOwner = "einor" | "ziv" | "shared";

export async function addCard(owner: CardOwner, name: string) {
  assertEnum(owner, "owner", ["einor", "ziv", "shared"] as const);
  assertText(name, "name");
  await addConfigItem(CARD_COLUMN_MAP[owner], name);
  revalidatePath("/settings");
}

export async function removeCard(owner: CardOwner, name: string) {
  assertEnum(owner, "owner", ["einor", "ziv", "shared"] as const);
  assertText(name, "name");
  await removeConfigItem(CARD_COLUMN_MAP[owner], name);
  const mappedCard =
    owner === "shared" ? name : `${name} - ${OWNER_LABELS[owner]}`;
  await removeCardLastFourMapping(mappedCard);
  revalidatePath("/settings");
}

// ---- Summary card actions ----

export async function addSummaryCard(label: string, categories: string) {
  assertText(label, "label");
  assertOptionalText(categories, "categories", 2_000);
  await addSummaryCardItem(label, categories);
  revalidatePath("/settings");
}

export async function removeSummaryCard(label: string) {
  assertText(label, "label");
  await removeSummaryCardItem(label);
  revalidatePath("/settings");
}

export async function updateSummaryCard(
  oldLabel: string,
  newLabel: string,
  categories: string,
) {
  assertText(oldLabel, "oldLabel");
  assertText(newLabel, "newLabel");
  assertOptionalText(categories, "categories", 2_000);
  await updateSummaryCardItem(oldLabel, newLabel, categories);
  revalidatePath("/settings");
}

export async function reorderSummaryCards(items: SummaryCard[]) {
  assertSummaryCards(items);
  await reorderSummaryCardsGS(items);
  revalidatePath("/settings");
}

// ---- Recurring expense actions ----

export async function addRecurring(
  name: string,
  amount: number,
  category: string,
  card: string,
  keywords: string = "",
  tentative: boolean = false,
) {
  assertText(name, "name");
  assertFiniteNumber(amount, "amount");
  assertOptionalText(category, "category");
  assertOptionalText(card, "card");
  assertOptionalText(keywords, "keywords", 2_000);
  assertBoolean(tentative, "tentative");
  await addRecurringExpense(name, amount, category, card, keywords, tentative);
  revalidatePath("/settings");
}

export async function updateRecurring(
  oldName: string,
  name: string,
  amount: number,
  category: string,
  card: string,
  keywords: string = "",
  tentative: boolean = false,
) {
  assertText(oldName, "oldName");
  assertText(name, "name");
  assertFiniteNumber(amount, "amount");
  assertOptionalText(category, "category");
  assertOptionalText(card, "card");
  assertOptionalText(keywords, "keywords", 2_000);
  assertBoolean(tentative, "tentative");
  await updateRecurringExpense(
    oldName,
    name,
    amount,
    category,
    card,
    keywords,
    tentative,
  );
  revalidatePath("/settings");
}

export async function removeRecurring(name: string) {
  assertText(name, "name");
  await removeRecurringExpense(name);
  revalidatePath("/settings");
}

export async function reorderRecurring(items: RecurringExpense[]) {
  assertRecurringExpenses(items);
  await reorderRecurringExpenses(items);
  revalidatePath("/settings");
}

// ---- Category mapping actions ----

export async function addCategoryMappingAction(
  expenseNames: string | string[],
  category: string,
) {
  if (Array.isArray(expenseNames)) {
    assertStringList(expenseNames, "expenseNames", 500);
  } else {
    assertText(expenseNames, "expenseNames", { maxLength: 2_000 });
  }
  assertText(category, "category");
  await addCategoryMapping(expenseNames, category);
  revalidatePath("/settings");
}

export async function updateCategoryMappingAction(
  oldExpenseName: string,
  expenseName: string,
  category: string,
) {
  assertText(oldExpenseName, "oldExpenseName", { maxLength: 2_000 });
  assertText(expenseName, "expenseName", { maxLength: 2_000 });
  assertText(category, "category");
  await updateCategoryMapping(oldExpenseName, expenseName, category);
  revalidatePath("/settings");
}

export async function removeCategoryMappingAction(expenseName: string) {
  assertText(expenseName, "expenseName", { maxLength: 2_000 });
  await removeCategoryMapping(expenseName);
  revalidatePath("/settings");
}

// ---- Expense rename rule actions ----

export async function addExpenseRenameRuleAction(
  targetName: string,
  keywords: string,
) {
  assertText(targetName, "targetName");
  assertText(keywords, "keywords", { maxLength: 2_000 });
  await addExpenseRenameRule(targetName, keywords);
  revalidatePath("/settings");
}

export async function updateExpenseRenameRuleAction(
  oldTargetName: string,
  targetName: string,
  keywords: string,
) {
  assertText(oldTargetName, "oldTargetName");
  assertText(targetName, "targetName");
  assertText(keywords, "keywords", { maxLength: 2_000 });
  await updateExpenseRenameRule(oldTargetName, targetName, keywords);
  revalidatePath("/settings");
}

export async function removeExpenseRenameRuleAction(targetName: string) {
  assertText(targetName, "targetName");
  await removeExpenseRenameRule(targetName);
  revalidatePath("/settings");
}

export async function setCardLastFourMappingAction(
  card: string,
  lastFour: string,
) {
  assertText(card, "card");
  assertText(lastFour, "lastFour", { maxLength: 4 });
  if (!/^\d{4}$/.test(lastFour)) {
    throw new ActionInputError("lastFour", "must contain exactly four digits");
  }
  await setCardLastFourMapping(card, lastFour);
  revalidatePath("/settings");
  revalidatePath("/month/[id]", "page");
}

export async function removeCardLastFourMappingAction(card: string) {
  assertText(card, "card");
  await removeCardLastFourMapping(card);
  revalidatePath("/settings");
  revalidatePath("/month/[id]", "page");
}

// ---- Annual savings goal ----

export async function setAnnualSavingsGoalAction(amount: number) {
  assertNonNegativeNumber(amount, "amount");
  await setAnnualSavingsGoal(amount);
  revalidatePath("/settings");
  revalidatePath("/");
}

export async function setAnnualGoalForYearAction(
  year: number | "default",
  amount: number,
) {
  if (year !== "default") {
    assertInteger(year, "year", { min: 2_000, max: 9_999 });
  }
  assertNonNegativeNumber(amount, "amount");
  await setAnnualGoalForYear(year, amount);
  revalidatePath("/settings");
  revalidatePath("/");
  revalidatePath("/year/[year]", "page");
}

export async function setIrregularExpenseCategoriesForYearAction(
  year: number,
  categories: string[],
) {
  assertInteger(year, "year", { min: 2_000, max: 9_999 });
  assertStringList(categories, "categories", 500);
  await setIrregularExpenseCategoriesForYear(year, categories);
  revalidatePath(`/year/${year % 100}`);
}

// ---- Income source actions ----

export async function addIncome(name: string, amount: number) {
  assertText(name, "name");
  assertFiniteNumber(amount, "amount");
  await addIncomeSource(name, amount);
  revalidatePath("/settings");
}

export async function updateIncome(
  oldName: string,
  name: string,
  amount: number,
) {
  assertText(oldName, "oldName");
  assertText(name, "name");
  assertFiniteNumber(amount, "amount");
  await updateIncomeSource(oldName, name, amount);
  revalidatePath("/settings");
}

export async function removeIncome(name: string) {
  assertText(name, "name");
  await removeIncomeSource(name);
  revalidatePath("/settings");
}

export async function updateMonthIncomeAction(
  sheetTitle: string,
  entries: IncomeSource[],
) {
  assertSheetTitle(sheetTitle);
  assertIncomeSources(entries);
  await updateMonthIncome(sheetTitle, entries);
}

export async function updateMonthAllocationsAction(
  sheetTitle: string,
  yearSuffix: number,
  allocations: MonthAllocation[],
) {
  assertSheetTitle(sheetTitle);
  assertYearSuffix(yearSuffix);
  assertMonthAllocations(allocations);
  await updateMonthAllocations(sheetTitle, allocations);
  revalidatePath(`/year/${yearSuffix}`);
}

// ---- Vacation actions ----

export async function createVacation(name: string, yearSuffix: number) {
  assertText(name, "name", { maxLength: 90 });
  assertYearSuffix(yearSuffix);
  await createVacationSheet(name, yearSuffix);
  revalidatePath("/");
  revalidatePath("/settings");
}

export async function addVacationTransaction(
  sheetTitle: string,
  data: TransactionInput,
): Promise<number> {
  assertSheetTitle(sheetTitle);
  assertTransactionInput(data);
  return appendTransaction(sheetTitle, buildTransactionValues(data, true));
}

export async function editVacationTransaction(
  sheetTitle: string,
  row: number,
  data: TransactionInput,
) {
  assertSheetTitle(sheetTitle);
  assertSheetRow(row);
  assertTransactionInput(data);
  await updateTransaction(sheetTitle, row, buildTransactionValues(data, true));
}

export const deleteVacationTransaction = deleteTransaction;

// ---- Bulk edit ----

export async function bulkEditTransactions(
  sheetTitle: string,
  updates: { row: number; category?: string; card?: string }[],
) {
  assertSheetTitle(sheetTitle);
  assertArray(
    updates,
    "updates",
    (
      item,
      field,
    ): asserts item is { row: number; category?: string; card?: string } => {
      if (typeof item !== "object" || item === null || Array.isArray(item)) {
        throw new ActionInputError(field, "must be an object");
      }
      const update = item as Record<string, unknown>;
      assertSheetRow(update.row, `${field}.row`);
      if (update.category !== undefined) {
        assertOptionalText(update.category, `${field}.category`);
      }
      if (update.card !== undefined) {
        assertOptionalText(update.card, `${field}.card`);
      }
    },
  );
  await batchUpdateFields(sheetTitle, false, updates);
}

export async function bulkEditVacationTransactions(
  sheetTitle: string,
  updates: { row: number; category?: string; card?: string }[],
) {
  assertSheetTitle(sheetTitle);
  assertArray(
    updates,
    "updates",
    (
      item,
      field,
    ): asserts item is { row: number; category?: string; card?: string } => {
      if (typeof item !== "object" || item === null || Array.isArray(item)) {
        throw new ActionInputError(field, "must be an object");
      }
      const update = item as Record<string, unknown>;
      assertSheetRow(update.row, `${field}.row`);
      if (update.category !== undefined) {
        assertOptionalText(update.category, `${field}.category`);
      }
      if (update.card !== undefined) {
        assertOptionalText(update.card, `${field}.card`);
      }
    },
  );
  await batchUpdateFields(sheetTitle, true, updates);
}

// ---- Bulk delete ----

export async function bulkDeleteTransactions(
  sheetTitle: string,
  rows: number[],
) {
  assertSheetTitle(sheetTitle);
  assertSheetRows(rows);
  await Promise.all(rows.map((row) => clearTransaction(sheetTitle, row)));
}

export const bulkDeleteVacationTransactions = bulkDeleteTransactions;

// ---- Move to vacation ----

export async function bulkMoveToVacationAction(
  sourceTitle: string,
  destTitle: string,
  rows: number[],
  transactions: TransactionInput[],
) {
  assertSheetTitle(sourceTitle, "sourceTitle");
  assertSheetTitle(destTitle, "destTitle");
  assertSheetRows(rows);
  assertTransactionInputs(transactions);
  if (rows.length !== transactions.length) {
    throw new ActionInputError(
      "transactions",
      "must contain one transaction for every source row",
    );
  }
  await batchImportTransactions(destTitle, transactions, true);
  await Promise.all(rows.map((row) => clearTransaction(sourceTitle, row)));
}

// ---- Batch import ----

export async function addTransactionsBatch(
  sheetTitle: string,
  transactions: TransactionInput[],
  isVacation = false,
): Promise<number> {
  assertSheetTitle(sheetTitle);
  assertTransactionInputs(transactions);
  assertBoolean(isVacation, "isVacation");
  return batchImportTransactions(sheetTitle, transactions, isVacation);
}

// ---- Debounced revalidation (called by client) ----

export async function revalidatePageAction(path: string) {
  assertInternalPath(path);
  revalidatePath(path);
}

// ---- Sheet rename action ----

export async function renameSheetAction(
  sheetId: number,
  newTitle: string,
  pagePath?: string,
) {
  assertSheetId(sheetId);
  assertSheetTitle(newTitle, "newTitle");
  if (pagePath !== undefined) assertInternalPath(pagePath, "pagePath");
  await renameSheet(sheetId, newTitle);
  revalidatePath("/");
  if (pagePath) revalidatePath(pagePath);
}

/** Move sheetId to be immediately after afterSheetId (or to first position if null).
 *  afterSheetId is the sheetId of the preceding sibling in the new order. */
export async function moveSheetAfterAction(
  sheetId: number,
  afterSheetId: number | null,
) {
  assertSheetId(sheetId);
  if (afterSheetId !== null) assertSheetId(afterSheetId, "afterSheetId");
  const allSheetsRaw = await listSheets();
  // listSheets returns sheets sorted by their natural order from the API
  let targetIndex: number;
  if (afterSheetId === null) {
    targetIndex = 0;
  } else {
    const afterPos = allSheetsRaw.findIndex((s) => s.sheetId === afterSheetId);
    targetIndex = afterPos >= 0 ? afterPos + 1 : allSheetsRaw.length;
  }
  await moveSheet(sheetId, targetIndex);
  revalidatePath("/");
}

// ---- Auto-creation action ----

export async function ensureCurrentSheetsAction() {
  const sheets = await listSheets();
  const created = await ensureCurrentSheets(sheets);
  if (created) {
    revalidatePath("/");
  }
  return created;
}

// ---- Bulk tentative toggle ----

export async function bulkToggleTentative(
  sheetTitle: string,
  rows: number[],
  tentative: boolean,
) {
  assertSheetTitle(sheetTitle);
  assertSheetRows(rows);
  assertBoolean(tentative, "tentative");
  await batchToggleTentativeFlag(sheetTitle, rows, tentative);
}

export const bulkToggleVacationTentative = bulkToggleTentative;

// ---- Month done toggle ----

export async function toggleMonthDoneAction(sheetTitle: string, done: boolean) {
  assertSheetTitle(sheetTitle);
  assertBoolean(done, "done");
  await setMonthDone(sheetTitle, done);
  revalidatePath("/");
}

// ──────────────────────────────────────────
// Stock settings actions
// ──────────────────────────────────────────

export async function addStock(
  symbol: string,
  displayName: string,
  source: PriceSource,
  currency: StockCurrency,
  label: string = "",
) {
  assertText(symbol, "symbol", { maxLength: 50 });
  assertOptionalText(displayName, "displayName");
  assertEnum(source, "source", PRICE_SOURCES);
  assertEnum(currency, "currency", STOCK_CURRENCIES);
  assertOptionalText(label, "label");
  await addStockDefinition(symbol, displayName, source, currency, label);
  revalidatePath("/settings");
}

export async function updateStock(
  oldSymbol: string,
  symbol: string,
  displayName: string,
  source: PriceSource,
  currency: StockCurrency,
  label: string = "",
) {
  assertText(oldSymbol, "oldSymbol", { maxLength: 50 });
  assertText(symbol, "symbol", { maxLength: 50 });
  assertOptionalText(displayName, "displayName");
  assertEnum(source, "source", PRICE_SOURCES);
  assertEnum(currency, "currency", STOCK_CURRENCIES);
  assertOptionalText(label, "label");
  await updateStockDefinition(
    oldSymbol,
    symbol,
    displayName,
    source,
    currency,
    label,
  );
  revalidatePath("/settings");
}

export async function removeStock(symbol: string) {
  assertText(symbol, "symbol", { maxLength: 50 });
  await removeStockDefinition(symbol);
  revalidatePath("/settings");
}

export async function addBroker(
  name: string,
  mgmtFee: number,
  purchaseFee: number,
) {
  assertText(name, "name");
  assertFiniteNumber(mgmtFee, "mgmtFee", { min: 0, max: 100 });
  assertFiniteNumber(purchaseFee, "purchaseFee", { min: 0, max: 100 });
  await addBrokerConfig(name, mgmtFee, purchaseFee);
  revalidatePath("/settings");
}

export async function updateBroker(
  oldName: string,
  name: string,
  mgmtFee: number,
  purchaseFee: number,
) {
  assertText(oldName, "oldName");
  assertText(name, "name");
  assertFiniteNumber(mgmtFee, "mgmtFee", { min: 0, max: 100 });
  assertFiniteNumber(purchaseFee, "purchaseFee", { min: 0, max: 100 });
  await updateBrokerConfig(oldName, name, mgmtFee, purchaseFee);
  revalidatePath("/settings");
}

export async function removeBroker(name: string) {
  assertText(name, "name");
  await removeBrokerConfig(name);
  revalidatePath("/settings");
}

export async function addGoal(
  term: InvestmentTerm,
  label: string,
  targetAmount: number,
) {
  assertEnum(term, "term", INVESTMENT_TERMS);
  assertText(label, "label");
  assertNonNegativeNumber(targetAmount, "targetAmount");
  await addStockGoal(term, label, targetAmount);
  revalidatePath("/settings");
}

export async function updateGoal(
  oldLabel: string,
  term: InvestmentTerm,
  label: string,
  targetAmount: number,
) {
  assertText(oldLabel, "oldLabel");
  assertEnum(term, "term", INVESTMENT_TERMS);
  assertText(label, "label");
  assertNonNegativeNumber(targetAmount, "targetAmount");
  await updateStockGoal(oldLabel, term, label, targetAmount);
  revalidatePath("/settings");
}

export async function removeGoal(label: string) {
  assertText(label, "label");
  await removeStockGoal(label);
  revalidatePath("/settings");
}

// ──────────────────────────────────────────
// Label allocation actions
// ──────────────────────────────────────────

export async function saveLabelAllocationsAction(
  allocations: LabelAllocation[],
) {
  assertLabelAllocations(allocations);
  await saveLabelAllocations(allocations);
  revalidatePath("/stocks");
}

// ──────────────────────────────────────────
// Stock transaction actions
// ──────────────────────────────────────────

export async function addStockTransactionAction(
  date: string,
  type: TransactionType,
  symbol: string,
  quantity: number,
  pricePerUnitILS: number,
  currency: StockCurrency,
  term: InvestmentTerm,
  bank: string,
  purchaseFee: number,
  notes: string,
): Promise<number> {
  assertOptionalText(date, "date", 30);
  assertEnum(type, "type", TRANSACTION_TYPES);
  assertText(symbol, "symbol", { maxLength: 50 });
  assertNonNegativeNumber(quantity, "quantity");
  assertNonNegativeNumber(pricePerUnitILS, "pricePerUnitILS");
  assertEnum(currency, "currency", STOCK_CURRENCIES);
  assertEnum(term, "term", INVESTMENT_TERMS);
  assertOptionalText(bank, "bank");
  assertNonNegativeNumber(purchaseFee, "purchaseFee");
  assertOptionalText(notes, "notes", 2_000);
  const row = await addStockTx(
    date,
    type,
    symbol,
    quantity,
    pricePerUnitILS,
    currency,
    term,
    bank,
    purchaseFee,
    notes,
  );
  revalidatePath("/stocks");
  return row;
}

export async function editStockTransactionAction(
  row: number,
  date: string,
  type: TransactionType,
  symbol: string,
  quantity: number,
  pricePerUnitILS: number,
  currency: StockCurrency,
  term: InvestmentTerm,
  bank: string,
  purchaseFee: number,
  notes: string,
) {
  assertSheetRow(row);
  assertOptionalText(date, "date", 30);
  assertEnum(type, "type", TRANSACTION_TYPES);
  assertText(symbol, "symbol", { maxLength: 50 });
  assertNonNegativeNumber(quantity, "quantity");
  assertNonNegativeNumber(pricePerUnitILS, "pricePerUnitILS");
  assertEnum(currency, "currency", STOCK_CURRENCIES);
  assertEnum(term, "term", INVESTMENT_TERMS);
  assertOptionalText(bank, "bank");
  assertNonNegativeNumber(purchaseFee, "purchaseFee");
  assertOptionalText(notes, "notes", 2_000);
  await updateStockTx(
    row,
    date,
    type,
    symbol,
    quantity,
    pricePerUnitILS,
    currency,
    term,
    bank,
    purchaseFee,
    notes,
  );
  revalidatePath("/stocks");
}

export async function deleteStockTransactionAction(row: number) {
  assertSheetRow(row);
  await deleteStockTx(row);
  revalidatePath("/stocks");
}

// ──────────────────────────────────────────
// Portfolio history action
// ──────────────────────────────────────────

export async function getPortfolioHistoryAction(
  range: ChartRange,
  term?: InvestmentTerm,
): Promise<PortfolioHistoryPoint[]> {
  assertEnum(range, "range", CHART_RANGES);
  if (term !== undefined) assertEnum(term, "term", INVESTMENT_TERMS);
  const { getPortfolioHistory } = await import("./stock-dashboard");
  return getPortfolioHistory(range, { term });
}

export async function getPortfolioReturnsAction(
  term?: InvestmentTerm,
): Promise<PortfolioReturns> {
  if (term !== undefined) assertEnum(term, "term", INVESTMENT_TERMS);
  const { getPortfolioHistory, computePortfolioReturns } =
    await import("./stock-dashboard");
  const { getStockConfig, saveYearReturns } = await import("./google-sheets");

  const config = await getStockConfig();
  const { savedYearReturns } = config;

  // Optimal fetch start: cover rolling 3yr periods AND all uncached complete years.
  // If all years up to (currentYear-1) are cached, only fetch 3yr of data.
  const currentYear = new Date().getFullYear();
  const threeYearsAgoDate = new Date();
  threeYearsAgoDate.setFullYear(threeYearsAgoDate.getFullYear() - 3);
  const threeYearsAgo = threeYearsAgoDate.toISOString().split("T")[0];

  // Find the earliest complete year not yet cached
  let earliestUncachedYear: number | null = null;
  // We look from a reasonable minimum (2015) to avoid fetching too far back
  for (let y = 2015; y < currentYear; y++) {
    if (!(y in savedYearReturns)) {
      earliestUncachedYear = y;
      break;
    }
  }

  // Start date: earlier of (3yr ago) and (Jan 1 of earliest uncached year)
  let startDate = threeYearsAgo;
  if (earliestUncachedYear !== null) {
    const uncachedStart = `${earliestUncachedYear}-01-01`;
    if (uncachedStart < startDate) startDate = uncachedStart;
  }

  const history = await getPortfolioHistory("Max", {
    downsample: false,
    term,
    startDateOverride: startDate,
  });

  const returns = computePortfolioReturns(history, savedYearReturns);

  // Save newly computed complete years — only if we have high-confidence data.
  // A year qualifies when:
  // 1. Not already cached (never overwrite existing)
  // 2. Computed return is non-null
  // 3. History has ≥200 points within that year (nearly all trading days)
  // 4. History covers Jan 1–15 AND Nov 1–Dec 31 of that year (full year fetched)
  const newEntries: Record<number, number> = {};
  for (const { year, returnPercent } of returns.annual) {
    if (returnPercent === null) continue;
    if (year in savedYearReturns) continue; // never overwrite

    // Count points and check coverage
    const yearPoints = history.filter((p) => p.date.startsWith(`${year}-`));
    if (yearPoints.length < 200) continue;

    const first = yearPoints[0].date;
    const last = yearPoints[yearPoints.length - 1].date;
    const coversStart = first <= `${year}-01-15`;
    const coversEnd = last >= `${year}-11-01`;
    if (!coversStart || !coversEnd) continue;

    newEntries[year] = returnPercent;
  }

  if (Object.keys(newEntries).length > 0) {
    await saveYearReturns({ ...savedYearReturns, ...newEntries });
  }

  return returns;
}

// ──────────────────────────────────────────
// NVIDIA RSU actions
// ──────────────────────────────────────────

/**
 * Add an RSU grant with auto-generated vest rows (7-column format).
 */
export async function addRsuGrantAction(
  grantDate: string,
  totalShares: number,
  costPerShare: number,
  vests: { vestDate: string; shares: number }[],
  grantName: string = "",
) {
  assertOptionalText(grantDate, "grantDate", 30);
  assertNonNegativeNumber(totalShares, "totalShares");
  assertNonNegativeNumber(costPerShare, "costPerShare");
  assertArray(
    vests,
    "vests",
    (item, field): asserts item is { vestDate: string; shares: number } => {
      if (typeof item !== "object" || item === null || Array.isArray(item)) {
        throw new ActionInputError(field, "must be an object");
      }
      const vest = item as Record<string, unknown>;
      assertOptionalText(vest.vestDate, `${field}.vestDate`, 30);
      assertNonNegativeNumber(vest.shares, `${field}.shares`);
    },
    500,
  );
  assertOptionalText(grantName, "grantName");
  if (vests.length === 0) return;

  const rows: string[][] = vests.map((v) => [
    grantDate,
    String(totalShares),
    v.vestDate,
    String(v.shares),
    costPerShare > 0 ? String(costPerShare) : "",
    "", // notes
    grantName,
    "", // not sold
  ]);

  await addRsuVestRows(rows);
  revalidatePath("/nvidia");
}

/**
 * Update an RSU vest row (7-column format).
 */
export async function updateRsuVestAction(
  row: number,
  grantDate: string,
  totalSharesInGrant: number,
  vestDate: string,
  shares: number,
  vestPriceUsd: number,
  notes: string = "",
  grantName: string = "",
  sold: boolean = false,
) {
  assertSheetRow(row);
  assertOptionalText(grantDate, "grantDate", 30);
  assertNonNegativeNumber(totalSharesInGrant, "totalSharesInGrant");
  assertOptionalText(vestDate, "vestDate", 30);
  assertNonNegativeNumber(shares, "shares");
  assertNonNegativeNumber(vestPriceUsd, "vestPriceUsd");
  assertOptionalText(notes, "notes", 2_000);
  assertOptionalText(grantName, "grantName");
  assertBoolean(sold, "sold");
  await updateRsuRow(row, [
    grantDate,
    String(totalSharesInGrant),
    vestDate,
    String(shares),
    vestPriceUsd ? String(vestPriceUsd) : "",
    notes,
    grantName,
    sold ? "TRUE" : "",
  ]);
  revalidatePath("/nvidia");
}

/**
 * Toggle the sold flag on an RSU vest row.
 */
export async function toggleRsuSoldAction(row: number, sold: boolean) {
  assertSheetRow(row);
  assertBoolean(sold, "sold");
  await toggleRsuSold(row, sold);
  revalidatePath("/nvidia");
}

/**
 * Delete an RSU row.
 */
export async function deleteRsuRowAction(row: number) {
  assertSheetRow(row);
  await deleteRsuRow(row);
  revalidatePath("/nvidia");
}

export async function setRsuGrossDataAction(
  grossSoFar: number,
  monthlySalary: number,
  esppMonthlyContribution: number,
  esppPurchasePrice: number,
) {
  assertNonNegativeNumber(grossSoFar, "grossSoFar");
  assertNonNegativeNumber(monthlySalary, "monthlySalary");
  assertNonNegativeNumber(esppMonthlyContribution, "esppMonthlyContribution");
  assertNonNegativeNumber(esppPurchasePrice, "esppPurchasePrice");
  await setRsuGrossData(
    grossSoFar,
    monthlySalary,
    esppMonthlyContribution,
    esppPurchasePrice,
  );
  revalidatePath("/nvidia");
}

// ──────────────────────────────────────────
// Pension actions
// ──────────────────────────────────────────

export async function getPensionData() {
  await ensurePensionSheet();
  const funds = await getPensionFunds();
  return { funds };
}

export async function addPensionFundAction(
  owner: PensionOwner,
  name: string,
  type: PensionFundType,
  track: string,
  balance: number,
  company: string,
) {
  assertEnum(owner, "owner", PENSION_OWNERS);
  assertText(name, "name");
  assertEnum(type, "type", PENSION_FUND_TYPES);
  assertOptionalText(track, "track");
  assertFiniteNumber(balance, "balance", {
    min: -1_000_000_000_000,
    max: 1_000_000_000_000,
  });
  assertOptionalText(company, "company");
  const date = new Date().toISOString().split("T")[0];
  await addPensionFund(owner, name, type, track, balance, date, company);
  revalidatePath("/pension");
}

export async function updatePensionFundAction(
  row: number,
  owner: PensionOwner,
  name: string,
  type: PensionFundType,
  track: string,
  balance: number,
  company: string,
) {
  assertSheetRow(row);
  assertEnum(owner, "owner", PENSION_OWNERS);
  assertText(name, "name");
  assertEnum(type, "type", PENSION_FUND_TYPES);
  assertOptionalText(track, "track");
  assertFiniteNumber(balance, "balance", {
    min: -1_000_000_000_000,
    max: 1_000_000_000_000,
  });
  assertOptionalText(company, "company");
  const date = new Date().toISOString().split("T")[0];
  await updatePensionFund(
    row,
    owner,
    name,
    type,
    track,
    balance,
    date,
    company,
  );
  revalidatePath("/pension");
}

export async function deletePensionFundAction(row: number) {
  assertSheetRow(row);
  await deletePensionFund(row);
  revalidatePath("/pension");
}

/**
 * Search expense names across all monthly + vacation sheets.
 */
export async function searchAllSheetsAction(query: string) {
  assertOptionalText(query, "query");
  if (!query || query.trim().length < 2) return [];

  const allSheets = await listSheets();
  const searchable = allSheets.filter(
    (s) => s.type === "monthly" || s.type === "vacation",
  );

  const { searchAllSheets } = await import("./google-sheets");
  return searchAllSheets(query.trim(), searchable);
}
