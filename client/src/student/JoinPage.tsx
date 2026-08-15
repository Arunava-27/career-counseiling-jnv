import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api, type JoinedParticipant, type JoinLookupResponse } from "../shared/api";
import { ActiveQuestion } from "./ActiveQuestion";
import { ActiveAssessment } from "./ActiveAssessment";

export function storageKeyFor(sessionId: number) {
  return `cc_participant_${sessionId}`;
}

export function JoinPage() {
  const [searchParams] = useSearchParams();
  const [code, setCode] = useState(searchParams.get("code")?.toUpperCase() ?? "");
  const [name, setName] = useState("");
  const [session, setSession] = useState<JoinLookupResponse | null>(null);
  const [joinedInfo, setJoinedInfo] = useState<JoinedParticipant | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
    if (!session || !name.trim()) return;
    setError(null);
    setLoading(true);
    try {
      const info = await api.joinSession(session.id, name.trim());
      localStorage.setItem(storageKeyFor(session.id), JSON.stringify(info));
      setJoinedInfo(info);
    } catch {
      setError("Could not join the session. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const containerStyle: React.CSSProperties = {
    padding: "1.5rem",
    fontFamily: "sans-serif",
    maxWidth: "420px",
    margin: "0 auto",
  };

  if (joinedInfo && session) {
    return (
      <>
        <ActiveQuestion
          sessionId={session.id}
          deviceToken={joinedInfo.device_token}
          topicTitle={session.topic_title ?? ""}
          classSectionName={session.class_section_name ?? ""}
        />
        <ActiveAssessment sessionId={session.id} deviceToken={joinedInfo.device_token} />
      </>
    );
  }

  if (session) {
    return (
      <div style={containerStyle}>
        <h1>Join Session</h1>
        <p>
          <strong>{session.topic_title}</strong>
          <br />
          {session.class_section_name}
        </p>
        <form onSubmit={handleNameSubmit}>
          <input
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ width: "100%", padding: "0.6rem", fontSize: "1rem", marginBottom: "0.6rem" }}
          />
          <button type="submit" disabled={loading} style={{ width: "100%", padding: "0.6rem" }}>
            {loading ? "Joining..." : "Join"}
          </button>
        </form>
        {error && <p style={{ color: "crimson" }}>{error}</p>}
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <h1>Join a Session</h1>
      <p>Enter the code your instructor shared, or scan the QR code.</p>
      <form onSubmit={handleCodeSubmit}>
        <input
          placeholder="CODE"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          required
          style={{
            width: "100%",
            padding: "0.6rem",
            fontSize: "1.5rem",
            letterSpacing: "0.2em",
            textAlign: "center",
            textTransform: "uppercase",
            marginBottom: "0.6rem",
          }}
        />
        <button type="submit" disabled={loading} style={{ width: "100%", padding: "0.6rem" }}>
          {loading ? "Checking..." : "Continue"}
        </button>
      </form>
      {error && <p style={{ color: "crimson" }}>{error}</p>}
    </div>
  );
}
