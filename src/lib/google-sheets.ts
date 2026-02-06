import { google } from "googleapis";
import type {
  MonthlyData,
  Transaction,
  MonthSummary,
  CategoryBreakdown,
  CardBreakdown,
  AnnualData,
  AnnualRow,
  AppConfig,
  CategoryItem,
  SummaryCard,
  SheetInfo,
  VacationData,
  VacationMonthRow,
} from "./types";
import {
  SETTINGS_SHEET_NAME,
  SETTINGS_RANGE_MONTHLY,
  SETTINGS_RANGE_VACATION,
  SETTINGS_RANGE_CARDS_EINOR,
  SETTINGS_RANGE_CARDS_ZIV,
  SETTINGS_RANGE_CARDS_SHARED,
  SETTINGS_RANGE_SUMMARY_LABELS,
  SETTINGS_RANGE_SUMMARY_CATEGORIES,
  DEFAULT_CATEGORY_COLOR,
  HEBREW_MONTHS,
} from "./constants";
import { classifySheet, parseNumber } from "./utils";

function getAuth() {
  return new google.auth.JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
}

function getSheets() {
  return google.sheets({ version: "v4", auth: getAuth() });
}

const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID!;

/**
 * List all sheet names and classify them.
 */
export async function listSheets() {
  const sheets = getSheets();
  const res = await sheets.spreadsheets.get({
    spreadsheetId: SPREADSHEET_ID,
    fields: "sheets.properties.sheetId,sheets.properties.title",
  });

  return (
    res.data.sheets?.map((s) =>
      classifySheet(s.properties?.sheetId ?? 0, s.properties?.title ?? ""),
    ) ?? []
  );
}

/**
 * Resolve a sheetId to its title by looking up from the sheets list.
 */
export async function getSheetTitle(sheetId: number): Promise<string> {
  const allSheets = await listSheets();
  const sheet = allSheets.find((s) => s.sheetId === sheetId);
  if (!sheet) throw new Error(`Sheet with id ${sheetId} not found`);
  return sheet.title;
}

/**
 * Rename a sheet tab.
 */
export async function renameSheet(
  sheetId: number,
  newTitle: string,
): Promise<void> {
  const sheets = getSheets();
  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: SPREADSHEET_ID,
    requestBody: {
      requests: [
        {
          updateSheetProperties: {
            properties: {
              sheetId,
              title: newTitle,
            },
            fields: "title",
          },
        },
      ],
    },
  });
}

/**
 * Fetch all data for a monthly sheet.
 * Computes summary, category breakdown, and card breakdown from raw transactions.
 */
export async function getMonthlyData(
  title: string,
  summaryCards: SummaryCard[],
): Promise<MonthlyData> {
  const sheets = getSheets();

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `'${title}'!A2:F`,
  });

  const rawTransactions = res.data.values ?? [];
  const transactions: Transaction[] = rawTransactions
    .map((row, idx) => ({
      row: idx + 2,
      date: row[0] ?? "",
      expense: row[1] ?? "",
      amount: parseNumber(row[2]),
      category: row[3] ?? "",
      card: row[4] ?? "",
      notes: row[5] ?? "",
    }))
    .filter((t) => t.date || t.expense || t.amount);

  // Compute summary from transactions
  const total = transactions.reduce((s, t) => s + t.amount, 0);
  const summaryCardResults = summaryCards.map((sc) => {
    const catSet = new Set(sc.categories);
    const amount = transactions
      .filter((t) => catSet.has(t.category))
      .reduce((s, t) => s + t.amount, 0);
    return { label: sc.label, amount };
  });
  const summary: MonthSummary = { total, cards: summaryCardResults };

  // Category breakdown
  const catMap = new Map<string, number>();
  for (const t of transactions) {
    if (t.category) {
      catMap.set(t.category, (catMap.get(t.category) ?? 0) + t.amount);
    }
  }
  const categories: CategoryBreakdown[] = [...catMap.entries()]
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);

  // Card breakdown
  const cardMap = new Map<string, number>();
  for (const t of transactions) {
    if (t.card) {
      cardMap.set(t.card, (cardMap.get(t.card) ?? 0) + t.amount);
    }
  }
  const cards: CardBreakdown[] = [...cardMap.entries()]
    .map(([card, amount]) => ({ card, amount }))
    .sort((a, b) => b.amount - a.amount);

  return { title, transactions, summary, categories, cards };
}

/**
 * Fetch annual summary data by computing from all monthly sheet transactions.
 */
