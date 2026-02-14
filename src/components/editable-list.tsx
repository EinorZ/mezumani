"use client";

import { useState, useRef, useCallback, type ReactNode } from "react";
import { useClickOutside } from "@/hooks/use-click-outside";

interface EditableRowProps<T> {
  item: T;
  submitting: boolean;
  setSubmitting: (v: boolean) => void;
  onRemove: () => Promise<void>;
  renderDisplay: (item: T) => ReactNode;
  renderEdit: (props: {
    handleKeyDown: (e: React.KeyboardEvent) => void;
    onCancel: () => void;
    submitting: boolean;
  }) => ReactNode;
  onSave: () => Promise<void>;
  onStartEdit: () => void;
}

export function EditableRow<T>({
  item,
  submitting,
  setSubmitting,
  onRemove,
  renderDisplay,
  renderEdit,
  onSave,
  onStartEdit,
}: EditableRowProps<T>) {
  const [editing, setEditing] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const cancelEdit = useCallback(() => setEditing(false), []);
  useClickOutside(ref, cancelEdit, editing);

  function startEdit() {
    onStartEdit();
    setEditing(true);
  }

  async function handleSave() {
    setSubmitting(true);
    try {
      await onSave();
      setEditing(false);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleRemove() {
    setSubmitting(true);
    try {
      await onRemove();
    } finally {
      setSubmitting(false);
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSave();
    if (e.key === "Escape") setEditing(false);
  };

  if (editing) {
    return (
      <div
        ref={ref}
        className="d-flex gap-2 align-items-end flex-wrap p-2 border rounded-2 bg-light"
      >
        {renderEdit({
          handleKeyDown,
          onCancel: cancelEdit,
          submitting,
        })}
        <button
          className="btn btn-sm btn-outline-secondary"
          onClick={cancelEdit}
          disabled={submitting}
        >
          ביטול
        </button>
      </div>
    );
  }

  return (
    <div
      style={{ cursor: "pointer" }}
      className="d-flex align-items-center gap-2 p-2 border rounded-2"
      onClick={startEdit}
    >
      {renderDisplay(item)}
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

interface EditableListProps<T> {
  items: T[];
  getKey: (item: T, index: number) => string;
  renderRow: (
    item: T,
    submitting: boolean,
    setSubmitting: (v: boolean) => void,
  ) => ReactNode;
  renderAddForm: (
    submitting: boolean,
    setSubmitting: (v: boolean) => void,
  ) => ReactNode;
}

export function EditableList<T>({
  items,
  getKey,
  renderRow,
  renderAddForm,
}: EditableListProps<T>) {
  const [submitting, setSubmitting] = useState(false);

  return (
    <div>
      {items.length > 0 && (
        <div className="d-flex flex-column gap-2 mb-3">
          {items.map((item, idx) => (
            <div key={getKey(item, idx)}>
              {renderRow(item, submitting, setSubmitting)}
            </div>
          ))}
        </div>
      )}
      {renderAddForm(submitting, setSubmitting)}
    </div>
  );
}
