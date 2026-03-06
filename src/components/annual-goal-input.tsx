"use client";

import { useState, useTransition } from "react";
import { formatCurrency } from "@/lib/utils";

interface Props {
  initialGoal: number;
  onSave: (amount: number) => Promise<void>;
}

export function AnnualGoalInput({ initialGoal, onSave }: Props) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(String(initialGoal || ""));
  const [isPending, startTransition] = useTransition();

  if (!editing) {
    return (
      <div className="d-flex align-items-center gap-2">
        <span className="fw-medium" dir="ltr">
          {initialGoal > 0 ? formatCurrency(initialGoal) : "לא הוגדר"}
        </span>
        <button
          className="btn btn-sm btn-outline-secondary"
          onClick={() => {
            setValue(String(initialGoal || ""));
            setEditing(true);
          }}
        >
          ערוך
        </button>
      </div>
    );
  }

  return (
    <div className="d-flex align-items-center gap-2">
      <input
        type="number"
        className="form-control form-control-sm"
        style={{ maxWidth: 160 }}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        autoFocus
        dir="ltr"
        min={0}
      />
      <button
        className="btn btn-sm btn-primary"
        disabled={isPending}
        onClick={() => {
          const amount = Math.max(0, Number(value) || 0);
          startTransition(async () => {
            await onSave(amount);
            setEditing(false);
          });
        }}
      >
        {isPending ? "..." : "שמור"}
      </button>
      <button
        className="btn btn-sm btn-outline-secondary"
        disabled={isPending}
        onClick={() => setEditing(false)}
      >
        ביטול
      </button>
    </div>
  );
}