export async function getAnnualData(yearSuffix: number): Promise<AnnualData> {
  const sheets = getSheets();
  const allSheets = await listSheets();

  // Find monthly sheets for this year
  const monthlySheets = allSheets
    .filter((s) => s.type === "monthly" && s.year === yearSuffix)
    .sort((a, b) => (a.monthIndex ?? 0) - (b.monthIndex ?? 0));

  // Batch-fetch transactions from all monthly sheets
  const ranges = monthlySheets.map((s) => `'${s.title}'!A2:F`);
  let valueRanges: { values?: string[][] }[] = [];
  if (ranges.length > 0) {
    const res = await sheets.spreadsheets.values.batchGet({
      spreadsheetId: SPREADSHEET_ID,
      ranges,
    });
    valueRanges = (res.data.valueRanges ?? []) as { values?: string[][] }[];
  }

  // For each month, group transactions by category → amount
  // monthData[monthIndex] = Map<category, amount>
  const monthData = new Map<number, Map<string, number>>();
  const allCategories = new Set<string>();

  for (let i = 0; i < monthlySheets.length; i++) {
    const monthIndex = monthlySheets[i].monthIndex ?? 0;
    const rawRows = valueRanges[i]?.values ?? [];
    const catMap = new Map<string, number>();

    for (const row of rawRows) {
      const amount = parseNumber(row[2]);
      const category = row[3]?.trim();
      if (category && amount) {
        catMap.set(category, (catMap.get(category) ?? 0) + amount);
        allCategories.add(category);
      }
    }

    monthData.set(monthIndex, catMap);
  }

  // Active month indices (which months have data)
  const activeMonthIndices = monthlySheets
    .map((s) => s.monthIndex ?? 0)
    .filter((idx) => monthData.has(idx));

  // Grand total across all months
  let grandTotal = 0;
  for (const catMap of monthData.values()) {
    for (const amount of catMap.values()) {
      grandTotal += amount;
    }
  }

  // Build AnnualRow[] for each category
  const rows: AnnualRow[] = [...allCategories].map((category) => {
    const months = Array.from({ length: 12 }, (_, i) => {
      const catMap = monthData.get(i);
      if (!catMap) return null;
      return catMap.get(category) ?? 0;
    });

    const nonNullMonths = months.filter((m): m is number => m !== null);
    const total = nonNullMonths.reduce((s, m) => s + m, 0);
    const average = nonNullMonths.length > 0 ? total / nonNullMonths.length : 0;
    const percentage = grandTotal > 0 ? (total / grandTotal) * 100 : 0;

    return { category, months, average, total, percentage };
  });

  // Sort by total descending
  rows.sort((a, b) => (b.total ?? 0) - (a.total ?? 0));

  // Build totals row
  const totalsMonths = Array.from({ length: 12 }, (_, i) => {
    if (!monthData.has(i)) return null;
    let sum = 0;
    for (const row of rows) {
      sum += row.months[i] ?? 0;
    }
    return sum;
  });

  const nonNullTotals = totalsMonths.filter((m): m is number => m !== null);
  const totals = {
    months: totalsMonths,
    average:
      nonNullTotals.length > 0
        ? nonNullTotals.reduce((s, m) => s + m, 0) / nonNullTotals.length
        : null,
    total: grandTotal > 0 ? grandTotal : null,
  };

  return { year: yearSuffix, rows, totals };
}

// ---- Write functions ----

/**
 * Find the first empty row in the transaction range.
 */
export async function findFirstEmptyRow(title: string): Promise<number> {
  const sheets = getSheets();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `'${title}'!A2:A219`,
  });
  const values = res.data.values ?? [];
  // Append after the last non-empty row (skip gaps left by deletions)
  let lastNonEmpty = -1;
  for (let i = 0; i < values.length; i++) {
    if (values[i] && values[i][0]) {
      lastNonEmpty = i;
    }
  }
  return lastNonEmpty + 3; // +2 header offset, +1 next row
}

/**
 * Append a transaction after the last non-empty row using the Sheets append API.
 * This is safe for concurrent calls — Sheets handles the row allocation.
 */
export async function appendTransaction(
  title: string,
  values: string[],
): Promise<number> {
  const sheets = getSheets();
  const res = await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: `'${title}'!A2:F`,
    valueInputOption: "USER_ENTERED",
    insertDataOption: "OVERWRITE",
    requestBody: { values: [values] },
  });
  // Extract the actual row from the updatedRange (e.g. "'Sheet'!A15:F15")
  const updatedRange = res.data.updates?.updatedRange ?? "";
  const match = updatedRange.match(/!A(\d+):/);
  return match ? parseInt(match[1], 10) : 2;
}

/**
 * Update a specific transaction row.
 */
