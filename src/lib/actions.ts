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
  batchImportTransactions,
  addCategoryMapping,
  updateCategoryMapping,
  removeCategoryMapping,
  addExpenseRenameRule,
  updateExpenseRenameRule,
  removeExpenseRenameRule,
  batchUpdateFields,
  batchToggleTentativeFlag,
  addIncomeSource,
  updateIncomeSource,
  removeIncomeSource,
  updateMonthIncome,
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
} from "./google-sheets";
import { HEBREW_MONTHS } from "./constants";
import type {
  TransactionInput,
  RecurringExpense,
  IncomeSource,
  LabelAllocation,
  PriceSource,
  StockCurrency,
  InvestmentTerm,
  TransactionType,
} from "./types";

function buildTransactionValues(data: TransactionInput, isVacation = false) {
  const amount = data.tentative ? "" : String(data.amount);
  const tentativeAmount = data.tentative ? String(data.amount) : "";
  if (isVacation) {
    // Vacation columns: D=card, E=category (swapped vs monthly)
    return [data.date, data.expense, amount, data.card, data.category, tentativeAmount];
  }
  return [data.date, data.expense, amount, data.category, data.card, tentativeAmount];
}

export async function addTransaction(
  sheetTitle: string,
  data: TransactionInput,
): Promise<number> {
  return appendTransaction(sheetTitle, buildTransactionValues(data));
}

export async function editTransaction(
  sheetTitle: string,
  row: number,
  data: TransactionInput,
) {
  await updateTransaction(sheetTitle, row, buildTransactionValues(data));
}

export async function deleteTransaction(sheetTitle: string, row: number) {
  await clearTransaction(sheetTitle, row);
}

export async function createMonth(monthIndex: number, yearSuffix: number) {
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
  await addCategoryConfigItem(COLUMN_MAP[type], name, color);
  revalidatePath("/settings");
}

export async function removeCategory(
  type: "monthly" | "vacation",
  name: string,
) {
  await removeCategoryConfigItem(COLUMN_MAP[type], name);
  revalidatePath("/settings");
}

export async function renameCategory(
  type: "monthly" | "vacation",
  oldName: string,
  newName: string,
) {
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
  await addConfigItem(CARD_COLUMN_MAP[owner], name);
  revalidatePath("/settings");
}

export async function removeCard(owner: CardOwner, name: string) {
  await removeConfigItem(CARD_COLUMN_MAP[owner], name);
  revalidatePath("/settings");
}

// ---- Summary card actions ----

export async function addSummaryCard(label: string, categories: string) {
  await addSummaryCardItem(label, categories);
  revalidatePath("/settings");
}

export async function removeSummaryCard(label: string) {
  await removeSummaryCardItem(label);
  revalidatePath("/settings");
}

export async function updateSummaryCard(
  oldLabel: string,
  newLabel: string,
  categories: string,
) {
  await updateSummaryCardItem(oldLabel, newLabel, categories);
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
  await removeRecurringExpense(name);
  revalidatePath("/settings");
}

export async function reorderRecurring(items: RecurringExpense[]) {
  await reorderRecurringExpenses(items);
  revalidatePath("/settings");
}

// ---- Category mapping actions ----

export async function addCategoryMappingAction(
  expenseNames: string | string[],
  category: string,
) {
  await addCategoryMapping(expenseNames, category);
  revalidatePath("/settings");
}

export async function updateCategoryMappingAction(
  oldExpenseName: string,
  expenseName: string,
  category: string,
) {
  await updateCategoryMapping(oldExpenseName, expenseName, category);
  revalidatePath("/settings");
}

export async function removeCategoryMappingAction(expenseName: string) {
  await removeCategoryMapping(expenseName);
  revalidatePath("/settings");
}

// ---- Expense rename rule actions ----

export async function addExpenseRenameRuleAction(
  targetName: string,
  keywords: string,
) {
  await addExpenseRenameRule(targetName, keywords);
  revalidatePath("/settings");
}

export async function updateExpenseRenameRuleAction(
  oldTargetName: string,
  targetName: string,
  keywords: string,
) {
  await updateExpenseRenameRule(oldTargetName, targetName, keywords);
  revalidatePath("/settings");
}

export async function removeExpenseRenameRuleAction(targetName: string) {
  await removeExpenseRenameRule(targetName);
  revalidatePath("/settings");
}

