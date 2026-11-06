"use client";

import { useEffect, useState } from "react";
import type {
  InvestmentTerm,
  PortfolioReturns,
} from "@/lib/types";
import {
  finalizeAnnualPerformanceAction,
  getPortfolioReturnsAction,
} from "@/lib/actions";

interface Options {
  initialReturns: PortfolioReturns | null;
  term: InvestmentTerm | "all";
  enabled: boolean;
}

/**
 * Manages portfolio performance chart data, returns, and loading state.
 * Re-fetches when `enabled` becomes true or `term` changes while open.
 */
export function usePortfolioPerformance({
  initialReturns,
  term,
  enabled,
}: Options) {
  const [returns, setReturns] = useState<PortfolioReturns | null>(
    initialReturns ?? null,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!enabled) return;
    const apiTerm = term === "all" ? undefined : term;
    let active = true;

    async function loadPerformance() {
      setLoading(true);
      setError("");
      try {
        const rets = await getPortfolioReturnsAction(apiTerm);
        if (!active) return;
        setReturns(rets);
      } catch (cause) {
        if (!active) return;
        setError(
          cause instanceof Error ? cause.message : "טעינת הביצועים נכשלה",
        );
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadPerformance();
    return () => {
      active = false;
    };
  }, [term, enabled]);

  async function finalizeYear(year: number) {
    const apiTerm = term === "all" ? undefined : term;
    const record = await finalizeAnnualPerformanceAction(year, apiTerm);
    setReturns((current) =>
      current
        ? {
            ...current,
            annual: current.annual.map((item) =>
              item.year === year ? record : item,
            ),
          }
        : current,
    );
    return record;
  }

  return { returns, loading, error, finalizeYear };
}
