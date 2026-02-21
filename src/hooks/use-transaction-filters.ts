"use client";

import { useMemo, useState } from "react";
import type { Transaction } from "@/lib/types";

/**
 * Manages search + category/card filter state for the transaction table.
 */
export function useTransactionFilters(rows: Transaction[]) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategories, setFilterCategories] = useState<Set<string>>(
    new Set(),
  );
  const [excludeCategories, setExcludeCategories] = useState<Set<string>>(
    new Set(),
  );
  const [filterCards, setFilterCards] = useState<Set<string>>(new Set());

  const filteredRows = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return rows.filter((t) => {
      if (
        q &&
        !t.expense.toLowerCase().includes(q) &&
        !t.notes.toLowerCase().includes(q)
      )
        return false;
      if (filterCategories.size > 0 && !filterCategories.has(t.category))
        return false;
      if (excludeCategories.size > 0 && excludeCategories.has(t.category))
        return false;
      if (filterCards.size > 0 && !filterCards.has(t.card)) return false;
      return true;
    });
  }, [rows, searchQuery, filterCategories, excludeCategories, filterCards]);

  const hasActiveFilters =
    !!searchQuery ||
    filterCategories.size > 0 ||
    excludeCategories.size > 0 ||
    filterCards.size > 0;

  function clearFilters() {
    setSearchQuery("");
    setFilterCategories(new Set());
    setExcludeCategories(new Set());
    setFilterCards(new Set());
  }

  return {
    searchQuery,
    setSearchQuery,
    filterCategories,
    setFilterCategories,
    excludeCategories,
    setExcludeCategories,
    filterCards,
    setFilterCards,
    filteredRows,
    hasActiveFilters,
    clearFilters,
  };
}
