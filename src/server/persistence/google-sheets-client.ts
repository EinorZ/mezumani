import "server-only";

import { google } from "googleapis";

export const householdSpreadsheetId = process.env.GOOGLE_SPREADSHEET_ID!;
export const investmentsSpreadsheetId =
  process.env.GOOGLE_STOCKS_SPREADSHEET_ID ?? householdSpreadsheetId;
export const pensionSpreadsheetId = process.env.GOOGLE_STOCKS_SPREADSHEET_ID!;

function getGoogleSheetsAuth() {
  return new google.auth.JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
}

export function getGoogleSheetsClient() {
  return google.sheets({ version: "v4", auth: getGoogleSheetsAuth() });
}
