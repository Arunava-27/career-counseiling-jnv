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
    <div style={{ padding: "1.5rem", fontFamily: "sans-serif", maxWidth: "900px", margin: "0 auto" }}>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { padding: 0; }
        }
        .report-input {
          border: none;
          border-bottom: 1px dashed #999;
          font: inherit;
          text-align: center;
          width: 100%;
          background: transparent;
        }
        table.report-table { border-collapse: collapse; width: 100%; margin-bottom: 2rem; }
        table.report-table th, table.report-table td {
          border: 1px solid #ccc;
          padding: 0.4rem 0.6rem;
          text-align: left;
          font-size: 0.9rem;
        }
        table.report-table th { background: #f5f5f5; }
      `}</style>

      <div className="no-print" style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
        <Link to="/console">&larr; Back to Dashboard</Link>
        <button onClick={() => window.print()}>Print / Save as PDF</button>
      </div>

      <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
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
        <h2 style={{ marginTop: "0.8rem" }}>Psychometric Assessment Report</h2>
        <p style={{ fontSize: "0.85rem", color: "#666" }}>
          Generated {new Date().toLocaleDateString()} &middot; {report.reduce((n, i) => n + i.participants.length, 0)}{" "}
          total responses across {report.length} instrument{report.length === 1 ? "" : "s"}
        </p>
      </div>

      {report.map((instrument) => (
        <div key={instrument.instrument_id}>
          <h3>{instrument.name}</h3>
          {instrument.description && <p style={{ fontSize: "0.85rem", color: "#666" }}>{instrument.description}</p>}
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
                  <td colSpan={4 + instrument.dimensions.length} style={{ color: "#999" }}>
                    No responses recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ))}

      {report.length === 0 && <p>No assessment instruments found.</p>}
    </div>
  );
}
