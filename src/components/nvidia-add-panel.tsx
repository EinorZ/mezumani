"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { X } from "lucide-react";
import {
  addRsuGrantAction,
  updateRsuVestAction,
  setRsuGrossDataAction,
} from "@/lib/actions";
import { calcRsuNet, calcMarginalIncomeTax } from "@/lib/israeli-tax";
import { NI_AND_HEALTH_HIGH_RATE, NI_MAX_MONTHLY, YASAF_RATE, YASAF_THRESHOLD, MATURATION_MONTHS } from "@/lib/israeli-tax-config";
import { formatCurrency } from "@/lib/utils";

export type NvidiaPanelMode =
  | "addRsuGrant"
  | "editRsu"
  | "calcRsuSell"
  | "calcEsppSell";

interface Props {
  mode: NvidiaPanelMode;
  editData?: Record<string, unknown>;
  onClose: () => void;
}

function getTodayStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function toSheetDate(isoDate: string): string {
  const [y, m, d] = isoDate.split("-");
  return `${d}/${m}/${y.slice(2)}`;
}

function fromSheetDate(sheetDate: string): string {
  if (!sheetDate) return "";
  const parts = sheetDate.split("/");
  if (parts.length < 3) return "";
  const d = parts[0].padStart(2, "0");
  const m = parts[1].padStart(2, "0");
  let y = parts[2];
  if (y.length === 2) y = "20" + y;
  return `${y}-${m}-${d}`;
}

const PANEL_TITLES: Record<NvidiaPanelMode, string> = {
  addRsuGrant: "הוסף מענק RSU",
  editRsu: "ערוך שורת RSU",
  calcRsuSell: "מחשבון מכירת RSU",
  calcEsppSell: "מחשבון מכירת ESPP",
};

const CALC_MODES: NvidiaPanelMode[] = ["calcRsuSell", "calcEsppSell"];

interface TaxBreakdown {
  proceeds: number;
  proceedsLabel?: string;
  incomeTax: number;
  ni: number;
  yasaf: number;
  capGains: number;
  tax: number;
  net: number;
}

function TaxSummaryTable({ d, fontSize = "0.85rem" }: { d: TaxBreakdown; fontSize?: string }) {
  return (
    <table className="table table-sm mb-0" style={{ fontSize }}>
      <tbody>
        <tr><td>{d.proceedsLabel ?? "תמורה ברוטו"}</td><td dir="ltr">{formatCurrency(d.proceeds)}</td></tr>
        {d.incomeTax > 0 && <tr><td>מס הכנסה</td><td dir="ltr" className="text-danger">{formatCurrency(d.incomeTax)}</td></tr>}
        {d.ni > 0 && <tr><td>ביטוח לאומי ובריאות</td><td dir="ltr" className="text-danger">{formatCurrency(d.ni)}</td></tr>}
        {d.capGains > 0 && <tr><td>מס רווחי הון (25%)</td><td dir="ltr" className="text-danger">{formatCurrency(d.capGains)}</td></tr>}
        <tr><td>מס יסף</td><td dir="ltr" className={d.yasaf > 0 ? "text-danger" : "text-muted"}>{formatCurrency(d.yasaf)}</td></tr>
        <tr className="fw-bold border-top"><td>סה״כ מס</td><td dir="ltr" className="text-danger">{formatCurrency(d.tax)}</td></tr>
        <tr className="fw-bold"><td>נטו (₪)</td><td dir="ltr" className="text-success">{formatCurrency(d.net)}</td></tr>
      </tbody>
    </table>
  );
}

