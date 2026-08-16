import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, type Session } from "../shared/api";

export function SessionReport() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [schoolName, setSchoolName] = useState("Jawahar Navodaya Vidyalaya");
  const [programmeLabel, setProgrammeLabel] = useState("Career Counselling Programme");

  useEffect(() => {
    api.sessions().then(setSessions).catch(() => undefined);
  }, []);

  const completedCount = sessions.filter((s) => s.status === "completed").length;

  return (
    <div style={{ padding: "1.5rem", fontFamily: "var(--sans)", maxWidth: "1000px", margin: "0 auto" }}>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { padding: 0; }
          .signature-block { page-break-inside: avoid; }
        }
        .report-input {
          border: none;
          border-bottom: 1px dashed var(--border-strong);
          font: inherit;
          text-align: center;
          width: 100%;
          background: transparent;
          color: var(--text);
        }
        table.report-table { border-collapse: collapse; width: 100%; margin-bottom: 1.5rem; }
        table.report-table th, table.report-table td {
          border: 1px solid var(--border-strong);
          padding: 0.4rem 0.6rem;
          text-align: left;
          font-size: 0.82rem;
        }
        table.report-table th { background: var(--surface-2); }
        table.report-table tbody tr:nth-child(even) { background: var(--surface-2); }
      `}</style>

      <div className="no-print topbar">
        <Link className="back-link" to="/console" style={{ marginBottom: 0 }}>
          ← Back to Dashboard
        </Link>
        <button className="btn-primary" onClick={() => window.print()}>
          🖨️ Print / Save as PDF
        </button>
      </div>

      <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
        <input
          className="report-input"
          style={{ fontSize: "1.4rem", fontWeight: "bold" }}
          value={schoolName}
          onChange={(e) => setSchoolName(e.target.value)}
        />
        <input
          className="report-input"
          style={{ fontSize: "1.1rem", marginTop: "0.3rem" }}
          value={programmeLabel}
          onChange={(e) => setProgrammeLabel(e.target.value)}
        />
        <h2 style={{ marginTop: "0.9rem" }}>Session Record</h2>
        <p className="muted">
          Generated {new Date().toLocaleDateString()} · {sessions.length} session{sessions.length === 1 ? "" : "s"} ·{" "}
          {completedCount} completed
        </p>
      </div>

      <table className="report-table">
        <thead>
          <tr>
            <th>No.</th>
            <th>Date</th>
            <th>Time</th>
            <th>Topic</th>
            <th>Class</th>
            <th>Instructor</th>
            <th>Status</th>
            <th>Attendance</th>
            <th>Activity Notes</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((s) => (
            <tr key={s.id}>
              <td>{s.session_number}</td>
              <td>{s.date ?? "—"}</td>
              <td>
                {s.scheduled_start_time || s.scheduled_end_time
                  ? `${s.scheduled_start_time ?? "?"}–${s.scheduled_end_time ?? "?"}`
                  : "—"}
              </td>
              <td>{s.topic_title ?? "Psychometry Test"}</td>
              <td>{s.class_section_name ?? "—"}</td>
              <td>{s.instructor_name ?? "—"}</td>
              <td style={{ textTransform: "capitalize" }}>{s.status.replace("_", " ")}</td>
              <td>{s.attendance_count ?? "—"}</td>
              <td>{s.notes ?? "—"}</td>
            </tr>
          ))}
          {sessions.length === 0 && (
            <tr>
              <td colSpan={9} className="empty-state">
                No sessions recorded yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="signature-block" style={{ marginTop: "3.5rem", display: "flex", justifyContent: "space-between", gap: "2rem" }}>
        <div style={{ flex: 1, textAlign: "center" }}>
          <div style={{ borderTop: "1px solid var(--text)", paddingTop: "0.4rem" }}>Instructor Signature</div>
        </div>
        <div style={{ flex: 1, textAlign: "center" }}>
          <div style={{ borderTop: "1px solid var(--text)", paddingTop: "0.4rem" }}>Date</div>
        </div>
        <div style={{ flex: 1, textAlign: "center" }}>
          <div style={{ borderTop: "1px solid var(--text)", paddingTop: "0.4rem" }}>Principal's Signature &amp; Seal</div>
        </div>
      </div>
    </div>
  );
}
