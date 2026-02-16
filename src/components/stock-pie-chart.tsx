"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Sector,
  Treemap,
  type PieSectorShapeProps,
} from "recharts";
import { formatCurrency, formatCurrencyCompact } from "@/lib/utils";
import type { StockHolding } from "@/lib/types";
import { CHART_COLORS } from "@/lib/constants";

export type ChartMode = "donut" | "treemap";

interface PieDataItem {
  name: string;
  symbol: string;
  value: number;
  percent: number;
  color: string;
}

interface Props {
  holdings: StockHolding[];
  title?: string;
  chartMode?: ChartMode;
}

function useChartData(holdings: StockHolding[]) {
  return useMemo(() => {
    const total = holdings.reduce((s, h) => s + h.currentValueILS, 0);
    const items: PieDataItem[] = holdings
      .filter((h) => h.currentValueILS > 0)
      .sort((a, b) => b.currentValueILS - a.currentValueILS)
      .map((h, i) => ({
        name: h.displayName,
        symbol: h.symbol,
        value: h.currentValueILS,
        percent: total > 0 ? (h.currentValueILS / total) * 100 : 0,
        color: CHART_COLORS[i % CHART_COLORS.length],
      }));
    return { data: items, totalValue: total };
  }, [holdings]);
}

/* ── Improved Donut ── */
function DonutChart({ data, totalValue }: { data: PieDataItem[]; totalValue: number }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | undefined>(undefined);
  const [hidden, setHidden] = useState<Set<string>>(new Set());
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const visibleData = useMemo(() => {
    const filtered = data.filter((d) => !hidden.has(d.symbol));
    const total = filtered.reduce((s, d) => s + d.value, 0);
    return filtered.map((d) => ({ ...d, percent: total > 0 ? (d.value / total) * 100 : 0 }));
  }, [data, hidden]);

  const visibleTotal = useMemo(() => visibleData.reduce((s, d) => s + d.value, 0), [visibleData]);
  const hoveredItem = hoveredIndex !== undefined ? visibleData[hoveredIndex] : null;

  const handleLegendClick = useCallback((symbol: string) => {
    if (clickTimer.current) { clearTimeout(clickTimer.current); clickTimer.current = null; }
    clickTimer.current = setTimeout(() => {
      setHidden((prev) => {
        const next = new Set(prev);
        if (next.has(symbol)) { next.delete(symbol); } else {
          // Don't hide if it's the last visible one
          const wouldRemain = data.filter((d) => !next.has(d.symbol) && d.symbol !== symbol);
          if (wouldRemain.length > 0) next.add(symbol);
        }
        return next;
      });
      setHoveredIndex(undefined);
    }, 250);
  }, [data]);

  const handleLegendDblClick = useCallback((symbol: string) => {
    if (clickTimer.current) { clearTimeout(clickTimer.current); clickTimer.current = null; }
    setHidden((prev) => {
      const visible = data.filter((d) => !prev.has(d.symbol));
      if (visible.length === 1 && visible[0].symbol === symbol) {
        return new Set(); // restore all
      }
      // isolate: hide everything except this one
      return new Set(data.filter((d) => d.symbol !== symbol).map((d) => d.symbol));
    });
    setHoveredIndex(undefined);
  }, [data]);

  return (
    <>
      <div style={{ width: "100%", height: 240, position: "relative" }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={visibleData}
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
              nameKey="name"
              stroke="none"
              shape={(props: PieSectorShapeProps) => {
                const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, index } = props;
                const isHovered = hoveredIndex === index;
                return (
                  <Sector
                    cx={cx}
                    cy={cy}
                    innerRadius={innerRadius}
                    outerRadius={isHovered ? outerRadius + 8 : outerRadius}
                    startAngle={startAngle}
                    endAngle={endAngle}
                    fill={fill}
                    style={{
                      cursor: "pointer",
                      transition: "all 200ms ease",
                      opacity: hoveredIndex !== undefined && !isHovered ? 0.4 : 1,
                    }}
                  />
                );
              }}
              onMouseEnter={(_: unknown, index: number) => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(undefined)}
            >
              {visibleData.map((item, index) => (
                <Cell key={`cell-${index}`} fill={item.color} />
              ))}
            </Pie>
            <Tooltip content={() => null} />
          </PieChart>
        </ResponsiveContainer>
        {/* Center label */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
            pointerEvents: "none",
          }}
        >
          {hoveredItem ? (
            <>
              <div className="fw-bold" style={{ fontSize: "0.85rem", lineHeight: 1.2 }}>
                {hoveredItem.name}
              </div>
              <div className="fw-bold" style={{ fontSize: "0.95rem", color: hoveredItem.color }}>
                {hoveredItem.percent.toFixed(1)}%
              </div>
              <div className="text-muted" style={{ fontSize: "0.7rem" }}>
                {formatCurrencyCompact(hoveredItem.value)}
              </div>
            </>
          ) : (
            <>
              <div className="text-muted" style={{ fontSize: "0.7rem" }}>סה&quot;כ</div>
              <div className="fw-bold" style={{ fontSize: "1rem" }}>
                {formatCurrencyCompact(visibleTotal)}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Compact legend */}
      <div className="d-flex flex-wrap gap-2 mt-2 justify-content-center">
        {data.map((item) => {
          const isHidden = hidden.has(item.symbol);
          const visibleIdx = visibleData.findIndex((d) => d.symbol === item.symbol);
          return (
            <div
              key={item.symbol}
              className="d-flex align-items-center gap-1"
              style={{
                fontSize: "0.72rem",
                opacity: isHidden ? 0.35 : (hoveredIndex !== undefined && hoveredIndex !== visibleIdx ? 0.5 : 1),
                transition: "opacity 150ms ease",
                cursor: "pointer",
                textDecoration: isHidden ? "line-through" : "none",
                userSelect: "none",
              }}
              onMouseEnter={() => { if (!isHidden) setHoveredIndex(visibleIdx); }}
              onMouseLeave={() => setHoveredIndex(undefined)}
              onClick={() => handleLegendClick(item.symbol)}
              onDoubleClick={() => handleLegendDblClick(item.symbol)}
            >
              <span
                className="rounded-circle flex-shrink-0"
                style={{ width: 8, height: 8, backgroundColor: isHidden ? "#ccc" : item.color }}
              />
              <span>{item.name}</span>
            </div>
          );
        })}
      </div>
    </>
  );
}

