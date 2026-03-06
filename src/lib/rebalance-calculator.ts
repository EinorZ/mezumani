import type { LabelAllocation, StockDefinition } from "./types";

export interface RebalanceTableRow {
  label: string;
  currentValue: number;
  currentPercent: number;
  targetPercent: number;
  stockPrice: number;
  shareCount: number;
  actualCost: number;
  projectedValue: number;
  newPercent: number;
  delta: number;
  totalActualCost: number;
}

/**
 * Pure two-pass derivation of the rebalance table rows from recommendations + overrides.
 */
export function computeRebalanceTableRows(
  recommendations: RebalanceRecommendation[],
  effectiveAmounts: Record<string, number>,
  selectedStocks: Record<string, string>,
  priceBySymbol: Record<string, number>,
  manualShareCounts: Record<string, number>,
  currentValueByLabel: Record<string, number>,
  stocksByLabel: Record<string, StockDefinition[]>,
): RebalanceTableRow[] {
  const currentTotal = Object.values(currentValueByLabel).reduce(
    (s, v) => s + v,
    0,
  );
  // Resolve stock price for each label
  const priceForLabel: Record<string, number> = {};
  for (const rec of recommendations) {
    const selectedSymbol = selectedStocks[rec.label];
    let stockPrice = selectedSymbol ? (priceBySymbol[selectedSymbol] ?? 0) : 0;
    if (stockPrice === 0 && selectedSymbol) {
      const labelStocks = stocksByLabel[rec.label] ?? [];
      for (const s of labelStocks) {
        if (priceBySymbol[s.symbol] > 0) {
          stockPrice = priceBySymbol[s.symbol];
          break;
        }
      }
    }
    priceForLabel[rec.label] = stockPrice;
  }

  // Initial floor-based share counts
  const shareCounts: Record<string, number> = {};
  const totalBudget = recommendations.reduce(
    (s, rec) => s + (effectiveAmounts[rec.label] ?? rec.recommendedAmount),
    0,
  );
  for (const rec of recommendations) {
    if (rec.label in manualShareCounts) {
      shareCounts[rec.label] = manualShareCounts[rec.label];
    } else {
      const allocatedAmount = effectiveAmounts[rec.label] ?? rec.recommendedAmount;
      const price = priceForLabel[rec.label];
      shareCounts[rec.label] = price > 0 ? Math.floor(allocatedAmount / price) : 0;
    }
  }

  // Greedy optimization: spend leftover budget buying shares that minimize
  // total portfolio deviation (sum of squared deltas from target %)
  const hasManual = recommendations.some((r) => r.label in manualShareCounts);
  if (!hasManual) {
    const computeDeviation = (counts: Record<string, number>) => {
      const spent = recommendations.reduce(
        (s, r) => s + counts[r.label] * priceForLabel[r.label],
        0,
      );
      const total = currentTotal + spent;
      if (total <= 0) return Infinity;
      let sumSqDelta = 0;
      for (const rec of recommendations) {
        const value = rec.currentValue + counts[rec.label] * priceForLabel[rec.label];
        const pct = (value / total) * 100;
        const delta = pct - rec.targetPercent;
        sumSqDelta += delta * delta;
      }
      return sumSqDelta;
    };

    for (let iter = 0; iter < 200; iter++) {
      const spent = recommendations.reduce(
        (s, r) => s + shareCounts[r.label] * priceForLabel[r.label],
        0,
      );
      const remaining = totalBudget - spent;
      const currentDeviation = computeDeviation(shareCounts);

      let bestLabel = "";
      let bestDeviation = currentDeviation;

      for (const rec of recommendations) {
        const price = priceForLabel[rec.label];
        if (price <= 0 || price > remaining) continue;

        shareCounts[rec.label]++;
        const dev = computeDeviation(shareCounts);
        shareCounts[rec.label]--;

        if (dev < bestDeviation) {
          bestDeviation = dev;
          bestLabel = rec.label;
        }
      }

      if (!bestLabel) break;
      shareCounts[bestLabel]++;
    }
  }

  const rows = recommendations.map((rec) => {
    const stockPrice = priceForLabel[rec.label];
    const shareCount = shareCounts[rec.label];
    const actualCost = shareCount * stockPrice;
    return {
      label: rec.label,
      currentValue: rec.currentValue,
      currentPercent: rec.currentPercent,
      targetPercent: rec.targetPercent,
      stockPrice,
      shareCount,
      actualCost,
    };
  });
  const totalActualCost = rows.reduce((s, r) => s + r.actualCost, 0);
  const newTotal = currentTotal + totalActualCost;
  return rows.map((row) => {
    const projectedValue = row.currentValue + row.actualCost;
    const newPercent = newTotal > 0 ? (projectedValue / newTotal) * 100 : 0;
    const delta = newPercent - row.targetPercent;
    return { ...row, projectedValue, newPercent, delta, totalActualCost };
  });
}

