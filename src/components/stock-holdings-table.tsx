"use client";

import { useState, useMemo } from "react";
import { Plus, ChevronDown, ChevronUp } from "lucide-react";
import { formatCurrency, formatNumber } from "@/lib/utils";
import type { StockHolding } from "@/lib/types";
import { TERM_COLORS, TERM_TEXT_COLORS, TERM_LABELS_SHORT } from "@/lib/constants";

type SortKey = "name" | "value" | "pnl" | "ytd" | "quantity";
type SortDir = "asc" | "desc";

interface Props {
  holdings: StockHolding[];
  onAddTransaction: () => void;
}

export function StockHoldingsTable({ holdings, onAddTransaction }: Props) {
  const [open, setOpen] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey>("value");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());

  function toggleGroup(label: string) {
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  }

  const grouped = useMemo(() => {
    function sortHoldings(items: StockHolding[]) {
      return [...items].sort((a, b) => {
        let cmp = 0;
        switch (sortKey) {
          case "name":
            cmp = a.displayName.localeCompare(b.displayName);
            break;
          case "value":
            cmp = a.currentValueILS - b.currentValueILS;
            break;
          case "pnl":
            cmp = a.profitLoss - b.profitLoss;
            break;
          case "ytd":
            cmp = (a.ytdChangePercent ?? -Infinity) - (b.ytdChangePercent ?? -Infinity);
            break;
          case "quantity":
            cmp = a.totalShares - b.totalShares;
            break;
        }
        return sortDir === "desc" ? -cmp : cmp;
      });
    }

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const map = new Map<string, StockHolding[]>();
    for (const h of holdings) {
      const arr = map.get(h.label) ?? [];
      arr.push(h);
      map.set(h.label, arr);
    }

    return Array.from(map.entries())
      .map(([label, items]) => {
        // Find most recent transaction date across all holdings in this label
        let latestDate: Date | null = null;
        for (const h of items) {
          for (const tx of h.transactions) {
            const [d, m, y] = tx.date.split("/").map(Number);
            if (!d || !m || !y) continue;
            const txDate = new Date(2000 + y, m - 1, d);
            if (!latestDate || txDate > latestDate) latestDate = txDate;
          }
        }
        const stale = !latestDate || latestDate < sixMonthsAgo;
        return {
          label,
          holdings: sortHoldings(items),
          totalValue: items.reduce((s, h) => s + h.currentValueILS, 0),
          totalPnl: items.reduce((s, h) => s + h.profitLoss, 0),
          totalInvested: items.reduce((s, h) => s + h.totalInvestedILS, 0),
          stale,
        };
      })
      .sort((a, b) => b.totalValue - a.totalValue);
  }, [holdings, sortKey, sortDir]);

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "desc" ? "asc" : "desc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  const sortArrow = (key: SortKey) =>
    sortKey === key ? (sortDir === "desc" ? " ▼" : " ▲") : "";

  return (
    <div className="card rounded-3 border mb-4 overflow-hidden">
      {/* Collapsible header */}
      <div
        className="d-flex align-items-center justify-content-between px-3 py-3 border-bottom"
        style={{ cursor: "pointer" }}
        onClick={() => setOpen((v) => !v)}
      >
        <div className="d-flex align-items-center gap-2">
          <span className="fw-bold" style={{ fontSize: "0.9rem" }}>אחזקות</span>
          <span className="badge rounded-pill bg-light text-secondary border" style={{ fontSize: "0.7rem" }}>{holdings.length}</span>
        </div>
        <div className="d-flex align-items-center gap-2">
          <button
            className="btn btn-sm btn-success rounded-pill"
            style={{ fontSize: "0.75rem" }}
            onClick={(e) => { e.stopPropagation(); onAddTransaction(); }}
          >
            <Plus size={12} className="me-1" />
            הוסף עסקה
          </button>
          {open ? <ChevronUp size={16} className="text-muted" /> : <ChevronDown size={16} className="text-muted" />}
        </div>
      </div>

      {open && <>
      {/* Desktop table */}
      <div className="d-none d-lg-block p-3">
        <div className="tx-header">
          <span
            className="tx-header-col"
            style={{ flex: 2 }}
            onClick={() => handleSort("name")}
          >
            שם{sortArrow("name")}
          </span>
          <span className="tx-header-col" style={{ flex: 0.7 }}>
            סוג
          </span>
          <span
            className="tx-header-col"
            style={{ flex: 0.7 }}
            onClick={() => handleSort("quantity")}
          >
            כמות{sortArrow("quantity")}
          </span>
          <span className="tx-header-col" style={{ flex: 1 }}>
            עלות ממוצעת
          </span>
          <span className="tx-header-col" style={{ flex: 1 }}>
            מחיר נוכחי
          </span>
          <span
            className="tx-header-col"
            style={{ flex: 1 }}
            onClick={() => handleSort("value")}
          >
            שווי{sortArrow("value")}
          </span>
          <span
            className="tx-header-col"
            style={{ flex: 1.2 }}
            onClick={() => handleSort("pnl")}
          >
            רווח/הפסד{sortArrow("pnl")}
          </span>
          <span
            className="tx-header-col"
            style={{ flex: 0.7 }}
            onClick={() => handleSort("ytd")}
          >
            YTD{sortArrow("ytd")}
          </span>
        </div>
        {grouped.map((g) => (
          <div key={g.label}>
            <LabelGroupHeader
              label={g.label}
              totalValue={g.totalValue}
              totalPnl={g.totalPnl}
              totalInvested={g.totalInvested}
              collapsed={collapsedGroups.has(g.label)}
              onToggle={() => toggleGroup(g.label)}
              stale={g.stale}
            />
            {!collapsedGroups.has(g.label) && g.holdings.map((h) => (
              <HoldingRow key={`${h.symbol}-${h.term}`} holding={h} />
            ))}
          </div>
        ))}
        {grouped.length === 0 && (
          <div className="text-center text-muted small py-3">
            אין אחזקות להצגה
          </div>
        )}
      </div>

      {/* Mobile cards */}
      <div className="d-lg-none p-3">
        {grouped.map((g) => (
          <div key={g.label}>
            <div
              className="d-flex align-items-center justify-content-between mb-2 mt-1"
              style={{ borderBottom: "1px solid #dee2e6", paddingBottom: "0.25rem", cursor: "pointer" }}
              onClick={() => toggleGroup(g.label)}
            >
              <div className="d-flex align-items-center gap-1">
                {collapsedGroups.has(g.label) ? <ChevronDown size={14} className="text-muted" /> : <ChevronUp size={14} className="text-muted" />}
                <span className="fw-semibold small">{g.label}</span>
              </div>
              <span className="small text-muted">{formatCurrency(g.totalValue)}</span>
            </div>
            {!collapsedGroups.has(g.label) && g.holdings.map((h) => (
              <HoldingCard key={`${h.symbol}-${h.term}-m`} holding={h} />
            ))}
          </div>
        ))}
        {grouped.length === 0 && (
          <div className="text-center text-muted small py-3">
            אין אחזקות להצגה
          </div>
        )}
      </div>
      </>}
    </div>
  );
}

