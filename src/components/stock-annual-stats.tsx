"use client";

import type { PortfolioPeriodPerformance, PortfolioReturns } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

interface Props {
  returns: PortfolioReturns;
  ytdOverride: Pick<
    PortfolioPeriodPerformance,
    "profitLossILS" | "basisILS" | "returnPercent"
  >;
}

function PerformanceValue({
  performance,
}: {
  performance: PortfolioPeriodPerformance;
}) {
  if (performance.returnPercent === null) {
    return (
      <div className="text-center">
        <div className="small fw-medium text-muted">{performance.label}</div>
        <div className="small text-muted mt-1">אין מספיק נתונים</div>
        {performance.missingSymbols.length > 0 && (
          <div className="text-muted mt-1" style={{ fontSize: "0.7rem" }}>
            חסר מחיר: {performance.missingSymbols.join(", ")}
          </div>
        )}
      </div>
    );
  }

  const isPositive = (performance.profitLossILS ?? 0) >= 0;
  const color = isPositive ? "#198754" : "#dc3545";
  return (
    <div className="text-center">
      <div className="small fw-medium text-muted">{performance.label}</div>
      <div className="fw-bold fs-6 mt-1" style={{ color }} dir="ltr">
        {isPositive ? "+" : ""}
        {performance.returnPercent.toFixed(2)}%
      </div>
      <div className="small fw-semibold" style={{ color }} dir="ltr">
        {isPositive ? "+" : ""}
        {formatCurrency(performance.profitLossILS ?? 0)}
      </div>
    </div>
  );
}

export function StockAnnualStats({ returns, ytdOverride }: Props) {
  const periodsByLabel = new Map(
    returns.periods.map((period) => [
      period.label,
      period.label === "מתחילת השנה"
        ? {
            ...period,
            ...ytdOverride,
            missingSymbols:
              ytdOverride.returnPercent === null ? period.missingSymbols : [],
          }
        : period,
    ]),
  );
  const firstRow = ["7 ימים", "30 ימים", "90 ימים"]
    .map((label) => periodsByLabel.get(label))
    .filter((item): item is PortfolioPeriodPerformance => Boolean(item));
  const secondRow = ["מתחילת החודש", "מתחילת השנה"]
    .map((label) => periodsByLabel.get(label))
    .filter((item): item is PortfolioPeriodPerformance => Boolean(item));
  const currentYear = new Date().getFullYear();
  const currentYearPerformance = periodsByLabel.get("מתחילת השנה");
  const annual = [
    ...(currentYearPerformance
      ? [
          {
            ...currentYearPerformance,
            year: currentYear,
            isCurrentYear: true,
          },
        ]
      : []),
    ...returns.annual
      .filter((item) => item.year !== currentYear)
      .sort((a, b) => b.year - a.year)
      .map((item) => ({ ...item, isCurrentYear: false })),
  ];

  if (returns.periods.length === 0 && annual.length === 0) return null;

  return (
    <div className="card rounded-3 p-4">
      <h6 className="fw-bold mb-4 text-center">תשואות</h6>

      <div className="row g-0 mb-3">
        {firstRow.map((item) => (
          <div key={item.label} className="col border p-3">
            <PerformanceValue performance={item} />
          </div>
        ))}
      </div>

      <div className="row g-0 mb-4">
        {secondRow.map((item) => (
          <div key={item.label} className="col border p-3">
            <PerformanceValue performance={item} />
          </div>
        ))}
      </div>

      {annual.length > 0 && (
        <div>
          <h6 className="fw-bold mb-3">ביצועים שנתיים</h6>
          <div className="row g-2">
            {annual.map((item) => {
              const isPositive = (item.profitLossILS ?? 0) >= 0;
              const color = isPositive ? "#198754" : "#dc3545";
              return (
                <div key={item.year} className="col-12 col-md-4">
                  <div className="border rounded-3 p-2 h-100 stock-annual-card">
                    <div className="d-flex align-items-center justify-content-center gap-2 px-1">
                      <strong>{item.year}</strong>
                      {item.isCurrentYear && (
                        <span className="badge text-bg-secondary">בינתיים</span>
                      )}
                    </div>
                    {item.returnPercent === null ? (
                      <div className="border-top mt-2 pt-2">
                        <PerformanceValue performance={item} />
                      </div>
                    ) : (
                      <div className="row g-0 border-top mt-2 pt-2 text-center stock-annual-metrics">
                        <div className="col-4 px-1">
                          <div className="text-muted small">תשואה</div>
                          <strong
                            className="d-block"
                            style={{ color }}
                            dir="ltr"
                          >
                            {isPositive ? "+" : ""}
                            {item.returnPercent.toFixed(2)}%
                          </strong>
                        </div>
                        <div className="col-4 px-1 border-start border-end">
                          <div className="text-muted small">
                            כסף שהוכנס בשנה
                          </div>
                          <strong className="d-block" dir="ltr">
                            {formatCurrency(item.purchasesILS ?? 0)}
                          </strong>
                        </div>
                        <div className="col-4 px-1">
                          <div className="text-muted small">רווח/הפסד</div>
                          <strong
                            className="d-block"
                            style={{ color }}
                            dir="ltr"
                          >
                            {isPositive ? "+" : ""}
                            {formatCurrency(item.profitLossILS ?? 0)}
                          </strong>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