export function NvidiaAddPanel({ mode, editData = {}, onClose }: Props) {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const isCalcMode = CALC_MODES.includes(mode);

  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const content = (
    <>
      {success && (
        <div className="alert alert-success py-2 small mb-3">
          נשמר בהצלחה!
        </div>
      )}
      {mode === "addRsuGrant" && (
        <AddRsuGrantForm
          onSubmitting={setSubmitting}
          onSuccess={() => { setSuccess(true); setTimeout(() => setSuccess(false), 3000); }}
        />
      )}
      {mode === "editRsu" && (
        <EditRsuForm
          editData={editData}
          onSubmitting={setSubmitting}
          onSuccess={() => { setSuccess(true); setTimeout(() => setSuccess(false), 3000); }}
        />
      )}
      {mode === "calcRsuSell" && (
        <CalcRsuSellForm editData={editData} />
      )}
      {mode === "calcEsppSell" && (
        <CalcEsppSellForm editData={editData} />
      )}
    </>
  );

  if (isCalcMode) {
    // Centered modal for calculator modes
    return (
      <>
        <div
          className="position-fixed top-0 start-0 w-100 h-100"
          style={{ backgroundColor: "rgba(0,0,0,0.4)", zIndex: 1040 }}
          onClick={onClose}
        />
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ zIndex: 1050, pointerEvents: "none" }}
        >
          <div
            ref={panelRef}
            className="bg-white shadow-lg rounded-3"
            style={{ width: 500, maxWidth: "90vw", maxHeight: "90vh", overflowY: "auto", pointerEvents: "auto" }}
            dir="rtl"
          >
            <div className="d-flex align-items-center justify-content-between p-3 border-bottom">
              <h5 className="mb-0">{PANEL_TITLES[mode]}</h5>
              <button className="btn btn-sm btn-outline-secondary" onClick={onClose}>
                <X size={16} />
              </button>
            </div>
            <div className="p-3">{content}</div>
          </div>
        </div>
      </>
    );
  }

  // Side panel for non-calculator modes
  return (
    <>
      <div
        className="position-fixed top-0 start-0 w-100 h-100"
        style={{ backgroundColor: "rgba(0,0,0,0.3)", zIndex: 1040 }}
        onClick={onClose}
      />
      <div
        ref={panelRef}
        className="position-fixed top-0 end-0 h-100 bg-white shadow-lg"
        style={{ width: 420, maxWidth: "90vw", zIndex: 1050, overflowY: "auto" }}
        dir="rtl"
      >
        <div className="d-flex align-items-center justify-content-between p-3 border-bottom">
          <h5 className="mb-0">{PANEL_TITLES[mode]}</h5>
          <button className="btn btn-sm btn-outline-secondary" onClick={onClose}>
            <X size={16} />
          </button>
        </div>
        <div className="p-3">{content}</div>
      </div>
    </>
  );
}

// ── Add RSU Grant Form ──

const VEST_MONTHS = [3, 6, 9, 12];

function generateVestDates(grantDateIso: string, vestingMonths: number): string[] {
  if (!grantDateIso) return [];
  const [y, m, d] = grantDateIso.split("-").map(Number);
  const grantDate = new Date(y, m - 1, d);
  // End date rounded up to end of quarter so the last vest is included
  const rawEnd = new Date(grantDate);
  rawEnd.setMonth(rawEnd.getMonth() + vestingMonths);
  const endQuarterMonth = Math.ceil((rawEnd.getMonth() + 1) / 3) * 3; // next quarter boundary month (3,6,9,12)
  const endDate = new Date(rawEnd.getFullYear(), endQuarterMonth - 1, 28);

  // First vest is one quarter after grant date
  const firstVestMin = new Date(grantDate);
  firstVestMin.setMonth(firstVestMin.getMonth() + 3);

  const dates: string[] = [];
  for (let yr = grantDate.getFullYear(); yr <= endDate.getFullYear() + 1; yr++) {
    for (const mo of VEST_MONTHS) {
      const vestDate = new Date(yr, mo - 1, 15);
      if (vestDate < firstVestMin) continue;
      if (vestDate > endDate) return dates;
      const dd = String(vestDate.getDate()).padStart(2, "0");
      const mm = String(vestDate.getMonth() + 1).padStart(2, "0");
      const yy = String(vestDate.getFullYear()).slice(2);
      dates.push(`${dd}/${mm}/${yy}`);
    }
  }
  return dates;
}

