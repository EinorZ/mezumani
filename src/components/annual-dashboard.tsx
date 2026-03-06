"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { HEBREW_MONTHS } from "@/lib/constants";
import { formatCurrency, formatCurrencyCompact, getSummaryCardIcon } from "@/lib/utils";
import type { AnnualData } from "@/lib/types";
import { MultiSearchableSelect } from "@/components/multi-searchable-select";
import { Target } from "lucide-react";

const MonthlyBarChart = dynamic(
  () => import("@/components/monthly-bar-chart").then((m) => m.MonthlyBarChart),
  { ssr: false },
);
const CategoryChart = dynamic(
  () => import("@/components/category-chart").then((m) => m.CategoryChart),
  { ssr: false },
);
const CategorySparkline = dynamic(
  () => import("@/components/category-sparkline").then((m) => m.CategorySparkline),
  { ssr: false },
);

interface Props {
  data: AnnualData;
  colorMap: Record<string, string>;
  categories: string[];
  vacationCategories: string[];
  yearSuffix: number;
  annualSavingsGoal: number;
}

export function AnnualDashboard({
  data,
  colorMap,
  categories,
  vacationCategories,
  yearSuffix,
  annualSavingsGoal,
}: Props) {
  const [excludeCategories, setExcludeCategories] = useState<Set<string>>(
    new Set(),
  );

  const filteredData = useMemo<AnnualData>(() => {
    const filteredRows = data.rows.filter(
      (row) => row.category && !excludeCategories.has(row.category),
    );

    const grandTotal = filteredRows.reduce((sum, r) => sum + (r.total ?? 0), 0);

    const rowsWithPercentage = filteredRows.map((row) => ({
      ...row,
      percentage:
        grandTotal > 0 && row.total ? (row.total / grandTotal) * 100 : null,
    }));

    const monthTotals: (number | null)[] = Array.from(
      { length: 12 },
      (_, i) => {
        const sum = filteredRows.reduce(
          (acc, r) => acc + (r.months[i] ?? 0),
          0,
        );
        return sum || null;
      },
    );

    const nonNullMonths = monthTotals.filter((v) => v !== null);
    const totalSum = nonNullMonths.reduce((a, b) => a + (b ?? 0), 0);
    const average =
      nonNullMonths.length > 0 ? totalSum / nonNullMonths.length : null;

    return {
      year: data.year,
      rows: rowsWithPercentage,
      totals: {
        months: monthTotals,
        average,
        total: totalSum || null,
      },
      totalIncome: data.totalIncome,
      totalSavings: data.totalSavings,
    };
  }, [data, excludeCategories]);

  const categoryBreakdown = useMemo(
    () =>
      filteredData.rows
        .filter((r) => r.total != null && r.total !== 0)
        .map((r) => ({ category: r.category, amount: r.total! }))
        .sort((a, b) => b.amount - a.amount),
    [filteredData],
  );

  const { totalWithoutVacations, avgWithoutVacations } = useMemo(() => {
    const vacationSet = new Set(vacationCategories);
    const nonVacationRows = filteredData.rows.filter(
      (r) => !vacationSet.has(r.category),
    );
    const total = nonVacationRows.reduce((sum, r) => sum + (r.total ?? 0), 0);
    const monthTotals = Array.from({ length: 12 }, (_, i) =>
      nonVacationRows.reduce((acc, r) => acc + (r.months[i] ?? 0), 0),
    );
    const activeMonths = monthTotals.filter((v) => v > 0);
    const avg = activeMonths.length > 0 ? total / activeMonths.length : 0;
    return { totalWithoutVacations: total, avgWithoutVacations: avg };
  }, [filteredData, vacationCategories]);

  const { monthlyStacked, activeCategories } = useMemo(() => {
    const cats = filteredData.rows
      .filter((r) => r.total && r.total > 0)
      .map((r) => r.category);

    const stacked = HEBREW_MONTHS.map((name, i) => {
      const entry: Record<string, string | number> = { name };
      for (const row of filteredData.rows) {
        const val = row.months[i] ?? 0;
        if (val > 0) entry[row.category] = val;
      }
      return entry;
    });

    return { monthlyStacked: stacked, activeCategories: cats };
  }, [filteredData]);

  const categoryAverages = useMemo(
    () =>
      filteredData.rows
        .filter((r) => r.average != null && r.average !== 0)
        .map((r) => ({ category: r.category, amount: r.average! }))
        .sort((a, b) => b.amount - a.amount),
    [filteredData],
  );

  const summaryCardRows = useMemo(() => {
    const activeMonths = filteredData.totals.months.filter(
      (v) => v !== null,
    ).length;
    const avgMonthlyIncome =
      activeMonths > 0 ? data.totalIncome / activeMonths : 0;
    const avgMonthlySavings =
      activeMonths > 0 ? data.totalSavings / activeMonths : 0;
    const yearlyPct = annualSavingsGoal > 0 ? Math.min(100, Math.max(0, (data.totalSavings / annualSavingsGoal) * 100)) : 0;

    type CardDef = { label: string; amount: number; gradient: string; goal?: { target: number; pct: number } };
    const row1: CardDef[] = [
      {
        label: 'סה"כ הוצאות שנתי',
        amount: filteredData.totals.total ?? 0,
        gradient: "card-orange-gradient",
      },
      {
        label: 'סה"כ הכנסות שנתי',
        amount: data.totalIncome,
        gradient: "card-green-gradient",
      },
      {
        label: "חיסכון שנתי",
        amount: data.totalSavings,
        gradient: "card-purple-gradient",
      },
    ];
    if (annualSavingsGoal > 0) {
      row1.push({
        label: "יעד שנתי",
        amount: data.totalSavings,
        gradient: "card-blue-gradient",
        goal: { target: annualSavingsGoal, pct: yearlyPct },
      });
    }

    const row2: CardDef[] = [
      {
        label: "ממוצע הוצאות חודשי",
        amount: filteredData.totals.average ?? 0,
        gradient: "card-orange-light-gradient",
      },
      {
        label: "ממוצע הכנסה חודשי",
        amount: avgMonthlyIncome,
        gradient: "card-green-light-gradient",
      },
      {
        label: "ממוצע חיסכון חודשי",
        amount: avgMonthlySavings,
        gradient: "card-purple-light-gradient",
      },
    ];

    return [row1, row2];
  }, [filteredData, data.totalIncome, data.totalSavings, annualSavingsGoal]);

  return (
    <div className="container-fluid px-4 py-3">
      <div className="page-header mb-4">
        <h1 className="h4 fw-bold mb-0">סיכום שנתי 20{yearSuffix}</h1>
      </div>

      {/* Summary cards */}
      <>
        {summaryCardRows.map((rowCards, ri) => (
          <div key={ri} className="row g-3 mb-3">
            {rowCards.map((card) => {
              if (card.goal) {
                return (
                  <div key={card.label} className="col">
                    <div className={`card ${card.gradient} rounded-3 p-3 h-100`}>
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <span className="summary-card-icon">
                          <Target size={18} />
                        </span>
                        <span className="small opacity-75">{card.label}</span>
                      </div>
                      <div className="h5 fw-bold mb-0 text-center">
                        {formatCurrencyCompact(card.amount)}
                        <span className="opacity-75" style={{ fontSize: "1.1rem" }}>
                          {" "}/ {formatCurrencyCompact(card.goal.target)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              }
              const Icon = getSummaryCardIcon(card.label);
              return (
                <div key={card.label} className="col">
                  <div
                    className={`card ${card.gradient} rounded-3 p-3 h-100`}
                  >
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <span className="summary-card-icon">
                        <Icon size={18} />
                      </span>
                      <span className="small opacity-75">{card.label}</span>
                    </div>
                    <div className="h5 fw-bold mb-0 text-center">
                      {formatCurrency(card.amount)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </>

      <div className="d-flex justify-content-end mb-3" style={{ maxWidth: 300, marginInlineStart: "auto" }}>
        <MultiSearchableSelect
          options={categories}
          colorMap={colorMap}
          selected={excludeCategories}
          onChange={setExcludeCategories}
          placeholder="הסתר קטגוריות..."
        />
      </div>

      {/* Charts row – 50/50 */}
      <div className="row g-4 mb-4">
        <div className="col-lg-6 d-flex">
          <div className="card rounded-3 border p-3 w-100 d-flex flex-column">
            <h3 className="h6 fw-bold mb-3">הוצאות לפי חודש</h3>
            <div className="flex-grow-1" style={{ minHeight: 300 }}>
              <MonthlyBarChart
                data={monthlyStacked}
                categories={activeCategories}
                colorMap={colorMap}
              />
            </div>
          </div>
        </div>
        <div className="col-lg-6 d-flex">
          <div className="card rounded-3 border p-3 w-100 d-flex flex-column">
            <h3 className="h6 fw-bold mb-3">לפי קטגוריה</h3>
            <div className="flex-grow-1 d-flex flex-column">
              <CategoryChart
                categories={categoryBreakdown}
                colorMap={colorMap}
                layout="horizontal"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Category averages chart */}
      <div className="row g-4 mb-4">
        <div className="col-lg-6 d-flex">
          <div className="card rounded-3 border p-3 w-100 d-flex flex-column">
            <h3 className="h6 fw-bold mb-3">ממוצע חודשי לפי קטגוריה</h3>
            <div className="flex-grow-1 d-flex flex-column">
              <CategoryChart
                categories={categoryAverages}
                colorMap={colorMap}
                layout="horizontal"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Category detail table with sparklines */}
      <div className="card rounded-3 border p-3 mb-4">
        <h3 className="h6 fw-bold mb-3">פירוט לפי קטגוריה</h3>
        <div className="table-responsive">
          <table className="table table-sm mb-0" style={{ fontSize: "0.85rem" }}>
            <thead>
              <tr>
                <th>קטגוריה</th>
                <th>מגמה</th>
                <th className="text-start">סה&quot;כ</th>
                <th className="text-start d-none d-md-table-cell">ממוצע</th>
                <th className="text-start">%</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.rows
                .filter((r) => r.total != null && r.total > 0)
                .sort((a, b) => (b.total ?? 0) - (a.total ?? 0))
                .map((row) => (
                  <tr key={row.category}>
                    <td>
                      <span className="d-flex align-items-center gap-2">
                        <span
                          style={{
                            width: 10,
                            height: 10,
                            borderRadius: "50%",
                            backgroundColor: colorMap[row.category] || "#6c757d",
                            flexShrink: 0,
                          }}
                        />
                        {row.category}
                      </span>
                    </td>
                    <td>
                      <CategorySparkline
                        data={row.months}
                        color={colorMap[row.category] || "#6c757d"}
                      />
                    </td>
                    <td className="text-start">
                      <span dir="ltr">{formatCurrency(row.total ?? 0)}</span>
                    </td>
                    <td className="text-start d-none d-md-table-cell">
                      <span dir="ltr">{formatCurrency(row.average ?? 0)}</span>
                    </td>
                    <td className="text-start">
                      <span dir="ltr">{row.percentage != null ? `${row.percentage.toFixed(2)}%` : "—"}</span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
