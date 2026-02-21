"use client";

import { useMemo } from "react";
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
import { useChartLegend } from "@/hooks/use-chart-legend";

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

function LegendItem({
  name,
  color,
  itemIsHidden,
  hoveredIndex,
  visibleIdx,
  onClick,
  onDblClick,
  onMouseEnter,
  onMouseLeave,
  noWrap,
}: {
  name: string;
  color: string;
  itemIsHidden: boolean;
  hoveredIndex: number | undefined;
  visibleIdx: number;
  onClick: () => void;
  onDblClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  noWrap?: boolean;
}) {
  return (
    <div
      className="d-flex align-items-center gap-1"
      style={{
        fontSize: "0.72rem",
        opacity: itemIsHidden
          ? 0.35
          : hoveredIndex !== undefined && hoveredIndex !== visibleIdx
            ? 0.5
            : 1,
        transition: "opacity 150ms ease",
        cursor: "pointer",
        textDecoration: itemIsHidden ? "line-through" : "none",
        userSelect: "none",
        ...(noWrap ? { whiteSpace: "nowrap" as const } : {}),
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      onDoubleClick={onDblClick}
    >
      <span
        className="rounded-circle flex-shrink-0"
        style={{
          width: 8,
          height: 8,
          backgroundColor: itemIsHidden ? "#ccc" : color,
        }}
      />
      <span>{name}</span>
    </div>
  );
}

export function CategoryChart({
  categories,
  colorMap,
  layout = "vertical",
}: Props) {
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

  const { hidden, hoveredIndex, handleClick, handleDblClick, handleHover, isHidden } =
    useChartLegend<ChartItem>(allData, (item) => item.name);

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
        const visibleIdx = visibleData.findIndex((d) => d.name === item.name);
        return (
          <LegendItem
            key={item.name}
            name={item.name}
            color={item.color}
            itemIsHidden={isHidden(item.name)}
            hoveredIndex={hoveredIndex}
            visibleIdx={visibleIdx}
            onClick={() => handleClick(item.name)}
            onDblClick={() => handleDblClick(item.name)}
            onMouseEnter={() => {
              if (!isHidden(item.name)) handleHover(visibleIdx);
            }}
            onMouseLeave={() => handleHover(undefined)}
          />
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
            const visibleIdx = visibleData.findIndex(
              (d) => d.name === item.name,
            );
            return (
              <LegendItem
                key={item.name}
                name={item.name}
                color={item.color}
                itemIsHidden={isHidden(item.name)}
                hoveredIndex={hoveredIndex}
                visibleIdx={visibleIdx}
                onClick={() => handleClick(item.name)}
                onDblClick={() => handleDblClick(item.name)}
                onMouseEnter={() => {
                  if (!isHidden(item.name)) handleHover(visibleIdx);
                }}
                onMouseLeave={() => handleHover(undefined)}
                noWrap
              />
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
