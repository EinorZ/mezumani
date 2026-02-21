"use client";

import { useEffect } from "react";

/**
 * Calls `onClose` whenever the user presses Escape.
 */
export function useEscapeKey(onClose: () => void): void {
  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);
}