function AddRsuGrantForm({
  onSubmitting,
  onSuccess,
}: {
  onSubmitting: (v: boolean) => void;
  onSuccess: () => void;
}) {
  const [grantName, setGrantName] = useState("");
  const [grantDate, setGrantDate] = useState("");
  const [totalShares, setTotalShares] = useState("");
  const [costPerShare, setCostPerShare] = useState("");
  const [vestingMonths, setVestingMonths] = useState("48");
  const [vestAmounts, setVestAmounts] = useState<number[]>([]);

  const vestDates = generateVestDates(grantDate, parseInt(vestingMonths) || 0);

  const numVests = vestDates.length;
  const total = parseInt(totalShares) || 0;

  function resetToEqualSplit() {
    if (numVests === 0 || total === 0) {
      setVestAmounts([]);
      return;
    }
    const perVest = Math.floor(total / numVests);
    const amounts = Array(numVests).fill(perVest);
    amounts[numVests - 1] = total - perVest * (numVests - 1);
    setVestAmounts(amounts);
  }

  useEffect(() => {
    resetToEqualSplit();
  }, [grantDate, totalShares, vestingMonths]);

  function updateVestAmount(index: number, value: number) {
    const newAmounts = [...vestAmounts];
    newAmounts[index] = value;
    setVestAmounts(newAmounts);
  }

  const allocatedShares = vestAmounts.reduce((s, v) => s + (v || 0), 0);
  const allocationDiff = total - allocatedShares;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!grantDate || !totalShares || vestDates.length === 0) return;
    onSubmitting(true);
    try {
      const vests = vestDates.map((date, i) => ({
        vestDate: date,
        shares: vestAmounts[i] || 0,
      }));
      await addRsuGrantAction(
        toSheetDate(grantDate),
        total,
        parseFloat(costPerShare) || 0,
        vests,
        grantName,
      );
      onSuccess();
      setGrantName("");
      setGrantDate("");
      setTotalShares("");
      setCostPerShare("");
      setVestAmounts([]);
    } finally {
      onSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className="form-label small">שם מענק</label>
        <input
          type="text"
          className="form-control"
          value={grantName}
          onChange={(e) => setGrantName(e.target.value)}
          placeholder='לדוגמה: "New Hire" או "Refresh 2025"'
        />
      </div>
      <div className="mb-3">
        <label className="form-label small">תאריך מענק</label>
        <input
          type="date"
          className="form-control"
          value={grantDate}
          onChange={(e) => setGrantDate(e.target.value)}
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label small">סה״כ מניות</label>
        <input
          type="number"
          className="form-control"
          value={totalShares}
          onChange={(e) => setTotalShares(e.target.value)}
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label small">מחיר הענקה ($)</label>
        <input
          type="number"
          step="0.01"
          className="form-control"
          value={costPerShare}
          onChange={(e) => setCostPerShare(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label className="form-label small">תקופת vesting (חודשים)</label>
        <input
          type="number"
          className="form-control"
          value={vestingMonths}
          onChange={(e) => setVestingMonths(e.target.value)}
        />
      </div>

      {vestDates.length > 0 && total > 0 && (
        <>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <label className="form-label small mb-0">לוח הבשלות ({vestDates.length})</label>
            {allocationDiff !== 0 && (
              <span className="badge bg-danger">
                {allocationDiff > 0 ? `חסרות ${allocationDiff}` : `עודף ${Math.abs(allocationDiff)}`} מניות
              </span>
            )}
            {allocationDiff === 0 && (
              <span className="badge bg-success">סה״כ תקין</span>
            )}
          </div>
          <div className="border rounded mb-3" style={{ maxHeight: 300, overflowY: "auto" }}>
            <table className="table table-sm mb-0 text-center" style={{ fontSize: "0.85rem" }}>
              <thead className="table-light sticky-top">
                <tr>
                  <th>תאריך</th>
                  <th>כמות</th>
                </tr>
              </thead>
              <tbody>
                {vestDates.map((date, i) => (
                  <tr key={i}>
                    <td className="align-middle">{date}</td>
                    <td style={{ width: 100 }}>
                      <input
                        type="number"
                        className="form-control form-control-sm text-center"
                        value={vestAmounts[i] ?? 0}
                        onChange={(e) => updateVestAmount(i, parseInt(e.target.value) || 0)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <button
        type="submit"
        className="btn btn-success w-100"
        disabled={vestDates.length === 0 || total === 0 || allocationDiff !== 0}
      >
        הוסף מענק
      </button>
    </form>
  );
}

// ── Edit RSU Row Form (7 columns) ──

function EditRsuForm({
  editData,
  onSubmitting,
  onSuccess,
}: {
  editData: Record<string, unknown>;
  onSubmitting: (v: boolean) => void;
  onSuccess: () => void;
}) {
  const [grantDate, setGrantDate] = useState(fromSheetDate(editData.grantDate as string));
  const [totalShares, setTotalShares] = useState(String(editData.totalSharesInGrant ?? ""));
  const [vestDate, setVestDate] = useState(fromSheetDate(editData.vestDate as string));
  const [shares, setShares] = useState(String(editData.shares ?? ""));
  const [vestPrice, setVestPrice] = useState(editData.vestPriceUsd != null ? String(editData.vestPriceUsd) : "");
  const [notes, setNotes] = useState((editData.notes as string) ?? "");
  const [grantName, setGrantName] = useState((editData.grantName as string) ?? "");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!grantDate || !vestDate || !shares) return;
    onSubmitting(true);
    try {
      await updateRsuVestAction(
        editData.row as number,
        toSheetDate(grantDate),
        parseInt(totalShares) || 0,
        toSheetDate(vestDate),
        parseInt(shares),
        parseFloat(vestPrice) || 0,
        notes,
        grantName,
      );
      onSuccess();
    } finally {
      onSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className="form-label small">שם מענק</label>
        <input type="text" className="form-control" value={grantName} onChange={(e) => setGrantName(e.target.value)} />
      </div>
      <div className="mb-3">
        <label className="form-label small">תאריך מענק</label>
        <input type="date" className="form-control" value={grantDate} onChange={(e) => setGrantDate(e.target.value)} required />
      </div>
      <div className="mb-3">
        <label className="form-label small">סה״כ מניות במענק</label>
        <input type="number" className="form-control" value={totalShares} onChange={(e) => setTotalShares(e.target.value)} />
      </div>
      <div className="mb-3">
        <label className="form-label small">תאריך vesting</label>
        <input type="date" className="form-control" value={vestDate} onChange={(e) => setVestDate(e.target.value)} required />
      </div>
      <div className="mb-3">
        <label className="form-label small">כמות מניות</label>
        <input type="number" className="form-control" value={shares} onChange={(e) => setShares(e.target.value)} required />
      </div>
      <div className="mb-3">
        <label className="form-label small">מחיר הענקה ($)</label>
        <input type="number" step="0.01" className="form-control" value={vestPrice} onChange={(e) => setVestPrice(e.target.value)} />
      </div>
      <div className="mb-3">
        <label className="form-label small">הערות</label>
        <input type="text" className="form-control" value={notes} onChange={(e) => setNotes(e.target.value)} />
      </div>
      <button type="submit" className="btn btn-primary w-100">שמור שינויים</button>
    </form>
  );
}

// ── RSU Sell Calculator ──

function CalcRsuSellForm({ editData }: { editData: Record<string, unknown> }) {
  const defaultPrice = editData.currentNvdaPriceUsd as number | undefined;
  const defaultRate = editData.usdToIls as number | undefined;
  const grants = (editData.grants ?? []) as import("@/lib/types").RsuGrant[];

  // All unsold vests across all grants: matured → unmatured → future
  const availableVests = useMemo(() => {
    function isMatured(grantDate: string): boolean {
      const parts = grantDate.split("/");
      if (parts.length < 3) return false;
      let y = parseInt(parts[2], 10);
      if (y < 100) y += 2000;
      const grant = new Date(y, parseInt(parts[1], 10) - 1, parseInt(parts[0], 10));
      grant.setMonth(grant.getMonth() + MATURATION_MONTHS);
      return grant <= new Date();
    }

    function isComingSoon(grantDate: string): boolean {
      const parts = grantDate.split("/");
      if (parts.length < 3) return false;
      let y = parseInt(parts[2], 10);
      if (y < 100) y += 2000;
      const matDate = new Date(y, parseInt(parts[1], 10) - 1, parseInt(parts[0], 10));
      matDate.setMonth(matDate.getMonth() + MATURATION_MONTHS);
      const now = new Date();
      const oneMonthFromNow = new Date(now);
      oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);
      return matDate > now && matDate <= oneMonthFromNow;
    }

    function isVestComingSoon(vestDate: string): boolean {
      const parts = vestDate.split("/");
      if (parts.length < 3) return false;
      let y = parseInt(parts[2], 10);
      if (y < 100) y += 2000;
      const d = new Date(y, parseInt(parts[1], 10) - 1, parseInt(parts[0], 10));
      const now = new Date();
      const oneMonthFromNow = new Date(now);
      oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);
      return d > now && d <= oneMonthFromNow;
    }

    const vests = grants.flatMap((g) =>
      g.vests
        .filter((v) => !v.sold && v.shares > 0)
        .map((v) => {
          const future = isFutureDate(v.vestDate);
          const matured = !future && isMatured(v.grantDate);
          const comingSoon = !future && !matured && isComingSoon(v.grantDate);
          const vestComingSoon = future && isVestComingSoon(v.vestDate);
          return { ...v, grantName: g.grantName || v.grantDate, future, matured, comingSoon, vestComingSoon };
        })
    );

    return [
      ...vests.filter((v) => !v.future && v.matured),                                          // green: הבשיל ✓
      ...vests.filter((v) => !v.future && !v.matured && !v.comingSoon),                        // yellow: לא הבשיל
      ...vests.filter((v) => (!v.future && !v.matured && v.comingSoon) || v.vestComingSoon),   // purple: מבשיל בקרוב / בקרוב
      ...vests.filter((v) => v.future && !v.vestComingSoon),                                   // red: לא שלך
    ];
  }, [grants]);

  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [sellPrice, setSellPrice] = useState(defaultPrice ? String(defaultPrice) : "");
  const usdRate = String(defaultRate ?? "");
  const grossState = useYearlyGross(
    editData.grossSoFar as number ?? 0,
    editData.monthlySalary as number ?? 0,
    editData.esppMonthlyContribution as number ?? 0,
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

    type Agg = { proceeds: number; incomeTax: number; ni: number; healthTax: number; capGains: number; yasaf: number; tax: number; net: number };
    const zero = (): Agg => ({ proceeds: 0, incomeTax: 0, ni: 0, healthTax: 0, capGains: 0, yasaf: 0, tax: 0, net: 0 });
    const maturedAgg = zero();
    const unmaturedAgg = zero();

    for (const vest of selectedVests) {
      // For future vests, simulate using sell price as vest price
      const vestPrice = vest.vestPriceUsd ?? sp;
      // Force matured/unmatured treatment to match vest.matured flag exactly,
      // rather than re-deriving it inside calcRsuNet (avoids edge-case mismatches).
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

    // Wait scenario: find the latest maturation date among non-matured vests
    let latestMatDate: Date | null = null;
    for (const vest of selectedVests) {
      if (!vest.matured) {
        const parts = vest.grantDate.split("/");
        if (parts.length >= 3) {
          let y = parseInt(parts[2], 10);
          if (y < 100) y += 2000;
          const g = new Date(y, parseInt(parts[1], 10) - 1, parseInt(parts[0], 10));
          g.setMonth(g.getMonth() + MATURATION_MONTHS);
          if (!latestMatDate || g > latestMatDate) latestMatDate = g;
        }
      }
    }

    let waitScenario: { agg: Agg; date: string; dateDisplay: string } | null = null;
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

    return { maturedAgg, unmaturedAgg, combined, anyMatured, anyUnmatured, waitScenario };
  }, [selectedVests, sellPrice, usdRate, grossState.yearlyGross, sellDate]);

  return (
    <div>
      <YearlyGrossSection {...grossState} />
      <hr />

      {/* Vest multiselect */}
      {availableVests.length > 0 ? (
        <div className="mb-3">
          <div className="d-flex justify-content-between align-items-center mb-1">
            <label className="form-label small mb-0">בחר vests למכירה</label>
            <button type="button" className="btn btn-link btn-sm p-0 small" onClick={toggleAll}>
              {selectedRows.size === availableVests.length ? "בטל הכל" : "בחר הכל"}
            </button>
          </div>
          <div className="border rounded" style={{ maxHeight: 220, overflowY: "auto" }}>
            <table className="table table-sm mb-0" style={{ fontSize: "0.82rem" }}>
              <tbody>
                {availableVests.map((v) => (
                  <tr
                    key={v.row}
                    onClick={() => toggleRow(v.row)}
                    style={{
                      cursor: "pointer",
                      "--bs-table-bg": selectedRows.has(v.row)
                        ? v.matured ? "#a7f3d0" : "#e8f0fe"
                        : "transparent",
                    } as React.CSSProperties}
                  >
                    <td style={{ width: 32 }}>
                      <input type="checkbox" className="form-check-input" checked={selectedRows.has(v.row)} readOnly />
                    </td>
                    <td>
                      <span className={v.matured ? "text-success fw-medium" : v.future ? "text-danger" : "text-warning-emphasis"}>
                        {v.vestDate}
                      </span>
                      {v.matured && (
                        <span className="badge ms-1 fw-normal" style={{ background: "#bbf7d0", color: "#166534", fontSize: "0.68rem" }}>הבשיל ✓</span>
                      )}
                      {v.comingSoon && (
                        <span className="badge ms-1 fw-normal" style={{ background: "#e9d5ff", color: "#6b21a8", fontSize: "0.68rem" }}>מבשיל בקרוב</span>
                      )}
                      {!v.matured && !v.comingSoon && !v.future && (
                        <span className="badge ms-1 fw-normal" style={{ background: "#fef08a", color: "#854d0e", fontSize: "0.68rem" }}>לא הבשיל</span>
                      )}
                      {v.future && v.vestComingSoon && (
                        <span className="badge ms-1 fw-normal" style={{ background: "#e9d5ff", color: "#6b21a8", fontSize: "0.68rem" }}>בקרוב</span>
                      )}
                      {v.future && !v.vestComingSoon && (
                        <span className="badge ms-1 fw-normal" style={{ background: "#fecaca", color: "#991b1b", fontSize: "0.68rem" }}>לא שלך</span>
                      )}
                    </td>
                    <td className={v.matured ? "text-success" : v.future ? "text-danger" : undefined}>{v.grantName}</td>
                    <td className={`text-end ${v.matured ? "text-success fw-medium" : v.future ? "text-danger" : ""}`}>{v.shares}</td>
                    <td className="text-muted text-end">{v.vestPriceUsd ? `$${v.vestPriceUsd}` : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {selectedVests.length > 0 && (
            <div className="small text-muted mt-1">
              {selectedVests.length} vests · {selectedVests.reduce((s, v) => s + v.shares, 0).toLocaleString()} מניות
            </div>
          )}
        </div>
      ) : (
        <div className="alert alert-info py-2 small mb-3">אין vests זמינים למכירה</div>
      )}

      <div className="mb-3">
        <label className="form-label small">מחיר מכירה ($)</label>
        <input type="number" step="0.01" className="form-control" value={sellPrice} onChange={(e) => setSellPrice(e.target.value)} />
        {defaultPrice && <div className="form-text small">מחיר נוכחי: ${defaultPrice.toFixed(2)}</div>}
      </div>

      {result && (() => {
        const toBreakdown = (a: typeof result.combined): TaxBreakdown => ({
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
            {/* Scenario 1: Sell now */}
            <div className="border rounded p-3 bg-light mb-3">
              <h6 className="mb-2 d-flex align-items-center gap-2">
                מכור עכשיו
                {result.anyMatured && result.anyUnmatured && (
                  <span className="badge fw-normal small" style={{ background: "#e5e7eb", color: "#374151", fontSize: "0.7rem" }}>
                    מעורב
                  </span>
                )}
              </h6>
              {result.anyMatured && result.anyUnmatured ? (
                <>
                  <div className="row g-2 mb-2">
                    <div className="col-6">
                      <div className="border rounded p-2" style={{ background: "#f0fdf4" }}>
                        <div className="fw-semibold text-success mb-1 text-center" style={{ fontSize: "0.75rem" }}>הבשילו (102)</div>
                        <TaxSummaryTable d={toBreakdown(result.maturedAgg)} fontSize="0.78rem" />
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="border rounded p-2" style={{ background: "#fffbeb" }}>
                        <div className="fw-semibold mb-1 text-center" style={{ fontSize: "0.75rem", color: "#92400e" }}>טרם הבשלה</div>
                        <TaxSummaryTable d={toBreakdown(result.unmaturedAgg)} fontSize="0.78rem" />
                      </div>
                    </div>
                  </div>
                  <div className="border-top pt-2">
                    <table className="table table-sm mb-0" style={{ fontSize: "0.85rem" }}>
                      <tbody>
                        <tr className="fw-bold"><td>סה״כ נטו</td><td dir="ltr" className="text-success">{formatCurrency(result.combined.net)}</td></tr>
                        <tr><td className="text-muted">סה״כ מס</td><td dir="ltr" className="text-danger">{formatCurrency(result.combined.tax)}</td></tr>
                      </tbody>
                    </table>
                  </div>
                </>
              ) : (
                <TaxSummaryTable d={toBreakdown(result.combined)} />
              )}
            </div>

            {/* Scenario 2: Wait for maturation */}
            {result.waitScenario && (
              <div className="border rounded p-3" style={{ background: "#f0fdf4" }}>
                <h6 className="mb-2 text-success d-flex align-items-center gap-2">
                  המתן להבשלה
                  <span className="badge fw-normal" style={{ background: "#dcfce7", color: "#166534", fontSize: "0.72rem" }}>
                    מ־{result.waitScenario.dateDisplay}
                  </span>
                </h6>
                <TaxSummaryTable d={toBreakdown(result.waitScenario.agg)} />
                {result.waitScenario.agg.net > result.combined.net && (
                  <div className="mt-2 pt-2 border-top small fw-semibold text-success">
                    חיסכון בהמתנה: <span dir="ltr">{formatCurrency(result.waitScenario.agg.net - result.combined.net)}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })()}
    </div>
  );
}

function isFutureDate(dateStr: string): boolean {
  const parts = dateStr.split("/");
  if (parts.length < 3) return false;
  let y = parseInt(parts[2], 10);
  if (y < 100) y += 2000;
  const date = new Date(y, parseInt(parts[1], 10) - 1, parseInt(parts[0], 10));
  return date > new Date();
}

// ── ESPP Sell Calculator ──

// ── Shared yearly gross hook + section ──

function useYearlyGross(initialGrossSoFar: number, initialMonthlySalary: number, initialEsppContribution: number, initialEsppPurchasePrice: number) {
  const [earnedSoFar, setEarnedSoFar] = useState(initialGrossSoFar ? String(initialGrossSoFar) : "");
  const [monthlySalary, setMonthlySalary] = useState(initialMonthlySalary ? String(initialMonthlySalary) : "");
  const [esppContribution, setEsppContribution] = useState(initialEsppContribution ? String(initialEsppContribution) : "");
  const [esppPurchasePrice, setEsppPurchasePrice] = useState(initialEsppPurchasePrice ? String(initialEsppPurchasePrice) : "");
  const monthsRemaining = 12 - new Date().getMonth();
  const yearlyGross = (parseFloat(earnedSoFar) || 0) + (parseFloat(monthlySalary) || 0) * monthsRemaining;

  async function save(gs: string, ms: string, espp: string, pp: string) {
    await setRsuGrossDataAction(parseFloat(gs) || 0, parseFloat(ms) || 0, parseFloat(espp) || 0, parseFloat(pp) || 0);
  }

  return {
    earnedSoFar,
    setEarnedSoFar: (v: string) => { setEarnedSoFar(v); save(v, monthlySalary, esppContribution, esppPurchasePrice); },
    monthlySalary,
    setMonthlySalary: (v: string) => { setMonthlySalary(v); save(earnedSoFar, v, esppContribution, esppPurchasePrice); },
    esppContribution,
    setEsppContribution: (v: string) => { setEsppContribution(v); save(earnedSoFar, monthlySalary, v, esppPurchasePrice); },
    esppPurchasePrice,
    setEsppPurchasePrice: (v: string) => { setEsppPurchasePrice(v); save(earnedSoFar, monthlySalary, esppContribution, v); },
    yearlyGross,
    monthsRemaining,
  };
}

function withCommas(val: string): string {
  const raw = val.replace(/[^0-9]/g, "");
  if (!raw) return "";
  return parseInt(raw, 10).toLocaleString("en-US");
}

function YearlyGrossSection({
  earnedSoFar, setEarnedSoFar, monthlySalary, setMonthlySalary, yearlyGross, monthsRemaining,
}: Omit<ReturnType<typeof useYearlyGross>, "esppContribution" | "setEsppContribution">) {
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
        <div className="form-text small">עד כה + {monthsRemaining} חודשים × משכורת</div>
      </div>
    </>
  );
}


function CalcEsppSellForm({ editData }: { editData: Record<string, unknown> }) {
  const currentNvdaPrice = editData.currentNvdaPriceUsd as number | undefined;
  const liveUsdRate = editData.usdToIls as number | undefined;

  const grossState = useYearlyGross(
    editData.grossSoFar as number ?? 0,
    editData.monthlySalary as number ?? 0,
    editData.esppMonthlyContribution as number ?? 0,
    editData.esppPurchasePrice as number ?? 0,
  );
  const purchasePrice = grossState.esppPurchasePrice;
  const setPurchasePrice = grossState.setEsppPurchasePrice;

  // Non-persistent fields
  const [shares, setShares] = useState("");
  const [sellPrice, setSellPrice] = useState(currentNvdaPrice ? String(currentNvdaPrice) : "");

  const usdRate = liveUsdRate ?? 0;

  const defaultShares = useMemo(() => {
    const mc = parseFloat(grossState.esppContribution);
    const pp = parseFloat(purchasePrice);
    if (!mc || !pp || !usdRate) return "";
    return String(Math.floor((mc * 6) / (pp * usdRate)));
  }, [grossState.esppContribution, purchasePrice, usdRate]);

  useEffect(() => {
    if (defaultShares) setShares(defaultShares);
  }, [defaultShares]);

  const result = useMemo(() => {
    const s = parseFloat(shares);
    const pp = parseFloat(purchasePrice);
    const sp = parseFloat(sellPrice);
    if (!s || !pp || !sp || !usdRate) return null;

    const proceeds = s * sp * usdRate;
    const cost = s * pp * usdRate;
    const gainIls = proceeds - cost;
    const incomeTax = calcMarginalIncomeTax(grossState.yearlyGross, gainIls);
    const niCeilingIls = NI_MAX_MONTHLY * 12;
    const niBase = Math.min(grossState.yearlyGross, niCeilingIls);
    const niAndHealth = Math.max(0, Math.min(gainIls, niCeilingIls - niBase)) * NI_AND_HEALTH_HIGH_RATE;
    const yasaf = Math.max(0, Math.min(gainIls, grossState.yearlyGross + gainIls - YASAF_THRESHOLD)) * YASAF_RATE;
    const totalTax = incomeTax + niAndHealth + yasaf;
    return {
      proceeds,
      incomeTax,
      niAndHealth,
      yasaf,
      totalTax,
      netIls: proceeds - totalTax,
    };
  }, [shares, purchasePrice, sellPrice, usdRate, grossState.yearlyGross]);

  return (
    <div>
      <YearlyGrossSection {...grossState} />
      <hr />
      <div className="row mb-3">
        <div className="col">
          <label className="form-label small">הפרשה חודשית ESPP (₪)</label>
          <input
            type="text"
            inputMode="numeric"
            className="form-control"
            value={withCommas(grossState.esppContribution)}
            onChange={(e) => grossState.setEsppContribution(e.target.value.replace(/,/g, ""))}
            placeholder="0"
          />
        </div>
        <div className="col">
          <label className="form-label small">מחיר רכישה ($) <span className="text-muted">(עם הנחה)</span></label>
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
          onChange={(e) => setShares(e.target.value)}
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
          <div className="form-text small">מחיר נוכחי: ${currentNvdaPrice.toFixed(2)}</div>
        )}
      </div>

      {result && (
        <div className="border rounded p-3 bg-light">
          <h6 className="mb-3">תוצאות</h6>
          <TaxSummaryTable d={{
            proceeds: result.proceeds,
            proceedsLabel: "סכום מכירה",
            incomeTax: result.incomeTax,
            ni: result.niAndHealth,
            capGains: 0,
            yasaf: result.yasaf,
            tax: result.totalTax,
            net: result.netIls,
          }} />
        </div>
      )}
    </div>
  );
}
