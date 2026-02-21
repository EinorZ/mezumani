"use client";

import { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";
import { AddRsuGrantForm } from "@/components/nvidia/add-rsu-grant-form";
import { EditRsuForm } from "@/components/nvidia/edit-rsu-form";
import { CalcRsuSellForm } from "@/components/nvidia/calc-rsu-sell-form";
import { CalcEsppSellForm } from "@/components/nvidia/calc-espp-sell-form";

export type NvidiaPanelMode =
  | "addRsuGrant"
  | "editRsu"
  | "calcRsuSell"
  | "calcEsppSell";

interface Props {
  mode: NvidiaPanelMode;
  editData?: Record<string, unknown>;
  onClose: () => void;
}

const PANEL_TITLES: Record<NvidiaPanelMode, string> = {
  addRsuGrant: "הוסף מענק RSU",
  editRsu: "ערוך שורת RSU",
  calcRsuSell: "מחשבון מכירת RSU",
  calcEsppSell: "מחשבון מכירת ESPP",
};

const CALC_MODES: NvidiaPanelMode[] = ["calcRsuSell", "calcEsppSell"];

export function NvidiaAddPanel({ mode, editData = {}, onClose }: Props) {
  const [_submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const isCalcMode = CALC_MODES.includes(mode);

  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  function handleSuccess() {
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  }

  const content = (
    <>
      {success && (
        <div className="alert alert-success py-2 small mb-3">נשמר בהצלחה!</div>
      )}
      {mode === "addRsuGrant" && (
        <AddRsuGrantForm onSubmitting={setSubmitting} onSuccess={handleSuccess} />
      )}
      {mode === "editRsu" && (
        <EditRsuForm
          editData={editData}
          onSubmitting={setSubmitting}
          onSuccess={handleSuccess}
        />
      )}
      {mode === "calcRsuSell" && <CalcRsuSellForm editData={editData} />}
      {mode === "calcEsppSell" && <CalcEsppSellForm editData={editData} />}
    </>
  );

  if (isCalcMode) {
    return (
      <>
        <div
          className="position-fixed top-0 start-0 w-100 h-100"
          style={{ backgroundColor: "rgba(0,0,0,0.4)", zIndex: 1040 }}
          onClick={onClose}
        />
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ zIndex: 1050, pointerEvents: "none" }}
        >
          <div
            ref={panelRef}
            className="bg-white shadow-lg rounded-3"
            style={{
              width: 500,
              maxWidth: "90vw",
              maxHeight: "90vh",
              overflowY: "auto",
              pointerEvents: "auto",
            }}
            dir="rtl"
          >
            <div className="d-flex align-items-center justify-content-between p-3 border-bottom">
              <h5 className="mb-0">{PANEL_TITLES[mode]}</h5>
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={onClose}
              >
                <X size={16} />
              </button>
            </div>
            <div className="p-3">{content}</div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div
        className="position-fixed top-0 start-0 w-100 h-100"
        style={{ backgroundColor: "rgba(0,0,0,0.3)", zIndex: 1040 }}
        onClick={onClose}
      />
      <div
        ref={panelRef}
        className="position-fixed top-0 end-0 h-100 bg-white shadow-lg"
        style={{
          width: 420,
          maxWidth: "90vw",
          zIndex: 1050,
          overflowY: "auto",
        }}
        dir="rtl"
      >
        <div className="d-flex align-items-center justify-content-between p-3 border-bottom">
          <h5 className="mb-0">{PANEL_TITLES[mode]}</h5>
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={onClose}
          >
            <X size={16} />
          </button>
        </div>
        <div className="p-3">{content}</div>
      </div>
    </>
  );
}

