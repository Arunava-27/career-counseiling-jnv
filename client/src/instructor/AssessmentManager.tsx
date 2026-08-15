import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, type AssessmentInstrument, type AssessmentResults, type Session } from "../shared/api";

export function AssessmentManager({ session }: { session: Session }) {
  const [library, setLibrary] = useState<AssessmentInstrument[]>([]);
  const [results, setResults] = useState<AssessmentResults | null>(null);

  const activeInstrumentId = session.active_assessment_id ?? null;

  useEffect(() => {
    api.assessmentLibrary().then(setLibrary).catch(() => undefined);
  }, []);

  useEffect(() => {
    if (!activeInstrumentId) {
      setResults(null);
      return;
    }
    const poll = () =>
      api.assessmentResults(session.id, activeInstrumentId).then(setResults).catch(() => undefined);
    poll();
    const interval = setInterval(poll, 3000);
    return () => clearInterval(interval);
  }, [session.id, activeInstrumentId]);

  async function handleLaunch(instrumentId: number) {
    await api.launchAssessment(session.id, instrumentId);
  }

  async function handleClose() {
    await api.closeAssessment(session.id);
  }

  return (
    <div style={{ marginTop: "2rem" }}>
      <h2>Assessments</h2>
      <p style={{ fontSize: "0.85rem", color: "#666" }}>
        Results are visible only here, on your instructor console — students never see their own scores.
      </p>

      {library.map((instrument) => {
        const isActive = instrument.id === activeInstrumentId;
        return (
          <div key={instrument.id} style={{ border: "1px solid #eee", padding: "0.8rem", marginBottom: "0.6rem" }}>
            <strong>{instrument.name}</strong> {isActive && "— active"}
            <p style={{ fontSize: "0.85rem", color: "#666" }}>{instrument.description}</p>
            {!isActive && <button onClick={() => handleLaunch(instrument.id)}>Launch</button>}
            {isActive && (
              <>
                <button onClick={handleClose}>Close</button>{" "}
                <Link to={`/console/sessions/${session.id}/assessment-kiosk`}>
                  <button type="button">Take test with a student &rarr;</button>
                </Link>
              </>
            )}

            {isActive && results && (
              <table style={{ marginTop: "0.6rem", borderCollapse: "collapse", width: "100%" }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: "left", padding: "0.3rem" }}>Student</th>
                    {instrument.questions
                      .map((q) => q.scoring_dimension)
                      .filter((d, i, arr) => d && arr.indexOf(d) === i)
                      .map((dim) => (
                        <th key={dim} style={{ textAlign: "left", padding: "0.3rem" }}>
                          {dim}
                        </th>
                      ))}
                  </tr>
                </thead>
                <tbody>
                  {results.participants.map((p) => (
                    <tr key={p.participant_id} style={{ borderTop: "1px solid #eee" }}>
                      <td style={{ padding: "0.3rem" }}>{p.display_name}</td>
                      {instrument.questions
                        .map((q) => q.scoring_dimension)
                        .filter((d, i, arr) => d && arr.indexOf(d) === i)
                        .map((dim) => (
                          <td key={dim} style={{ padding: "0.3rem" }}>
                            {dim ? (p.dimension_totals[dim] ?? "—") : "—"}
                          </td>
                        ))}
                    </tr>
                  ))}
                  {results.participants.length === 0 && (
                    <tr>
                      <td colSpan={99} style={{ padding: "0.3rem", color: "#999" }}>
                        No responses yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        );
      })}
    </div>
  );
}
