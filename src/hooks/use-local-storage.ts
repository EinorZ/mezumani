"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Like useState but reads/writes the value to localStorage.
 * The server snapshot always uses the initial value, while the browser
 * snapshot stays synchronized across this tab and other tabs.
 */
export function useLocalStorage<T>(
  key: string,
  initial: T,
): [T, (v: T) => void] {
  const eventName = `mezumani:storage:${key}`;
  const getSnapshot = useCallback(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored === null ? initial : (JSON.parse(stored) as T);
    } catch {
      return initial;
    }
  }, [initial, key]);

  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      function onStorage(event: StorageEvent) {
        if (event.key === key) onStoreChange();
      }
      window.addEventListener("storage", onStorage);
      window.addEventListener(eventName, onStoreChange);
      return () => {
        window.removeEventListener("storage", onStorage);
        window.removeEventListener(eventName, onStoreChange);
      };
    },
    [eventName, key],
  );

  const value = useSyncExternalStore(subscribe, getSnapshot, () => initial);

  function set(v: T) {
    try {
      localStorage.setItem(key, JSON.stringify(v));
      window.dispatchEvent(new Event(eventName));
    } catch {
      // ignore quota errors
    }
  }

  return [value, set];
}
