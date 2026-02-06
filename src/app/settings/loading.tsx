export default function SettingsLoading() {
  return (
    <div className="container-fluid px-4 py-3">
      <h1 className="h4 fw-bold mb-4">הגדרות</h1>
      <div className="text-center py-5">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">טוען...</span>
        </div>
      </div>
    </div>
  );
}
