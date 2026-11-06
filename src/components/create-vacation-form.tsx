"use client";

import { useState } from "react";
import { createVacation } from "@/lib/actions";
import { useRouter } from "next/navigation";

interface Props {
  initialYear?: number;
  existingYears?: number[];
  onCreated?: (year: number) => void;
  onCancel?: () => void;
}

export function CreateVacationForm({
  initialYear,
  existingYears = [],
  onCreated,
  onCancel,
}: Props) {
  const router = useRouter();
  const currentYear = new Date().getFullYear() % 100;
  const [name, setName] = useState("");
  const [year, setYear] = useState(String(initialYear ?? currentYear));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const yearOptions = [
    ...new Set([
      ...existingYears,
      initialYear ?? currentYear,
      ...Array.from({ length: 7 }, (_, i) => currentYear - 1 + i),
    ]),
  ]
    .filter((y) => y >= 0 && y <= 99)
    .sort((a, b) => a - b);

  async function handleCreate() {
    if (!name.trim() || !year) return;
    setSubmitting(true);
    setError(null);
    try {
      await createVacation(name.trim(), parseInt(year, 10));
      setName("");
      onCreated?.(Number(year));
      router.refresh();
    } catch {
      setError("שגיאה ביצירת חופשה");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        void handleCreate();
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape" && !submitting) onCancel?.();
      }}
    >
      <div className="d-flex flex-column gap-2">
        <input
          className="form-control form-control-sm"
          placeholder="שם החופשה"
          aria-label="שם החופשה"
          disabled={submitting}
          autoFocus
          maxLength={90}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <label className="small">
          שנת החופשה
          <select
            className="form-select form-select-sm"
            aria-label="שנת החופשה"
            disabled={submitting}
            value={year}
            onChange={(e) => setYear(e.target.value)}
          >
            {yearOptions.map((y) => (
              <option key={y} value={String(y)}>
                {2000 + y}
              </option>
            ))}
          </select>
        </label>
        <div className="small text-muted">
          התשלומים יישארו בשנת התשלום המקורית.
        </div>
        <div className="d-flex gap-2">
          <button
            className="btn btn-sm btn-success"
            type="submit"
            disabled={submitting || !name.trim() || !year}
          >
            {submitting ? "..." : "צור"}
          </button>
          {onCancel && (
            <button
              className="btn btn-sm btn-outline-secondary"
              type="button"
              disabled={submitting}
              onClick={onCancel}
            >
              ביטול
            </button>
          )}
        </div>
      </div>
      {error && (
        <div role="alert" className="text-danger small mt-2">
          {error}
        </div>
      )}
    </form>
  );
}
