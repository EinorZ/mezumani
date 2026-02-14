import { getStockConfig, getStockTransactions } from "./google-sheets";
import { fetchAllPrices, fetchUsdToIls } from "./stock-prices";
import type {
  StockDashboardData,
  StockHolding,
  StockTermGroup,
  StockTransaction,
  StockDefinition,
  InvestmentTerm,
  BrokerConfig,
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

  const prices = await fetchAllPrices(config.stocks);
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

    const holding = computeHolding(txs, stockDef, prices, usdToIls, brokerMap);
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
