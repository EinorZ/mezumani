"use client";

import { useState } from "react";
import type { StockDefinition, PriceSource, StockCurrency } from "@/lib/types";
import { EditableRow, EditableList } from "@/components/editable-list";

interface Props {
  items: StockDefinition[];
  onAdd: (
    symbol: string,
    displayName: string,
    source: PriceSource,
    currency: StockCurrency,
    label: string,
  ) => Promise<void>;
  onUpdate: (
    oldSymbol: string,
    symbol: string,
    displayName: string,
    source: PriceSource,
    currency: StockCurrency,
    label: string,
  ) => Promise<void>;
  onRemove: (symbol: string) => Promise<void>;
}

function StockRow({
  item,
  onUpdate,
  onRemove,
  submitting,
  setSubmitting,
}: {
  item: StockDefinition;
  onUpdate: Props["onUpdate"];
  onRemove: Props["onRemove"];
  submitting: boolean;
  setSubmitting: (v: boolean) => void;
}) {
  const [symbol, setSymbol] = useState(item.symbol);
  const [displayName, setDisplayName] = useState(item.displayName);
  const [source, setSource] = useState<PriceSource>(item.source);
  const [currency, setCurrency] = useState<StockCurrency>(item.currency);
  const [label, setLabel] = useState(item.label);

  return (
    <EditableRow
      item={item}
      submitting={submitting}
      setSubmitting={setSubmitting}
      onRemove={() => onRemove(item.symbol)}
      onStartEdit={() => {
        setSymbol(item.symbol);
        setDisplayName(item.displayName);
        setSource(item.source);
        setCurrency(item.currency);
        setLabel(item.label);
      }}
      onSave={async () => {
        const s = symbol.trim();
        const n = displayName.trim();
        if (!s || !n) return;
        if (
          s === item.symbol &&
          n === item.displayName &&
          source === item.source &&
          currency === item.currency &&
          label === item.label
        )
          return;
        await onUpdate(item.symbol, s, n, source, currency, label);
      }}
      renderDisplay={(it) => (
        <>
          <span className="fw-bold small" dir="ltr">
            {it.symbol}
          </span>
          <span className="small text-muted">{it.displayName}</span>
          <span
            className="badge rounded-pill bg-secondary"
            style={{ fontSize: "0.65rem" }}
          >
            {it.source === "yahoo" ? "Yahoo" : "TheMarker"}
          </span>
          <span
            className="badge rounded-pill bg-info text-dark"
            style={{ fontSize: "0.65rem" }}
          >
            {it.currency}
          </span>
          {it.label && (
            <span
              className="badge rounded-pill bg-primary"
              style={{ fontSize: "0.65rem" }}
            >
              {it.label}
            </span>
          )}
        </>
      )}
      renderEdit={({ handleKeyDown }) => (
        <>
          <div style={{ minWidth: "100px" }}>
            <input
              className="form-control form-control-sm"
              placeholder="סימול"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
            />
          </div>
          <div style={{ minWidth: "140px" }}>
            <input
              className="form-control form-control-sm"
              placeholder="שם תצוגה"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
          <select
            className="form-select form-select-sm"
            style={{ width: "auto" }}
            value={source}
            onChange={(e) => setSource(e.target.value as PriceSource)}
          >
            <option value="yahoo">Yahoo</option>
            <option value="funder">Funder</option>
          </select>
          <select
            className="form-select form-select-sm"
            style={{ width: "auto" }}
            value={currency}
            onChange={(e) => setCurrency(e.target.value as StockCurrency)}
          >
            <option value="USD">USD</option>
            <option value="ILS">ILS</option>
          </select>
          <div style={{ minWidth: "100px" }}>
            <input
              className="form-control form-control-sm"
              placeholder="קטגוריה"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              onKeyDown={handleKeyDown}
              list="stock-labels"
            />
          </div>
        </>
      )}
    />
  );
}

export function StockDefinitionList({
  items,
  onAdd,
  onUpdate,
  onRemove,
}: Props) {
  const [symbol, setSymbol] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [source, setSource] = useState<PriceSource>("yahoo");
  const [currency, setCurrency] = useState<StockCurrency>("USD");
  const [label, setLabel] = useState("");

  const existingLabels = [
    ...new Set(items.map((i) => i.label).filter(Boolean)),
  ];

  return (
    <EditableList
      items={items}
      getKey={(item, idx) => `${item.symbol}-${idx}`}
      renderRow={(item, submitting, setSubmitting) => (
        <StockRow
          item={item}
          onUpdate={onUpdate}
          onRemove={onRemove}
          submitting={submitting}
          setSubmitting={setSubmitting}
        />
      )}
      renderAddForm={(submitting, setSubmitting) => {
        async function handleAdd() {
          const s = symbol.trim();
          const n = displayName.trim();
          if (!s || !n) return;
          setSubmitting(true);
          try {
            await onAdd(s, n, source, currency, label.trim());
            setSymbol("");
            setDisplayName("");
            setLabel("");
          } finally {
            setSubmitting(false);
          }
        }
        return (
          <>
            <div className="d-flex gap-2 align-items-end flex-wrap">
              <div style={{ minWidth: "100px" }}>
                <label className="form-label small mb-1">סימול *</label>
                <input
                  className="form-control form-control-sm"
                  placeholder="QQQ / 5128905"
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                />
              </div>
              <div style={{ minWidth: "140px" }}>
                <label className="form-label small mb-1">שם תצוגה *</label>
                <input
                  className="form-control form-control-sm"
                  placeholder="Invesco QQQ"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                />
              </div>
              <div>
                <label className="form-label small mb-1">מקור</label>
                <select
                  className="form-select form-select-sm"
                  value={source}
                  onChange={(e) => setSource(e.target.value as PriceSource)}
                >
                  <option value="yahoo">Yahoo</option>
                  <option value="funder">Funder</option>
                </select>
              </div>
              <div>
                <label className="form-label small mb-1">מטבע</label>
                <select
                  className="form-select form-select-sm"
                  value={currency}
                  onChange={(e) =>
                    setCurrency(e.target.value as StockCurrency)
                  }
                >
                  <option value="USD">USD</option>
                  <option value="ILS">ILS</option>
                </select>
              </div>
              <div style={{ minWidth: "100px" }}>
                <label className="form-label small mb-1">קטגוריה</label>
                <input
                  className="form-control form-control-sm"
                  placeholder="טכנולוגיה"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                  list="stock-labels"
                />
              </div>
              <button
                className="btn btn-sm btn-success"
                onClick={handleAdd}
                disabled={
                  submitting || !symbol.trim() || !displayName.trim()
                }
              >
                {submitting ? "..." : "הוסף"}
              </button>
            </div>
            <datalist id="stock-labels">
              {existingLabels.map((l) => (
                <option key={l} value={l} />
              ))}
            </datalist>
          </>
        );
      }}
    />
  );
}
