import assert from "node:assert/strict";
import test from "node:test";
import { withTransactionYear, extractMonthFromDate } from "./transaction-dates";
import { buildYearGroups, classifySheet } from "./utils";

test("pins yearless monthly payments to their source year before a move", () => {
  assert.equal(withTransactionYear("6/11", 26), "6/11/2026");
  assert.equal(withTransactionYear("06.11", 2026), "06/11/2026");
  assert.equal(withTransactionYear("31/12", 25), "31/12/2025");
});

test("explicit payment years take precedence over source and vacation years", () => {
  assert.equal(withTransactionYear("6/11/26", 27), "6/11/2026");
  assert.equal(withTransactionYear("6.11.2025", 26), "6/11/2025");
  assert.equal(withTransactionYear("", 26), "");
});

test("a 2026 payment stays in 2026 when a later calendar year is active", () => {
  const moved = withTransactionYear("6.11", 26);
  assert.equal(extractMonthFromDate(moved, 2027), "נובמבר 26");
  assert.equal(extractMonthFromDate(moved, 2028), "נובמבר 26");
  assert.equal(extractMonthFromDate("6.11.27", 2026), "נובמבר 27");
  assert.equal(extractMonthFromDate("6/11", 2026), "נובמבר 26");
  assert.equal(extractMonthFromDate("6/13/2026"), null);
  assert.equal(extractMonthFromDate(""), null);
});

test("a future vacation creates a sidebar year without monthly or annual tabs", () => {
  const groups = buildYearGroups([
    classifySheet(1, "נובמבר 26"),
    classifySheet(2, "Italy 27"),
  ]);
  assert.deepEqual(
    groups.map((group) => group.fullYear),
    [2027, 2026],
  );
  assert.equal(groups[0].vacations[0].title, "Italy 27");
  assert.deepEqual(groups[0].months, []);
  assert.equal(groups[0].hasAnnual, false);
});
