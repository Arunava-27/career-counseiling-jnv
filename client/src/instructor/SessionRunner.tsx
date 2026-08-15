import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { api, type Participant, type Session } from "../shared/api";
import { PollManager } from "./PollManager";
import { TopicContent } from "./TopicContent";
import { AssessmentManager } from "./AssessmentManager";

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
    api.serverInfo().then((info) => {
      const host = info.lanAddresses[0] ?? window.location.hostname;
      // Use the port this page itself was loaded on, not the API server's port — in dev mode
      // those differ (Vite serves the app, Express only serves /api), so pointing students at
      // the API server's port gives them a 404 instead of the join page. Whatever port got us
      // this page is guaranteed to actually serve the app.
      const port = window.location.port ? `:${window.location.port}` : "";
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
      <div style={{ padding: "1.5rem", fontFamily: "sans-serif" }}>
        <p>Loading session...</p>
        <Link to="/console">Back to Dashboard</Link>
      </div>
    );
  }

  const joinUrl = lanUrl && session.join_code ? `${lanUrl}/join?code=${session.join_code}` : null;

  return (
    <div style={{ padding: "1.5rem", fontFamily: "sans-serif" }}>
      <Link to="/console">&larr; Back to Dashboard</Link>
      <h1>
        Session {session.session_number}: {session.topic_title}
      </h1>
      <p>
        {session.class_section_name} &mdash; {session.instructor_name}
      </p>

      {session.status === "in_progress" && (
        <div style={{ display: "flex", gap: "2rem", alignItems: "flex-start", marginTop: "1rem" }}>
          <div>
            <h2>Join Code: {session.join_code}</h2>
            {joinUrl && <QRCodeSVG value={joinUrl} size={220} />}
            {joinUrl && <p style={{ fontSize: "0.85rem", wordBreak: "break-all" }}>{joinUrl}</p>}
          </div>
          <div>
            <h2>Participants ({participants.length})</h2>
            <ul>
              {participants.map((p) => (
                <li key={p.id}>
                  {p.display_name}
                  {p.roll_number && ` (${p.roll_number})`}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {session.status !== "in_progress" && <p>This session is {session.status}.</p>}

      {session.status === "in_progress" && <TopicContent topicId={session.topic_id} />}
      {session.status === "in_progress" && <PollManager sessionId={sessionId} topicId={session.topic_id} />}
      {session.status === "in_progress" && <AssessmentManager session={session} />}
    </div>
  );
}
