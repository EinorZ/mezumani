"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import type { CategoryBreakdown } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

interface Props {
  categories: CategoryBreakdown[];
  colorMap: Record<string, string>;
}

const DEFAULT_COLOR = "#6c757d";

export function CategoryChart({ categories, colorMap }: Props) {
  // Only positive amounts in the pie chart; negatives shown only in the legend
  const chartData = categories
    .filter((c) => c.amount > 0)
    .map((c) => ({ name: c.category, value: c.amount }));

  if (categories.length === 0) {
    return <p className="text-secondary text-center">אין נתונים</p>;
  }

  return (
    <>
      {chartData.length > 0 && (
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
            >
              {chartData.map((entry, i) => (
                <Cell key={i} fill={colorMap[entry.name] || DEFAULT_COLOR} />
              ))}
            </Pie>
            <Tooltip formatter={(val) => formatCurrency(Number(val))} />
          </PieChart>
        </ResponsiveContainer>
      )}
      <div className="mt-3">
        {categories.map((c) => (
          <div
            key={c.category}
            className="d-flex justify-content-between small mb-1"
          >
            <span>
              <span
                className="d-inline-block rounded-circle me-2"
                style={{
                  width: 10,
                  height: 10,
                  backgroundColor: colorMap[c.category] || DEFAULT_COLOR,
                }}
              />
              {c.category}
            </span>
            <span className="fw-medium">{formatCurrency(c.amount)}</span>
          </div>
        ))}
      </div>
    </>
  );
}
