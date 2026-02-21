import type {
  StockHolding,
  InvestmentTerm,
  StockPortfolioTotals,
} from "./types";

/**
 * Compute the YTD values for the active view term.
 * Uses a weighted average by current ILS value across holdings that have a ytdChangePercent.
 * Pure utility — no server-only imports.
 */
export function computeViewYtd(
  holdings: StockHolding[],
  viewTerm: InvestmentTerm | "all",
  totals: StockPortfolioTotals,
): {
  ytdPercent: number | null;
  ytdProfitLossILS: number;
  ytdDisplay: number | null;
} {
  const viewYtdHoldings = holdings.filter((h) => h.ytdChangePercent !== null);
  const viewYtdWeightedSum = viewYtdHoldings.reduce(
    (s, h) => s + h.ytdChangePercent! * h.currentValueILS,
    0,
  );
  const viewYtdTotalWeight = viewYtdHoldings.reduce(
    (s, h) => s + h.currentValueILS,
    0,
  );
  const ytdPercent =
    viewTerm === "all"
      ? totals.ytdChangePercent
      : viewYtdTotalWeight > 0
        ? viewYtdWeightedSum / viewYtdTotalWeight
        : null;
  // YTD P&L in ILS: pure price gain = currentValue * ytd% / (100 + ytd%)
  const ytdProfitLossILS = viewYtdHoldings.reduce((s, h) => {
    const ytd = h.ytdChangePercent!;
    return s + h.currentValueILS * (ytd / (100 + ytd));
  }, 0);
  // Derive display % from ILS P&L so sign is always consistent with amount
  const ytdDisplay =
    viewYtdTotalWeight > 0 && ytdProfitLossILS !== 0
      ? (ytdProfitLossILS / (viewYtdTotalWeight - ytdProfitLossILS)) * 100
      : ytdPercent;
  return { ytdPercent, ytdProfitLossILS, ytdDisplay };
}
