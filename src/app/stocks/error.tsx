"use client";

import { PageError } from "@/components/ui/route-state";

export default function StocksError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <PageError title="שגיאה בטעינת תיק המניות" error={error} reset={reset} />
  );
}
