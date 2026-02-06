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
} from "./google-sheets";
import type { TransactionInput } from "./types";

export async function addTransaction(
  sheetTitle: string,
  data: TransactionInput,
): Promise<number> {
  const values = [
    data.date,
    data.expense,
    String(data.amount),
    data.category,
    data.card,
    data.notes,
  ];
  const row = await appendTransaction(sheetTitle, values);
  return row;
}

export async function editTransaction(
  sheetTitle: string,
  row: number,
  data: TransactionInput,
) {
  const values = [
    data.date,
    data.expense,
    String(data.amount),
    data.category,
    data.card,
    data.notes,
  ];
  await updateTransaction(sheetTitle, row, values);
}

export async function deleteTransaction(sheetTitle: string, row: number) {
  await clearTransaction(sheetTitle, row);
}

export async function createMonth(monthIndex: number, yearSuffix: number) {
  const months = [
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
  ];
  await createMonthSheet(months[monthIndex], yearSuffix);
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
  // Vacation columns: D=card, E=category (swapped)
  const values = [
    data.date,
    data.expense,
    String(data.amount),
    data.card, // D = card
    data.category, // E = category
    data.notes,
  ];
  const row = await appendTransaction(sheetTitle, values);
  return row;
}

export async function editVacationTransaction(
  sheetTitle: string,
  row: number,
  data: TransactionInput,
) {
  // Vacation columns: D=card, E=category (swapped)
  const values = [
    data.date,
    data.expense,
    String(data.amount),
    data.card, // D = card
    data.category, // E = category
    data.notes,
  ];
  await updateTransaction(sheetTitle, row, values);
}

export async function deleteVacationTransaction(
  sheetTitle: string,
  row: number,
) {
  await clearTransaction(sheetTitle, row);
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
