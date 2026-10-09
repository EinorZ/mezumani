import assert from "node:assert/strict";
import test from "node:test";
import { isCalCreditHeader, parseCalCreditRows } from "./excel-import";

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
    { date: "27.08", expense: "אי.אם.פי.אם אלנבי", amount: 10 },
    { date: "26.08", expense: "עסקה בחו״ל", amount: 37 },
  ]);
});
