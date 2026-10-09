"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";

interface PageLoadingProps {
  label?: string;
  cardCount?: number;
}

export function PageLoading({
  label = "טוען את הנתונים",
  cardCount = 3,
}: PageLoadingProps) {
  return (
    <div className="page-shell route-state" aria-busy="true" aria-live="polite">
      <span className="visually-hidden">{label}</span>
      <div className="route-state-heading shimmer" />
      <div className="route-state-grid" aria-hidden="true">
        {Array.from({ length: cardCount }, (_, index) => (
          <div className="route-state-card shimmer" key={index} />
        ))}
      </div>
      <div className="route-state-panel" aria-hidden="true">
        <div className="route-state-line shimmer" />
        <div className="route-state-line shimmer" />
        <div className="route-state-line route-state-line-short shimmer" />
      </div>
    </div>
  );
}

interface PageErrorProps {
  title: string;
  message?: string;
  error?: Error & { digest?: string };
  reset: () => void;
}

export function PageError({ title, message, error, reset }: PageErrorProps) {
  const showDetails = process.env.NODE_ENV === "development" && error?.message;

  return (
    <div
      className="page-shell route-state-error"
      role="alert"
      aria-live="assertive"
    >
      <div className="route-state-error-icon" aria-hidden="true">
        <AlertTriangle size={26} />
      </div>
      <h1 className="h4 fw-bold mb-2">{title}</h1>
      <p className="text-secondary mb-4">
        {message ?? "לא הצלחנו לטעון את הנתונים. אפשר לנסות שוב בעוד רגע."}
      </p>
      <button className="btn btn-success" type="button" onClick={reset}>
        <RotateCcw size={17} aria-hidden="true" />
        <span>נסה שוב</span>
      </button>
      {showDetails && (
        <details className="route-state-error-details mt-4">
          <summary>פרטים טכניים</summary>
          <code>{error.message}</code>
        </details>
      )}
    </div>
  );
}
