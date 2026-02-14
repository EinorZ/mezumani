# Stock Dashboard Plan

## Overview

A stock portfolio dashboard integrated into Mezumani, allowing tracking of stock purchases and sales across brokers, monitoring portfolio performance, and tracking progress toward investment goals — all backed by Google Sheets and with live price data for both US and Israeli (TASE) stocks.

---

## Technical Approach: Stock Price Data

### Two data sources (PoC validated)

| Source | Covers | Method |
|--------|--------|--------|
| `yahoo-finance2` npm package | US stocks (QQQ, VOO, NVDA etc.) + USD/ILS rate | Direct API call |
| TheMarker scrape (`finance.themarker.com/etf/{id}`) | Israeli ETFs/funds by TASE security number | HTML scrape, extract `"value"` from embedded data |

#### PoC Results

**US Stocks** — `yahoo-finance2` (v3, constructor: `new YahooFinance()`):
```
QQQ    | Invesco QQQ Trust              | $609.65  | ₪1,901
VOO    | Vanguard S&P 500 ETF           | $635.24  | ₪1,981
CHAT   | Roundhill Generative AI & Tech  | $60.77   | ₪190
NVDA   | NVIDIA Corporation             | $185.41  | ₪578
SPEM   | SPDR Portfolio Emerging Markets | $49.91   | ₪156
BBEU   | JPMorgan BetaBuilders Europe    | $77.43   | ₪241
```

**Israeli ETFs/Funds** — TheMarker scrape:
```
1159169 | ISHARES CORE MSCI EM IMI UCITS ETF          | ₪15,150
1159094 | ISHARES CORE MSCI EUROPE UCITS ETF EUR (ACC) | ₪35,810
1159250 | ISHARES CORE S&P 500 UCITS ETF               | ₪228,700
5128905 | קסם NASDAQ 100 (4D) KTF                      | ₪151.85
5124482 | קסם S&P 500 (4D) KTF                         | ₪151.85
```

**USD/ILS**: Yahoo (`USDILS=X`) primary, Frankfurter API fallback.

**Caching**: In-memory cache with 5-min TTL to avoid rate limits.

---

## Product Decisions

### Resolved Questions

1. **Sell transactions** — YES, include from the start. Add a `סוג עסקה` (transaction type) column with values `קניה` / `מכירה`. Without sell support, portfolio values diverge from reality. Sell transactions subtract from total shares using simple weighted average cost basis (no FIFO/LIFO complexity needed).

2. **Dividends** — NO, defer. P&L without dividends is still useful (slightly understates total returns). When added later, use a new `דיבידנד` transaction type.

3. **Multiple portfolios (same ticker in multiple terms)** — Already supported by the data model. Transactions have both `symbol` and `term` fields. Holdings must be grouped by `(symbol, term)` pair, not just `symbol`.

4. **Historical tracking** — NO, defer indefinitely. The transaction log IS the history. Point-in-time values can be computed retroactively from transactions + Yahoo historical prices if ever needed.

5. **Alerts** — NO. The dashboard with color-coded P&L and goal progress bars serves as a visual alert system. Push alerts need notification infrastructure disproportionate for a personal tool.

6. **Tax implications** — YES, simple display only. Show estimated capital gains tax (25% in Israel) in the fee breakdown card: `positive P&L * 0.25`. Only show when P&L is positive. Include a disclaimer that it's an estimate.

---

## Data Model (Google Sheets)

### Settings: Stock Config Tab in "הגדרות" Sheet

All stock-related configuration lives in the existing settings sheet alongside the monthly settings, using new columns.

**Column P: Stock definitions — symbol/number**
The ticker (for US) or TASE security number (for Israeli). This is the master stock list used across the app.
```
QQQ
VOO
NVDA
CHAT
SPEM
BBEU
1159169
1159094
1159250
5128905
5124482
```

