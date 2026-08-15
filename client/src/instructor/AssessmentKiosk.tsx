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
  const [rollNumber, setRollNumber] = useState("");
  const [joined, setJoined] = useState<JoinedParticipant | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [count, setCount] = useState(0);

  async function handleBegin(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setError(null);
    try {
      const info = await api.joinSession(sessionId, name.trim(), rollNumber.trim() || undefined);
      setJoined(info);
      setPhase("assessment");
    } catch {
      setError("Could not start — make sure an assessment has been launched for this session first.");
    }
  }

  function handleNextStudent() {
    setName("");
    setRollNumber("");
    setJoined(null);
    setPhase("name-entry");
  }

  const containerStyle: React.CSSProperties = {
    padding: "2rem",
    fontFamily: "sans-serif",
    maxWidth: "480px",
    margin: "0 auto",
    textAlign: "center",
  };

  if (phase === "name-entry") {
    return (
      <div style={containerStyle}>
        <Link to={`/console/sessions/${sessionId}`}>&larr; Back to session</Link>
        <h1 style={{ marginTop: "1rem" }}>Psychometric Test</h1>
        <p style={{ color: "#666" }}>{count > 0 && `${count} student${count === 1 ? "" : "s"} completed so far.`}</p>
        <p>Next student, please enter your details:</p>
        <form onSubmit={handleBegin}>
          <input
            placeholder="Student name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoFocus
            style={{ width: "100%", padding: "0.7rem", fontSize: "1.1rem", marginBottom: "0.6rem" }}
          />
          <input
            placeholder="Roll number (optional)"
            value={rollNumber}
            onChange={(e) => setRollNumber(e.target.value)}
            style={{ width: "100%", padding: "0.7rem", fontSize: "1.1rem", marginBottom: "0.6rem" }}
          />
          <button type="submit" style={{ width: "100%", padding: "0.8rem", fontSize: "1.1rem" }}>
            Begin
          </button>
        </form>
        {error && <p style={{ color: "crimson" }}>{error}</p>}
      </div>
    );
  }

  if (phase === "assessment" && joined) {
    return (
      <div style={containerStyle}>
        <h1>{name}</h1>
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
    <div style={containerStyle}>
      <h1>Thanks, {name}!</h1>
      <p>Your responses have been recorded.</p>
      <button onClick={handleNextStudent} style={{ padding: "1rem 2rem", fontSize: "1.2rem" }}>
        Next Student
      </button>
      <p style={{ marginTop: "1.5rem" }}>
        <Link to={`/console/sessions/${sessionId}`}>&larr; Back to session</Link>
      </p>
    </div>
  );
}
