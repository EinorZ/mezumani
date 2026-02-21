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
  RecurringExpense,
  CategoryMapping,
  ExpenseRenameRule,
  IncomeSource,
  StockConfig,
  StockDefinition,
  StockGoal,
  BrokerConfig,
  LabelAllocation,
  StockTransaction,
  PriceSource,
  StockCurrency,
  InvestmentTerm,
  TransactionType,
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
  SETTINGS_RANGE_RECURRING_NAMES,
  SETTINGS_RANGE_RECURRING_DATA,
  SETTINGS_RANGE_CATEGORY_MAP_NAMES,
  SETTINGS_RANGE_CATEGORY_MAP_CATEGORIES,
  SETTINGS_RANGE_RENAME_RULE_NAMES,
  SETTINGS_RANGE_RENAME_RULE_KEYWORDS,
  SETTINGS_RANGE_INCOME_NAMES,
  SETTINGS_RANGE_INCOME_DATA,
  SETTINGS_RANGE_STOCK_SYMBOLS,
  SETTINGS_RANGE_STOCK_NAMES,
  SETTINGS_RANGE_STOCK_SOURCES,
  SETTINGS_RANGE_STOCK_CURRENCIES,
  SETTINGS_RANGE_GOAL_TERMS,
  SETTINGS_RANGE_GOAL_LABELS,
  SETTINGS_RANGE_GOAL_AMOUNTS,
  SETTINGS_RANGE_BROKER_NAMES,
  SETTINGS_RANGE_BROKER_MGMT_FEES,
  SETTINGS_RANGE_BROKER_PURCHASE_FEES,
  SETTINGS_RANGE_STOCK_LABELS,
  SETTINGS_RANGE_ALLOC_LABELS,
  SETTINGS_RANGE_ALLOC_PERCENTS,
  SETTINGS_RANGE_ALLOC_STOCKS,
  SETTINGS_RANGE_ALLOC_COLORS,
  STOCKS_SHEET_NAME,
  STOCK_SHEET_HEADERS,
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
const STOCKS_SPREADSHEET_ID =
  process.env.GOOGLE_STOCKS_SPREADSHEET_ID ?? SPREADSHEET_ID;

/**
 * List all sheet names and classify them.
 */
export async function listSheets() {
  const sheets = getSheets();
  const res = await sheets.spreadsheets.get({
    spreadsheetId: SPREADSHEET_ID,
    fields: "sheets.properties.sheetId,sheets.properties.title",
  });

  console.log(res.data.sheets);
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

export async function moveSheet(
  sheetId: number,
  newIndex: number,
): Promise<void> {
  const sheets = getSheets();
  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: SPREADSHEET_ID,
    requestBody: {
      requests: [
        {
          updateSheetProperties: {
            properties: { sheetId, index: newIndex },
            fields: "index",
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

  const res = await sheets.spreadsheets.values.batchGet({
    spreadsheetId: SPREADSHEET_ID,
    ranges: [`'${title}'!A2:F`, `'${title}'!H1:I17`],
  });

  const valueRanges = res.data.valueRanges ?? [];

  const rawTransactions = valueRanges[0]?.values ?? [];
  const transactions: Transaction[] = rawTransactions
    .map((row, idx) => {
      const rawF = row[5] ?? "";
      const confirmedAmount = parseNumber(row[2]);
      const tentativeAmount = parseNumber(rawF);
      const tentative = !confirmedAmount && tentativeAmount > 0;
      return {
        row: idx + 2,
        date: row[0] ?? "",
        expense: row[1] ?? "",
        amount: tentative ? tentativeAmount : confirmedAmount,
        category: row[3] ?? "",
        card: row[4] ?? "",
        notes: tentativeAmount > 0 ? "" : rawF,
        tentative: tentative || undefined,
      };
    })
    .filter((t) => t.date || t.expense || t.amount);

  // Compute summary from transactions (exclude tentative)
  const confirmedTransactions = transactions.filter((t) => !t.tentative);
  const total = confirmedTransactions.reduce((s, t) => s + t.amount, 0);
  const summaryCardResults = summaryCards.map((sc) => {
    const catSet = new Set(sc.categories);
    const matching = confirmedTransactions.filter((t) =>
      catSet.has(t.category),
    );
    const amount = matching.reduce((s, t) => s + t.amount, 0);
    return { label: sc.label, amount, count: matching.length };
  });
  const summary: MonthSummary = { total, cards: summaryCardResults };

  // Category breakdown (exclude tentative)
  const catMap = new Map<string, number>();
  for (const t of confirmedTransactions) {
    if (t.category) {
      catMap.set(t.category, (catMap.get(t.category) ?? 0) + t.amount);
    }
  }
  const categories: CategoryBreakdown[] = [...catMap.entries()]
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);

  // Card breakdown (exclude tentative)
  const cardMap = new Map<string, number>();
  for (const t of confirmedTransactions) {
    if (t.card) {
      cardMap.set(t.card, (cardMap.get(t.card) ?? 0) + t.amount);
    }
  }
  const cards: CardBreakdown[] = [...cardMap.entries()]
    .map(([card, amount]) => ({ card, amount }))
    .sort((a, b) => b.amount - a.amount);

  // Parse income entries from H1:I (H1=header, H2+ = sources)
  const rawIncome = valueRanges[1]?.values ?? [];
  const income: IncomeSource[] = rawIncome
    .slice(1) // skip header row
    .map((row) => ({
      name: row[0]?.trim() ?? "",
      amount: parseNumber(row[1]),
    }))
    .filter((e) => e.name);
  const totalIncome = income.reduce((s, e) => s + e.amount, 0);

  return {
    title,
    transactions,
    summary,
    categories,
    cards,
    income,
    totalIncome,
  };
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

  // Batch-fetch transactions and income from all monthly sheets
  const ranges = monthlySheets.flatMap((s) => [
    `'${s.title}'!A2:F`,
    `'${s.title}'!H1:I17`,
  ]);
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

  let totalIncome = 0;

  for (let i = 0; i < monthlySheets.length; i++) {
    const monthIndex = monthlySheets[i].monthIndex ?? 0;
    const rawRows = valueRanges[i * 2]?.values ?? [];
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

    // Parse income for this month
    const rawIncome = valueRanges[i * 2 + 1]?.values ?? [];
    for (const row of rawIncome.slice(1)) {
      const name = row[0]?.trim() ?? "";
      const amount = parseNumber(row[1]);
      if (name && amount) totalIncome += amount;
    }
  }

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

  const totalSavings = totalIncome - (grandTotal > 0 ? grandTotal : 0);

  return { year: yearSuffix, rows, totals, totalIncome, totalSavings };
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
 * Append a transaction after the last non-empty row.
 * Uses findFirstEmptyRow + update to write to exact columns A-F,
 * avoiding the append API which can misdetect table boundaries
 * when summary formulas exist in other columns.
 */
export async function appendTransaction(
  title: string,
  values: string[],
): Promise<number> {
  const row = await findFirstEmptyRow(title);
  await updateTransaction(title, row, values);
  return row;
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
 * Find the row number of an existing transaction by expense name.
 * Returns the sheet row number (1-based) or null if not found.
 */
export async function findTransactionRowByExpense(
  title: string,
  expenseName: string,
): Promise<number | null> {
  const sheets = getSheets();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `'${title}'!B2:B`,
  });
  const values = res.data.values ?? [];
  for (let i = 0; i < values.length; i++) {
    if ((values[i]?.[0] ?? "").trim() === expenseName.trim()) {
      return i + 2; // row number (1-based, data starts at row 2)
    }
  }
  return null;
}

/**
 * Import multiple transactions in batch (minimal API calls).
 * - Fetches existing expense names once to find recurring rows to update.
 * - Uses batchUpdate for existing rows and a single append for new rows.
 */
export async function batchImportTransactions(
  title: string,
  transactions: {
    date: string;
    expense: string;
    amount: number;
    category: string;
    card: string;
    notes: string;
    updateExisting?: boolean;
  }[],
): Promise<number> {
  if (transactions.length === 0) return 0;
  const sheets = getSheets();

  const hasUpdates = transactions.some((t) => t.updateExisting);

  // Only fetch existing names if we have recurring rows to update
  const existingRows: { name: string; card: string; row: number }[] = [];
  if (hasUpdates) {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `'${title}'!B2:E`,
    });
    const rows = res.data.values ?? [];
    for (let i = 0; i < rows.length; i++) {
      const name = (rows[i]?.[0] ?? "").trim();
      const card = (rows[i]?.[3] ?? "").trim(); // column E (index 3 relative to B)
      if (name) existingRows.push({ name, card, row: i + 2 });
    }
  }

  // Find existing row for a recurring expense: exact match first, then partial match
  function findExistingRow(expense: string, card: string): number | undefined {
    const trimmed = expense.trim();
    const lower = trimmed.toLowerCase();
    // Exact name match
    const exact = existingRows.find((r) => r.name === trimmed);
    if (exact) return exact.row;
    // Partial match: existing name contains import name or vice versa, prefer same card
    const partialSameCard = existingRows.find(
      (r) =>
        r.card === card &&
        (r.name.toLowerCase().includes(lower) ||
          lower.includes(r.name.toLowerCase())),
    );
    if (partialSameCard) return partialSameCard.row;
    const partialAnyCard = existingRows.find(
      (r) =>
        r.name.toLowerCase().includes(lower) ||
        lower.includes(r.name.toLowerCase()),
    );
    if (partialAnyCard) return partialAnyCard.row;
    return undefined;
  }

  // Split: recurring with updateExisting try to find existing row, regular always append
  const updateData: { range: string; values: string[][] }[] = [];
  const appendRows: string[][] = [];

  for (const data of transactions) {
    const values = [
      data.date,
      data.expense,
      String(data.amount),
      data.category,
      data.card,
      data.notes,
    ];
    const existingRow = data.updateExisting
      ? findExistingRow(data.expense, data.card)
      : undefined;
    if (existingRow) {
      updateData.push({
        range: `'${title}'!A${existingRow}:F${existingRow}`,
        values: [values],
      });
    } else {
      appendRows.push(values);
    }
  }

  // Batch update existing rows in one call
  if (updateData.length > 0) {
    await sheets.spreadsheets.values.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      requestBody: {
        valueInputOption: "USER_ENTERED",
        data: updateData.map((d) => ({ range: d.range, values: d.values })),
      },
    });
  }

  // Append all new rows using explicit row positions
  if (appendRows.length > 0) {
    const startRow = await findFirstEmptyRow(title);
    const data = appendRows.map((row, i) => ({
      range: `'${title}'!A${startRow + i}:F${startRow + i}`,
      values: [row],
    }));
    await sheets.spreadsheets.values.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      requestBody: { valueInputOption: "USER_ENTERED", data },
    });
  }

  return transactions.length;
}