**Column Q: Stock definitions — display name**
Human-readable name shown in the UI.
```
Invesco QQQ (NASDAQ 100)
Vanguard S&P 500
NVIDIA
Roundhill AI & Tech
SPDR Emerging Markets
JPMorgan Europe
iShares Emerging Markets
iShares Europe
iShares S&P 500
קסם NASDAQ 100
קסם S&P 500
```

**Column R: Stock definitions — source**
Which data source to use for price: `yahoo` or `themarker`.
```
yahoo
yahoo
yahoo
yahoo
yahoo
yahoo
themarker
themarker
themarker
themarker
themarker
```

**Column S: Stock definitions — currency**
```
USD
USD
USD
USD
USD
USD
ILS
ILS
ILS
ILS
ILS
```

**Column T: Goals — term name**
```
קצר
בינוני
ארוך
```

**Column U: Goals — target label**
```
קרן חירום
דירה
פנסיה
```

**Column V: Goals — target amount (ILS)**
```
50000
500000
2000000
```

**Column W: Bank/broker names**
```
IBI
מזרחי
```

**Column X: Bank — management fee (% quarterly)**
```
0.1
0.15
```

**Column Y: Bank — purchase fee (% of amount)**
```
0.1
0.08
```

### New Sheet: "מניות" (Stock Transactions)

One row per stock transaction (buy or sell). This is the transaction log.

| Column | Header | Description | Example |
|--------|--------|-------------|---------|
| A | תאריך | Transaction date | `15/01/26` |
| B | סוג עסקה | Transaction type: `קניה` / `מכירה` | `קניה` |
| C | סימול | Stock symbol/number (from settings dropdown) | `QQQ` or `5128905` |
| D | כמות | Number of shares/units | `10` |
| E | מחיר יחידה | Price per share at transaction | `189.50` |
| F | מטבע | Currency (`USD` / `ILS`) — auto-filled from stock config | `USD` |
| G | סוג | Investment term: `קצר` / `בינוני` / `ארוך` | `ארוך` |
| H | בנק | Broker/bank name (from settings dropdown) | `IBI` |
| I | מס קניה | Purchase tax — entered manually | `15.00` |
| J | הערות | Notes | — |

**Key design decisions:**
- Stock is selected from a **dropdown** of pre-configured stocks (from settings columns P-Q)
- Display name is derived from settings at display time (not stored per transaction)
- **מס קניה (purchase tax)** is entered manually per transaction, not auto-calculated
- Currency auto-fills based on the stock's configured currency
- **סוג עסקה** (buy/sell) column added — sell transactions subtract from holdings using weighted average cost basis

---

## App Config Extensions

