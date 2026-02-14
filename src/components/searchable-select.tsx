"use client";

import { useSearchableDropdown } from "@/hooks/use-searchable-dropdown";

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
  const dd = useSearchableDropdown(options);

  function handleSelect(val: string) {
    onChange(val);
    dd.close();
  }

  return (
    <div ref={dd.containerRef} style={{ position: "relative", minWidth: "120px" }}>
      {value && !dd.open ? (
        <span
          className="badge rounded-pill"
          style={{
            backgroundColor: colorMap[value] || "#6c757d",
            cursor: "pointer",
          }}
          onClick={() => dd.setOpen(true)}
        >
          {value}
        </span>
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
          onKeyDown={(e) => dd.handleKeyDown(e, handleSelect)}
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
            dd.filtered.map((o, i) => (
              <div
                key={`${o}-${i}`}
                className="px-2 py-1"
                style={{
                  cursor: "pointer",
                  backgroundColor: i === dd.highlightIndex ? "#e9ecef" : undefined,
                }}
                onMouseDown={(e) => e.preventDefault()}
                onMouseEnter={() => dd.setHighlightIndex(i)}
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
