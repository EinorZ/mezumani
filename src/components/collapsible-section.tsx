"use client";

import { useState, useRef, useEffect, useCallback } from "react";

interface Props {
  title: string;
  icon?: string;
  description?: string;
  accentColor?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

export function CollapsibleSection({
  title,
  icon,
  description,
  accentColor,
  defaultOpen = false,
  children,
}: Props) {
  const [open, setOpen] = useState(defaultOpen);
  const contentRef = useRef<HTMLDivElement>(null);
  const [maxHeight, setMaxHeight] = useState<string>(
    defaultOpen ? "none" : "0px",
  );

  const recalcHeight = useCallback(() => {
    if (!contentRef.current) return;
    if (open) {
      setMaxHeight(`${contentRef.current.scrollHeight}px`);
      // After transition, switch to "none" so dynamic content isn't clipped
      const timer = setTimeout(() => setMaxHeight("none"), 350);
      return () => clearTimeout(timer);
    } else {
      // First set explicit height so transition can animate from it
      setMaxHeight(`${contentRef.current.scrollHeight}px`);
      // Force reflow then collapse
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setMaxHeight("0px");
        });
      });
    }
  }, [open]);

  useEffect(() => {
    const cleanup = recalcHeight();
    return cleanup;
  }, [recalcHeight]);

  return (
    <div
      className="settings-section"
      style={
        accentColor
          ? ({ "--section-accent": accentColor } as React.CSSProperties)
          : undefined
      }
    >
      <button
        className="settings-section-header"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <div className="settings-section-title-area">
          {icon && <span className="settings-section-icon">{icon}</span>}
          <div>
            <span className="settings-section-title">{title}</span>
            {description && (
              <span className="settings-section-desc">{description}</span>
            )}
          </div>
        </div>
        <span
          className="settings-section-arrow"
          style={{
            transform: open ? "rotate(0deg)" : "rotate(-90deg)",
          }}
        >
          &#9660;
        </span>
      </button>
      <div
        ref={contentRef}
        className="settings-section-body"
        style={{ maxHeight }}
      >
        <div className="settings-section-content">{children}</div>
      </div>
    </div>
  );
}
