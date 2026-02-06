"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center gap-3"
      style={{ minHeight: "100vh" }}
    >
      <h2 className="h5 fw-bold">שגיאה</h2>
      <p className="text-secondary">{error.message}</p>
      <button className="btn btn-success" onClick={reset}>
        נסה שוב
      </button>
    </div>
  );
}
