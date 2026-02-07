"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatCurrency } from "@/lib/utils";

const DEFAULT_COLOR = "#6c757d";

interface Props {
  data: Record<string, string | number>[];
  categories: string[];
  colorMap: Record<string, string>;
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;

  const sorted = [...payload]
    .filter((p) => p.value > 0)
    .sort((a, b) => b.value - a.value);
  const total = sorted.reduce((sum, p) => sum + p.value, 0);

  return (
    <div
      style={{
        backgroundColor: "#fff",
        border: "1px solid #dee2e6",
        borderRadius: 6,
        padding: "8px 12px",
        fontSize: 12,
        maxHeight: 300,
        overflowY: "auto",
      }}
    >
      <div className="fw-bold mb-1">
        {label} — {formatCurrency(total)}
      </div>
      {sorted.map((entry) => (
        <div key={entry.name} className="d-flex justify-content-between gap-3">
          <span>
            <span
              className="d-inline-block rounded-circle me-1"
              style={{ width: 8, height: 8, backgroundColor: entry.color }}
            />
            {entry.name}
          </span>
          <span className="fw-medium">{formatCurrency(entry.value)}</span>
        </div>
      ))}
    </div>
  );
}

export function MonthlyBarChart({ data, categories, colorMap }: Props) {
  if (data.length === 0) {
    return <p className="text-secondary text-center">אין נתונים</p>;
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{ top: 5, right: 5, bottom: 5, left: -15 }}
        barCategoryGap="15%"
      >
        <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} />
        <YAxis
          tick={{ fontSize: 11 }}
          width={40}
          tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
          domain={[0, "auto"]}
        />
        <Tooltip content={<CustomTooltip />} />
        {categories.map((cat) => (
          <Bar
            key={cat}
            dataKey={cat}
            stackId="a"
            fill={colorMap[cat] || DEFAULT_COLOR}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
