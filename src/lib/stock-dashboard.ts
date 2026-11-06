import { cache } from "react";
import {
  getStockConfig as _getStockConfig,
  getStockTransactions as _getStockTransactions,
  getAnnualPerformanceRecords,
} from "./google-sheets";

// Deduplicate per-request: called from both getStockDashboardData and getPortfolioHistory
export const getCachedStockConfig = cache(_getStockConfig);
const getCachedStockTransactions = cache(_getStockTransactions);
import {
  fetchAllPrices,
  fetchYTDStartSnapshot,
  fetchUsdToIls,
  fetchHistoricalPrices,
} from "./stock-prices";
import {
  computeHoldingYtdGain,
  computePeriodPerformance,
  computeViewYtd,
  latestBoundaryPrice,
  stockTransactionFingerprint,
  transactionDateToISO,
} from "./stock-utils";
import type {
  StockDashboardData,
  StockHolding,
  StockTermGroup,
  StockTransaction,
  StockDefinition,
  InvestmentTerm,
  ChartRange,
  PortfolioHistoryPoint,
  PortfolioReturns,
  PortfolioPeriodPerformance,
  AnnualPortfolioPerformance,
} from "./types";

/**
 * Compute the full stock dashboard data.
 */
export async function getStockDashboardData(): Promise<StockDashboardData> {
  const [config, transactions, usdToIlsResult] = await Promise.all([
    getCachedStockConfig(),
    getCachedStockTransactions(),
    fetchUsdToIls(),
  ]);
  const usdToIlsError = usdToIlsResult === null;
  const usdToIls = usdToIlsResult ?? 0;

  const [prices, ytdStartSnapshot] = await Promise.all([
    fetchAllPrices(config.stocks),
    fetchYTDStartSnapshot(config.stocks),
  ]);
  const ytdStartPrices = ytdStartSnapshot.prices;
  const ytdStartUsdToIls = ytdStartSnapshot.usdToIls;
  const stockMap = new Map(config.stocks.map((s) => [s.symbol, s]));

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
  const allComputedHoldings: StockHolding[] = [];

  for (const [, txs] of groups) {
    const first = txs[0];
    const stockDef = stockMap.get(first.symbol);
    if (!stockDef) continue;

    const holding = computeHolding(
      txs,
      stockDef,
      prices,
      ytdStartPrices,
      usdToIls,
      ytdStartUsdToIls,
    );
    allComputedHoldings.push(holding);
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
    const allTermHoldings = allComputedHoldings.filter((h) => h.term === term);
    const termYtd = computeViewYtd(allTermHoldings);
    const totalValueILS = termHoldings.reduce(
      (s, h) => s + h.currentValueILS,
      0,
    );
    const totalInvestedILS = termHoldings.reduce(
      (s, h) => s + h.totalInvestedILS,
      0,
    );
    const totalSoldILS = termHoldings.reduce((s, h) => s + h.totalSoldILS, 0);
    const profitLoss = totalValueILS + totalSoldILS - totalInvestedILS;
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
      profitLoss,
      profitLossPercent,
      allocationPercent,
      ytdProfitLossILS: termYtd.ytdProfitLossILS,
      ytdBasisILS: termYtd.ytdBasisILS,
      ytdChangePercent: termYtd.ytdPercent,
      goals,
    };
  });

  // Totals
  const totalInvestedILS = holdings.reduce((s, h) => s + h.totalInvestedILS, 0);
  const totalSoldILS = holdings.reduce((s, h) => s + h.totalSoldILS, 0);
  const totalProfitLoss = totalPortfolioValue + totalSoldILS - totalInvestedILS;
  const totalProfitLossPercent =
    totalInvestedILS > 0 ? (totalProfitLoss / totalInvestedILS) * 100 : 0;
  const estimatedCapitalGainsTax =
    totalProfitLoss > 0 ? totalProfitLoss * 0.25 : 0;

  const portfolioYtd = computeViewYtd(allComputedHoldings);

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
      totalProfitLoss,
      totalProfitLossPercent,
      estimatedCapitalGainsTax,
      ytdProfitLossILS: portfolioYtd.ytdProfitLossILS,
      ytdBasisILS: portfolioYtd.ytdBasisILS,
      ytdChangePercent: portfolioYtd.ytdPercent,
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
    usdToIlsError,
    priceBySymbolILS: buildPriceBySymbolILS(prices, config.stocks, usdToIls),
    lastUpdated: new Date().toISOString(),
  };
}

