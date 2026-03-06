"use client";

import { useOptimistic, useTransition } from "react";
import { toggleMonthDoneAction } from "@/lib/actions";

interface MonthDoneToggleProps {
  sheetTitle: string;
  initialDone: boolean;
}

export function MonthDoneToggle({ sheetTitle, initialDone }: MonthDoneToggleProps) {
  const [isPending, startTransition] = useTransition();
  const [optimisticDone, setOptimisticDone] = useOptimistic(initialDone);

  function handleClick() {
    const next = !optimisticDone;
    startTransition(async () => {
      setOptimisticDone(next);
      await toggleMonthDoneAction(sheetTitle, next);
    });
  }

  return (
    <button
      type="button"
      className={`btn btn-sm ${optimisticDone ? "btn-success" : "btn-outline-secondary"}`}
      onClick={handleClick}
      disabled={isPending}
    >
      {optimisticDone ? "חודש סגור \u2713" : "סגור חודש"}
    </button>
  );
}