/* ── Treemap ── */
interface TreemapContentProps {
  x: number;
  y: number;
  width: number;
  height: number;
  name: string;
  percent: number;
  color: string;
  depth: number;
  onHover: (item: { name: string; percent: number; value: number } | null) => void;
  value: number;
}

function TreemapContent(props: TreemapContentProps) {
  const { x, y, width, height, name, percent, color, depth, onHover, value } = props;
  if (depth !== 1) return null;
  const showLabel = width > 50 && height > 35;
  const showPercent = width > 35 && height > 20;

  return (
    <g
      onMouseEnter={() => onHover({ name, percent, value })}
      onMouseLeave={() => onHover(null)}
      style={{ cursor: "pointer" }}
    >
      <rect x={x} y={y} width={width} height={height} rx={4} fill={color} stroke="#fff" strokeWidth={2} />
      {showLabel && (
        <text
          x={x + width / 2}
          y={y + height / 2 - (showPercent ? 6 : 0)}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#fff"
          fontSize={width > 80 ? 12 : 10}
          fontWeight={600}
          style={{ pointerEvents: "none" }}
        >
          {name}
        </text>
      )}
      {showPercent && (
        <text
          x={x + width / 2}
          y={y + height / 2 + (showLabel ? 12 : 0)}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="rgba(255,255,255,0.8)"
          fontSize={10}
          style={{ pointerEvents: "none" }}
        >
          {percent.toFixed(1)}%
        </text>
      )}
    </g>
  );
}

