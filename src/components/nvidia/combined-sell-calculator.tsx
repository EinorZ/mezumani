"use client";

import { useState } from "react";
import { useYearlyGross } from "@/hooks/use-yearly-gross";
import { CalcEsppSellForm } from "./calc-espp-sell-form";
import { CalcRsuSellForm } from "./calc-rsu-sell-form";
import { CalcYasafForm } from "./calc-yasaf-form";
import { YearlyGrossSection } from "./yearly-gross-section";

type CalculatorOption = "rsu" | "espp" | "yasaf";

export function CombinedSellCalculator({
  editData,
}: {
  editData: Record<string, unknown>;
}) {
  const [option, setOption] = useState<CalculatorOption>("rsu");
  const grossState = useYearlyGross(
    (editData.grossSoFar as number) ?? 0,
    (editData.monthlySalary as number) ?? 0,
    (editData.esppMonthlyContribution as number) ?? 0,
    (editData.esppPurchasePrice as number) ?? 0,
  );

  return (
    <div>
      <div
        className="btn-group w-100 mb-3"
        role="group"
        aria-label="סוג מחשבון"
      >
        <button
          type="button"
          className={`btn ${option === "rsu" ? "btn-info text-white" : "btn-outline-info"}`}
          aria-pressed={option === "rsu"}
          onClick={() => setOption("rsu")}
        >
          RSU
        </button>
        <button
          type="button"
          className={`btn ${option === "espp" ? "btn-info text-white" : "btn-outline-info"}`}
          aria-pressed={option === "espp"}
          onClick={() => setOption("espp")}
        >
          ESPP
        </button>
        <button
          type="button"
          className={`btn ${option === "yasaf" ? "btn-info text-white" : "btn-outline-info"}`}
          aria-pressed={option === "yasaf"}
          onClick={() => setOption("yasaf")}
        >
          יסף
        </button>
      </div>

      <YearlyGrossSection {...grossState} />
      <hr />

      <div className={option === "rsu" ? "" : "d-none"}>
        <CalcRsuSellForm editData={editData} grossState={grossState} />
      </div>
      <div className={option === "espp" ? "" : "d-none"}>
        <CalcEsppSellForm editData={editData} grossState={grossState} />
      </div>
      <div className={option === "yasaf" ? "" : "d-none"}>
        <CalcYasafForm grossState={grossState} />
      </div>
    </div>
  );
}