export async function updateTransaction(
  title: string,
  row: number,
  values: string[],
): Promise<void> {
  const sheets = getSheets();
  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: `'${title}'!A${row}:F${row}`,
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [values] },
  });
}

/**
 * Clear a transaction row.
 */
export async function clearTransaction(
  title: string,
  row: number,
): Promise<void> {
  const sheets = getSheets();
  await sheets.spreadsheets.values.clear({
    spreadsheetId: SPREADSHEET_ID,
    range: `'${title}'!A${row}:F${row}`,
  });
}

/**
 * Create a new monthly sheet with all formulas, validations, and formatting.
 */
export async function createMonthSheet(
  hebrewMonth: string,
  yearSuffix: number,
): Promise<void> {
  const sheets = getSheets();
  const sheetTitle = `${hebrewMonth} ${yearSuffix}`;

  // First, create the sheet
  const addSheetRes = await sheets.spreadsheets.batchUpdate({
    spreadsheetId: SPREADSHEET_ID,
    requestBody: {
      requests: [
        {
          addSheet: {
            properties: {
              title: sheetTitle,
              rightToLeft: true,
            },
          },
        },
      ],
    },
  });

  const newSheetId =
    addSheetRes.data.replies?.[0]?.addSheet?.properties?.sheetId;
  if (newSheetId === undefined) throw new Error("Failed to create sheet");

  // Write headers and formulas
  await sheets.spreadsheets.values.batchUpdate({
    spreadsheetId: SPREADSHEET_ID,
    requestBody: {
      valueInputOption: "USER_ENTERED",
      data: [
        // Headers
        {
          range: `'${sheetTitle}'!A1:F1`,
          values: [["תאריך", "הוצאה", "כמה", "קטגוריה", "כרטיס", "הערות"]],
        },
        // Summary labels and formulas
        {
          range: `'${sheetTitle}'!H4`,
          values: [['סכ"ה:']],
        },
        {
          range: `'${sheetTitle}'!I4`,
          values: [["=SUM(C:C)"]],
        },
        {
          range: `'${sheetTitle}'!H6:I8`,
          values: [
            ["הוצאות עינור:", '=SUMIF(E:E,"*עינור*",C:C)'],
            ["הוצאות זיו:", '=SUMIF(E:E,"*זיו*",C:C)'],
            ["הוצאות אחר:", "=I4-I6-I7"],
          ],
        },
        {
          range: `'${sheetTitle}'!H11:I12`,
          values: [
            [
              "הוצאות דירה:",
              '=SUMIF(D:D,"*מגורים*",C:C)+SUMIF(D:D,"*בית*",C:C)',
            ],
            ["הוצאות חופשה:", '=SUMIF(D:D,"*חופשה*",C:C)'],
          ],
        },
        // Category QUERY
        {
          range: `'${sheetTitle}'!K4`,
          values: [
            [
              "=QUERY(A:F,\"SELECT D, SUM(C) WHERE D IS NOT NULL GROUP BY D ORDER BY SUM(C) DESC LABEL SUM(C) ''\",1)",
            ],
          ],
        },
        // Card QUERY
        {
          range: `'${sheetTitle}'!K40`,
          values: [
            [
              "=QUERY(A:F,\"SELECT E, SUM(C) WHERE E IS NOT NULL GROUP BY E ORDER BY SUM(C) DESC LABEL SUM(C) ''\",1)",
            ],
          ],
        },
      ],
    },
  });

  // Set data validations and freeze row 1 — use config-driven values
  let config: AppConfig;
  try {
    config = await getAppConfig();
  } catch {
    config = {
      monthlyCategories: [],
      vacationCategories: [],
      cardsEinor: [],
      cardsZiv: [],
      cardsShared: [],
      summaryCards: [],
    };
  }
  const categoryValues = config.monthlyCategories.map((c) => c.name);
  const cardValues = [
    ...config.cardsEinor,
    ...config.cardsZiv,
    ...config.cardsShared,
  ];

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: SPREADSHEET_ID,
    requestBody: {
      requests: [
        // Freeze first row
        {
          updateSheetProperties: {
            properties: {
              sheetId: newSheetId,
              gridProperties: { frozenRowCount: 1 },
            },
            fields: "gridProperties.frozenRowCount",
          },
        },
        // Category validation D2:D219
        {
          setDataValidation: {
            range: {
              sheetId: newSheetId,
              startRowIndex: 1,
              endRowIndex: 219,
              startColumnIndex: 3,
              endColumnIndex: 4,
            },
            rule: {
              condition: {
                type: "ONE_OF_LIST",
                values: categoryValues.map((v) => ({ userEnteredValue: v })),
              },
              showCustomUi: true,
              strict: false,
            },
          },
        },
        // Card validation E2:E219
        {
          setDataValidation: {
            range: {
              sheetId: newSheetId,
              startRowIndex: 1,
              endRowIndex: 219,
              startColumnIndex: 4,
              endColumnIndex: 5,
            },
            rule: {
              condition: {
                type: "ONE_OF_LIST",
                values: cardValues.map((v) => ({ userEnteredValue: v })),
              },
              showCustomUi: true,
              strict: false,
            },
          },
        },
      ],
    },
  });

  // Mark "V" in the annual sheet for this month
  const monthIndex = HEBREW_MONTHS.indexOf(
    hebrewMonth as (typeof HEBREW_MONTHS)[number],
  );

  if (monthIndex !== -1) {
    const annualSheet = `שנתי ${yearSuffix}`;
    // Column B=Jan(1), C=Feb(2), ..., M=Dec(11) => col index = monthIndex + 1 (B=2 in 1-based)
    const colLetter = String.fromCharCode(66 + monthIndex); // B=66
    try {
      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `'${annualSheet}'!${colLetter}29`,
        valueInputOption: "USER_ENTERED",
        requestBody: { values: [["V"]] },
      });
    } catch {
      // Annual sheet might not exist yet, that's OK
    }
  }
}

