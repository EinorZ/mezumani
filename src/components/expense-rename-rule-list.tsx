"use client";

import { useState } from "react";
import type { ExpenseRenameRule } from "@/lib/types";

interface Props {
  items: ExpenseRenameRule[];
  onAdd: (targetName: string, keywords: string) => Promise<void>;
  onUpdate: (
    oldTargetName: string,
    targetName: string,
    keywords: string,
  ) => Promise<void>;
  onRemove: (targetName: string) => Promise<void>;
}

function RuleRow({
  item,
  onUpdate,
  onRemove,
  submitting,
  setSubmitting,
}: {
  item: ExpenseRenameRule;
  onUpdate: Props["onUpdate"];
  onRemove: Props["onRemove"];
  submitting: boolean;
  setSubmitting: (v: boolean) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [editTarget, setEditTarget] = useState(item.targetName);
  const [editKeywords, setEditKeywords] = useState(item.keywords);

  function startEdit() {
    setEditTarget(item.targetName);
    setEditKeywords(item.keywords);
    setEditing(true);
  }

  async function handleSave() {
    const trimmedTarget = editTarget.trim();
    const trimmedKeywords = editKeywords.trim();
    if (!trimmedTarget || !trimmedKeywords) return;
    if (
      trimmedTarget === item.targetName &&
      trimmedKeywords === item.keywords
    ) {
      setEditing(false);
      return;
    }
    setSubmitting(true);
    try {
      await onUpdate(item.targetName, trimmedTarget, trimmedKeywords);
      setEditing(false);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleRemove() {
    setSubmitting(true);
    try {
      await onRemove(item.targetName);
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
        <div style={{ minWidth: "120px" }}>
          <input
            className="form-control form-control-sm"
            value={editTarget}
            onChange={(e) => setEditTarget(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="שם חדש"
            autoFocus
          />
        </div>
        <div style={{ minWidth: "200px", flex: 1 }}>
          <input
            className="form-control form-control-sm"
            value={editKeywords}
            onChange={(e) => setEditKeywords(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="שופרסל|רמי לוי|סופר"
            dir="rtl"
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

  const keywordList = item.keywords
    .split("|")
    .map((k) => k.trim())
    .filter(Boolean);

  return (
    <div
      className="d-flex align-items-center gap-2 p-2 border rounded-2"
      style={{ cursor: "pointer" }}
      onClick={startEdit}
    >
      <span className="fw-bold small">{item.targetName}</span>
      <span className="text-secondary small">&larr;</span>
      <div className="d-flex gap-1 flex-wrap">
        {keywordList.map((kw, i) => (
          <span
            key={i}
            className="badge rounded-pill bg-secondary bg-opacity-25 text-dark"
            style={{ fontSize: "0.75rem" }}
          >
            {kw}
          </span>
        ))}
      </div>
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

export function ExpenseRenameRuleList({
  items,
  onAdd,
  onUpdate,
  onRemove,
}: Props) {
  const [targetName, setTargetName] = useState("");
  const [keywords, setKeywords] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleAdd() {
    const trimmedTarget = targetName.trim();
    const trimmedKeywords = keywords.trim();
    if (!trimmedTarget || !trimmedKeywords) return;
    setSubmitting(true);
    try {
      await onAdd(trimmedTarget, trimmedKeywords);
      setTargetName("");
      setKeywords("");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      {items.length > 0 && (
        <div className="d-flex flex-column gap-2 mb-3">
          {items.map((item, idx) => (
            <RuleRow
              key={`${item.targetName}-${idx}`}
              item={item}
              onUpdate={onUpdate}
              onRemove={onRemove}
              submitting={submitting}
              setSubmitting={setSubmitting}
            />
          ))}
        </div>
      )}

      <div className="d-flex gap-2 align-items-end flex-wrap">
        <div style={{ minWidth: "120px" }}>
          <label className="form-label small mb-1">שם חדש *</label>
          <input
            className="form-control form-control-sm"
            placeholder="למשל: סופרמרקט"
            value={targetName}
            onChange={(e) => setTargetName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          />
        </div>
        <div style={{ minWidth: "200px", flex: 1 }}>
          <label className="form-label small mb-1">מילות מפתח *</label>
          <input
            className="form-control form-control-sm"
            placeholder="שופרסל|רמי לוי|סופר יהודה"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            dir="rtl"
          />
        </div>
        <button
          className="btn btn-sm btn-success"
          onClick={handleAdd}
          disabled={submitting || !targetName.trim() || !keywords.trim()}
        >
          {submitting ? "..." : "הוסף"}
        </button>
      </div>
    </div>
  );
}