```typescript
// New types in lib/types.ts

type TransactionType = "קניה" | "מכירה";
type InvestmentTerm = "קצר" | "בינוני" | "ארוך";
type StockCurrency = "USD" | "ILS";
type PriceSource = "yahoo" | "themarker";

interface StockDefinition {
  symbol: string;          // Yahoo ticker or TASE security number
  displayName: string;     // Human-readable name
  source: PriceSource;
  currency: StockCurrency;
}

interface StockTransaction {
  row: number;
  date: string;
  type: TransactionType;   // קניה or מכירה
  symbol: string;          // references StockDefinition.symbol
  quantity: number;
  pricePerShare: number;
  currency: StockCurrency;
  term: InvestmentTerm;
  bank: string;
  purchaseTax: number;     // manually entered per transaction
  notes: string;
}

interface StockGoal {
  term: InvestmentTerm;
  label: string;           // e.g. "קרן חירום"
  targetAmount: number;    // in ILS
}

interface BrokerConfig {
  name: string;
  managementFeePercent: number;  // quarterly %
  purchaseFeePercent: number;    // % of transaction amount
}

interface StockHolding {
  symbol: string;
  displayName: string;
  term: InvestmentTerm;
  totalShares: number;          // net shares (buys - sells)
  avgCostPerShare: number;
  totalInvested: number;         // sum of (qty * price) for buys
  totalSold: number;             // sum of (qty * price) for sells
  totalPurchaseTax: number;      // sum of manually entered taxes
  totalMgmtFees: number;        // estimated quarterly mgmt fees to date
  currency: StockCurrency;
  currentPrice: number;          // live price
  currentValue: number;          // totalShares * currentPrice
  currentValueILS: number;       // converted to ILS if USD
  profitLoss: number;            // currentValueILS - totalInvestedILS - totalFees
  profitLossPercent: number;
}

interface StockDashboardData {
  holdings: StockHolding[];
  byTerm: {
    term: InvestmentTerm;
    holdings: StockHolding[];
    totalValueILS: number;
    totalInvestedILS: number;
    totalFees: number;
    profitLoss: number;
    profitLossPercent: number;
    allocationPercent: number;   // % of total portfolio
    goals: StockGoal[];
  }[];
  totals: {
    totalValueILS: number;
    totalInvestedILS: number;
    totalFees: number;
    totalProfitLoss: number;
    totalProfitLossPercent: number;
    estimatedCapitalGainsTax: number; // 25% of positive P&L
    monthlyInvestmentRate: number;    // avg monthly investment (last 90 days)
  };
  currencyExposure: {
    usd: { amountILS: number; percent: number };
    ils: { amountILS: number; percent: number };
  };
  usdToIls: number;
  lastUpdated: Date;              // price fetch timestamp
}
```

---

## Pages & Routes

### 1. Stock Dashboard: `/stocks`

Main portfolio overview page.

### 2. Settings additions: `/settings`

New sections in the existing settings page (same sheet tab "הגדרות"):
- Stock definitions (symbol + display name + source + currency)
- Broker/bank configuration (name, quarterly mgmt fee %, purchase fee %)
- Investment goals per term

---

## UI/UX Design

### Navigation

Add a **top-level "השקעות" (Investments) section** in the sidebar, **above** the year groups. This is not time-scoped like monthly sheets — the portfolio is a cross-cutting, always-relevant view.

```
[Logo]

── השקעות ──
  תיק מניות           → /stocks

── 2026 ──
  סיכום שנתי
  חודשים ▼
    ינואר, פברואר...
  חופשות ▼
    ...

[Settings]
```

Use `sidebar-section-label` for the header and `sidebar-link` with active green highlight for the link. Icon: `BarChart3` from lucide.

### Stock Dashboard Page (`/stocks`)

#### Information Hierarchy (top to bottom)

The page is optimized for the 95% use case: **checking portfolio values**. Read-heavy layout, with write actions (add transaction) accessible but not always visible.

#### Section 1: Summary Cards (3 cards)

3 cards (not 4 — matches existing app pattern of 3 top cards per page). Fees are merged into the P&L card as a subtitle.

| Card | Gradient | Icon | Content |
|------|----------|------|---------|
| שווי תיק כולל | `card-green-gradient` | `TrendingUp` | Total portfolio value (ILS) |
| סה"כ השקעה | `card-blue-gradient` | `Wallet` | Total invested amount |
| רווח/הפסד כולל | `card-green-gradient` or `card-red-gradient` (dynamic) | `TrendingUp` / `TrendingDown` | P&L amount + %, subtitle: `כולל X עמלות ומסים` |

Below the cards, show small text: `שער דולר: X.XX | מחירים עודכנו לפני X דקות` with a refresh button (`RefreshCw` icon).

#### Section 2: Holdings Table (primary working surface)

Moved **above** the term breakdown — this is the operational view users check most.

**Filter pills row** at top of the card:
```
[הכל]  [קצר]  [בינוני]  [ארוך]     [+ הוסף עסקה] button (top-right)
```
Active pill: `bg-dark text-white rounded-pill`. Inactive: `bg-transparent text-muted border rounded-pill`.

**Table columns** (RTL order):

