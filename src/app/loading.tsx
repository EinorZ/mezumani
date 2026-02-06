export default function Loading() {
  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "100vh" }}
    >
      <div className="spinner-border text-success" role="status">
        <span className="visually-hidden">טוען...</span>
      </div>
    </div>
  );
}