/**
 * Batch-update only category and/or card fields for multiple rows.
 * Uses a single batchUpdate API call.
 * Monthly: category=col D, card=col E.
 * Vacation: category=col E, card=col D (swapped).
 */
export async function batchUpdateFields(
  title: string,
  isVacation: boolean,
  updates: { row: number; category?: string; card?: string }[],
): Promise<void> {
  if (updates.length === 0) return;
  const sheets = getSheets();

  const data: { range: string; values: string[][] }[] = [];
  for (const u of updates) {
    if (u.category !== undefined) {
      const col = isVacation ? "E" : "D";
      data.push({ range: `'${title}'!${col}${u.row}`, values: [[u.category]] });
    }
    if (u.card !== undefined) {
      const col = isVacation ? "D" : "E";
      data.push({ range: `'${title}'!${col}${u.row}`, values: [[u.card]] });
    }
  }

  if (data.length === 0) return;

  await sheets.spreadsheets.values.batchUpdate({
    spreadsheetId: SPREADSHEET_ID,
    requestBody: {
      valueInputOption: "USER_ENTERED",
      data,
    },
  });
}

/**
 * Batch-toggle the tentative flag by moving amounts between C and F.
 * Make tentative: move C → F, clear C.
 * Confirm: move F → C, clear F.
 */
