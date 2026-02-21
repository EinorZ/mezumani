"use client";

import { useState } from "react";
import type { SummaryCard } from "@/lib/types";
import { MultiSearchableSelect } from "@/components/multi-searchable-select";

interface Props {
  items: SummaryCard[];
  availableCategories: string[];
  onAdd: (label: string, categories: string) => Promise<void>;
  onRemove: (label: string) => Promise<void>;
  onUpdate: (
    oldLabel: string,
    newLabel: string,
    categories: string,
  ) => Promise<void>;
}

export function SummaryCardList({
  items,
  availableCategories,
  onAdd,
  onRemove,
  onUpdate,
}: Props) {
  const [label, setLabel] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [submitting, setSubmitting] = useState(false);
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [editLabel, setEditLabel] = useState("");
  const [editSelected, setEditSelected] = useState<Set<string>>(new Set());

  function startEdit(idx: number) {
    setEditingIdx(idx);
    setEditLabel(items[idx].label);
    setEditSelected(new Set(items[idx].categories));
  }

  function cancelEdit() {
    setEditingIdx(null);
  }

  async function handleSaveEdit() {
    if (editingIdx === null) return;
    const oldLabel = items[editingIdx].label;
    const trimmed = editLabel.trim();
    if (!trimmed || editSelected.size === 0) return;
    setSubmitting(true);
    try {
      await onUpdate(oldLabel, trimmed, [...editSelected].join(","));
      setEditingIdx(null);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleAdd() {
    const trimmedLabel = label.trim();
    if (!trimmedLabel || selected.size === 0) return;
    setSubmitting(true);
    try {
      await onAdd(trimmedLabel, [...selected].join(","));
      setLabel("");
      setSelected(new Set());
    } finally {
      setSubmitting(false);
    }
  }

  async function handleRemove(name: string) {
    setSubmitting(true);
    try {
      await onRemove(name);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <div className="d-flex flex-column gap-2 mb-3">
        {items.map((item, idx) =>
          editingIdx === idx ? (
            <div
              key={`${item.label}-${idx}`}
              className="d-flex gap-2 align-items-start border rounded p-2 bg-light"
            >
              <input
                className="form-control form-control-sm"
                value={editLabel}
                onChange={(e) => setEditLabel(e.target.value)}
                style={{ maxWidth: "8rem" }}
                autoFocus
              />
              <MultiSearchableSelect
                options={availableCategories}
                colorMap={{}}
                selected={editSelected}
                onChange={setEditSelected}
                placeholder="בחר קטגוריות..."
              />
              <button
                className="btn btn-sm btn-success"
                onClick={handleSaveEdit}
                disabled={
                  submitting || !editLabel.trim() || editSelected.size === 0
                }
              >
                {submitting ? "..." : "שמור"}
              </button>
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={cancelEdit}
                disabled={submitting}
              >
                ביטול
              </button>
            </div>
          ) : (
            <span
              key={`${item.label}-${idx}`}
              className="badge d-inline-flex align-items-center gap-1 px-2 py-2 bg-secondary align-self-start"
              style={{ cursor: "pointer" }}
              onClick={() => startEdit(idx)}
              title="לחץ לעריכה"
            >
              <span>
                {item.label}
                <span className="opacity-75 ms-1" style={{ fontSize: "0.7em" }}>
                  ({item.categories.join(", ")})
                </span>
              </span>
              <button
                className="btn btn-sm p-0 border-0 text-white opacity-75"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(item.label);
                }}
                disabled={submitting}
                style={{ fontSize: "0.75rem", lineHeight: 1 }}
              >
                &times;
              </button>
            </span>
          ),
        )}
      </div>
      <div className="d-flex gap-2 align-items-start">
        <input
          className="form-control form-control-sm"
          placeholder="שם כרטיס..."
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          style={{ maxWidth: "8rem" }}
        />
        <MultiSearchableSelect
          options={availableCategories}
          colorMap={{}}
          selected={selected}
          onChange={setSelected}
          placeholder="בחר קטגוריות..."
        />
        <button
          className="btn btn-sm btn-success"
          onClick={handleAdd}
          disabled={submitting || !label.trim() || selected.size === 0}
        >
          {submitting ? "..." : "הוסף"}
        </button>
      </div>
    </div>
  );
}
