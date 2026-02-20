"use client";

import { useState } from "react";
import { formatCurrency } from "@/lib/utils";
import type { StockTermGroup, InvestmentTerm } from "@/lib/types";
import { ALL_TERMS, TERM_LABELS, TERM_COLORS } from "@/lib/constants";

interface Props {
  byTerm: StockTermGroup[];
  usdToIls: number;
}

export function StockTermCards({ byTerm, usdToIls }: Props) {
  const [activeTab, setActiveTab] = useState<InvestmentTerm>("ארוך");

  // Filter to terms that have holdings or goals
  const activeTerm = byTerm.find((t) => t.term === activeTab) ?? byTerm[0];

  return (
    <div className="mb-4">
      {/* Mobile: tabs */}
      <div className="d-md-none mb-3">
        <div className="d-flex gap-2">
          {ALL_TERMS.map((term) => (
            <button
              key={term}
              className={`btn btn-sm flex-fill rounded-pill ${activeTab === term ? "btn-dark" : "btn-outline-secondary"}`}
              onClick={() => setActiveTab(term)}
            >
              {TERM_LABELS[term]}
            </button>
          ))}
        </div>
        {activeTerm && <TermCard group={activeTerm} usdToIls={usdToIls} />}
      </div>

      {/* Desktop: 3 columns */}
      <div className="d-none d-md-flex row g-3">
        {ALL_TERMS.map((term) => {
          const group = byTerm.find((t) => t.term === term);
          return (
            <div key={term} className="col-md-4">
              {group ? (
                <TermCard group={group} usdToIls={usdToIls} />
              ) : (
                <div
                  className="card rounded-3 border h-100 p-3"
                  style={{
                    borderInlineStart: `3px solid ${TERM_COLORS[term]}`,
                  }}
                >
                  <h6 className="fw-bold small mb-2">{TERM_LABELS[term]}</h6>
                  <span className="text-muted small">אין אחזקות</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TermCard({ group }: { group: StockTermGroup; usdToIls: number }) {
  const isPositive = group.profitLoss >= 0;
  const pnlColor = isPositive ? "#198754" : "#dc3545";

  return (
    <div
      className="card rounded-3 border h-100 p-3"
      style={{ borderInlineStart: `3px solid ${TERM_COLORS[group.term]}` }}
    >
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h6 className="fw-bold small mb-0">{TERM_LABELS[group.term]}</h6>
        <span
          className="badge rounded-pill bg-light text-dark"
          style={{ fontSize: "0.65rem" }}
        >
          {group.allocationPercent.toFixed(0)}% מהתיק
        </span>
      </div>

      <div className="d-flex flex-column gap-1 mb-3 small">
        <div className="d-flex justify-content-between">
          <span className="text-muted">שווי:</span>
          <span className="fw-bold">{formatCurrency(group.totalValueILS)}</span>
        </div>
        <div className="d-flex justify-content-between">
          <span className="text-muted">השקעה:</span>
          <span>{formatCurrency(group.totalInvestedILS)}</span>
        </div>
        <div className="d-flex justify-content-between">
          <span className="text-muted">רווח:</span>
          <span style={{ color: pnlColor }} dir="ltr">
            {isPositive ? "+" : ""}
            {formatCurrency(group.profitLoss)} ({isPositive ? "+" : ""}
            {group.profitLossPercent.toFixed(2)}%)
          </span>
        </div>
      </div>

      {/* Goals */}
      {group.goals.length > 0 &&
        group.goals.map((goal) => {
          const progress =
            goal.targetAmount > 0
              ? Math.min(100, (group.totalValueILS / goal.targetAmount) * 100)
              : 0;
          return (
            <div key={goal.label} className="mb-3">
              <div className="small text-muted mb-1">יעד: {goal.label}</div>
              <div className="progress" style={{ height: 8, borderRadius: 4 }}>
                <div
                  className="progress-bar"
                  style={{
                    width: `${progress}%`,
                    backgroundColor:
                      progress >= 100 ? "#198754" : TERM_COLORS[group.term],
                    borderRadius: 4,
                  }}
                />
              </div>
              <div
                className="d-flex justify-content-between mt-1"
                style={{ fontSize: "0.7rem" }}
              >
                <span className="text-muted">
                  {formatCurrency(group.totalValueILS)} /{" "}
                  {formatCurrency(goal.targetAmount)}
                </span>
                <span className="fw-bold">{progress.toFixed(0)}%</span>
              </div>
            </div>
          );
        })}

      {/* Holdings mini-list */}
      {group.holdings.length > 0 && (
        <>
          <div className="small text-muted mb-1 mt-2 border-top pt-2">
            מניות:
          </div>
          {group.holdings.map((h) => (
            <div
              key={`${h.symbol}-${h.term}`}
              className="d-flex justify-content-between small mb-1"
            >
              <span dir="ltr">{h.symbol}</span>
              <span className="text-muted">{h.totalShares.toFixed(2)} יח&apos;</span>
              <span className="fw-bold">
                {formatCurrency(h.currentValueILS)}
              </span>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
