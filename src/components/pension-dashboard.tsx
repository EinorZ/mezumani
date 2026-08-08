"use client";

import React, { useState, useTransition, useMemo } from "react";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from "recharts";
import { useRouter } from "next/navigation";
import type { PensionData, PensionFund, PensionOwner, PensionFundType } from "@/lib/types";
import { formatCurrencyWhole } from "@/lib/utils";
import {
  addPensionFundAction,
  updatePensionFundAction,
  deletePensionFundAction,
} from "@/lib/actions";
import {
  PiggyBank,
  Wallet,
  Shield,
  GraduationCap,
  Plus,
  Trash2,
  X,
  Check,
} from "lucide-react";

const OWNERS: PensionOwner[] = ["עינור", "זיו"];
const FUND_TYPES: PensionFundType[] = ["פנסיה", "קרן השתלמות"];

/** Format a YYYY-MM-DD date string as DD.MM.YY */
function formatDate(dateStr: string): string {
  if (!dateStr) return "---";
  const parts = dateStr.split("-");
  if (parts.length !== 3) return dateStr;
  const [y, m, d] = parts;
  return `${d}.${m}.${y.slice(-2)}`;
}

interface Props {
  data: PensionData;
}

const TYPE_COLORS: Record<string, string> = {
  "פנסיה": "#1d4ed8",
  "קרן השתלמות": "#059669",
};
const OWNER_COLORS: Record<string, string> = {
  "עינור": "#1d4ed8",
  "זיו": "#5b21b6",
};

