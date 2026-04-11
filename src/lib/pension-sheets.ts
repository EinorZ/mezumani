import { google } from "googleapis";
import type { PensionFund, PensionOwner, PensionFundType } from "./types";
import { parseNumber } from "./utils";

const PENSION_SPREADSHEET_ID = process.env.GOOGLE_STOCKS_SPREADSHEET_ID!;

export const PENSION_SHEET_NAME = "חיסכון";

// Columns: A=Owner, B=Name, C=Type, D=Track, E=Balance, F=LastUpdated
const PENSION_HEADERS = ["בעלים", "שם הקרן", "סוג", "מסלול", "יתרה", "עדכון אחרון"];
const HISTORY_SHEET_NAME = "היסטוריית חיסכון";

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

export async function ensurePensionSheet(): Promise<void> {
  const sheets = getSheets();
  const res = await sheets.spreadsheets.get({
    spreadsheetId: PENSION_SPREADSHEET_ID,
    fields: "sheets.properties(sheetId,title)",
  });
  const allSheets = res.data.sheets ?? [];
  const exists = allSheets.some((s) => s.properties?.title === PENSION_SHEET_NAME);

  // Delete legacy history sheet if it exists
  const historySheet = allSheets.find((s) => s.properties?.title === HISTORY_SHEET_NAME);
  if (historySheet?.properties?.sheetId != null) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: PENSION_SPREADSHEET_ID,
      requestBody: {
        requests: [{ deleteSheet: { sheetId: historySheet.properties.sheetId } }],
      },
    });
  }

  if (exists) return;

  let newSheetId: number | undefined;
  try {
    const addRes = await sheets.spreadsheets.batchUpdate({
      spreadsheetId: PENSION_SPREADSHEET_ID,
      requestBody: {
        requests: [{ addSheet: { properties: { title: PENSION_SHEET_NAME, rightToLeft: true } } }],
      },
    });
    newSheetId = addRes.data.replies?.[0]?.addSheet?.properties?.sheetId ?? undefined;
  } catch (err: unknown) {
    if (err instanceof Error && err.message.includes("already exists")) return;
    throw err;
  }

  await sheets.spreadsheets.values.update({
    spreadsheetId: PENSION_SPREADSHEET_ID,
    range: `'${PENSION_SHEET_NAME}'!A1:F1`,
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [PENSION_HEADERS] },
  });

  if (newSheetId !== undefined) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: PENSION_SPREADSHEET_ID,
      requestBody: {
        requests: [
          {
            updateSheetProperties: {
              properties: { sheetId: newSheetId, gridProperties: { frozenRowCount: 1 } },
              fields: "gridProperties.frozenRowCount",
            },
          },
        ],
      },
    });
  }
}

export async function getPensionFunds(): Promise<PensionFund[]> {
  const sheets = getSheets();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: PENSION_SPREADSHEET_ID,
    range: `'${PENSION_SHEET_NAME}'!A2:F`,
  });
  const rows = res.data.values ?? [];
  return rows
    .map((row, idx) => ({
      row: idx + 2,
      owner: (row[0] ?? "עינור") as PensionOwner,
      name: row[1] ?? "",
      type: (row[2] ?? "פנסיה") as PensionFundType,
      track: row[3] ?? "",
      balance: parseNumber(row[4]),
      lastUpdated: row[5] ?? "",
    }))
    .filter((f) => f.name);
}

async function findLastRow(): Promise<number> {
  const sheets = getSheets();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: PENSION_SPREADSHEET_ID,
    range: `'${PENSION_SHEET_NAME}'!A2:A500`,
  });
  const values = res.data.values ?? [];
  let lastNonEmpty = -1;
  for (let i = 0; i < values.length; i++) {
    if (values[i]?.[0]) lastNonEmpty = i;
  }
  return lastNonEmpty + 3;
}

export async function addPensionFund(
  owner: PensionOwner,
  name: string,
  type: PensionFundType,
  track: string,
  balance: number,
  date: string,
): Promise<number> {
  const sheets = getSheets();
  const row = await findLastRow();
  await sheets.spreadsheets.values.update({
    spreadsheetId: PENSION_SPREADSHEET_ID,
    range: `'${PENSION_SHEET_NAME}'!A${row}:F${row}`,
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [[owner, name, type, track, balance.toFixed(2), date]] },
  });
  return row;
}

export async function updatePensionFund(
  row: number,
  owner: PensionOwner,
  name: string,
  type: PensionFundType,
  track: string,
  balance: number,
  date: string,
): Promise<void> {
  const sheets = getSheets();
  await sheets.spreadsheets.values.update({
    spreadsheetId: PENSION_SPREADSHEET_ID,
    range: `'${PENSION_SHEET_NAME}'!A${row}:F${row}`,
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [[owner, name, type, track, balance.toFixed(2), date]] },
  });
}

export async function deletePensionFund(row: number): Promise<void> {
  const sheets = getSheets();
  await sheets.spreadsheets.values.clear({
    spreadsheetId: PENSION_SPREADSHEET_ID,
    range: `'${PENSION_SHEET_NAME}'!A${row}:F${row}`,
  });
}
