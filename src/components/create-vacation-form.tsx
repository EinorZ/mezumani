"use client";

import { useState } from "react";
import { createVacation } from "@/lib/actions";

export function CreateVacationForm() {
  const [name, setName] = useState("");
  const [year, setYear] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentYear = new Date().getFullYear() % 100;
  const yearOptions = [currentYear - 1, currentYear, currentYear + 1];

  async function handleCreate() {
    if (!name.trim() || !year) return;
    setSubmitting(true);
    setError(null);
    try {
      await createVacation(name.trim(), parseInt(year, 10));
      setName("");
      setYear("");
    } catch {
      setError("שגיאה ביצירת חופשה");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="card rounded-3 border p-3 mb-4">
      <h3 className="h6 fw-bold mb-3">חופשה חדשה</h3>
      <div className="d-flex gap-2 align-items-center">
        <input
          className="form-control form-control-sm"
          placeholder="שם החופשה"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <select
          className="form-select form-select-sm"
          style={{ maxWidth: 120 }}
          value={year}
          onChange={(e) => setYear(e.target.value)}
        >
          <option value="">שנה</option>
          {yearOptions.map((y) => (
            <option key={y} value={String(y)}>
              20{y}
            </option>
          ))}
        </select>
        <button
          className="btn btn-sm btn-success"
          onClick={handleCreate}
          disabled={submitting || !name.trim() || !year}
        >
          {submitting ? "..." : "צור"}
        </button>
      </div>
      {error && <div className="text-danger small mt-2">{error}</div>}
    </div>
  );
}
