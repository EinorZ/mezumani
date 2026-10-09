import assert from "node:assert/strict";
import test from "node:test";
import { getLatestPendingMaturationDate } from "./nvidia-utils";

test("does not offer a wait scenario when every selected grant has matured", () => {
  const saleDate = new Date(2026, 8, 4);
  assert.equal(
    getLatestPendingMaturationDate(["09/04/24", "04/09/24"], saleDate),
    null,
  );
});

test("uses the latest future maturity date for a mixed selection", () => {
  const saleDate = new Date(2026, 8, 4);
  assert.deepEqual(
    getLatestPendingMaturationDate(
      ["09/04/24", "15/10/24", "20/11/24"],
      saleDate,
    ),
    new Date(2026, 10, 20),
  );
});
