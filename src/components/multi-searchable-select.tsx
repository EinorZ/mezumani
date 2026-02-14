"use client";

import { useSearchableDropdown } from "@/hooks/use-searchable-dropdown";

interface MultiSearchableSelectProps {
  options: string[];
  colorMap: Record<string, string>;
  selected: Set<string>;
  onChange: (selected: Set<string>) => void;
  placeholder: string;
}

export function MultiSearchableSelect({
  options,
  colorMap,
  selected,
  onChange,
  placeholder,
}: MultiSearchableSelectProps) {
  const dd = useSearchableDropdown(options);

  function toggleOption(val: string) {
    const next = new Set(selected);
    if (next.has(val)) {
      next.delete(val);
    } else {
      next.add(val);
    }
    onChange(next);
  }

  return (
    <div ref={dd.containerRef} style={{ position: "relative", minWidth: "120px" }}>
      {selected.size > 0 && !dd.open ? (
        <div
          style={{
            cursor: "pointer",
            display: "flex",
            flexWrap: "wrap",
            gap: "4px",
            alignItems: "center",
          }}
          onClick={() => dd.setOpen(true)}
        >
          {[...selected].map((val) => (
            <span
              key={val}
              className="badge rounded-pill d-inline-flex align-items-center gap-1"
              style={{ backgroundColor: colorMap[val] || "#6c757d" }}
            >
              {val}
              <span
                style={{ cursor: "pointer", fontSize: "0.7em", lineHeight: 1 }}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleOption(val);
                }}
              >
                ✕
              </span>
            </span>
          ))}
        </div>
      ) : (
        <input
          ref={dd.inputRef}
          className="form-control form-control-sm"
          placeholder={placeholder}
          value={dd.search}
          onChange={(e) => {
            dd.setSearch(e.target.value);
            dd.setHighlightIndex(-1);
          }}
          onFocus={() => dd.setOpen(true)}
          onKeyDown={(e) => dd.handleKeyDown(e, toggleOption)}
        />
      )}
      {dd.open && (
        <div
          ref={dd.listRef}
          style={{
            position: "absolute",
            ...(dd.dropUp ? { bottom: "100%" } : { top: "100%" }),
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
          {dd.filtered.length === 0 ? (
            <div className="px-2 py-1 text-secondary small">אין תוצאות</div>
          ) : (
            dd.filtered.map((o, i) => {
              const isSelected = selected.has(o);
              return (
                <div
                  key={`${o}-${i}`}
                  className="px-2 py-1 d-flex align-items-center gap-2"
                  style={{
                    cursor: "pointer",
                    backgroundColor:
                      i === dd.highlightIndex ? "#e9ecef" : undefined,
                  }}
                  onMouseDown={(e) => e.preventDefault()}
                  onMouseEnter={() => dd.setHighlightIndex(i)}
                  onClick={() => toggleOption(o)}
                >
                  <span
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: 3,
                      border: "2px solid #adb5bd",
                      backgroundColor: isSelected
                        ? colorMap[o] || "#6c757d"
                        : "transparent",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      fontSize: 10,
                      color: "#fff",
                    }}
                  >
                    {isSelected && "✓"}
                  </span>
                  <span
                    className="badge rounded-pill"
                    style={{ backgroundColor: colorMap[o] || "#6c757d" }}
                  >
                    {o}
                  </span>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
