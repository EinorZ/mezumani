import "server-only";

import {
  batchGetMonthsDone,
  ensureCurrentSheets,
  ensureSettingsSheet,
  getAnnualData,
  getAppConfig,
  getMonthlyData,
  getSheetTitle,
  getVacationData,
  getVacationRowsForMonth,
  isMonthDone,
  listSheets,
  syncVacationRowsToMonthSheet,
} from "@/lib/google-sheets";
import { getNvidiaCompensationData } from "@/lib/nvidia-dashboard";
import { ensurePensionSheet, getPensionFunds } from "@/lib/pension-sheets";
import {
  ensureTransactionCardColors,
  getCategoryNames,
} from "@/lib/page-helpers";
import {
  getCachedStockConfig,
  getStockDashboardData,
} from "@/lib/stock-dashboard";
import {
  buildCardsWithOwner,
  buildCategoryColorMap,
  buildYearGroups,
} from "@/lib/utils";

export async function loadNavigation() {
  await ensureSettingsSheet();

  let sheets = await listSheets();
  const created = await ensureCurrentSheets(sheets);
  if (created) sheets = await listSheets();

  return buildYearGroups(sheets);
}

export async function getHomeRedirectTarget() {
  const sheets = await listSheets();
  const monthlySheets = sheets
    .filter((sheet) => sheet.type === "monthly")
    .sort(
      (a, b) =>
        (a.year ?? 0) - (b.year ?? 0) ||
        (a.monthIndex ?? 0) - (b.monthIndex ?? 0),
    );

  if (monthlySheets.length === 0) return "/settings";

  const doneFlags = await batchGetMonthsDone(monthlySheets);
  const firstOpenMonth = monthlySheets.find(
    (sheet) => !doneFlags.get(sheet.sheetId),
  );
  const target = firstOpenMonth ?? monthlySheets.at(-1)!;
  return `/month/${target.sheetId}`;
}

async function loadPageConfig() {
  const config = await getAppConfig();
  const { cards: allCards, cardColorMap } = buildCardsWithOwner(config);
  const colorMap = buildCategoryColorMap(
    config.monthlyCategories,
    config.vacationCategories,
  );
  return { config, allCards, cardColorMap, colorMap };
}

export async function loadMonthPage(sheetId: number) {
  const [sheets, pageConfig] = await Promise.all([
    listSheets(),
    loadPageConfig(),
  ]);
  const sheet = sheets.find((candidate) => candidate.sheetId === sheetId);
  if (!sheet) throw new Error(`Sheet with id ${sheetId} not found`);

  const title = sheet.title;
  const vacationSheets = sheets.filter(
    (candidate) => candidate.type === "vacation",
  );
  const [isDone, vacationRows] = await Promise.all([
    isMonthDone(title),
    getVacationRowsForMonth(title, vacationSheets),
  ]);

  await syncVacationRowsToMonthSheet(title, vacationRows);
  const data = await getMonthlyData(
    title,
    pageConfig.config.summaryCards,
    pageConfig.config.categoryMappings,
  );
  ensureTransactionCardColors(
    data.transactions,
    pageConfig.cardColorMap,
    pageConfig.config,
  );

  return {
    ...pageConfig,
    categoryNames: getCategoryNames(pageConfig.config.monthlyCategories),
    data,
    isDone,
    title,
    vacationRows,
    vacationSheets,
  };
}

export async function loadVacationPage(sheetId: number) {
  const title = await getSheetTitle(sheetId);
  const [data, pageConfig] = await Promise.all([
    getVacationData(title),
    loadPageConfig(),
  ]);
  ensureTransactionCardColors(
    data.transactions,
    pageConfig.cardColorMap,
    pageConfig.config,
  );

  return {
    ...pageConfig,
    categoryNames: getCategoryNames(pageConfig.config.vacationCategories),
    data,
    title,
  };
}

export async function loadAnnualPage(yearSuffix: number) {
  const [data, config] = await Promise.all([
    getAnnualData(yearSuffix),
    getAppConfig(),
  ]);
  return { data, config };
}

export async function loadStocksPage() {
  const [dashboardData, stockConfig] = await Promise.all([
    getStockDashboardData(),
    getCachedStockConfig(),
  ]);
  return { dashboardData, stockConfig };
}

export function loadNvidiaPage() {
  return getNvidiaCompensationData();
}

export async function loadPensionPage() {
  await ensurePensionSheet();
  return { funds: await getPensionFunds() };
}

export async function loadSettingsPage() {
  const [config, stockConfig] = await Promise.all([
    getAppConfig(),
    getCachedStockConfig(),
  ]);
  return { config, stockConfig };
}
