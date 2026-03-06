"use client";

import { useState, useEffect, useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useDebouncedCallback } from "@/hooks/use-debounced-callback";
import { searchAllSheetsAction } from "@/lib/actions";

type SearchResult = Awaited<ReturnType<typeof searchAllSheetsAction>>;

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult>([]);
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Cmd+K / Ctrl+K listener
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Focus input when modal opens
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
      setResults([]);
    }
  }, [open]);

  const debouncedSearch = useDebouncedCallback((q: string) => {
    if (q.trim().length < 2) {
      setResults([]);
      return;
    }
    startTransition(async () => {
      const res = await searchAllSheetsAction(q);
      setResults(res);
    });
  }, 300);

  function handleInputChange(value: string) {
    setQuery(value);
    debouncedSearch(value);
  }

  function navigate(sheetId: number, type: string) {
    const path =
      type === "vacation" ? `/vacation/${sheetId}` : `/month/${sheetId}`;
    router.push(path);
    setOpen(false);
  }

  if (!open) return null;

  return (
    <div
      className="global-search-overlay"
      onClick={() => setOpen(false)}
      onKeyDown={(e) => {
        if (e.key === "Escape") setOpen(false);
      }}
    >
      <div
        className="global-search-dialog"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="global-search-input-wrapper">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="global-search-icon"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            className="global-search-input"
            placeholder="חיפוש הוצאות..."
            value={query}
            onChange={(e) => handleInputChange(e.target.value)}
          />
          <kbd className="global-search-kbd">Esc</kbd>
        </div>

        <div className="global-search-results">
          {isPending && (
            <div className="global-search-loading">
              <div className="spinner-border spinner-border-sm" role="status" />
            </div>
          )}

          {!isPending && query.trim().length >= 2 && results.length === 0 && (
            <div className="global-search-empty">לא נמצאו תוצאות</div>
          )}

          {results.map((sheet) => (
            <div key={sheet.sheetId} className="global-search-group">
              <div className="global-search-group-title">
                {sheet.sheetTitle}
              </div>
              {sheet.results.map((r, idx) => (
                <button
                  key={`${sheet.sheetId}-${r.row}-${idx}`}
                  className="global-search-item"
                  onClick={() => navigate(sheet.sheetId, sheet.type)}
                >
                  <span className="global-search-item-name">{r.expense}</span>
                  {r.date && (
                    <span className="global-search-item-date">{r.date}</span>
                  )}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
