import type {
  PortfolioPeriodPerformance,
  PortfolioHistoryPoint,
  StockHolding,
  StockTransaction,
} from "./types";

export interface HoldingYtdGain {
  gainILS: number;
  basisILS: number;
  percent: number;
}

/** Parse DD/MM/YY transaction dates into a comparable YYYY-MM-DD value. */
export function transactionDateToISO(
  dateStr: string,
  fallbackYear = new Date().getFullYear(),
): string | null {
  const parts = dateStr.split("/");
  if (parts.length < 2) return null;
  const day = Number(parts[0]);
  const month = Number(parts[1]);
  const rawYear = parts[2] ? Number(parts[2]) : fallbackYear;
  const year = rawYear < 100 ? 2000 + rawYear : rawYear;
  if (
    !Number.isInteger(day) ||
    !Number.isInteger(month) ||
    !Number.isInteger(year) ||
    day < 1 ||
    day > 31 ||
    month < 1 ||
    month > 12
  ) {
    return null;
  }
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

/**
 * Return the latest usable market price at a period boundary.
 *
 * Historical providers occasionally return a successful but truncated range.
 * Rejecting stale boundary points prevents a November quote from silently
 * becoming a December 31 closing price.
 */
export function latestBoundaryPrice(
  points: { date: string; price: number }[] | undefined,
  boundary: string,
  inclusive: boolean,
  maxAgeDays = 7,
): number | null {
  if (!points) return null;
  let latest: { date: string; price: number } | null = null;
  for (const point of points) {
    if (
      (inclusive ? point.date <= boundary : point.date < boundary) &&
      point.price > 0 &&
      (!latest || point.date > latest.date)
    ) {
      latest = point;
    }
  }
  if (!latest) return null;

  const boundaryTime = new Date(`${boundary}T00:00:00Z`).getTime();
  const pointTime = new Date(`${latest.date}T00:00:00Z`).getTime();
  const ageDays = (boundaryTime - pointTime) / 86_400_000;
  if (!Number.isFinite(ageDays) || ageDays < 0 || ageDays > maxAgeDays) {
    return null;
  }
  return latest.price;
}

/**
 * Calculate actual YTD gain without counting contributions as profit.
 *
 * Opening shares use their value at the start of the year. Purchases made
 * during the year use their real transaction cost. Sale proceeds are included
 * so realized gains are not lost when shares leave the portfolio.
 */
export function computeHoldingYtdGain({
  transactions,
  currentPriceILS,
  ytdStartPriceILS,
  currentYear = new Date().getFullYear(),
}: {
  transactions: StockTransaction[];
  currentPriceILS: number;
  ytdStartPriceILS: number | null;
  currentYear?: number;
}): HoldingYtdGain | null {
  if (!(currentPriceILS > 0)) return null;

  const yearStart = `${currentYear}-01-01`;
  const yearEnd = `${currentYear}-12-31`;
  let openingShares = 0;
  let currentShares = 0;
  let ytdPurchaseCost = 0;
  let ytdSaleProceeds = 0;

  for (const tx of transactions) {
    const isoDate = transactionDateToISO(tx.date, currentYear);
    if (!isoDate) continue;
    const shareDelta = tx.type === "קניה" ? tx.quantity : -tx.quantity;
    currentShares += shareDelta;

    if (isoDate < yearStart) {
      openingShares += shareDelta;
    } else if (isoDate <= yearEnd) {
      const transactionValue = tx.pricePerUnitILS * tx.quantity;
      if (tx.type === "קניה") {
        ytdPurchaseCost += transactionValue + tx.purchaseFee;
      } else {
        ytdSaleProceeds += transactionValue - tx.purchaseFee;
      }
    }
  }

  openingShares = Math.max(0, openingShares);
  currentShares = Math.max(0, currentShares);
  if (openingShares > 0 && !(ytdStartPriceILS && ytdStartPriceILS > 0)) {
    return null;
  }

  const openingValue = openingShares * (ytdStartPriceILS ?? 0);
  const basisILS = openingValue + ytdPurchaseCost;
  if (!(basisILS > 0)) return null;

  const currentValue = currentShares * currentPriceILS;
  const gainILS = currentValue + ytdSaleProceeds - basisILS;
  return {
    gainILS,
    basisILS,
    percent: (gainILS / basisILS) * 100,
  };
}

/** Compute transaction-aware YTD gain for the active holdings. */
export function computeViewYtd(holdings: StockHolding[]): {
  ytdPercent: number | null;
  ytdProfitLossILS: number;
  ytdBasisILS: number;
  ytdDisplay: number | null;
} {
  const hasIncompleteHolding = holdings.some(
    (holding) =>
      holding.ytdProfitLossILS === null || holding.ytdBasisILS === null,
  );
  if (hasIncompleteHolding) {
    return {
      ytdPercent: null,
      ytdProfitLossILS: 0,
      ytdBasisILS: 0,
      ytdDisplay: null,
    };
  }
  const viewYtdHoldings = holdings.filter(
    (holding) =>
      holding.ytdProfitLossILS !== null && holding.ytdBasisILS !== null,
  );
  const ytdProfitLossILS = viewYtdHoldings.reduce(
    (sum, holding) => sum + holding.ytdProfitLossILS!,
    0,
  );
  const ytdBasisILS = viewYtdHoldings.reduce(
    (sum, holding) => sum + holding.ytdBasisILS!,
    0,
  );
  const ytdPercent =
    ytdBasisILS > 0 ? (ytdProfitLossILS / ytdBasisILS) * 100 : null;
  return {
    ytdPercent,
    ytdProfitLossILS,
    ytdBasisILS,
    ytdDisplay: ytdPercent,
  };
}

/**
 * Calculate gain for an arbitrary period without treating new purchases as
 * investment profit. Prices are already converted to ILS at each boundary.
 */
export function computePeriodPerformance({
  label,
  startDate,
  endDate,
  transactions,
  openingPricesILS,
  closingPricesILS,
}: {
  label: string;
  startDate: string;
  endDate: string;
  transactions: StockTransaction[];
  openingPricesILS: Map<string, number>;
  closingPricesILS: Map<string, number>;
}): PortfolioPeriodPerformance {
  const openingShares = new Map<string, number>();
  const closingShares = new Map<string, number>();
  let purchasesILS = 0;
  let salesILS = 0;

  for (const tx of transactions) {
    const isoDate = transactionDateToISO(tx.date);
    if (!isoDate || isoDate > endDate) continue;
    const delta = tx.type === "קניה" ? tx.quantity : -tx.quantity;
    closingShares.set(tx.symbol, (closingShares.get(tx.symbol) ?? 0) + delta);

    if (isoDate < startDate) {
      openingShares.set(tx.symbol, (openingShares.get(tx.symbol) ?? 0) + delta);
    } else {
      const value = tx.pricePerUnitILS * tx.quantity;
      if (tx.type === "קניה") purchasesILS += value + tx.purchaseFee;
      else salesILS += value - tx.purchaseFee;
    }
  }

  const missing = new Set<string>();
  let openingValueILS = 0;
  let closingValueILS = 0;

  for (const [symbol, shares] of openingShares) {
    if (shares <= 0) continue;
    const price = openingPricesILS.get(symbol);
    if (!(price && price > 0)) missing.add(symbol);
    else openingValueILS += shares * price;
  }
  for (const [symbol, shares] of closingShares) {
    if (shares <= 0) continue;
    const price = closingPricesILS.get(symbol);
    if (!(price && price > 0)) missing.add(symbol);
    else closingValueILS += shares * price;
  }

  const missingSymbols = [...missing].sort();
  if (missingSymbols.length > 0) {
    return {
      label,
      startDate,
      endDate,
      openingValueILS: null,
      purchasesILS,
      salesILS,
      closingValueILS: null,
      profitLossILS: null,
      basisILS: null,
      returnPercent: null,
      missingSymbols,
    };
  }

  const basisILS = openingValueILS + purchasesILS;
  const profitLossILS = closingValueILS + salesILS - basisILS;
  return {
    label,
    startDate,
    endDate,
    openingValueILS,
    purchasesILS,
    salesILS,
    closingValueILS,
    profitLossILS,
    basisILS,
    returnPercent: basisILS > 0 ? (profitLossILS / basisILS) * 100 : null,
    missingSymbols: [],
  };
}

/** Stable, non-secret checksum used to detect transactions entered later. */
export function stockTransactionFingerprint(
  transactions: StockTransaction[],
  throughDate: string,
): string {
  const payload = transactions
    .map((tx) => ({ ...tx, isoDate: transactionDateToISO(tx.date) }))
    .filter((tx) => tx.isoDate && tx.isoDate <= throughDate)
    .sort(
      (a, b) =>
        a.isoDate!.localeCompare(b.isoDate!) ||
        a.row - b.row ||
        a.symbol.localeCompare(b.symbol),
    )
    .map((tx) =>
      [
        tx.isoDate,
        tx.type,
        tx.symbol,
        tx.quantity,
        tx.pricePerUnitILS,
        tx.currency,
        tx.term,
        tx.purchaseFee,
      ].join("|"),
    )
    .join("\n");

  let hash = 2166136261;
  for (let index = 0; index < payload.length; index++) {
    hash ^= payload.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

/** Time-weighted return with deposits and withdrawals removed from performance. */
export function computeTimeWeightedReturnSince(
  history: PortfolioHistoryPoint[],
  targetDate: string,
): number | null {
  if (history.length < 2) return null;

  let fromIndex = -1;
  for (let index = 0; index < history.length; index++) {
    if (history[index].date <= targetDate) fromIndex = index;
    else break;
  }
  if (fromIndex === -1) {
    fromIndex = history.findIndex((point) => point.date >= targetDate);
  }

  const toIndex = history.length - 1;
  if (fromIndex < 0 || fromIndex >= toIndex) return null;

  let cumulative = 1;
  for (let index = fromIndex + 1; index <= toIndex; index++) {
    const previous = history[index - 1];
    const current = history[index];
    if (previous.value <= 0) continue;
    const cashFlow = current.invested - previous.invested;
    const periodReturn =
      (current.value - previous.value - cashFlow) / previous.value;
    cumulative *= 1 + periodReturn;
  }
  return (cumulative - 1) * 100;
}
