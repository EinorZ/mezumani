"use client";

import { useMemo, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Sector,
  type PieSectorShapeProps,
} from "recharts";
import { formatCurrency } from "@/lib/utils";
import type { StockHolding } from "@/lib/types";
import { CHART_COLORS } from "@/lib/constants";

interface PieDataItem {
  name: string;
  symbol: string;
  value: number;
  percent: number;
}

interface Props {
  holdings: StockHolding[];
  title?: string;
}

function ChartTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: PieDataItem }[];
}) {
  if (!active || !payload?.length) return null;
  const item = payload[0].payload;

  return (
    <div
      className="card rounded-2 border shadow-sm p-2"
      style={{ background: "#fff", minWidth: 140, fontSize: "0.8rem" }}
    >
      <div className="fw-bold mb-1">{item.name}</div>
      <div className="text-muted" dir="ltr" style={{ fontSize: "0.75rem" }}>
        {item.symbol}
      </div>
      <div className="d-flex justify-content-between mt-1">
        <span className="text-muted">שווי:</span>
        <span className="fw-bold">{formatCurrency(item.value)}</span>
      </div>
      <div className="d-flex justify-content-between">
        <span className="text-muted">אחוז:</span>
        <span className="fw-bold">{item.percent.toFixed(1)}%</span>
      </div>
    </div>
  );
}

export function StockPieChart({ holdings, title = "הרכב תיק" }: Props) {
  const [hoveredIndex, setHoveredIndex] = useState<number | undefined>(
    undefined,
  );

  const { data, totalValue } = useMemo(() => {
    const total = holdings.reduce((s, h) => s + h.currentValueILS, 0);

    const items: PieDataItem[] = holdings
      .filter((h) => h.currentValueILS > 0)
      .sort((a, b) => b.currentValueILS - a.currentValueILS)
      .map((h) => ({
        name: h.displayName,
        symbol: h.symbol,
        value: h.currentValueILS,
        percent: total > 0 ? (h.currentValueILS / total) * 100 : 0,
      }));

    return { data: items, totalValue: total };
  }, [holdings]);

  if (data.length === 0) {
    return (
      <div className="card rounded-3 border p-3 h-100">
        <h6 className="fw-bold small mb-2">{title}</h6>
        <div className="text-muted small text-center py-4">
          אין אחזקות להצגה
        </div>
      </div>
    );
  }

  return (
    <div className="card rounded-3 border p-3 h-100">
      <h6 className="fw-bold small mb-1">{title}</h6>
      <div className="text-muted mb-3" style={{ fontSize: "0.75rem" }}>
        סה&quot;כ שווי: {formatCurrency(totalValue)}
      </div>

      {/* Chart */}
      <div style={{ width: "100%", height: 220 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={85}
              paddingAngle={2}
              dataKey="value"
              nameKey="name"
              stroke="none"
              shape={(props: PieSectorShapeProps) => {
                const {
                  cx,
                  cy,
                  innerRadius,
                  outerRadius,
                  startAngle,
                  endAngle,
                  fill,
                  index,
                } = props;
                const isHovered = hoveredIndex === index;
                return (
                  <Sector
                    cx={cx}
                    cy={cy}
                    innerRadius={innerRadius}
                    outerRadius={isHovered ? outerRadius + 6 : outerRadius}
                    startAngle={startAngle}
                    endAngle={endAngle}
                    fill={fill}
                    style={{
                      cursor: "pointer",
                      transition: "opacity 150ms ease",
                      opacity:
                        hoveredIndex !== undefined && !isHovered ? 0.5 : 1,
                    }}
                  />
                );
              }}
              onMouseEnter={(_: unknown, index: number) =>
                setHoveredIndex(index)
              }
              onMouseLeave={() => setHoveredIndex(undefined)}
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={CHART_COLORS[index % CHART_COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip content={<ChartTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="d-flex flex-column gap-1 mt-2">
        {data.map((item, index) => (
          <div
            key={item.symbol}
            className="d-flex align-items-center gap-2 small"
            style={{
              opacity:
                hoveredIndex !== undefined && hoveredIndex !== index ? 0.4 : 1,
              transition: "opacity 150ms ease",
              cursor: "default",
            }}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(undefined)}
          >
            <span
              className="flex-shrink-0 rounded-1"
              style={{
                width: 10,
                height: 10,
                backgroundColor: CHART_COLORS[index % CHART_COLORS.length],
              }}
            />
            <span className="text-truncate" style={{ minWidth: 0, flex: 1 }}>
              {item.name}
            </span>
            <span
              className="text-muted flex-shrink-0"
              style={{ fontSize: "0.75rem" }}
            >
              {item.percent.toFixed(1)}%
            </span>
            <span
              className="fw-bold flex-shrink-0"
              style={{ fontSize: "0.75rem", minWidth: 70, textAlign: "start" }}
            >
              {formatCurrency(item.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
