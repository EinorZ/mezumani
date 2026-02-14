"use client";

import { useState, useMemo } from "react";
import { Plus, ChevronDown, ChevronUp } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import type { StockHolding } from "@/lib/types";
import { TERM_COLORS, TERM_TEXT_COLORS, TERM_LABELS_SHORT } from "@/lib/constants";

type SortKey = "name" | "value" | "pnl" | "quantity";
type SortDir = "asc" | "desc";

interface Props {
  holdings: StockHolding[];
  onAddTransaction: () => void;
}

export function StockHoldingsTable({ holdings, onAddTransaction }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>("value");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const filtered = useMemo(() => {
    let items = [...holdings].sort((a, b) => {
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
        case "quantity":
          cmp = a.totalShares - b.totalShares;
          break;
      }
      return sortDir === "desc" ? -cmp : cmp;
    });

    return items;
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
    <div className="card rounded-3 border mb-4">
      {/* Action bar */}
      <div className="d-flex align-items-center p-3 pb-0">
        <button
          className="btn btn-sm btn-success rounded-pill"
          onClick={onAddTransaction}
        >
          <Plus size={14} className="me-1" />
          הוסף עסקה
        </button>
      </div>

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
        </div>
        {filtered.map((h) => (
          <HoldingRow key={`${h.symbol}-${h.term}`} holding={h} />
        ))}
        {filtered.length === 0 && (
          <div className="text-center text-muted small py-3">
            אין אחזקות להצגה
          </div>
        )}
      </div>

      {/* Mobile cards */}
      <div className="d-lg-none p-3">
        {filtered.map((h) => (
          <HoldingCard key={`${h.symbol}-${h.term}-m`} holding={h} />
        ))}
        {filtered.length === 0 && (
          <div className="text-center text-muted small py-3">
            אין אחזקות להצגה
          </div>
        )}
      </div>
    </div>
  );
}

function HoldingRow({ holding: h }: { holding: StockHolding }) {
  const [expanded, setExpanded] = useState(false);
  const isPositive = h.profitLoss >= 0;
  const pnlColor = isPositive ? "#198754" : "#dc3545";
  const hasTxs = h.transactions.length > 1;

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
          {h.totalShares}
        </span>
        <span style={{ flex: 1 }} className="small">
          {formatCurrency(h.avgCostPerShareILS)}
        </span>
        <span style={{ flex: 1 }} className="small">
          {formatCurrency(h.currentPriceILS)}
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
            <bdi>({isPositive ? "+" : "-"}{Math.abs(h.profitLossPercent).toFixed(1)}%)</bdi>
          </span>
        </span>
      </div>
      {expanded && (
        <div style={{ backgroundColor: "#f8f9fa", padding: "0.5rem 1.5rem 0.75rem 1.5rem" }}>
          <table className="table table-sm mb-0" style={{ fontSize: "0.75rem" }}>
            <thead>
              <tr className="text-muted">
                <th className="fw-normal border-0 pe-3">תאריך</th>
                <th className="fw-normal border-0 pe-3">סכום</th>
                <th className="fw-normal border-0 pe-3">מחיר קניה</th>
                <th className="fw-normal border-0 pe-3">מחיר נוכחי</th>
                <th className="fw-normal border-0">רווח/הפסד</th>
              </tr>
            </thead>
            <tbody>
              {h.transactions.map((tx, i) => {
                const txCost = tx.pricePerUnitILS * tx.quantity;
                const txCurrentValue = h.currentPriceILS * tx.quantity;
                const txPnl = txCurrentValue - txCost;
                const txPnlPercent = txCost > 0 ? (txPnl / txCost) * 100 : 0;
                const txPositive = txPnl >= 0;

                return (
                  <tr key={i}>
                    <td className="text-muted">{tx.date}</td>
                    <td>{formatCurrency(txCost)}</td>
                    <td>{formatCurrency(tx.pricePerUnitILS)}</td>
                    <td>{formatCurrency(h.currentPriceILS)}</td>
                    <td
                      style={{ color: txPositive ? "#198754" : "#dc3545" }}
                      className="fw-medium"
                      dir="ltr"
                    >
                      {txPositive ? "+" : ""}
                      {formatCurrency(txPnl)}
                      <span className="opacity-75 ms-1">
                        ({txPositive ? "+" : ""}{txPnlPercent.toFixed(1)}%)
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

function HoldingCard({ holding: h }: { holding: StockHolding }) {
  const [expanded, setExpanded] = useState(false);
  const isPositive = h.profitLoss >= 0;
  const pnlColor = isPositive ? "#198754" : "#dc3545";
  const hasTxs = h.transactions.length > 1;

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
                {h.totalShares} x {formatCurrency(h.avgCostPerShareILS)}
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
              {h.profitLossPercent.toFixed(1)}% ({isPositive ? "+" : ""}
              {formatCurrency(h.profitLoss)})
            </div>
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
                  {tx.quantity} x {formatCurrency(tx.pricePerUnitILS)}
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
