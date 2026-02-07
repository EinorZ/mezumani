"use client";

import { useRef, useState } from "react";
import type { SummaryCard } from "@/lib/types";

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

function CategoryDropdown({
  availableCategories,
  selected,
  onToggle,
}: {
  availableCategories: string[];
  selected: string[];
  onToggle: (cat: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = availableCategories.filter((cat) =>
    cat.includes(search.trim()),
  );

  return (
    <div className="position-relative flex-grow-1">
      <button
        type="button"
        className="form-control form-control-sm text-end d-flex align-items-center justify-content-between"
        onClick={() => {
          setOpen((v) => !v);
          setSearch("");
        }}
        style={{ cursor: "pointer" }}
      >
        <span className="text-secondary" style={{ fontSize: "0.85em" }}>
          {selected.length > 0 ? selected.join(", ") : "בחר קטגוריות..."}
        </span>
        <span style={{ fontSize: "0.7em" }}>&#9662;</span>
      </button>
      {open && (
        <div
          className="position-absolute border rounded bg-white shadow-sm"
          style={{
            top: "100%",
            right: 0,
            left: 0,
            zIndex: 10,
            maxHeight: "14rem",
            overflowY: "auto",
          }}
        >
          <div className="sticky-top bg-white p-1 border-bottom">
            <input
              className="form-control form-control-sm"
              placeholder="חיפוש..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
            />
          </div>
          {filtered.map((cat) => (
            <label
              key={cat}
              className="d-flex align-items-center gap-2 px-2 py-1 small"
              style={{ cursor: "pointer" }}
            >
              <input
                type="checkbox"
                checked={selected.includes(cat)}
                onChange={() => onToggle(cat)}
              />
              {cat}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

export function SummaryCardList({
  items,
  availableCategories,
  onAdd,
  onRemove,
  onUpdate,
}: Props) {
  const [label, setLabel] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [editLabel, setEditLabel] = useState("");
  const [editSelected, setEditSelected] = useState<string[]>([]);
  const editRef = useRef<HTMLDivElement>(null);

  function toggleCategory(cat: string) {
    setSelected((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
    );
  }

  function toggleEditCategory(cat: string) {
    setEditSelected((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
    );
  }

  function startEdit(idx: number) {
    setEditingIdx(idx);
    setEditLabel(items[idx].label);
    setEditSelected([...items[idx].categories]);
  }

  function cancelEdit() {
    setEditingIdx(null);
  }

  async function handleSaveEdit() {
    if (editingIdx === null) return;
    const oldLabel = items[editingIdx].label;
    const trimmed = editLabel.trim();
    if (!trimmed || editSelected.length === 0) return;
    setSubmitting(true);
    try {
      await onUpdate(oldLabel, trimmed, editSelected.join(","));
      setEditingIdx(null);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleAdd() {
    const trimmedLabel = label.trim();
    if (!trimmedLabel || selected.length === 0) return;
    setSubmitting(true);
    try {
      await onAdd(trimmedLabel, selected.join(","));
      setLabel("");
      setSelected([]);
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
              ref={editRef}
              className="d-flex gap-2 align-items-start border rounded p-2 bg-light"
            >
              <input
                className="form-control form-control-sm"
                value={editLabel}
                onChange={(e) => setEditLabel(e.target.value)}
                style={{ maxWidth: "8rem" }}
                autoFocus
              />
              <CategoryDropdown
                availableCategories={availableCategories}
                selected={editSelected}
                onToggle={toggleEditCategory}
              />
              <button
                className="btn btn-sm btn-success"
                onClick={handleSaveEdit}
                disabled={
                  submitting || !editLabel.trim() || editSelected.length === 0
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
        <CategoryDropdown
          availableCategories={availableCategories}
          selected={selected}
          onToggle={toggleCategory}
        />
        <button
          className="btn btn-sm btn-success"
          onClick={handleAdd}
          disabled={submitting || !label.trim() || selected.length === 0}
        >
          {submitting ? "..." : "הוסף"}
        </button>
      </div>
    </div>
  );
}
