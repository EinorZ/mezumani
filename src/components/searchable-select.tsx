"use client";

import { useEffect, useRef, useState } from "react";

interface SearchableSelectProps {
  options: string[];
  colorMap: Record<string, string>;
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
}

export function SearchableSelect({
  options,
  colorMap,
  value,
  onChange,
  placeholder,
}: SearchableSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [dropUp, setDropUp] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        setSearch("");
        setHighlightIndex(-1);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
    if (open && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      setDropUp(spaceBelow < 220);
    }
    if (!open) {
      setHighlightIndex(-1);
    }
  }, [open]);

  const filtered = options.filter((o) =>
    o.toLowerCase().includes(search.toLowerCase()),
  );

  // Scroll highlighted item into view
  useEffect(() => {
    if (highlightIndex >= 0 && listRef.current) {
      const items = listRef.current.children;
      if (items[highlightIndex]) {
        items[highlightIndex].scrollIntoView({ block: "nearest" });
      }
    }
  }, [highlightIndex]);

  function handleSelect(val: string) {
    onChange(val);
    setOpen(false);
    setSearch("");
    setHighlightIndex(-1);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      e.stopPropagation();
      setHighlightIndex((prev) => (prev < filtered.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      e.stopPropagation();
      setHighlightIndex((prev) => (prev > 0 ? prev - 1 : filtered.length - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();
      if (highlightIndex >= 0 && highlightIndex < filtered.length) {
        handleSelect(filtered[highlightIndex]);
      }
    } else if (e.key === "Escape") {
      e.stopPropagation();
      setOpen(false);
      setSearch("");
      setHighlightIndex(-1);
    }
  }

  return (
    <div ref={containerRef} style={{ position: "relative", minWidth: "120px" }}>
      {value && !open ? (
        <span
          className="badge rounded-pill"
          style={{
            backgroundColor: colorMap[value] || "#6c757d",
            cursor: "pointer",
          }}
          onClick={() => setOpen(true)}
        >
          {value}
        </span>
      ) : (
        <input
          ref={inputRef}
          className="form-control form-control-sm"
          placeholder={placeholder}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setHighlightIndex(-1);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
        />
      )}
      {open && (
        <div
          ref={listRef}
          style={{
            position: "absolute",
            ...(dropUp ? { bottom: "100%" } : { top: "100%" }),
            right: 0,
            left: 0,
            zIndex: 1050,
            maxHeight: "200px",
            overflowY: "auto",
            backgroundColor: "#fff",
            border: "1px solid #dee2e6",
            borderRadius: "0.375rem",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          }}
        >
          {filtered.length === 0 ? (
            <div className="px-2 py-1 text-secondary small">אין תוצאות</div>
          ) : (
            filtered.map((o, i) => (
              <div
                key={`${o}-${i}`}
                className="px-2 py-1"
                style={{
                  cursor: "pointer",
                  backgroundColor: i === highlightIndex ? "#e9ecef" : undefined,
                }}
                onMouseDown={(e) => e.preventDefault()}
                onMouseEnter={() => setHighlightIndex(i)}
                onClick={() => handleSelect(o)}
              >
                <span
                  className="badge rounded-pill"
                  style={{
                    backgroundColor: colorMap[o] || "#6c757d",
                  }}
                >
                  {o}
                </span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