// ---- Settings functions ----

/**
 * Migrate settings categories that lack colors: scan monthly/vacation sheets
 * to collect actual category names and rewrite the settings column.
 * Only runs when entries are missing the `|#color` suffix (one-time migration).
 */
async function migrateCategoryColors(): Promise<void> {
  const sheets = getSheets();

  const res = await sheets.spreadsheets.values.batchGet({
    spreadsheetId: SPREADSHEET_ID,
    ranges: [
      `'${SETTINGS_SHEET_NAME}'!${SETTINGS_RANGE_MONTHLY}`,
      `'${SETTINGS_SHEET_NAME}'!${SETTINGS_RANGE_VACATION}`,
    ],
  });

  const valueRanges = res.data.valueRanges ?? [];

  const needsMigration = (rows: string[][] | undefined) =>
    (rows ?? []).some((row) => {
      const raw = row[0]?.trim();
      if (!raw) return false;
      const pipeIdx = raw.lastIndexOf("|");
      return !(pipeIdx > 0 && raw[pipeIdx + 1] === "#");
    });

  const monthlyNeedsColors = needsMigration(
    (valueRanges[0]?.values as string[][] | undefined) ?? undefined,
  );
  const vacationNeedsColors = needsMigration(
    (valueRanges[1]?.values as string[][] | undefined) ?? undefined,
  );

  if (!monthlyNeedsColors && !vacationNeedsColors) return;

  const COLOR_PALETTE = [
    "#4caf50",
    "#26a69a",
    "#78909c",
    "#e8a838",
    "#ef5350",
    "#e57373",
    "#ab47bc",
    "#26c6da",
    "#5c6bc0",
    "#8d6e63",
    "#f0c060",
    "#ce93d8",
    "#607d8b",
    "#bdbdbd",
    "#42a5f5",
    "#a1887f",
    "#1e88e5",
    "#9e9e9e",
    "#5c9ece",
    "#2196f3",
    "#90a4ae",
    "#f06292",
    "#ffab91",
    "#84cc16",
  ];

  /** Add colors to existing entries in-place (no rewrite, no new categories) */
  function addColorsToEntries(rows: string[][] | undefined): string[][] | null {
    const entries = rows ?? [];
    if (entries.length === 0) return null;
    let colorIdx = 0;
    return entries.map((row) => {
      const raw = row[0]?.trim() ?? "";
      if (!raw) return [raw];
      const pipeIdx = raw.lastIndexOf("|");
      if (pipeIdx > 0 && raw[pipeIdx + 1] === "#") {
        // Already has a color
        colorIdx++;
        return [raw];
      }
      // Assign a color from the palette
      const color = COLOR_PALETTE[colorIdx % COLOR_PALETTE.length];
      colorIdx++;
      return [`${raw}|${color}`];
    });
  }

  const updates: { range: string; values: string[][] }[] = [];

  if (monthlyNeedsColors) {
    const migrated = addColorsToEntries(
      valueRanges[0]?.values as string[][] | undefined,
    );
    if (migrated) {
      updates.push({
        range: `'${SETTINGS_SHEET_NAME}'!A2:A${migrated.length + 1}`,
        values: migrated,
      });
    }
  }

  if (vacationNeedsColors) {
    const migrated = addColorsToEntries(
      valueRanges[1]?.values as string[][] | undefined,
    );
    if (migrated) {
      updates.push({
        range: `'${SETTINGS_SHEET_NAME}'!B2:B${migrated.length + 1}`,
        values: migrated,
      });
    }
  }

  if (updates.length > 0) {
    await sheets.spreadsheets.values.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      requestBody: {
        valueInputOption: "USER_ENTERED",
        data: updates,
      },
    });
  }
}

