"use client";

import { PageError } from "@/components/ui/route-state";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return <PageError title="שגיאה בטעינת החודש" error={error} reset={reset} />;
}