// ---- Income source actions ----

export async function addIncome(name: string, amount: number) {
  await addIncomeSource(name, amount);
  revalidatePath("/settings");
}

export async function updateIncome(
  oldName: string,
  name: string,
  amount: number,
) {
  await updateIncomeSource(oldName, name, amount);
  revalidatePath("/settings");
}

export async function removeIncome(name: string) {
  await removeIncomeSource(name);
  revalidatePath("/settings");
}

export async function updateMonthIncomeAction(
  sheetTitle: string,
  entries: IncomeSource[],
) {
  await updateMonthIncome(sheetTitle, entries);
}

// ---- Vacation actions ----

export async function createVacation(name: string, yearSuffix: number) {
  await createVacationSheet(name, yearSuffix);
  revalidatePath("/");
  revalidatePath("/settings");
}

export async function addVacationTransaction(
  sheetTitle: string,
  data: TransactionInput,
): Promise<number> {
  return appendTransaction(sheetTitle, buildTransactionValues(data, true));
}

export async function editVacationTransaction(
  sheetTitle: string,
  row: number,
  data: TransactionInput,
) {
  await updateTransaction(sheetTitle, row, buildTransactionValues(data, true));
}

export const deleteVacationTransaction = deleteTransaction;

// ---- Bulk edit ----

export async function bulkEditTransactions(
  sheetTitle: string,
  updates: { row: number; category?: string; card?: string }[],
) {
  await batchUpdateFields(sheetTitle, false, updates);
}

export async function bulkEditVacationTransactions(
  sheetTitle: string,
  updates: { row: number; category?: string; card?: string }[],
) {
  await batchUpdateFields(sheetTitle, true, updates);
}

// ---- Bulk delete ----

export async function bulkDeleteTransactions(
  sheetTitle: string,
  rows: number[],
) {
  await Promise.all(rows.map((row) => clearTransaction(sheetTitle, row)));
}

export const bulkDeleteVacationTransactions = bulkDeleteTransactions;

// ---- Batch import ----

export async function addTransactionsBatch(
  sheetTitle: string,
  transactions: TransactionInput[],
): Promise<number> {
  return batchImportTransactions(sheetTitle, transactions);
}

// ---- Debounced revalidation (called by client) ----

export async function revalidatePageAction(path: string) {
  revalidatePath(path);
}

// ---- Sheet rename action ----

export async function renameSheetAction(sheetId: number, newTitle: string) {
  await renameSheet(sheetId, newTitle);
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
  await batchToggleTentativeFlag(sheetTitle, rows, tentative);
}

export const bulkToggleVacationTentative = bulkToggleTentative;

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
  await updateStockDefinition(oldSymbol, symbol, displayName, source, currency, label);
  revalidatePath("/settings");
}

export async function removeStock(symbol: string) {
  await removeStockDefinition(symbol);
  revalidatePath("/settings");
}

export async function addBroker(
  name: string,
  mgmtFee: number,
  purchaseFee: number,
) {
  await addBrokerConfig(name, mgmtFee, purchaseFee);
  revalidatePath("/settings");
}

export async function updateBroker(
  oldName: string,
  name: string,
  mgmtFee: number,
  purchaseFee: number,
) {
  await updateBrokerConfig(oldName, name, mgmtFee, purchaseFee);
  revalidatePath("/settings");
}

export async function removeBroker(name: string) {
  await removeBrokerConfig(name);
  revalidatePath("/settings");
}

export async function addGoal(
  term: InvestmentTerm,
  label: string,
  targetAmount: number,
) {
  await addStockGoal(term, label, targetAmount);
  revalidatePath("/settings");
}

export async function updateGoal(
  oldLabel: string,
  term: InvestmentTerm,
  label: string,
  targetAmount: number,
) {
  await updateStockGoal(oldLabel, term, label, targetAmount);
  revalidatePath("/settings");
}

export async function removeGoal(label: string) {
  await removeStockGoal(label);
  revalidatePath("/settings");
}

// ──────────────────────────────────────────
// Label allocation actions
// ──────────────────────────────────────────

export async function saveLabelAllocationsAction(
  allocations: LabelAllocation[],
) {
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
  await deleteStockTx(row);
  revalidatePath("/stocks");
}