| Column | Description | Notes |
|--------|-------------|-------|
| שם | Display name (bold) + symbol below (small muted) | Combined cell |
| סוג | Term badge | Amber/blue/green pill badges |
| כמות | Net shares | |
| עלות ממוצעת | Avg cost per share | For USD: show both `$189.50 (₪591)` |
| מחיר נוכחי | Live price | |
| שווי | Current value (ILS, bold) | Always ILS |
| רווח/הפסד | P&L amount + % | Green/red colored, wrapped in `<span dir="ltr">` |
| בנק | Broker name (small badge) | |

- Sortable by column header click (ascending toggle descending)
- Default sort: by current value (descending)
- Drop the separate "fees" column — visible in fee breakdown section

**Row actions**: Small action menu per holding row:
- "קנה עוד" — opens add panel pre-filled in buy mode
- "מכור" — opens add panel pre-filled in sell mode

**Mobile (below lg)**: Replace table with **card-per-holding** layout:
```
┌──────────────────────────────┐
│  QQQ  Invesco QQQ (NASDAQ)   │
│  ─────────────────────────── │
│  10 יח' @ $189.50            │
│  שווי: 18,950   רווח: +2,100 │
│  ├───────────────────────┤   │
│  ארוך | IBI | 15 עמלות       │
└──────────────────────────────┘
```

#### Section 3: Term Breakdown (3 columns)

Three cards, one per investment term. Each card has a colored left border accent (RTL: `border-inline-start`).

| Term | Badge color | Border accent |
|------|-------------|---------------|
| קצר | `bg-warning text-dark` (amber) | amber |
| בינוני | `bg-info text-dark` (blue) | blue |
| ארוך | `bg-success` (green) | green |

Card content:
```
┌─────────────────────────────────┐
│  ארוך טווח          65% מהתיק   │  ← header with allocation %
│  ═══════════════════════════════ │
│                                  │
│  שווי        ₪450,000           │
│  השקעה       ₪380,000           │
│  רווח        +₪70,000 (+18.4%)  │  ← colored green/red
│                                  │
│  ── יעד: פנסיה ──               │
│  ████████░░░░░░░░░ 22.5%        │  ← progress bar (8px, slim)
│  ₪450,000 / ₪2,000,000         │
│                                  │
│  ── מניות ──                     │
│  QQQ       10 יח'    ₪18,950   │  ← mini holdings list
│  VOO        5 יח'    ₪22,100   │
└─────────────────────────────────┘
```

Progress bar: 8px height, 4px border-radius, gradient matching term color. At 100%+: full green with checkmark.

**Mobile (below md)**: Tab-based layout instead of stacking 3 tall cards:
```
┌──────────────────────────────┐
│  [קצר]  [בינוני]  [ארוך]     │  ← tab buttons
├──────────────────────────────┤
│  (selected term card content) │
└──────────────────────────────┘
```

#### Section 4: Fee Breakdown (collapsed by default)

Use `CollapsibleSection` with `defaultOpen={false}`.

Content:
- **דמי ניהול רבעוניים** — per bank breakdown
- **מס קניה שנגבה** — total purchase taxes paid
- **מס רווח הון משוער** — estimated 25% capital gains tax (only if P&L > 0, with disclaimer)
- **השפעה על תשואה** — fee + tax impact as % of returns

Accent color: orange (`card-orange-gradient`).

#### Section 5: Currency Exposure (small card)

Small card showing:
- `חשיפה לדולר: ₪X (Y%)`
- `חשיפה לשקל: ₪X (Y%)`

#### Empty State

When no transactions exist:
```
[BarChart3 icon, size 48, text-muted]
עדיין אין עסקאות מניות
הגדר מניות בהגדרות והוסף את הרכישה הראשונה
[CTA: + הוסף עסקה ראשונה]
```

### Add Transaction: Slide-out Panel

**Not inline, not modal** — a slide-out panel from the right edge (RTL), ~400px wide on desktop, full-width on mobile.

