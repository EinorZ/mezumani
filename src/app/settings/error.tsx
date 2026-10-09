"use client";

import { PageError } from "@/components/ui/route-state";

export default function SettingsError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return <PageError title="שגיאה בטעינת ההגדרות" error={error} reset={reset} />;
}
