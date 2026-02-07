"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { SheetInfo, YearGroup } from "@/lib/types";
import { stripYearSuffix } from "@/lib/utils";
import { renameSheetAction, createVacation } from "@/lib/actions";

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
  const router = useRouter();
  const currentYearSuffix = new Date().getFullYear() % 100;

  const [pinned, setPinned] = useState(false);
  const [showVacationForm, setShowVacationForm] = useState<number | null>(null);
  const [vacationName, setVacationName] = useState("");
  const [vacationSubmitting, setVacationSubmitting] = useState(false);

  useEffect(() => {
    setPinned(localStorage.getItem("sidebar-pinned") === "true");
  }, []);

  function togglePin() {
    setPinned((prev) => {
      const next = !prev;
      localStorage.setItem("sidebar-pinned", String(next));
      return next;
    });
  }

  const [expandedYears, setExpandedYears] = useState<Set<number>>(() => {
    const initial = new Set<number>();
    if (yearGroups.some((g) => g.year === currentYearSuffix)) {
      initial.add(currentYearSuffix);
    } else if (yearGroups.length > 0) {
      initial.add(yearGroups[0].year);
    }
    return initial;
  });

  const [expandedSections, setExpandedSections] = useState<Set<string>>(() => {
    const initial = new Set<string>();
    const activeYear = yearGroups.some((g) => g.year === currentYearSuffix)
      ? currentYearSuffix
      : yearGroups[0]?.year;
    if (activeYear !== undefined) {
      initial.add(`${activeYear}-months`);
      initial.add(`${activeYear}-vacations`);
    }
    return initial;
  });

  function toggleSection(key: string) {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

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

  async function handleCreateVacation(yearSuffix: number) {
    const trimmed = vacationName.trim();
    if (!trimmed) return;
    setVacationSubmitting(true);
    try {
      await createVacation(trimmed, yearSuffix);
      setVacationName("");
      setShowVacationForm(null);
      router.refresh();
    } catch {
      // silently fail
    } finally {
      setVacationSubmitting(false);
    }
  }

  return (
    <aside className={`sidebar${pinned ? " pinned" : ""}`}>
      <div className="sidebar-header d-flex flex-column align-items-center">
        <span
          className="sidebar-hamburger"
          style={{ fontSize: "1.5rem", cursor: "pointer" }}
        >
          ☰
        </span>
        <Image
          src="/mezumani_logo.png"
          alt="Mezumani"
          width={200}
          height={200}
          className="sidebar-logo sidebar-expanded-only"
          style={{ width: "100%", height: "auto" }}
        />
        <span
          className="sidebar-text fw-bold text-center"
          style={{ fontSize: "1.1rem", marginTop: "-0.75rem" }}
        >
          Mezumani
        </span>
        <button
          className={`sidebar-pin-btn${pinned ? " active" : ""}`}
          onClick={togglePin}
          title={pinned ? "בטל הצמדה" : "הצמד סרגל צד"}
        >
          {pinned ? "◀" : "▶"}
        </button>
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
                {group.months.length > 0 && (
                  <Link
                    href={`/year/${group.year}`}
                    className={`sidebar-link ${isActive(`/year/${group.year}`) ? "active" : ""}`}
                  >
                    סיכום שנתי
                  </Link>
                )}

                {group.months.length > 0 && (
                  <>
                    <button
                      className="sidebar-section-label"
                      onClick={() => toggleSection(`${group.year}-months`)}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        width: "100%",
                        textAlign: "right",
                        padding: "0.35rem 0.75rem",
                      }}
                    >
                      <span
                        className="year-arrow"
                        style={{ fontSize: "0.6rem", marginLeft: 4 }}
                      >
                        {expandedSections.has(`${group.year}-months`)
                          ? "▼"
                          : "◀"}
                      </span>
                      חודשים
                    </button>
                    <div
                      style={{
                        maxHeight: expandedSections.has(`${group.year}-months`)
                          ? "1000px"
                          : "0",
                        overflow: "hidden",
                        transition: "max-height 200ms ease",
                      }}
                    >
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
                    </div>
                  </>
                )}

                <div
                  className="d-flex align-items-center"
                  style={{ padding: "0.35rem 0.75rem" }}
                >
                  <button
                    className="sidebar-section-label p-0 m-0"
                    onClick={() => toggleSection(`${group.year}-vacations`)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      textAlign: "right",
                      flex: 1,
                    }}
                  >
                    <span
                      className="year-arrow"
                      style={{ fontSize: "0.6rem", marginLeft: 4 }}
                    >
                      {expandedSections.has(`${group.year}-vacations`)
                        ? "▼"
                        : "◀"}
                    </span>
                    חופשות
                  </button>
                  <button
                    className="sidebar-add-btn"
                    onClick={() => {
                      setShowVacationForm((prev) =>
                        prev === group.year ? null : group.year,
                      );
                      setVacationName("");
                      // Also expand the vacations section
                      setExpandedSections((prev) => {
                        const next = new Set(prev);
                        next.add(`${group.year}-vacations`);
                        return next;
                      });
                    }}
                    title="חופשה חדשה"
                  >
                    +
                  </button>
                </div>
                <div
                  style={{
                    maxHeight: expandedSections.has(`${group.year}-vacations`)
                      ? "1000px"
                      : "0",
                    overflow: "hidden",
                    transition: "max-height 200ms ease",
                  }}
                >
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
                  {showVacationForm === group.year && (
                    <div className="sidebar-link px-2 py-1">
                      <input
                        className="form-control form-control-sm"
                        style={{ fontSize: "0.85rem" }}
                        placeholder="שם החופשה..."
                        value={vacationName}
                        onChange={(e) => setVacationName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter")
                            handleCreateVacation(group.year);
                          if (e.key === "Escape") setShowVacationForm(null);
                        }}
                        disabled={vacationSubmitting}
                        autoFocus
                      />
                    </div>
                  )}
                </div>
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
