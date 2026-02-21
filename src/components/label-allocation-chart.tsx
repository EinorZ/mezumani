"use client";

import { useMemo, useState } from "react";
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
import { getLabelColor } from "@/lib/constants";
import type { ChartMode } from "@/components/stock-pie-chart";
import { useChartLegend } from "@/hooks/use-chart-legend";

interface LabelDataItem {
  label: string;
  value: number;
  percent: number;
  color: string;
}

interface Props {
  holdings?: StockHolding[];
  labelMap?: Record<string, string>;
  labelColorMap?: Record<string, string>;
  title?: string;
  otherLabel?: string;
  chartMode?: ChartMode;
}

function useLabelData(
  holdings: StockHolding[] | undefined,
  labelMap: Record<string, string> | undefined,
  otherLabel: string,
  labelColorMap?: Record<string, string>,
) {
  return useMemo(() => {
    if (!holdings || !labelMap) return { data: [], totalValue: 0 };
    const groups = new Map<string, number>();
    for (const h of holdings) {
      if (h.currentValueILS <= 0) continue;
      const label = labelMap[h.symbol] ?? otherLabel;
      groups.set(label, (groups.get(label) ?? 0) + h.currentValueILS);
    }
    const total = Array.from(groups.values()).reduce((s, v) => s + v, 0);
    const items: LabelDataItem[] = Array.from(groups.entries())
      .map(([label, value]) => ({
        label,
        value,
        percent: total > 0 ? (value / total) * 100 : 0,
        color: labelColorMap?.[label] ?? (label === otherLabel ? "#adb5bd" : getLabelColor(label)),
      }))
      .sort((a, b) => b.value - a.value);
    return { data: items, totalValue: total };
  }, [holdings, labelMap, otherLabel, labelColorMap]);
}

