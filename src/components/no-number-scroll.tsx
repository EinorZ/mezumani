"use client";
import { useEffect } from "react";

export function NoNumberScroll() {
  useEffect(() => {
    function onWheel(e: WheelEvent) {
      const el = document.activeElement;
      if (el instanceof HTMLInputElement && el.type === "number") {
        e.preventDefault();
      }
    }
    document.addEventListener("wheel", onWheel, { passive: false });
    return () => document.removeEventListener("wheel", onWheel);
  }, []);
  return null;
}
