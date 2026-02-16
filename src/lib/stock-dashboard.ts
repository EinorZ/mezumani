import { getStockConfig, getStockTransactions } from "./google-sheets";
import {
  fetchAllPrices,
  fetchYTDStartPrices,
  fetchUsdToIls,
  fetchHistoricalPrices,
} from "./stock-prices";
import type {
  StockDashboardData,
  StockHolding,
  StockTermGroup,
  StockTransaction,
  StockDefinition,
  InvestmentTerm,
  BrokerConfig,
  ChartRange,
  PortfolioHistoryPoint,
  PortfolioReturns,
} from "./types";

/**
 * Compute the full stock dashboard data.
 */
export async function getStockDashboardData(): Promise<StockDashboardData> {
  const [config, transactions, usdToIls] = await Promise.all([
    getStockConfig(),
    getStockTransactions(),
    fetchUsdToIls(),
  ]);

  const [prices, ytdStartPrices] = await Promise.all([
    fetchAllPrices(config.stocks),
    fetchYTDStartPrices(config.stocks),
  ]);
  const stockMap = new Map(config.stocks.map((s) => [s.symbol, s]));
  const brokerMap = new Map(config.brokers.map((b) => [b.name, b]));

  // Group transactions by (symbol, term) pair
  const holdingKey = (symbol: string, term: string) => `${symbol}::${term}`;
  const groups = new Map<string, StockTransaction[]>();

  for (const tx of transactions) {
    const key = holdingKey(tx.symbol, tx.term);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(tx);
  }

  // Compute holdings
  const holdings: StockHolding[] = [];

  for (const [, txs] of groups) {
    const first = txs[0];
    const stockDef = stockMap.get(first.symbol);
    if (!stockDef) continue;

    const holding = computeHolding(txs, stockDef, prices, ytdStartPrices, usdToIls, brokerMap);
    if (holding.totalShares > 0) {
      holdings.push(holding);
    }
  }

  // Sort by current value descending
  holdings.sort((a, b) => b.currentValueILS - a.currentValueILS);

  // Group by term
  const terms: InvestmentTerm[] = ["קצר", "בינוני", "ארוך", "לימבו"];
  const totalPortfolioValue = holdings.reduce(
    (s, h) => s + h.currentValueILS,
    0,
  );

  const byTerm: StockTermGroup[] = terms.map((term) => {
    const termHoldings = holdings.filter((h) => h.term === term);
    const totalValueILS = termHoldings.reduce(
      (s, h) => s + h.currentValueILS,
      0,
    );
    const totalInvestedILS = termHoldings.reduce(
      (s, h) => s + h.totalInvestedILS,
      0,
    );
    const totalFees = termHoldings.reduce((s, h) => s + h.totalMgmtFees, 0);
    const profitLoss = totalValueILS - totalInvestedILS - totalFees;
    const profitLossPercent =
      totalInvestedILS > 0 ? (profitLoss / totalInvestedILS) * 100 : 0;
    const allocationPercent =
      totalPortfolioValue > 0 ? (totalValueILS / totalPortfolioValue) * 100 : 0;
    const goals = config.goals.filter((g) => g.term === term);

    return {
      term,
      holdings: termHoldings,
      totalValueILS,
      totalInvestedILS,
      totalFees,
      profitLoss,
      profitLossPercent,
      allocationPercent,
      goals,
    };
  });

  // Totals
  const totalInvestedILS = holdings.reduce((s, h) => s + h.totalInvestedILS, 0);
  const totalFees = holdings.reduce((s, h) => s + h.totalMgmtFees, 0);
  const totalProfitLoss = totalPortfolioValue - totalInvestedILS - totalFees;
  const totalProfitLossPercent =
    totalInvestedILS > 0 ? (totalProfitLoss / totalInvestedILS) * 100 : 0;
  const estimatedCapitalGainsTax =
    totalProfitLoss > 0 ? totalProfitLoss * 0.25 : 0;

  // Portfolio-level YTD: weighted average by current value
  const holdingsWithYtd = holdings.filter((h) => h.ytdChangePercent !== null);
  const ytdWeightedSum = holdingsWithYtd.reduce(
    (s, h) => s + h.ytdChangePercent! * h.currentValueILS,
    0,
  );
  const ytdTotalWeight = holdingsWithYtd.reduce(
    (s, h) => s + h.currentValueILS,
    0,
  );
  const portfolioYtd =
    ytdTotalWeight > 0 ? ytdWeightedSum / ytdTotalWeight : null;

  // Currency exposure
  const usdHoldingsILS = holdings
    .filter((h) => h.currency === "USD")
    .reduce((s, h) => s + h.currentValueILS, 0);
  const ilsHoldingsILS = holdings
    .filter((h) => h.currency === "ILS")
    .reduce((s, h) => s + h.currentValueILS, 0);

  return {
    holdings,
    byTerm,
    totals: {
      totalValueILS: totalPortfolioValue,
      totalInvestedILS,
      totalFees,
      totalProfitLoss,
      totalProfitLossPercent,
      estimatedCapitalGainsTax,
      ytdChangePercent: portfolioYtd,
    },
    currencyExposure: {
      usd: {
        amountILS: usdHoldingsILS,
        percent:
          totalPortfolioValue > 0
            ? (usdHoldingsILS / totalPortfolioValue) * 100
            : 0,
      },
      ils: {
        amountILS: ilsHoldingsILS,
        percent:
          totalPortfolioValue > 0
            ? (ilsHoldingsILS / totalPortfolioValue) * 100
            : 0,
      },
    },
    usdToIls,
    lastUpdated: new Date().toISOString(),
  };
}

