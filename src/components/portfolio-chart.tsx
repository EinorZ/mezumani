"use client";

import { useState, useCallback, useTransition } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatCurrency, formatCurrencyCompact } from "@/lib/utils";
import type { ChartRange, InvestmentTerm, PortfolioHistoryPoint } from "@/lib/types";
import { getPortfolioHistoryAction } from "@/lib/actions";

const RANGES: { key: ChartRange; label: string }[] = [
  { key: "1M", label: "חודש" },
  { key: "6M", label: "6 חודשים" },
  { key: "YTD", label: "מתחילת השנה" },
  { key: "1Y", label: "שנה" },
  { key: "Max", label: "הכל" },
];

interface Props {
  initialData: PortfolioHistoryPoint[];
  initialRange: ChartRange;
  term?: InvestmentTerm;
}

function formatDateLabel(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("he-IL", { day: "numeric", month: "short" });
}

interface TooltipProps {
  active?: boolean;
  payload?: { payload: PortfolioHistoryPoint }[];
  firstValue: number;
}

function ChartTooltip({ active, payload, firstValue }: TooltipProps) {
  if (!active || !payload || payload.length === 0) return null;
  const point = payload[0].payload;
  const changeFromStart = firstValue > 0
    ? ((point.value - firstValue) / firstValue) * 100
    : 0;
  const investedDiff = point.value - point.invested;
  const investedPct = point.invested > 0
    ? ((investedDiff) / point.invested) * 100
    : 0;

  return (
    <div
      className="card rounded-2 border shadow-sm p-2"
      style={{ background: "#fff", fontSize: "0.78rem", whiteSpace: "nowrap" }}
    >
      <div className="fw-bold mb-1">
        {new Date(point.date).toLocaleDateString("he-IL", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      </div>
      <div>שווי: {formatCurrency(point.value)}</div>
      <div>
        השקעה: {formatCurrency(point.invested)}
        <span
          className="ms-1"
          style={{ color: investedDiff >= 0 ? "#198754" : "#dc3545" }}
          dir="ltr"
        >
          ({investedDiff >= 0 ? "+" : ""}{investedPct.toFixed(2)}%)
        </span>
      </div>
      <div className="text-muted" dir="ltr">
        שינוי בתקופה: {changeFromStart >= 0 ? "+" : ""}{changeFromStart.toFixed(2)}%
      </div>
    </div>
  );
}

export function PortfolioChart({ initialData, initialRange, term }: Props) {
  const [data, setData] = useState(initialData);
  const [activeRange, setActiveRange] = useState<ChartRange>(initialRange);
  const [isPending, startTransition] = useTransition();

  const handleRangeChange = useCallback(
    (range: ChartRange) => {
      if (range === activeRange) return;
      setActiveRange(range);
      startTransition(async () => {
        try {
          const result = await getPortfolioHistoryAction(range, term);
          setData(result);
        } catch (err) {
          console.error("[chart] fetch failed:", err);
        }
      });
    },
    [activeRange],
  );

  if (data.length === 0 && !isPending) return null;

  const firstValue = data.length > 0 ? data[0].value : 0;
  const lastValue = data.length > 0 ? data[data.length - 1].value : 0;
  const isUp = lastValue >= firstValue;
  const gradientColor = isUp ? "#198754" : "#dc3545";
  const changeAmount = lastValue - firstValue;
  const changePct = firstValue > 0 ? (changeAmount / firstValue) * 100 : 0;

  return (
    <div className="card rounded-3 border p-3 mb-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h6 className="fw-bold small mb-1">ביצועי תיק</h6>
          {data.length > 0 && (
            <span
              className="small fw-medium"
              style={{ color: gradientColor }}
              dir="ltr"
            >
              {changeAmount >= 0 ? "+" : ""}
              {formatCurrency(Math.abs(changeAmount))} ({changePct >= 0 ? "+" : ""}
              {changePct.toFixed(2)}%)
            </span>
          )}
        </div>
        <div className="d-flex gap-1">
          {RANGES.map(({ key, label }) => (
            <button
              key={key}
              className={`btn btn-sm rounded-pill ${
                activeRange === key ? "btn-dark" : "btn-outline-secondary"
              }`}
              style={{ fontSize: "0.72rem", padding: "2px 10px" }}
              onClick={() => handleRangeChange(key)}
              disabled={isPending}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ width: "100%", height: 250, position: "relative" }}>
        {isPending && (
          <div
            className="d-flex align-items-center justify-content-center"
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(255,255,255,0.7)",
              zIndex: 10,
            }}
          >
            <div className="spinner-border spinner-border-sm text-muted" role="status" />
          </div>
        )}
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <defs>
              <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={gradientColor} stopOpacity={0.3} />
                <stop offset="95%" stopColor={gradientColor} stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              tickFormatter={formatDateLabel}
              tick={{ fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
              minTickGap={50}
            />
            <YAxis
              tickFormatter={(v: number) => formatCurrencyCompact(v)}
              tick={{ fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              width={65}
              domain={["auto", "auto"]}
            />
            <Tooltip
              content={<ChartTooltip firstValue={firstValue} />}
              cursor={{ stroke: "#adb5bd", strokeDasharray: "3 3" }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke={gradientColor}
              strokeWidth={2}
              fill="url(#portfolioGradient)"
              dot={false}
              activeDot={{ r: 4, fill: gradientColor }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
