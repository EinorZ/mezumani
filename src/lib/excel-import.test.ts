import assert from "node:assert/strict";
import test from "node:test";
import {
  formatImportedDate,
  isCalCreditHeader,
  parseCalCreditRows,
} from "./excel-import";

const headers = [
  "תאריך\r\nעסקה",
  "שם בית עסק",
  "סכום\r\nעסקה",
  "סכום\r\nחיוב",
  "סוג\r\nעסקה",
  "ענף",
  "הערות",
];

test("recognizes CAL/Visa headers containing line breaks", () => {
  assert.equal(isCalCreditHeader(headers), true);
});

test("parses CAL/Visa rows and falls back to the transaction amount", () => {
  const rows = [
    ["פירוט עסקאות לכרטיס ויזה המסתיים ב-9246"],
    [],
    headers,
    [46261, "אי.אם.פי.אם אלנבי", 9.9, "", "רגילה"],
    [46260, "עסקה בחו״ל", 10, 37.4, "רגילה"],
    [],
    ["טקסט סיום ללא עסקה"],
  ];

  assert.deepEqual(parseCalCreditRows(rows, 2), [
    { date: "27.08.2026", expense: "אי.אם.פי.אם אלנבי", amount: 10 },
    { date: "26.08.2026", expense: "עסקה בחו״ל", amount: 37 },
  ]);
});

test("preserves payment years from every supported import date format", () => {
  assert.equal(formatImportedDate("2026-11-06 00:00"), "06.11.2026");
  assert.equal(formatImportedDate("6/11/2026"), "06.11.2026");
  assert.equal(formatImportedDate("6.11.26"), "06.11.26");
  assert.equal(formatImportedDate(new Date(2026, 10, 6)), "06.11.2026");
  assert.equal(formatImportedDate("6/11"), "06.11");
  assert.equal(formatImportedDate(""), "");
});
