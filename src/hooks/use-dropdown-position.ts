import { useEffect, type RefObject } from "react";

export function useDropdownPosition(
  containerRef: RefObject<HTMLElement | null>,
  open: boolean,
  setDropUp: (v: boolean) => void,
  threshold = 220,
) {
  useEffect(() => {
    if (open && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      setDropUp(spaceBelow < threshold);
    }
  }, [open, containerRef, setDropUp, threshold]);
}