function DonutCard({ title, data }: { title: string; data: { name: string; value: number; color: string }[] }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const [hovered, setHovered] = useState<number | null>(null);
  const active = hovered !== null ? data[hovered] : null;
  return (
    <div className="card rounded-3 border-0 shadow-sm p-3 h-100">
      <div className="fw-semibold small mb-2 text-center">{title}</div>
      <div style={{ position: "relative", height: 180 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={52} outerRadius={78}
              paddingAngle={3} dataKey="value" stroke="none"
              onMouseEnter={(_: unknown, i: number) => setHovered(i)}
              onMouseLeave={() => setHovered(null)}>
              {data.map((d, i) => (
                <Cell key={i} fill={d.color}
                  opacity={hovered !== null && hovered !== i ? 0.4 : 1}
                  style={{ transition: "opacity 150ms" }} />
              ))}
            </Pie>
            <Tooltip content={() => null} />
          </PieChart>
        </ResponsiveContainer>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", textAlign: "center", pointerEvents: "none" }}>
          {active ? (
            <>
              <div style={{ fontSize: "0.7rem", color: active.color, fontWeight: 600 }}>{active.name}</div>
              <div style={{ fontSize: "0.9rem", fontWeight: 700 }}>{((active.value / total) * 100).toFixed(0)}%</div>
            </>
          ) : (
            <div style={{ fontSize: "0.7rem", color: "#6c757d" }}>סה״כ</div>
          )}
        </div>
      </div>
      <div className="d-flex flex-column gap-1 mt-1">
        {data.map((d, i) => (
          <div key={i} className="d-flex justify-content-between align-items-center" style={{ fontSize: "0.75rem" }}>
            <div className="d-flex align-items-center gap-1">
              <span className="rounded-circle" style={{ width: 8, height: 8, backgroundColor: d.color, flexShrink: 0 }} />
              <span>{d.name}</span>
            </div>
            <span className="text-muted">{((d.value / total) * 100).toFixed(0)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PensionCharts({ funds, einorTotal, zivTotal }: { funds: PensionFund[]; einorTotal: number; zivTotal: number }) {
  const typeData = useMemo(() => {
    const byType: Record<string, number> = {};
    funds.forEach((f) => { byType[f.type] = (byType[f.type] ?? 0) + f.balance; });
    return Object.entries(byType).map(([name, value]) => ({ name, value, color: TYPE_COLORS[name] ?? "#aaa" }));
  }, [funds]);

  const trackData = useMemo(() => {
    const byTrack: Record<string, number> = {};
    funds.forEach((f) => {
      const key = f.track || "ללא מסלול";
      byTrack[key] = (byTrack[key] ?? 0) + f.balance;
    });
    const total = Object.values(byTrack).reduce((s, v) => s + v, 0);
    const colors = ["#f59e0b", "#ec4899", "#06b6d4", "#84cc16", "#f97316", "#a78bfa"];
    return Object.entries(byTrack)
      .sort((a, b) => b[1] - a[1])
      .map(([name, value], i) => ({ name, value, color: colors[i % colors.length], pct: total > 0 ? ((value / total) * 100).toFixed(0) + "%" : "" }));
  }, [funds]);

  const stackedData = useMemo(() => [
    {
      name: "עינור",
      "פנסיה": einorFundsOf(funds, "עינור", "פנסיה"),
      "קרן השתלמות": einorFundsOf(funds, "עינור", "קרן השתלמות"),
    },
    {
      name: "זיו",
      "פנסיה": einorFundsOf(funds, "זיו", "פנסיה"),
      "קרן השתלמות": einorFundsOf(funds, "זיו", "קרן השתלמות"),
    },
  ], [funds, einorTotal, zivTotal]);

  return (
    <div className="mb-4">
      <div className="row g-3 mb-3">
        {/* Donut 1 — type split */}
        <div className="col-12 col-sm-4">
          <DonutCard title="פנסיה vs קרן השתלמות" data={typeData} />
        </div>
        {/* Stacked bar — owner by type */}
        <div className="col-12 col-sm-4">
          <div className="card rounded-3 border-0 shadow-sm p-3 h-100">
            <div className="fw-semibold small mb-2 text-center">עינור vs זיו לפי סוג</div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={stackedData} margin={{ top: 4, right: 8, left: 8, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip
                  formatter={(v: number | undefined) => v != null ? `₪${(v / 1000).toFixed(0)}K` : ""}
                  contentStyle={{ fontSize: "0.75rem", borderRadius: 8 }}
                />
                <Bar dataKey="פנסיה" stackId="a" fill={TYPE_COLORS["פנסיה"]} radius={[0, 0, 0, 0]} />
                <Bar dataKey="קרן השתלמות" stackId="a" fill={TYPE_COLORS["קרן השתלמות"]} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="d-flex gap-3 justify-content-center mt-1">
              {["פנסיה", "קרן השתלמות"].map((t) => (
                <div key={t} className="d-flex align-items-center gap-1" style={{ fontSize: "0.72rem" }}>
                  <span className="rounded-circle" style={{ width: 8, height: 8, backgroundColor: TYPE_COLORS[t], flexShrink: 0 }} />
                  {t}
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Donut 2 — track split */}
        <div className="col-12 col-sm-4">
          <DonutCard title="פיצול לפי מסלול" data={trackData} />
        </div>
      </div>

    </div>
  );
}

function einorFundsOf(funds: PensionFund[], owner: PensionOwner, type: PensionFundType): number {
  return funds.filter((f) => f.owner === owner && f.type === type).reduce((s, f) => s + f.balance, 0);
}

export function PensionDashboard({ data }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [funds, setFunds] = useState<PensionFund[]>(data.funds);

  // Balance inline edit
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");

  // Add fund form state
  const [showAddForm, setShowAddForm] = useState<PensionOwner | null>(null);
  const [addName, setAddName] = useState("");
  const [addType, setAddType] = useState<PensionFundType>("פנסיה");
  const [addTrack, setAddTrack] = useState("");
  const [addBalance, setAddBalance] = useState("");
  const [addCompany, setAddCompany] = useState("");

  const einorFunds = funds.filter((f) => f.owner === "עינור");
  const zivFunds = funds.filter((f) => f.owner === "זיו");
  const einorTotal = einorFunds.reduce((s, f) => s + f.balance, 0);
  const zivTotal = zivFunds.reduce((s, f) => s + f.balance, 0);
  const grandTotal = einorTotal + zivTotal;
  const allTracks = Array.from(new Set(funds.map((f) => f.track).filter(Boolean)));

  function startEdit(fund: PensionFund) {
    setEditingRow(fund.row);
    setEditValue(String(fund.balance));
  }

  function cancelEdit() {
    setEditingRow(null);
    setEditValue("");
  }

  function saveBalance(fund: PensionFund) {
    const newBalance = parseFloat(editValue.replace(/,/g, ""));
    if (isNaN(newBalance) || newBalance < 0) { cancelEdit(); return; }
    const today = new Date().toISOString().split("T")[0];
    setEditingRow(null);
    setFunds((prev) =>
      prev.map((f) =>
        f.row === fund.row ? { ...f, balance: newBalance, lastUpdated: today } : f
      )
    );
    startTransition(async () => {
      await updatePensionFundAction(fund.row, fund.owner, fund.name, fund.type, fund.track, newBalance, fund.company);
    });
  }

  function handleDelete(fund: PensionFund) {
    if (!confirm(`למחוק את "${fund.name}"?`)) return;
    setFunds((prev) => prev.filter((f) => f.row !== fund.row));
    startTransition(async () => {
      await deletePensionFundAction(fund.row);
    });
  }

  function handleAdd(owner: PensionOwner) {
    const name = addName.trim();
    const balance = parseFloat(addBalance.replace(/,/g, ""));
    if (!name || isNaN(balance) || balance < 0) return;
    const track = addTrack.trim();
    const company = addCompany.trim();
    const type = addType;
    const today = new Date().toISOString().split("T")[0];
    setShowAddForm(null);
    setAddName("");
    setAddTrack("");
    setAddBalance("");
    setAddCompany("");
    setAddType("פנסיה");
    setFunds((prev) => [
      ...prev,
      { row: -Date.now(), owner, name, type, track, balance, lastUpdated: today, company },
    ]);
    startTransition(async () => {
      await addPensionFundAction(owner, name, type, track, balance, company);
      router.refresh();
    });
  }

  const ownerStyles: Record<PensionOwner, React.CSSProperties> = {
    "עינור": { background: "linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%)", color: "#fff", border: "none" },
    "זיו":   { background: "linear-gradient(135deg, #5b21b6 0%, #8b5cf6 100%)", color: "#fff", border: "none" },
  };

  return (
    <div dir="rtl">
      {/* Page header */}
      <div className="mb-4 pt-1">
        <div className="d-flex align-items-center gap-2 mb-1">
          <PiggyBank size={24} className="text-primary" />
          <h1 className="h4 fw-bold mb-0">חיסכון פנסיוני</h1>
        </div>
      </div>

      {/* Summary cards */}
      <div className="row g-3 mb-4">
        {OWNERS.map((owner) => {
          const total = owner === "עינור" ? einorTotal : zivTotal;
          return (
            <div key={owner} className="col-6 col-md-4">
              <div className="card rounded-3 p-3 h-100" style={ownerStyles[owner]}>
                <div className="d-flex align-items-center gap-2 mb-2">
                  <span className="summary-card-icon">
                    <Wallet size={18} />
                  </span>
                  <span className="small opacity-75">{owner}</span>
                </div>
                <div className="h5 fw-bold mb-0 text-center" dir="ltr">
                  {formatCurrencyWhole(total)}
                </div>
              </div>
            </div>
          );
        })}
        <div className="col-12 col-md-4">
          <div
            className="card rounded-3 p-3 h-100"
            style={{
              background: "linear-gradient(135deg, #0f766e 0%, #14b8a6 100%)",
              color: "#fff",
              border: "none",
            }}
          >
            <div className="d-flex align-items-center gap-2 mb-2">
              <span className="summary-card-icon">
                <PiggyBank size={18} />
              </span>
              <span className="small opacity-75">סה״כ</span>
            </div>
            <div className="h5 fw-bold mb-0 text-center" dir="ltr">
              {formatCurrencyWhole(grandTotal)}
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      {funds.length > 0 && <PensionCharts funds={funds} einorTotal={einorTotal} zivTotal={zivTotal} />}

      {/* Fund sections per owner */}
      {OWNERS.map((owner) => {
        const ownerFunds = owner === "עינור" ? einorFunds : zivFunds;
        const ownerTotal = ownerFunds.reduce((s, f) => s + f.balance, 0);
        const accentColor = owner === "עינור" ? "#0d6efd" : "#6f42c1";

        return (
          <div key={owner} className="card rounded-3 border-0 shadow-sm mb-4">
            {/* Section header */}
            <div
              className="card-header bg-white border-bottom d-flex justify-content-between align-items-center rounded-top-3"
              style={{ borderInlineStart: `3px solid ${accentColor}` }}
            >
              <div className="d-flex align-items-center gap-2">
                <span
                  className="d-inline-flex align-items-center justify-content-center rounded-circle"
                  style={{
                    width: 28,
                    height: 28,
                    background: `${accentColor}15`,
                    color: accentColor,
                  }}
                >
                  <Wallet size={14} />
                </span>
                <span className="fw-semibold">{owner}</span>
                {ownerFunds.length > 0 && (
                  <span className="badge bg-body-secondary text-body-secondary rounded-pill">
                    {ownerFunds.length} {ownerFunds.length === 1 ? "קרן" : "קרנות"}
                  </span>
                )}
              </div>
              <button
                className="btn btn-sm btn-outline-primary rounded-pill d-flex align-items-center gap-1"
                onClick={() => {
                  setShowAddForm((prev) => (prev === owner ? null : owner));
                  setAddName("");
                  setAddTrack("");
                  setAddBalance("");
                  setAddCompany("");
                  setAddType("פנסיה");
                }}
              >
                <Plus size={14} />
                <span>הוסף קרן</span>
              </button>
            </div>

            <div className="card-body p-0">
              {/* Empty state */}
              {ownerFunds.length === 0 && showAddForm !== owner && (
                <div className="text-center py-5">
                  <PiggyBank size={36} className="text-muted mb-2" style={{ opacity: 0.3 }} />
                  <p className="text-muted mb-0 small">
                    אין קרנות. לחץ ״הוסף קרן״ כדי להתחיל.
                  </p>
                </div>
              )}

              {/* Fund list */}
              {ownerFunds.length > 0 && (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead>
                      <tr className="text-muted small" style={{ borderBottom: "2px solid #e9ecef" }}>
                        <th className="fw-medium ps-3 py-2" style={{ minWidth: 160 }}>שם הקרן</th>
                        <th className="fw-medium py-2">סוג</th>
                        <th className="fw-medium py-2 d-none d-sm-table-cell">מסלול</th>
                        <th className="fw-medium py-2 d-none d-sm-table-cell">חברה</th>
                        <th className="fw-medium py-2">יתרה</th>
                        <th className="fw-medium py-2 d-none d-md-table-cell">עדכון</th>
                        <th className="py-2" style={{ width: 36 }}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {ownerFunds.map((fund) => {
                        const TypeIcon = fund.type === "פנסיה" ? Shield : GraduationCap;
                        return (
                          <tr
                            key={fund.row}
                            className="position-relative"
                            style={{ transition: "background 120ms ease" }}
                          >
                            <td className="ps-3 py-3">
                              <span className="fw-medium">{fund.name}</span>
                            </td>
                            <td className="py-3">
                              <span
                                className="badge rounded-pill d-inline-flex align-items-center gap-1"
                                style={{
                                  background: fund.type === "פנסיה" ? "#e7f1ff" : "#e8f5e9",
                                  color: fund.type === "פנסיה" ? "#0d6efd" : "#198754",
                                  fontWeight: 500,
                                  fontSize: "0.78rem",
                                  padding: "0.35em 0.7em",
                                }}
                              >
                                <TypeIcon size={12} />
                                {fund.type}
                              </span>
                            </td>
                            <td className="py-3 d-none d-sm-table-cell">
                              {fund.track ? (
                                <span className="text-muted small">{fund.track}</span>
                              ) : (
                                <span className="text-muted" style={{ opacity: 0.3, fontSize: "0.8rem" }}>---</span>
                              )}
                            </td>
                            <td className="py-3 d-none d-sm-table-cell">
                              {fund.company ? (
                                <span className="text-muted small">{fund.company}</span>
                              ) : (
                                <span className="text-muted" style={{ opacity: 0.3, fontSize: "0.8rem" }}>---</span>
                              )}
                            </td>
                            <td className="py-3">
                              {editingRow === fund.row ? (
                                <div className="d-flex align-items-center gap-1">
                                  <input
                                    type="number"
                                    className="form-control form-control-sm"
                                    style={{ width: 130, direction: "ltr" }}
                                    value={editValue}
                                    onChange={(e) => setEditValue(e.target.value)}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter") saveBalance(fund);
                                      if (e.key === "Escape") cancelEdit();
                                    }}
                                    autoFocus
                                  />
                                </div>
                              ) : (
                                <span
                                  className="d-inline-flex align-items-center gap-1 user-select-none"
                                  style={{ direction: "ltr", fontVariantNumeric: "tabular-nums", cursor: "default" }}
                                  onDoubleClick={() => !isPending && startEdit(fund)}
                                  title="לחץ פעמיים לעדכון"
                                >
                                  <span className="fw-medium">{formatCurrencyWhole(fund.balance)}</span>
                                </span>
                              )}
                            </td>
                            <td className="py-3 d-none d-md-table-cell">
                              <span className="text-muted" style={{ fontSize: "0.8rem" }}>
                                {formatDate(fund.lastUpdated)}
                              </span>
                            </td>
                            <td className="py-3 pe-3">
                              <button
                                className="btn btn-link p-0 text-muted"
                                onClick={() => handleDelete(fund)}
                                disabled={isPending}
                                title="מחק"
                                style={{ opacity: 0.3, transition: "opacity 150ms ease" }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.opacity = "0.8";
                                  e.currentTarget.style.color = "#dc3545";
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.opacity = "0.3";
                                  e.currentTarget.style.color = "";
                                }}
                              >
                                <Trash2 size={14} />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>

                    {/* Total row */}
                    <tfoot>
                      <tr style={{ borderTop: "2px solid #e9ecef", background: "#f8f9fa" }}>
                        <td className="ps-3 py-3 fw-semibold" colSpan={4}>
                          <span className="d-none d-sm-inline">סה״כ {owner}</span>
                          <span className="d-sm-none">סה״כ</span>
                        </td>
                        <td className="py-3 fw-bold" dir="ltr" style={{ fontVariantNumeric: "tabular-nums" }}>
                          {formatCurrencyWhole(ownerTotal)}
                        </td>
                        <td className="d-none d-md-table-cell"></td>
                        <td></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}

              {/* Add fund inline form */}
              {showAddForm === owner && (
                <div
                  className="p-3"
                  style={{
                    background: "#f8f9fa",
                    borderTop: ownerFunds.length > 0 ? "1px solid #e9ecef" : "none",
                  }}
                >
                  <div className="row g-2 align-items-end">
                    <div className="col-12 col-sm-6 col-md-3">
                      <label className="form-label small text-muted mb-1">שם הקרן</label>
                      <input
                        className="form-control form-control-sm"
                        placeholder="לדוגמה: מגדל פנסיה"
                        value={addName}
                        onChange={(e) => setAddName(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleAdd(owner)}
                        autoFocus
                      />
                    </div>
                    <div className="col-6 col-sm-3 col-md-2">
                      <label className="form-label small text-muted mb-1">סוג</label>
                      <select
                        className="form-select form-select-sm"
                        value={addType}
                        onChange={(e) => setAddType(e.target.value as PensionFundType)}
                      >
                        {FUND_TYPES.map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-6 col-sm-3 col-md-2">
                      <label className="form-label small text-muted mb-1">מסלול</label>
                      <input
                        className="form-control form-control-sm"
                        placeholder="כללי..."
                        list="track-options"
                        value={addTrack}
                        onChange={(e) => setAddTrack(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleAdd(owner)}
                      />
                    </div>
                    <div className="col-6 col-sm-3 col-md-2">
                      <label className="form-label small text-muted mb-1">חברה</label>
                      <input
                        className="form-control form-control-sm"
                        placeholder="מגדל..."
                        value={addCompany}
                        onChange={(e) => setAddCompany(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleAdd(owner)}
                      />
                    </div>
                    <div className="col-6 col-sm-4 col-md-3">
                      <label className="form-label small text-muted mb-1">יתרה</label>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        placeholder="0.00"
                        style={{ direction: "ltr" }}
                        value={addBalance}
                        onChange={(e) => setAddBalance(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleAdd(owner)}
                      />
                    </div>
                    <div className="col-6 col-sm-4 col-md-2">
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-sm btn-primary d-flex align-items-center gap-1 flex-grow-1"
                          onClick={() => handleAdd(owner)}
                          disabled={isPending}
                        >
                          <Check size={14} />
                          <span>הוסף</span>
                        </button>
                        <button
                          className="btn btn-sm btn-outline-secondary d-flex align-items-center justify-content-center"
                          onClick={() => setShowAddForm(null)}
                          style={{ width: 32 }}
                          title="ביטול"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}

      <datalist id="track-options">
        {allTracks.map((t) => <option key={t} value={t} />)}
      </datalist>
    </div>
  );
}
