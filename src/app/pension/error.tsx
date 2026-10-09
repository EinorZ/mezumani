"use client";

import { PageError } from "@/components/ui/route-state";

export default function PensionError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <PageError
      title="שגיאה בטעינת החיסכון הפנסיוני"
      error={error}
      reset={reset}
    />
  );
}
