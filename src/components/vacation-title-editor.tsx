"use client";

import { useState, useRef, useEffect } from "react";

import { renameSheetAction } from "@/lib/actions";
import { useRouter } from "next/navigation";

interface Props {
  sheetId: number;
  title: string;
  pagePath: string;
}

export function VacationTitleEditor({ sheetId, title, pagePath }: Props) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(title);
  const [saving, setSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (editing) inputRef.current?.select();
  }, [editing]);

  async function save() {
    const trimmed = value.trim();
    if (!trimmed || trimmed === title) {
      setValue(title);
      setEditing(false);
      return;
    }
    setSaving(true);
    try {
      await renameSheetAction(sheetId, trimmed, pagePath);
      router.refresh();
    } finally {
      setSaving(false);
      setEditing(false);
    }
  }

  if (editing) {
    return (
      <input
        ref={inputRef}
        className="form-control form-control-sm h4 fw-bold mb-0"
        style={{ maxWidth: 400, fontSize: "1.25rem" }}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={save}
        onKeyDown={(e) => {
          if (e.key === "Enter") save();
          if (e.key === "Escape") { setValue(title); setEditing(false); }
        }}
        disabled={saving}
      />
    );
  }

  return (
    <h1 className="h4 fw-bold mb-0" onDoubleClick={() => setEditing(true)} style={{ cursor: "text" }}>
      {title}
    </h1>
  );
}
