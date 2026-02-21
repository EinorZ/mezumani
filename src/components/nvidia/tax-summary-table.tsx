"use client";

import { formatCurrency } from "@/lib/utils";

export interface TaxBreakdown {
  proceeds: number;
  proceedsLabel?: string;
  incomeTax: number;
  ni: number;
  yasaf: number;
  capGains: number;
  tax: number;
  net: number;
}

export function TaxSummaryTable({
  d,
  fontSize = "0.85rem",
}: {
  d: TaxBreakdown;
  fontSize?: string;
}) {
  return (
    <table className="table table-sm mb-0" style={{ fontSize }}>
      <tbody>
        <tr>
          <td>{d.proceedsLabel ?? "תמורה ברוטו"}</td>
          <td dir="ltr">{formatCurrency(d.proceeds)}</td>
        </tr>
        {d.incomeTax > 0 && (
          <tr>
            <td>מס הכנסה</td>
            <td dir="ltr" className="text-danger">
              {formatCurrency(d.incomeTax)}
            </td>
          </tr>
        )}
        {d.ni > 0 && (
          <tr>
            <td>ביטוח לאומי ובריאות</td>
            <td dir="ltr" className="text-danger">
              {formatCurrency(d.ni)}
            </td>
          </tr>
        )}
        {d.capGains > 0 && (
          <tr>
            <td>מס רווחי הון (25%)</td>
            <td dir="ltr" className="text-danger">
              {formatCurrency(d.capGains)}
            </td>
          </tr>
        )}
        <tr>
          <td>מס יסף</td>
          <td dir="ltr" className={d.yasaf > 0 ? "text-danger" : "text-muted"}>
            {formatCurrency(d.yasaf)}
          </td>
        </tr>
        <tr className="fw-bold border-top">
          <td>סה״כ מס</td>
          <td dir="ltr" className="text-danger">
            {formatCurrency(d.tax)}
          </td>
        </tr>
        <tr className="fw-bold">
          <td>נטו (₪)</td>
          <td dir="ltr" className="text-success">
            {formatCurrency(d.net)}
          </td>
        </tr>
      </tbody>
    </table>
  );
}