/**
 * Ensure the settings sheet exists. Creates it with default values if missing.
 */
export async function ensureSettingsSheet(): Promise<void> {
  const sheets = getSheets();
  const res = await sheets.spreadsheets.get({
    spreadsheetId: SPREADSHEET_ID,
    fields: "sheets.properties.title",
  });
  const titles = res.data.sheets?.map((s) => s.properties?.title ?? "") ?? [];

  if (titles.includes(SETTINGS_SHEET_NAME)) {
    // Migrate plain-text entries (without colors) to name|#color format
    await migrateCategoryColors();
    return;
  }

  // Create the sheet
  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: SPREADSHEET_ID,
    requestBody: {
      requests: [
        {
          addSheet: {
            properties: {
              title: SETTINGS_SHEET_NAME,
              rightToLeft: true,
            },
          },
        },
      ],
    },
  });

  // Seed with headers only — categories will be synced from existing sheets
  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: `'${SETTINGS_SHEET_NAME}'!A1:G1`,
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [
        [
          "קטגוריות חודשיות",
          "קטגוריות חופשה",
          "כרטיסי עינור",
          "כרטיסי זיו",
          "כרטיסי משותף",
          "כרטיסי סיכום",
          "קטגוריות לסיכום",
        ],
      ],
    },
  });

  // Migrate categories from existing monthly/vacation sheets
  await migrateCategoryColors();
}

/**
 * Read app configuration from the settings sheet.
 */
export async function getAppConfig(): Promise<AppConfig> {
  const sheets = getSheets();

  const res = await sheets.spreadsheets.values.batchGet({
    spreadsheetId: SPREADSHEET_ID,
    ranges: [
      `'${SETTINGS_SHEET_NAME}'!${SETTINGS_RANGE_MONTHLY}`,
      `'${SETTINGS_SHEET_NAME}'!${SETTINGS_RANGE_VACATION}`,
      `'${SETTINGS_SHEET_NAME}'!${SETTINGS_RANGE_CARDS_EINOR}`,
      `'${SETTINGS_SHEET_NAME}'!${SETTINGS_RANGE_CARDS_ZIV}`,
      `'${SETTINGS_SHEET_NAME}'!${SETTINGS_RANGE_CARDS_SHARED}`,
      `'${SETTINGS_SHEET_NAME}'!${SETTINGS_RANGE_SUMMARY_LABELS}`,
      `'${SETTINGS_SHEET_NAME}'!${SETTINGS_RANGE_SUMMARY_CATEGORIES}`,
    ],
  });

  const valueRanges = res.data.valueRanges ?? [];

  const extractStrings = (idx: number): string[] =>
    (valueRanges[idx]?.values ?? [])
      .map((row) => row[0]?.trim())
      .filter(Boolean);

  const extractCategories = (idx: number): CategoryItem[] =>
    (valueRanges[idx]?.values ?? [])
      .map((row) => row[0]?.trim())
      .filter(Boolean)
      .map((raw: string) => {
        const pipeIdx = raw.lastIndexOf("|");
        if (pipeIdx > 0 && raw[pipeIdx + 1] === "#") {
          return { name: raw.slice(0, pipeIdx), color: raw.slice(pipeIdx + 1) };
        }
        return { name: raw, color: DEFAULT_CATEGORY_COLOR };
      });

  const labels = extractStrings(5);
  const catStrs = extractStrings(6);
  const summaryCards: SummaryCard[] = [];
  for (let i = 0; i < labels.length; i++) {
    summaryCards.push({
      label: labels[i],
      categories: (catStrs[i] ?? "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    });
  }

  return {
    monthlyCategories: extractCategories(0),
    vacationCategories: extractCategories(1),
    cardsEinor: extractStrings(2),
    cardsZiv: extractStrings(3),
    cardsShared: extractStrings(4),
    summaryCards,
  };
}

/**
 * Add a config item to the first empty cell in the given column.
 */
export async function addConfigItem(
  column: "A" | "B" | "C" | "D" | "E",
  value: string,
): Promise<void> {
  const sheets = getSheets();

  // Read current values to find first empty row
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `'${SETTINGS_SHEET_NAME}'!${column}2:${column}100`,
  });
  const values = res.data.values ?? [];
  let emptyRow = 2;
  for (let i = 0; i < values.length; i++) {
    if (!values[i] || !values[i][0]?.trim()) {
      emptyRow = i + 2;
      break;
    }
    emptyRow = i + 3; // next row after last filled
  }

  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: `'${SETTINGS_SHEET_NAME}'!${column}${emptyRow}`,
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [[value]] },
  });
}