/* ── Improved Donut ── */
function DonutChart({ data, totalValue }: { data: LabelDataItem[]; totalValue: number }) {
  const { hidden, hoveredIndex, handleClick, handleDblClick, handleHover, isHidden } =
    useChartLegend<LabelDataItem>(data, (item) => item.label);

  const visibleData = useMemo(() => {
    const filtered = data.filter((d) => !hidden.has(d.label));
    const total = filtered.reduce((s, d) => s + d.value, 0);
    return filtered.map((d) => ({ ...d, percent: total > 0 ? (d.value / total) * 100 : 0 }));
  }, [data, hidden]);

  const visibleTotal = useMemo(() => visibleData.reduce((s, d) => s + d.value, 0), [visibleData]);
  const hoveredItem = hoveredIndex !== undefined ? visibleData[hoveredIndex] : null;

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
              paddingAngle={3}
              dataKey="value"
              nameKey="label"
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
              onMouseEnter={(_: unknown, index: number) => handleHover(index)}
              onMouseLeave={() => handleHover(undefined)}
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
                {hoveredItem.label}
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
          const itemIsHidden = isHidden(item.label);
          const visibleIdx = visibleData.findIndex((d) => d.label === item.label);
          return (
            <div
              key={item.label}
              className="d-flex align-items-center gap-1"
              style={{
                fontSize: "0.72rem",
                opacity: itemIsHidden ? 0.35 : (hoveredIndex !== undefined && hoveredIndex !== visibleIdx ? 0.5 : 1),
                transition: "opacity 150ms ease",
                cursor: "pointer",
                textDecoration: itemIsHidden ? "line-through" : "none",
                userSelect: "none",
              }}
              onMouseEnter={() => { if (!itemIsHidden) handleHover(visibleIdx); }}
              onMouseLeave={() => handleHover(undefined)}
              onClick={() => handleClick(item.label)}
              onDoubleClick={() => handleDblClick(item.label)}
            >
              <span
                className="rounded-circle flex-shrink-0"
                style={{ width: 8, height: 8, backgroundColor: itemIsHidden ? "#ccc" : item.color }}
              />
              <span>{item.label}</span>
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
  label: string;
  percent: number;
  color: string;
  depth: number;
  onHover: (item: { label: string; percent: number; value: number } | null) => void;
  value: number;
}

function TreemapContent(props: TreemapContentProps) {
  const { x, y, width, height, label, percent, color, depth, onHover, value } = props;
  if (depth !== 1) return null;

  return (
    <g
      onMouseEnter={() => onHover({ label, percent, value })}
      onMouseLeave={() => onHover(null)}
      style={{ cursor: "pointer" }}
    >
      <rect x={x} y={y} width={width} height={height} rx={6} fill={color} stroke="#fff" strokeWidth={3} />
      {width > 50 && height > 35 && (
        <text
          x={x + width / 2}
          y={y + height / 2 - 8}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#fff"
          fontSize={width > 100 ? 14 : 11}
          fontWeight={700}
          style={{ pointerEvents: "none" }}
        >
          {label}
        </text>
      )}
      {width > 40 && height > 30 && (
        <text
          x={x + width / 2}
          y={y + height / 2 + 10}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="rgba(255,255,255,0.85)"
          fontSize={12}
          style={{ pointerEvents: "none" }}
        >
          {percent.toFixed(1)}%
        </text>
      )}
    </g>
  );
}

function TreemapChart({ data }: { data: LabelDataItem[] }) {
  const { hidden, handleClick, handleDblClick, isHidden } =
    useChartLegend<LabelDataItem>(data, (item) => item.label);

  const visibleData = useMemo(() => {
    const filtered = data.filter((d) => !hidden.has(d.label));
    const total = filtered.reduce((s, d) => s + d.value, 0);
    return filtered.map((d) => ({ ...d, percent: total > 0 ? (d.value / total) * 100 : 0 }));
  }, [data, hidden]);

  const treemapData = visibleData.map((d) => ({ ...d, name: d.label } as Record<string, unknown>));
  const [tooltip, setTooltip] = useState<{ label: string; percent: number; value: number } | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  return (
    <>
      <div
        style={{ width: "100%", height: 200 }}
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
                label="" percent={0} color="" depth={0} value={0}
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
            <div className="fw-bold">{tooltip.label}</div>
            <div className="text-muted">
              {tooltip.percent.toFixed(1)}% · {formatCurrencyCompact(tooltip.value)}
            </div>
          </div>
        )}
      </div>

      {/* Legend with filtering */}
      <div className="d-flex flex-wrap gap-2 mt-2 justify-content-center">
        {data.map((item) => {
          const itemIsHidden = isHidden(item.label);
          return (
            <div
              key={item.label}
              className="d-flex align-items-center gap-1"
              style={{
                fontSize: "0.72rem",
                opacity: itemIsHidden ? 0.35 : 1,
                transition: "opacity 150ms ease",
                cursor: "pointer",
                textDecoration: itemIsHidden ? "line-through" : "none",
                userSelect: "none",
              }}
              onClick={() => handleClick(item.label)}
              onDoubleClick={() => handleDblClick(item.label)}
            >
              <span
                className="rounded-circle flex-shrink-0"
                style={{ width: 8, height: 8, backgroundColor: itemIsHidden ? "#ccc" : item.color }}
              />
              <span>{item.label}</span>
            </div>
          );
        })}
      </div>
    </>
  );
}

/* ── Main Component ── */
export function LabelAllocationChart({
  holdings,
  labelMap,
  labelColorMap,
  title = "הקצאה לפי קטגוריה",
  otherLabel = "אחר",
  chartMode = "donut",
}: Props) {
  const { data, totalValue } = useLabelData(holdings, labelMap, otherLabel, labelColorMap);

  if (data.length === 0) {
    return (
      <div className="card rounded-3 border p-3 h-100">
        <h6 className="fw-bold small mb-2">{title}</h6>
        <div className="text-muted small text-center py-4">אין נתונים להצגה</div>
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
