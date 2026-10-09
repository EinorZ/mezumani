# Google Sheets persistence contracts

This document records the storage behavior the application currently relies on.
It is a compatibility contract, not a recommendation for the final architecture.
Changes to sheet names, columns, authentication, or migration behavior require an
explicit migration plan and approval.

## Authentication and workbook selection

Every request creates a Google service-account JWT with the Sheets read/write
scope. The application has no separate user authentication or authorization
layer; spreadsheet access is determined entirely by the service-account
credentials.

| Environment variable           | Contract                                                                                                                     |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------- |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | Service-account identity used by both adapters.                                                                              |
| `GOOGLE_PRIVATE_KEY`           | Private key; escaped `\\n` sequences are converted to line breaks.                                                           |
| `GOOGLE_SPREADSHEET_ID`        | Primary workbook for monthly, annual, vacation, and household settings tabs. Required.                                       |
| `GOOGLE_STOCKS_SPREADSHEET_ID` | Investment workbook for stock, RSU, and pension tabs. Stocks fall back to the primary workbook when absent; pensions do not. |

Secrets must remain server-only and must never be exposed through `NEXT_PUBLIC_`
variables or committed files.

## Primary household workbook

Tab names are part of the data model and are classified by convention:

- `הגדרות` is the household settings tab.
- `שנתי YY` is an annual tab.
- `{Hebrew month} YY` is a monthly tab.
- Any other title ending in ` YY` is treated as a vacation tab.
- Everything else is ignored by normal household views.

Two-digit years are stored and compared as numbers. Renaming a tab can therefore
change its application type.

### Monthly tabs

| Range | Meaning                                                                                          |
| ----- | ------------------------------------------------------------------------------------------------ |
| `A:F` | Date, expense, confirmed amount, category, card, tentative amount/legacy notes. Rows start at 2. |
| `G1`  | Literal `done` includes the month in annual calculations; blank excludes it.                     |
| `H:I` | Income source and amount; row 1 is the total/header and data starts at row 2.                    |
| `K:L` | Monthly allocation label and amount.                                                             |

Tentative transactions store their amount in column F and leave column C empty.
Confirmed transactions store their amount in C. Some legacy values in F are
treated as notes, so this overloaded column must be preserved until a migration
separates the concepts. Transaction deletion clears cells; it does not delete the
physical sheet row. New transactions use the first row after the last populated
expense within the supported row window.

Annual summaries are derived at read time from monthly tabs marked `done`; the
annual tab is not the source of truth for dashboard totals.

### Vacation tabs

Vacation transactions also occupy `A:F`, but columns D and E are deliberately
swapped relative to monthly tabs: D is card and E is category. Column F holds the
tentative amount. Creation also writes summary formulas outside that range.

Moving transactions between monthly and vacation tabs must preserve this mapping.
Deletion clears source cells after destination writes; it does not remove rows.

### Household settings tab

The `הגדרות` tab is a column-oriented configuration store:

| Columns | Data                                                             |
| ------- | ---------------------------------------------------------------- | --------------- |
| `A:B`   | Monthly and vacation categories. Category values may include a ` | #color` suffix. |
| `C:E`   | Card names for the two owners and shared cards.                  |
| `F:G`   | Summary-card labels and category lists.                          |
| `H:I`   | Recurring expense names and encoded data.                        |
| `J:K`   | Expense-to-category mappings.                                    |
| `L:M`   | Expense rename targets and keyword lists.                        |
| `N:O`   | Income source names and encoded amounts.                         |
| `P`     | Annual savings goals, including legacy/current representations.  |
| `Q:R`   | Year-specific irregular-expense categories.                      |

`ensureSettingsSheet()` creates the tab and headers when missing. Reading config
can invoke the one-time category-color migration, which discovers categories from
transaction tabs and rewrites settings columns that lack color suffixes. Treat
configuration reads as potentially mutating until this migration is extracted.

## Investment workbook

### Investment settings (`הגדרות`)

| Columns | Data                                                              |
| ------- | ----------------------------------------------------------------- |
| `A:E`   | Stock symbol, name, price source, currency, and allocation label. |
| `F:H`   | Goal term, label, and target amount.                              |
| `I:K`   | Broker name, management fee, and purchase fee.                    |
| `L:O`   | Allocation label, target percent, selected stock, and color.      |
| `P:Q`   | Cached completed-year portfolio returns.                          |

The stock settings tab is created on demand. Saved completed-year returns are
cache entries and existing years are intentionally not overwritten by the return
calculation action.

### Stock transactions (`מניות`)

Rows start at 2 and use `A:J`: date, transaction type, symbol, quantity, unit
price in ILS, currency, investment term, bank, purchase fee, and notes. Supported
transaction types are `קניה` and `מכירה`; currencies are `ILS` and `USD`; terms
are `קצר`, `בינוני`, `ארוך`, and `לימבו`.

The tab and headers are created on first read when missing. Writes use
`USER_ENTERED`. Deletion clears `A:J` without deleting the row.

### RSUs (`nvidia`)

Vest rows use `A:H`: grant date, total grant shares, vest date, vest shares, vest
price in USD, notes, grant name, and sold flag. `J2:M2` stores gross-to-date,
monthly salary, monthly ESPP contribution, and ESPP purchase price.

The tab is created on first read when missing, and existing headers are rewritten
on each ensure call. Sold is represented as `TRUE` or blank.

### Pensions (`חיסכון`)

Rows use `A:G`: owner, fund name, fund type, track, balance, last-updated date,
and company. Owners are `עינור` or `זיו`; fund types are `פנסיה` or
`קרן השתלמות`.

`getPensionData()` calls `ensurePensionSheet()` before reading. That ensure path
creates the tab if absent and currently deletes a legacy tab named
`היסטוריית חיסכון` if present. This is a known read-time destructive migration;
do not alter or repeat it elsewhere without an approved migration plan.

## Mutation boundary invariants

All exported server actions validate untrusted arguments before constructing a
range or calling a persistence adapter. The shared guards enforce:

- finite bounded numbers and integer spreadsheet identifiers/rows;
- allow-listed enum values;
- bounded strings without unsupported control characters;
- bounded arrays and unique row lists for destructive batches;
- structured transaction/configuration records; and
- application-relative paths for cache revalidation.

Validation errors use `ActionInputError` with code `INVALID_ACTION_INPUT` and do
not include credentials or spreadsheet contents. Lower-level adapters may still
throw operational Google API errors; user-facing error normalization is a later
phase.

## Compatibility rules for future changes

1. Preserve existing tab names and column order until a versioned migration is
   approved and tested against a copy of production data.
2. Do not change service-account, authentication, or workbook selection behavior
   without approval.
3. Keep cross-tab moves ordered so destination writes succeed before source cells
   are cleared; add recovery or idempotency before changing that workflow.
4. Add fixture-based adapter tests before extracting the monolithic Sheets module.
5. Move read-time creation and migrations to explicit bootstrap/admin operations
   only after their existing side effects have regression coverage.
