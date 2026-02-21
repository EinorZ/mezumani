"use client";

import type { useYearlyGross } from "@/hooks/use-yearly-gross";

function withCommas(val: string): string {
  const raw = val.replace(/[^0-9]/g, "");
  if (!raw) return "";
  return parseInt(raw, 10).toLocaleString("en-US");
}

type YearlyGrossState = ReturnType<typeof useYearlyGross>;

export function YearlyGrossSection({
  earnedSoFar,
  setEarnedSoFar,
  monthlySalary,
  setMonthlySalary,
  yearlyGross,
  monthsRemaining,
}: Omit<YearlyGrossState, "esppContribution" | "setEsppContribution" | "esppPurchasePrice" | "setEsppPurchasePrice">) {
  return (
    <>
      <div className="row mb-3">
        <div className="col">
          <label className="form-label small">ברוטו עד כה (₪)</label>
          <input
            type="text"
            inputMode="numeric"
            className="form-control"
            value={withCommas(earnedSoFar)}
            onChange={(e) => setEarnedSoFar(e.target.value.replace(/,/g, ""))}
            placeholder="0"
          />
        </div>
        <div className="col">
          <label className="form-label small">משכורת חודשית (₪)</label>
          <input
            type="text"
            inputMode="numeric"
            className="form-control"
            value={withCommas(monthlySalary)}
            onChange={(e) => setMonthlySalary(e.target.value.replace(/,/g, ""))}
            placeholder="0"
          />
        </div>
      </div>
      <div className="mb-3">
        <label className="form-label small">ברוטו לסימולציה (₪)</label>
        <input
          type="text"
          className="form-control bg-light"
          value={yearlyGross ? yearlyGross.toLocaleString("en-US") : ""}
          readOnly
        />
        <div className="form-text small">
          עד כה + {monthsRemaining} חודשים × משכורת
        </div>
      </div>
    </>
  );
}
