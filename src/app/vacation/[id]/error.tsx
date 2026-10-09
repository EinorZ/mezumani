"use client";

import { PageError } from "@/components/ui/route-state";

export default function VacationError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <PageError title="שגיאה בטעינת נתוני החופשה" error={error} reset={reset} />
  );
}
