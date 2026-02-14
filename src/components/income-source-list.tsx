"use client";

import { useState } from "react";
import type { IncomeSource } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { EditableRow, EditableList } from "@/components/editable-list";

interface Props {
  items: IncomeSource[];
  onAdd: (name: string, amount: number) => Promise<void>;
  onUpdate: (oldName: string, name: string, amount: number) => Promise<void>;
  onRemove: (name: string) => Promise<void>;
}

function IncomeSourceRow({
  item,
  onUpdate,
  onRemove,
  submitting,
  setSubmitting,
}: {
  item: IncomeSource;
  onUpdate: Props["onUpdate"];
  onRemove: Props["onRemove"];
  submitting: boolean;
  setSubmitting: (v: boolean) => void;
}) {
  const [editName, setEditName] = useState(item.name);
  const [editAmount, setEditAmount] = useState(
    item.amount ? String(item.amount) : "",
  );

  return (
    <EditableRow
      item={item}
      submitting={submitting}
      setSubmitting={setSubmitting}
      onRemove={() => onRemove(item.name)}
      onStartEdit={() => {
        setEditName(item.name);
        setEditAmount(item.amount ? String(item.amount) : "");
      }}
      onSave={async () => {
        const trimmed = editName.trim();
        if (!trimmed) return;
        const newAmount = parseFloat(editAmount) || 0;
        if (trimmed === item.name && newAmount === item.amount) return;
        await onUpdate(item.name, trimmed, newAmount);
      }}
      renderDisplay={(it) => (
        <>
          <span className="fw-bold small">{it.name}</span>
          {it.amount > 0 && (
            <span
              className="badge rounded-pill"
              style={{ backgroundColor: "#6c757d" }}
            >
              {formatCurrency(it.amount)}
            </span>
          )}
        </>
      )}
      renderEdit={({ handleKeyDown }) => (
        <>
          <div style={{ minWidth: "140px" }}>
            <input
              className="form-control form-control-sm"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
            />
          </div>
          <div style={{ minWidth: "100px" }}>
            <input
              className="form-control form-control-sm"
              type="number"
              placeholder="0"
              value={editAmount}
              onChange={(e) => setEditAmount(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
        </>
      )}
    />
  );
}

export function IncomeSourceList({ items, onAdd, onUpdate, onRemove }: Props) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");

  return (
    <EditableList
      items={items}
      getKey={(item, idx) => `${item.name}-${idx}`}
      renderRow={(item, submitting, setSubmitting) => (
        <IncomeSourceRow
          item={item}
          onUpdate={onUpdate}
          onRemove={onRemove}
          submitting={submitting}
          setSubmitting={setSubmitting}
        />
      )}
      renderAddForm={(submitting, setSubmitting) => {
        async function handleAdd() {
          const trimmedName = name.trim();
          if (!trimmedName) return;
          setSubmitting(true);
          try {
            await onAdd(trimmedName, parseFloat(amount) || 0);
            setName("");
            setAmount("");
          } finally {
            setSubmitting(false);
          }
        }
        return (
          <div className="d-flex gap-2 align-items-end flex-wrap">
            <div style={{ minWidth: "140px" }}>
              <label className="form-label small mb-1">שם *</label>
              <input
                className="form-control form-control-sm"
                placeholder="מקור הכנסה..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              />
            </div>
            <div style={{ minWidth: "100px" }}>
              <label className="form-label small mb-1">סכום</label>
              <input
                className="form-control form-control-sm"
                type="number"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              />
            </div>
            <button
              className="btn btn-sm btn-success"
              onClick={handleAdd}
              disabled={submitting || !name.trim()}
            >
              {submitting ? "..." : "הוסף"}
            </button>
          </div>
        );
      }}
    />
  );
}