export interface RebalanceInput {
  currentValueByLabel: Record<string, number>;
  targetAllocations: LabelAllocation[];
  newInvestment: number;
}

export interface RebalanceRecommendation {
  label: string;
  currentValue: number;
  currentPercent: number;
  recommendedAmount: number;
  projectedValue: number;
  projectedPercent: number;
  targetPercent: number;
}

export function calculateRebalance(
  input: RebalanceInput,
): RebalanceRecommendation[] {
  const { currentValueByLabel, targetAllocations, newInvestment } = input;

  const currentTotal = Object.values(currentValueByLabel).reduce(
    (s, v) => s + v,
    0,
  );
  const newTotal = currentTotal + newInvestment;

  if (newTotal <= 0 || targetAllocations.length === 0) {
    return targetAllocations.map((a) => ({
      label: a.label,
      currentValue: currentValueByLabel[a.label] ?? 0,
      currentPercent: 0,
      recommendedAmount: 0,
      projectedValue: currentValueByLabel[a.label] ?? 0,
      projectedPercent: 0,
      targetPercent: a.targetPercent,
    }));
  }

  // Calculate gaps from target
  const gaps: { label: string; gap: number }[] = [];
  let totalPositiveGap = 0;

  for (const alloc of targetAllocations) {
    const currentValue = currentValueByLabel[alloc.label] ?? 0;
    const targetValue = newTotal * (alloc.targetPercent / 100);
    const gap = targetValue - currentValue;
    gaps.push({ label: alloc.label, gap });
    if (gap > 0) totalPositiveGap += gap;
  }

  // Distribute new investment proportionally to positive gaps
  const recommendations: RebalanceRecommendation[] = [];

  for (const alloc of targetAllocations) {
    const currentValue = currentValueByLabel[alloc.label] ?? 0;
    const gapEntry = gaps.find((g) => g.label === alloc.label)!;
    let recommendedAmount = 0;

    if (totalPositiveGap > 0 && gapEntry.gap > 0) {
      recommendedAmount = Math.round(
        (gapEntry.gap / totalPositiveGap) * newInvestment,
      );
    }

    const projectedValue = currentValue + recommendedAmount;

    recommendations.push({
      label: alloc.label,
      currentValue,
      currentPercent: currentTotal > 0 ? (currentValue / currentTotal) * 100 : 0,
      recommendedAmount,
      projectedValue,
      projectedPercent: newTotal > 0 ? (projectedValue / newTotal) * 100 : 0,
      targetPercent: alloc.targetPercent,
    });
  }

  // Fix rounding: adjust the largest allocation to match exact newInvestment
  const totalRecommended = recommendations.reduce(
    (s, r) => s + r.recommendedAmount,
    0,
  );
  const diff = newInvestment - totalRecommended;
  if (diff !== 0 && recommendations.length > 0) {
    const largest = recommendations.reduce((max, r) =>
      r.recommendedAmount > max.recommendedAmount ? r : max,
    );
    largest.recommendedAmount += diff;
    largest.projectedValue += diff;
    largest.projectedPercent =
      newTotal > 0 ? (largest.projectedValue / newTotal) * 100 : 0;
  }

  return recommendations;
}

/**
 * Recalculate projections given manually adjusted amounts.
 */
export function recalcProjections(
  currentValueByLabel: Record<string, number>,
  targetAllocations: LabelAllocation[],
  adjustedAmounts: Record<string, number>,
): RebalanceRecommendation[] {
  const currentTotal = Object.values(currentValueByLabel).reduce(
    (s, v) => s + v,
    0,
  );
  const totalInvestment = Object.values(adjustedAmounts).reduce(
    (s, v) => s + v,
    0,
  );
  const newTotal = currentTotal + totalInvestment;

  return targetAllocations.map((alloc) => {
    const currentValue = currentValueByLabel[alloc.label] ?? 0;
    const recommendedAmount = adjustedAmounts[alloc.label] ?? 0;
    const projectedValue = currentValue + recommendedAmount;

    return {
      label: alloc.label,
      currentValue,
      currentPercent: currentTotal > 0 ? (currentValue / currentTotal) * 100 : 0,
      recommendedAmount,
      projectedValue,
      projectedPercent: newTotal > 0 ? (projectedValue / newTotal) * 100 : 0,
      targetPercent: alloc.targetPercent,
    };
  });
}
