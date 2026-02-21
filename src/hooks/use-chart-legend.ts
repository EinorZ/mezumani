"use client";

import { useCallback, useRef, useState } from "react";

/**
 * Shared legend interaction logic for pie/treemap charts.
 * Handles single-click hide/show (debounced) and double-click isolate/restore.
 */
export function useChartLegend<T>(
  data: T[],
  getKey: (item: T) => string,
) {
  const [hoveredIndex, setHoveredIndex] = useState<number | undefined>(
    undefined,
  );
  const [hidden, setHidden] = useState<Set<string>>(new Set());
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleClick = useCallback(
    (name: string) => {
      if (clickTimer.current) {
        clearTimeout(clickTimer.current);
        clickTimer.current = null;
      }
      clickTimer.current = setTimeout(() => {
        setHidden((prev) => {
          const next = new Set(prev);
          if (next.has(name)) {
            next.delete(name);
          } else {
            const wouldRemain = data.filter(
              (d) => !next.has(getKey(d)) && getKey(d) !== name,
            );
            if (wouldRemain.length > 0) next.add(name);
          }
          return next;
        });
        setHoveredIndex(undefined);
      }, 250);
    },
    [data, getKey],
  );

  const handleDblClick = useCallback(
    (name: string) => {
      if (clickTimer.current) {
        clearTimeout(clickTimer.current);
        clickTimer.current = null;
      }
      setHidden((prev) => {
        const visible = data.filter((d) => !prev.has(getKey(d)));
        if (visible.length === 1 && getKey(visible[0]) === name) {
          return new Set(); // restore all
        }
        return new Set(
          data.filter((d) => getKey(d) !== name).map((d) => getKey(d)),
        );
      });
      setHoveredIndex(undefined);
    },
    [data, getKey],
  );

  const handleHover = useCallback((index: number | undefined) => {
    setHoveredIndex(index);
  }, []);

  const isHidden = useCallback(
    (name: string) => hidden.has(name),
    [hidden],
  );

  return {
    hidden,
    hoveredIndex,
    handleClick,
    handleDblClick,
    handleHover,
    isHidden,
  };
}