export async function batchToggleTentativeFlag(
  title: string,
  rows: number[],
  tentative: boolean,
): Promise<void> {
  if (rows.length === 0) return;
  const sheets = getSheets();

  // Read C and F for all rows
  const ranges = rows.flatMap((r) => [`'${title}'!C${r}`, `'${title}'!F${r}`]);
  const res = await sheets.spreadsheets.values.batchGet({
    spreadsheetId: SPREADSHEET_ID,
    ranges,
  });
  const valueRanges = res.data.valueRanges ?? [];

  const data: { range: string; values: string[][] }[] = [];
  for (let i = 0; i < rows.length; i++) {
    const cVal = valueRanges[i * 2]?.values?.[0]?.[0] ?? "";
    const fVal = valueRanges[i * 2 + 1]?.values?.[0]?.[0] ?? "";

    if (tentative && parseNumber(cVal) > 0) {
      // Move C → F, clear C
      data.push({ range: `'${title}'!C${rows[i]}`, values: [[""]] });
      data.push({ range: `'${title}'!F${rows[i]}`, values: [[cVal]] });
    } else if (!tentative && parseNumber(fVal) > 0) {
      // Move F → C, clear F
      data.push({ range: `'${title}'!C${rows[i]}`, values: [[fVal]] });
      data.push({ range: `'${title}'!F${rows[i]}`, values: [[""]] });
    }
  }

  if (data.length === 0) return;

  await sheets.spreadsheets.values.batchUpdate({
    spreadsheetId: SPREADSHEET_ID,
    requestBody: { valueInputOption: "USER_ENTERED", data },
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

  // Write headers, income, and formulas
  const formulaData: { range: string; values: string[][] }[] = [
    // Headers
    {
      range: `'${sheetTitle}'!A1:F1`,
      values: [["תאריך", "הוצאה", "כמה", "קטגוריה", "כרטיס", "משוער"]],
    },
    // Income header at H1
    {
      range: `'${sheetTitle}'!H1:I1`,
      values: [["הכנסות:", "=SUM(I2:I17)"]],
    },
  ];

  await sheets.spreadsheets.values.batchUpdate({
    spreadsheetId: SPREADSHEET_ID,
    requestBody: {
      valueInputOption: "USER_ENTERED",
      data: formulaData,
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
      recurringExpenses: [],
      categoryMappings: [],
      expenseRenameRules: [],
      incomeSources: [],
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

  // Auto-populate recurring expenses
  if (config.recurringExpenses.length > 0) {
    const recurringRows = config.recurringExpenses.map((exp) => [
      "",
      exp.name,
      exp.tentative ? "" : exp.amount ? String(exp.amount) : "",
      exp.category,
      exp.card,
      exp.tentative && exp.amount ? String(exp.amount) : "",
    ]);
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `'${sheetTitle}'!A2:F${recurringRows.length + 1}`,
      valueInputOption: "USER_ENTERED",
      requestBody: { values: recurringRows },
    });
  }

  // Auto-populate income sources at H2:I
  if (config.incomeSources.length > 0) {
    const incomeRows = config.incomeSources.map((src) => [
      src.name,
      String(src.amount),
    ]);
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `'${sheetTitle}'!H2:I${1 + incomeRows.length}`,
      valueInputOption: "USER_ENTERED",
      requestBody: { values: incomeRows },
    });
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
    range: `'${SETTINGS_SHEET_NAME}'!A1:O1`,
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
          "הוצאה קבועה",
          "פרטים",
          "שם הוצאה (מיפוי)",
          "קטגוריה (מיפוי)",
          "שם חדש (מיפוי)",
          "מילות מפתח",
          "מקור הכנסה",
          "פרטי הכנסה",
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
      `'${SETTINGS_SHEET_NAME}'!${SETTINGS_RANGE_RECURRING_NAMES}`,
      `'${SETTINGS_SHEET_NAME}'!${SETTINGS_RANGE_RECURRING_DATA}`,
      `'${SETTINGS_SHEET_NAME}'!${SETTINGS_RANGE_CATEGORY_MAP_NAMES}`,
      `'${SETTINGS_SHEET_NAME}'!${SETTINGS_RANGE_CATEGORY_MAP_CATEGORIES}`,
      `'${SETTINGS_SHEET_NAME}'!${SETTINGS_RANGE_RENAME_RULE_NAMES}`,
      `'${SETTINGS_SHEET_NAME}'!${SETTINGS_RANGE_RENAME_RULE_KEYWORDS}`,
      `'${SETTINGS_SHEET_NAME}'!${SETTINGS_RANGE_INCOME_NAMES}`,
      `'${SETTINGS_SHEET_NAME}'!${SETTINGS_RANGE_INCOME_DATA}`,
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

  // Parse recurring expenses from H (names) and I (data)
  const recurringNames = extractStrings(7);
  const recurringDataRows = (valueRanges[8]?.values ?? []).map(
    (row) => row[0]?.trim() ?? "",
  );
  const recurringExpenses: RecurringExpense[] = recurringNames.map(
    (name, i) => {
      const data = recurringDataRows[i] ?? "";
      const [amountStr, category, card, keywords, tentativeStr] =
        data.split("|");
      return {
        name,
        amount: parseNumber(amountStr ?? ""),
        category: category ?? "",
        card: card ?? "",
        keywords: keywords ?? "",
        tentative: tentativeStr === "1" || undefined,
      };
    },
  );

  // Parse category mappings from J (names) and K (categories)
  const mapNames = extractStrings(9);
  const mapCategories = extractStrings(10);
  const categoryMappings: CategoryMapping[] = mapNames
    .map((expenseName, i) => ({
      expenseName,
      category: mapCategories[i] ?? "",
    }))
    .filter((m) => m.category);

  // Parse expense rename rules from L (target names) and M (keywords)
  const renameTargetNames = extractStrings(11);
  const renameKeywords = extractStrings(12);
  const expenseRenameRules: ExpenseRenameRule[] = renameTargetNames
    .map((targetName, i) => ({
      targetName,
      keywords: renameKeywords[i] ?? "",
    }))
    .filter((r) => r.keywords);

  // Parse income sources from N (names) and O (data)
  const incomeNames = extractStrings(13);
  const incomeDataRows = (valueRanges[14]?.values ?? []).map(
    (row) => row[0]?.trim() ?? "",
  );
  const incomeSources: IncomeSource[] = incomeNames.map((name, i) => ({
    name,
    amount: parseNumber(incomeDataRows[i] ?? ""),
  }));

  return {
    monthlyCategories: extractCategories(0),
    vacationCategories: extractCategories(1),
    cardsEinor: extractStrings(2),
    cardsZiv: extractStrings(3),
    cardsShared: extractStrings(4),
    summaryCards,
    recurringExpenses,
    categoryMappings,
    expenseRenameRules,
    incomeSources,
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

export async function addSummaryCardItem(
  label: string,
  categories: string,
): Promise<void> {
  await addSettingsRow(SUMMARY_CARD_CONFIG, [label, categories]);
}

export async function removeSummaryCardItem(label: string): Promise<void> {
  await removeSettingsRow(SUMMARY_CARD_CONFIG, label);
}

export async function updateSummaryCardItem(
  oldLabel: string,
  newLabel: string,
  categories: string,
): Promise<void> {
  await updateSettingsRow(SUMMARY_CARD_CONFIG, oldLabel, [newLabel, categories]);
}

export async function addRecurringExpense(
  name: string,
  amount: number,
  category: string,
  card: string,
  keywords: string = "",
  tentative: boolean = false,
): Promise<void> {
  const dataStr = `${amount || ""}|${category}|${card}|${keywords}|${tentative ? "1" : ""}`;
  await addSettingsRow(RECURRING_CONFIG, [name, dataStr]);
}

export async function updateRecurringExpense(
  oldName: string,
  name: string,
  amount: number,
  category: string,
  card: string,
  keywords: string = "",
  tentative: boolean = false,
): Promise<void> {
  const dataStr = `${amount || ""}|${category}|${card}|${keywords}|${tentative ? "1" : ""}`;
  await updateSettingsRow(RECURRING_CONFIG, oldName, [name, dataStr]);
}

export async function removeRecurringExpense(name: string): Promise<void> {
  await removeSettingsRow(RECURRING_CONFIG, name);
}

/**
 * Reorder recurring expenses by rewriting all H+I rows.
 */
export async function reorderRecurringExpenses(
  items: RecurringExpense[],
): Promise<void> {
  const sheets = getSheets();

  // Clear existing data
  await sheets.spreadsheets.values.clear({
    spreadsheetId: SPREADSHEET_ID,
    range: `'${SETTINGS_SHEET_NAME}'!H2:I100`,
  });

  if (items.length === 0) return;

  // Write in new order
  const rows = items.map((exp) => [
    exp.name,
    `${exp.amount || ""}|${exp.category}|${exp.card}|${exp.keywords}|${exp.tentative ? "1" : ""}`,
  ]);
  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: `'${SETTINGS_SHEET_NAME}'!H2:I${rows.length + 1}`,
    valueInputOption: "USER_ENTERED",
    requestBody: { values: rows },
  });
}

export async function addCategoryMapping(
  expenseNames: string | string[],
  category: string,
): Promise<void> {
  const names = Array.isArray(expenseNames) ? expenseNames : [expenseNames];
  if (names.length === 0) return;

  if (names.length === 1) {
    await addSettingsRow(MAPPING_CONFIG, [names[0], category]);
    return;
  }

  // Multiple names: batch write
  const sheets = getSheets();
  const row = await findFirstEmptySettingsRow(MAPPING_CONFIG);
  const rows = names.map((name) => [name, category]);
  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: `'${SETTINGS_SHEET_NAME}'!J${row}:K${row + rows.length - 1}`,
    valueInputOption: "USER_ENTERED",
    requestBody: { values: rows },
  });
}

