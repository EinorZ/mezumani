"use client";

import { useState, useTransition } from "react";
import { formatCurrency } from "@/lib/utils";

interface GoalEntry {
  year: number | "default";
  amount: number;
}

interface Props {
  initialGoals: Record<string, number>;
  onSave: (year: number | "default", amount: number) => Promise<void>;
}

export function AnnualGoalsTable({ initialGoals, onSave }: Props) {
  const [goals, setGoals] = useState<GoalEntry[]>(() => {
    const entries: GoalEntry[] = [];
    if (initialGoals["default"]) {
      entries.push({ year: "default", amount: initialGoals["default"] });
    }
    Object.entries(initialGoals)
      .filter(([k]) => k !== "default")
      .sort(([a], [b]) => Number(b) - Number(a))
      .forEach(([k, v]) => entries.push({ year: Number(k), amount: v }));
    return entries;
  });
  const [newYear, setNewYear] = useState(String(new Date().getFullYear()));
  const [newAmount, setNewAmount] = useState("");
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [editAmount, setEditAmount] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleAdd() {
    const yearNum = parseInt(newYear, 10);
    const amount = Math.max(0, Number(newAmount) || 0);
    if (!amount) return;
    const year: number | "default" = isNaN(yearNum) ? "default" : yearNum;
    startTransition(async () => {
      await onSave(year, amount);
      setGoals((prev) => {
        const filtered = prev.filter((g) => g.year !== year);
        return [{ year, amount }, ...filtered].sort((a, b) => {
          if (a.year === "default") return 1;
          if (b.year === "default") return -1;
          return Number(b.year) - Number(a.year);
        });
      });
      setNewYear(String(new Date().getFullYear()));
      setNewAmount("");
    });
  }

  function handleRemove(entry: GoalEntry) {
    startTransition(async () => {
      await onSave(entry.year, 0);
      setGoals((prev) => prev.filter((g) => g.year !== entry.year));
    });
  }

  function handleEdit(idx: number) {
    setEditIdx(idx);
    setEditAmount(String(goals[idx].amount));
  }

  function handleSaveEdit(idx: number) {
    const amount = Math.max(0, Number(editAmount) || 0);
    if (!amount) return;
    const entry = goals[idx];
    startTransition(async () => {
      await onSave(entry.year, amount);
      setGoals((prev) =>
        prev.map((g, i) => (i === idx ? { ...g, amount } : g)),
      );
      setEditIdx(null);
    });
  }

  return (
    <div>
      {/* Existing goals */}
      {goals.length > 0 && (
        <table className="table table-sm mb-3" style={{ maxWidth: 400 }}>
          <thead>
            <tr>
              <th className="small text-secondary fw-normal">שנה</th>
              <th className="small text-secondary fw-normal">יעד</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {goals.map((g, idx) => (
              <tr key={String(g.year)}>
                <td className="small align-middle">
                  {g.year === "default" ? "ברירת מחדל" : g.year}
                </td>
                <td className="align-middle">
                  {editIdx === idx ? (
                    <input
                      type="number"
                      className="form-control form-control-sm"
                      style={{ maxWidth: 140 }}
                      value={editAmount}
                      onChange={(e) => setEditAmount(e.target.value)}
                      dir="ltr"
                      autoFocus
                    />
                  ) : (
                    <span className="small fw-medium" dir="ltr">
                      {formatCurrency(g.amount)}
                    </span>
                  )}
                </td>
                <td className="align-middle text-end">
                  {editIdx === idx ? (
                    <div className="d-flex gap-1 justify-content-end">
                      <button
                        className="btn btn-sm btn-primary"
                        disabled={isPending}
                        onClick={() => handleSaveEdit(idx)}
                      >
                        {isPending ? "..." : "שמור"}
                      </button>
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => setEditIdx(null)}
                      >
                        ביטול
                      </button>
                    </div>
                  ) : (
                    <div className="d-flex gap-1 justify-content-end">
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => handleEdit(idx)}
                      >
                        ערוך
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        disabled={isPending}
                        onClick={() => handleRemove(g)}
                      >
                        הסר
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Add new */}
      <div className="d-flex gap-2 align-items-end flex-wrap">
        <div>
          <label className="form-label small mb-1">שנה</label>
          <input
            type="number"
            className="form-control form-control-sm"
            style={{ width: 100 }}
            value={newYear}
            onChange={(e) => setNewYear(e.target.value)}
            dir="ltr"
          />
        </div>
        <div>
          <label className="form-label small mb-1">יעד (₪)</label>
          <input
            type="number"
            className="form-control form-control-sm"
            style={{ width: 140 }}
            value={newAmount}
            onChange={(e) => setNewAmount(e.target.value)}
            dir="ltr"
            placeholder="0"
          />
        </div>
        <button
          className="btn btn-sm btn-success"
          disabled={isPending || !newAmount}
          onClick={handleAdd}
        >
          {isPending ? "..." : "הוסף"}
        </button>
      </div>
    </div>
  );
}
