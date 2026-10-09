import type {
  IncomeSource,
  LabelAllocation,
  MonthAllocation,
  RecurringExpense,
  SummaryCard,
  TransactionInput,
} from "./types";

const DEFAULT_MAX_TEXT_LENGTH = 500;
const MAX_LONG_TEXT_LENGTH = 2_000;
const MAX_BATCH_SIZE = 1_000;

interface TextOptions {
  allowEmpty?: boolean;
  maxLength?: number;
}

interface NumberOptions {
  min?: number;
  max?: number;
}

/**
 * A stable, intentionally non-sensitive error for invalid server-action input.
 */
export class ActionInputError extends Error {
  readonly code = "INVALID_ACTION_INPUT";

  constructor(
    readonly field: string,
    reason: string,
  ) {
    super(`Invalid ${field}: ${reason}`);
    this.name = "ActionInputError";
  }
}

function invalid(field: string, reason: string): never {
  throw new ActionInputError(field, reason);
}

export function assertText(
  value: unknown,
  field: string,
  options: TextOptions = {},
): asserts value is string {
  const { allowEmpty = false, maxLength = DEFAULT_MAX_TEXT_LENGTH } = options;
  if (typeof value !== "string") invalid(field, "must be a string");
  if (!allowEmpty && value.trim().length === 0) invalid(field, "is required");
  if (value.length > maxLength) {
    invalid(field, `must be at most ${maxLength} characters`);
  }
  if (/\0|[\u0001-\u0008\u000b\u000c\u000e-\u001f]/.test(value)) {
    invalid(field, "contains unsupported control characters");
  }
}

export function assertBoolean(
  value: unknown,
  field: string,
): asserts value is boolean {
  if (typeof value !== "boolean") invalid(field, "must be a boolean");
}

export function assertFiniteNumber(
  value: unknown,
  field: string,
  options: NumberOptions = {},
): asserts value is number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    invalid(field, "must be a finite number");
  }
  if (options.min !== undefined && value < options.min) {
    invalid(field, `must be at least ${options.min}`);
  }
  if (options.max !== undefined && value > options.max) {
    invalid(field, `must be at most ${options.max}`);
  }
}

export function assertInteger(
  value: unknown,
  field: string,
  options: NumberOptions = {},
): asserts value is number {
  assertFiniteNumber(value, field, options);
  if (!Number.isInteger(value)) invalid(field, "must be an integer");
}

export function assertEnum<T extends string>(
  value: unknown,
  field: string,
  allowed: readonly T[],
): asserts value is T {
  if (typeof value !== "string" || !allowed.includes(value as T)) {
    invalid(field, `must be one of: ${allowed.join(", ")}`);
  }
}

export function assertArray<T>(
  value: unknown,
  field: string,
  validateItem: (item: unknown, field: string) => asserts item is T,
  maxLength = MAX_BATCH_SIZE,
): asserts value is T[] {
  if (!Array.isArray(value)) invalid(field, "must be an array");
  if (value.length > maxLength) {
    invalid(field, `must contain at most ${maxLength} items`);
  }
  value.forEach((item, index) => validateItem(item, `${field}[${index}]`));
}

export function assertSheetTitle(
  value: unknown,
  field = "sheetTitle",
): asserts value is string {
  assertText(value, field, { maxLength: 100 });
}

export function assertSheetId(
  value: unknown,
  field = "sheetId",
): asserts value is number {
  assertInteger(value, field, { min: 0 });
}

export function assertSheetRow(
  value: unknown,
  field = "row",
): asserts value is number {
  assertInteger(value, field, { min: 2, max: 100_000 });
}

export function assertYearSuffix(
  value: unknown,
  field = "yearSuffix",
): asserts value is number {
  assertInteger(value, field, { min: 0, max: 99 });
}

export function assertInternalPath(
  value: unknown,
  field = "path",
): asserts value is string {
  assertText(value, field, { maxLength: 2_048 });
  if (!value.startsWith("/") || value.startsWith("//")) {
    invalid(field, "must be an application-relative path");
  }
  if (value.includes("://") || /[\r\n]/.test(value)) {
    invalid(field, "must not contain a URL or line break");
  }
}

export function assertTransactionInput(
  value: unknown,
  field = "transaction",
): asserts value is TransactionInput {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    invalid(field, "must be an object");
  }
  const transaction = value as Record<string, unknown>;
  assertText(transaction.date, `${field}.date`, {
    allowEmpty: true,
    maxLength: 30,
  });
  assertText(transaction.expense, `${field}.expense`, {
    allowEmpty: true,
    maxLength: 500,
  });
  assertFiniteNumber(transaction.amount, `${field}.amount`, {
    min: -1_000_000_000_000,
    max: 1_000_000_000_000,
  });
  assertText(transaction.category, `${field}.category`, {
    allowEmpty: true,
  });
  assertText(transaction.card, `${field}.card`, { allowEmpty: true });
  assertText(transaction.notes, `${field}.notes`, {
    allowEmpty: true,
    maxLength: MAX_LONG_TEXT_LENGTH,
  });
  if (transaction.updateExisting !== undefined) {
    assertBoolean(transaction.updateExisting, `${field}.updateExisting`);
  }
  if (transaction.tentative !== undefined) {
    assertBoolean(transaction.tentative, `${field}.tentative`);
  }
}

