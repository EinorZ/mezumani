"use client";

import { useState } from "react";
import { updateRsuVestAction } from "@/lib/actions";
import { toSheetDate, fromSheetDate } from "@/lib/nvidia-utils";

export function EditRsuForm({
  editData,
  onSubmitting,
  onSuccess,
}: {
  editData: Record<string, unknown>;
  onSubmitting: (v: boolean) => void;
  onSuccess: () => void;
}) {
  const [grantDate, setGrantDate] = useState(
    fromSheetDate(editData.grantDate as string),
  );
  const [totalShares, setTotalShares] = useState(
    String(editData.totalSharesInGrant ?? ""),
  );
  const [vestDate, setVestDate] = useState(
    fromSheetDate(editData.vestDate as string),
  );
  const [shares, setShares] = useState(String(editData.shares ?? ""));
  const [vestPrice, setVestPrice] = useState(
    editData.vestPriceUsd != null ? String(editData.vestPriceUsd) : "",
  );
  const [notes, setNotes] = useState((editData.notes as string) ?? "");
  const [grantName, setGrantName] = useState(
    (editData.grantName as string) ?? "",
  );

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
        <input
          type="text"
          className="form-control"
          value={grantName}
          onChange={(e) => setGrantName(e.target.value)}
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
        <label className="form-label small">סה״כ מניות במענק</label>
        <input
          type="number"
          className="form-control"
          value={totalShares}
          onChange={(e) => setTotalShares(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label className="form-label small">תאריך vesting</label>
        <input
          type="date"
          className="form-control"
          value={vestDate}
          onChange={(e) => setVestDate(e.target.value)}
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label small">כמות מניות</label>
        <input
          type="number"
          className="form-control"
          value={shares}
          onChange={(e) => setShares(e.target.value)}
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label small">מחיר הענקה ($)</label>
        <input
          type="number"
          step="0.01"
          className="form-control"
          value={vestPrice}
          onChange={(e) => setVestPrice(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label className="form-label small">הערות</label>
        <input
          type="text"
          className="form-control"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>
      <button type="submit" className="btn btn-primary w-100">
        שמור שינויים
      </button>
    </form>
  );
}