export async function updateCategoryMapping(
  oldExpenseName: string,
  expenseName: string,
  category: string,
): Promise<void> {
  await updateSettingsRow(MAPPING_CONFIG, oldExpenseName, [expenseName, category]);
}

export async function removeCategoryMapping(
  expenseName: string,
): Promise<void> {
  await removeSettingsRow(MAPPING_CONFIG, expenseName);
}

export async function addExpenseRenameRule(
  targetName: string,
  keywords: string,
): Promise<void> {
  await addSettingsRow(RENAME_CONFIG, [targetName, keywords]);
}

export async function updateExpenseRenameRule(
  oldTargetName: string,
  targetName: string,
  keywords: string,
): Promise<void> {
  await updateSettingsRow(RENAME_CONFIG, oldTargetName, [targetName, keywords]);
}

export async function removeExpenseRenameRule(
  targetName: string,
): Promise<void> {
  await removeSettingsRow(RENAME_CONFIG, targetName);
}

// ---- Income source functions ----

export async function addIncomeSource(
  name: string,
  amount: number,
): Promise<void> {
  await addSettingsRow(INCOME_CONFIG, [name, amount || ""]);
}

export async function updateIncomeSource(
  oldName: string,
  name: string,
  amount: number,
): Promise<void> {
  await updateSettingsRow(INCOME_CONFIG, oldName, [name, amount || ""]);
}

export async function removeIncomeSource(name: string): Promise<void> {
  await removeSettingsRow(INCOME_CONFIG, name);
}

/**
 * Update monthly income entries in H2:I area of a month sheet.
 */
export async function updateMonthIncome(
  sheetTitle: string,
  entries: IncomeSource[],
): Promise<void> {
  const sheets = getSheets();

  // Clear existing income data
  await sheets.spreadsheets.values.clear({
    spreadsheetId: SPREADSHEET_ID,
    range: `'${sheetTitle}'!H2:I17`,
  });

  if (entries.length === 0) return;

  const rows = entries.map((e) => [e.name, String(e.amount)]);
  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: `'${sheetTitle}'!H2:I${1 + rows.length}`,
    valueInputOption: "USER_ENTERED",
    requestBody: { values: rows },
  });
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
    .map((row, idx) => {
      const rawF = row[5] ?? "";
      const confirmedAmount = parseNumber(row[2]);
      const tentativeAmount = parseNumber(rawF);
      const tentative = !confirmedAmount && tentativeAmount > 0;
      return {
        row: idx + 2,
        date: row[0] ?? "",
        expense: row[1] ?? "",
        amount: tentative ? tentativeAmount : confirmedAmount,
        card: row[3] ?? "", // D = card in vacation
        category: row[4] ?? "", // E = category in vacation
        notes: tentativeAmount > 0 ? "" : rawF,
        tentative: tentative || undefined,
      };
    })
    .filter((t) => t.date || t.expense || t.amount);

  const confirmedTransactions = transactions.filter((t) => !t.tentative);
  const total = confirmedTransactions.reduce((sum, t) => sum + t.amount, 0);
  const nonFlightTransactions = confirmedTransactions.filter(
    (t) => t.category !== "טיסה",
  );
  const totalWithoutFlights = nonFlightTransactions.reduce(
    (sum, t) => sum + t.amount,
    0,
  );
  const countWithoutFlights = nonFlightTransactions.length;

  // Category breakdown (exclude tentative)
  const catMap = new Map<string, number>();
  for (const t of confirmedTransactions) {
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

  return {
    title,
    transactions,
    total,
    totalWithoutFlights,
    countWithoutFlights,
    categories,
    monthBreakdown,
  };
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
          values: [["תאריך", "הוצאה", "כמה", "כרטיס", "קטגוריה", "משוער"]],
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
      recurringExpenses: [],
      categoryMappings: [],
      expenseRenameRules: [],
      incomeSources: [],
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

/**
 * Sync vacation summary rows into a monthly sheet.
 * Each vacation with expenses in the month gets one row: expense=vacationName,
 * amount=total, category="חופשה", notes="auto:vacation:{sheetTitle}".
 * Existing auto rows are updated/cleared to stay in sync.
 */
export async function syncVacationRowsToMonthSheet(
  monthTitle: string,
  vacationRows: VacationMonthRow[],
): Promise<void> {
  const sheets = getSheets();
  const MARKER_PREFIX = "auto:vacation:";

  // Read existing rows to find auto-vacation markers
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `'${monthTitle}'!A2:F`,
  });
  const existing = res.data.values ?? [];

  // Map: vacationSheetTitle → { row, amount }
  const existingAutoRows = new Map<string, { row: number; amount: number }>();
  for (let i = 0; i < existing.length; i++) {
    const notes = (existing[i]?.[5] ?? "").trim();
    if (notes.startsWith(MARKER_PREFIX)) {
      const key = notes.slice(MARKER_PREFIX.length);
      existingAutoRows.set(key, {
        row: i + 2,
        amount: parseNumber(existing[i]?.[2] ?? ""),
      });
    }
  }

  // Build desired state
  const desired = new Map<string, number>();
  for (const vr of vacationRows) {
    desired.set(vr.vacationSheetTitle, vr.amount);
  }

  const updateData: { range: string; values: string[][] }[] = [];

  // Update or clear existing auto rows
  for (const [key, { row, amount }] of existingAutoRows) {
    const desiredAmount = desired.get(key);
    if (desiredAmount !== undefined) {
      // Update if amount changed
      if (desiredAmount !== amount) {
        updateData.push({
          range: `'${monthTitle}'!C${row}`,
          values: [[String(desiredAmount)]],
        });
      }
      desired.delete(key); // handled
    } else {
      // No longer relevant — clear the row
      updateData.push({
        range: `'${monthTitle}'!A${row}:F${row}`,
        values: [["", "", "", "", "", ""]],
      });
    }
  }

  // Batch-update existing rows
  if (updateData.length > 0) {
    await sheets.spreadsheets.values.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      requestBody: { valueInputOption: "USER_ENTERED", data: updateData },
    });
  }

  // Append new vacation rows using explicit row positions
  if (desired.size > 0) {
    const newRows = [...desired.entries()].map(([key, amount]) => {
      const vr = vacationRows.find((v) => v.vacationSheetTitle === key)!;
      return [
        "",
        vr.vacationName,
        String(amount),
        "חופשה",
        "",
        `${MARKER_PREFIX}${key}`,
      ];
    });
    const startRow = await findFirstEmptyRow(monthTitle);
    const data = newRows.map((row, i) => ({
      range: `'${monthTitle}'!A${startRow + i}:F${startRow + i}`,
      values: [row],
    }));
    await sheets.spreadsheets.values.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      requestBody: { valueInputOption: "USER_ENTERED", data },
    });
  }
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

