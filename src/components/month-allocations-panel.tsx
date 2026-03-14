"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import { ChevronDown, ChevronUp, Plus, Trash2, Check, Loader2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { HEBREW_MONTHS } from "@/lib/constants";
import type { MonthAllocation, AnnualData } from "@/lib/types";
import { updateMonthAllocationsAction } from "@/lib/actions";

/* ── Creatable combobox for allocation labels ── */

interface LabelComboboxProps {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder?: string;
}

function LabelCombobox({ value, onChange, options, placeholder }: LabelComboboxProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const filtered = options.filter(
    (o) => o.toLowerCase().includes(value.toLowerCase()) && o !== value,
  );
  const showCreate = value.trim() && !options.includes(value.trim());
  const hasItems = filtered.length > 0 || showCreate;

  return (
    <div ref={containerRef} style={{ flex: 2, position: "relative" }}>
      <input
        className="form-control form-control-sm"
        placeholder={placeholder}
        value={value}
        onChange={(e) => { onChange(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        style={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: "0.82rem" }}
        dir="rtl"
        autoComplete="off"
      />
      {open && hasItems && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            right: 0,
            left: 0,
            zIndex: 100,
            backgroundColor: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: 8,
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            overflow: "hidden",
          }}
        >
          {filtered.map((opt) => (
            <div
              key={opt}
              onMouseDown={(e) => { e.preventDefault(); onChange(opt); setOpen(false); }}
              style={{
                padding: "7px 12px",
                fontSize: "0.82rem",
                cursor: "pointer",
                borderBottom: "1px solid #f3f4f6",
                direction: "rtl",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.backgroundColor = "#f9fafb"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.backgroundColor = "transparent"; }}
            >
              {opt}
            </div>
          ))}
          {showCreate && (
            <div
              onMouseDown={(e) => { e.preventDefault(); onChange(value.trim()); setOpen(false); }}
              style={{
                padding: "7px 12px",
                fontSize: "0.82rem",
                cursor: "pointer",
                color: "#1d4ed8",
                backgroundColor: "#f0f4ff",
                direction: "rtl",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.backgroundColor = "#dbeafe"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.backgroundColor = "#f0f4ff"; }}
            >
              <Plus size={12} />
              הוסף &ldquo;{value.trim()}&rdquo;
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Chip color palette ── */
const CHIP_PALETTE = [
  { bg: "#dbeafe", text: "#1d4ed8" },
  { bg: "#d1fae5", text: "#065f46" },
  { bg: "#fef3c7", text: "#92400e" },
  { bg: "#ede9fe", text: "#5b21b6" },
  { bg: "#e0f2fe", text: "#0c4a6e" },
];

function chipColor(label: string) {
  let hash = 0;
  for (let i = 0; i < label.length; i++) {
    hash = (hash * 31 + label.charCodeAt(i)) | 0;
  }
  return CHIP_PALETTE[Math.abs(hash) % CHIP_PALETTE.length];
}

/* ── Props ── */

interface Props {
  data: AnnualData;
  yearSuffix: number;
}

export function MonthAllocationsPanel({ data, yearSuffix }: Props) {
  const [open, setOpen] = useState(false);
  const [editingMonth, setEditingMonth] = useState<number | null>(null);

  // Only show months that have data (marked as done)
  const activeMonths = Array.from({ length: 12 }, (_, i) => i).filter(
    (i) => data.totals.months[i] !== null,
  );

  const totalAllocated = activeMonths.reduce((sum, i) => {
    const allocs = data.monthAllocations[i] ?? [];
    return sum + allocs.reduce((s, a) => s + a.amount, 0);
  }, 0);

  const totalProfit = activeMonths.reduce((sum, i) => {
    const income = data.monthIncome[i] ?? 0;
    const expenses = data.totals.months[i] ?? 0;
    return sum + (income - expenses);
  }, 0);

  const overallPct = totalProfit > 0 ? Math.min((totalAllocated / totalProfit) * 100, 100) : 0;
  const overallBarColor = overallPct >= 99.5 ? "#198754" : overallPct > 0 ? "#f59e0b" : "#dee2e6";

  // Collect all unique labels used across any month this year
  const suggestedLabels = Array.from(
    new Set(
      activeMonths.flatMap((i) => (data.monthAllocations[i] ?? []).map((a) => a.label)),
    ),
  );

  // Summary: total per label across all months
  const labelSummary = activeMonths
    .flatMap((i) => data.monthAllocations[i] ?? [])
    .reduce<Record<string, number>>((acc, a) => {
      acc[a.label] = (acc[a.label] ?? 0) + a.amount;
      return acc;
    }, {});
  const labelSummaryEntries = Object.entries(labelSummary).sort((a, b) => b[1] - a[1]);

  return (
    <div className="card rounded-3 border mb-4 overflow-hidden">
      {/* ── Header ── */}
      <div
        className="d-flex align-items-center justify-content-between px-3 py-3"
        style={{ cursor: "pointer" }}
        onClick={() => setOpen((v) => !v)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setOpen((v) => !v); } }}
        aria-expanded={open}
      >
        <div className="d-flex align-items-center gap-2">
          <span className="fw-bold" style={{ fontSize: "0.9rem" }}>
            חלוקת חיסכון חודשי
          </span>
          {totalProfit > 0 && (
            <span
              className="badge rounded-pill"
              style={{
                fontSize: "0.7rem",
                backgroundColor: overallPct >= 99.5 ? "#d1fae5" : overallPct > 0 ? "#fef3c7" : "#f8f9fa",
                color: overallPct >= 99.5 ? "#065f46" : overallPct > 0 ? "#92400e" : "#495057",
                border: "none",
              }}
            >
              <span dir="ltr">
                {formatCurrency(totalAllocated)} / {formatCurrency(totalProfit)}
              </span>
            </span>
          )}
        </div>
        {open ? (
          <ChevronUp size={16} className="text-muted" />
        ) : (
          <ChevronDown size={16} className="text-muted" />
        )}
      </div>

      {/* ── Overall progress bar ── */}
      {open && totalProfit > 0 && (
        <div style={{ padding: "0 12px 8px" }}>
          <div
            style={{
              height: 4,
              borderRadius: 2,
              backgroundColor: "#f0f0f0",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${overallPct}%`,
                backgroundColor: overallBarColor,
                borderRadius: 2,
                transition: "width 400ms ease",
              }}
            />
          </div>
        </div>
      )}

      {open && (
        <div style={{ display: "flex", alignItems: "flex-start" }}>
          {/* Desktop table */}
          <div className="d-none d-lg-flex" style={{ flex: 1, flexDirection: "column", minWidth: 0 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.5rem 0.75rem",
                borderBottom: "2px solid #e9ecef",
                fontSize: "0.8rem",
                color: "#6c757d",
                fontWeight: 600,
              }}
            >
              <span style={{ flex: 1 }}>חודש</span>
              <span style={{ flex: 0.8, textAlign: "start" }}>חיסכון</span>
              <span style={{ flex: 3 }}>הקצאות</span>
              <span style={{ flex: 1, textAlign: "start" }}>נותר</span>
              <span style={{ flex: 0.4 }} />
            </div>
            {activeMonths.map((i) => (
              <MonthRow
                key={i}
                monthIndex={i}
                yearSuffix={yearSuffix}
                income={data.monthIncome[i] ?? 0}
                expenses={data.totals.months[i] ?? 0}
                allocations={data.monthAllocations[i] ?? []}
                sheetTitle={data.monthSheetTitles[i] ?? ""}
                isEditing={editingMonth === i}
                onEdit={() => setEditingMonth(editingMonth === i ? null : i)}
                suggestedLabels={suggestedLabels}
              />
            ))}
          </div>

          {/* Desktop summary sidebar */}
          {labelSummaryEntries.length > 0 && (
            <div
              className="d-none d-lg-flex flex-column gap-2"
              style={{
                width: 160,
                flexShrink: 0,
                padding: "12px 10px",
                borderInlineStart: "1px solid #e9ecef",
                backgroundColor: "#fafbfc",
              }}
            >
              {labelSummaryEntries.map(([label, amount]) => {
                const c = chipColor(label);
                const pct = totalAllocated > 0 ? (amount / totalAllocated) * 100 : 0;
                return (
                  <div
                    key={label}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 4,
                      padding: "8px 10px",
                      borderRadius: 10,
                      backgroundColor: c.bg,
                    }}
                  >
                    <span style={{ fontSize: "0.7rem", color: c.text, fontWeight: 600 }}>
                      {label}
                    </span>
                    <span style={{ fontSize: "0.85rem", color: c.text, fontWeight: 700 }} dir="ltr">
                      {formatCurrency(amount)}
                    </span>
                    <div style={{ height: 3, borderRadius: 2, backgroundColor: `${c.text}30`, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${pct}%`, backgroundColor: c.text, borderRadius: 2, transition: "width 400ms ease" }} />
                    </div>
                    <span style={{ fontSize: "0.63rem", color: c.text, opacity: 0.7 }} dir="ltr">
                      {pct.toFixed(0)}% מסה&quot;כ
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Mobile */}
          <div className="d-lg-none" style={{ width: "100%" }}>
            {/* Mobile summary chips */}
            {labelSummaryEntries.length > 0 && (
              <div className="d-flex flex-wrap gap-2 px-3 pt-3 pb-2" style={{ borderBottom: "1px solid #e9ecef" }}>
                {labelSummaryEntries.map(([label, amount]) => {
                  const c = chipColor(label);
                  return (
                    <div key={label} style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 10px", borderRadius: 8, backgroundColor: c.bg }}>
                      <span style={{ fontSize: "0.7rem", color: c.text, fontWeight: 600 }}>{label}</span>
                      <span style={{ fontSize: "0.72rem", color: c.text, fontWeight: 700 }} dir="ltr">{formatCurrency(amount)}</span>
                    </div>
                  );
                })}
              </div>
            )}
            <div className="p-3">
            {activeMonths.map((i) => (
              <MonthCard
                key={i}
                monthIndex={i}
                yearSuffix={yearSuffix}
                income={data.monthIncome[i] ?? 0}
                expenses={data.totals.months[i] ?? 0}
                allocations={data.monthAllocations[i] ?? []}
                sheetTitle={data.monthSheetTitles[i] ?? ""}
                isEditing={editingMonth === i}
                onEdit={() => setEditingMonth(editingMonth === i ? null : i)}
                suggestedLabels={suggestedLabels}
              />
            ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Row props shared by desktop / mobile ── */

interface RowProps {
  monthIndex: number;
  yearSuffix: number;
  income: number;
  expenses: number;
  allocations: MonthAllocation[];
  sheetTitle: string;
  isEditing: boolean;
  onEdit: () => void;
  suggestedLabels: string[];
}

/* ── Desktop row ── */

function MonthRow({
  monthIndex,
  yearSuffix,
  income,
  expenses,
  allocations,
  sheetTitle,
  isEditing,
  onEdit,
  suggestedLabels,
}: RowProps) {
  const profit = income - expenses;
  const totalAllocated = allocations.reduce((s, a) => s + a.amount, 0);
  const unallocated = profit - totalAllocated;
  const profitColor = profit >= 0 ? "#198754" : "#dc3545";

  // Progress bar per month
  const pct = profit > 0 ? Math.min((totalAllocated / profit) * 100, 100) : 0;
  const barColor = pct >= 99.5 ? "#198754" : pct > 0 ? "#f59e0b" : "#dee2e6";

  const isFullyAllocated = profit > 0 && pct >= 99.5;
  const hasAllocations = allocations.length > 0;

  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          padding: "0.65rem 0.75rem",
          borderBottom: "1px solid #f0f0f0",
          cursor: "pointer",
          transition: "background 150ms",
        }}
        onClick={onEdit}
        onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.backgroundColor = "#fafafa"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.backgroundColor = "transparent"; }}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onEdit(); } }}
        aria-expanded={isEditing}
      >
        {/* Month name */}
        <span className="fw-medium small" style={{ flex: 1 }}>
          {HEBREW_MONTHS[monthIndex]}
        </span>

        {/* Savings (income - expenses) */}
        <span
          className="small fw-semibold"
          style={{ flex: 0.8, color: profitColor, textAlign: "start" }}
          dir="ltr"
        >
          {profit >= 0 ? "+" : ""}{formatCurrency(profit)}
        </span>

        {/* Allocations column: progress bar + chips */}
        <span style={{ flex: 3, display: "flex", flexDirection: "column", gap: 4 }}>
          {/* Thin progress bar */}
          <div
            style={{
              height: 3,
              borderRadius: 2,
              backgroundColor: "#f0f0f0",
              overflow: "hidden",
              width: "100%",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${pct}%`,
                backgroundColor: barColor,
                borderRadius: 2,
                transition: "width 400ms ease",
              }}
            />
          </div>

          {/* Chips */}
          {!hasAllocations ? (
            <span
              style={{
                fontSize: "0.7rem",
                color: "#9ca3af",
                display: "inline-flex",
                alignItems: "center",
                gap: 3,
              }}
            >
              <Plus size={10} style={{ opacity: 0.6 }} />
              הקצה
            </span>
          ) : (
            <span className="d-flex flex-wrap gap-1">
              {allocations.map((a, j) => {
                const c = chipColor(a.label);
                return (
                  <span
                    key={j}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 3,
                      fontSize: "0.65rem",
                      fontWeight: 500,
                      padding: "2px 8px",
                      borderRadius: 999,
                      backgroundColor: c.bg,
                      color: c.text,
                      lineHeight: 1.5,
                    }}
                  >
                    {a.label}
                    <span dir="ltr" style={{ fontWeight: 600 }}>{formatCurrency(a.amount)}</span>
                  </span>
                );
              })}
            </span>
          )}
        </span>

        {/* Remaining / unallocated */}
        <span style={{ flex: 1, textAlign: "start" }}>
          {isFullyAllocated ? (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 3,
                fontSize: "0.7rem",
                fontWeight: 500,
                padding: "2px 8px",
                borderRadius: 999,
                backgroundColor: "#d1fae5",
                color: "#065f46",
              }}
            >
              מוקצה במלואו
            </span>
          ) : hasAllocations ? (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                fontSize: "0.7rem",
                fontWeight: 600,
                padding: "2px 8px",
                borderRadius: 999,
                backgroundColor: unallocated < 0 ? "#fee2e2" : "#fef3c7",
                color: unallocated < 0 ? "#991b1b" : "#92400e",
              }}
              dir="ltr"
            >
              {formatCurrency(unallocated)}
            </span>
          ) : (
            <span style={{ color: "#d1d5db", fontSize: "0.75rem" }}>—</span>
          )}
        </span>

        {/* Expand chevron */}
        <span style={{ flex: 0.4, display: "flex", justifyContent: "center" }}>
          {isEditing ? (
            <ChevronUp size={14} className="text-muted" />
          ) : (
            <ChevronDown size={14} className="text-muted" />
          )}
        </span>
      </div>

      {isEditing && (
        <AllocationEditor
          sheetTitle={sheetTitle}
          yearSuffix={yearSuffix}
          profit={profit}
          initialAllocations={allocations}
          onClose={onEdit}
          suggestedLabels={suggestedLabels}
        />
      )}
    </>
  );
}

/* ── Mobile card ── */

function MonthCard({
  monthIndex,
  yearSuffix,
  income,
  expenses,
  allocations,
  sheetTitle,
  isEditing,
  onEdit,
  suggestedLabels,
}: RowProps) {
  const profit = income - expenses;
  const totalAllocated = allocations.reduce((s, a) => s + a.amount, 0);
  const unallocated = profit - totalAllocated;
  const profitColor = profit >= 0 ? "#198754" : "#dc3545";

  const pct = profit > 0 ? Math.min((totalAllocated / profit) * 100, 100) : 0;
  const barColor = pct >= 99.5 ? "#198754" : pct > 0 ? "#f59e0b" : "#dee2e6";

  const isFullyAllocated = profit > 0 && pct >= 99.5;
  const hasAllocations = allocations.length > 0;

  return (
    <div className="border rounded-3 mb-2 overflow-hidden">
      <div
        style={{ cursor: "pointer" }}
        onClick={onEdit}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onEdit(); } }}
        aria-expanded={isEditing}
      >
        <div className="d-flex align-items-center justify-content-between px-3 py-2">
          <div>
            <div className="fw-semibold small">{HEBREW_MONTHS[monthIndex]}</div>
            <div className="small" style={{ color: profitColor, fontSize: "0.75rem" }} dir="ltr">
              חיסכון: {profit >= 0 ? "+" : ""}{formatCurrency(profit)}
            </div>
          </div>
          <div className="text-start small d-flex align-items-center gap-2">
            {isFullyAllocated ? (
              <span
                style={{
                  fontSize: "0.65rem",
                  fontWeight: 500,
                  padding: "2px 8px",
                  borderRadius: 999,
                  backgroundColor: "#d1fae5",
                  color: "#065f46",
                }}
              >
                מוקצה במלואו
              </span>
            ) : hasAllocations ? (
              <span
                style={{
                  fontSize: "0.65rem",
                  fontWeight: 600,
                  padding: "2px 8px",
                  borderRadius: 999,
                  backgroundColor: unallocated < 0 ? "#fee2e2" : "#fef3c7",
                  color: unallocated < 0 ? "#991b1b" : "#92400e",
                }}
                dir="ltr"
              >
                נותר {formatCurrency(unallocated)}
              </span>
            ) : (
              <span
                style={{
                  fontSize: "0.65rem",
                  color: "#9ca3af",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 3,
                }}
              >
                <Plus size={10} style={{ opacity: 0.6 }} />
                הקצה
              </span>
            )}
            {isEditing ? <ChevronUp size={14} className="text-muted" /> : <ChevronDown size={14} className="text-muted" />}
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ padding: "0 12px 6px" }}>
          <div
            style={{
              height: 3,
              borderRadius: 2,
              backgroundColor: "#f0f0f0",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${pct}%`,
                backgroundColor: barColor,
                borderRadius: 2,
                transition: "width 400ms ease",
              }}
            />
          </div>
        </div>

        {/* Chips on mobile */}
        {hasAllocations && (
          <div style={{ padding: "0 12px 8px" }}>
            <div className="d-flex flex-wrap gap-1">
              {allocations.map((a, j) => {
                const c = chipColor(a.label);
                return (
                  <span
                    key={j}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 3,
                      fontSize: "0.6rem",
                      fontWeight: 500,
                      padding: "1px 7px",
                      borderRadius: 999,
                      backgroundColor: c.bg,
                      color: c.text,
                      lineHeight: 1.5,
                    }}
                  >
                    {a.label}
                    <span dir="ltr" style={{ fontWeight: 600 }}>{formatCurrency(a.amount)}</span>
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {isEditing && (
        <div style={{ borderTop: "1px solid #eee" }}>
          <AllocationEditor
            sheetTitle={sheetTitle}
            yearSuffix={yearSuffix}
            profit={profit}
            initialAllocations={allocations}
            onClose={onEdit}
            suggestedLabels={suggestedLabels}
          />
        </div>
      )}
    </div>
  );
}

/* ── Allocation editor ── */

interface EditorProps {
  sheetTitle: string;
  yearSuffix: number;
  profit: number;
  initialAllocations: MonthAllocation[];
  onClose: () => void;
  suggestedLabels: string[];
}

function AllocationEditor({
  sheetTitle,
  yearSuffix,
  profit,
  initialAllocations,
  onClose,
  suggestedLabels,
}: EditorProps) {
  const [rows, setRows] = useState<MonthAllocation[]>(
    initialAllocations.length > 0 ? [...initialAllocations] : [],
  );
  const [isPending, startTransition] = useTransition();

  const totalAllocated = rows.reduce((s, r) => s + (r.amount || 0), 0);
  const unallocated = profit - totalAllocated;

  function updateRow(index: number, field: keyof MonthAllocation, value: string) {
    setRows((prev) =>
      prev.map((r, i) =>
        i === index
          ? { ...r, [field]: field === "amount" ? parseFloat(value) || 0 : value }
          : r,
      ),
    );
  }

  function addRow() {
    setRows((prev) => [...prev, { label: "", amount: 0 }]);
  }

  function removeRow(index: number) {
    setRows((prev) => prev.filter((_, i) => i !== index));
  }

  function fillRemainder(index: number) {
    if (unallocated <= 0) return;
    setRows((prev) =>
      prev.map((r, i) =>
        i === index ? { ...r, amount: (r.amount || 0) + unallocated } : r,
      ),
    );
  }

  function save() {
    const valid = rows.filter((r) => r.label.trim() && r.amount > 0);
    startTransition(async () => {
      await updateMonthAllocationsAction(sheetTitle, yearSuffix, valid);
      onClose();
    });
  }

  const savingsPct = profit > 0 ? Math.min((totalAllocated / profit) * 100, 100) : 0;

  return (
    <div style={{ backgroundColor: "#fafbfc", padding: "12px 12px 14px" }}>
      {/* ── Mini stat chips ── */}
      <div
        className="d-flex flex-wrap gap-2 mb-3"
        style={{ fontSize: "0.72rem" }}
      >
        {/* Savings */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "5px 10px",
            borderRadius: 8,
            backgroundColor: "#f0f4ff",
            color: "#1e40af",
            fontWeight: 500,
          }}
        >
          <span>חיסכון</span>
          <span dir="ltr" style={{ fontWeight: 700 }}>{formatCurrency(profit)}</span>
        </div>

        <span style={{ color: "#d1d5db", alignSelf: "center", fontSize: "0.7rem" }}>&#8594;</span>

        {/* Allocated */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "5px 10px",
            borderRadius: 8,
            backgroundColor: savingsPct >= 99.5 ? "#d1fae5" : "#fef3c7",
            color: savingsPct >= 99.5 ? "#065f46" : "#92400e",
            fontWeight: 500,
          }}
        >
          <span>מוקצה</span>
          <span dir="ltr" style={{ fontWeight: 700 }}>{formatCurrency(totalAllocated)}</span>
        </div>

        <span style={{ color: "#d1d5db", alignSelf: "center", fontSize: "0.7rem" }}>&#8594;</span>

        {/* Remaining */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "5px 10px",
            borderRadius: 8,
            backgroundColor: unallocated < 0 ? "#fee2e2" : unallocated === 0 ? "#d1fae5" : "#f3f4f6",
            color: unallocated < 0 ? "#991b1b" : unallocated === 0 ? "#065f46" : "#374151",
            fontWeight: 500,
          }}
        >
          <span>נותר</span>
          <span dir="ltr" style={{ fontWeight: 700 }}>{formatCurrency(unallocated)}</span>
        </div>
      </div>

      {/* ── Allocation rows ── */}
      <div className="d-flex flex-column gap-0 mb-3">
        {rows.map((row, i) => {
          const isLast = i === rows.length - 1;
          return (
            <div
              key={i}
              className="d-flex align-items-center gap-2"
              style={{
                padding: "8px 0",
                borderBottom: i < rows.length - 1 ? "1px solid #f0f0f0" : "none",
              }}
            >
              <LabelCombobox
                value={row.label}
                onChange={(v) => updateRow(i, "label", v)}
                options={suggestedLabels}
                placeholder="לאן (קרן, מניות...)"
              />
              <div style={{ flex: 1, position: "relative", display: "flex" }}>
                <input
                  className="form-control form-control-sm text-start"
                  type="number"
                  placeholder="סכום"
                  value={row.amount || ""}
                  onChange={(e) => updateRow(i, "amount", e.target.value)}
                  style={{
                    borderRadius: isLast && unallocated > 0 ? "8px 0 0 8px" : 8,
                    border: "1px solid #e5e7eb",
                    fontSize: "0.82rem",
                    paddingInlineEnd: isLast && unallocated > 0 ? 0 : undefined,
                  }}
                  dir="ltr"
                />
                {/* "Allocate remainder" button on the last row */}
                {isLast && unallocated > 0 && (
                  <button
                    type="button"
                    onClick={() => fillRemainder(i)}
                    title="הקצה את הנותר"
                    style={{
                      border: "1px solid #e5e7eb",
                      borderInlineStart: "none",
                      borderRadius: "0 8px 8px 0",
                      background: "#f9fafb",
                      color: "#6b7280",
                      fontSize: "0.65rem",
                      padding: "0 8px",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                      transition: "background 150ms, color 150ms",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "#f59e0b"; e.currentTarget.style.color = "#fff"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "#f9fafb"; e.currentTarget.style.color = "#6b7280"; }}
                  >
                    +נותר
                  </button>
                )}
              </div>
              <button
                className="btn btn-sm"
                style={{
                  padding: "4px 7px",
                  color: "#ef4444",
                  borderRadius: 8,
                  border: "1px solid transparent",
                  transition: "background 150ms",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#fee2e2"; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
                onClick={() => removeRow(i)}
                type="button"
                aria-label="מחק שורה"
              >
                <Trash2 size={13} />
              </button>
            </div>
          );
        })}
      </div>

      {/* ── Footer actions ── */}
      <div className="d-flex align-items-center justify-content-between gap-2 flex-wrap">
        <button
          className="btn btn-sm"
          style={{
            color: "#6b7280",
            border: "1px dashed #d1d5db",
            borderRadius: 8,
            padding: "4px 12px",
            fontSize: "0.78rem",
            transition: "background 150ms, border-color 150ms",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#f3f4f6"; e.currentTarget.style.borderColor = "#9ca3af"; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.borderColor = "#d1d5db"; }}
          onClick={addRow}
          type="button"
        >
          <Plus size={12} style={{ marginInlineEnd: 4 }} />
          הוסף
        </button>

        <button
          className="btn btn-sm"
          style={{
            background: "linear-gradient(135deg, #198754 0%, #20c997 100%)",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "5px 16px",
            fontSize: "0.78rem",
            fontWeight: 600,
            opacity: isPending ? 0.7 : 1,
            transition: "opacity 150ms, box-shadow 150ms",
            boxShadow: "0 1px 4px rgba(25,135,84,0.2)",
          }}
          onClick={save}
          disabled={isPending}
          type="button"
        >
          {isPending ? (
            <Loader2 size={12} className="me-1 spin" />
          ) : (
            <Check size={12} className="me-1" />
          )}
          שמור
        </button>
      </div>
    </div>
  );
}
