"use client";

import { useState } from "react";
import type { LabelAllocation } from "@/lib/types";
import { getLabelColor } from "@/lib/constants";

interface Props {
  labels: string[];
  allocations: LabelAllocation[];
  onSave: (allocations: LabelAllocation[]) => Promise<void>;
}

export function LabelColorList({ labels, allocations, onSave }: Props) {
  const [colors, setColors] = useState<Record<string, string>>(() => {
    const map: Record<string, string> = {};
    for (const a of allocations) {
      if (a.color) map[a.label] = a.color;
    }
    return map;
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  if (labels.length === 0) {
    return (
      <div className="text-muted small">
        אין קטגוריות מוגדרות. הגדר קטגוריות למניות תחת &quot;מניות&quot;.
      </div>
    );
  }

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    try {
      // Build full allocations list preserving existing targetPercent / selectedStock
      const allAllocations: LabelAllocation[] = labels.map((label) => {
        const existing = allocations.find((a) => a.label === label);
        return {
          label,
          targetPercent: existing?.targetPercent ?? 0,
          selectedStock: existing?.selectedStock,
          color: colors[label] || undefined,
        };
      });
      // Keep allocations for labels no longer in stocks (preserve their data)
      for (const a of allocations) {
        if (!labels.includes(a.label)) {
          allAllocations.push({ ...a, color: colors[a.label] ?? a.color });
        }
      }
      await onSave(allAllocations);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="d-flex flex-wrap gap-3 mb-3">
        {labels.map((label) => (
          <label
            key={label}
            className="d-flex align-items-center gap-2"
            style={{ cursor: "pointer" }}
          >
            <input
              type="color"
              value={colors[label] ?? getLabelColor(label)}
              onChange={(e) =>
                setColors((prev) => ({ ...prev, [label]: e.target.value }))
              }
              style={{
                width: 28,
                height: 28,
                padding: 2,
                border: "1px solid #dee2e6",
                borderRadius: 6,
                cursor: "pointer",
              }}
            />
            <span className="small fw-medium">{label}</span>
          </label>
        ))}
      </div>
      <button
        className="btn btn-sm btn-outline-primary"
        onClick={handleSave}
        disabled={saving}
      >
        {saving ? "שומר..." : saved ? "נשמר ✓" : "שמור צבעים"}
      </button>
    </div>
  );
}