// ──────────────────────────────────────────
// Stock portfolio functions
// ──────────────────────────────────────────

/**
 * Read stock configuration from the settings sheet (columns P-Y).
 */
async function ensureStockSettingsSheet(): Promise<void> {
  const sheets = getSheets();
  const res = await sheets.spreadsheets.get({
    spreadsheetId: STOCKS_SPREADSHEET_ID,
    fields: "sheets.properties.title",
  });
  const titles = res.data.sheets?.map((s) => s.properties?.title ?? "") ?? [];
  if (titles.includes(SETTINGS_SHEET_NAME)) return;

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: STOCKS_SPREADSHEET_ID,
    requestBody: {
      requests: [
        {
          addSheet: {
            properties: { title: SETTINGS_SHEET_NAME, rightToLeft: true },
          },
        },
      ],
    },
  });

  // Write headers for stock settings columns
  await sheets.spreadsheets.values.update({
    spreadsheetId: STOCKS_SPREADSHEET_ID,
    range: `'${SETTINGS_SHEET_NAME}'!A1:K1`,
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [
        [
          "סימול",
          "שם תצוגה",
          "מקור מחיר",
          "מטבע",
          "תווית",
          "טווח יעד",
          "שם יעד",
          "סכום יעד",
          "בנק",
          "דמי ניהול %",
          "עמלת קניה %",
        ],
      ],
    },
  });
}

export async function getStockConfig(): Promise<StockConfig> {
  await ensureStockSettingsSheet();
  const sheets = getSheets();

  const res = await sheets.spreadsheets.values.batchGet({
    spreadsheetId: STOCKS_SPREADSHEET_ID,
    ranges: [
      `'${SETTINGS_SHEET_NAME}'!${SETTINGS_RANGE_STOCK_SYMBOLS}`,
      `'${SETTINGS_SHEET_NAME}'!${SETTINGS_RANGE_STOCK_NAMES}`,
      `'${SETTINGS_SHEET_NAME}'!${SETTINGS_RANGE_STOCK_SOURCES}`,
      `'${SETTINGS_SHEET_NAME}'!${SETTINGS_RANGE_STOCK_CURRENCIES}`,
      `'${SETTINGS_SHEET_NAME}'!${SETTINGS_RANGE_STOCK_LABELS}`,
      `'${SETTINGS_SHEET_NAME}'!${SETTINGS_RANGE_GOAL_TERMS}`,
      `'${SETTINGS_SHEET_NAME}'!${SETTINGS_RANGE_GOAL_LABELS}`,
      `'${SETTINGS_SHEET_NAME}'!${SETTINGS_RANGE_GOAL_AMOUNTS}`,
      `'${SETTINGS_SHEET_NAME}'!${SETTINGS_RANGE_BROKER_NAMES}`,
      `'${SETTINGS_SHEET_NAME}'!${SETTINGS_RANGE_BROKER_MGMT_FEES}`,
      `'${SETTINGS_SHEET_NAME}'!${SETTINGS_RANGE_BROKER_PURCHASE_FEES}`,
      `'${SETTINGS_SHEET_NAME}'!${SETTINGS_RANGE_ALLOC_LABELS}`,
      `'${SETTINGS_SHEET_NAME}'!${SETTINGS_RANGE_ALLOC_PERCENTS}`,
      `'${SETTINGS_SHEET_NAME}'!${SETTINGS_RANGE_ALLOC_STOCKS}`,
      `'${SETTINGS_SHEET_NAME}'!${SETTINGS_RANGE_ALLOC_COLORS}`,
    ],
  });

  const valueRanges = res.data.valueRanges ?? [];
  const extract = (idx: number): string[] =>
    (valueRanges[idx]?.values ?? [])
      .map((row) => row[0]?.trim() ?? "")
      .filter(Boolean);

  // For labels, preserve empty strings so indices stay aligned with symbols
  const extractAligned = (idx: number, length: number): string[] => {
    const raw = valueRanges[idx]?.values ?? [];
    return Array.from({ length }, (_, i) => raw[i]?.[0]?.trim() ?? "");
  };

  const symbols = extract(0);
  const names = extract(1);
  const sources = extract(2);
  const currencies = extract(3);
  const labels = extractAligned(4, symbols.length);

  const stocks: StockDefinition[] = symbols.map((symbol, i) => ({
    symbol,
    displayName: names[i] ?? symbol,
    source: (sources[i] ?? "yahoo") as PriceSource,
    currency: (currencies[i] ?? "USD") as StockCurrency,
    label: labels[i] ?? "",
  }));

  const goalTerms = extract(5);
  const goalLabels = extract(6);
  const goalAmounts = extract(7);

  const goals: StockGoal[] = goalTerms.map((term, i) => ({
    term: term as InvestmentTerm,
    label: goalLabels[i] ?? "",
    targetAmount: parseNumber(goalAmounts[i]),
  }));

  const brokerNames = extract(8);
  const brokerMgmtFees = extract(9);
  const brokerPurchaseFees = extract(10);

  const brokers: BrokerConfig[] = brokerNames.map((name, i) => ({
    name,
    managementFeePercent: parseFloat(brokerMgmtFees[i]) || 0,
    purchaseFeePercent: parseFloat(brokerPurchaseFees[i]) || 0,
  }));

  const allocLabels = extract(11);
  const allocPercents = extractAligned(12, allocLabels.length);
  const allocStocks = extractAligned(13, allocLabels.length);
  const allocColors = extractAligned(14, allocLabels.length);

  const labelAllocations: LabelAllocation[] = allocLabels.map((label, i) => ({
    label,
    targetPercent: parseFloat(allocPercents[i]) || 0,
    selectedStock: allocStocks[i] || undefined,
    color: allocColors[i] || undefined,
  }));

  return { stocks, goals, brokers, labelAllocations };
}

