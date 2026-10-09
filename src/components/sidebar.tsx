"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { SheetInfo, YearGroup } from "@/lib/types";
import { stripYearSuffix } from "@/lib/utils";
import {
  renameSheetAction,
  createVacation,
  moveSheetAfterAction,
} from "@/lib/actions";
import { useTheme } from "@/components/theme-provider";
import { useEscapeKey } from "@/hooks/use-escape-key";
import {
  CalendarRange,
  Menu,
  Moon,
  PieChart,
  Settings,
  Sun,
  WalletCards,
  X,
} from "lucide-react";

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
      aria-current={isActive ? "page" : undefined}
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
  const { theme, toggleTheme } = useTheme();
  const currentYearSuffix = new Date().getFullYear() % 100;

  const [pinned, setPinned] = useLocalStorage("sidebar-pinned", false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const [showVacationForm, setShowVacationForm] = useState<number | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const pointerFocusRef = useRef(false);

  // Close sidebar on navigation
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const closeMobile = useCallback(() => {
    setMobileOpen(false);
    requestAnimationFrame(() => menuButtonRef.current?.focus());
  }, []);

  const closeMobileOnEscape = useCallback(() => {
    if (mobileOpen) closeMobile();
  }, [closeMobile, mobileOpen]);

  useEscapeKey(closeMobileOnEscape);

  useEffect(() => {
    if (!mobileOpen) return;
    closeButtonRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileOpen]);

  // Drag-to-reorder for vacation lists (keyed by year)
  const [vacationOrders, setVacationOrders] = useState<
    Record<number, SheetInfo[]>
  >(() => Object.fromEntries(yearGroups.map((g) => [g.year, g.vacations])));
  useEffect(() => {
    setVacationOrders(
      Object.fromEntries(yearGroups.map((g) => [g.year, g.vacations])),
    );
  }, [yearGroups]);
  const dragItem = useRef<{ year: number; index: number } | null>(null);
  const dragOver = useRef<number | null>(null);
  const [vacationName, setVacationName] = useState("");
  const [vacationSubmitting, setVacationSubmitting] = useState(false);

  function togglePin() {
    setPinned(!pinned);
  }

  function handleSidebarPointerDown() {
    pointerFocusRef.current = true;
    setKeyboardOpen(false);
  }

  function handleSidebarPointerEnd() {
    requestAnimationFrame(() => {
      pointerFocusRef.current = false;
    });
  }

  function handleSidebarFocus(event: React.FocusEvent<HTMLElement>) {
    if (
      !pointerFocusRef.current &&
      event.target instanceof HTMLElement &&
      event.target.matches(":focus-visible")
    ) {
      setKeyboardOpen(true);
    }
  }

  function handleSidebarBlur(event: React.FocusEvent<HTMLElement>) {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      setKeyboardOpen(false);
    }
  }

  function handleSidebarKeyDown(event: React.KeyboardEvent<HTMLElement>) {
    setKeyboardOpen(event.key !== "Escape");
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

  const currentYear =
    yearGroups.find((group) => group.year === currentYearSuffix) ??
    yearGroups[0];

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
    <>
      <header className="mobile-app-bar d-md-none">
        <button
          ref={menuButtonRef}
          className="mobile-menu-trigger"
          onClick={() => setMobileOpen(true)}
          aria-label="פתיחת תפריט הניווט"
          aria-expanded={mobileOpen}
          aria-controls="primary-sidebar"
          type="button"
        >
          <Menu size={22} aria-hidden="true" />
        </button>
        <span className="mobile-app-brand">מזומני</span>
        <span className="mobile-app-bar-spacer" aria-hidden="true" />
      </header>

      {/* Mobile backdrop */}
      {mobileOpen && (
        <button
          className="sidebar-backdrop d-md-none"
          onClick={closeMobile}
          aria-label="סגירת תפריט הניווט"
          type="button"
        />
      )}

      <aside
        id="primary-sidebar"
        aria-label="ניווט ראשי"
        className={`sidebar${pinned ? " pinned" : ""}${keyboardOpen ? " keyboard-open" : ""}${mobileOpen ? " mobile-open" : ""}`}
        onPointerDown={handleSidebarPointerDown}
        onPointerUp={handleSidebarPointerEnd}
        onPointerCancel={handleSidebarPointerEnd}
        onFocus={handleSidebarFocus}
        onBlur={handleSidebarBlur}
        onKeyDown={handleSidebarKeyDown}
      >
        <div className="sidebar-header d-flex flex-column align-items-center">
          <span
            className="sidebar-hamburger"
            style={{ fontSize: "1.5rem", cursor: "pointer" }}
          >
            ☰
          </span>
          {/* Mobile close button */}
          <button
            ref={closeButtonRef}
            className="d-md-none sidebar-expanded-only btn btn-link text-secondary p-0"
            onClick={closeMobile}
            aria-label="סגירת תפריט הניווט"
            type="button"
          >
            <X size={24} aria-hidden="true" />
          </button>
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
            aria-pressed={pinned}
            type="button"
          >
            {pinned ? "◀" : "▶"}
          </button>
        </div>

        <nav className="sidebar-nav">
          {/* Stock portfolio — always visible, above year groups */}
          <div
            className="sidebar-section-label"
            style={{
              background: "none",
              border: "none",
              padding: "0.5rem 1.5rem 0.2rem",
            }}
          >
            השקעות
          </div>
          <Link
            href="/stocks"
            className={`sidebar-link ${isActive("/stocks") ? "active" : ""}`}
          >
            תיק מניות
          </Link>
          <Link
            href="/nvidia"
            className={`sidebar-link ${isActive("/nvidia") ? "active" : ""}`}
          >
            NVIDIA
          </Link>
          <Link
            href="/pension"
            className={`sidebar-link ${isActive("/pension") ? "active" : ""}`}
          >
            חיסכון פנסיוני
          </Link>

          {yearGroups.map((group) => {
            const expanded = expandedYears.has(group.year);
            return (
              <div key={group.year} className="year-group">
                <button
                  className="year-toggle"
                  onClick={() => toggleYear(group.year)}
                  aria-expanded={expanded}
                  type="button"
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
                        aria-expanded={expandedSections.has(
                          `${group.year}-months`,
                        )}
                        type="button"
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
                          maxHeight: expandedSections.has(
                            `${group.year}-months`,
                          )
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
                      aria-expanded={expandedSections.has(
                        `${group.year}-vacations`,
                      )}
                      type="button"
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
                      aria-label={`חופשה חדשה לשנת ${group.fullYear}`}
                      type="button"
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
                    {(vacationOrders[group.year] ?? group.vacations).map(
                      (v, idx) => {
                        const href = `/vacation/${v.sheetId}`;
                        return (
                          <div
                            key={v.sheetId}
                            draggable
                            onDragStart={() => {
                              dragItem.current = {
                                year: group.year,
                                index: idx,
                              };
                            }}
                            onDragEnter={() => {
                              dragOver.current = idx;
                            }}
                            onDragOver={(e) => e.preventDefault()}
                            onDragEnd={async () => {
                              const from = dragItem.current;
                              const toIdx = dragOver.current;
                              dragItem.current = null;
                              dragOver.current = null;
                              if (
                                !from ||
                                toIdx === null ||
                                from.index === toIdx
                              )
                                return;
                              const items = [
                                ...(vacationOrders[from.year] ??
                                  group.vacations),
                              ];
                              const [moved] = items.splice(from.index, 1);
                              items.splice(toIdx, 0, moved);
                              setVacationOrders((prev) => ({
                                ...prev,
                                [from.year]: items,
                              }));
                              // Move after the preceding sibling in the new order
                              const prevSibling = items[toIdx - 1] ?? null;
                              await moveSheetAfterAction(
                                moved.sheetId,
                                prevSibling?.sheetId ?? null,
                              );
                              router.refresh();
                            }}
                            style={{ cursor: "grab" }}
                          >
                            <EditableSheetLink
                              sheet={v}
                              href={href}
                              isActive={isActive(href)}
                              yearSuffix={group.year}
                            />
                          </div>
                        );
                      },
                    )}
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
          <button
            className="sidebar-link sidebar-footer-action border-0 w-100 text-start"
            style={{ background: "none", cursor: "pointer" }}
            onClick={toggleTheme}
            title={theme === "light" ? "Dark mode" : "Light mode"}
            type="button"
          >
            {theme === "light" ? (
              <Moon size={17} aria-hidden="true" />
            ) : (
              <Sun size={17} aria-hidden="true" />
            )}
            <span>{theme === "light" ? "מצב כהה" : "מצב בהיר"}</span>
          </button>
          <Link
            href="/settings"
            className={`sidebar-link ${isActive("/settings") ? "active" : ""}`}
          >
            <Settings size={17} aria-hidden="true" />
            <span>הגדרות</span>
          </Link>
        </div>
      </aside>

      <nav className="mobile-bottom-nav d-md-none" aria-label="ניווט מהיר">
        <Link
          href="/"
          className={`mobile-bottom-nav-item${pathname.startsWith("/month/") ? " active" : ""}`}
          aria-current={pathname.startsWith("/month/") ? "page" : undefined}
        >
          <WalletCards size={20} aria-hidden="true" />
          <span>חודש</span>
        </Link>
        {currentYear ? (
          <Link
            href={`/year/${currentYear.year}`}
            className={`mobile-bottom-nav-item${pathname === `/year/${currentYear.year}` ? " active" : ""}`}
            aria-current={
              pathname === `/year/${currentYear.year}` ? "page" : undefined
            }
          >
            <CalendarRange size={20} aria-hidden="true" />
            <span>שנתי</span>
          </Link>
        ) : (
          <span className="mobile-bottom-nav-item disabled">
            <CalendarRange size={20} aria-hidden="true" />
            <span>שנתי</span>
          </span>
        )}
        <Link
          href="/stocks"
          className={`mobile-bottom-nav-item${pathname === "/stocks" ? " active" : ""}`}
          aria-current={pathname === "/stocks" ? "page" : undefined}
        >
          <PieChart size={20} aria-hidden="true" />
          <span>תיק</span>
        </Link>
        <Link
          href="/settings"
          className={`mobile-bottom-nav-item${pathname === "/settings" ? " active" : ""}`}
          aria-current={pathname === "/settings" ? "page" : undefined}
        >
          <Settings size={20} aria-hidden="true" />
          <span>הגדרות</span>
        </Link>
      </nav>
    </>
  );
}
