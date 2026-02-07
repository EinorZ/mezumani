"use client";

import { useState } from "react";
import type { CategoryMapping } from "@/lib/types";
import { SearchableSelect } from "@/components/searchable-select";

interface Props {
  items: CategoryMapping[];
  categories: string[];
  categoryColorMap: Record<string, string>;
  onAdd: (expenseNames: string[], category: string) => Promise<void>;
  onUpdate: (
    oldExpenseName: string,
    expenseName: string,
    category: string,
  ) => Promise<void>;
  onRemove: (expenseName: string) => Promise<void>;
}

function MappingRow({
  item,
  categories,
  categoryColorMap,
  onUpdate,
  onRemove,
  submitting,
  setSubmitting,
}: {
  item: CategoryMapping;
  categories: string[];
  categoryColorMap: Record<string, string>;
  onUpdate: Props["onUpdate"];
  onRemove: Props["onRemove"];
  submitting: boolean;
  setSubmitting: (v: boolean) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(item.expenseName);
  const [editCategory, setEditCategory] = useState(item.category);

  function startEdit() {
    setEditName(item.expenseName);
    setEditCategory(item.category);
    setEditing(true);
  }

  async function handleSave() {
    const trimmed = editName.trim();
    if (!trimmed || !editCategory) return;
    if (trimmed === item.expenseName && editCategory === item.category) {
      setEditing(false);
      return;
    }
    setSubmitting(true);
    try {
      await onUpdate(item.expenseName, trimmed, editCategory);
      setEditing(false);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleRemove() {
    setSubmitting(true);
    try {
      await onRemove(item.expenseName);
    } finally {
      setSubmitting(false);
    }
  }

  if (editing) {
    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Enter") handleSave();
      if (e.key === "Escape") setEditing(false);
    };

    return (
      <div className="d-flex gap-2 align-items-end flex-wrap p-2 border rounded-2 bg-light">
        <div style={{ minWidth: "150px" }}>
          <input
            className="form-control form-control-sm"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
          />
        </div>
        <div style={{ minWidth: "150px" }}>
          <SearchableSelect
            options={categories}
            colorMap={categoryColorMap}
            value={editCategory}
            onChange={setEditCategory}
            placeholder="קטגוריה..."
          />
        </div>
        <button
          className="btn btn-sm btn-outline-secondary"
          onClick={() => setEditing(false)}
          disabled={submitting}
        >
          ביטול
        </button>
      </div>
    );
  }

  return (
    <div
      className="d-flex align-items-center gap-2 p-2 border rounded-2"
      style={{ cursor: "pointer" }}
      onClick={startEdit}
    >
      <span className="fw-bold small">{item.expenseName}</span>
      <span className="text-secondary small">&larr;</span>
      <span
        className="badge rounded-pill"
        style={{
          backgroundColor: categoryColorMap[item.category] || "#6c757d",
        }}
      >
        {item.category}
      </span>
      <button
        className="btn btn-sm p-0 border-0 text-danger opacity-75 ms-auto"
        onClick={(e) => {
          e.stopPropagation();
          handleRemove();
        }}
        disabled={submitting}
        style={{ fontSize: "0.85rem", lineHeight: 1 }}
      >
        &times;
      </button>
    </div>
  );
}

export function CategoryMappingList({
  items,
  categories,
  categoryColorMap,
  onAdd,
  onUpdate,
  onRemove,
}: Props) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleAdd() {
    if (!name.trim() || !category) return;
    const names = name
      .split(/[,\n]/)
      .map((n) => n.trim())
      .filter(Boolean);
    if (names.length === 0) return;
    setSubmitting(true);
    try {
      await onAdd(names, category);
      setName("");
      setCategory("");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      {items.length > 0 && (
        <div className="d-flex flex-column gap-2 mb-3">
          {items.map((item, idx) => (
            <MappingRow
              key={`${item.expenseName}-${idx}`}
              item={item}
              categories={categories}
              categoryColorMap={categoryColorMap}
              onUpdate={onUpdate}
              onRemove={onRemove}
              submitting={submitting}
              setSubmitting={setSubmitting}
            />
          ))}
        </div>
      )}

      <div className="d-flex gap-2 align-items-end flex-wrap">
        <div style={{ minWidth: "150px", flex: 1 }}>
          <label className="form-label small mb-1">
            שמות הוצאה * (מופרדים בפסיק)
          </label>
          <textarea
            className="form-control form-control-sm"
            placeholder="למשל: שכר דירה, ארנונה, חשמל"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleAdd();
              }
            }}
            rows={1}
          />
        </div>
        <div style={{ minWidth: "150px" }}>
          <label className="form-label small mb-1">קטגוריה *</label>
          <SearchableSelect
            options={categories}
            colorMap={categoryColorMap}
            value={category}
            onChange={setCategory}
            placeholder="בחר..."
          />
        </div>
        <button
          className="btn btn-sm btn-success"
          onClick={handleAdd}
          disabled={submitting || !name.trim() || !category}
          title="ניתן להוסיף מספר שמות מופרדים בפסיק"
        >
          {submitting ? "..." : "הוסף"}
        </button>
      </div>
    </div>
  );
}
