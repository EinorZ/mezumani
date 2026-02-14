import type { LabelAllocation } from "./types";

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
