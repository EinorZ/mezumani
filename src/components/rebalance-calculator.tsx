"use client";

import { useState } from "react";
import {
  Calculator,
  Save,
  Plus,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import type { StockHolding, StockConfig } from "@/lib/types";
import { useRebalanceCalculator } from "@/hooks/use-rebalance-calculator";

interface Props {
  holdings: StockHolding[];
  config: StockConfig;
}

/** Format number with commas: 100000 → "100,000" */
function formatNum(n: number): string {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function RebalanceCalculator({ holdings, config }: Props) {
  const [open, setOpen] = useState(false);

  const {
    allLabels,
    allocations,
    investmentAmount,
    setInvestmentAmount,
    selectedStocks,
    saveStatus,
    isManuallyAdjusted,
    setIsManuallyAdjusted,
    showAddMenu,
    setShowAddMenu,
    setManualShareCounts,
    addBtnRef,
    unusedLabels,
    totalPercent,
    isValid,
    investment,
    stocksByLabel,
    tableRows,
    handleShareCountChange,
    handleAllocChange,
    handleAmountChange,
    handleStockChange,
    addLabel,
    removeLabel,
    handleSave,
    stockLabel,
  } = useRebalanceCalculator(holdings, config);

  const saving = saveStatus === "saving";
  const saved = saveStatus === "saved";

  return (
    <div className="card rounded-3 border mb-4 overflow-hidden">
      {/* Header */}
      <div
        className="d-flex align-items-center justify-content-between px-3 py-3 border-bottom"
        style={{ cursor: "pointer" }}
        onClick={() => setOpen(!open)}
      >
        <div className="d-flex align-items-center gap-2">
          <Calculator size={16} />
          <span className="fw-bold" style={{ fontSize: "0.9rem" }}>
            מחשבון איזון מחדש
          </span>
        </div>
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </div>

      {open && (
        <div className="p-3">
          {allLabels.length === 0 ? (
            <div className="text-muted small text-center py-4">
              אין תוויות מוגדרות למניות. הגדר תוויות בהגדרות כדי להשתמש
              במחשבון.
            </div>
          ) : (
            <>
              {/* ── Investment amount row ── */}
              <div className="d-flex align-items-center justify-content-between mb-3">
                <span className="fw-bold" style={{ fontSize: "1rem" }}>
                  סכום להשקעה
                </span>
                <div className="d-flex align-items-center gap-2">
                  <div className="input-group" style={{ width: 200 }}>
                    <input
                      type="text"
                      inputMode="numeric"
                      className="form-control fw-bold text-start"
                      style={{ fontSize: "1rem" }}
                      placeholder="0"
                      value={
                        investmentAmount
                          ? formatNum(Number(investmentAmount))
                          : ""
                      }
                      onChange={(e) => {
                        const raw = e.target.value.replace(/[^0-9]/g, "");
                        setInvestmentAmount(raw);
                        setIsManuallyAdjusted(false);
                        setManualShareCounts({});
                      }}
                    />
                    <span className="input-group-text fw-bold">&#8362;</span>
                  </div>
                  <button
                    className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1 rounded-pill"
                    style={{ fontSize: "0.8rem", whiteSpace: "nowrap" }}
                    onClick={handleSave}
                    disabled={saving}
                  >
                    <Save size={13} />
                    {saving ? "..." : saved ? "נשמר" : "שמור"}
                  </button>
                </div>
              </div>

              {/* ── Allocation chips ── */}
              <div className="d-flex flex-wrap justify-content-start gap-2 mb-3 pb-3 border-bottom">
                {/* + button on the left end in RTL */}
                {unusedLabels.length > 0 && (
                  <div className="position-relative" style={{ order: 999 }}>
                    <button
                      ref={addBtnRef}
                      className="btn btn-outline-secondary rounded-pill d-flex align-items-center px-2 py-1"
                      style={{ fontSize: "0.85rem" }}
                      onClick={() => setShowAddMenu(!showAddMenu)}
                    >
                      <Plus size={14} />
                    </button>
                    {showAddMenu && (
                      <>
                        <div
                          className="position-fixed top-0 start-0 w-100 h-100"
                          style={{ zIndex: 1 }}
                          onClick={() => setShowAddMenu(false)}
                        />
                        <div
                          className="position-absolute bg-white border rounded-3 shadow-sm py-1"
                          style={{
                            zIndex: 2,
                            top: "100%",
                            right: 0,
                            marginTop: 4,
                            minWidth: 120,
                          }}
                        >
                          {unusedLabels.map((label) => (
                            <button
                              key={label}
                              className="dropdown-item text-end px-3 py-1"
                              style={{ fontSize: "0.85rem" }}
                              onClick={() => addLabel(label)}
                            >
                              {label}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )}

                {allocations.map((alloc) => {
                  const stocks = stocksByLabel[alloc.label] ?? [];
                  const selected = selectedStocks[alloc.label];
                  return (
                    <div
                      key={alloc.label}
                      className="d-flex align-items-center border rounded-pill px-3 py-1 bg-white"
                      style={{ gap: "0.5rem" }}
                    >
                      <span
                        className="fw-bold text-nowrap"
                        style={{ fontSize: "0.9rem" }}
                      >
                        {alloc.label}
                      </span>
                      <input
                        type="number"
                        className="form-control form-control-sm border-0 text-center fw-bold p-0"
                        style={{ fontSize: "1rem", width: 32 }}
                        value={alloc.targetPercent || ""}
                        onChange={(e) =>
                          handleAllocChange(alloc.label, e.target.value)
                        }
                        placeholder="0"
                        min={0}
                        max={100}
                        step={1}
                      />
                      <span
                        className="text-muted"
                        style={{ fontSize: "0.8rem" }}
                      >
                        %
                      </span>
                      {stocks.length > 0 && (
                        <select
                          className="form-select form-select-sm border-0 p-0"
                          style={{
                            fontSize: "0.85rem",
                            width: "auto",
                            paddingInlineEnd: "1.2rem",
                            backgroundPosition: "left 0 center",
                            cursor: "pointer",
                          }}
                          value={selected ?? ""}
                          onChange={(e) =>
                            handleStockChange(alloc.label, e.target.value)
                          }
                        >
                          <option value="">---</option>
                          {stocks.map((s) => (
                            <option key={s.symbol} value={s.symbol}>
                              {stockLabel(s)}
                            </option>
                          ))}
                        </select>
                      )}
                      <button
                        className="btn btn-sm p-0 text-muted border-0 lh-1"
                        style={{ fontSize: "0.85rem" }}
                        onClick={() => removeLabel(alloc.label)}
                        title="הסר"
                      >
                        &times;
                      </button>
                    </div>
                  );
                })}

                {!isValid && totalPercent > 0 && (
                  <div
                    className="d-flex align-items-center"
                    style={{ order: 998 }}
                  >
                    <span
                      className="badge bg-danger rounded-pill"
                      style={{ fontSize: "0.75rem" }}
                    >
                      {totalPercent.toFixed(0)}% (חסר{" "}
                      {(100 - totalPercent).toFixed(0)}%)
                    </span>
                  </div>
                )}
              </div>

              {/* ── Recommendations table ── */}
              {isValid && allocations.length > 0 && (
                <div className="table-responsive">
                  <table className="table table-borderless align-middle mb-0">
                    <thead>
                      <tr style={{ fontSize: "0.85rem", color: "#6c757d" }}>
                        <th className="fw-semibold pb-3 text-start">תיק</th>
                        <th className="fw-semibold pb-3 text-center">
                          % נוכחי
                        </th>
                        <th className="fw-semibold pb-3 text-center">כמות</th>
                        <th className="fw-semibold pb-3 text-center">עלות</th>
                        <th className="fw-semibold pb-3 text-center">
                          % חדש
                        </th>
                        <th className="fw-semibold pb-3 text-end">% יעד</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tableRows.map((row) => (
                        <tr
                          key={row.label}
                          style={{ borderBottom: "1px solid #eee" }}
                        >
                          {/* תיק */}
                          <td className="py-3 text-start">
                            <div
                              className="fw-bold"
                              style={{ fontSize: "1rem" }}
                            >
                              {row.label}
                            </div>
                            <div
                              className="text-muted"
                              style={{ fontSize: "0.75rem" }}
                            >
                              <span dir="ltr">
                                {formatCurrency(row.currentValue)}
                              </span>{" "}
                              ({row.currentPercent.toFixed(2)}%)
                            </div>
                          </td>
                          {/* % נוכחי */}
                          <td
                            className="text-center py-3"
                            style={{ fontSize: "1rem" }}
                          >
                            {row.currentPercent.toFixed(2)}%
                          </td>
                          {/* כמות */}
                          <td className="text-center py-3">
                            {investment > 0 && row.stockPrice > 0 ? (
                              <input
                                type="text"
                                inputMode="numeric"
                                className="form-control form-control-sm fw-bold text-center border-0 bg-transparent mx-auto p-0"
                                style={{ fontSize: "1rem", width: 70 }}
                                value={formatNum(row.shareCount)}
                                onChange={(e) => {
                                  const raw = e.target.value.replace(
                                    /[^0-9]/g,
                                    "",
                                  );
                                  handleShareCountChange(
                                    row.label,
                                    raw,
                                  );
                                }}
                              />
                            ) : investment > 0 ? (
                              <span
                                className="text-muted"
                                style={{ fontSize: "0.75rem" }}
                              >
                                בחר מניה
                              </span>
                            ) : (
                              <span className="text-muted">0</span>
                            )}
                          </td>
                          {/* עלות */}
                          <td className="text-center py-3">
                            {investment > 0 && row.shareCount > 0 ? (
                              <span
                                className="fw-bold"
                                style={{
                                  fontSize: "1rem",
                                  color: "#dc3545",
                                }}
                                dir="ltr"
                              >
                                {formatCurrency(row.actualCost)}
                              </span>
                            ) : (
                              <span className="text-muted">&ndash;</span>
                            )}
                          </td>
                          {/* % חדש */}
                          <td className="text-center py-3">
                            <span
                              className={`fw-bold ${
                                investment > 0
                                  ? Math.abs(row.delta) < 1
                                    ? "text-success"
                                    : Math.abs(row.delta) < 3
                                      ? "text-warning"
                                      : "text-danger"
                                  : ""
                              }`}
                              style={{ fontSize: "1rem" }}
                            >
                              {(investment > 0
                                ? row.newPercent
                                : row.currentPercent
                              ).toFixed(2)}
                              %
                            </span>
                          </td>
                          {/* % יעד */}
                          <td
                            className="text-end py-3"
                            style={{ fontSize: "1rem" }}
                          >
                            {row.targetPercent}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Summary footer */}
                  {investment > 0 && tableRows.length > 0 && (
                    <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
                      <span
                        className={`fw-bold h5 mb-0 ${Math.abs(tableRows[0].totalActualCost - investment) < 1 ? "text-success" : "text-warning"}`}
                        dir="ltr"
                      >
                        {formatCurrency(tableRows[0].totalActualCost)}
                      </span>
                      <span className="fw-bold">סה&quot;כ להשקעה</span>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
