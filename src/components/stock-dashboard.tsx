"use client";

import { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  RefreshCw,
  BarChart3,
  Target,
  Wallet,
  Plus,
  PieChart as PieChartIcon,
  LayoutGrid,
} from "lucide-react";
import { formatCurrency, formatCurrencyCompact } from "@/lib/utils";
import type {
  StockDashboardData,
  StockConfig,
  InvestmentTerm,
  PortfolioHistoryPoint,
  ChartRange,
  PortfolioReturns,
} from "@/lib/types";

import { TERM_LABELS } from "@/lib/constants";
import { StockHoldingsTable } from "@/components/stock-holdings-table";
import { StockPieChart, type ChartMode } from "@/components/stock-pie-chart";
import { LabelAllocationChart } from "@/components/label-allocation-chart";
import { StockAddPanel } from "@/components/stock-add-panel";
import { RebalanceCalculator } from "@/components/rebalance-calculator";
import { PortfolioChart } from "@/components/portfolio-chart";
import { StockAnnualStats } from "@/components/stock-annual-stats";
import { ChevronDown, ChevronUp } from "lucide-react";
import { usePageRefresh } from "@/hooks/use-page-refresh";
import { usePortfolioPerformance } from "@/hooks/use-portfolio-performance";
import { computeViewYtd } from "@/lib/stock-utils";

interface Props {
  data: StockDashboardData;
  config: StockConfig;
  initialChartData?: PortfolioHistoryPoint[];
  initialChartRange?: ChartRange;
  portfolioReturns?: PortfolioReturns;
}

