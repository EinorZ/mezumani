"use client";

import { useState, useEffect } from "react";
import type { IncomeSource } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

interface Props {
  income: IncomeSource[];
  totalIncome: number;
  totalExpenses: number;
  sheetTitle: string;
  onUpdateIncome: (sheetTitle: string, entries: IncomeSource[]) => Promise<void>;
}

export function IncomeTable({
  income,
  totalExpenses,
  sheetTitle,
  onUpdateIncome,
}: Props) {
  const [entries, setEntries] = useState<IncomeSource[]>(income);
  useEffect(() => { setEntries(income); }, [income]);
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const [saving, setSaving] = useState(false);
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [newAmount, setNewAmount] = useState("");

  async function saveEdit(idx: number) {
    const newAmount = parseFloat(editValue) || 0;
    if (newAmount === entries[idx].amount) {
      setEditingIdx(null);
      return;
    }
    const updated = entries.map((e, i) =>
      i === idx ? { ...e, amount: newAmount } : e,
    );
    setSaving(true);
    try {
      await onUpdateIncome(sheetTitle, updated);
      setEntries(updated);
      setEditingIdx(null);
    } finally {
      setSaving(false);
    }
  }

  async function handleAdd() {
    const trimmed = newName.trim();
    if (!trimmed) return;
    const amount = parseFloat(newAmount) || 0;
    const updated = [...entries, { name: trimmed, amount }];
    setSaving(true);
    try {
      await onUpdateIncome(sheetTitle, updated);
      setEntries(updated);
      setNewName("");
      setNewAmount("");
      setAdding(false);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="card rounded-3 border p-3 h-100">
      <h3 className="h6 fw-bold mb-3">הכנסות</h3>
      <table className="table table-sm mb-0" style={{ fontSize: "0.85rem" }}>
        <tbody>
          {entries.map((entry, idx) => (
            <tr key={`${entry.name}-${idx}`}>
              <td className="border-0 pe-2">{entry.name}</td>
              <td className="border-0 text-start" style={{ width: "110px" }}>
                {editingIdx === idx ? (
                  <input
                    className="form-control form-control-sm py-0"
                    type="number"
                    style={{ width: "80px", fontSize: "0.8rem" }}
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") saveEdit(idx);
                      if (e.key === "Escape") setEditingIdx(null);
                    }}
                    onBlur={() => saveEdit(idx)}
                    autoFocus
                    disabled={saving}
                  />
                ) : (
                  <span
                    style={{ color: "#198754", cursor: "pointer" }}
                    className="fw-medium"
                    onClick={() => {
                      setEditingIdx(idx);
                      setEditValue(String(entry.amount));
                    }}
                  >
                    {formatCurrency(entry.amount)}
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {adding ? (
        <div className="d-flex gap-2 mt-2 align-items-center">
          <input
            className="form-control form-control-sm"
            placeholder="שם..."
            style={{ fontSize: "0.8rem" }}
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAdd();
              if (e.key === "Escape") setAdding(false);
            }}
            autoFocus
            disabled={saving}
          />
          <input
            className="form-control form-control-sm"
            type="number"
            placeholder="סכום"
            style={{ width: "80px", fontSize: "0.8rem" }}
            value={newAmount}
            onChange={(e) => setNewAmount(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAdd();
              if (e.key === "Escape") setAdding(false);
            }}
            disabled={saving}
          />
          <button
            className="btn btn-sm btn-success py-0 px-2"
            style={{ fontSize: "0.75rem" }}
            onClick={handleAdd}
            disabled={saving || !newName.trim()}
          >
            {saving ? "..." : "+"}
          </button>
        </div>
      ) : (
        <button
          className="btn btn-sm btn-link text-muted p-0 mt-2"
          style={{ fontSize: "0.75rem" }}
          onClick={() => setAdding(true)}
        >
          + הוסף הכנסה
        </button>
      )}
    </div>
  );
}
