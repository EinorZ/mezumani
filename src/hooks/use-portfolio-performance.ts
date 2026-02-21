"use client";

import { useEffect, useRef, useState } from "react";
import type {
  ChartRange,
  InvestmentTerm,
  PortfolioHistoryPoint,
  PortfolioReturns,
} from "@/lib/types";
import {
  getPortfolioHistoryAction,
  getPortfolioReturnsAction,
} from "@/lib/actions";

interface Options {
  initialChartData: PortfolioHistoryPoint[] | null;
  initialRange: ChartRange;
  initialReturns: PortfolioReturns | null;
  term: InvestmentTerm | "all";
  enabled: boolean;
}

/**
 * Manages portfolio performance chart data, returns, and loading state.
 * Re-fetches when `enabled` becomes true or `term` changes while open.
 */
export function usePortfolioPerformance({
  initialChartData,
  initialRange,
  initialReturns,
  term,
  enabled,
}: Options) {
  const [chartData, setChartData] = useState<PortfolioHistoryPoint[]>(
    initialChartData ?? [],
  );
  const [returns, setReturns] = useState<PortfolioReturns | null>(
    initialReturns ?? null,
  );
  const [loading, setLoading] = useState(false);
  const rangeRef = useRef<ChartRange>(initialRange);

  useEffect(() => {
    if (!enabled) return;
    const apiTerm = term === "all" ? undefined : term;
    setLoading(true);
    Promise.all([
      getPortfolioHistoryAction(rangeRef.current, apiTerm),
      getPortfolioReturnsAction(apiTerm),
    ])
      .then(([history, rets]) => {
        setChartData(history);
        setReturns(rets);
      })
      .finally(() => setLoading(false));
  }, [term, enabled]); // eslint-disable-line react-hooks/exhaustive-deps

  return { chartData, returns, loading, rangeRef };
}
