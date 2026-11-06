import assert from "node:assert/strict";
import test from "node:test";
import { matchRecurringExpense } from "./recurring-expense-matching";
import type { RecurringExpense } from "./types";

const water: RecurringExpense = {
  name: "מים",
  amount: 0,
  category: "מגורים",
  card: "",
  keywords: "מי גבעתיים",
};

test("does not mistake a supermarket name for a water bill", () => {
  assert.equal(
    matchRecurringExpense("סופר השוק התמים וויצ", "אמקס - זיו", [water]),
    undefined,
  );
});

test("matches configured keywords inside a longer merchant description", () => {
  assert.equal(
    matchRecurringExpense("תשלום מי גבעתיים בע״מ", "אמקס - זיו", [water]),
    water,
  );
});

test("matches full expense names but never partial expense names", () => {
  for (const keywords of [water.keywords, ""]) {
    const recurring = { ...water, keywords };
    assert.equal(
      matchRecurringExpense(" מים ", "אמקס - זיו", [recurring]),
      recurring,
    );
    assert.equal(
      matchRecurringExpense("חשבון מים", "אמקס - זיו", [recurring]),
      undefined,
    );
  }
});

test("keeps keyword matching case insensitive and ignores empty keywords", () => {
  const internet = {
    ...water,
    name: "אינטרנט",
    keywords: " | Other Provider | GILAT TELECOM | ",
  };
  assert.equal(
    matchRecurringExpense("charge gilat telecom ltd", "Visa", [internet]),
    internet,
  );
  assert.equal(matchRecurringExpense("סופר", "Visa", [internet]), undefined);
});

test("respects card restrictions and requires an expense and selected card", () => {
  const restricted = { ...water, card: "אמקס - זיו" };
  assert.equal(
    matchRecurringExpense("מי גבעתיים", "אמקס - עינור", [restricted]),
    undefined,
  );
  assert.equal(
    matchRecurringExpense("מי גבעתיים", "אמקס - זיו", [restricted]),
    restricted,
  );
  assert.equal(matchRecurringExpense("מי גבעתיים", "", [water]), undefined);
  assert.equal(matchRecurringExpense(" ", "Visa", [water]), undefined);
  assert.equal(
    matchRecurringExpense("מי גבעתיים", "Visa", undefined),
    undefined,
  );
});
