"use client";

import { useState } from "react";
import type { StockGoal, InvestmentTerm } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { TERM_LABELS_SHORT, TERM_COLORS } from "@/lib/constants";
import { EditableRow, EditableList } from "@/components/editable-list";

interface Props {
  items: StockGoal[];
  onAdd: (
    term: InvestmentTerm,
    label: string,
    targetAmount: number,
  ) => Promise<void>;
  onUpdate: (
    oldLabel: string,
    term: InvestmentTerm,
    label: string,
    targetAmount: number,
  ) => Promise<void>;
  onRemove: (label: string) => Promise<void>;
}

function GoalRow({
  item,
  onUpdate,
  onRemove,
  submitting,
  setSubmitting,
}: {
  item: StockGoal;
  onUpdate: Props["onUpdate"];
  onRemove: Props["onRemove"];
  submitting: boolean;
  setSubmitting: (v: boolean) => void;
}) {
  const [term, setTerm] = useState<InvestmentTerm>(item.term);
  const [label, setLabel] = useState(item.label);
  const [amount, setAmount] = useState(String(item.targetAmount || ""));

  return (
    <EditableRow
      item={item}
      submitting={submitting}
      setSubmitting={setSubmitting}
      onRemove={() => onRemove(item.label)}
      onStartEdit={() => {
        setTerm(item.term);
        setLabel(item.label);
        setAmount(String(item.targetAmount || ""));
      }}
      onSave={async () => {
        const l = label.trim();
        if (!l) return;
        const a = parseFloat(amount) || 0;
        if (term === item.term && l === item.label && a === item.targetAmount)
          return;
        await onUpdate(item.label, term, l, a);
      }}
      renderDisplay={(it) => (
        <>
          <span
            className="badge rounded-pill"
            style={{
              backgroundColor: TERM_COLORS[it.term],
              fontSize: "0.65rem",
            }}
          >
            {TERM_LABELS_SHORT[it.term]}
          </span>
          <span className="fw-bold small">{it.label}</span>
          {it.targetAmount > 0 && (
            <span
              className="badge rounded-pill bg-secondary"
              style={{ fontSize: "0.65rem" }}
            >
              {formatCurrency(it.targetAmount)}
            </span>
          )}
        </>
      )}
      renderEdit={({ handleKeyDown }) => (
        <>
          <select
            className="form-select form-select-sm"
            style={{ width: "auto" }}
            value={term}
            onChange={(e) => setTerm(e.target.value as InvestmentTerm)}
          >
            <option value="קצר">קצר</option>
            <option value="בינוני">בינוני</option>
            <option value="ארוך">ארוך</option>
            <option value="לימבו">לימבו</option>
          </select>
          <div style={{ minWidth: "120px" }}>
            <input
              className="form-control form-control-sm"
              placeholder="שם היעד"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
            />
          </div>
          <div style={{ minWidth: "100px" }}>
            <input
              className="form-control form-control-sm"
              type="number"
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
        </>
      )}
    />
  );
}

export function StockGoalList({ items, onAdd, onUpdate, onRemove }: Props) {
  const [term, setTerm] = useState<InvestmentTerm>("ארוך");
  const [label, setLabel] = useState("");
  const [amount, setAmount] = useState("");

  return (
    <EditableList
      items={items}
      getKey={(item, idx) => `${item.label}-${idx}`}
      renderRow={(item, submitting, setSubmitting) => (
        <GoalRow
          item={item}
          onUpdate={onUpdate}
          onRemove={onRemove}
          submitting={submitting}
          setSubmitting={setSubmitting}
        />
      )}
      renderAddForm={(submitting, setSubmitting) => {
        async function handleAdd() {
          const l = label.trim();
          if (!l) return;
          setSubmitting(true);
          try {
            await onAdd(term, l, parseFloat(amount) || 0);
            setLabel("");
            setAmount("");
          } finally {
            setSubmitting(false);
          }
        }
        return (
          <div className="d-flex gap-2 align-items-end flex-wrap">
            <div>
              <label className="form-label small mb-1">סוג</label>
              <select
                className="form-select form-select-sm"
                value={term}
                onChange={(e) => setTerm(e.target.value as InvestmentTerm)}
              >
                <option value="קצר">קצר</option>
                <option value="בינוני">בינוני</option>
                <option value="ארוך">ארוך</option>
                <option value="לימבו">לימבו</option>
              </select>
            </div>
            <div style={{ minWidth: "120px" }}>
              <label className="form-label small mb-1">שם היעד *</label>
              <input
                className="form-control form-control-sm"
                placeholder="קרן חירום"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              />
            </div>
            <div style={{ minWidth: "100px" }}>
              <label className="form-label small mb-1">סכום יעד</label>
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
              disabled={submitting || !label.trim()}
            >
              {submitting ? "..." : "הוסף"}
            </button>
          </div>
        );
      }}
    />
  );
}
