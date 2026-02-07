"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { HEBREW_MONTHS } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";
import type { AnnualData } from "@/lib/types";
import { MultiSearchableSelect } from "@/components/multi-searchable-select";

const MonthlyBarChart = dynamic(
  () => import("@/components/monthly-bar-chart").then((m) => m.MonthlyBarChart),
  { ssr: false },
);
const CategoryChart = dynamic(
  () => import("@/components/category-chart").then((m) => m.CategoryChart),
  { ssr: false },
);

interface Props {
  data: AnnualData;
  colorMap: Record<string, string>;
  categories: string[];
  vacationCategories: string[];
  yearSuffix: number;
}

export function AnnualDashboard({
  data,
  colorMap,
  categories,
  vacationCategories,
  yearSuffix,
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

  return (
    <div className="container-fluid px-4 py-3">
      <div className="page-header mb-4">
        <h1 className="h4 fw-bold mb-0">סיכום שנתי 20{yearSuffix}</h1>
      </div>

      {/* Category exclude filter */}
      <div className="mb-4" style={{ maxWidth: 400 }}>
        <label className="form-label small fw-medium mb-1">סנן קטגוריות</label>
        <MultiSearchableSelect
          options={categories}
          colorMap={colorMap}
          selected={excludeCategories}
          onChange={setExcludeCategories}
          placeholder="הסתר קטגוריות..."
        />
      </div>

      {/* Summary cards */}
      <div className="row g-3 mb-2">
        <div className="col">
          <div className="card card-green-gradient rounded-3 p-3">
            <div className="small opacity-75">סה&quot;כ שנתי</div>
            <div className="h5 fw-bold mb-0">
              {formatCurrency(filteredData.totals.total ?? 0)}
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card card-blue-gradient rounded-3 p-3">
            <div className="small opacity-75">ממוצע חודשי</div>
            <div className="h5 fw-bold mb-0">
              {formatCurrency(filteredData.totals.average ?? 0)}
            </div>
          </div>
        </div>
      </div>
      <div className="row g-3 mb-4">
        <div className="col">
          <div className="card card-purple-gradient rounded-3 p-3">
            <div className="small opacity-75">ללא חופשות</div>
            <div className="h5 fw-bold mb-0">
              {formatCurrency(totalWithoutVacations)}
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card card-orange-gradient rounded-3 p-3">
            <div className="small opacity-75">ממוצע ללא חופשות</div>
            <div className="h5 fw-bold mb-0">
              {formatCurrency(avgWithoutVacations)}
            </div>
          </div>
        </div>
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
    </div>
  );
}
