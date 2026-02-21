"use client";

import { useState, useEffect } from "react";
import { addRsuGrantAction } from "@/lib/actions";
import { toSheetDate } from "@/lib/nvidia-utils";

const VEST_MONTHS = [3, 6, 9, 12];

function generateVestDates(grantDateIso: string, vestingMonths: number): string[] {
  if (!grantDateIso) return [];
  const [y, m, d] = grantDateIso.split("-").map(Number);
  const grantDate = new Date(y, m - 1, d);
  const rawEnd = new Date(grantDate);
  rawEnd.setMonth(rawEnd.getMonth() + vestingMonths);
  const endQuarterMonth = Math.ceil((rawEnd.getMonth() + 1) / 3) * 3;
  const endDate = new Date(rawEnd.getFullYear(), endQuarterMonth - 1, 28);

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

export function AddRsuGrantForm({
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
  }, [grantDate, totalShares, vestingMonths]); // eslint-disable-line react-hooks/exhaustive-deps

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
            <label className="form-label small mb-0">
              לוח הבשלות ({vestDates.length})
            </label>
            {allocationDiff !== 0 && (
              <span className="badge bg-danger">
                {allocationDiff > 0
                  ? `חסרות ${allocationDiff}`
                  : `עודף ${Math.abs(allocationDiff)}`}{" "}
                מניות
              </span>
            )}
            {allocationDiff === 0 && (
              <span className="badge bg-success">סה״כ תקין</span>
            )}
          </div>
          <div
            className="border rounded mb-3"
            style={{ maxHeight: 300, overflowY: "auto" }}
          >
            <table
              className="table table-sm mb-0 text-center"
              style={{ fontSize: "0.85rem" }}
            >
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
                        onChange={(e) =>
                          updateVestAmount(i, parseInt(e.target.value) || 0)
                        }
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
        disabled={
          vestDates.length === 0 || total === 0 || allocationDiff !== 0
        }
      >
        הוסף מענק
      </button>
    </form>
  );
}