/**
 * Remove a config item by finding and clearing the cell.
 */
export async function removeConfigItem(
  column: "A" | "B" | "C" | "D" | "E",
  value: string,
): Promise<void> {
  const sheets = getSheets();

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `'${SETTINGS_SHEET_NAME}'!${column}2:${column}100`,
  });
  const values = res.data.values ?? [];
  for (let i = 0; i < values.length; i++) {
    if (values[i]?.[0]?.trim() === value) {
      await sheets.spreadsheets.values.clear({
        spreadsheetId: SPREADSHEET_ID,
        range: `'${SETTINGS_SHEET_NAME}'!${column}${i + 2}`,
      });
      return;
    }
  }
}

/**
 * Add a category item with name and color to the settings sheet.
 */
export async function addCategoryConfigItem(
  column: "A" | "B",
  name: string,
  color: string,
): Promise<void> {
  await addConfigItem(column, `${name}|${color}`);
}

/**
 * Remove a category item by matching the name portion (before the pipe).
 */
export async function removeCategoryConfigItem(
  column: "A" | "B",
  name: string,
): Promise<void> {
  const sheets = getSheets();

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `'${SETTINGS_SHEET_NAME}'!${column}2:${column}100`,
  });
  const values = res.data.values ?? [];
  for (let i = 0; i < values.length; i++) {
    const raw = values[i]?.[0]?.trim();
    if (!raw) continue;
    const pipeIdx = raw.lastIndexOf("|");
    const cellName =
      pipeIdx > 0 && raw[pipeIdx + 1] === "#" ? raw.slice(0, pipeIdx) : raw;
    if (cellName === name) {
      await sheets.spreadsheets.values.clear({
        spreadsheetId: SPREADSHEET_ID,
        range: `'${SETTINGS_SHEET_NAME}'!${column}${i + 2}`,
      });
      return;
    }
  }
}

/**
 * Add a summary card (label in F, categories in G) to the first empty row.
 */
export async function addSummaryCardItem(
  label: string,
  categories: string,
): Promise<void> {
  const sheets = getSheets();

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `'${SETTINGS_SHEET_NAME}'!F2:F100`,
  });
  const values = res.data.values ?? [];
  let emptyRow = 2;
  for (let i = 0; i < values.length; i++) {
    if (!values[i] || !values[i][0]?.trim()) {
      emptyRow = i + 2;
      break;
    }
    emptyRow = i + 3;
  }

  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: `'${SETTINGS_SHEET_NAME}'!F${emptyRow}:G${emptyRow}`,
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [[label, categories]] },
  });
}

/**
 * Remove a summary card by finding the label in F and clearing both F and G.
 */
export async function removeSummaryCardItem(label: string): Promise<void> {
  const sheets = getSheets();

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `'${SETTINGS_SHEET_NAME}'!F2:F100`,
  });
  const values = res.data.values ?? [];
  for (let i = 0; i < values.length; i++) {
    if (values[i]?.[0]?.trim() === label) {
      await sheets.spreadsheets.values.clear({
        spreadsheetId: SPREADSHEET_ID,
        range: `'${SETTINGS_SHEET_NAME}'!F${i + 2}:G${i + 2}`,
      });
      return;
    }
  }
}

/**
 * Update a summary card: find by old label in F, overwrite F and G with new values.
 */
export async function updateSummaryCardItem(
  oldLabel: string,
  newLabel: string,
  categories: string,
): Promise<void> {
  const sheets = getSheets();

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `'${SETTINGS_SHEET_NAME}'!F2:F100`,
  });
  const values = res.data.values ?? [];
  for (let i = 0; i < values.length; i++) {
    if (values[i]?.[0]?.trim() === oldLabel) {
      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `'${SETTINGS_SHEET_NAME}'!F${i + 2}:G${i + 2}`,
        valueInputOption: "USER_ENTERED",
        requestBody: { values: [[newLabel, categories]] },
      });
      return;
    }
  }
}

/**
 * Rename a category: update settings sheet + find-and-replace across all transaction sheets.
 */
