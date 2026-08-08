"use client";

import { useMemo, useRef, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import type { useYearlyGross } from "@/hooks/use-yearly-gross";
import { calcYasafTax } from "@/lib/israeli-tax";
import { formatCurrency } from "@/lib/utils";

type YearlyGrossState = ReturnType<typeof useYearlyGross>;

type CapitalIncomeItem = {
  id: number;
  description: string;
  amount: string;
};

function withCommas(value: string): string {
  const raw = value.replace(/[^0-9]/g, "");
  if (!raw) return "";
  return parseInt(raw, 10).toLocaleString("en-US");
}

export function CalcYasafForm({
  grossState,
}: {
  grossState: YearlyGrossState;
}) {
  const nextId = useRef(2);
  const [items, setItems] = useState<CapitalIncomeItem[]>([
    { id: 1, description: "", amount: "" },
  ]);

  function updateItem(id: number, updates: Partial<CapitalIncomeItem>) {
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, ...updates } : item)),
    );
  }

  function addItem() {
    const id = nextId.current++;
    setItems((current) => [...current, { id, description: "", amount: "" }]);
  }

  function removeItem(id: number) {
    setItems((current) => current.filter((item) => item.id !== id));
  }

  const estimate = useMemo(() => {
    const capital = items.reduce(
      (sum, item) => sum + (parseFloat(item.amount) || 0),
      0,
    );
    const tax = calcYasafTax({
      baseTaxableIncome: grossState.yearlyGross,
      employmentIncome: 0,
      capitalIncome: capital,
    });

    return {
      ...tax,
      employmentIncome: grossState.yearlyGross,
      capitalIncome: capital,
      totalIncome: grossState.yearlyGross + capital,
    };
  }, [items, grossState.yearlyGross]);

  return (
    <div>
      <div className="mb-3">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <label className="form-label small mb-0">
            הכנסות הוניות נוספות לברוטו למעלה
          </label>
          <button
            type="button"
            className="btn btn-outline-info btn-sm"
            onClick={addItem}
          >
            <Plus size={14} className="me-1" />
            הוסף הכנסה
          </button>
        </div>

        <div className="d-flex flex-column gap-2">
          {items.map((item) => (
            <div className="d-flex gap-2" key={item.id}>
              <input
                type="text"
                className="form-control"
                value={item.description}
                onChange={(event) =>
                  updateItem(item.id, {
                    description: event.target.value,
                  })
                }
                placeholder="תיאור — מניות, דיבידנד, ריבית..."
                aria-label="תיאור הכנסה הונית"
              />
              <input
                type="text"
                inputMode="numeric"
                className="form-control"
                style={{ maxWidth: 145 }}
                value={withCommas(item.amount)}
                onChange={(event) =>
                  updateItem(item.id, {
                    amount: event.target.value.replace(/,/g, ""),
                  })
                }
                placeholder="סכום (₪)"
                aria-label="סכום הכנסה הונית"
              />
              <button
                type="button"
                className="btn btn-outline-danger"
                onClick={() => removeItem(item.id)}
                aria-label="מחק הכנסה"
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
        {items.length === 0 && (
          <div className="text-muted small border rounded p-3 text-center">
            אין הכנסות הוניות נוספות
          </div>
        )}
      </div>

      <div className="border rounded p-3 bg-light">
        <h6 className="mb-3">אומדן מס יסף נוסף לשים בצד</h6>
        <table className="table table-sm mb-0" style={{ fontSize: "0.85rem" }}>
          <tbody>
            <tr>
              <td>ברוטו מעבודה</td>
              <td dir="ltr">{formatCurrency(estimate.employmentIncome)}</td>
            </tr>
            <tr>
              <td>הכנסות הוניות שנוספו</td>
              <td dir="ltr">{formatCurrency(estimate.capitalIncome)}</td>
            </tr>
            <tr className="fw-semibold border-top">
              <td>סה״כ הכנסה חייבת משוערת</td>
              <td dir="ltr">{formatCurrency(estimate.totalIncome)}</td>
            </tr>
            <tr className="fw-bold border-top">
              <td>מס יסף משוער (עד 5%)</td>
              <td dir="ltr" className="text-danger">
                {formatCurrency(estimate.totalTax)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
