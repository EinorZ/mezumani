import assert from "node:assert/strict";
import test from "node:test";
import {
  detectCardFromFileName,
  extractCardLastFour,
} from "./card-import";

test("extracts a leading four-digit card suffix without losing leading zeroes", () => {
  assert.equal(extractCardLastFour("0494_09_2026.xlsx"), "0494");
  assert.equal(extractCardLastFour("/downloads/6225_09_2026.xlsx"), "6225");
  assert.equal(
    extractCardLastFour("פירוט חיובים לכרטיס ויזה 9246 - 04.09.26.xlsx"),
    "9246",
  );
});

test("does not infer a suffix from unrelated filenames", () => {
  assert.equal(extractCardLastFour("expenses_0494_09_2026.xlsx"), null);
  assert.equal(extractCardLastFour("12345_09_2026.xlsx"), null);
});

test("detects a configured card from its filename suffix", () => {
  const mappings = [
    { card: "Visa - Einor", lastFour: "0494" },
    { card: "Mastercard - Ziv", lastFour: "6225" },
  ];

  assert.equal(
    detectCardFromFileName("6225_09_2026.xlsx", mappings, [
      "Visa - Einor",
      "Mastercard - Ziv",
    ]),
    "Mastercard - Ziv",
  );
});

test("requires manual selection for missing, stale, or ambiguous mappings", () => {
  assert.equal(detectCardFromFileName("0494_09_2026.xlsx", [], ["Visa"]), null);
  assert.equal(
    detectCardFromFileName(
      "0494_09_2026.xlsx",
      [{ card: "Removed card", lastFour: "0494" }],
      ["Visa"],
    ),
    null,
  );
  assert.equal(
    detectCardFromFileName(
      "0494_09_2026.xlsx",
      [
        { card: "Visa", lastFour: "0494" },
        { card: "Mastercard", lastFour: "0494" },
      ],
      ["Visa", "Mastercard"],
    ),
    null,
  );
});
