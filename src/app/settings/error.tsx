"use client";

export default function SettingsError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="container-fluid px-4 py-3">
      <h1 className="h4 fw-bold mb-4">הגדרות</h1>
      <div className="alert alert-danger">
        <p className="mb-2">שגיאה בטעינת ההגדרות</p>
        <p className="small text-secondary mb-2">{error.message}</p>
        <button className="btn btn-sm btn-outline-danger" onClick={reset}>
          נסה שוב
        </button>
      </div>
    </div>
  );
}
