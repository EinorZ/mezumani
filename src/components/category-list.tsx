"use client";

import { useState } from "react";
import type { CategoryItem } from "@/lib/types";
import { DEFAULT_CATEGORY_COLOR } from "@/lib/constants";

interface Props {
  title: string;
  items: CategoryItem[];
  onAdd: (name: string, color: string) => Promise<void>;
  onRemove: (name: string) => Promise<void>;
  onRename?: (oldName: string, newName: string) => Promise<void>;
  placeholder: string;
}

/** Props variant for card lists (plain strings, single badgeColor). */
interface CardListProps {
  title: string;
  cardItems: string[];
  badgeColor: string;
  onAdd: (name: string) => Promise<void>;
  onRemove: (name: string) => Promise<void>;
  placeholder: string;
}

export function CardList({
  title,
  cardItems,
  badgeColor,
  onAdd,
  onRemove,
  placeholder,
}: CardListProps) {
  const [newItem, setNewItem] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleAdd() {
    const trimmed = newItem.trim();
    if (!trimmed) return;
    setSubmitting(true);
    try {
      await onAdd(trimmed);
      setNewItem("");
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

  const content = (
    <>
      {title && <h3 className="h6 fw-bold mb-3">{title}</h3>}
      <div className="d-flex flex-wrap gap-2 mb-3">
        {cardItems.map((item, idx) => (
          <span
            key={`${item}-${idx}`}
            className="badge d-flex align-items-center gap-1 px-2 py-2"
            style={{ backgroundColor: badgeColor, color: "#fff" }}
          >
            {item}
            <button
              className="btn btn-sm p-0 border-0 text-white opacity-75"
              onClick={() => handleRemove(item)}
              disabled={submitting}
              style={{ fontSize: "0.75rem", lineHeight: 1 }}
            >
              &times;
            </button>
          </span>
        ))}
      </div>
      <div className="d-flex gap-2">
        <input
          className="form-control form-control-sm"
          placeholder={placeholder}
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
        />
        <button
          className="btn btn-sm btn-success"
          onClick={handleAdd}
          disabled={submitting || !newItem.trim()}
        >
          {submitting ? "..." : "הוסף"}
        </button>
      </div>
    </>
  );

  if (!title) return <div>{content}</div>;
  return <div className="card rounded-3 border p-3 mb-4">{content}</div>;
}

export function CategoryList({
  title,
  items,
  onAdd,
  onRemove,
  onRename,
  placeholder,
}: Props) {
  const [newItem, setNewItem] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [editName, setEditName] = useState("");

  async function handleAdd() {
    const trimmed = newItem.trim();
    if (!trimmed) return;
    setSubmitting(true);
    try {
      await onAdd(trimmed, DEFAULT_CATEGORY_COLOR);
      setNewItem("");
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

  function startRename(idx: number) {
    setEditingIdx(idx);
    setEditName(items[idx].name);
  }

  async function handleRename(oldName: string) {
    const trimmed = editName.trim();
    if (!trimmed || trimmed === oldName || !onRename) {
      setEditingIdx(null);
      return;
    }
    setSubmitting(true);
    try {
      await onRename(oldName, trimmed);
      setEditingIdx(null);
    } finally {
      setSubmitting(false);
    }
  }

  const content = (
    <>
      {title && <h3 className="h6 fw-bold mb-3">{title}</h3>}
      <div className="d-flex flex-wrap gap-2 mb-3">
        {items.map((item, idx) => (
          <span
            key={`${item.name}-${idx}`}
            className="badge d-flex align-items-center gap-1 px-2 py-2"
            style={{ backgroundColor: item.color, color: "#fff" }}
          >
            {editingIdx === idx ? (
              <input
                className="border-0 bg-transparent text-white"
                style={{ width: "6em", outline: "none", fontSize: "inherit" }}
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleRename(item.name);
                  if (e.key === "Escape") setEditingIdx(null);
                }}
                onBlur={() => handleRename(item.name)}
                autoFocus
              />
            ) : (
              <span
                style={{ cursor: onRename ? "pointer" : "default" }}
                onDoubleClick={() => onRename && startRename(idx)}
                title={onRename ? "לחץ פעמיים לשינוי שם" : undefined}
              >
                {item.name}
              </span>
            )}
            <button
              className="btn btn-sm p-0 border-0 text-white opacity-75"
              onClick={() => handleRemove(item.name)}
              disabled={submitting}
              style={{ fontSize: "0.75rem", lineHeight: 1 }}
            >
              &times;
            </button>
          </span>
        ))}
      </div>
      <div className="d-flex gap-2">
        <input
          className="form-control form-control-sm"
          placeholder={placeholder}
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
        />
        <button
          className="btn btn-sm btn-success"
          onClick={handleAdd}
          disabled={submitting || !newItem.trim()}
        >
          {submitting ? "..." : "הוסף"}
        </button>
      </div>
    </>
  );

  if (!title) return <div>{content}</div>;
  return <div className="card rounded-3 border p-3 mb-4">{content}</div>;
}
