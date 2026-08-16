import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api, type JoinedParticipant } from "../shared/api";
import { ActiveAssessment } from "../student/ActiveAssessment";

type Phase = "name-entry" | "assessment" | "thanks";

export function AssessmentKiosk() {
  const { id } = useParams<{ id: string }>();
  const sessionId = Number(id);

  const [phase, setPhase] = useState<Phase>("name-entry");
  const [name, setName] = useState("");
  const [className, setClassName] = useState("");
  const [section, setSection] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [joined, setJoined] = useState<JoinedParticipant | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [count, setCount] = useState(0);

  // Full name, class, section, and roll number are all mandatory — this is the exact record
  // that later gets compiled into the report handed to the Principal, so it has to be complete
  // for every student, not just enough to take the test.
  const allFilled = name.trim() && className.trim() && section.trim() && rollNumber.trim();

  async function handleBegin(e: React.FormEvent) {
    e.preventDefault();
    if (!allFilled) return;
    setError(null);
    try {
      const info = await api.joinSession(sessionId, {
        displayName: name.trim(),
        className: className.trim(),
        section: section.trim(),
        rollNumber: rollNumber.trim(),
      });
      setJoined(info);
      setPhase("assessment");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not start — make sure an assessment has been launched for this session first.");
    }
  }

  function handleNextStudent() {
    setName("");
    setClassName("");
    setSection("");
    setRollNumber("");
    setJoined(null);
    setPhase("name-entry");
  }

  if (phase === "name-entry") {
    return (
      <div className="auth-shell">
        <div className="auth-card" style={{ textAlign: "center", maxWidth: "420px" }}>
          <Link className="back-link" to={`/console/sessions/${sessionId}`} style={{ justifyContent: "center" }}>
            ← Back to session
          </Link>
          {/* Soft, generic heading — the specific test's own gentle title (e.g. "Discover Your
              Interests") only appears once ActiveAssessment loads the active instrument below. */}
          <div style={{ fontSize: "2.2rem", marginBottom: "0.4rem" }}>🧭</div>
          <h1 style={{ fontSize: "1.5rem" }}>Getting to Know You</h1>
          {count > 0 && (
            <p className="badge badge-success" style={{ display: "inline-flex", marginBottom: "0.4rem" }}>
              {count} student{count === 1 ? "" : "s"} completed so far
            </p>
          )}
          <p className="muted" style={{ marginBottom: "1rem" }}>
            Next student, please enter your details:
          </p>
          <form onSubmit={handleBegin} className="stack">
            <input
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
              style={{ width: "100%", fontSize: "1.1rem", padding: "0 0.8rem" }}
            />
            <div className="row" style={{ flexWrap: "nowrap" }}>
              <input
                placeholder="Class (e.g. IX)"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                required
                style={{ flex: 1, minWidth: 0, fontSize: "1.1rem", padding: "0 0.8rem" }}
              />
              <input
                placeholder="Section (e.g. A)"
                value={section}
                onChange={(e) => setSection(e.target.value)}
                required
                style={{ flex: 1, minWidth: 0, fontSize: "1.1rem", padding: "0 0.8rem" }}
              />
            </div>
            <input
              placeholder="Roll number"
              value={rollNumber}
              onChange={(e) => setRollNumber(e.target.value)}
              required
              style={{ width: "100%", fontSize: "1.1rem", padding: "0 0.8rem" }}
            />
            {error && <p className="error-text">{error}</p>}
            <button
              type="submit"
              className="btn-primary"
              disabled={!allFilled}
              style={{ width: "100%", padding: "0.9rem", fontSize: "1.1rem" }}
            >
              Begin
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (phase === "assessment" && joined) {
    return (
      <div className="page-narrow">
        <h1 style={{ textAlign: "center" }}>{name}</h1>
        <p className="muted" style={{ textAlign: "center", marginTop: "-0.6rem" }}>
          Class {className} {section} · Roll {rollNumber}
        </p>
        <ActiveAssessment
          sessionId={sessionId}
          deviceToken={joined.device_token}
          onSubmitted={() => {
            setCount((c) => c + 1);
            setPhase("thanks");
          }}
        />
      </div>
    );
  }

  return (
    <div className="auth-shell">
      <div className="auth-card" style={{ textAlign: "center" }}>
        <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>🎉</div>
        <h1 style={{ fontSize: "1.4rem" }}>Thanks, {name}!</h1>
        <p className="muted">Your responses have been recorded.</p>
        <button className="btn-primary" onClick={handleNextStudent} style={{ padding: "1rem 2rem", fontSize: "1.1rem", marginTop: "1rem", width: "100%" }}>
          Next Student →
        </button>
        <p style={{ marginTop: "1.5rem" }}>
          <Link className="back-link" to={`/console/sessions/${sessionId}`} style={{ justifyContent: "center" }}>
            ← Back to session
          </Link>
        </p>
      </div>
    </div>
  );
}
