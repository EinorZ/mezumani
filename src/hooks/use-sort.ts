"use client";

import { useMemo, useState } from "react";

type SortDir = "asc" | "desc";

/**
 * Generic sort hook. `sortFn` receives two items and the current sort key
 * and returns a comparison number (like Array.sort's comparator).
 */
export function useSort<T, K extends string>(
  rows: T[],
  sortFn: (a: T, b: T, key: K) => number,
) {
  const [sortKey, setSortKey] = useState<K | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  function toggleSort(key: K) {
    if (sortKey === key) {
      if (sortDir === "asc") {
        setSortDir("desc");
      } else {
        setSortKey(null);
        setSortDir("asc");
      }
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  const sortedRows = useMemo(() => {
    if (!sortKey) return rows;
    return [...rows].sort((a, b) => {
      const cmp = sortFn(a, b, sortKey);
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [rows, sortKey, sortDir, sortFn]);

  function sortIndicator(key: K): string {
    if (sortKey !== key) return " ⇅";
    return sortDir === "asc" ? " ▲" : " ▼";
  }

  return { sortKey, sortDir, toggleSort, sortedRows, sortIndicator };
}
