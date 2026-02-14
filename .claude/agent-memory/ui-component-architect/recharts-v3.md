# Recharts v3 Migration Notes

## Version: 3.7.0

### Pie Component Changes
- `activeIndex` prop **removed** from `<Pie>` in v3
- `activeShape` prop **deprecated** in favor of `shape`
- The `shape` prop receives `PieSectorShapeProps` which includes `isActive` and `index`
- Import: `import { type PieSectorShapeProps } from "recharts"`

### Correct v3 Pattern for Custom Pie Sectors
```tsx
<Pie
  shape={(props: PieSectorShapeProps) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, index, isActive } = props;
    return (
      <Sector
        cx={cx} cy={cy}
        innerRadius={innerRadius}
        outerRadius={isActive ? outerRadius + 6 : outerRadius}
        startAngle={startAngle} endAngle={endAngle}
        fill={fill}
      />
    );
  }}
  onMouseEnter={(_, index) => setHoveredIndex(index)}
  onMouseLeave={() => setHoveredIndex(undefined)}
>
```

### Hover Sync with External Legend
Since `activeIndex` is gone, manage hover state externally with `useState` and pass it into `shape` via closure. Sync the legend items with the same state.

### BarChart (unchanged in v3)
- `<Bar>`, `<XAxis>`, `<YAxis>`, `<Cell>`, `<Tooltip>` work the same
- `layout="vertical"` for horizontal bar charts still works
