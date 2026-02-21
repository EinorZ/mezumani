"use client";

import { useState } from "react";
import { revalidatePageAction } from "@/lib/actions";

/**
 * Returns a `refreshing` flag and a `handleRefresh` function that
 * revalidates the given path and reloads the page.
 */
export function usePageRefresh(path: string) {
  const [refreshing, setRefreshing] = useState(false);

  async function handleRefresh() {
    setRefreshing(true);
    try {
      await revalidatePageAction(path);
      window.location.reload();
    } finally {
      setRefreshing(false);
    }
  }

  return { refreshing, handleRefresh };
}
