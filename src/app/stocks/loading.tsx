export default function StocksLoading() {
  return (
    <div className="container-fluid px-4 py-3">
      <div className="page-header mb-4">
        <div
          className="shimmer"
          style={{ width: 160, height: 28, borderRadius: 6 }}
        />
      </div>

      {/* Summary cards shimmer */}
      <div className="row g-3 mb-4">
        {[0, 1, 2].map((i) => (
          <div key={i} className="col">
            <div className="shimmer" style={{ height: 90, borderRadius: 12 }} />
          </div>
        ))}
      </div>

      {/* Holdings table shimmer */}
      <div className="card rounded-3 border p-3 mb-4">
        <div
          className="shimmer mb-3"
          style={{ width: 200, height: 20, borderRadius: 4 }}
        />
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="shimmer mb-2"
            style={{ height: 40, borderRadius: 4 }}
          />
        ))}
      </div>

      {/* Term cards shimmer */}
      <div className="row g-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="col-lg-4">
            <div
              className="shimmer"
              style={{ height: 200, borderRadius: 12 }}
            />
          </div>
        ))}
      </div>

      <style>{`
        .shimmer {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}
