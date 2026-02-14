"use client";

import { useState } from "react";
import type { ExpenseRenameRule } from "@/lib/types";
import { EditableRow, EditableList } from "@/components/editable-list";

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
  const [editTarget, setEditTarget] = useState(item.targetName);
  const [editKeywords, setEditKeywords] = useState(item.keywords);

  const keywordList = item.keywords
    .split("|")
    .map((k) => k.trim())
    .filter(Boolean);

  return (
    <EditableRow
      item={item}
      submitting={submitting}
      setSubmitting={setSubmitting}
      onRemove={() => onRemove(item.targetName)}
      onStartEdit={() => {
        setEditTarget(item.targetName);
        setEditKeywords(item.keywords);
      }}
      onSave={async () => {
        const trimmedTarget = editTarget.trim();
        const trimmedKeywords = editKeywords.trim();
        if (!trimmedTarget || !trimmedKeywords) return;
        if (
          trimmedTarget === item.targetName &&
          trimmedKeywords === item.keywords
        )
          return;
        await onUpdate(item.targetName, trimmedTarget, trimmedKeywords);
      }}
      renderDisplay={() => (
        <>
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
        </>
      )}
      renderEdit={({ handleKeyDown }) => (
        <>
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
        </>
      )}
    />
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

  return (
    <EditableList
      items={items}
      getKey={(item, idx) => `${item.targetName}-${idx}`}
      renderRow={(item, submitting, setSubmitting) => (
        <RuleRow
          item={item}
          onUpdate={onUpdate}
          onRemove={onRemove}
          submitting={submitting}
          setSubmitting={setSubmitting}
        />
      )}
      renderAddForm={(submitting, setSubmitting) => {
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
        );
      }}
    />
  );
}
