"use client";

import { startTransition, useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Transaction, TransactionInput } from "@/lib/types";
import { revalidatePageAction } from "@/lib/actions";

type TransactionData = {
  date: string;
  expense: string;
  amount: number;
  category: string;
  card: string;
  notes: string;
};

type UndoEntry =
  | { type: "add"; tempRow: number }
  | { type: "edit"; row: number; original: TransactionData }
  | { type: "delete"; row: number; data: TransactionData };

let optimisticId = -1;
const REVALIDATE_DELAY = 3000;

interface Options {
  transactions: Transaction[];
  sheetTitle: string;
  pagePath: string;
  addAction: (title: string, input: TransactionInput) => Promise<number>;
  editAction: (title: string, row: number, input: TransactionInput) => Promise<void>;
  deleteAction: (title: string, row: number) => Promise<void>;
  onError?: (msg: string) => void;
}

/**
 * Manages optimistic add/edit/delete + undo stack for the transaction table.
 */
export function useOptimisticTransactions({
  transactions,
  sheetTitle,
  pagePath,
  addAction,
  editAction,
  deleteAction,
  onError,
}: Options) {
  const [pendingAdds, setPendingAdds] = useState<Transaction[]>([]);
  const [pendingEdits, setPendingEdits] = useState<Map<number, Transaction>>(new Map());
  const [pendingDeletes, setPendingDeletes] = useState<Set<number>>(new Set());
  const [_undoStack, setUndoStack] = useState<UndoEntry[]>([]);
  const inflightRef = useRef(0);
  const addedRowMapRef = useRef<Map<number, number>>(new Map());
  const cancelledAddsRef = useRef<Set<number>>(new Set());
  const revalidateTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function scheduleRevalidate() {
    if (revalidateTimer.current) clearTimeout(revalidateTimer.current);
    revalidateTimer.current = setTimeout(() => {
      startTransition(() => { revalidatePageAction(pagePath); });
      revalidateTimer.current = null;
    }, REVALIDATE_DELAY);
  }

  function flushRevalidate() {
    if (revalidateTimer.current) clearTimeout(revalidateTimer.current);
    revalidateTimer.current = null;
    startTransition(() => { revalidatePageAction(pagePath); });
  }

  // Clear optimistic state when server data updates AND no ops are in flight
  const prevTxRef = useRef(transactions);
  useEffect(() => {
    if (prevTxRef.current !== transactions) {
      prevTxRef.current = transactions;
      if (inflightRef.current === 0) {
        setPendingAdds([]);
        setPendingEdits(new Map());
        setPendingDeletes(new Set());
      }
    }
  }, [transactions]);

  const displayRows = useMemo(() => {
    const server = transactions
      .filter((t) => !pendingDeletes.has(t.row))
      .map((t) => pendingEdits.get(t.row) ?? t);
    return [...server, ...pendingAdds];
  }, [transactions, pendingEdits, pendingDeletes, pendingAdds]);

  function onInflightDone() {
    inflightRef.current--;
    scheduleRevalidate();
  }

  function handleAdd(input: TransactionInput & { date: string }) {
    const tempRow = optimisticId--;
    const optimisticTx: Transaction = {
      row: tempRow,
      date: input.date,
      expense: input.expense,
      amount: input.amount,
      category: input.category,
      card: input.card,
      notes: input.notes,
      tentative: input.tentative || undefined,
    };
    setPendingAdds((prev) => [...prev, optimisticTx]);
    setUndoStack((prev) => [...prev, { type: "add", tempRow }]);

    inflightRef.current++;
    addAction(sheetTitle, input)
      .then((realRow) => {
        addedRowMapRef.current.set(tempRow, realRow);
        if (cancelledAddsRef.current.has(tempRow)) {
          cancelledAddsRef.current.delete(tempRow);
          deleteAction(sheetTitle, realRow).finally(onInflightDone);
        } else {
          onInflightDone();
        }
      })
      .catch((e) => {
        onInflightDone();
        setPendingAdds((prev) => prev.filter((t) => t.row !== tempRow));
        onError?.(e instanceof Error ? e.message : "שגיאה בהוספת הוצאה");
      });
  }

  function handleEdit(row: number, input: TransactionInput & { date: string }) {
    const original = transactions.find((t) => t.row === row);
    if (original) {
      setUndoStack((prev) => [
        ...prev,
        {
          type: "edit",
          row,
          original: {
            date: original.date,
            expense: original.expense,
            amount: original.amount,
            category: original.category,
            card: original.card,
            notes: original.notes,
          },
        },
      ]);
    }

    const optimisticTx: Transaction = {
      row,
      date: input.date,
      expense: input.expense,
      amount: input.amount,
      category: input.category,
      card: input.card,
      notes: input.notes,
      tentative: input.tentative || undefined,
    };
    setPendingEdits((prev) => new Map(prev).set(row, optimisticTx));

    inflightRef.current++;
    editAction(sheetTitle, row, input)
      .then(onInflightDone)
      .catch((e) => {
        onInflightDone();
        setPendingEdits((prev) => {
          const next = new Map(prev);
          next.delete(row);
          return next;
        });
        onError?.(e instanceof Error ? e.message : "שגיאה בעריכת הוצאה");
      });
  }

  function handleDelete(row: number) {
    const original = transactions.find((t) => t.row === row);
    if (original) {
      setUndoStack((prev) => [
        ...prev,
        {
          type: "delete",
          row,
          data: {
            date: original.date,
            expense: original.expense,
            amount: original.amount,
            category: original.category,
            card: original.card,
            notes: original.notes,
          },
        },
      ]);
    }

    setPendingDeletes((prev) => new Set(prev).add(row));

    inflightRef.current++;
    deleteAction(sheetTitle, row)
      .then(onInflightDone)
      .catch((e) => {
        onInflightDone();
        setPendingDeletes((prev) => {
          const next = new Set(prev);
          next.delete(row);
          return next;
        });
        onError?.(e instanceof Error ? e.message : "שגיאה במחיקת הוצאה");
      });
  }

  function applyBulkEdits(rowEdits: { row: number; category?: string; card?: string }[], all: Transaction[]) {
    setPendingEdits((prev) => {
      const next = new Map(prev);
      for (const u of rowEdits) {
        const existing = all.find((t) => t.row === u.row);
        if (!existing) continue;
        const edited = { ...existing };
        if (u.category !== undefined) edited.category = u.category;
        if (u.card !== undefined) edited.card = u.card;
        next.set(u.row, edited);
      }
      return next;
    });
  }

  function revertBulkEdits(rows: number[]) {
    setPendingEdits((prev) => {
      const next = new Map(prev);
      for (const row of rows) next.delete(row);
      return next;
    });
  }

  function applyBulkDeletes(rows: number[]) {
    setPendingDeletes((prev) => {
      const next = new Set(prev);
      for (const row of rows) next.add(row);
      return next;
    });
  }

  function revertBulkDeletes(rows: number[]) {
    setPendingDeletes((prev) => {
      const next = new Set(prev);
      for (const row of rows) next.delete(row);
      return next;
    });
  }

  function applyBulkTentative(rows: number[], tentative: boolean, all: Transaction[]) {
    setPendingEdits((prev) => {
      const next = new Map(prev);
      for (const row of rows) {
        const existing = all.find((t) => t.row === row);
        if (!existing) continue;
        next.set(row, { ...existing, tentative: tentative || undefined });
      }
      return next;
    });
  }

  const handleUndo = useCallback(() => {
    setUndoStack((prev) => {
      if (prev.length === 0) return prev;
      const next = [...prev];
      const entry = next.pop()!;

      switch (entry.type) {
        case "add": {
          setPendingAdds((p) => p.filter((t) => t.row !== entry.tempRow));
          const realRow = addedRowMapRef.current.get(entry.tempRow);
          if (realRow !== undefined) {
            addedRowMapRef.current.delete(entry.tempRow);
            inflightRef.current++;
            deleteAction(sheetTitle, realRow)
              .then(onInflightDone)
              .catch(onInflightDone);
          } else {
            cancelledAddsRef.current.add(entry.tempRow);
          }
          break;
        }
        case "edit": {
          setPendingEdits((p) => {
            const m = new Map(p);
            m.delete(entry.row);
            return m;
          });
          inflightRef.current++;
          editAction(sheetTitle, entry.row, entry.original as TransactionInput)
            .then(onInflightDone)
            .catch(onInflightDone);
          break;
        }
        case "delete": {
          setPendingDeletes((p) => {
            const s = new Set(p);
            s.delete(entry.row);
            return s;
          });
          inflightRef.current++;
          addAction(sheetTitle, entry.data as TransactionInput)
            .then(onInflightDone)
            .catch(onInflightDone);
          break;
        }
      }

      return next;
    });
  }, [sheetTitle, addAction, deleteAction, editAction]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    displayRows,
    pendingAdds,
    pendingEdits,
    pendingDeletes,
    handleAdd,
    handleEdit,
    handleDelete,
    handleUndo,
    applyBulkEdits,
    revertBulkEdits,
    applyBulkDeletes,
    revertBulkDeletes,
    applyBulkTentative,
    inflightRef,
    flushRevalidate,
    onInflightDone,
  };
}
