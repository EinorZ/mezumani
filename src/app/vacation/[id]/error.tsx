"use client";

export default function VacationError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="container-fluid px-4 py-3">
      <div className="alert alert-danger">
        <p className="mb-2">שגיאה בטעינת נתוני החופשה</p>
        <p className="small text-secondary mb-2">{error.message}</p>
        <button className="btn btn-sm btn-outline-danger" onClick={reset}>
          נסה שוב
        </button>
      </div>
    </div>
  );
}
