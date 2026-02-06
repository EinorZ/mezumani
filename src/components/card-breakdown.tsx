"use client";

import { useState } from "react";
import { formatCurrency } from "@/lib/utils";

interface CardAmount {
  card: string;
  amount: number;
}

interface OwnerGroup {
  owner: string;
  label: string;
  color: string;
  cards: CardAmount[];
  total: number;
}

interface Props {
  groups: OwnerGroup[];
}

export function CardBreakdown({ groups }: Props) {
  const [collapsed, setCollapsed] = useState<Set<string>>(
    () => new Set(groups.map((g) => g.owner)),
  );

  function toggle(owner: string) {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(owner)) {
        next.delete(owner);
      } else {
        next.add(owner);
      }
      return next;
    });
  }

  return (
    <>
      {groups.map((g) => {
        const isCollapsed = collapsed.has(g.owner);
        return (
          <div key={g.owner} className="mb-3">
            <div
              className="d-flex justify-content-between small fw-bold mb-1"
              style={{ cursor: "pointer" }}
              onClick={() => toggle(g.owner)}
            >
              <span style={{ color: g.color }}>
                <span
                  className="me-1"
                  style={{ fontSize: "0.65rem", color: "#6c757d" }}
                >
                  {isCollapsed ? "▶" : "▼"}
                </span>
                {g.label}
              </span>
              <span style={{ color: g.color }}>{formatCurrency(g.total)}</span>
            </div>
            {!isCollapsed &&
              g.cards.map((c) => (
                <div
                  key={c.card}
                  className="d-flex justify-content-between small mb-1"
                  style={{ paddingRight: "0.75rem" }}
                >
                  <span className="text-secondary">{c.card}</span>
                  <span className="fw-medium">{formatCurrency(c.amount)}</span>
                </div>
              ))}
          </div>
        );
      })}
    </>
  );
}
