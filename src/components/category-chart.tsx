"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Sector,
  type PieSectorShapeProps,
} from "recharts";
import type { CategoryBreakdown } from "@/lib/types";
import { formatCurrency, formatCurrencyCompact } from "@/lib/utils";

interface Props {
  categories: CategoryBreakdown[];
  colorMap: Record<string, string>;
  layout?: "vertical" | "horizontal";
}

const DEFAULT_COLOR = "#6c757d";

interface ChartItem {
  name: string;
  value: number;
  percent: number;
  color: string;
}

export function CategoryChart({
  categories,
  colorMap,
  layout = "vertical",
}: Props) {
  const [hoveredIndex, setHoveredIndex] = useState<number | undefined>(undefined);
  const [hidden, setHidden] = useState<Set<string>>(new Set());
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const allData = useMemo(() => {
    const positive = categories.filter((c) => c.amount > 0);
    const total = positive.reduce((s, c) => s + c.amount, 0);
    return positive.map((c) => ({
      name: c.category,
      value: c.amount,
      percent: total > 0 ? (c.amount / total) * 100 : 0,
      color: colorMap[c.category] || DEFAULT_COLOR,
    }));
  }, [categories, colorMap]);

  const visibleData = useMemo(() => {
    const filtered = allData.filter((d) => !hidden.has(d.name));
    const total = filtered.reduce((s, d) => s + d.value, 0);
    return filtered.map((d) => ({
      ...d,
      percent: total > 0 ? (d.value / total) * 100 : 0,
    }));
  }, [allData, hidden]);

  const visibleTotal = useMemo(
    () => visibleData.reduce((s, d) => s + d.value, 0),
    [visibleData],
  );

  const hoveredItem =
    hoveredIndex !== undefined ? visibleData[hoveredIndex] : null;

  // Negative categories (shown in legend only)
  const negativeCategories = useMemo(
    () => categories.filter((c) => c.amount < 0),
    [categories],
  );

  const handleLegendClick = useCallback(
    (name: string) => {
      if (clickTimer.current) {
        clearTimeout(clickTimer.current);
        clickTimer.current = null;
      }
      clickTimer.current = setTimeout(() => {
        setHidden((prev) => {
          const next = new Set(prev);
          if (next.has(name)) {
            next.delete(name);
          } else {
            const wouldRemain = allData.filter(
              (d) => !next.has(d.name) && d.name !== name,
            );
            if (wouldRemain.length > 0) next.add(name);
          }
          return next;
        });
        setHoveredIndex(undefined);
      }, 250);
    },
    [allData],
  );

  const handleLegendDblClick = useCallback(
    (name: string) => {
      if (clickTimer.current) {
        clearTimeout(clickTimer.current);
        clickTimer.current = null;
      }
      setHidden((prev) => {
        const visible = allData.filter((d) => !prev.has(d.name));
        if (visible.length === 1 && visible[0].name === name) {
          return new Set(); // restore all
        }
        return new Set(
          allData.filter((d) => d.name !== name).map((d) => d.name),
        );
      });
      setHoveredIndex(undefined);
    },
    [allData],
  );

  if (categories.length === 0) {
    return <p className="text-secondary text-center">אין נתונים</p>;
  }

  const isHorizontal = layout === "horizontal";

  const pieSection = visibleData.length > 0 && (
    <div style={{ width: "100%", height: 240, position: "relative" }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={visibleData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={65}
            outerRadius={100}
            paddingAngle={2}
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
                  outerRadius={isHovered ? outerRadius + 8 : outerRadius}
                  startAngle={startAngle}
                  endAngle={endAngle}
                  fill={fill}
                  style={{
                    cursor: "pointer",
                    transition: "all 200ms ease",
                    opacity:
                      hoveredIndex !== undefined && !isHovered ? 0.4 : 1,
                  }}
                />
              );
            }}
            onMouseEnter={(_: unknown, index: number) =>
              setHoveredIndex(index)
            }
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
            <div
              className="fw-bold"
              style={{ fontSize: "0.85rem", lineHeight: 1.2 }}
            >
              {hoveredItem.name}
            </div>
            <div
              className="fw-bold"
              style={{ fontSize: "0.95rem", color: hoveredItem.color }}
            >
              {hoveredItem.percent.toFixed(1)}%
            </div>
            <div className="text-muted" style={{ fontSize: "0.7rem" }}>
              {formatCurrencyCompact(hoveredItem.value)}
            </div>
          </>
        ) : (
          <>
            <div className="text-muted" style={{ fontSize: "0.7rem" }}>
              סה&quot;כ
            </div>
            <div className="fw-bold" style={{ fontSize: "1rem" }}>
              {formatCurrencyCompact(visibleTotal)}
            </div>
          </>
        )}
      </div>
    </div>
  );

  const legendSection = (
    <div className="d-flex flex-wrap gap-2 mt-2 justify-content-center">
      {allData.map((item) => {
        const isHidden = hidden.has(item.name);
        const visibleIdx = visibleData.findIndex((d) => d.name === item.name);
        return (
          <div
            key={item.name}
            className="d-flex align-items-center gap-1"
            style={{
              fontSize: "0.72rem",
              opacity: isHidden
                ? 0.35
                : hoveredIndex !== undefined && hoveredIndex !== visibleIdx
                  ? 0.5
                  : 1,
              transition: "opacity 150ms ease",
              cursor: "pointer",
              textDecoration: isHidden ? "line-through" : "none",
              userSelect: "none",
            }}
            onMouseEnter={() => {
              if (!isHidden) setHoveredIndex(visibleIdx);
            }}
            onMouseLeave={() => setHoveredIndex(undefined)}
            onClick={() => handleLegendClick(item.name)}
            onDoubleClick={() => handleLegendDblClick(item.name)}
          >
            <span
              className="rounded-circle flex-shrink-0"
              style={{
                width: 8,
                height: 8,
                backgroundColor: isHidden ? "#ccc" : item.color,
              }}
            />
            <span>{item.name}</span>
          </div>
        );
      })}
      {negativeCategories.map((c) => (
        <div
          key={c.category}
          className="d-flex align-items-center gap-1"
          style={{ fontSize: "0.72rem", opacity: 0.6 }}
        >
          <span
            className="rounded-circle flex-shrink-0"
            style={{
              width: 8,
              height: 8,
              backgroundColor: colorMap[c.category] || DEFAULT_COLOR,
            }}
          />
          <span>
            {c.category} ({formatCurrency(c.amount)})
          </span>
        </div>
      ))}
    </div>
  );

  if (isHorizontal) {
    const sideLegend = (
      <div style={{ maxHeight: 260, overflowY: "auto" }}>
        <div className="d-flex flex-column gap-1">
          {allData.map((item) => {
            const isHidden = hidden.has(item.name);
            const visibleIdx = visibleData.findIndex((d) => d.name === item.name);
            return (
              <div
                key={item.name}
                className="d-flex align-items-center gap-1"
                style={{
                  fontSize: "0.72rem",
                  opacity: isHidden
                    ? 0.35
                    : hoveredIndex !== undefined && hoveredIndex !== visibleIdx
                      ? 0.5
                      : 1,
                  transition: "opacity 150ms ease",
                  cursor: "pointer",
                  textDecoration: isHidden ? "line-through" : "none",
                  userSelect: "none",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={() => {
                  if (!isHidden) setHoveredIndex(visibleIdx);
                }}
                onMouseLeave={() => setHoveredIndex(undefined)}
                onClick={() => handleLegendClick(item.name)}
                onDoubleClick={() => handleLegendDblClick(item.name)}
              >
                <span
                  className="rounded-circle flex-shrink-0"
                  style={{
                    width: 8,
                    height: 8,
                    backgroundColor: isHidden ? "#ccc" : item.color,
                  }}
                />
                <span>{item.name}</span>
              </div>
            );
          })}
          {negativeCategories.map((c) => (
            <div
              key={c.category}
              className="d-flex align-items-center gap-1"
              style={{ fontSize: "0.72rem", opacity: 0.6, whiteSpace: "nowrap" }}
            >
              <span
                className="rounded-circle flex-shrink-0"
                style={{
                  width: 8,
                  height: 8,
                  backgroundColor: colorMap[c.category] || DEFAULT_COLOR,
                }}
              />
              <span>
                {c.category} ({formatCurrency(c.amount)})
              </span>
            </div>
          ))}
        </div>
      </div>
    );

    return (
      <div className="d-flex align-items-center gap-3 h-100">
        <div className="flex-shrink-0">{sideLegend}</div>
        <div className="flex-grow-1">{pieSection}</div>
      </div>
    );
  }

  return (
    <>
      {pieSection}
      {legendSection}
    </>
  );
}
