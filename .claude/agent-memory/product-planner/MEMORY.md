# Product Planner Memory - Mezumani

## Project Overview
- **App**: Personal finance tracker (Hebrew UI, RTL) for couple (Einor + Ziv)
- **Stack**: Next.js 16 + Google Sheets backend via googleapis
- **Schema**: Fixed A-F columns (date, expense, amount, category, card, notes)
- **Vacation sheets**: D=card, E=category (swapped from monthly)
- **Single user**: Not commercial. Optimize for simplicity over scalability.

## Key Architecture Patterns
- Server actions in `actions.ts` wrap `google-sheets.ts` functions
- Optimistic UI in `TransactionTable` with pending adds/edits/deletes
- Notes field (F) used for metadata: `auto:vacation:{sheetTitle}` for vacation sync
- Categories stored in settings with `name|#color` format
- Cards grouped by owner: einor, ziv, shared
- Annual data computed by batch-fetching all monthly sheets
- Main settings columns A-O already used

## Data Flow
- `getMonthlyData()` computes summary/categories/cards from raw transactions
- `getAnnualData()` batch-fetches all months, aggregates by category
- Summary cards defined in settings sheet (F+G columns)
- Transactions filtered in page: `auto:vacation:` rows hidden from table

## Stock Dashboard
- **Spreadsheet**: Separate spreadsheet (`GOOGLE_STOCKS_SPREADSHEET_ID`)
- **Settings sheet** ("הגדרות"): A-D=stocks, E-G=goals, H-J=brokers, **K=stock labels (planned)**
- **Transaction sheet** ("מניות"): 10 columns (date, type, symbol, qty, price, currency, term, bank, fee, notes)
- **Computation**: `stock-dashboard.ts` groups by (symbol, term) -> holdings -> terms -> totals
- **Charts**: recharts@3.7.0 installed. `category-chart.tsx` has reusable donut pattern
- **Price sources**: yahoo-finance2 (US), TheMarker scrape (TASE), 5-min cache
- **Stock definition CRUD**: writes A:D range per row, uses `findFirstEmptyRowInRange`
- Key decisions: sell txs, capital gains 25%, (symbol,term) grouping, drawer for tx form
- Deferred: dividends, historical tracking, alerts

## Conventions
- Hebrew labels throughout UI
- `parseNumber()` for safe number parsing from sheet strings
- `formatCurrency()` uses ILS locale
- Sheet titles: `{HebrewMonth} {YY}` for monthly, `{Name} {YY}` for vacation
- `batchUpdateFields()` for efficient multi-row edits
- Settings CRUD pattern: constants.ts ranges -> google-sheets.ts read/write -> actions.ts + revalidatePath

## Tentative Amounts Feature (Planned)
- Storage: amount in F column (instead of C), C left empty
- Display: orange text (#e8a838) for tentative amounts
- Excluded from all totals, charts, annual aggregations
- Toggle via checkbox in add/edit form + bulk toggle in selection bar
