"use client";

import { useMemo } from "react";
import {
  BarChart,
  Bar,
  Cell,
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
  payload?: {
    name: string;
    value: number;
    color: string;
    dataKey?: string | number;
    payload?: Record<string, string | number>;
  }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;

  const sorted = payload
    .map((entry) => {
      const key = String(entry.dataKey ?? "");
      return {
        ...entry,
        name: String(entry.payload?.[`${key}Name`] ?? entry.name),
        color: String(entry.payload?.[`${key}Color`] ?? entry.color),
      };
    })
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
  const rankedData = useMemo(
    () =>
      data.map((month) => {
        const ranked = categories
          .map((category) => ({
            category,
            value: Number(month[category] ?? 0),
          }))
          .filter(({ value }) => value > 0)
          .sort((a, b) => b.value - a.value);
        const entry: Record<string, string | number> = { name: month.name };
        ranked.forEach(({ category, value }, rank) => {
          const key = `stack${rank}`;
          entry[key] = value;
          entry[`${key}Name`] = category;
          entry[`${key}Color`] = colorMap[category] || DEFAULT_COLOR;
        });
        return entry;
      }),
    [categories, colorMap, data],
  );

  const { axisMax, axisTicks } = useMemo(() => {
    const maxTotal = data.reduce(
      (max, month) =>
        Math.max(
          max,
          categories.reduce(
            (total, category) =>
              total + Math.max(0, Number(month[category] ?? 0)),
            0,
          ),
        ),
      0,
    );
    const targetStep = Math.max(1, maxTotal / 20);
    const magnitude = 10 ** Math.floor(Math.log10(targetStep));
    const factor = targetStep / magnitude;
    const step = magnitude * (factor >= 5 ? 5 : factor >= 2 ? 2 : 1);
    const axisMax = Math.max(step, Math.ceil((maxTotal * 1.04) / step) * step);

    return {
      axisMax,
      axisTicks: Array.from(
        { length: Math.round(axisMax / step) + 1 },
        (_, index) => index * step,
      ),
    };
  }, [categories, data]);

  if (data.length === 0) {
    return <p className="text-secondary text-center">אין נתונים</p>;
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={rankedData}
        margin={{ top: 5, right: 5, bottom: 5, left: -15 }}
        barCategoryGap="15%"
      >
        <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} />
        <YAxis
          tick={{ fontSize: 11, direction: "ltr", textAnchor: "end" }}
          width={48}
          tickFormatter={(v: number) =>
            v >= 1000 ? `${Number((v / 1000).toFixed(1))}k` : String(v)
          }
          domain={[0, axisMax]}
          ticks={axisTicks}
          minTickGap={8}
        />
        <Tooltip content={<CustomTooltip />} />
        {categories.map((_, rank) => {
          const key = `stack${rank}`;
          return (
            <Bar key={key} dataKey={key} stackId="a">
              {rankedData.map((entry, monthIndex) => (
                <Cell
                  key={`${key}-${monthIndex}`}
                  fill={String(entry[`${key}Color`] ?? DEFAULT_COLOR)}
                />
              ))}
            </Bar>
          );
        })}
      </BarChart>
    </ResponsiveContainer>
  );
}