export function assertTransactionInputs(
  value: unknown,
  field = "transactions",
): asserts value is TransactionInput[] {
  assertArray(value, field, assertTransactionInput);
}

export function assertSheetRows(
  value: unknown,
  field = "rows",
): asserts value is number[] {
  assertArray(value, field, (item, itemField): asserts item is number =>
    assertSheetRow(item, itemField),
  );
  if (new Set(value).size !== value.length) {
    invalid(field, "must not contain duplicate rows");
  }
}

export function assertStringList(
  value: unknown,
  field: string,
  maxLength = MAX_BATCH_SIZE,
): asserts value is string[] {
  assertArray(
    value,
    field,
    (item, itemField): asserts item is string =>
      assertText(item, itemField, { maxLength: DEFAULT_MAX_TEXT_LENGTH }),
    maxLength,
  );
}

export function assertIncomeSources(
  value: unknown,
  field = "entries",
): asserts value is IncomeSource[] {
  assertArray(
    value,
    field,
    (item, itemField): asserts item is IncomeSource => {
      if (typeof item !== "object" || item === null || Array.isArray(item)) {
        invalid(itemField, "must be an object");
      }
      const entry = item as Record<string, unknown>;
      assertText(entry.name, `${itemField}.name`);
      assertFiniteNumber(entry.amount, `${itemField}.amount`);
    },
    100,
  );
}

export function assertMonthAllocations(
  value: unknown,
  field = "allocations",
): asserts value is MonthAllocation[] {
  assertArray(
    value,
    field,
    (item, itemField): asserts item is MonthAllocation => {
      if (typeof item !== "object" || item === null || Array.isArray(item)) {
        invalid(itemField, "must be an object");
      }
      const allocation = item as Record<string, unknown>;
      assertText(allocation.label, `${itemField}.label`);
      assertFiniteNumber(allocation.amount, `${itemField}.amount`);
    },
    100,
  );
}

export function assertSummaryCards(
  value: unknown,
  field = "items",
): asserts value is SummaryCard[] {
  assertArray(
    value,
    field,
    (item, itemField): asserts item is SummaryCard => {
      if (typeof item !== "object" || item === null || Array.isArray(item)) {
        invalid(itemField, "must be an object");
      }
      const card = item as Record<string, unknown>;
      assertText(card.label, `${itemField}.label`);
      assertStringList(card.categories, `${itemField}.categories`, 100);
    },
    100,
  );
}

export function assertRecurringExpenses(
  value: unknown,
  field = "items",
): asserts value is RecurringExpense[] {
  assertArray(
    value,
    field,
    (item, itemField): asserts item is RecurringExpense => {
      if (typeof item !== "object" || item === null || Array.isArray(item)) {
        invalid(itemField, "must be an object");
      }
      const expense = item as Record<string, unknown>;
      assertText(expense.name, `${itemField}.name`);
      assertFiniteNumber(expense.amount, `${itemField}.amount`);
      assertText(expense.category, `${itemField}.category`, {
        allowEmpty: true,
      });
      assertText(expense.card, `${itemField}.card`, { allowEmpty: true });
      assertText(expense.keywords, `${itemField}.keywords`, {
        allowEmpty: true,
        maxLength: MAX_LONG_TEXT_LENGTH,
      });
      if (expense.tentative !== undefined) {
        assertBoolean(expense.tentative, `${itemField}.tentative`);
      }
    },
    500,
  );
}

export function assertLabelAllocations(
  value: unknown,
  field = "allocations",
): asserts value is LabelAllocation[] {
  assertArray(
    value,
    field,
    (item, itemField): asserts item is LabelAllocation => {
      if (typeof item !== "object" || item === null || Array.isArray(item)) {
        invalid(itemField, "must be an object");
      }
      const allocation = item as Record<string, unknown>;
      assertText(allocation.label, `${itemField}.label`);
      assertFiniteNumber(
        allocation.targetPercent,
        `${itemField}.targetPercent`,
        {
          min: 0,
          max: 100,
        },
      );
      if (allocation.selectedStock !== undefined) {
        assertText(allocation.selectedStock, `${itemField}.selectedStock`, {
          allowEmpty: true,
        });
      }
      if (allocation.color !== undefined) {
        assertText(allocation.color, `${itemField}.color`, {
          allowEmpty: true,
          maxLength: 100,
        });
      }
    },
    500,
  );
}
