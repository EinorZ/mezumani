# Product Planner Memory - Mezumani

## Project Overview
- **App**: Personal finance tracker (Hebrew UI) for couple (Einor + Ziv)
- **Stack**: Next.js + Google Sheets backend via googleapis
- **Schema**: Fixed A-F columns (date, expense, amount, category, card, notes)
- **Vacation sheets**: D=card, E=category (swapped from monthly)

## Key Architecture Patterns
- Server actions in `actions.ts` wrap `google-sheets.ts` functions
- Optimistic UI in `TransactionTable` with pending adds/edits/deletes
- Notes field (F) used for metadata: `auto:vacation:{sheetTitle}` for vacation sync
- Categories stored in settings with `name|#color` format
- Cards grouped by owner: einor, ziv, shared
- Annual data computed by batch-fetching all monthly sheets

## Data Flow
- `getMonthlyData()` computes summary/categories/cards from raw transactions
- `getAnnualData()` batch-fetches all months, aggregates by category
- Summary cards defined in settings sheet (F+G columns)
- Transactions filtered in page: `auto:vacation:` rows hidden from table, shown as vacation summary

## Conventions
- Hebrew labels throughout UI
- `parseNumber()` for safe number parsing from sheet strings
- `formatCurrency()` uses ILS locale
- Sheet titles: `{HebrewMonth} {YY}` for monthly, `{Name} {YY}` for vacation
- `batchUpdateFields()` for efficient multi-row edits

## Tentative Amounts Feature (Planned)
- Storage: `~` prefix in notes field (column F)
- Display: orange text (#e8a838) for tentative amounts
- Excluded from all totals, charts, annual aggregations
- Toggle via checkbox in add/edit form + bulk toggle in selection bar
- See plan: `.claude/plans/sorted-cooking-sketch-agent-a7d9145.md`
