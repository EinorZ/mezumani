import { useState, useRef, useEffect, useCallback } from "react";
import { useClickOutside } from "./use-click-outside";
import { useDropdownPosition } from "./use-dropdown-position";

export function useSearchableDropdown(options: string[]) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [dropUp, setDropUp] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    setSearch("");
    setHighlightIndex(-1);
  }, []);

  useClickOutside(containerRef, close);
  useDropdownPosition(containerRef, open, setDropUp);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
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

  function handleKeyDown(
    e: React.KeyboardEvent,
    onSelect: (val: string) => void,
  ) {
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
        onSelect(filtered[highlightIndex]);
      }
    } else if (e.key === "Escape") {
      e.stopPropagation();
      close();
    }
  }

  return {
    open,
    setOpen,
    search,
    setSearch,
    dropUp,
    highlightIndex,
    setHighlightIndex,
    containerRef,
    inputRef,
    listRef,
    filtered,
    close,
    handleKeyDown,
  };
}
