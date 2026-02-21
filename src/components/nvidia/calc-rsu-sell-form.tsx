"use client";

import { useState, useMemo } from "react";
import { calcRsuNet } from "@/lib/israeli-tax";
import { MATURATION_MONTHS } from "@/lib/israeli-tax-config";
import { formatCurrency } from "@/lib/utils";
import { toSheetDate, isFutureDate, isMatured, isVestComingSoon } from "@/lib/nvidia-utils";
import { useYearlyGross } from "@/hooks/use-yearly-gross";
import type { RsuGrant } from "@/lib/types";
import { YearlyGrossSection } from "./yearly-gross-section";
import { TaxSummaryTable, type TaxBreakdown } from "./tax-summary-table";

function getTodayStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function CalcRsuSellForm({
  editData,
}: {
  editData: Record<string, unknown>;
}) {
  const defaultPrice = editData.currentNvdaPriceUsd as number | undefined;
  const defaultRate = editData.usdToIls as number | undefined;
  const grants = (editData.grants ?? []) as RsuGrant[];

  const availableVests = useMemo(() => {
    function isGrantMaturationComingSoon(grantDate: string): boolean {
      const parts = grantDate.split("/");
      if (parts.length < 3) return false;
      let y = parseInt(parts[2], 10);
      if (y < 100) y += 2000;
      const matDate = new Date(
        y,
        parseInt(parts[1], 10) - 1,
        parseInt(parts[0], 10),
      );
      matDate.setMonth(matDate.getMonth() + MATURATION_MONTHS);
      const now = new Date();
      const oneMonthFromNow = new Date(now);
      oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);
      return matDate > now && matDate <= oneMonthFromNow;
    }

    const vests = grants.flatMap((g) =>
      g.vests
        .filter((v) => !v.sold && v.shares > 0)
        .map((v) => {
          const future = isFutureDate(v.vestDate);
          const matured = !future && isMatured(v.grantDate);
          const comingSoon =
            !future && !matured && isGrantMaturationComingSoon(v.grantDate);
          const vestComingSoon = future && isVestComingSoon(v.vestDate);
          return {
            ...v,
            grantName: g.grantName || v.grantDate,
            future,
            matured,
            comingSoon,
            vestComingSoon,
          };
        }),
    );

    return [
      ...vests.filter((v) => !v.future && v.matured),
      ...vests.filter((v) => !v.future && !v.matured && !v.comingSoon),
      ...vests.filter(
        (v) =>
          (!v.future && !v.matured && v.comingSoon) || v.vestComingSoon,
      ),
      ...vests.filter((v) => v.future && !v.vestComingSoon),
    ];
  }, [grants]);

  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [sellPrice, setSellPrice] = useState(
    defaultPrice ? String(defaultPrice) : "",
  );
  const usdRate = String(defaultRate ?? "");
  const grossState = useYearlyGross(
    (editData.grossSoFar as number) ?? 0,
    (editData.monthlySalary as number) ?? 0,
    (editData.esppMonthlyContribution as number) ?? 0,
    0,
  );
  const sellDate = getTodayStr();

  function toggleRow(row: number) {
    setSelectedRows((prev) => {
      const next = new Set(prev);
      next.has(row) ? next.delete(row) : next.add(row);
      return next;
    });
  }

  function toggleAll() {
    if (selectedRows.size === availableVests.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(availableVests.map((v) => v.row)));
    }
  }

  const selectedVests = availableVests.filter((v) => selectedRows.has(v.row));

  const result = useMemo(() => {
    const sp = parseFloat(sellPrice);
    const rate = parseFloat(usdRate);
    if (!sp || !rate || selectedVests.length === 0) return null;

    type Agg = {
      proceeds: number;
      incomeTax: number;
      ni: number;
      healthTax: number;
      capGains: number;
      yasaf: number;
      tax: number;
      net: number;
    };
    const zero = (): Agg => ({
      proceeds: 0,
      incomeTax: 0,
      ni: 0,
      healthTax: 0,
      capGains: 0,
      yasaf: 0,
      tax: 0,
      net: 0,
    });
    const maturedAgg = zero();
    const unmaturedAgg = zero();

    for (const vest of selectedVests) {
      const vestPrice = vest.vestPriceUsd ?? sp;
      const r = calcRsuNet({
        shares: vest.shares,
        vestPriceUsd: vestPrice,
        usdRate: rate,
        feesIls: 0,
        yearlyGross: grossState.yearlyGross,
        sellPriceUsd: sp,
        grantDate: vest.matured ? vest.grantDate : undefined,
        sellDate: vest.matured ? toSheetDate(sellDate) : undefined,
      });
      const agg = vest.matured ? maturedAgg : unmaturedAgg;
      agg.proceeds += vest.shares * sp * rate;
      agg.incomeTax += r.incomeTax;
      agg.ni += r.nationalInsurance;
      agg.healthTax += r.healthTax;
      agg.capGains += r.capitalGainsTax;
      agg.yasaf += r.yasafTax;
      agg.tax += r.totalTax;
      agg.net += r.netIls;
    }

    const anyMatured = maturedAgg.proceeds > 0;
    const anyUnmatured = unmaturedAgg.proceeds > 0;
    const combined = {
      proceeds: maturedAgg.proceeds + unmaturedAgg.proceeds,
      incomeTax: maturedAgg.incomeTax + unmaturedAgg.incomeTax,
      ni: maturedAgg.ni + unmaturedAgg.ni,
      healthTax: maturedAgg.healthTax + unmaturedAgg.healthTax,
      capGains: maturedAgg.capGains + unmaturedAgg.capGains,
      yasaf: maturedAgg.yasaf + unmaturedAgg.yasaf,
      tax: maturedAgg.tax + unmaturedAgg.tax,
      net: maturedAgg.net + unmaturedAgg.net,
    };

    let latestMatDate: Date | null = null;
    for (const vest of selectedVests) {
      if (!vest.matured) {
        const parts = vest.grantDate.split("/");
        if (parts.length >= 3) {
          let y = parseInt(parts[2], 10);
          if (y < 100) y += 2000;
          const g = new Date(
            y,
            parseInt(parts[1], 10) - 1,
            parseInt(parts[0], 10),
          );
          g.setMonth(g.getMonth() + MATURATION_MONTHS);
          if (!latestMatDate || g > latestMatDate) latestMatDate = g;
        }
      }
    }

    let waitScenario: {
      agg: Agg;
      date: string;
      dateDisplay: string;
    } | null = null;
    if (latestMatDate) {
      const dd = String(latestMatDate.getDate()).padStart(2, "0");
      const mm = String(latestMatDate.getMonth() + 1).padStart(2, "0");
      const yy = String(latestMatDate.getFullYear()).slice(2);
      const yyyy = String(latestMatDate.getFullYear());
      const waitSellDate = `${dd}/${mm}/${yy}`;
      const dateDisplay = `${dd}/${mm}/${yyyy}`;
      const waitAgg = zero();
      for (const vest of selectedVests) {
        const vestPrice = vest.vestPriceUsd ?? sp;
        const r = calcRsuNet({
          shares: vest.shares,
          vestPriceUsd: vestPrice,
          usdRate: rate,
          feesIls: 0,
          yearlyGross: grossState.yearlyGross,
          sellPriceUsd: sp,
          grantDate: vest.grantDate,
          sellDate: waitSellDate,
        });
        waitAgg.proceeds += vest.shares * sp * rate;
        waitAgg.incomeTax += r.incomeTax;
        waitAgg.ni += r.nationalInsurance;
        waitAgg.healthTax += r.healthTax;
        waitAgg.capGains += r.capitalGainsTax;
        waitAgg.yasaf += r.yasafTax;
        waitAgg.tax += r.totalTax;
        waitAgg.net += r.netIls;
      }
      waitScenario = { agg: waitAgg, date: waitSellDate, dateDisplay };
    }

    return {
      maturedAgg,
      unmaturedAgg,
      combined,
      anyMatured,
      anyUnmatured,
      waitScenario,
    };
  }, [selectedVests, sellPrice, usdRate, grossState.yearlyGross, sellDate]); // eslint-disable-line react-hooks/exhaustive-deps

  const toBreakdown = (a: {
    proceeds: number;
    incomeTax: number;
    ni: number;
    healthTax: number;
    capGains: number;
    yasaf: number;
    tax: number;
    net: number;
  }): TaxBreakdown => ({
    proceeds: a.proceeds,
    incomeTax: a.incomeTax,
    ni: a.ni + a.healthTax,
    capGains: a.capGains,
    yasaf: a.yasaf,
    tax: a.tax,
    net: a.net,
  });

  return (
    <div>
      <YearlyGrossSection {...grossState} />
      <hr />

      {availableVests.length > 0 ? (
        <div className="mb-3">
          <div className="d-flex justify-content-between align-items-center mb-1">
            <label className="form-label small mb-0">בחר vests למכירה</label>
            <button
              type="button"
              className="btn btn-link btn-sm p-0 small"
              onClick={toggleAll}
            >
              {selectedRows.size === availableVests.length
                ? "בטל הכל"
                : "בחר הכל"}
            </button>
          </div>
          <div
            className="border rounded"
            style={{ maxHeight: 220, overflowY: "auto" }}
          >
            <table
              className="table table-sm mb-0"
              style={{ fontSize: "0.82rem" }}
            >
              <tbody>
                {availableVests.map((v) => (
                  <tr
                    key={v.row}
                    onClick={() => toggleRow(v.row)}
                    style={
                      {
                        cursor: "pointer",
                        "--bs-table-bg": selectedRows.has(v.row)
                          ? v.matured
                            ? "#a7f3d0"
                            : "#e8f0fe"
                          : "transparent",
                      } as React.CSSProperties
                    }
                  >
                    <td style={{ width: 32 }}>
                      <input
                        type="checkbox"
                        className="form-check-input"
                        checked={selectedRows.has(v.row)}
                        readOnly
                      />
                    </td>
                    <td>
                      <span
                        className={
                          v.matured
                            ? "text-success fw-medium"
                            : v.future
                              ? "text-danger"
                              : "text-warning-emphasis"
                        }
                      >
                        {v.vestDate}
                      </span>
                      {v.matured && (
                        <span
                          className="badge ms-1 fw-normal"
                          style={{
                            background: "#bbf7d0",
                            color: "#166534",
                            fontSize: "0.68rem",
                          }}
                        >
                          הבשיל ✓
                        </span>
                      )}
                      {v.comingSoon && (
                        <span
                          className="badge ms-1 fw-normal"
                          style={{
                            background: "#e9d5ff",
                            color: "#6b21a8",
                            fontSize: "0.68rem",
                          }}
                        >
                          מבשיל בקרוב
                        </span>
                      )}
                      {!v.matured && !v.comingSoon && !v.future && (
                        <span
                          className="badge ms-1 fw-normal"
                          style={{
                            background: "#fef08a",
                            color: "#854d0e",
                            fontSize: "0.68rem",
                          }}
                        >
                          לא הבשיל
                        </span>
                      )}
                      {v.future && v.vestComingSoon && (
                        <span
                          className="badge ms-1 fw-normal"
                          style={{
                            background: "#e9d5ff",
                            color: "#6b21a8",
                            fontSize: "0.68rem",
                          }}
                        >
                          בקרוב
                        </span>
                      )}
                      {v.future && !v.vestComingSoon && (
                        <span
                          className="badge ms-1 fw-normal"
                          style={{
                            background: "#fecaca",
                            color: "#991b1b",
                            fontSize: "0.68rem",
                          }}
                        >
                          לא שלך
                        </span>
                      )}
                    </td>
                    <td
                      className={
                        v.matured
                          ? "text-success"
                          : v.future
                            ? "text-danger"
                            : undefined
                      }
                    >
                      {v.grantName}
                    </td>
                    <td
                      className={`text-end ${v.matured ? "text-success fw-medium" : v.future ? "text-danger" : ""}`}
                    >
                      {v.shares}
                    </td>
                    <td className="text-muted text-end">
                      {v.vestPriceUsd ? `$${v.vestPriceUsd}` : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {selectedVests.length > 0 && (
            <div className="small text-muted mt-1">
              {selectedVests.length} vests ·{" "}
              {selectedVests
                .reduce((s, v) => s + v.shares, 0)
                .toLocaleString()}{" "}
              מניות
            </div>
          )}
        </div>
      ) : (
        <div className="alert alert-info py-2 small mb-3">
          אין vests זמינים למכירה
        </div>
      )}

      <div className="mb-3">
        <label className="form-label small">מחיר מכירה ($)</label>
        <input
          type="number"
          step="0.01"
          className="form-control"
          value={sellPrice}
          onChange={(e) => setSellPrice(e.target.value)}
        />
        {defaultPrice && (
          <div className="form-text small">
            מחיר נוכחי: ${defaultPrice.toFixed(2)}
          </div>
        )}
      </div>

      {result && (
        <div>
          <div className="border rounded p-3 bg-light mb-3">
            <h6 className="mb-2 d-flex align-items-center gap-2">
              מכור עכשיו
              {result.anyMatured && result.anyUnmatured && (
                <span
                  className="badge fw-normal small"
                  style={{
                    background: "#e5e7eb",
                    color: "#374151",
                    fontSize: "0.7rem",
                  }}
                >
                  מעורב
                </span>
              )}
            </h6>
            {result.anyMatured && result.anyUnmatured ? (
              <>
                <div className="row g-2 mb-2">
                  <div className="col-6">
                    <div
                      className="border rounded p-2"
                      style={{ background: "#f0fdf4" }}
                    >
                      <div
                        className="fw-semibold text-success mb-1 text-center"
                        style={{ fontSize: "0.75rem" }}
                      >
                        הבשילו (102)
                      </div>
                      <TaxSummaryTable
                        d={toBreakdown(result.maturedAgg)}
                        fontSize="0.78rem"
                      />
                    </div>
                  </div>
                  <div className="col-6">
                    <div
                      className="border rounded p-2"
                      style={{ background: "#fffbeb" }}
                    >
                      <div
                        className="fw-semibold mb-1 text-center"
                        style={{ fontSize: "0.75rem", color: "#92400e" }}
                      >
                        טרם הבשלה
                      </div>
                      <TaxSummaryTable
                        d={toBreakdown(result.unmaturedAgg)}
                        fontSize="0.78rem"
                      />
                    </div>
                  </div>
                </div>
                <div className="border-top pt-2">
                  <table
                    className="table table-sm mb-0"
                    style={{ fontSize: "0.85rem" }}
                  >
                    <tbody>
                      <tr className="fw-bold">
                        <td>סה״כ נטו</td>
                        <td dir="ltr" className="text-success">
                          {formatCurrency(result.combined.net)}
                        </td>
                      </tr>
                      <tr>
                        <td className="text-muted">סה״כ מס</td>
                        <td dir="ltr" className="text-danger">
                          {formatCurrency(result.combined.tax)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <TaxSummaryTable d={toBreakdown(result.combined)} />
            )}
          </div>

          {result.waitScenario && (
            <div
              className="border rounded p-3"
              style={{ background: "#f0fdf4" }}
            >
              <h6 className="mb-2 text-success d-flex align-items-center gap-2">
                המתן להבשלה
                <span
                  className="badge fw-normal"
                  style={{
                    background: "#dcfce7",
                    color: "#166534",
                    fontSize: "0.72rem",
                  }}
                >
                  מ־{result.waitScenario.dateDisplay}
                </span>
              </h6>
              <TaxSummaryTable d={toBreakdown(result.waitScenario.agg)} />
              {result.waitScenario.agg.net > result.combined.net && (
                <div className="mt-2 pt-2 border-top small fw-semibold text-success">
                  חיסכון בהמתנה:{" "}
                  <span dir="ltr">
                    {formatCurrency(
                      result.waitScenario.agg.net - result.combined.net,
                    )}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
