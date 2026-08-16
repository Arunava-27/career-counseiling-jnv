import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, errorMessage, type AssessmentInstrument, type AssessmentResults, type Session } from "../shared/api";
import { classRangeLabel, matchesGrade, parseGradeFromClassName } from "../shared/classLevels";

export function AssessmentManager({ session }: { session: Session }) {
  const [library, setLibrary] = useState<AssessmentInstrument[]>([]);
  const [results, setResults] = useState<AssessmentResults | null>(null);
  const [error, setError] = useState<string | null>(null);

  const activeInstrumentId = session.active_assessment_id ?? null;

  useEffect(() => {
    api.assessmentLibrary().then(setLibrary).catch(() => undefined);
  }, []);

  // Different class levels need genuinely different psychometric instruments (wording, length,
  // concept difficulty) — so unlike topics, this filters rather than just reorders. A session
  // whose class name doesn't parse to a grade (or has no class set) still sees everything,
  // rather than being silently left with an empty list.
  const sessionGrade = session.class_section_name ? parseGradeFromClassName(session.class_section_name) : null;
  const visibleLibrary = library.filter((instrument) => matchesGrade(instrument, sessionGrade));
  const hiddenCount = library.length - visibleLibrary.length;

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
    setError(null);
    try {
      await api.launchAssessment(session.id, instrumentId);
    } catch (err) {
      setError(errorMessage(err));
    }
  }

  async function handleClose() {
    setError(null);
    try {
      await api.closeAssessment(session.id);
    } catch (err) {
      setError(errorMessage(err));
    }
  }

  return (
    // A clearly separate section, deliberately set apart from the Topic/Polls flow above it —
    // psychometry is an independent thing, not something that lives "under" a topic.
    <div className="section section-accent">
      <h2 style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
        🧭 Psychometry Test
      </h2>
      <p className="muted">
        Results are visible only here, on your instructor console — students never see their own scores. Each
        instrument's name below is for your reference only; students only ever see its soft title.
      </p>
      {error && <p className="error-text">{error}</p>}
      {hiddenCount > 0 && (
        <p className="faint">
          {hiddenCount} instrument{hiddenCount === 1 ? "" : "s"} hidden — not tagged for this session's class.
        </p>
      )}

      <div className="stack" style={{ marginTop: "0.8rem" }}>
        {visibleLibrary.map((instrument) => {
          const isActive = instrument.id === activeInstrumentId;
          const range = classRangeLabel(instrument);
          const dimensions = instrument.questions
            .map((q) => q.scoring_dimension)
            .filter((d, i, arr) => d && arr.indexOf(d) === i);
          return (
            <div key={instrument.id} className="card">
              <div className="row" style={{ justifyContent: "space-between" }}>
                <div className="row">
                  <strong>{instrument.name}</strong>
                  {range && <span className="badge badge-neutral">{range}</span>}
                  {isActive && <span className="badge badge-success">Active</span>}
                </div>
                <div className="row">
                  {!isActive && (
                    <button className="btn-primary btn-sm" onClick={() => handleLaunch(instrument.id)}>
                      Launch
                    </button>
                  )}
                  {isActive && (
                    <>
                      <button className="btn-sm" onClick={handleClose}>
                        Close
                      </button>
                      <Link to={`/console/sessions/${session.id}/assessment-kiosk`}>
                        <button type="button" className="btn-primary btn-sm">
                          Take test with a student →
                        </button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
              <p className="faint" style={{ fontStyle: "italic", margin: "0.4rem 0" }}>
                Students see: "{instrument.student_label ?? instrument.name}"
              </p>
              <p className="muted">{instrument.description}</p>

              {isActive && results && (
                <div className="table-wrap" style={{ marginTop: "0.7rem" }}>
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Student</th>
                        {dimensions.map((dim) => (
                          <th key={dim}>{dim}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {results.participants.map((p) => (
                        <tr key={p.participant_id}>
                          <td>{p.display_name}</td>
                          {dimensions.map((dim) => (
                            <td key={dim}>{dim ? (p.dimension_totals[dim] ?? "—") : "—"}</td>
                          ))}
                        </tr>
                      ))}
                      {results.participants.length === 0 && (
                        <tr>
                          <td colSpan={99} className="empty-state">
                            No responses yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })}
        {visibleLibrary.length === 0 && (
          <p className="empty-state">No psychometric instrument is tagged for this session's class yet.</p>
        )}
      </div>
    </div>
  );
}
