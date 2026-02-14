"use client";

import { useState } from "react";
import type { CategoryMapping } from "@/lib/types";
import { SearchableSelect } from "@/components/searchable-select";
import { EditableRow, EditableList } from "@/components/editable-list";

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
  const [editName, setEditName] = useState(item.expenseName);
  const [editCategory, setEditCategory] = useState(item.category);

  return (
    <EditableRow
      item={item}
      submitting={submitting}
      setSubmitting={setSubmitting}
      onRemove={() => onRemove(item.expenseName)}
      onStartEdit={() => {
        setEditName(item.expenseName);
        setEditCategory(item.category);
      }}
      onSave={async () => {
        const trimmed = editName.trim();
        if (!trimmed || !editCategory) return;
        if (trimmed === item.expenseName && editCategory === item.category)
          return;
        await onUpdate(item.expenseName, trimmed, editCategory);
      }}
      renderDisplay={(it) => (
        <>
          <span className="fw-bold small">{it.expenseName}</span>
          <span className="text-secondary small">&larr;</span>
          <span
            className="badge rounded-pill"
            style={{
              backgroundColor: categoryColorMap[it.category] || "#6c757d",
            }}
          >
            {it.category}
          </span>
        </>
      )}
      renderEdit={({ handleKeyDown }) => (
        <>
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
        </>
      )}
    />
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

  return (
    <EditableList
      items={items}
      getKey={(item, idx) => `${item.expenseName}-${idx}`}
      renderRow={(item, submitting, setSubmitting) => (
        <MappingRow
          item={item}
          categories={categories}
          categoryColorMap={categoryColorMap}
          onUpdate={onUpdate}
          onRemove={onRemove}
          submitting={submitting}
          setSubmitting={setSubmitting}
        />
      )}
      renderAddForm={(submitting, setSubmitting) => {
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
        );
      }}
    />
  );
}