// ---- Generic settings CRUD helpers ----

interface SettingsCrudConfig {
  spreadsheetId: string;
  keyColumn: string;
  startCol: string;
  endCol: string;
}

const SUMMARY_CARD_CONFIG: SettingsCrudConfig = {
  spreadsheetId: SPREADSHEET_ID,
  keyColumn: "F",
  startCol: "F",
  endCol: "G",
};

const RECURRING_CONFIG: SettingsCrudConfig = {
  spreadsheetId: SPREADSHEET_ID,
  keyColumn: "H",
  startCol: "H",
  endCol: "I",
};

const MAPPING_CONFIG: SettingsCrudConfig = {
  spreadsheetId: SPREADSHEET_ID,
  keyColumn: "J",
  startCol: "J",
  endCol: "K",
};

const RENAME_CONFIG: SettingsCrudConfig = {
  spreadsheetId: SPREADSHEET_ID,
  keyColumn: "L",
  startCol: "L",
  endCol: "M",
};

const INCOME_CONFIG: SettingsCrudConfig = {
  spreadsheetId: SPREADSHEET_ID,
  keyColumn: "N",
  startCol: "N",
  endCol: "O",
};

const STOCK_DEF_CONFIG: SettingsCrudConfig = {
  spreadsheetId: STOCKS_SPREADSHEET_ID,
  keyColumn: "A",
  startCol: "A",
  endCol: "E",
};

const BROKER_CONFIG: SettingsCrudConfig = {
  spreadsheetId: STOCKS_SPREADSHEET_ID,
  keyColumn: "I",
  startCol: "I",
  endCol: "K",
};

const GOAL_CONFIG: SettingsCrudConfig = {
  spreadsheetId: STOCKS_SPREADSHEET_ID,
  keyColumn: "G",
  startCol: "F",
  endCol: "H",
};

async function findFirstEmptySettingsRow(cfg: SettingsCrudConfig): Promise<number> {
  const sheets = getSheets();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: cfg.spreadsheetId,
    range: `'${SETTINGS_SHEET_NAME}'!${cfg.keyColumn}2:${cfg.keyColumn}100`,
  });
  const values = res.data.values ?? [];
  for (let i = 0; i < values.length; i++) {
    if (!values[i] || !values[i][0]?.trim()) return i + 2;
  }
  return values.length + 2;
}

async function findSettingsRow(
  cfg: SettingsCrudConfig,
  key: string,
): Promise<number | null> {
  const sheets = getSheets();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: cfg.spreadsheetId,
    range: `'${SETTINGS_SHEET_NAME}'!${cfg.keyColumn}2:${cfg.keyColumn}100`,
  });
  const values = res.data.values ?? [];
  for (let i = 0; i < values.length; i++) {
    if (values[i]?.[0]?.trim() === key) return i + 2;
  }
  return null;
}

async function addSettingsRow(
  cfg: SettingsCrudConfig,
  values: (string | number)[],
): Promise<void> {
  const sheets = getSheets();
  const row = await findFirstEmptySettingsRow(cfg);
  await sheets.spreadsheets.values.update({
    spreadsheetId: cfg.spreadsheetId,
    range: `'${SETTINGS_SHEET_NAME}'!${cfg.startCol}${row}:${cfg.endCol}${row}`,
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [values.map(String)] },
  });
}

async function updateSettingsRow(
  cfg: SettingsCrudConfig,
  key: string,
  values: (string | number)[],
): Promise<void> {
  const row = await findSettingsRow(cfg, key);
  if (row === null) return;
  const sheets = getSheets();
  await sheets.spreadsheets.values.update({
    spreadsheetId: cfg.spreadsheetId,
    range: `'${SETTINGS_SHEET_NAME}'!${cfg.startCol}${row}:${cfg.endCol}${row}`,
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [values.map(String)] },
  });
}

async function removeSettingsRow(
  cfg: SettingsCrudConfig,
  key: string,
): Promise<void> {
  const row = await findSettingsRow(cfg, key);
  if (row === null) return;
  const sheets = getSheets();
  await sheets.spreadsheets.values.clear({
    spreadsheetId: cfg.spreadsheetId,
    range: `'${SETTINGS_SHEET_NAME}'!${cfg.startCol}${row}:${cfg.endCol}${row}`,
  });
}

export async function addStockDefinition(
  symbol: string,
  displayName: string,
  source: PriceSource,
  currency: StockCurrency,
  label: string = "",
): Promise<void> {
  await addSettingsRow(STOCK_DEF_CONFIG, [symbol, displayName, source, currency, label]);
}

export async function updateStockDefinition(
  oldSymbol: string,
  symbol: string,
  displayName: string,
  source: PriceSource,
  currency: StockCurrency,
  label: string = "",
): Promise<void> {
  await updateSettingsRow(STOCK_DEF_CONFIG, oldSymbol, [symbol, displayName, source, currency, label]);
}

