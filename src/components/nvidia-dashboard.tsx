"use client";

import { useState } from "react";
import {
  RefreshCw,
  Plus,
  DollarSign,
  ChevronDown,
  ChevronUp,
  Briefcase,
  Pencil,
  Calculator,
  Tag,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import type {
  NvidiaCompensationData,
  RsuGrant,
  RsuVest,
} from "@/lib/types";
import {
  isFutureDate,
  isMatured,
  isVestComingSoon,
  getMaturationDate,
  formatSheetDate,
} from "@/lib/nvidia-utils";
import { NvidiaAddPanel, type NvidiaPanelMode } from "./nvidia-add-panel";
import { toggleRsuSoldAction } from "@/lib/actions";
import { usePageRefresh } from "@/hooks/use-page-refresh";

interface Props {
  data: NvidiaCompensationData;
}

function formatUsd(amount: number): string {
  return `$${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}


export function NvidiaDashboard({ data }: Props) {
  const [panelOpen, setPanelOpen] = useState(false);
  const [panelMode, setPanelMode] = useState<NvidiaPanelMode>("addRsuGrant");
  const [panelEditData, setPanelEditData] = useState<Record<string, unknown>>({});
  const [expandedGrants, setExpandedGrants] = useState<Set<string>>(new Set());
  const { refreshing, handleRefresh } = usePageRefresh("/nvidia");

  const { grants, currentNvdaPriceUsd, usdToIls, summary } = data;

  function openPanel(mode: NvidiaPanelMode, editData?: Record<string, unknown>) {
    setPanelMode(mode);
    setPanelEditData(editData ?? {});
    setPanelOpen(true);
  }

  function toggleGrant(grantDate: string) {
    setExpandedGrants((prev) => {
      const next = new Set(prev);
      if (next.has(grantDate)) next.delete(grantDate);
      else next.add(grantDate);
      return next;
    });
  }

  const lastUpdatedDate = new Date(data.lastUpdated);
  const minutesAgo = Math.floor((Date.now() - lastUpdatedDate.getTime()) / 60000);

  return (
    <>
      {/* Header */}
      <div className="page-header mb-4 d-flex align-items-center justify-content-between">
        <div>
          <h1 className="h4 fw-bold mb-1">NVIDIA Compensation</h1>
          <div className="d-flex align-items-center gap-2 flex-wrap">
            <span className="badge bg-light text-dark border" dir="ltr">
              NVDA {formatUsd(currentNvdaPriceUsd)}
            </span>
            <span className="badge bg-light text-dark border" dir="ltr">
              USD/ILS {usdToIls.toFixed(2)}
            </span>
            {minutesAgo <= 60 && (
              <span className="badge bg-light text-muted border">
                עודכן לפני {minutesAgo} דק׳
              </span>
            )}
          </div>
        </div>
        <div className="d-flex gap-2 align-items-center">
          <button
            className="btn btn-outline-info btn-sm"
            onClick={() => openPanel("calcRsuSell", { currentNvdaPriceUsd, usdToIls, grossSoFar: data.grossSoFar, monthlySalary: data.monthlySalary, esppMonthlyContribution: data.esppMonthlyContribution, grants: data.grants })}
          >
            <Calculator size={14} className="me-1" />
            מחשבון RSU
          </button>
          <button
            className="btn btn-outline-info btn-sm"
            onClick={() => openPanel("calcEsppSell", { currentNvdaPriceUsd, usdToIls, grossSoFar: data.grossSoFar, monthlySalary: data.monthlySalary, esppMonthlyContribution: data.esppMonthlyContribution, esppPurchasePrice: data.esppPurchasePrice })}
          >
            <Calculator size={14} className="me-1" />
            מחשבון ESPP
          </button>
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw size={14} className={refreshing ? "spin" : ""} />
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card rounded-3 border p-3 h-100">
            <div className="d-flex align-items-center mb-1">
              <DollarSign size={16} className="text-info me-2" />
              <small className="text-muted">שווי כולל</small>
            </div>
            <div className="fw-bold fs-5" dir="ltr">
              {formatCurrency(summary.totalValueIls)}
            </div>
            <small className="text-muted">ולא נמכרו</small>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card rounded-3 border p-3 h-100">
            <div className="d-flex align-items-center mb-1">
              <TrendingUp size={16} className="text-success me-2" />
              <small className="text-muted">שווי vested</small>
            </div>
            <div className="fw-bold fs-5" dir="ltr">
              {formatCurrency(summary.vestedValueIls)}
            </div>
            <small className="text-muted">ולא נמכרו</small>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card rounded-3 border p-3 h-100">
            <div className="d-flex align-items-center mb-1">
              <Wallet size={16} className="text-primary me-2" />
              <small className="text-muted">אפשר למכור</small>
            </div>
            <div className="fw-bold fs-5" dir="ltr">
              {formatCurrency(summary.holdableValueIls)}
            </div>
            <small className="text-muted">vested ולא נמכרו</small>
          </div>
        </div>
      </div>

      {/* RSU Holdings */}
      <RsuSection
        grants={grants}
        currentPrice={currentNvdaPriceUsd}
        usdToIls={usdToIls}
        expandedGrants={expandedGrants}
        onToggleGrant={toggleGrant}
        onAddGrant={() => openPanel("addRsuGrant")}
        onEditVest={(vest) => openPanel("editRsu", vest as unknown as Record<string, unknown>)}
      />

      {/* Add Panel */}
      {panelOpen && (
        <NvidiaAddPanel
          mode={panelMode}
          editData={panelEditData}
          onClose={() => setPanelOpen(false)}
        />
      )}
    </>
  );
}

// ── RSU Section ──

function RsuSection({
  grants,
  currentPrice,
  usdToIls,
  expandedGrants,
  onToggleGrant,
  onAddGrant,
  onEditVest,
}: {
  grants: RsuGrant[];
  currentPrice: number;
  usdToIls: number;
  expandedGrants: Set<string>;
  onToggleGrant: (date: string) => void;
  onAddGrant: () => void;
  onEditVest: (vest: RsuVest) => void;
}) {
  if (grants.length === 0) {
    return (
      <div className="text-center py-5">
        <Briefcase size={48} className="text-muted mb-3" />
        <h5 className="text-muted mb-2">עדיין אין מענקי RSU</h5>
        <button className="btn btn-success" onClick={onAddGrant}>
          <Plus size={16} className="me-1" />
          הוסף מענק RSU
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">מענקי RSU</h5>
        <button className="btn btn-success btn-sm" onClick={onAddGrant}>
          <Plus size={16} className="me-1" />
          מענק חדש
        </button>
      </div>

      {grants.map((grant) => {
        const isExpanded = expandedGrants.has(grant.grantDate);
        const progressPct = grant.totalShares > 0
          ? ((grant.vestedShares) / grant.totalShares) * 100
          : 0;
        const matured = isMatured(grant.grantDate);
        const matDate = getMaturationDate(grant.grantDate);

        return (
          <div key={grant.grantDate} className="card rounded-3 border mb-3">
            <div
              className="card-header d-flex align-items-center justify-content-between"
              style={{ cursor: "pointer" }}
              onClick={() => onToggleGrant(grant.grantDate)}
            >
              <div>
                <strong>{grant.grantName || `מענק ${grant.grantDate}`}</strong>
                <span className="text-muted ms-2">
                  {'·'} {grant.totalShares} מניות
                </span>
                {matured ? (
                  <span className="badge bg-success ms-2">הובשל!</span>
                ) : matDate ? (
                  <span className="badge bg-warning text-dark ms-2">
                    הבשלה: {formatSheetDate(matDate)}
                  </span>
                ) : null}
                {grant.vests[0]?.vestPriceUsd != null && (
                  <span className="text-muted ms-2" dir="ltr" style={{ fontSize: "0.85em" }}>
                    מחיר הענקה: {formatUsd(grant.vests[0].vestPriceUsd)}
                  </span>
                )}
              </div>
              <div className="d-flex align-items-center gap-3">
                <div style={{ width: 120 }}>
                  <div className="progress" style={{ height: 8 }}>
                    <div
                      className="progress-bar bg-success"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                  <small className="text-muted">
                    {grant.vestedShares}/{grant.totalShares} vested
                  </small>
                </div>
                {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
            </div>

            {isExpanded && (
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-sm table-hover mb-0 text-center">
                    <thead>
                      <tr>
                        <th>תאריך vesting</th>
                        <th>כמות</th>
                        <th>סטטוס</th>
                        <th>שווי נוכחי</th>
                        <th>פעולות</th>
                      </tr>
                    </thead>
                    <tbody>
                      {grant.vests.filter((vest) => vest.shares > 0).map((vest) => {
                        const currentValueIls = vest.shares * currentPrice * usdToIls;
                        const isSold = vest.sold;
                        const isVested = !isFutureDate(vest.vestDate);
                        const vestComingSoon = !isVested && isVestComingSoon(vest.vestDate);

                        return (
                          <tr key={vest.row} className={isSold ? "text-muted" : ""}>
                            <td>{vest.vestDate}</td>
                            <td>{vest.shares}</td>
                            <td>
                              {isSold ? (
                                <span className="badge bg-secondary">נמכר</span>
                              ) : isVested ? (
                                <span className="badge bg-success">vested</span>
                              ) : vestComingSoon ? (
                                <span className="badge" style={{ background: "#e9d5ff", color: "#6b21a8" }}>בקרוב</span>
                              ) : (
                                <span className="badge bg-warning text-dark">ממתין</span>
                              )}
                            </td>
                            <td dir="ltr">
                              {!isSold && formatCurrency(currentValueIls)}
                            </td>
                            <td>
                              <button
                                className={`btn btn-sm me-1 ${isSold ? "btn-outline-success" : "btn-outline-secondary"}`}
                                onClick={async () => {
                                  await toggleRsuSoldAction(vest.row, !isSold);
                                }}
                                title={isSold ? "סמן כלא נמכר" : "סמן כנמכר"}
                              >
                                <Tag size={12} />
                              </button>
                              <button
                                className="btn btn-outline-primary btn-sm me-1"
                                onClick={() => onEditVest(vest)}
                                title="ערוך"
                              >
                                <Pencil size={12} />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}
