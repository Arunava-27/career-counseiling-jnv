import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api, type JoinedParticipant, type JoinLookupResponse } from "../shared/api";
import { ActiveAssessment } from "./ActiveAssessment";

export function storageKeyFor(sessionId: number) {
  return `cc_participant_${sessionId}`;
}

export function JoinPage() {
  const [searchParams] = useSearchParams();
  const [code, setCode] = useState(searchParams.get("code")?.toUpperCase() ?? "");
  const [name, setName] = useState("");
  const [className, setClassName] = useState("");
  const [section, setSection] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [session, setSession] = useState<JoinLookupResponse | null>(null);
  const [joinedInfo, setJoinedInfo] = useState<JoinedParticipant | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Full name, class, section, and roll number are all mandatory — this is the exact record
  // that later gets compiled into the report handed to the Principal, so it has to be complete
  // for every student, not just enough to take the test.
  const allFilled = name.trim() && className.trim() && section.trim() && rollNumber.trim();

  async function handleCodeSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const result = await api.lookupJoinCode(code.trim());
      setSession(result);
    } catch {
      setError("No active session found with that code. Check with your instructor.");
    } finally {
      setLoading(false);
    }
  }

  async function handleNameSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!session || !allFilled) return;
    setError(null);
    setLoading(true);
    try {
      const info = await api.joinSession(session.id, {
        displayName: name.trim(),
        className: className.trim(),
        section: section.trim(),
        rollNumber: rollNumber.trim(),
      });
      localStorage.setItem(storageKeyFor(session.id), JSON.stringify(info));
      setJoinedInfo(info);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not join the session. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // Polls are recorded as instructor-tallied show of hands, never answered on a student's own
  // device — so joining only ever leads to a psychometric assessment, if one is active.
  if (joinedInfo && session) {
    return (
      <div className="page-narrow">
        <ActiveAssessment sessionId={session.id} deviceToken={joinedInfo.device_token} />
      </div>
    );
  }

  if (session) {
    return (
      <div className="auth-shell">
        <div className="auth-card">
          <h1 style={{ fontSize: "1.4rem" }}>Join Session</h1>
          <p className="muted" style={{ marginBottom: "1.25rem" }}>
            <strong style={{ color: "var(--text)" }}>{session.topic_title ?? "Psychometry Test"}</strong>
            {session.class_section_name && (
              <>
                <br />
                {session.class_section_name}
              </>
            )}
          </p>
          <form onSubmit={handleNameSubmit} className="stack">
            <input
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
              style={{ width: "100%" }}
            />
            <div className="row" style={{ flexWrap: "nowrap" }}>
              <input
                placeholder="Class (e.g. IX)"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                required
                style={{ flex: 1, minWidth: 0 }}
              />
              <input
                placeholder="Section (e.g. A)"
                value={section}
                onChange={(e) => setSection(e.target.value)}
                required
                style={{ flex: 1, minWidth: 0 }}
              />
            </div>
            <input
              placeholder="Roll number"
              value={rollNumber}
              onChange={(e) => setRollNumber(e.target.value)}
              required
              style={{ width: "100%" }}
            />
            {error && <p className="error-text">{error}</p>}
            <button type="submit" className="btn-primary" disabled={loading || !allFilled} style={{ width: "100%" }}>
              {loading ? "Joining…" : "Join"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-shell">
      <div className="auth-card" style={{ textAlign: "center" }}>
        <div style={{ fontSize: "2.2rem", marginBottom: "0.4rem" }}>👋</div>
        <h1 style={{ fontSize: "1.4rem" }}>Join a Session</h1>
        <p className="muted" style={{ marginBottom: "1.25rem" }}>
          Enter the code your instructor shared, or scan the QR code.
        </p>
        <form onSubmit={handleCodeSubmit} className="stack">
          <input
            placeholder="CODE"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            required
            style={{
              width: "100%",
              fontSize: "1.5rem",
              letterSpacing: "0.2em",
              textAlign: "center",
              textTransform: "uppercase",
            }}
          />
          {error && <p className="error-text">{error}</p>}
          <button type="submit" className="btn-primary" disabled={loading} style={{ width: "100%" }}>
            {loading ? "Checking…" : "Continue"}
          </button>
        </form>
      </div>
    </div>
  );
}
