"use client";

import { AreaChart, Area, ResponsiveContainer } from "recharts";

interface Props {
  data: (number | null)[];
  color: string;
}

export function CategorySparkline({ data, color }: Props) {
  const chartData = data.map((value, i) => ({
    month: i,
    value: value ?? 0,
  }));

  return (
    <ResponsiveContainer width={120} height={30}>
      <AreaChart data={chartData} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
        <defs>
          <linearGradient id={`grad-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.3} />
            <stop offset="100%" stopColor={color} stopOpacity={0.05} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={1.5}
          fill={`url(#grad-${color.replace("#", "")})`}
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
