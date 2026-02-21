"use client";

import { useMemo, useRef, useState } from "react";
import type {
  StockHolding,
  StockConfig,
  LabelAllocation,
  StockDefinition,
  InvestmentTerm,
} from "@/lib/types";
import {
  calculateRebalance,
  recalcProjections,
  computeRebalanceTableRows,
  type RebalanceTableRow,
} from "@/lib/rebalance-calculator";
import { saveLabelAllocationsAction } from "@/lib/actions";

type SaveStatus = "idle" | "saving" | "saved";

function stockLabel(s: StockDefinition): string {
  return s.displayName || s.symbol;
}

/**
 * Encapsulates all rebalance calculator state and logic.
 */
export function useRebalanceCalculator(
  holdings: StockHolding[],
  config: StockConfig,
  term: InvestmentTerm = "ארוך",
) {
  const allLabels = useMemo(() => {
    const labels = new Set<string>();
    for (const s of config.stocks) {
      if (s.label) labels.add(s.label);
    }
    for (const h of holdings) {
      if (h.label) labels.add(h.label);
    }
    return Array.from(labels);
  }, [config.stocks, holdings]);

  const [allocations, setAllocations] = useState<LabelAllocation[]>(() =>
    config.labelAllocations
      .filter((a) => a.targetPercent > 0 || a.selectedStock)
      .map((a) => ({
        label: a.label,
        targetPercent: a.targetPercent,
        selectedStock: a.selectedStock,
      })),
  );
  const [labelColors, setLabelColors] = useState<Record<string, string>>(() => {
    const map: Record<string, string> = {};
    for (const a of config.labelAllocations) {
      if (a.color) map[a.label] = a.color;
    }
    return map;
  });
  const [investmentAmount, setInvestmentAmount] = useState<string>("");
  const [adjustedAmounts, setAdjustedAmounts] = useState<Record<string, number>>({});
  const [selectedStocks, setSelectedStocks] = useState<Record<string, string>>(
    () => {
      const map: Record<string, string> = {};
      for (const a of config.labelAllocations) {
        if (a.selectedStock) map[a.label] = a.selectedStock;
      }
      return map;
    },
  );
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [isManuallyAdjusted, setIsManuallyAdjusted] = useState(false);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [manualShareCounts, setManualShareCounts] = useState<Record<string, number>>({});
  const addBtnRef = useRef<HTMLButtonElement>(null);

  const activeLabels = allocations.map((a) => a.label);
  const unusedLabels = allLabels.filter((l) => !activeLabels.includes(l));
  const totalPercent = allocations.reduce((s, a) => s + a.targetPercent, 0);
  const isValid = Math.abs(totalPercent - 100) < 0.01;
  const investment = parseFloat(investmentAmount) || 0;

  const currentValueByLabel = useMemo(() => {
    const map: Record<string, number> = {};
    for (const h of holdings) {
      if (h.term !== term) continue;
      const label = h.label || "אחר";
      map[label] = (map[label] ?? 0) + h.currentValueILS;
    }
    return map;
  }, [holdings, term]);

  const stocksByLabel = useMemo(() => {
    const map: Record<string, StockDefinition[]> = {};
    for (const s of config.stocks) {
      if (!s.label) continue;
      if (!map[s.label]) map[s.label] = [];
      map[s.label].push(s);
    }
    return map;
  }, [config.stocks]);

  const priceBySymbol = useMemo(() => {
    const map: Record<string, number> = {};
    for (const h of holdings) {
      const price =
        h.currentPriceILS > 0
          ? h.currentPriceILS
          : h.totalShares > 0
            ? h.currentValueILS / h.totalShares
            : 0;
      if (price > 0) map[h.symbol] = price;
    }
    return map;
  }, [holdings]);

  const recommendations = useMemo(() => {
    if (allocations.length === 0) return [];
    if (isManuallyAdjusted) {
      return recalcProjections(currentValueByLabel, allocations, adjustedAmounts);
    }
    return calculateRebalance({
      currentValueByLabel,
      targetAllocations: allocations,
      newInvestment: investment,
    });
  }, [currentValueByLabel, allocations, investment, isManuallyAdjusted, adjustedAmounts]);

  const effectiveAmounts = useMemo(() => {
    if (isManuallyAdjusted) return adjustedAmounts;
    const amounts: Record<string, number> = {};
    for (const r of recommendations) amounts[r.label] = r.recommendedAmount;
    return amounts;
  }, [isManuallyAdjusted, adjustedAmounts, recommendations]);

  const tableRows = useMemo((): RebalanceTableRow[] => {
    return computeRebalanceTableRows(
      recommendations,
      effectiveAmounts,
      selectedStocks,
      priceBySymbol,
      manualShareCounts,
      currentValueByLabel,
      stocksByLabel,
    );
  }, [recommendations, effectiveAmounts, selectedStocks, priceBySymbol, currentValueByLabel, manualShareCounts, stocksByLabel]);

  function handleShareCountChange(label: string, value: string) {
    const num = parseInt(value) || 0;
    setManualShareCounts((prev) => ({ ...prev, [label]: Math.max(0, num) }));
  }

  function handleAllocChange(label: string, value: string) {
    const num = parseFloat(value) || 0;
    setAllocations((prev) =>
      prev.map((a) => (a.label === label ? { ...a, targetPercent: num } : a)),
    );
    setIsManuallyAdjusted(false);
    setSaveStatus("idle");
  }

  function handleAmountChange(label: string, value: string) {
    const num = parseFloat(value) || 0;
    setAdjustedAmounts((prev) => ({ ...prev, [label]: num }));
    setIsManuallyAdjusted(true);
  }

  function handleStockChange(label: string, value: string) {
    setSelectedStocks((prev) => ({ ...prev, [label]: value }));
    setSaveStatus("idle");
  }

  function handleColorChange(label: string, color: string) {
    setLabelColors((prev) => ({ ...prev, [label]: color }));
    setSaveStatus("idle");
  }

  function addLabel(label: string) {
    setAllocations((prev) => [...prev, { label, targetPercent: 0 }]);
    setShowAddMenu(false);
    setSaveStatus("idle");
  }

  function removeLabel(label: string) {
    setAllocations((prev) => prev.filter((a) => a.label !== label));
    setSelectedStocks((prev) => {
      const next = { ...prev };
      delete next[label];
      return next;
    });
    setIsManuallyAdjusted(false);
    setSaveStatus("idle");
  }

  async function handleSave() {
    setSaveStatus("saving");
    try {
      const allAllocations = allLabels.map((label) => {
        const alloc = allocations.find((a) => a.label === label);
        return {
          label,
          targetPercent: alloc?.targetPercent ?? 0,
          selectedStock: selectedStocks[label] || undefined,
          color: labelColors[label] || undefined,
        };
      });
      await saveLabelAllocationsAction(allAllocations);
      setSaveStatus("saved");
    } finally {
      if (saveStatus !== "saved") setSaveStatus("idle");
    }
  }

  return {
    allLabels,
    allocations,
    investmentAmount,
    setInvestmentAmount,
    selectedStocks,
    saveStatus,
    isManuallyAdjusted,
    setIsManuallyAdjusted,
    showAddMenu,
    setShowAddMenu,
    manualShareCounts,
    setManualShareCounts,
    addBtnRef,
    activeLabels,
    unusedLabels,
    totalPercent,
    isValid,
    investment,
    currentValueByLabel,
    stocksByLabel,
    recommendations,
    effectiveAmounts,
    tableRows,
    handleShareCountChange,
    handleAllocChange,
    handleAmountChange,
    handleStockChange,
    handleColorChange,
    addLabel,
    removeLabel,
    handleSave,
    stockLabel,
    labelColors,
  };
}
