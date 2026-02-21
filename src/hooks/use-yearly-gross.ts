"use client";

import { useState } from "react";
import { setRsuGrossDataAction } from "@/lib/actions";
import { useDebouncedCallback } from "./use-debounced-callback";

/**
 * Manages yearly gross input state for the RSU/ESPP tax calculator.
 * Debounces the server save action to avoid firing on every keystroke.
 */
export function useYearlyGross(
  initialGrossSoFar: number,
  initialMonthlySalary: number,
  initialEsppContribution: number,
  initialEsppPurchasePrice: number,
) {
  const [earnedSoFar, setEarnedSoFar] = useState(
    initialGrossSoFar ? String(initialGrossSoFar) : "",
  );
  const [monthlySalary, setMonthlySalary] = useState(
    initialMonthlySalary ? String(initialMonthlySalary) : "",
  );
  const [esppContribution, setEsppContribution] = useState(
    initialEsppContribution ? String(initialEsppContribution) : "",
  );
  const [esppPurchasePrice, setEsppPurchasePrice] = useState(
    initialEsppPurchasePrice ? String(initialEsppPurchasePrice) : "",
  );

  const debouncedSave = useDebouncedCallback(
    (gs: string, ms: string, espp: string, pp: string) => {
      setRsuGrossDataAction(
        parseFloat(gs) || 0,
        parseFloat(ms) || 0,
        parseFloat(espp) || 0,
        parseFloat(pp) || 0,
      );
    },
    600,
  );

  const monthsRemaining = 12 - new Date().getMonth();
  const yearlyGross =
    (parseFloat(earnedSoFar) || 0) +
    (parseFloat(monthlySalary) || 0) * monthsRemaining;

  return {
    earnedSoFar,
    setEarnedSoFar: (v: string) => {
      setEarnedSoFar(v);
      debouncedSave(v, monthlySalary, esppContribution, esppPurchasePrice);
    },
    monthlySalary,
    setMonthlySalary: (v: string) => {
      setMonthlySalary(v);
      debouncedSave(earnedSoFar, v, esppContribution, esppPurchasePrice);
    },
    esppContribution,
    setEsppContribution: (v: string) => {
      setEsppContribution(v);
      debouncedSave(earnedSoFar, monthlySalary, v, esppPurchasePrice);
    },
    esppPurchasePrice,
    setEsppPurchasePrice: (v: string) => {
      setEsppPurchasePrice(v);
      debouncedSave(earnedSoFar, monthlySalary, esppContribution, v);
    },
    yearlyGross,
    monthsRemaining,
  };
}
