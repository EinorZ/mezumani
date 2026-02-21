"use client";

import { useState, useRef } from "react";
import { X } from "lucide-react";
import type { StockConfig, TransactionType, InvestmentTerm } from "@/lib/types";
import { addStockTransactionAction } from "@/lib/actions";
import { ALL_TERMS, TERM_LABELS } from "@/lib/constants";
import { useEscapeKey } from "@/hooks/use-escape-key";

interface Props {
  config: StockConfig;
  defaults?: {
    symbol?: string;
    type?: TransactionType;
  };
  onClose: () => void;
}

export function StockAddPanel({ config, defaults, onClose }: Props) {
  const [type, setType] = useState<TransactionType>(defaults?.type ?? "קניה");
  const [symbol, setSymbol] = useState(defaults?.symbol ?? "");
  const [quantity, setQuantity] = useState("");
  const [pricePerShare, setPricePerShare] = useState("");
  const [date, setDate] = useState(getTodayStr());
  const [term, setTerm] = useState<InvestmentTerm>("ארוך");
  const [bank, setBank] = useState(config.brokers[0]?.name ?? "");
  const [tax, setTax] = useState("");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const selectedStock = config.stocks.find((s) => s.symbol === symbol);

  useEscapeKey(onClose);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!symbol || !quantity || !pricePerShare) return;

    setSubmitting(true);
    setSuccess(false);
    try {
      // Convert YYYY-MM-DD to DD/MM/YY for Google Sheets
      const [y, m, d] = date.split("-");
      const sheetDate = `${d}/${m}/${y.slice(2)}`;
      await addStockTransactionAction(
        sheetDate,
        type,
        symbol,
        parseFloat(quantity) || 0,
        parseFloat(pricePerShare) || 0,
        selectedStock?.currency ?? "ILS",
        term,
        bank,
        parseFloat(tax) || 0,
        comment,
      );
      setSuccess(true);
      // Reset form for next entry
      setQuantity("");
      setPricePerShare("");
      setTax("");
      setComment("");
      setTimeout(() => setSuccess(false), 3000);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="position-fixed top-0 start-0 w-100 h-100"
        style={{ backgroundColor: "rgba(0,0,0,0.3)", zIndex: 1040 }}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        className="position-fixed top-0 h-100 bg-white shadow-lg"
        style={{
          width: "min(400px, 100vw)",
          right: 0,
          zIndex: 1050,
          overflowY: "auto",
          animation: "slideIn 200ms ease-out",
        }}
      >
        <div className="d-flex align-items-center justify-content-between p-3 border-bottom">
          <h6 className="fw-bold mb-0">
            {type === "קניה" ? "רכישה חדשה" : "מכירה"}
          </h6>
          <button className="btn btn-sm p-1" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {success && (
          <div className="alert alert-success m-3 mb-0 py-2 small">
            העסקה נוספה בהצלחה
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-3 d-flex flex-column gap-3">
          {/* Buy/Sell toggle */}
          <div>
            <label className="form-label small fw-medium mb-1">סוג עסקה</label>
            <div className="btn-group w-100">
              <button
                type="button"
                className={`btn btn-sm ${type === "קניה" ? "btn-success" : "btn-outline-secondary"}`}
                onClick={() => setType("קניה")}
              >
                קניה
              </button>
              <button
                type="button"
                className={`btn btn-sm ${type === "מכירה" ? "btn-danger" : "btn-outline-secondary"}`}
                onClick={() => setType("מכירה")}
              >
                מכירה
              </button>
            </div>
          </div>

          {/* Stock */}
          <div>
            <label className="form-label small fw-medium mb-1">מניה *</label>
            <select
              className="form-select form-select-sm"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              required
            >
              <option value="">בחר מניה...</option>
              {config.stocks.map((s) => (
                <option key={s.symbol} value={s.symbol}>
                  {s.displayName} ({s.symbol})
                </option>
              ))}
            </select>
            {selectedStock && (
              <div className="small text-muted mt-1">
                מקור מחיר:{" "}
                {selectedStock.source === "yahoo" ? "Yahoo" : "TheMarker"}
              </div>
            )}
          </div>

          {/* Quantity */}
          <div>
            <label className="form-label small fw-medium mb-1">כמות *</label>
            <input
              className="form-control form-control-sm"
              type="number"
              step="any"
              placeholder="0"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
            />
          </div>

          {/* Total amount in ILS */}
          <div>
            <label className="form-label small fw-medium mb-1">
              מחיר בש&quot;ח למניה *
            </label>
            <input
              className="form-control form-control-sm"
              type="number"
              step="any"
              placeholder="0"
              value={pricePerShare}
              onChange={(e) => setPricePerShare(e.target.value)}
              required
            />
            {quantity && pricePerShare && parseFloat(quantity) > 0 && (
              <div className="small text-muted mt-1">
                סה&quot;כ:{" "}
                {(
                  parseFloat(pricePerShare) * parseFloat(quantity)
                ).toLocaleString("he-IL", {
                  style: "currency",
                  currency: "ILS",
                  maximumFractionDigits: 2,
                })}
              </div>
            )}
          </div>

          {/* Date */}
          <div>
            <label className="form-label small fw-medium mb-1">תאריך</label>
            <input
              className="form-control form-control-sm"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          {/* Term */}
          <div>
            <label className="form-label small fw-medium mb-1">סוג השקעה</label>
            <select
              className="form-select form-select-sm"
              value={term}
              onChange={(e) => setTerm(e.target.value as InvestmentTerm)}
            >
              {ALL_TERMS.map((t) => (
                <option key={t} value={t}>{TERM_LABELS[t]}</option>
              ))}
            </select>
          </div>

          {/* Bank */}
          <div>
            <label className="form-label small fw-medium mb-1">בנק</label>
            <select
              className="form-select form-select-sm"
              value={bank}
              onChange={(e) => setBank(e.target.value)}
            >
              <option value="">בחר...</option>
              {config.brokers.map((b) => (
                <option key={b.name} value={b.name}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          {/* Tax */}
          <div>
            <label className="form-label small fw-medium mb-1">
              עמלת קנייה (ש&quot;ח)
            </label>
            <input
              className="form-control form-control-sm"
              type="number"
              step="any"
              placeholder="0"
              value={tax}
              onChange={(e) => setTax(e.target.value)}
            />
          </div>

          {/* Comment */}
          <div>
            <label className="form-label small fw-medium mb-1">הערה</label>
            <input
              className="form-control form-control-sm"
              type="text"
              placeholder="הערה לעסקה..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="btn btn-success"
            disabled={submitting || !symbol || !quantity || !pricePerShare}
          >
            {submitting ? "שומר..." : type === "קניה" ? "הוסף" : "מכור"}
          </button>
        </form>
      </div>

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </>
  );
}

function getTodayStr(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