export async function renameCategoryInSheets(
  column: "A" | "B",
  oldName: string,
  newName: string,
): Promise<void> {
  const sheets = getSheets();

  // 1. Update the settings sheet cell
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `'${SETTINGS_SHEET_NAME}'!${column}2:${column}100`,
  });
  const values = res.data.values ?? [];
  for (let i = 0; i < values.length; i++) {
    const raw = values[i]?.[0]?.trim();
    if (!raw) continue;
    const pipeIdx = raw.lastIndexOf("|");
    const cellName =
      pipeIdx > 0 && raw[pipeIdx + 1] === "#" ? raw.slice(0, pipeIdx) : raw;
    if (cellName === oldName) {
      const color =
        pipeIdx > 0 && raw[pipeIdx + 1] === "#"
          ? raw.slice(pipeIdx + 1)
          : DEFAULT_CATEGORY_COLOR;
      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `'${SETTINGS_SHEET_NAME}'!${column}${i + 2}`,
        valueInputOption: "USER_ENTERED",
        requestBody: { values: [[`${newName}|${color}`]] },
      });
      break;
    }
  }

  // 2. Find-and-replace across all transaction sheets
  const allSheets = await listSheets();
  const targetSheets = allSheets.filter(
    (s) => s.type === "monthly" || s.type === "vacation",
  );

  for (const sheet of targetSheets) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      requestBody: {
        requests: [
          {
            findReplace: {
              find: oldName,
              replacement: newName,
              sheetId: sheet.sheetId,
              matchEntireCell: true,
              allSheets: false,
            },
          },
        ],
      },
    });
  }
}

// ---- Vacation functions ----

/**
 * Fetch vacation data for a vacation sheet.
 * Note: vacation sheets have columns D=card, E=category (swapped from monthly).
 */
export async function getVacationData(title: string): Promise<VacationData> {
  const sheets = getSheets();

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `'${title}'!A2:F219`,
  });

  const rawRows = res.data.values ?? [];
  const transactions: Transaction[] = rawRows
    .map((row, idx) => ({
      row: idx + 2,
      date: row[0] ?? "",
      expense: row[1] ?? "",
      amount: parseNumber(row[2]),
      card: row[3] ?? "", // D = card in vacation
      category: row[4] ?? "", // E = category in vacation
      notes: row[5] ?? "",
    }))
    .filter((t) => t.date || t.expense || t.amount);

  const total = transactions.reduce((sum, t) => sum + t.amount, 0);

  // Category breakdown
  const catMap = new Map<string, number>();
  for (const t of transactions) {
    if (t.category) {
      catMap.set(t.category, (catMap.get(t.category) ?? 0) + t.amount);
    }
  }
  const categories: CategoryBreakdown[] = [...catMap.entries()]
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);

  // Month breakdown
  const monthMap = new Map<string, number>();
  for (const t of transactions) {
    if (t.date) {
      const monthKey = extractMonthFromDate(t.date);
      if (monthKey) {
        monthMap.set(monthKey, (monthMap.get(monthKey) ?? 0) + t.amount);
      }
    }
  }
  const monthBreakdown = [...monthMap.entries()]
    .map(([month, amount]) => ({ month, amount }))
    .sort((a, b) => a.month.localeCompare(b.month));

  return { title, transactions, total, categories, monthBreakdown };
}

/**
 * Extract a Hebrew month title from a date string like "15/1" or "15/01".
 * Returns e.g. "ינואר 26" based on current year.
 */
function extractMonthFromDate(dateStr: string): string | null {
  const parts = dateStr.split("/");
  if (parts.length < 2) return null;
  const month = parseInt(parts[1], 10);
  if (isNaN(month) || month < 1 || month > 12) return null;
  const yearSuffix = new Date().getFullYear() % 100;
  // If we have a year part (e.g., "15/1/26"), use it
  let yr = yearSuffix;
  if (parts.length >= 3) {
    const parsedYear = parseInt(parts[2], 10);
    if (!isNaN(parsedYear))
      yr = parsedYear < 100 ? parsedYear : parsedYear % 100;
  }
  return `${HEBREW_MONTHS[month - 1]} ${yr}`;
}

/**
 * Create a vacation sheet with appropriate headers and validations.
 */