function computeHolding(
  txs: StockTransaction[],
  stockDef: StockDefinition,
  prices: Map<string, number>,
  ytdStartPrices: Map<string, number>,
  usdToIls: number,
  brokerMap: Map<string, BrokerConfig>,
): StockHolding {
  let totalShares = 0;
  let totalInvestedILS = 0;
  let totalSoldILS = 0;
  let totalPurchaseFee = 0;
  let primaryBank = "";

  for (const tx of txs) {
    const txTotalILS = tx.pricePerUnitILS * tx.quantity;
    if (tx.type === "קניה") {
      totalInvestedILS += txTotalILS;
      totalShares += tx.quantity;
    } else {
      totalSoldILS += txTotalILS;
      totalShares -= tx.quantity;
    }
    totalPurchaseFee += tx.purchaseFee;
    if (!primaryBank) primaryBank = tx.bank;
  }

  const avgCostPerShareILS =
    totalShares > 0 ? totalInvestedILS / totalShares : 0;

  // Estimate management fees (rough quarterly estimate)
  const broker = brokerMap.get(primaryBank);
  const quartersSinceFirst = estimateQuarters(txs[0]?.date);
  const totalMgmtFees = broker
    ? totalInvestedILS *
      (broker.managementFeePercent / 100) *
      quartersSinceFirst
    : 0;

  // Current price from source, convert to ILS if USD
  const currentPriceRaw = prices.get(stockDef.symbol) ?? 0;
  const currentPriceILS =
    stockDef.currency === "USD" ? currentPriceRaw * usdToIls : currentPriceRaw;
  const currentValueILS = totalShares * currentPriceILS;

  const profitLoss = currentValueILS - totalInvestedILS - totalMgmtFees;
  const profitLossPercent =
    totalInvestedILS > 0 ? (profitLoss / totalInvestedILS) * 100 : 0;

  // YTD: compare current price vs start-of-year price (in original currency)
  const ytdStartPrice = ytdStartPrices.get(stockDef.symbol);
  const currentPriceRawForYtd = prices.get(stockDef.symbol) ?? 0;
  const ytdChangePercent =
    ytdStartPrice && ytdStartPrice > 0 && currentPriceRawForYtd > 0
      ? ((currentPriceRawForYtd - ytdStartPrice) / ytdStartPrice) * 100
      : null;

  return {
    symbol: stockDef.symbol,
    displayName: stockDef.displayName,
    term: txs[0].term,
    totalShares,
    avgCostPerShareILS,
    totalInvestedILS,
    totalSoldILS,
    totalPurchaseFee,
    totalMgmtFees,
    currentPriceILS,
    currentValueILS,
    profitLoss,
    profitLossPercent,
    ytdChangePercent,
    bank: primaryBank,
    currency: stockDef.currency,
    label: stockDef.label,
    transactions: txs,
  };
}

function estimateQuarters(dateStr?: string): number {
  if (!dateStr) return 0;
  const parts = dateStr.split("/");
  if (parts.length < 2) return 0;
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const yearPart = parts[2]
    ? parseInt(parts[2], 10)
    : new Date().getFullYear() % 100;
  const year = yearPart < 100 ? 2000 + yearPart : yearPart;

  const purchaseDate = new Date(year, month - 1, day);
  const now = new Date();
  const diffMs = now.getTime() - purchaseDate.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  return Math.max(0, Math.floor(diffDays / 90));
}

// ── Portfolio History ──

