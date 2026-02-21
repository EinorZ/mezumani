"use client";

import { useState, useEffect } from "react";

/**
 * Like useState but reads/writes the value to localStorage.
 * The initial value is used on the server and on first render to
 * avoid hydration mismatches; the stored value is applied after mount.
 */
export function useLocalStorage<T>(
  key: string,
  initial: T,
): [T, (v: T) => void] {
  const [value, setValue] = useState<T>(initial);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(key);
      if (stored !== null) {
        setValue(JSON.parse(stored) as T);
      }
    } catch {
      // ignore parse errors
    }
  }, [key]);

  function set(v: T) {
    setValue(v);
    try {
      localStorage.setItem(key, JSON.stringify(v));
    } catch {
      // ignore quota errors
    }
  }

  return [value, set];
}
