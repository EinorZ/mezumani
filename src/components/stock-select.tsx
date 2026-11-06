"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ChartNoAxesCombined,
  Check,
  ChevronDown,
  Search,
  X,
} from "lucide-react";
import { useClickOutside } from "@/hooks/use-click-outside";
import type { StockDefinition } from "@/lib/types";
import styles from "./stock-select.module.css";

interface Props {
  id: string;
  stocks: StockDefinition[];
  value: string;
  onChange: (symbol: string) => void;
}

export function StockSelect({ id, stocks, value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const selectedStock = stocks.find((stock) => stock.symbol === value);
  const terms = search.trim().toLocaleLowerCase().split(/\s+/);
  const filtered = stocks.filter((stock) => {
    const text = `${stock.displayName} ${stock.symbol}`.toLocaleLowerCase();
    return terms.every((term) => text.includes(term));
  });
  const listId = `${id}-options`;

  const close = useCallback(() => {
    setOpen(false);
    setSearch("");
  }, []);

  useClickOutside(containerRef, close, open);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    const list = listRef.current;
    const option = list?.children[activeIndex] as HTMLElement | undefined;
    if (!list || !option) return;
    if (option.offsetTop < list.scrollTop) {
      list.scrollTop = option.offsetTop;
    } else if (
      option.offsetTop + option.offsetHeight >
      list.scrollTop + list.clientHeight
    ) {
      list.scrollTop =
        option.offsetTop + option.offsetHeight - list.clientHeight;
    }
  }, [open, activeIndex, search]);

  function openPicker(last = false) {
    setSearch("");
    const selectedIndex = stocks.findIndex((stock) => stock.symbol === value);
    setActiveIndex(
      selectedIndex >= 0 ? selectedIndex : last ? stocks.length - 1 : 0,
    );
    setOpen(true);
  }

  function selectStock(stock: StockDefinition) {
    onChange(stock.symbol);
    close();
    triggerRef.current?.focus();
  }

  return (
    <div
      ref={containerRef}
      className={styles.root}
      dir="rtl"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) close();
      }}
      onKeyDownCapture={(event) => {
        if (open && event.key === "Escape") {
          event.preventDefault();
          event.stopPropagation();
          close();
          triggerRef.current?.focus();
        }
      }}
    >
      <button
        ref={triggerRef}
        id={id}
        type="button"
        className={styles.trigger}
        aria-labelledby={`${id}-label ${id}-value`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        onClick={() => (open ? close() : openPicker())}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            openPicker(event.key === "ArrowUp");
          }
        }}
      >
        <span className={styles.icon} aria-hidden="true">
          <ChartNoAxesCombined size={17} />
        </span>
        <span id={`${id}-value`} className={styles.selection}>
          {selectedStock ? (
            <>
              <span className={styles.name}>{selectedStock.displayName}</span>
              {selectedStock.displayName !== selectedStock.symbol && (
                <bdi className={styles.symbol}>{selectedStock.symbol}</bdi>
              )}
            </>
          ) : (
            <span className={styles.placeholder}>בחרו מניה...</span>
          )}
        </span>
        <ChevronDown size={16} className={styles.chevron} aria-hidden="true" />
      </button>

      {open && (
        <div className={styles.popover}>
          <div className={styles.search}>
            <Search size={17} aria-hidden="true" />
            <input
              ref={inputRef}
              className={styles.input}
              role="combobox"
              aria-label="חיפוש מניה לפי שם או סימול"
              aria-autocomplete="list"
              aria-expanded="true"
              aria-controls={listId}
              aria-activedescendant={
                filtered[activeIndex]
                  ? `${id}-option-${activeIndex}`
                  : undefined
              }
              placeholder="חיפוש לפי שם או סימול..."
              autoComplete="off"
              spellCheck={false}
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setActiveIndex(0);
              }}
              onKeyDown={(event) => {
                if (event.nativeEvent.isComposing) return;
                if (event.key === "ArrowDown" || event.key === "ArrowUp") {
                  event.preventDefault();
                  const direction = event.key === "ArrowDown" ? 1 : -1;
                  setActiveIndex((index) =>
                    filtered.length
                      ? (index + direction + filtered.length) % filtered.length
                      : 0,
                  );
                } else if (event.key === "Home" || event.key === "End") {
                  if (!event.ctrlKey) return;
                  event.preventDefault();
                  setActiveIndex(
                    event.key === "Home" ? 0 : filtered.length - 1,
                  );
                } else if (event.key === "Enter") {
                  event.preventDefault();
                  if (filtered[activeIndex]) selectStock(filtered[activeIndex]);
                }
              }}
            />
            {search && (
              <button
                type="button"
                className={styles.clear}
                aria-label="ניקוי החיפוש"
                onClick={() => {
                  setSearch("");
                  setActiveIndex(0);
                  inputRef.current?.focus();
                }}
              >
                <X size={15} aria-hidden="true" />
              </button>
            )}
          </div>
          <div className={styles.caption} role="status" aria-live="polite">
            {search.trim() ? "תוצאות החיפוש" : "מניות לבחירה"} ·{" "}
            {filtered.length}
          </div>
          <div
            ref={listRef}
            id={listId}
            role="listbox"
            aria-label="מניות"
            tabIndex={-1}
            className={styles.list}
          >
            {filtered.map((stock, index) => (
              <div
                key={stock.symbol}
                id={`${id}-option-${index}`}
                role="option"
                aria-selected={stock.symbol === value}
                className={styles.option}
                data-active={index === activeIndex}
                onMouseDown={(event) => event.preventDefault()}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => selectStock(stock)}
              >
                <div className={styles.details}>
                  <span className={styles.name}>{stock.displayName}</span>
                  <span className={styles.meta}>
                    <bdi>{stock.symbol}</bdi>
                    <span aria-hidden="true">·</span>
                    <span>{stock.currency === "ILS" ? "שקל" : "דולר"}</span>
                  </span>
                </div>
                {stock.symbol === value && (
                  <Check
                    size={17}
                    className={styles.check}
                    aria-hidden="true"
                  />
                )}
              </div>
            ))}
          </div>
          {filtered.length === 0 && (
            <div className={styles.empty}>
              <Search size={22} aria-hidden="true" />
              <strong>
                {stocks.length === 0 ? "אין מניות מוגדרות" : "לא נמצאו מניות"}
              </strong>
              <span>
                {stocks.length === 0
                  ? "הוסיפו מניה בהגדרות כדי להתחיל"
                  : "נסו לחפש בשם אחר או לפי סימול"}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
