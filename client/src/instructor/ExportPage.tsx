import { Link } from "react-router-dom";

const EXPORTS = [
  { label: "Sessions", ext: "CSV", icon: "📅", path: "/api/export/sessions.csv" },
  { label: "Poll Responses", ext: "CSV", icon: "🗳️", path: "/api/export/poll-responses.csv" },
  { label: "Assessment Results", ext: "CSV", icon: "🧭", path: "/api/export/assessment-results.csv" },
  { label: "Full Data Dump", ext: "JSON", icon: "📦", path: "/api/export/all.json" },
];

export function ExportPage() {
  return (
    <div className="page">
      <Link className="back-link" to="/console">
        ← Back to Dashboard
      </Link>
      <h1>Export Data</h1>
      <p className="muted" style={{ marginBottom: "1.25rem" }}>
        Download programme data for compiling the end-of-programme report.
      </p>
      <div className="stack">
        {EXPORTS.map((e) => (
          <a
            key={e.path}
            href={e.path}
            target="_blank"
            rel="noreferrer"
            className="card row"
            style={{ justifyContent: "space-between", textDecoration: "none", color: "var(--text)" }}
          >
            <span className="row">
              <span style={{ fontSize: "1.3rem" }}>{e.icon}</span>
              <strong>{e.label}</strong>
            </span>
            <span className="badge badge-neutral">{e.ext} ⬇</span>
          </a>
        ))}
      </div>
    </div>
  );
}