export async function removeStockDefinition(symbol: string): Promise<void> {
  await removeSettingsRow(STOCK_DEF_CONFIG, symbol);
}

export async function addBrokerConfig(
  name: string,
  mgmtFee: number,
  purchaseFee: number,
): Promise<void> {
  await addSettingsRow(BROKER_CONFIG, [name, mgmtFee, purchaseFee]);
}

export async function updateBrokerConfig(
  oldName: string,
  name: string,
  mgmtFee: number,
  purchaseFee: number,
): Promise<void> {
  await updateSettingsRow(BROKER_CONFIG, oldName, [name, mgmtFee, purchaseFee]);
}

export async function removeBrokerConfig(name: string): Promise<void> {
  await removeSettingsRow(BROKER_CONFIG, name);
}

export async function addStockGoal(
  term: InvestmentTerm,
  label: string,
  targetAmount: number,
): Promise<void> {
  await addSettingsRow(GOAL_CONFIG, [term, label, targetAmount]);
}

export async function updateStockGoal(
  oldLabel: string,
  term: InvestmentTerm,
  label: string,
  targetAmount: number,
): Promise<void> {
  await updateSettingsRow(GOAL_CONFIG, oldLabel, [term, label, targetAmount]);
}

export async function removeStockGoal(label: string): Promise<void> {
  await removeSettingsRow(GOAL_CONFIG, label);
}

// ---- Label allocation persistence ----

export async function saveLabelAllocations(
  allocations: LabelAllocation[],
): Promise<void> {
  const sheets = getSheets();
  // Clear existing data
  await sheets.spreadsheets.values.clear({
    spreadsheetId: STOCKS_SPREADSHEET_ID,
    range: `'${SETTINGS_SHEET_NAME}'!L2:O100`,
  });
  if (allocations.length === 0) return;
  // Write new data
  await sheets.spreadsheets.values.update({
    spreadsheetId: STOCKS_SPREADSHEET_ID,
    range: `'${SETTINGS_SHEET_NAME}'!L2:O${allocations.length + 1}`,
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: allocations.map((a) => [
        a.label,
        String(a.targetPercent),
        a.selectedStock ?? "",
        a.color ?? "",
      ]),
    },
  });
}

// ---- Stock transaction sheet ----

/**
 * Ensure the stock transactions sheet exists. Creates it if missing.
 */
export async function ensureStockSheet(): Promise<void> {
  const sheets = getSheets();
  const res = await sheets.spreadsheets.get({
    spreadsheetId: STOCKS_SPREADSHEET_ID,
    fields: "sheets.properties.title",
  });
  const titles = res.data.sheets?.map((s) => s.properties?.title ?? "") ?? [];
  if (titles.includes(STOCKS_SHEET_NAME)) return;

  const addRes = await sheets.spreadsheets.batchUpdate({
    spreadsheetId: STOCKS_SPREADSHEET_ID,
    requestBody: {
      requests: [
        {
          addSheet: {
            properties: {
              title: STOCKS_SHEET_NAME,
              rightToLeft: true,
            },
          },
        },
      ],
    },
  });

  const newSheetId = addRes.data.replies?.[0]?.addSheet?.properties?.sheetId;
  if (newSheetId === undefined) throw new Error("Failed to create stock sheet");

  // Write headers
  await sheets.spreadsheets.values.update({
    spreadsheetId: STOCKS_SPREADSHEET_ID,
    range: `'${STOCKS_SHEET_NAME}'!A1:J1`,
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [STOCK_SHEET_HEADERS as unknown as string[]] },
  });

  // Freeze header row
  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: STOCKS_SPREADSHEET_ID,
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
      ],
    },
  });
}

/**
 * Read all stock transactions from the מניות sheet.
 */
export async function getStockTransactions(): Promise<StockTransaction[]> {
  await ensureStockSheet();
  const sheets = getSheets();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: STOCKS_SPREADSHEET_ID,
    range: `'${STOCKS_SHEET_NAME}'!A2:J`,
  });

  const rows = res.data.values ?? [];
  return rows
    .map((row, idx) => ({
      row: idx + 2,
      date: row[0] ?? "",
      type: (row[1] ?? "קניה") as TransactionType,
      symbol: row[2] ?? "",
      quantity: parseNumber(row[3]),
      pricePerUnitILS: parseNumber(row[4]),
      currency: (row[5] ?? "ILS") as StockCurrency,
      term: (row[6] ?? "ארוך") as InvestmentTerm,
      bank: row[7] ?? "",
      purchaseFee: parseNumber(row[8]),
      notes: row[9] ?? "",
    }))
    .filter((t) => t.symbol);
}

/**
 * Add a stock transaction.
 */
export async function addStockTransaction(
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
  await ensureStockSheet();
  const sheets = getSheets();

  // Find first empty row
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: STOCKS_SPREADSHEET_ID,
    range: `'${STOCKS_SHEET_NAME}'!A2:A500`,
  });
  const values = res.data.values ?? [];
  let lastNonEmpty = -1;
  for (let i = 0; i < values.length; i++) {
    if (values[i] && values[i][0]) lastNonEmpty = i;
  }
  const row = lastNonEmpty + 3;

  await sheets.spreadsheets.values.update({
    spreadsheetId: STOCKS_SPREADSHEET_ID,
    range: `'${STOCKS_SHEET_NAME}'!A${row}:J${row}`,
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [
        [
          date,
          type,
          symbol,
          String(quantity),
          pricePerUnitILS.toFixed(2),
          currency,
          term,
          bank,
          purchaseFee ? purchaseFee.toFixed(2) : "",
          notes,
        ],
      ],
    },
  });

  return row;
}

/**
 * Update a stock transaction row.
 */
export async function updateStockTransaction(
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
): Promise<void> {
  const sheets = getSheets();
  await sheets.spreadsheets.values.update({
    spreadsheetId: STOCKS_SPREADSHEET_ID,
    range: `'${STOCKS_SHEET_NAME}'!A${row}:J${row}`,
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [
        [
          date,
          type,
          symbol,
          String(quantity),
          pricePerUnitILS.toFixed(2),
          currency,
          term,
          bank,
          purchaseFee ? purchaseFee.toFixed(2) : "",
          notes,
        ],
      ],
    },
  });
}

/**
 * Delete a stock transaction row.
 */
export async function deleteStockTransaction(row: number): Promise<void> {
  const sheets = getSheets();
  await sheets.spreadsheets.values.clear({
    spreadsheetId: STOCKS_SPREADSHEET_ID,
    range: `'${STOCKS_SHEET_NAME}'!A${row}:J${row}`,
  });
}

