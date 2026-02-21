"use client";

import { useRef, useState } from "react";
import type { Transaction } from "@/lib/types";

/**
 * Manages bulk row selection state for the transaction table,
 * including shift-click range selection.
 */
export function useBulkSelection(rows: Transaction[]) {
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [bulkCategory, setBulkCategory] = useState("");
  const [bulkCard, setBulkCard] = useState("");
  const lastCheckedRef = useRef<number | null>(null);

  function toggleRow(row: number, shiftKey: boolean) {
    if (row < 0) return;

    if (shiftKey && lastCheckedRef.current !== null) {
      const rowNumbers = rows.map((t) => t.row).filter((r) => r >= 0);
      const from = rowNumbers.indexOf(lastCheckedRef.current);
      const to = rowNumbers.indexOf(row);
      if (from !== -1 && to !== -1) {
        const [start, end] = from < to ? [from, to] : [to, from];
        setSelectedRows((prev) => {
          const next = new Set(prev);
          for (let i = start; i <= end; i++) next.add(rowNumbers[i]);
          return next;
        });
        lastCheckedRef.current = row;
        return;
      }
    }

    lastCheckedRef.current = row;
    setSelectedRows((prev) => {
      const next = new Set(prev);
      if (next.has(row)) next.delete(row);
      else next.add(row);
      return next;
    });
  }

  function selectAll(visibleRows: Transaction[]) {
    const selectable = visibleRows.filter((t) => t.row >= 0);
    const allSelected =
      selectable.length > 0 &&
      selectable.every((t) => selectedRows.has(t.row));
    if (allSelected) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(selectable.map((t) => t.row)));
    }
  }

  function clearSelection() {
    setSelectedRows(new Set());
    setBulkCategory("");
    setBulkCard("");
  }

  return {
    selectedRows,
    bulkCategory,
    setBulkCategory,
    bulkCard,
    setBulkCard,
    toggleRow,
    selectAll,
    clearSelection,
  };
}