/** Parse DD/MM/YY transaction date to YYYY-MM-DD */
function txDateToISO(dateStr: string): string {
  const parts = dateStr.split("/");
  if (parts.length < 2) return "";
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const yearPart = parts[2] ? parseInt(parts[2], 10) : new Date().getFullYear() % 100;
  const year = yearPart < 100 ? 2000 + yearPart : yearPart;
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function computePeriod1(range: ChartRange, transactions: StockTransaction[]): string {
  const now = new Date();
  let d: Date;
  switch (range) {
    case "1M":
      d = new Date(now);
      d.setDate(d.getDate() - 30);
      break;
    case "6M":
      d = new Date(now);
      d.setMonth(d.getMonth() - 6);
      break;
    case "YTD":
      d = new Date(now.getFullYear(), 0, 1);
      break;
    case "1Y":
      d = new Date(now);
      d.setFullYear(d.getFullYear() - 1);
      break;
    case "Max": {
      // Find earliest transaction date
      let earliest = now;
      for (const tx of transactions) {
        const iso = txDateToISO(tx.date);
        if (iso) {
          const txd = new Date(iso);
          if (txd < earliest) earliest = txd;
        }
      }
      d = earliest;
      break;
    }
  }
  return d.toISOString().split("T")[0];
}

export async function getPortfolioHistory(
  range: ChartRange,
  { downsample = true }: { downsample?: boolean } = {},
): Promise<PortfolioHistoryPoint[]> {
  const [config, transactions] = await Promise.all([
    getStockConfig(),
    getStockTransactions(),
  ]);

  if (transactions.length === 0) return [];

  const period1 = computePeriod1(range, transactions);
  const period2 = new Date().toISOString().split("T")[0];

  const { prices, usdIls } = await fetchHistoricalPrices(
    config.stocks,
    period1,
    period2,
  );

  const stockMap = new Map(config.stocks.map((s) => [s.symbol, s]));

  // Build USD/ILS lookup by date
  const usdIlsByDate = new Map<string, number>();
  for (const point of usdIls) {
    usdIlsByDate.set(point.date, point.price);
  }

  // Collect all unique dates across all stocks
  const allDatesSet = new Set<string>();
  for (const [, points] of prices) {
    for (const p of points) allDatesSet.add(p.date);
  }
  for (const p of usdIls) allDatesSet.add(p.date);

  const allDates = [...allDatesSet].sort();
  if (allDates.length === 0) return [];

  // Build price lookup per stock: date → price
  const stockPriceByDate = new Map<string, Map<string, number>>();
  for (const [symbol, points] of prices) {
    const dateMap = new Map<string, number>();
    for (const p of points) dateMap.set(p.date, p.price);
    stockPriceByDate.set(symbol, dateMap);
  }

  // Sort transactions by date for replay
  const sortedTxs = [...transactions].sort((a, b) => {
    const aIso = txDateToISO(a.date);
    const bIso = txDateToISO(b.date);
    return aIso.localeCompare(bIso);
  });

  // Convert tx dates to ISO for comparison
  const txsWithISO = sortedTxs.map((tx) => ({
    ...tx,
    isoDate: txDateToISO(tx.date),
  }));

  const history: PortfolioHistoryPoint[] = [];
  const sharesHeld = new Map<string, number>(); // symbol → shares
  const investedBySymbol = new Map<string, number>(); // symbol → total invested ILS
  let txIndex = 0;
  let lastUsdIls = 3.6; // fallback

  for (const date of allDates) {
    // Replay transactions up to this date
    while (txIndex < txsWithISO.length && txsWithISO[txIndex].isoDate <= date) {
      const tx = txsWithISO[txIndex];
      const currentShares = sharesHeld.get(tx.symbol) ?? 0;
      const currentInvested = investedBySymbol.get(tx.symbol) ?? 0;
      const txTotalILS = tx.pricePerUnitILS * tx.quantity;

      if (tx.type === "קניה") {
        sharesHeld.set(tx.symbol, currentShares + tx.quantity);
        investedBySymbol.set(tx.symbol, currentInvested + txTotalILS);
      } else {
        sharesHeld.set(tx.symbol, Math.max(0, currentShares - tx.quantity));
        // Don't reduce invested — this tracks cost basis
      }
      txIndex++;
    }

    // Get USD/ILS rate for this date (use most recent available)
    const usdRate = usdIlsByDate.get(date);
    if (usdRate) lastUsdIls = usdRate;

    // Compute portfolio value
    let totalValue = 0;
    let totalInvested = 0;

    for (const [symbol, shares] of sharesHeld) {
      if (shares <= 0) continue;
      const stockDef = stockMap.get(symbol);
      if (!stockDef) continue;

      // Find price for this date (use last known price if exact date missing)
      const priceMap = stockPriceByDate.get(symbol);
      let price = priceMap?.get(date) ?? 0;

      // If no price for exact date, find most recent before this date
      if (price === 0 && priceMap) {
        for (const [pDate, pPrice] of priceMap) {
          if (pDate <= date && pPrice > 0) price = pPrice;
        }
      }

      if (price <= 0) continue;

      const priceILS = stockDef.currency === "USD" ? price * lastUsdIls : price;
      totalValue += shares * priceILS;
      totalInvested += investedBySymbol.get(symbol) ?? 0;
    }

    // Only add points where we have meaningful data
    if (totalValue > 0) {
      history.push({ date, value: Math.round(totalValue), invested: Math.round(totalInvested) });
    }
  }

  // Downsample for Max range if too many points (> 365 → weekly)
  if (downsample && range === "Max" && history.length > 365) {
    const downsampled: PortfolioHistoryPoint[] = [];
    for (let i = 0; i < history.length; i++) {
      if (i === 0 || i === history.length - 1 || i % 5 === 0) {
        downsampled.push(history[i]);
      }
    }
    return downsampled;
  }

  return history;
}

// ── Portfolio Returns (Time-Weighted) ──

/**
 * Find the index of the closest history point on or before a target date.
 * Uses binary search for efficiency.
 */
function findIndexAt(history: PortfolioHistoryPoint[], targetDate: string): number {
  let lo = 0;
  let hi = history.length - 1;
  let best = -1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (history[mid].date <= targetDate) {
      best = mid;
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }
  return best;
}

/**
 * Compute time-weighted return (TWR) over a slice of history points.
 * Chain-links daily returns, each adjusted for that day's cash flow.
 * daily_r = (value_today - value_yesterday - flow_today) / value_yesterday
 * TWR = product(1 + daily_r) - 1
 */
function twrForSlice(history: PortfolioHistoryPoint[], fromIdx: number, toIdx: number): number | null {
  if (fromIdx < 0 || fromIdx >= toIdx) return null;
  let cumulative = 1;
  for (let i = fromIdx + 1; i <= toIdx; i++) {
    const prev = history[i - 1];
    const cur = history[i];
    if (prev.value <= 0) continue;
    const flow = cur.invested - prev.invested;
    const dailyR = (cur.value - prev.value - flow) / prev.value;
    cumulative *= 1 + dailyR;
  }
  return (cumulative - 1) * 100;
}

function dateDaysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().split("T")[0];
}