// ──────────────────────────────────────────
// NVIDIA RSU sheets
// ──────────────────────────────────────────

const RSU_SHEET_NAME = "nvidia";

const RSU_HEADERS = [
  "תאריך מענק",
  "סה\"כ מניות במענק",
  "תאריך הבשלה",
  "כמות",
  "מחיר הענקה $",
  "הערות",
  "שם מענק",
  "נמכר",
  "",
  "ברוטו עד כה",
  "משכורת חודשית",
  "הפרשה חודשית ESPP",
];

async function ensureSheetInStocksSpreadsheet(
  sheetName: string,
  headers: string[],
  endCol: string,
): Promise<void> {
  const sheets = getSheets();
  const res = await sheets.spreadsheets.get({
    spreadsheetId: STOCKS_SPREADSHEET_ID,
    fields: "sheets.properties.title,sheets.properties.sheetId",
  });
  const existing = res.data.sheets ?? [];
  const found = existing.find((s) => s.properties?.title === sheetName);
  if (found) {
    // Always sync headers on existing sheets
    await sheets.spreadsheets.values.update({
      spreadsheetId: STOCKS_SPREADSHEET_ID,
      range: `'${sheetName}'!A1:${endCol}1`,
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [headers] },
    });
    return;
  }

  const addRes = await sheets.spreadsheets.batchUpdate({
    spreadsheetId: STOCKS_SPREADSHEET_ID,
    requestBody: {
      requests: [
        {
          addSheet: {
            properties: { title: sheetName, rightToLeft: true },
          },
        },
      ],
    },
  });

  const newSheetId = addRes.data.replies?.[0]?.addSheet?.properties?.sheetId;

  await sheets.spreadsheets.values.update({
    spreadsheetId: STOCKS_SPREADSHEET_ID,
    range: `'${sheetName}'!A1:${endCol}1`,
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [headers] },
  });

  if (newSheetId !== undefined) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: STOCKS_SPREADSHEET_ID,
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
        ],
      },
    });
  }
}

export async function ensureRsuSheet(): Promise<void> {
  await ensureSheetInStocksSpreadsheet(RSU_SHEET_NAME, RSU_HEADERS, "L");
}

export async function getRsuGrossData(): Promise<{ grossSoFar: number; monthlySalary: number; esppMonthlyContribution: number; esppPurchasePrice: number }> {
  const sheets = getSheets();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: STOCKS_SPREADSHEET_ID,
    range: `'${RSU_SHEET_NAME}'!J2:M2`,
  });
  const row = res.data.values?.[0] ?? [];
  return {
    grossSoFar: parseFloat(String(row[0] ?? "").replace(/,/g, "")) || 0,
    monthlySalary: parseFloat(String(row[1] ?? "").replace(/,/g, "")) || 0,
    esppMonthlyContribution: parseFloat(String(row[2] ?? "").replace(/,/g, "")) || 0,
    esppPurchasePrice: parseFloat(String(row[3] ?? "").replace(/,/g, "")) || 0,
  };
}

export async function setRsuGrossData(grossSoFar: number, monthlySalary: number, esppMonthlyContribution: number, esppPurchasePrice: number): Promise<void> {
  const sheets = getSheets();
  await sheets.spreadsheets.values.update({
    spreadsheetId: STOCKS_SPREADSHEET_ID,
    range: `'${RSU_SHEET_NAME}'!J2:M2`,
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [[grossSoFar || "", monthlySalary || "", esppMonthlyContribution || "", esppPurchasePrice || ""]] },
  });
}

// ── Read functions ──

import type { RsuVest } from "./types";

export async function getRsuTransactions(): Promise<RsuVest[]> {
  await ensureRsuSheet();
  const sheets = getSheets();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: STOCKS_SPREADSHEET_ID,
    range: `'${RSU_SHEET_NAME}'!A2:H`,
  });

  const rows = res.data.values ?? [];
  return rows
    .map((row, idx) => ({
      row: idx + 2,
      grantDate: row[0] ?? "",
      totalSharesInGrant: parseNumber(row[1]),
      vestDate: row[2] ?? "",
      shares: parseNumber(row[3]),
      vestPriceUsd: row[4] ? parseNumber(row[4]) : null,
      notes: row[5] ?? "",
      grantName: row[6] ?? "",
      sold: (row[7] ?? "").toUpperCase() === "TRUE",
    }))
    .filter((r) => r.grantDate || r.vestDate);
}

// ── Write functions ──

async function findFirstEmptyRowInSheet(
  sheetName: string,
  spreadsheetId: string,
): Promise<number> {
  const sheets = getSheets();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `'${sheetName}'!A2:A500`,
  });
  const values = res.data.values ?? [];
  let lastNonEmpty = -1;
  for (let i = 0; i < values.length; i++) {
    if (values[i] && values[i][0]) lastNonEmpty = i;
  }
  return lastNonEmpty + 3;
}

export async function addRsuVestRows(
  rows: string[][],
): Promise<void> {
  await ensureRsuSheet();
  const sheets = getSheets();
  const startRow = await findFirstEmptyRowInSheet(RSU_SHEET_NAME, STOCKS_SPREADSHEET_ID);
  const data = rows.map((row, i) => ({
    range: `'${RSU_SHEET_NAME}'!A${startRow + i}:H${startRow + i}`,
    values: [row],
  }));
  await sheets.spreadsheets.values.batchUpdate({
    spreadsheetId: STOCKS_SPREADSHEET_ID,
    requestBody: { valueInputOption: "USER_ENTERED", data },
  });
}

export async function updateRsuRow(
  row: number,
  values: string[],
): Promise<void> {
  const sheets = getSheets();
  await sheets.spreadsheets.values.update({
    spreadsheetId: STOCKS_SPREADSHEET_ID,
    range: `'${RSU_SHEET_NAME}'!A${row}:H${row}`,
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [values] },
  });
}

export async function toggleRsuSold(row: number, sold: boolean): Promise<void> {
  const sheets = getSheets();
  await sheets.spreadsheets.values.update({
    spreadsheetId: STOCKS_SPREADSHEET_ID,
    range: `'${RSU_SHEET_NAME}'!H${row}`,
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [[sold ? "TRUE" : ""]] },
  });
}

export async function deleteRsuRow(row: number): Promise<void> {
  const sheets = getSheets();
  await sheets.spreadsheets.values.clear({
    spreadsheetId: STOCKS_SPREADSHEET_ID,
    range: `'${RSU_SHEET_NAME}'!A${row}:H${row}`,
  });
}
