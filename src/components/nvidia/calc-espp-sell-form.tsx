"use client";

import { useState, useMemo } from "react";
import { calcMarginalIncomeTax, calcYasafTax } from "@/lib/israeli-tax";
import {
  NI_AND_HEALTH_HIGH_RATE,
  NI_MAX_MONTHLY,
} from "@/lib/israeli-tax-config";
import type { useYearlyGross } from "@/hooks/use-yearly-gross";
import { TaxSummaryTable } from "./tax-summary-table";

type YearlyGrossState = ReturnType<typeof useYearlyGross>;

function withCommas(val: string): string {
  const raw = val.replace(/[^0-9]/g, "");
  if (!raw) return "";
  return parseInt(raw, 10).toLocaleString("en-US");
}

export function CalcEsppSellForm({
  editData,
  grossState,
}: {
  editData: Record<string, unknown>;
  grossState: YearlyGrossState;
}) {
  const currentNvdaPrice = editData.currentNvdaPriceUsd as number | undefined;
  const liveUsdRate = editData.usdToIls as number | undefined;

  const purchasePrice = grossState.esppPurchasePrice;
  const setPurchasePrice = grossState.setEsppPurchasePrice;
  const yearlyGross = grossState.yearlyGross;
  const esppContribution = grossState.esppContribution;

  const [sharesOverride, setSharesOverride] = useState<string | null>(null);
  const [sellPrice, setSellPrice] = useState(
    currentNvdaPrice ? String(currentNvdaPrice) : "",
  );

  const usdRate = liveUsdRate ?? 0;

  const defaultShares = useMemo(() => {
    const mc = parseFloat(esppContribution);
    const pp = parseFloat(purchasePrice);
    if (!mc || !pp || !usdRate) return "";
    return String(Math.floor((mc * 6) / (pp * usdRate)));
  }, [esppContribution, purchasePrice, usdRate]);

  const shares = sharesOverride ?? defaultShares;

  const result = useMemo(() => {
    const s = parseFloat(shares);
    const pp = parseFloat(purchasePrice);
    const sp = parseFloat(sellPrice);
    if (!s || !pp || !sp || !usdRate) return null;

    const proceeds = s * sp * usdRate;
    const cost = s * pp * usdRate;
    const gainIls = proceeds - cost;
    const incomeTax = calcMarginalIncomeTax(yearlyGross, gainIls);
    const niCeilingIls = NI_MAX_MONTHLY * 12;
    const niBase = Math.min(yearlyGross, niCeilingIls);
    const niAndHealth =
      Math.max(0, Math.min(gainIls, niCeilingIls - niBase)) *
      NI_AND_HEALTH_HIGH_RATE;
    const yasaf = calcYasafTax({
      baseTaxableIncome: yearlyGross,
      employmentIncome: gainIls,
      capitalIncome: 0,
    }).totalTax;
    const totalTax = incomeTax + niAndHealth + yasaf;
    return {
      proceeds,
      cost: parseFloat(esppContribution) * 6,
      incomeTax,
      niAndHealth,
      yasaf,
      totalTax,
      netIls: proceeds - totalTax,
    };
  }, [
    shares,
    purchasePrice,
    sellPrice,
    usdRate,
    yearlyGross,
    esppContribution,
  ]);

  return (
    <div>
      <div className="row mb-3">
        <div className="col">
          <label className="form-label small">הפרשה חודשית ESPP (₪)</label>
          <input
            type="text"
            inputMode="numeric"
            className="form-control"
            value={withCommas(grossState.esppContribution)}
            onChange={(e) =>
              grossState.setEsppContribution(e.target.value.replace(/,/g, ""))
            }
            placeholder="0"
          />
        </div>
        <div className="col">
          <label className="form-label small">
            מחיר רכישה ($) <span className="text-muted">(עם הנחה)</span>
          </label>
          <input
            type="number"
            step="0.01"
            className="form-control"
            value={purchasePrice}
            onChange={(e) => setPurchasePrice(e.target.value)}
          />
        </div>
      </div>
      <div className="mb-3">
        <label className="form-label small">כמות מניות</label>
        <input
          type="number"
          className="form-control"
          value={shares}
          onChange={(e) => setSharesOverride(e.target.value)}
          placeholder={defaultShares || ""}
        />
        {defaultShares && (
          <div className="form-text small">חושב מ-6 חודשי הפרשה</div>
        )}
      </div>
      <div className="mb-3">
        <label className="form-label small">מחיר מכירה ($)</label>
        <input
          type="number"
          step="0.01"
          className="form-control"
          value={sellPrice}
          onChange={(e) => setSellPrice(e.target.value)}
        />
        {currentNvdaPrice && (
          <div className="form-text small">
            מחיר נוכחי: ${currentNvdaPrice.toFixed(2)}
          </div>
        )}
      </div>

      {result && (
        <div className="border rounded p-3 bg-light">
          <h6 className="mb-3">תוצאות</h6>
          <TaxSummaryTable
            d={{
              proceeds: result.proceeds,
              proceedsLabel: "סכום מכירה",
              incomeTax: result.incomeTax,
              ni: result.niAndHealth,
              capGains: 0,
              yasaf: result.yasaf,
              tax: result.totalTax,
              net: result.netIls,
              cost: result.cost,
            }}
          />
        </div>
      )}
    </div>
  );
}