Triggered by:
- "+ הוסף עסקה" button at top of holdings table
- "קנה עוד" / "מכור" quick actions on holding rows

Fields (in order):
1. **סוג עסקה** — buy/sell toggle, defaults to buy (or pre-filled from quick action)
2. **מניה** — searchable dropdown (display name + symbol), from stock definitions
3. **כמות** — number input
4. **מחיר יחידה** — auto-filled from live price when stock selected, with `מחיר שוק` label, editable
5. **תאריך** — date picker, defaults to today
6. **סוג** — term dropdown (defaults to last used term for that stock)
7. **בנק** — dropdown (defaults to last used bank)
8. **מס קניה** — optional number input

Submit: `btn btn-success`. Panel stays open after submission with success toast (for adding multiple transactions). Holdings table updates optimistically behind the panel.

### Transaction Edit/Delete

Holdings table rows support edit and delete following the same pattern as `TransactionTable` for expenses. This is critical for correcting data entry mistakes.

### RTL Number Handling

P&L values (+/-) must be wrapped in `<span dir="ltr">` or use `direction: ltr; unicode-bidi: isolate` to prevent the sign from jumping to the wrong side in RTL context. This applies to all P&L displays (cards, table cells, term cards).

---

## Settings Page Additions

All in the existing "הגדרות" sheet tab. New `settings-group` with header: `השקעות`.

### Section: מניות (Stock Definitions)

Accent: blue. Same editable-list pattern as existing CategoryList.

Fields per row:
- סימול (symbol or TASE number)
- שם תצוגה (display name)
- מקור מחיר (yahoo / themarker dropdown)
- מטבע (USD / ILS dropdown)

Add/edit/remove rows. This list populates the dropdown when adding transactions.

### Section: בנקים ועמלות (Banks & Fees)

Accent: green. Similar to IncomeSourceList pattern.

Fields per row:
- שם הבנק (name)
- דמי ניהול רבעוניים (% quarterly management fee)
- עמלת קניה באחוזים (% purchase fee)

Add/edit/remove rows.

### Section: יעדי השקעה (Investment Goals)

Accent: purple.

Fields per row:
- סוג (term: קצר/בינוני/ארוך dropdown)
- שם היעד (goal label)
- סכום יעד (target amount in ILS)

Add/edit/remove rows.

---

## Implementation Phases

### Phase 1: Foundation

1. `npm install yahoo-finance2` (already installed)
2. Add new types to `lib/types.ts`
3. Add settings columns (P-Y) to existing "הגדרות" sheet
4. Create `getStockConfig()` in `google-sheets.ts` (reads stock definitions, brokers, goals)
5. Add settings UI for stock definitions, brokers, and goals
6. Create server actions for settings CRUD

### Phase 2: Transaction Sheet & Input

1. Create "מניות" sheet auto-creation (like `createMonthSheet()`)
2. Add `getStockTransactions()` to read all stock transactions
3. Add `addStockTransaction()` server action (supports both buy and sell)
4. Add `editStockTransaction()` and `deleteStockTransaction()` server actions
5. Build the slide-out "Add Transaction" panel component with:
   - Buy/sell toggle
   - Stock searchable dropdown populated from settings
   - Bank dropdown populated from settings
   - Manual מס קניה input
   - Auto-fill currency + price from stock config/live data
   - Optimistic UI updates
6. Build transaction edit/delete in holdings table rows

### Phase 3: Price Fetching & Portfolio Computation

1. Create `lib/stock-prices.ts`:
   - `fetchUSStockPrice(symbol)` — Yahoo Finance
   - `fetchIsraeliETFPrice(id)` — TheMarker scrape
   - `fetchUsdToIls()` — Yahoo with Frankfurter fallback
   - `fetchAllPrices(stockDefs[])` — routes each stock to the right source
   - In-memory cache (5-min TTL)
