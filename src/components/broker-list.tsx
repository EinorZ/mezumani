"use client";

import { useState } from "react";
import type { BrokerConfig } from "@/lib/types";
import { EditableRow, EditableList } from "@/components/editable-list";

interface Props {
  items: BrokerConfig[];
  onAdd: (name: string, mgmtFee: number, purchaseFee: number) => Promise<void>;
  onUpdate: (
    oldName: string,
    name: string,
    mgmtFee: number,
    purchaseFee: number,
  ) => Promise<void>;
  onRemove: (name: string) => Promise<void>;
}

function BrokerRow({
  item,
  onUpdate,
  onRemove,
  submitting,
  setSubmitting,
}: {
  item: BrokerConfig;
  onUpdate: Props["onUpdate"];
  onRemove: Props["onRemove"];
  submitting: boolean;
  setSubmitting: (v: boolean) => void;
}) {
  const [name, setName] = useState(item.name);
  const [mgmtFee, setMgmtFee] = useState(
    String(item.managementFeePercent || ""),
  );
  const [purchaseFee, setPurchaseFee] = useState(
    String(item.purchaseFeePercent || ""),
  );

  return (
    <EditableRow
      item={item}
      submitting={submitting}
      setSubmitting={setSubmitting}
      onRemove={() => onRemove(item.name)}
      onStartEdit={() => {
        setName(item.name);
        setMgmtFee(String(item.managementFeePercent || ""));
        setPurchaseFee(String(item.purchaseFeePercent || ""));
      }}
      onSave={async () => {
        const n = name.trim();
        if (!n) return;
        const mf = parseFloat(mgmtFee) || 0;
        const pf = parseFloat(purchaseFee) || 0;
        if (
          n === item.name &&
          mf === item.managementFeePercent &&
          pf === item.purchaseFeePercent
        )
          return;
        await onUpdate(item.name, n, mf, pf);
      }}
      renderDisplay={(it) => (
        <>
          <span className="fw-bold small">{it.name}</span>
          <span
            className="badge rounded-pill bg-secondary"
            style={{ fontSize: "0.65rem" }}
          >
            ניהול: {it.managementFeePercent}%
          </span>
          <span
            className="badge rounded-pill bg-secondary"
            style={{ fontSize: "0.65rem" }}
          >
            קניה: {it.purchaseFeePercent}%
          </span>
        </>
      )}
      renderEdit={({ handleKeyDown }) => (
        <>
          <div style={{ minWidth: "120px" }}>
            <input
              className="form-control form-control-sm"
              placeholder="שם"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
            />
          </div>
          <div style={{ minWidth: "80px" }}>
            <input
              className="form-control form-control-sm"
              type="number"
              step="0.01"
              placeholder="0"
              value={mgmtFee}
              onChange={(e) => setMgmtFee(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
          <div style={{ minWidth: "80px" }}>
            <input
              className="form-control form-control-sm"
              type="number"
              step="0.01"
              placeholder="0"
              value={purchaseFee}
              onChange={(e) => setPurchaseFee(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
        </>
      )}
    />
  );
}

export function BrokerList({ items, onAdd, onUpdate, onRemove }: Props) {
  const [name, setName] = useState("");
  const [mgmtFee, setMgmtFee] = useState("");
  const [purchaseFee, setPurchaseFee] = useState("");

  return (
    <EditableList
      items={items}
      getKey={(item, idx) => `${item.name}-${idx}`}
      renderRow={(item, submitting, setSubmitting) => (
        <BrokerRow
          item={item}
          onUpdate={onUpdate}
          onRemove={onRemove}
          submitting={submitting}
          setSubmitting={setSubmitting}
        />
      )}
      renderAddForm={(submitting, setSubmitting) => {
        async function handleAdd() {
          const n = name.trim();
          if (!n) return;
          setSubmitting(true);
          try {
            await onAdd(
              n,
              parseFloat(mgmtFee) || 0,
              parseFloat(purchaseFee) || 0,
            );
            setName("");
            setMgmtFee("");
            setPurchaseFee("");
          } finally {
            setSubmitting(false);
          }
        }
        return (
          <div className="d-flex gap-2 align-items-end flex-wrap">
            <div style={{ minWidth: "120px" }}>
              <label className="form-label small mb-1">שם הבנק *</label>
              <input
                className="form-control form-control-sm"
                placeholder="IBI"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              />
            </div>
            <div style={{ minWidth: "80px" }}>
              <label className="form-label small mb-1">דמי ניהול %</label>
              <input
                className="form-control form-control-sm"
                type="number"
                step="0.01"
                placeholder="0"
                value={mgmtFee}
                onChange={(e) => setMgmtFee(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              />
            </div>
            <div style={{ minWidth: "80px" }}>
              <label className="form-label small mb-1">עמלת קניה %</label>
              <input
                className="form-control form-control-sm"
                type="number"
                step="0.01"
                placeholder="0"
                value={purchaseFee}
                onChange={(e) => setPurchaseFee(e.target.value)}
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