function TreemapChart({ data }: { data: PieDataItem[] }) {
  const [hidden, setHidden] = useState<Set<string>>(new Set());
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const visibleData = useMemo(() => {
    const filtered = data.filter((d) => !hidden.has(d.symbol));
    const total = filtered.reduce((s, d) => s + d.value, 0);
    return filtered.map((d) => ({ ...d, percent: total > 0 ? (d.value / total) * 100 : 0 }));
  }, [data, hidden]);

  const treemapData = visibleData.map((d) => ({ ...d } as Record<string, unknown>));
  const [tooltip, setTooltip] = useState<{ name: string; percent: number; value: number } | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleLegendClick = useCallback((symbol: string) => {
    if (clickTimer.current) { clearTimeout(clickTimer.current); clickTimer.current = null; }
    clickTimer.current = setTimeout(() => {
      setHidden((prev) => {
        const next = new Set(prev);
        if (next.has(symbol)) { next.delete(symbol); } else {
          const wouldRemain = data.filter((d) => !next.has(d.symbol) && d.symbol !== symbol);
          if (wouldRemain.length > 0) next.add(symbol);
        }
        return next;
      });
    }, 250);
  }, [data]);

  const handleLegendDblClick = useCallback((symbol: string) => {
    if (clickTimer.current) { clearTimeout(clickTimer.current); clickTimer.current = null; }
    setHidden((prev) => {
      const visible = data.filter((d) => !prev.has(d.symbol));
      if (visible.length === 1 && visible[0].symbol === symbol) {
        return new Set();
      }
      return new Set(data.filter((d) => d.symbol !== symbol).map((d) => d.symbol));
    });
  }, [data]);

  return (
    <>
      <div
        style={{ width: "100%", height: Math.max(180, visibleData.length * 18) }}
        onMouseMove={(e) => setMousePos({ x: e.clientX, y: e.clientY })}
      >
        <ResponsiveContainer width="100%" height="100%">
          <Treemap
            data={treemapData}
            dataKey="value"
            aspectRatio={4 / 3}
            stroke="#fff"
            content={
              <TreemapContent
                x={0} y={0} width={0} height={0}
                name="" percent={0} color="" depth={0} value={0}
                onHover={setTooltip}
              />
            }
          >
            {visibleData.map((item, index) => (
              <Cell key={`cell-${index}`} fill={item.color} />
            ))}
          </Treemap>
        </ResponsiveContainer>
        {tooltip && (
          <div
            className="card rounded-2 border shadow-sm p-2"
            style={{
              position: "fixed",
              top: mousePos.y - 50,
              left: mousePos.x + 14,
              background: "#fff",
              fontSize: "0.78rem",
              pointerEvents: "none",
              whiteSpace: "nowrap",
              zIndex: 9999,
            }}
          >
            <div className="fw-bold">{tooltip.name}</div>
            <div className="text-muted">
              {tooltip.percent.toFixed(1)}% · {formatCurrencyCompact(tooltip.value)}
            </div>
          </div>
        )}
      </div>

      {/* Legend with filtering */}
      <div className="d-flex flex-wrap gap-2 mt-2 justify-content-center">
        {data.map((item) => {
          const isHidden = hidden.has(item.symbol);
          return (
            <div
              key={item.symbol}
              className="d-flex align-items-center gap-1"
              style={{
                fontSize: "0.72rem",
                opacity: isHidden ? 0.35 : 1,
                transition: "opacity 150ms ease",
                cursor: "pointer",
                textDecoration: isHidden ? "line-through" : "none",
                userSelect: "none",
              }}
              onClick={() => handleLegendClick(item.symbol)}
              onDoubleClick={() => handleLegendDblClick(item.symbol)}
            >
              <span
                className="rounded-circle flex-shrink-0"
                style={{ width: 8, height: 8, backgroundColor: isHidden ? "#ccc" : item.color }}
              />
              <span>{item.name}</span>
            </div>
          );
        })}
      </div>
    </>
  );
}

/* ── Main Component ── */
export function StockPieChart({ holdings, title = "הרכב תיק", chartMode = "donut" }: Props) {
  const { data, totalValue } = useChartData(holdings);

  if (data.length === 0) {
    return (
      <div className="card rounded-3 border p-3 h-100">
        <h6 className="fw-bold small mb-2">{title}</h6>
        <div className="text-muted small text-center py-4">אין אחזקות להצגה</div>
      </div>
    );
  }

  return (
    <div className="card rounded-3 border p-3 h-100">
      <div className="d-flex justify-content-between align-items-center mb-1">
        <h6 className="fw-bold small mb-0">{title}</h6>
      </div>
      <div className="text-muted mb-2" style={{ fontSize: "0.75rem" }}>
        סה&quot;כ שווי: {formatCurrency(totalValue)}
      </div>

      {chartMode === "donut" && <DonutChart data={data} totalValue={totalValue} />}
      {chartMode === "treemap" && <TreemapChart data={data} />}
    </div>
  );
}
