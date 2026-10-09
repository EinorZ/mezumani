import assert from "node:assert/strict";
import test from "node:test";
import { HEBREW_MONTHS } from "./constants";
import {
  classifySheet,
  evalMathExpr,
  getAdjacentMonth,
  parseNumber,
} from "./utils";

test("classifies settings, annual, monthly, vacation, and unknown sheets", () => {
  assert.equal(classifySheet(1, "הגדרות").type, "settings");
  assert.deepEqual(classifySheet(2, "שנתי 26"), {
    sheetId: 2,
    title: "שנתי 26",
    type: "annual",
    year: 26,
  });
  assert.equal(classifySheet(3, `${HEBREW_MONTHS[0]} 26`).type, "monthly");
  assert.equal(classifySheet(4, "קפריסין 26").type, "vacation");
  assert.equal(classifySheet(5, "archive").type, "other");
});

test("finds adjacent month sheets across year boundaries", () => {
  const december = classifySheet(12, `${HEBREW_MONTHS[11]} 25`);
  const january = classifySheet(13, `${HEBREW_MONTHS[0]} 26`);
  const sheets = [december, january];

  assert.deepEqual(getAdjacentMonth(december.title, 1, sheets), january);
  assert.deepEqual(getAdjacentMonth(january.title, -1, sheets), december);
  assert.equal(getAdjacentMonth("not a month", 1, sheets), null);
});

test("evaluates supported math expressions with operator precedence", () => {
  assert.equal(evalMathExpr("2 + 3 * 4"), 14);
  assert.equal(evalMathExpr("-5 + 10 / 2"), 0);
  assert.equal(evalMathExpr("10 / 0"), 0);
  assert.equal(evalMathExpr(""), 0);
});

test("parses formatted spreadsheet numbers and safely defaults invalid values", () => {
  assert.equal(parseNumber("₪1,234.50"), 1_234.5);
  assert.equal(parseNumber("-42"), -42);
  assert.equal(parseNumber("not a number"), 0);
  assert.equal(parseNumber(undefined), 0);
});