export function StockDashboard({ data, config, initialChartData, initialChartRange = "YTD", portfolioReturns }: Props) {
  const labelMap = Object.fromEntries(
    config.stocks.filter((s) => s.label).map((s) => [s.symbol, s.label]),
  );
  const labelColorMap = Object.fromEntries(
    config.labelAllocations.filter((a) => a.color).map((a) => [a.label, a.color!]),
  );
  // Only show tabs for terms that have goals defined in settings
  const goalTerms = [...new Set(config.goals.map((g) => g.term))];
  const [panelOpen, setPanelOpen] = useState(false);
  const [panelDefaults, setPanelDefaults] = useState<{
    symbol?: string;
    type?: "קניה" | "מכירה";
  }>({});
  const [viewTerm, setViewTerm] = useState<InvestmentTerm | "all">("all");
  const [chartMode, setChartMode] = useState<ChartMode>("donut");

  // Collapsible performance section
  const [perfOpen, setPerfOpen] = useState(false);
  const { refreshing, handleRefresh } = usePageRefresh("/stocks");
  const {
    chartData: perfChartData,
    returns: perfReturns,
    loading: perfLoading,
    rangeRef: perfChartRange,
  } = usePortfolioPerformance({
    initialChartData: initialChartData ?? null,
    initialRange: initialChartRange,
    initialReturns: portfolioReturns ?? null,
    term: viewTerm,
    enabled: perfOpen,
  });

  const { totals, usdToIls, lastUpdated } = data;
  const isPositive = totals.totalProfitLoss >= 0;

  function openPanel(defaults?: { symbol?: string; type?: "קניה" | "מכירה" }) {
    setPanelDefaults(defaults ?? {});
    setPanelOpen(true);
  }

  const lastUpdatedDate = new Date(lastUpdated);
  const minutesAgo = Math.floor(
    (Date.now() - lastUpdatedDate.getTime()) / 60000,
  );

  // Empty state
  if (data.holdings.length === 0) {
    return (
      <>
        <div className="page-header mb-4">
          <h1 className="h4 fw-bold mb-0">תיק מניות</h1>
        </div>
        <div className="text-center py-5">
          <BarChart3 size={48} className="text-muted mb-3" />
          <h5 className="text-muted mb-2">עדיין אין עסקאות מניות</h5>
          <p className="text-muted small mb-3">
            הגדר מניות בהגדרות והוסף את הרכישה הראשונה
          </p>
          <button className="btn btn-success" onClick={() => openPanel()}>
            <Plus size={16} className="me-1" />
            הוסף עסקה ראשונה
          </button>
        </div>
        {panelOpen && (
          <StockAddPanel
            config={config}
            defaults={panelDefaults}
            onClose={() => setPanelOpen(false)}
          />
        )}
      </>
    );
  }

  // Compute term-specific totals for the active view
  const activeTermGroup =
    viewTerm !== "all" ? data.byTerm.find((t) => t.term === viewTerm) : null;
  const viewTotals =
    viewTerm === "all" || !activeTermGroup
      ? totals
      : {
          totalValueILS: activeTermGroup.totalValueILS,
          totalInvestedILS: activeTermGroup.totalInvestedILS,
          totalProfitLoss: activeTermGroup.profitLoss,
          totalProfitLossPercent: activeTermGroup.profitLossPercent,
          totalFees: activeTermGroup.totalFees,
          estimatedCapitalGainsTax: 0,
          ytdChangePercent: null,
        };
  const viewHoldings =
    viewTerm === "all"
      ? data.holdings
      : data.holdings.filter((h) => h.term === viewTerm);
  const viewIsPositive = viewTotals.totalProfitLoss >= 0;

  // Compute YTD for the active view using shared utility
  const { ytdProfitLossILS: viewYtdProfitLossILS, ytdDisplay: viewYtdDisplay } =
    computeViewYtd(viewHoldings, viewTerm, viewTotals);
  const viewYtdPositive = viewYtdProfitLossILS >= 0;

  return (
    <>
      {/* Page header with total worth */}
      <div className="page-header mb-5 pt-4">
        <div className="d-flex justify-content-between align-items-center">
          {/* Title - left side */}
          <h1 className="h3 fw-bold mb-0">תיק מניות</h1>

          {/* Numbers - center */}
          <div className="d-flex align-items-baseline gap-3 flex-wrap justify-content-center">
            <span className="h3 fw-bold mb-0 text-success">
              {formatCurrency(totals.totalValueILS)}
            </span>
            <span
              className="fw-medium"
              style={{ color: isPositive ? "#198754" : "#dc3545" }}
              dir="ltr"
            >
              {isPositive ? "+" : ""}
              {formatCurrency(totals.totalProfitLoss)} ({isPositive ? "+" : ""}
              {totals.totalProfitLossPercent.toFixed(2)}%)
            </span>
          </div>

          {/* Refresh button - right side */}
          <button
            className="btn btn-sm btn-outline-secondary p-1"
            onClick={handleRefresh}
            disabled={refreshing}
            title="רענן מחירים"
          >
            <RefreshCw size={14} className={refreshing ? "spin" : ""} />
          </button>
        </div>
        <div className="small text-muted mt-2">
          <span dir="ltr">USD/ILS: {usdToIls.toFixed(2)}</span>
          <span className="ms-3">
            עודכן לפני {minutesAgo < 1 ? "פחות מדקה" : `${minutesAgo} דקות`}
          </span>
        </div>
      </div>

      {/* Term tabs */}
      <div className="d-flex gap-2 mb-4 flex-wrap">
        <button
          className={`btn btn-sm rounded-pill ${viewTerm === "all" ? "btn-dark" : "btn-outline-secondary"}`}
          onClick={() => setViewTerm("all")}
        >
          הכל
        </button>
        {goalTerms.map((term) => (
          <button
            key={term}
            className={`btn btn-sm rounded-pill ${viewTerm === term ? "btn-dark" : "btn-outline-secondary"}`}
            onClick={() => setViewTerm(term)}
          >
            {TERM_LABELS[term]}
          </button>
        ))}
      </div>

      {/* Summary cards for active view */}
      <div className="row g-3 mb-3">
        <div className="col">
          <div
            className="card rounded-3 p-3 h-100"
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "#fff",
            }}
          >
            <div className="d-flex align-items-center gap-2 mb-2">
              <span className="summary-card-icon">
                <Wallet size={18} />
              </span>
              <span className="small opacity-75">שווי</span>
            </div>
            <div className="h5 fw-bold mb-0 text-center">
              {formatCurrency(viewTotals.totalValueILS)}
            </div>
          </div>
        </div>
        <div className="col">
          <div
            className={`card ${viewIsPositive ? "card-green-gradient" : "card-red-gradient"} rounded-3 p-3 h-100`}
          >
            <div className="d-flex align-items-center gap-2 mb-2">
              <span className="summary-card-icon">
                {viewIsPositive ? (
                  <TrendingUp size={18} />
                ) : (
                  <TrendingDown size={18} />
                )}
              </span>
              <span className="small opacity-75">רווח/הפסד</span>
            </div>
            <div className="h5 fw-bold mb-0 text-center" dir="ltr">
              {viewIsPositive ? "+" : ""}
              {formatCurrency(viewTotals.totalProfitLoss)}
            </div>
            <div
              className="text-center opacity-75 mt-1"
              dir="ltr"
              style={{ fontSize: "0.9rem" }}
            >
              ({viewIsPositive ? "+" : ""}
              {viewTotals.totalProfitLossPercent.toFixed(2)}%)
            </div>
            {viewTotals.totalFees > 0 && (
              <div className="small text-center opacity-75 mt-1">
                כולל {formatCurrency(viewTotals.totalFees)} עמלות ומסים
              </div>
            )}
          </div>
        </div>
        {viewYtdDisplay !== null && (
          <div className="col">
            <div
              className={`card ${viewYtdPositive ? "card-teal-gradient" : "card-red-gradient"} rounded-3 p-3 h-100`}
            >
              <div className="d-flex align-items-center gap-2 mb-2">
                <span className="summary-card-icon">
                  {viewYtdPositive ? (
                    <TrendingUp size={18} />
                  ) : (
                    <TrendingDown size={18} />
                  )}
                </span>
                <span className="small opacity-75">YTD</span>
              </div>
              <div className="h5 fw-bold mb-0 text-center" dir="ltr">
                {viewYtdProfitLossILS >= 0 ? "+" : ""}
                {formatCurrency(viewYtdProfitLossILS)}
              </div>
              <div
                className="text-center opacity-75 mt-1"
                dir="ltr"
                style={{ fontSize: "0.9rem" }}
              >
                ({viewYtdPositive ? "+" : ""}
                {(viewYtdDisplay ?? 0).toFixed(2)}%)
              </div>
            </div>
          </div>
        )}
        {(() => {
          if (viewTerm === "all") return null;
          const viewGoals = config.goals.filter((g) => g.term === viewTerm);
          const goalTarget = viewGoals.reduce((s, g) => s + g.targetAmount, 0);
          if (goalTarget <= 0) return null;
          const goalProgress = Math.min(
            100,
            (viewTotals.totalValueILS / goalTarget) * 100,
          );

          return (
            <div className="col">
              <div className="card card-blue-gradient rounded-3 p-3 h-100">
                <div className="d-flex align-items-center gap-2 mb-2">
                  <span className="summary-card-icon">
                    <Target size={18} />
                  </span>
                  <span className="small opacity-75">יעד</span>
                </div>
                <div className="h5 fw-bold mb-0 text-center">
                  {formatCurrencyCompact(viewTotals.totalValueILS)}
                  <span className="opacity-75" style={{ fontSize: "1.1rem" }}>
                    {" "}
                    / {formatCurrencyCompact(goalTarget)}
                  </span>
                </div>
                <div
                  className="text-center opacity-75 mt-1"
                  style={{ fontSize: "0.9rem" }}
                >
                  ({goalProgress.toFixed(0)}%)
                </div>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Rebalance calculator (ארוך view only) */}
      {viewTerm === "ארוך" && (
        <RebalanceCalculator holdings={data.holdings} config={config} />
      )}

      {/* Chart mode toggle + Charts */}
      <div className="d-flex justify-content-end mb-2">
        <div className="btn-group btn-group-sm" role="group">
          {([
            { mode: "donut" as ChartMode, icon: PieChartIcon, label: "דונאט" },
            { mode: "treemap" as ChartMode, icon: LayoutGrid, label: "מפה" },
          ]).map(({ mode, icon: Icon, label }) => (
            <button
              key={mode}
              className={`btn ${chartMode === mode ? "btn-dark" : "btn-outline-secondary"}`}
              onClick={() => setChartMode(mode)}
              title={label}
            >
              <Icon size={14} />
            </button>
          ))}
        </div>
      </div>
      <div className="row g-3 mb-4">
        <div className="col-12 col-lg-6">
          <StockPieChart holdings={viewHoldings} labelColorMap={labelColorMap} chartMode={chartMode} />
        </div>
        <div className="col-12 col-lg-6">
          <LabelAllocationChart holdings={viewHoldings} labelMap={labelMap} labelColorMap={labelColorMap} chartMode={chartMode} />
        </div>
      </div>

      {/* Holdings table */}
      <StockHoldingsTable
        holdings={viewHoldings}
        onAddTransaction={() => openPanel()}
      />

      {/* Collapsible performance section */}
      {(initialChartData || portfolioReturns) && (
        <div className="card rounded-3 border mt-4 overflow-hidden">
          <div
            className="d-flex align-items-center justify-content-between px-3 py-3 border-bottom"
            style={{ cursor: "pointer" }}
            onClick={() => setPerfOpen((v) => !v)}
          >
            <span className="fw-bold" style={{ fontSize: "0.9rem" }}>
              ביצועי תיק
            </span>
            <div className="d-flex align-items-center gap-2">
              {perfLoading && <span className="spinner-border spinner-border-sm text-muted" style={{ width: 14, height: 14, borderWidth: 2 }} />}
              {perfOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>
          </div>
          {perfOpen && (
            <div className="p-3">
              {perfChartData.length > 0 && (
                <PortfolioChart
                  key={viewTerm}
                  initialData={perfChartData}
                  initialRange={perfChartRange.current}
                  term={viewTerm === "all" ? undefined : viewTerm}
                />
              )}
              {perfReturns && <StockAnnualStats returns={perfReturns} />}
              {!perfLoading && perfChartData.length === 0 && !perfReturns && (
                <div className="text-center text-muted small py-3">אין נתונים להצגה</div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Slide-out panel */}
      {panelOpen && (
        <StockAddPanel
          config={config}
          defaults={panelDefaults}
          onClose={() => setPanelOpen(false)}
        />
      )}

      <style>{`
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </>
  );
}
