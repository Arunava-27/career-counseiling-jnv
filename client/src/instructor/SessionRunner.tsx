import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { api, type Participant, type Session } from "../shared/api";
import { AssessmentManager } from "./AssessmentManager";
import { DeckViewer } from "./DeckViewer";
import { parseGradeFromClassName } from "../shared/classLevels";

export function SessionRunner() {
  const { id } = useParams<{ id: string }>();
  const sessionId = Number(id);

  const [session, setSession] = useState<Session | null>(null);
  const [lanUrl, setLanUrl] = useState<string | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);

  useEffect(() => {
    if (!sessionId) return;
    const refreshSession = () =>
      api.sessions().then((all) => setSession(all.find((s) => s.id === sessionId) ?? null));
    refreshSession();
    const interval = setInterval(refreshSession, 3000);
    return () => clearInterval(interval);
  }, [sessionId]);

  useEffect(() => {
    const port = window.location.port ? `:${window.location.port}` : "";

    // If this page was reached via anything other than localhost — a public domain when
    // deployed, or a LAN IP typed directly on the local network — that address is already
    // exactly what a student's device should use too, so use it as-is with no lookup.
    if (window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1") {
      setLanUrl(`${window.location.protocol}//${window.location.host}`);
      return;
    }

    // Only when the instructor's own browser is on localhost (their laptop, offline
    // classroom setup) do we need to substitute a LAN IP a phone/smartboard can actually
    // reach — localhost on THIS machine means nothing on another device.
    api.serverInfo().then((info) => {
      const host = info.lanAddresses[0] ?? window.location.hostname;
      setLanUrl(`${window.location.protocol}//${host}${port}`);
    });
  }, []);

  useEffect(() => {
    if (!sessionId) return;
    const poll = () => api.participants(sessionId).then(setParticipants).catch(() => undefined);
    poll();
    const interval = setInterval(poll, 3000);
    return () => clearInterval(interval);
  }, [sessionId]);

  if (!session) {
    return (
      <div className="page">
        <p className="muted">Loading session…</p>
        <Link className="back-link" to="/console">
          ← Back to Dashboard
        </Link>
      </div>
    );
  }

  const joinUrl = lanUrl && session.join_code ? `${lanUrl}/join?code=${session.join_code}` : null;

  return (
    <div className="page">
      <Link className="back-link" to="/console">
        ← Back to Dashboard
      </Link>

      <div className="topbar" style={{ marginBottom: "0.5rem" }}>
        <div>
          <h1>
            Session {session.session_number} — {session.class_section_name ?? "No class set"}
          </h1>
          <p className="muted">
            {[session.date, session.scheduled_start_time, session.instructor_name].filter(Boolean).join(" · ") || " "}
          </p>
        </div>
        <div className="row">
          {session.status !== "in_progress" && (
            <span className="badge badge-neutral">{session.status.replace("_", " ")}</span>
          )}
        </div>
      </div>

      {session.status === "in_progress" && (
        <div
          className="row"
          style={{ alignItems: "stretch", gap: "1rem", flexWrap: "wrap", marginTop: "1rem" }}
        >
          <div className="card" style={{ flex: "0 0 auto", textAlign: "center" }}>
            <h2>Join Code</h2>
            <div
              style={{
                fontSize: "1.8rem",
                fontWeight: 800,
                letterSpacing: "0.12em",
                color: "var(--accent)",
                margin: "0.2rem 0 0.7rem",
              }}
            >
              {session.join_code}
            </div>
            {joinUrl && (
              <div style={{ background: "#fff", padding: "0.6rem", borderRadius: "var(--radius-sm)", display: "inline-block" }}>
                <QRCodeSVG value={joinUrl} size={180} />
              </div>
            )}
            {joinUrl && (
              <p className="faint" style={{ marginTop: "0.6rem", maxWidth: "220px", wordBreak: "break-all" }}>
                {joinUrl}
              </p>
            )}
          </div>
          <div className="card" style={{ flex: "1 1 240px" }}>
            <h2>Participants ({participants.length})</h2>
            {participants.length === 0 ? (
              <p className="empty-state">No one has joined yet.</p>
            ) : (
              <ul style={{ margin: 0, paddingLeft: "1.1rem" }}>
                {participants.map((p) => (
                  <li key={p.id} style={{ marginBottom: "0.2rem" }}>
                    {p.display_name}
                    {(p.class_name || p.section || p.roll_number) && (
                      <span className="faint">
                        {" — "}
                        {[p.class_name && `Class ${p.class_name}`, p.section && `Sec ${p.section}`, p.roll_number && `Roll ${p.roll_number}`]
                          .filter(Boolean)
                          .join(", ")}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {session.status !== "in_progress" && (
        <div className="empty-state" style={{ marginTop: "1rem" }}>
          This session is {session.status.replace("_", " ")}.
        </div>
      )}

      {session.status === "in_progress" && (
        <DeckViewer grade={session.class_section_name ? parseGradeFromClassName(session.class_section_name) : null} />
      )}
      {session.status === "in_progress" && <AssessmentManager session={session} />}
    </div>
  );
}
