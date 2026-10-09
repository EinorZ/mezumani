import assert from "node:assert/strict";
import test from "node:test";
import {
  ActionInputError,
  assertEnum,
  assertInternalPath,
  assertLabelAllocations,
  assertSheetRows,
  assertTransactionInput,
  assertTransactionInputs,
} from "./action-validation";

const validTransaction = {
  date: "24/08/26",
  expense: "Groceries",
  amount: 125.5,
  category: "Food",
  card: "Shared",
  notes: "",
  tentative: false,
};

test("accepts a valid transaction without changing the input", () => {
  const input = { ...validTransaction };

  assert.doesNotThrow(() => assertTransactionInput(input));
  assert.deepEqual(input, validTransaction);
});

test("preserves legitimate empty transaction fields and refund amounts", () => {
  assert.doesNotThrow(() =>
    assertTransactionInput({
      date: "",
      expense: "",
      amount: -42,
      category: "",
      card: "",
      notes: "",
    }),
  );
});

test("rejects non-finite transaction amounts with a stable safe error", () => {
  assert.throws(
    () => assertTransactionInput({ ...validTransaction, amount: Infinity }),
    (error: unknown) => {
      assert.ok(error instanceof ActionInputError);
      assert.equal(error.code, "INVALID_ACTION_INPUT");
      assert.equal(error.field, "transaction.amount");
      assert.equal(
        error.message,
        "Invalid transaction.amount: must be a finite number",
      );
      return true;
    },
  );
});

test("rejects invalid and duplicate spreadsheet rows", () => {
  assert.throws(() => assertSheetRows([1]), ActionInputError);
  assert.throws(() => assertSheetRows([2.5]), ActionInputError);
  assert.throws(() => assertSheetRows([2, 2]), /duplicate rows/);
});

test("caps mutation batches before they reach the persistence adapter", () => {
  const oversized = Array.from({ length: 1_001 }, () => validTransaction);

  assert.throws(() => assertTransactionInputs(oversized), /at most 1000 items/);
});

test("allows local revalidation paths and rejects external or ambiguous paths", () => {
  assert.doesNotThrow(() => assertInternalPath("/month/123"));
  assert.doesNotThrow(() => assertInternalPath("/settings?tab=stocks"));
  assert.throws(
    () => assertInternalPath("https://example.com"),
    ActionInputError,
  );
  assert.throws(() => assertInternalPath("//example.com"), ActionInputError);
  assert.throws(
    () => assertInternalPath("/settings\n/other"),
    ActionInputError,
  );
});

test("rejects forged enum values", () => {
  assert.doesNotThrow(() => assertEnum("ILS", "currency", ["ILS", "USD"]));
  assert.throws(
    () => assertEnum("EUR", "currency", ["ILS", "USD"]),
    ActionInputError,
  );
});

test("rejects portfolio allocation percentages outside their contract", () => {
  assert.doesNotThrow(() =>
    assertLabelAllocations([{ label: "Long term", targetPercent: 60 }]),
  );
  assert.throws(
    () => assertLabelAllocations([{ label: "Long term", targetPercent: 101 }]),
    ActionInputError,
  );
});