function dateYearsAgo(years: number): string {
  const d = new Date();
  d.setFullYear(d.getFullYear() - years);
  return d.toISOString().split("T")[0];
}

export function computePortfolioReturns(
  history: PortfolioHistoryPoint[],
): PortfolioReturns {
  const empty: PortfolioReturns = {
    daily: null, mtd: null, ytd: null, periods: [], annual: [],
  };
  if (history.length < 2) return empty;

  const lastIdx = history.length - 1;
  const today = history[lastIdx].date;

  function returnSince(targetDate: string): number | null {
    const idx = findIndexAt(history, targetDate);
    if (idx < 0 || idx >= lastIdx) return null;
    return twrForSlice(history, idx, lastIdx);
  }

  // Daily: yesterday
  const daily = returnSince(dateDaysAgo(1));

  // MTD: first of current month
  const mtdDate = today.substring(0, 8) + "01";
  const mtd = returnSince(mtdDate);

  // YTD: Jan 1 of current year
  const ytdDate = today.substring(0, 5) + "01-01";
  const ytd = returnSince(ytdDate);

  // Fixed periods
  const periodDefs: { label: string; date: string }[] = [
    { label: "7 ימים", date: dateDaysAgo(7) },
    { label: "14 ימים", date: dateDaysAgo(14) },
    { label: "30 ימים", date: dateDaysAgo(30) },
    { label: "90 ימים", date: dateDaysAgo(90) },
    { label: "180 ימים", date: dateDaysAgo(180) },
    { label: "שנה", date: dateYearsAgo(1) },
    { label: "שנתיים", date: dateYearsAgo(2) },
    { label: "3 שנים", date: dateYearsAgo(3) },
  ];
  const periods = periodDefs.map(({ label, date }) => ({
    label,
    returnPercent: returnSince(date),
  }));

  // Annual returns: for each calendar year in the data (including current partial year)
  const firstYear = parseInt(history[0].date.substring(0, 4), 10);
  const currentYear = parseInt(today.substring(0, 4), 10);
  const annual: { year: number; returnPercent: number | null }[] = [];

  for (let y = firstYear; y < currentYear; y++) {
    const yearStart = `${y}-01-01`;
    const yearEnd = `${y}-12-31`;
    const startIdx = findIndexAt(history, yearStart);
    const effectiveStart = startIdx >= 0
      ? startIdx
      : history.findIndex((p) => p.date >= yearStart);
    const endIdx = findIndexAt(history, yearEnd);
    if (effectiveStart >= 0 && endIdx > effectiveStart) {
      annual.push({ year: y, returnPercent: twrForSlice(history, effectiveStart, endIdx) });
    }
  }

  return { daily, mtd, ytd, periods, annual };
}