function buildPriceBySymbolILS(
  prices: Map<string, number>,
  stocks: StockDefinition[],
  usdToIls: number,
): Record<string, number> {
  const map: Record<string, number> = {};
  for (const s of stocks) {
    const raw = prices.get(s.symbol) ?? 0;
    if (raw > 0) {
      map[s.symbol] = s.currency === "USD" ? raw * usdToIls : raw;
    }
  }
  return map;
}

function computeHolding(
  txs: StockTransaction[],
  stockDef: StockDefinition,
  prices: Map<string, number>,
  ytdStartPrices: Map<string, number>,
  usdToIls: number,
  ytdStartUsdToIls: number | null,
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

  // Current price from source, convert to ILS if USD
  // For "manual" source, use the most recent purchase transaction's price (already in ILS)
  let currentPriceILS: number;
  let currentPriceRaw: number;
  let priceIsFallback = false;
  if (stockDef.source === "manual") {
    const lastBuy = [...txs].reverse().find((t) => t.type === "קניה");
    currentPriceILS = lastBuy?.pricePerUnitILS ?? 0;
    currentPriceRaw = currentPriceILS; // already ILS, no conversion needed
  } else {
    currentPriceRaw = prices.get(stockDef.symbol) ?? 0;
    if (currentPriceRaw > 0) {
      currentPriceILS =
        stockDef.currency === "USD"
          ? currentPriceRaw * usdToIls
          : currentPriceRaw;
    } else {
      // Never turn a temporary quote-provider failure into a fictitious 100%
      // portfolio loss. Keep the holding at its last recorded purchase price
      // and make the stale-price state explicit in the UI.
      const lastBuy = [...txs].reverse().find((t) => t.type === "קניה");
      currentPriceILS = lastBuy?.pricePerUnitILS ?? 0;
      currentPriceRaw = stockDef.currency === "ILS" ? currentPriceILS : 0;
      priceIsFallback = true;
    }
  }
  const currentValueILS = totalShares * currentPriceILS;

  const profitLoss = currentValueILS + totalSoldILS - totalInvestedILS;
  const profitLossPercent =
    totalInvestedILS > 0 ? (profitLoss / totalInvestedILS) * 100 : 0;

  const yearStart = `${new Date().getFullYear()}-01-01`;
  const manualStartPriceILS =
    stockDef.source === "manual"
      ? [...txs]
          .filter(
            (tx) => (transactionDateToISO(tx.date) ?? "") < yearStart,
          )
          .sort((a, b) =>
            (transactionDateToISO(a.date) ?? "").localeCompare(
              transactionDateToISO(b.date) ?? "",
            ),
          )
          .at(-1)?.pricePerUnitILS ?? null
      : null;
  const ytdStartPriceRaw = ytdStartPrices.get(stockDef.symbol) ?? null;
  const ytdStartPriceILS =
    stockDef.source === "manual"
      ? manualStartPriceILS
      : ytdStartPriceRaw &&
          (stockDef.currency === "ILS" || (ytdStartUsdToIls ?? 0) > 0)
        ? ytdStartPriceRaw *
          (stockDef.currency === "USD" ? ytdStartUsdToIls! : 1)
        : null;
  const ytd = priceIsFallback
    ? null
    : computeHoldingYtdGain({
        transactions: txs,
        currentPriceILS,
        ytdStartPriceILS,
      });
  const ytdChangePercent = ytd?.percent ?? null;

  return {
    symbol: stockDef.symbol,
    displayName: stockDef.displayName,
    term: txs[0].term,
    totalShares,
    avgCostPerShareILS,
    totalInvestedILS,
    totalSoldILS,
    totalPurchaseFee,
    currentPriceILS,
    currentPriceRaw,
    priceIsFallback,
    ytdStartPriceILS,
    ytdBasisILS: ytd?.basisILS ?? null,
    ytdProfitLossILS: ytd?.gainILS ?? null,
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

// ── Portfolio History ──

function computePeriod1(
  range: ChartRange,
  transactions: StockTransaction[],
): string {
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
        const iso = transactionDateToISO(tx.date);
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
  {
    downsample = true,
    term,
    startDateOverride,
  }: {
    downsample?: boolean;
    term?: InvestmentTerm;
    startDateOverride?: string;
  } = {},
): Promise<PortfolioHistoryPoint[]> {
  const [config, transactions] = await Promise.all([
    getCachedStockConfig(),
    getCachedStockTransactions(),
  ]);

  const filteredTransactions = term
    ? transactions.filter((t) => t.term === term)
    : transactions;
  if (filteredTransactions.length === 0) return [];

  const rawPeriod1 =
    startDateOverride ?? computePeriod1(range, filteredTransactions);
  // Never fetch before the first transaction — portfolio has no value before then
  const firstTxIso = computePeriod1("Max", filteredTransactions);
  const period1 = rawPeriod1 < firstTxIso ? firstTxIso : rawPeriod1;
  const period2 = new Date().toISOString().split("T")[0];

  // Only fetch prices for stocks present in the filtered transactions
  const filteredSymbols = new Set(filteredTransactions.map((t) => t.symbol));
  const filteredStocks = config.stocks.filter((s) =>
    filteredSymbols.has(s.symbol),
  );

  const { prices, usdIls } = await fetchHistoricalPrices(
    filteredStocks,
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

  // Sort filtered transactions by date for replay
  const sortedTxs = [...filteredTransactions].sort((a, b) => {
    const aIso = transactionDateToISO(a.date) ?? "";
    const bIso = transactionDateToISO(b.date) ?? "";
    return aIso.localeCompare(bIso);
  });

  // Convert tx dates to ISO for comparison
  const txsWithISO = sortedTxs.map((tx) => ({
    ...tx,
    isoDate: transactionDateToISO(tx.date) ?? "",
  }));

  const history: PortfolioHistoryPoint[] = [];
  const sharesHeld = new Map<string, number>(); // symbol → shares
  let netContributionsILS = 0;
  let txIndex = 0;
  let lastUsdIls = 3.6; // fallback

  for (const date of allDates) {
    // Replay transactions up to this date
    while (txIndex < txsWithISO.length && txsWithISO[txIndex].isoDate <= date) {
      const tx = txsWithISO[txIndex];
      const currentShares = sharesHeld.get(tx.symbol) ?? 0;
      const txTotalILS = tx.pricePerUnitILS * tx.quantity;

      if (tx.type === "קניה") {
        sharesHeld.set(tx.symbol, currentShares + tx.quantity);
        netContributionsILS += txTotalILS;
      } else {
        sharesHeld.set(tx.symbol, Math.max(0, currentShares - tx.quantity));
        // Sale proceeds leave the tracked holdings, so record them as a
        // withdrawal instead of making TWR treat the sale as a market loss.
        netContributionsILS -= txTotalILS;
      }
      txIndex++;
    }

    // Get USD/ILS rate for this date (use most recent available)
    const usdRate = usdIlsByDate.get(date);
    if (usdRate) lastUsdIls = usdRate;

    // Compute portfolio value
    let totalValue = 0;

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
    }

    // Only add points where we have meaningful data
    if (totalValue > 0) {
      history.push({
        date,
        value: Math.round(totalValue),
        invested: Math.round(netContributionsILS),
      });
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

// ── Transaction-aware portfolio performance ──

type HistoricalPoint = { date: string; price: number };

function localISODate(date = new Date()): string {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

function shiftISODate(isoDate: string, days: number): string {
  const date = new Date(`${isoDate}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().split("T")[0];
}

function latestManualPrice(
  transactions: StockTransaction[],
  symbol: string,
  boundary: string,
  inclusive: boolean,
): number | null {
  const candidates = transactions
    .map((tx) => ({ tx, isoDate: transactionDateToISO(tx.date) }))
    .filter(
      ({ tx, isoDate }) =>
        tx.symbol === symbol &&
        isoDate !== null &&
        (inclusive ? isoDate <= boundary : isoDate < boundary),
    )
    .sort((a, b) => a.isoDate!.localeCompare(b.isoDate!));
  return candidates.at(-1)?.tx.pricePerUnitILS ?? null;
}

function buildBoundaryPricesILS({
  stocks,
  transactions,
  prices,
  usdIls,
  boundary,
  inclusive,
}: {
  stocks: StockDefinition[];
  transactions: StockTransaction[];
  prices: Map<string, HistoricalPoint[]>;
  usdIls: HistoricalPoint[];
  boundary: string;
  inclusive: boolean;
}): Map<string, number> {
  const result = new Map<string, number>();
  const usdRate = latestBoundaryPrice(usdIls, boundary, inclusive);
  for (const stock of stocks) {
    const price =
      stock.source === "manual"
        ? latestManualPrice(transactions, stock.symbol, boundary, inclusive)
        : latestBoundaryPrice(prices.get(stock.symbol), boundary, inclusive);
    if (!(price && price > 0)) continue;
    if (stock.currency === "USD") {
      if (usdRate && usdRate > 0) result.set(stock.symbol, price * usdRate);
    } else {
      result.set(stock.symbol, price);
    }
  }
  return result;
}

async function calculatePeriods(
  definitions: { label: string; startDate: string; endDate: string }[],
  stocks: StockDefinition[],
  transactions: StockTransaction[],
): Promise<PortfolioPeriodPerformance[]> {
  if (definitions.length === 0) return [];
  const earliest = definitions.reduce(
    (value, definition) =>
      definition.startDate < value ? definition.startDate : value,
    definitions[0].startDate,
  );
  const latest = definitions.reduce(
    (value, definition) =>
      definition.endDate > value ? definition.endDate : value,
    definitions[0].endDate,
  );
  const relevantSymbols = new Set(
    transactions
      .filter((tx) => (transactionDateToISO(tx.date) ?? "") <= latest)
      .map((tx) => tx.symbol),
  );
  const relevantStocks = stocks.filter((stock) =>
    relevantSymbols.has(stock.symbol),
  );
  const { prices, usdIls } = await fetchHistoricalPrices(
    relevantStocks,
    shiftISODate(earliest, -14),
    shiftISODate(latest, 1),
  );

  return definitions.map((definition) => {
    const openingPricesILS = buildBoundaryPricesILS({
      stocks: relevantStocks,
      transactions,
      prices,
      usdIls,
      boundary: definition.startDate,
      inclusive: false,
    });
    const closingPricesILS = buildBoundaryPricesILS({
      stocks: relevantStocks,
      transactions,
      prices,
      usdIls,
      boundary: definition.endDate,
      inclusive: true,
    });
    return computePeriodPerformance({
      ...definition,
      transactions,
      openingPricesILS,
      closingPricesILS,
    });
  });
}

function toAnnualPerformance(
  performance: PortfolioPeriodPerformance,
  year: number,
  scope: InvestmentTerm | "all",
  status: AnnualPortfolioPerformance["status"],
  fingerprint: string,
): AnnualPortfolioPerformance {
  return {
    ...performance,
    year,
    scope,
    status,
    transactionFingerprint: fingerprint,
    calculatedAt: new Date().toISOString(),
  };
}

async function calculateAnnualDrafts(
  years: number[],
  stocks: StockDefinition[],
  transactions: StockTransaction[],
  scope: InvestmentTerm | "all",
  existingByYear: Map<number, AnnualPortfolioPerformance>,
): Promise<AnnualPortfolioPerformance[]> {
  const fingerprints = new Map(
    years.map((year) => [
      year,
      stockTransactionFingerprint(transactions, `${year}-12-31`),
    ]),
  );
  const yearsToCalculate = years.filter((year) => {
    const saved = existingByYear.get(year);
    return !saved || saved.transactionFingerprint !== fingerprints.get(year);
  });
  const calculated: PortfolioPeriodPerformance[] = [];
  for (const year of yearsToCalculate) {
    const [performance] = await calculatePeriods(
      [
        {
          label: String(year),
          startDate: `${year}-01-01`,
          endDate: `${year}-12-31`,
        },
      ],
      stocks,
      transactions,
    );
    calculated.push(performance);
  }
  const calculatedByYear = new Map(
    calculated.map((performance) => [
      Number(performance.label),
      performance,
    ]),
  );

  return years.map((year) => {
    const saved = existingByYear.get(year);
    const fingerprint = fingerprints.get(year)!;
    if (saved?.transactionFingerprint === fingerprint) return saved;
    const performance = calculatedByYear.get(year)!;
    return toAnnualPerformance(
      performance,
      year,
      scope,
      saved ? "needs_recalculation" : "draft",
      fingerprint,
    );
  });
}

export async function calculateAnnualPortfolioPerformance(
  year: number,
  term?: InvestmentTerm,
): Promise<AnnualPortfolioPerformance> {
  const [config, allTransactions] = await Promise.all([
    getCachedStockConfig(),
    getCachedStockTransactions(),
  ]);
  const transactions = term
    ? allTransactions.filter((tx) => tx.term === term)
    : allTransactions;
  const scope = term ?? "all";
  const [performance] = await calculatePeriods(
    [
      {
        label: String(year),
        startDate: `${year}-01-01`,
        endDate: `${year}-12-31`,
      },
    ],
    config.stocks,
    transactions,
  );
  return toAnnualPerformance(
    performance,
    year,
    scope,
    "final",
    stockTransactionFingerprint(transactions, `${year}-12-31`),
  );
}

export async function getPortfolioReturns(
  term?: InvestmentTerm,
): Promise<PortfolioReturns> {
  const [config, allTransactions, savedRecords] = await Promise.all([
    getCachedStockConfig(),
    getCachedStockTransactions(),
    getAnnualPerformanceRecords(),
  ]);
  const transactions = term
    ? allTransactions.filter((tx) => tx.term === term)
    : allTransactions;
  if (transactions.length === 0) return { periods: [], annual: [] };

  const today = localISODate();
  const currentYear = Number(today.slice(0, 4));
  const liveDefinitions = [
    { label: "7 ימים", startDate: shiftISODate(today, -7), endDate: today },
    { label: "30 ימים", startDate: shiftISODate(today, -30), endDate: today },
    { label: "90 ימים", startDate: shiftISODate(today, -90), endDate: today },
    {
      label: "מתחילת החודש",
      startDate: `${today.slice(0, 8)}01`,
      endDate: today,
    },
    {
      label: "מתחילת השנה",
      startDate: `${currentYear}-01-01`,
      endDate: today,
    },
  ];

  const scope = term ?? "all";
  const earliestYear = Math.min(
    ...transactions
      .map((tx) => transactionDateToISO(tx.date))
      .filter((date): date is string => date !== null)
      .map((date) => Number(date.slice(0, 4))),
    currentYear,
  );
  const years = Array.from(
    { length: Math.max(0, currentYear - earliestYear) },
    (_, index) => currentYear - 1 - index,
  );
  const existingByYear = new Map(
    savedRecords
      .filter((record) => record.scope === scope)
      .map((record) => [record.year, record]),
  );

  const [periods, annual] = await Promise.all([
    calculatePeriods(liveDefinitions, config.stocks, transactions),
    calculateAnnualDrafts(
      years,
      config.stocks,
      transactions,
      scope,
      existingByYear,
    ),
  ]);
  return { periods, annual };
}
