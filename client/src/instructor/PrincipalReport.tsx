import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, type PsychometryReportInstrument } from "../shared/api";

export function PrincipalReport() {
  const [report, setReport] = useState<PsychometryReportInstrument[]>([]);
  const [schoolName, setSchoolName] = useState("Jawahar Navodaya Vidyalaya");
  const [programmeLabel, setProgrammeLabel] = useState("Career Counselling Programme");

  useEffect(() => {
    api.psychometryReport().then(setReport).catch(() => undefined);
  }, []);

  return (
    <div style={{ padding: "1.5rem", fontFamily: "var(--sans)", maxWidth: "900px", margin: "0 auto" }}>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { padding: 0; }
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
        table.report-table { border-collapse: collapse; width: 100%; margin-bottom: 2rem; }
        table.report-table th, table.report-table td {
          border: 1px solid var(--border-strong);
          padding: 0.45rem 0.7rem;
          text-align: left;
          font-size: 0.9rem;
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
        <h2 style={{ marginTop: "0.9rem" }}>Psychometric Assessment Report</h2>
        <p className="muted">
          Generated {new Date().toLocaleDateString()} · {report.reduce((n, i) => n + i.participants.length, 0)} total
          responses across {report.length} instrument{report.length === 1 ? "" : "s"}
        </p>
      </div>

      {report.map((instrument) => (
        <div key={instrument.instrument_id} className="card" style={{ marginBottom: "1.25rem" }}>
          <h3>{instrument.name}</h3>
          {instrument.description && <p className="muted" style={{ marginBottom: "0.7rem" }}>{instrument.description}</p>}
          <table className="report-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Roll No.</th>
                <th>Class</th>
                <th>Date</th>
                {instrument.dimensions.map((d) => (
                  <th key={d}>{d}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {instrument.participants.map((p, idx) => (
                <tr key={idx}>
                  <td>{p.display_name}</td>
                  <td>{p.roll_number ?? "—"}</td>
                  <td>{p.class_section_name ?? "—"}</td>
                  <td>{p.session_date ?? "—"}</td>
                  {instrument.dimensions.map((d) => (
                    <td key={d}>{p.dimension_totals[d] ?? "—"}</td>
                  ))}
                </tr>
              ))}
              {instrument.participants.length === 0 && (
                <tr>
                  <td colSpan={4 + instrument.dimensions.length} className="empty-state">
                    No responses recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ))}

      {report.length === 0 && <p className="empty-state">No assessment instruments found.</p>}

      <div style={{ marginTop: "3.5rem", display: "flex", justifyContent: "space-between", gap: "2rem" }}>
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