export async function createVacationSheet(
  name: string,
  yearSuffix: number,
): Promise<void> {
  const sheets = getSheets();
  const sheetTitle = `${name} ${yearSuffix}`;

  const addSheetRes = await sheets.spreadsheets.batchUpdate({
    spreadsheetId: SPREADSHEET_ID,
    requestBody: {
      requests: [
        {
          addSheet: {
            properties: {
              title: sheetTitle,
              rightToLeft: true,
            },
          },
        },
      ],
    },
  });

  const newSheetId =
    addSheetRes.data.replies?.[0]?.addSheet?.properties?.sheetId;
  if (newSheetId === undefined) throw new Error("Failed to create sheet");

  // Write headers and SUM formula
  // Note: vacation has D=card, E=category (swapped)
  await sheets.spreadsheets.values.batchUpdate({
    spreadsheetId: SPREADSHEET_ID,
    requestBody: {
      valueInputOption: "USER_ENTERED",
      data: [
        {
          range: `'${sheetTitle}'!A1:F1`,
          values: [["תאריך", "הוצאה", "כמה", "כרטיס", "קטגוריה", "הערות"]],
        },
        {
          range: `'${sheetTitle}'!H4`,
          values: [['סכ"ה:']],
        },
        {
          range: `'${sheetTitle}'!I4`,
          values: [["=SUM(C:C)"]],
        },
        {
          range: `'${sheetTitle}'!K4`,
          values: [
            [
              "=QUERY(A:F,\"SELECT E, SUM(C) WHERE E IS NOT NULL GROUP BY E ORDER BY SUM(C) DESC LABEL SUM(C) ''\",1)",
            ],
          ],
        },
      ],
    },
  });

  // Read config for validations
  let config: AppConfig;
  try {
    config = await getAppConfig();
  } catch {
    config = {
      monthlyCategories: [],
      vacationCategories: [],
      cardsEinor: [],
      cardsZiv: [],
      cardsShared: [],
      summaryCards: [],
    };
  }

  const allCards = [
    ...config.cardsEinor,
    ...config.cardsZiv,
    ...config.cardsShared,
  ];

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: SPREADSHEET_ID,
    requestBody: {
      requests: [
        {
          updateSheetProperties: {
            properties: {
              sheetId: newSheetId,
              gridProperties: { frozenRowCount: 1 },
            },
            fields: "gridProperties.frozenRowCount",
          },
        },
        // Card validation D2:D219 (column D = card in vacation)
        {
          setDataValidation: {
            range: {
              sheetId: newSheetId,
              startRowIndex: 1,
              endRowIndex: 219,
              startColumnIndex: 3,
              endColumnIndex: 4,
            },
            rule: {
              condition: {
                type: "ONE_OF_LIST",
                values: allCards.map((v) => ({ userEnteredValue: v })),
              },
              showCustomUi: true,
              strict: false,
            },
          },
        },
        // Category validation E2:E219 (column E = category in vacation)
        {
          setDataValidation: {
            range: {
              sheetId: newSheetId,
              startRowIndex: 1,
              endRowIndex: 219,
              startColumnIndex: 4,
              endColumnIndex: 5,
            },
            rule: {
              condition: {
                type: "ONE_OF_LIST",
                values: config.vacationCategories
                  .map((c) => c.name)
                  .map((v) => ({
                    userEnteredValue: v,
                  })),
              },
              showCustomUi: true,
              strict: false,
            },
          },
        },
      ],
    },
  });
}

/**
 * Get vacation summary rows for a given month.
 * Scans all vacation sheets for transactions whose dates fall in the given month.
 */
export async function getVacationRowsForMonth(
  monthTitle: string,
  vacationSheets: SheetInfo[],
): Promise<VacationMonthRow[]> {
  if (vacationSheets.length === 0) return [];

  const sheets = getSheets();
  const results: VacationMonthRow[] = [];

  // Fetch transaction data from all vacation sheets in parallel
  const ranges = vacationSheets.map((v) => `'${v.title}'!A2:F219`);
  const res = await sheets.spreadsheets.values.batchGet({
    spreadsheetId: SPREADSHEET_ID,
    ranges,
  });

  const valueRanges = res.data.valueRanges ?? [];

  for (let i = 0; i < vacationSheets.length; i++) {
    const rawRows = valueRanges[i]?.values ?? [];
    let amount = 0;
    for (const row of rawRows) {
      const date = row[0] ?? "";
      const txAmount = parseNumber(row[2]);
      if (date && txAmount) {
        const monthKey = extractMonthFromDate(date);
        if (monthKey === monthTitle) {
          amount += txAmount;
        }
      }
    }
    if (amount > 0) {
      results.push({
        vacationName: vacationSheets[i].title,
        vacationSheetTitle: vacationSheets[i].title,
        vacationSheetId: vacationSheets[i].sheetId,
        amount,
      });
    }
  }

  return results;
}

// ---- Auto-creation functions ----

/**
 * Ensure current month sheet exists.
 */
export async function ensureCurrentSheets(
  existingSheets: SheetInfo[],
): Promise<boolean> {
  const now = new Date();
  const monthName = HEBREW_MONTHS[now.getMonth()];
  const yearSuffix = now.getFullYear() % 100;
  const currentMonthTitle = `${monthName} ${yearSuffix}`;

  const hasMonth = existingSheets.some((s) => s.title === currentMonthTitle);

  if (!hasMonth) {
    await createMonthSheet(monthName, yearSuffix);
    return true;
  }

  return false;
}
