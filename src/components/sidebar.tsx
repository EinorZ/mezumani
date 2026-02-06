"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { SheetInfo, YearGroup } from "@/lib/types";
import { stripYearSuffix } from "@/lib/utils";
import { renameSheetAction } from "@/lib/actions";

interface Props {
  yearGroups: YearGroup[];
}

function EditableSheetLink({
  sheet,
  href,
  isActive,
  yearSuffix,
}: {
  sheet: SheetInfo;
  href: string;
  isActive: boolean;
  yearSuffix: number;
}) {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function startEdit() {
    setEditValue(stripYearSuffix(sheet.title));
    setEditing(true);
  }

  async function handleSave() {
    const trimmed = editValue.trim();
    if (!trimmed || trimmed === stripYearSuffix(sheet.title)) {
      setEditing(false);
      return;
    }
    setSubmitting(true);
    try {
      await renameSheetAction(sheet.sheetId, `${trimmed} ${yearSuffix}`);
      setEditing(false);
    } finally {
      setSubmitting(false);
    }
  }

  if (editing) {
    return (
      <div className="sidebar-link px-2 py-1">
        <input
          className="form-control form-control-sm"
          style={{ fontSize: "0.85rem" }}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSave();
            if (e.key === "Escape") setEditing(false);
          }}
          onBlur={handleSave}
          disabled={submitting}
          autoFocus
        />
      </div>
    );
  }

  return (
    <Link
      href={href}
      className={`sidebar-link ${isActive ? "active" : ""}`}
      onDoubleClick={(e) => {
        e.preventDefault();
        startEdit();
      }}
      title="לחץ פעמיים לשינוי שם"
    >
      {stripYearSuffix(sheet.title)}
    </Link>
  );
}

export function Sidebar({ yearGroups }: Props) {
  const pathname = usePathname();
  const currentYearSuffix = new Date().getFullYear() % 100;

  const [expandedYears, setExpandedYears] = useState<Set<number>>(() => {
    const initial = new Set<number>();
    if (yearGroups.some((g) => g.year === currentYearSuffix)) {
      initial.add(currentYearSuffix);
    } else if (yearGroups.length > 0) {
      initial.add(yearGroups[0].year);
    }
    return initial;
  });

  function toggleYear(year: number) {
    setExpandedYears((prev) => {
      const next = new Set(prev);
      if (next.has(year)) {
        next.delete(year);
      } else {
        next.add(year);
      }
      return next;
    });
  }

  function isActive(href: string) {
    return pathname === href;
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1 className="h5 fw-bold mb-0">
          <span className="sidebar-icon">$</span>
          <span className="sidebar-text">Mezumani</span>
        </h1>
      </div>

      <nav className="sidebar-nav">
        {yearGroups.map((group) => {
          const expanded = expandedYears.has(group.year);
          return (
            <div key={group.year} className="year-group">
              <button
                className="year-toggle"
                onClick={() => toggleYear(group.year)}
              >
                <span className="year-arrow">{expanded ? "▼" : "◀"}</span>
                <span className="fw-bold">{group.fullYear}</span>
              </button>

              <div
                className="year-content"
                style={{
                  maxHeight: expanded ? "1000px" : "0",
                  overflow: "hidden",
                  transition: "max-height 200ms ease",
                }}
              >
                {group.hasAnnual && (
                  <Link
                    href={`/year/${group.year}`}
                    className={`sidebar-link ${isActive(`/year/${group.year}`) ? "active" : ""}`}
                  >
                    סיכום שנתי
                  </Link>
                )}

                {group.months.length > 0 && (
                  <>
                    <div className="sidebar-section-label">חודשים</div>
                    {group.months.map((m) => {
                      const href = `/month/${m.sheetId}`;
                      return (
                        <EditableSheetLink
                          key={m.sheetId}
                          sheet={m}
                          href={href}
                          isActive={isActive(href)}
                          yearSuffix={group.year}
                        />
                      );
                    })}
                  </>
                )}

                {group.vacations.length > 0 && (
                  <>
                    <div className="sidebar-section-label">חופשות</div>
                    {group.vacations.map((v) => {
                      const href = `/vacation/${v.sheetId}`;
                      return (
                        <EditableSheetLink
                          key={v.sheetId}
                          sheet={v}
                          href={href}
                          isActive={isActive(href)}
                          yearSuffix={group.year}
                        />
                      );
                    })}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <Link
          href="/settings"
          className={`sidebar-link ${isActive("/settings") ? "active" : ""}`}
        >
          ⚙ הגדרות
        </Link>
      </div>
    </aside>
  );
}
