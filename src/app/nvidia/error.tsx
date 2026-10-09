"use client";

import { PageError } from "@/components/ui/route-state";

export default function NvidiaError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <PageError title="שגיאה בטעינת נתוני NVIDIA" error={error} reset={reset} />
  );
}
