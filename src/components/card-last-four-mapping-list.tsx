"use client";

import { useMemo, useState } from "react";
import { SearchableSelect } from "@/components/searchable-select";
import type { CardLastFourMapping } from "@/lib/types";

interface Props {
  items: CardLastFourMapping[];
  cards: string[];
  cardColorMap: Record<string, string>;
  onSave: (card: string, lastFour: string) => Promise<void>;
  onRemove: (card: string) => Promise<void>;
}

export function CardLastFourMappingList({
  items,
  cards,
  cardColorMap,
  onSave,
  onRemove,
}: Props) {
  const [card, setCard] = useState("");
  const [lastFour, setLastFour] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validItems = useMemo(
    () => items.filter((item) => cards.includes(item.card)),
    [items, cards],
  );

  async function handleSave() {
    if (!card || !/^\d{4}$/.test(lastFour)) return;
    setSubmitting(true);
    setError(null);
    try {
      await onSave(card, lastFour);
      setCard("");
      setLastFour("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "שמירת המיפוי נכשלה");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleRemove(mappedCard: string) {
    setSubmitting(true);
    setError(null);
    try {
      await onRemove(mappedCard);
    } catch (err) {
      setError(err instanceof Error ? err.message : "מחיקת המיפוי נכשלה");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      {validItems.length > 0 && (
        <div className="d-flex flex-column gap-2 mb-3">
          {validItems.map((item) => (
            <div
              key={item.card}
              className="d-flex align-items-center justify-content-between gap-2"
            >
              <div className="d-flex align-items-center gap-2">
                <span
                  className="badge rounded-pill"
                  style={{
                    backgroundColor: cardColorMap[item.card] || "#6c757d",
                  }}
                >
                  {item.card}
                </span>
                <span className="font-monospace" dir="ltr">
                  •••• {item.lastFour}
                </span>
              </div>
              <button
                type="button"
                className="btn btn-sm btn-link text-danger p-0"
                onClick={() => handleRemove(item.card)}
                disabled={submitting}
              >
                הסר
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="d-flex flex-wrap align-items-center gap-2">
        <div style={{ minWidth: 180 }}>
          <SearchableSelect
            options={cards}
            colorMap={cardColorMap}
            value={card}
            onChange={setCard}
            placeholder="בחר כרטיס..."
          />
        </div>
        <input
          className="form-control form-control-sm"
          style={{ width: 120 }}
          dir="ltr"
          inputMode="numeric"
          autoComplete="off"
          maxLength={4}
          placeholder="4 ספרות"
          value={lastFour}
          onChange={(event) =>
            setLastFour(event.target.value.replace(/\D/g, "").slice(0, 4))
          }
          onKeyDown={(event) => event.key === "Enter" && handleSave()}
          aria-label="ארבע הספרות האחרונות"
        />
        <button
          type="button"
          className="btn btn-sm btn-success"
          onClick={handleSave}
          disabled={submitting || !card || !/^\d{4}$/.test(lastFour)}
        >
          {submitting ? "..." : "שמור מיפוי"}
        </button>
      </div>

      <div className="small text-secondary mt-2">
        שם קובץ לדוגמה: <span dir="ltr">0494_09_2026.xlsx</span>
      </div>
      {error && <div className="small text-danger mt-2">{error}</div>}
    </div>
  );
}