function HoldingRow({ holding: h }: { holding: StockHolding }) {
  const [expanded, setExpanded] = useState(false);
  const isPositive = h.profitLoss >= 0;
  const pnlColor = isPositive ? "#198754" : "#dc3545";
  const hasTxs = h.transactions.length >= 1;

  return (
    <>
      <div
        className="tx-row"
        style={{ cursor: hasTxs ? "pointer" : "default" }}
        onClick={() => hasTxs && setExpanded((v) => !v)}
      >
        <span
          style={{
            flex: 2,
            display: "flex",
            alignItems: "center",
            gap: "0.25rem",
          }}
        >
          {hasTxs && (
            <span className="text-muted">
              {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </span>
          )}
          <span>
            <span className="fw-medium small">{h.displayName}</span>
            <br />
            <span className="small text-muted" dir="ltr">
              {h.symbol}
            </span>
          </span>
        </span>
        <span style={{ flex: 0.7 }}>
          <span
            className="badge rounded-pill"
            style={{
              backgroundColor: TERM_COLORS[h.term],
              color: TERM_TEXT_COLORS[h.term],
              fontSize: "0.65rem",
            }}
          >
            {TERM_LABELS_SHORT[h.term]}
          </span>
        </span>
        <span style={{ flex: 0.7 }} className="small">
          {formatNumber(h.totalShares)}
        </span>
        <span style={{ flex: 1 }} className="small">
          {formatCurrency(h.avgCostPerShareILS)}
        </span>
        <span style={{ flex: 1 }} className="small">
          {formatCurrency(h.currentPriceILS)}
          {h.currency === "USD" && h.currentPriceRaw > 0 && (
            <><br /><span className="text-muted" style={{ fontSize: "0.7rem" }} dir="ltr">${h.currentPriceRaw.toFixed(2)}</span></>
          )}
        </span>
        <span style={{ flex: 1 }} className="fw-bold small">
          {formatCurrency(h.currentValueILS)}
        </span>
        <span
          style={{ flex: 1.2, color: pnlColor }}
          className="fw-medium small text-nowrap"
        >
          <bdi>
            {isPositive ? "+" : ""}
            {formatCurrency(Math.abs(h.profitLoss))}
          </bdi>
          {" "}
          <span className="small opacity-75">
            <bdi>({isPositive ? "+" : "-"}{Math.abs(h.profitLossPercent).toFixed(2)}%)</bdi>
          </span>
        </span>
        <span
          style={{
            flex: 0.7,
            color:
              h.ytdChangePercent === null
                ? undefined
                : h.ytdChangePercent >= 0
                  ? "#198754"
                  : "#dc3545",
          }}
          className="fw-medium small"
          dir="ltr"
        >
          {h.ytdChangePercent === null
            ? "—"
            : `${h.ytdChangePercent >= 0 ? "+" : ""}${h.ytdChangePercent.toFixed(2)}%`}
        </span>
      </div>
      {expanded && h.transactions.map((tx, i) => {
        const txCost = tx.pricePerUnitILS * tx.quantity;
        const txCurrentValue = h.currentPriceILS * tx.quantity;
        const txPnl = txCurrentValue - txCost;
        const txPnlPercent = txCost > 0 ? (txPnl / txCost) * 100 : 0;
        const txPositive = txPnl >= 0;

        // Per-lot YTD: if purchased this year → return since purchase; otherwise → symbol's YTD
        const txYear = tx.date.split("/")[2] ? 2000 + parseInt(tx.date.split("/")[2], 10) : 0;
        const currentYear = new Date().getFullYear();
        const txYtd = h.ytdChangePercent === null
          ? null
          : txYear >= currentYear
            ? (tx.pricePerUnitILS > 0 ? (h.currentPriceILS - tx.pricePerUnitILS) / tx.pricePerUnitILS * 100 : null)
            : h.ytdChangePercent;

        return (
          <div key={i} className="tx-row" style={{ backgroundColor: "#f8f9fa", fontSize: "0.75rem", color: "#555" }}>
            <span style={{ flex: 2, paddingRight: "1.25rem" }}>{tx.date}</span>
            <span style={{ flex: 0.7 }} />
            <span style={{ flex: 0.7 }}>{formatNumber(tx.quantity)}</span>
            <span style={{ flex: 1 }}>{formatCurrency(tx.pricePerUnitILS)}</span>
            <span style={{ flex: 1 }} />
            <span style={{ flex: 1 }}>{formatCurrency(txCurrentValue)}</span>
            <span style={{ flex: 1.2, color: txPositive ? "#198754" : "#dc3545" }} className="fw-medium text-nowrap">
              <bdi>{txPositive ? "+" : ""}{formatCurrency(Math.abs(txPnl))}</bdi>
              {" "}
              <span className="opacity-75">
                <bdi>({txPositive ? "+" : "-"}{Math.abs(txPnlPercent).toFixed(2)}%)</bdi>
              </span>
            </span>
            <span
              style={{ flex: 0.7, color: txYtd === null ? undefined : txYtd >= 0 ? "#198754" : "#dc3545" }}
              className="fw-medium"
              dir="ltr"
            >
              {txYtd === null ? "" : `${txYtd >= 0 ? "+" : ""}${txYtd.toFixed(2)}%`}
            </span>
          </div>
        );
      })}
    </>
  );
}

function LabelGroupHeader({
  label,
  totalValue,
  totalPnl,
  totalInvested,
  collapsed,
  onToggle,
  stale,
}: {
  label: string;
  totalValue: number;
  totalPnl: number;
  totalInvested: number;
  collapsed: boolean;
  onToggle: () => void;
  stale: boolean;
}) {
  const isPositive = totalPnl >= 0;
  const pnlColor = isPositive ? "#198754" : "#dc3545";
  const pnlPercent = totalInvested > 0 ? (totalPnl / totalInvested) * 100 : 0;

  return (
    <div
      className="d-flex align-items-center px-2 py-1 gap-3"
      style={{
        backgroundColor: "#f1f3f5",
        borderTop: "1px solid #dee2e6",
        borderBottom: "1px solid #dee2e6",
        marginTop: "0.25rem",
        cursor: "pointer",
        userSelect: "none",
      }}
      onClick={onToggle}
    >
      <span className="fw-semibold small d-flex align-items-center gap-1" style={{ flex: 2 }}>
        {collapsed ? <ChevronDown size={13} className="text-muted" /> : <ChevronUp size={13} className="text-muted" />}
        {label}
        {stale && (
          <span
            className="badge rounded-pill"
            style={{ backgroundColor: "#fff3cd", color: "#856404", fontSize: "0.65rem", fontWeight: 500 }}
            title="לא עודכן ב-6 חודשים האחרונים"
          >
            לא עודכן
          </span>
        )}
      </span>
      <span style={{ flex: 0.7 }} />
      <span style={{ flex: 0.7 }} />
      <span style={{ flex: 1 }} />
      <span style={{ flex: 1 }} />
      <span className="fw-semibold small" style={{ flex: 1 }}>
        {formatCurrency(totalValue)}
      </span>
      <span
        className="fw-medium small"
        style={{ flex: 1.2, color: pnlColor }}
        dir="ltr"
      >
        {isPositive ? "+" : ""}
        {formatCurrency(Math.abs(totalPnl))}{" "}
        <span className="opacity-75">
          ({isPositive ? "+" : "-"}{Math.abs(pnlPercent).toFixed(1)}%)
        </span>
      </span>
      <span style={{ flex: 0.7 }} />
    </div>
  );
}

function HoldingCard({ holding: h }: { holding: StockHolding }) {
  const [expanded, setExpanded] = useState(false);
  const isPositive = h.profitLoss >= 0;
  const pnlColor = isPositive ? "#198754" : "#dc3545";
  const hasTxs = h.transactions.length >= 1;

  return (
    <div className="d-flex align-items-start mb-2" style={{ gap: "0.4rem" }}>
      {hasTxs ? (
        <span
          className="text-muted flex-shrink-0 mt-2"
          style={{ cursor: "pointer" }}
          onClick={() => setExpanded((v) => !v)}
        >
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </span>
      ) : (
        <span style={{ width: 14 }} className="flex-shrink-0" />
      )}
      <div
        className="border rounded-3 overflow-hidden flex-grow-1"
        style={{ cursor: hasTxs ? "pointer" : "default" }}
        onClick={() => hasTxs && setExpanded((v) => !v)}
      >
        <div
          className="d-flex align-items-center px-3 py-2"
          style={{ gap: "0.5rem" }}
        >
          {/* Term badge */}
          <span
            className="badge rounded-pill flex-shrink-0"
            style={{
              backgroundColor: TERM_COLORS[h.term],
              color: TERM_TEXT_COLORS[h.term],
              fontSize: "0.6rem",
              minWidth: 36,
              textAlign: "center",
            }}
          >
            {TERM_LABELS_SHORT[h.term]}
          </span>

          {/* Name + details */}
          <div className="flex-grow-1 small" style={{ minWidth: 0 }}>
            <div className="d-flex align-items-baseline gap-1">
              <span className="fw-bold text-truncate">
                {h.symbol} ({h.displayName})
              </span>
              <span className="text-muted" style={{ fontSize: "0.7rem" }}>
                {formatNumber(h.totalShares)} x {formatCurrency(h.currentPriceILS)}
                {h.currency === "USD" && h.currentPriceRaw > 0 && (
                  <span dir="ltr"> (${h.currentPriceRaw.toFixed(2)})</span>
                )}
              </span>
            </div>
            <span className="text-muted" style={{ fontSize: "0.7rem" }}>
              {h.bank}
            </span>
          </div>

          {/* Value + P&L */}
          <div
            className="text-start flex-shrink-0 small"
            style={{ minWidth: 90 }}
          >
            <div className="fw-bold">{formatCurrency(h.currentValueILS)}</div>
            <div style={{ color: pnlColor, fontSize: "0.75rem" }} dir="ltr">
              {isPositive ? "+" : ""}
              {h.profitLossPercent.toFixed(2)}% ({isPositive ? "+" : ""}
              {formatCurrency(h.profitLoss)})
            </div>
            {h.ytdChangePercent !== null && (
              <div
                style={{
                  color: h.ytdChangePercent >= 0 ? "#198754" : "#dc3545",
                  fontSize: "0.7rem",
                }}
                dir="ltr"
              >
                YTD: {h.ytdChangePercent >= 0 ? "+" : ""}
                {h.ytdChangePercent.toFixed(2)}%
              </div>
            )}
          </div>
        </div>

        {expanded && (
          <div className="px-3 pb-2" style={{ borderTop: "1px solid #eee" }}>
            {h.transactions.map((tx, i) => (
              <div
                key={i}
                className="d-flex justify-content-between small py-1"
                style={{ fontSize: "0.75rem" }}
              >
                <span className="text-muted">{tx.date}</span>
                <span>
                  {formatNumber(tx.quantity)} x {formatCurrency(tx.pricePerUnitILS)}
                </span>
                <span className="fw-medium">
                  {formatCurrency(tx.pricePerUnitILS * tx.quantity)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
