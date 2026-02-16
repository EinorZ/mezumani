"use client";

import type { PortfolioReturns } from "@/lib/types";

interface Props {
  returns: PortfolioReturns;
}

function ReturnCell({ value, label }: { value: number | null; label: string }) {
  if (value === null) return null;
  const isPositive = value >= 0;
  return (
    <div className="text-center">
      <div className="small fw-medium text-muted">{label}</div>
      <div
        className="fw-bold fs-6"
        style={{ color: isPositive ? "#198754" : "#dc3545" }}
        dir="ltr"
      >
        {value.toFixed(2)}%
      </div>
    </div>
  );
}

export function StockAnnualStats({ returns }: Props) {
  const { daily, mtd, ytd, periods, annual } = returns;
  const hasTopRow = daily !== null || mtd !== null || ytd !== null;
  const hasAnnual = annual.length > 0;
  const hasPeriods = periods.some((p) => p.returnPercent !== null);

  if (!hasTopRow && !hasAnnual && !hasPeriods) return null;

  // Annual: most recent on top, rows of 3
  const sortedAnnual = [...annual].sort((a, b) => b.year - a.year);

  // Build annual rows of up to 3 items each
  const annualRows: { year: number; returnPercent: number | null }[][] = [];
  for (let i = 0; i < sortedAnnual.length; i += 3) {
    annualRows.push(sortedAnnual.slice(i, i + 3));
  }

  // Period rows: first 4 in a row, next 4 in a row
  const periodRow1 = periods.slice(0, 4).filter((p) => p.returnPercent !== null);
  const periodRow2 = periods.slice(4).filter((p) => p.returnPercent !== null);

  return (
    <div className="card rounded-3 p-4">
      <h6 className="fw-bold mb-4 text-center">תשואות</h6>

      {/* Top row: Daily / MTD / YTD */}
      {hasTopRow && (
        <div className="row g-0 mb-4">
          {[
            { label: "מתחילת השנה", value: ytd },
            { label: "מתחילת החודש", value: mtd },
            { label: "יומית", value: daily },
          ]
            .filter((item) => item.value !== null)
            .map((item) => (
              <div key={item.label} className="col border p-2">
                <ReturnCell value={item.value} label={item.label} />
              </div>
            ))}
        </div>
      )}

      {/* Annual returns grid */}
      {hasAnnual && (
        <div className="mb-4">
          {annualRows.map((row, ri) => (
            <div key={ri} className="row g-0">
              {row.map((item) => (
                <div
                  key={item.year}
                  className="col border p-2"
                >
                  <ReturnCell
                    value={item.returnPercent}
                    label={`שנתית ${item.year}`}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Period returns grid */}
      {hasPeriods && (
        <div>
          {periodRow1.length > 0 && (
            <div className="row g-0">
              {periodRow1.map((item) => (
                <div key={item.label} className="col border p-2">
                  <ReturnCell value={item.returnPercent} label={item.label} />
                </div>
              ))}
            </div>
          )}
          {periodRow2.length > 0 && (
            <div className="row g-0">
              {periodRow2.map((item) => (
                <div key={item.label} className="col border p-2">
                  <ReturnCell value={item.returnPercent} label={item.label} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