2. Create `getStockDashboardData()`:
   - Read transactions from "מניות" sheet
   - Read stock config from settings
   - Group by `(symbol, term)` pair → compute holdings (net shares after sells, avg cost via weighted average)
   - Fetch live prices (yahoo for US, themarker for Israeli)
   - Convert USD holdings to ILS
   - Compute P&L per holding (including purchase taxes + estimated quarterly mgmt fees)
   - Compute allocation percentages per term
   - Compute currency exposure (USD vs ILS)
   - Compute estimated capital gains tax (25% of positive P&L)
   - Compute monthly investment rate (last 90 days)
   - Group by term, match goals
   - Include `lastUpdated` timestamp

### Phase 4: Dashboard UI

1. Create `/stocks` route and page (server component)
2. Build 3 summary cards + USD rate + last-updated indicator
3. Build holdings table (client component: sortable, filterable, with action menu)
4. Build slide-out add-transaction panel
5. Build term breakdown cards (3 columns, tabs on mobile)
6. Build fee/tax breakdown collapsible section
7. Build currency exposure card
8. Build empty state
9. Add "השקעות" section to sidebar navigation (above year groups)

### Phase 5: Polish

1. Color-coded P&L (green/red) with proper RTL `dir="ltr"` wrapping
2. Responsive layout:
   - Mobile holdings: card-per-holding layout (below lg)
   - Mobile term breakdown: tab switcher (below md)
   - Mobile add panel: full-width overlay
3. Loading skeleton (`loading.tsx`) — 3 shimmer cards + shimmer table rows
4. Error boundary (`error.tsx`)
5. Currency exposure summary
6. Allocation percentages per term and per stock
7. Manual price refresh button (cache-bust)
8. Quick actions on holdings rows (buy more / sell)
9. Monthly investment rate metric display

### Deferred (not in scope)

- Dividends (add as `דיבידנד` transaction type later)
- Historical portfolio tracking / daily snapshots
- Push alerts / notifications
- Multiple goals per term
- Timeline-based goals with target dates
- Portfolio allocation donut chart (revisit when chart library is mature)

---

## File Structure (New/Modified)

```
src/
  lib/
    types.ts              # + StockDefinition, StockTransaction, StockGoal, BrokerConfig, etc.
    google-sheets.ts      # + getStockConfig, getStockTransactions, addStockTransaction, editStockTransaction, deleteStockTransaction
    stock-prices.ts       # NEW: Yahoo + TheMarker price fetching with cache
    actions.ts            # + stock-related server actions
    constants.ts          # + STOCKS_SHEET_NAME, settings ranges P-Y
    utils.ts              # + stock formatting helpers

  app/
    stocks/
      page.tsx            # NEW: Stock dashboard page (server component)
      loading.tsx         # NEW: Loading skeleton (shimmer)
      error.tsx           # NEW: Error boundary

  components/
    stock-summary-cards.tsx     # NEW: 3 gradient summary cards (server component)
    stock-holdings-table.tsx    # NEW: Holdings table with sort/filter (client component)
    stock-holdings-card.tsx     # NEW: Mobile card layout for holdings (client component)
    stock-term-cards.tsx        # NEW: Term breakdown wrapper — columns desktop, tabs mobile (client component)
    stock-term-card.tsx         # NEW: Single term card with goal progress (presentational)
    stock-add-panel.tsx         # NEW: Slide-out transaction form (client component)
    stock-fee-breakdown.tsx     # NEW: Fee + tax summary in CollapsibleSection (server component)
    stock-currency-exposure.tsx # NEW: Currency exposure card
    stock-definition-list.tsx   # NEW: Settings CRUD for stock definitions (client component)
    broker-list.tsx             # NEW: Settings CRUD for banks (client component)
    stock-goal-list.tsx         # NEW: Settings CRUD for goals (client component)

  scripts/
    stock-poc.ts              # PoC script (already created & validated)
    stock-poc-israel.ts       # Israeli ETF scraping PoC (already created & validated)
```
