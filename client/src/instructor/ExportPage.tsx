import { Link } from "react-router-dom";

const EXPORTS = [
  { label: "Sessions (CSV)", path: "/api/export/sessions.csv" },
  { label: "Poll Responses (CSV)", path: "/api/export/poll-responses.csv" },
  { label: "Assessment Results (CSV)", path: "/api/export/assessment-results.csv" },
  { label: "Full Data Dump (JSON)", path: "/api/export/all.json" },
];

export function ExportPage() {
  return (
    <div style={{ padding: "1.5rem", fontFamily: "sans-serif" }}>
      <Link to="/console">&larr; Back to Dashboard</Link>
      <h1>Export Data</h1>
      <p>Download programme data for compiling the end-of-programme report.</p>
      <ul>
        {EXPORTS.map((e) => (
          <li key={e.path} style={{ marginBottom: "0.5rem" }}>
            <a href={e.path} target="_blank" rel="noreferrer">
              {e.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
