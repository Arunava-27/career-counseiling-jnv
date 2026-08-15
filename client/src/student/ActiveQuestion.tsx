import { useEffect, useState } from "react";
import { api, type Poll } from "../shared/api";

interface Props {
  sessionId: number;
  deviceToken: string;
  topicTitle: string;
  classSectionName: string;
}

export function ActiveQuestion({ sessionId, deviceToken, topicTitle, classSectionName }: Props) {
  const [poll, setPoll] = useState<Poll | null>(null);
  const [answers, setAnswers] = useState<Record<number, string | string[]>>({});
  const [submittedQuestionIds, setSubmittedQuestionIds] = useState<Set<number>>(new Set());
  const [lastPollId, setLastPollId] = useState<number | null>(null);

  useEffect(() => {
    const check = () =>
      api
        .activePoll(sessionId)
        .then((p) => {
          setPoll(p);
          if (p && p.id !== lastPollId) {
            // A new poll became active — clear stale answers/submitted state from the previous one.
            setAnswers({});
            setSubmittedQuestionIds(new Set());
            setLastPollId(p.id);
          }
        })
        .catch(() => undefined);
    check();
    const interval = setInterval(check, 2500);
    return () => clearInterval(interval);
  }, [sessionId, lastPollId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!poll) return;
    for (const q of poll.questions) {
      const answer = answers[q.id];
      if (answer === undefined || answer === "") continue;
      await api.submitResponse(deviceToken, q.id, answer);
    }
    setSubmittedQuestionIds(new Set(poll.questions.map((q) => q.id)));
  }

  const containerStyle: React.CSSProperties = {
    padding: "1.5rem",
    fontFamily: "sans-serif",
    maxWidth: "420px",
    margin: "0 auto",
  };

  if (!poll) {
    return (
      <div style={containerStyle}>
        <h1>{topicTitle}</h1>
        <p>{classSectionName}</p>
        <p>Waiting for your instructor to launch a question...</p>
      </div>
    );
  }

  const alreadySubmitted = poll.questions.every((q) => submittedQuestionIds.has(q.id));

  if (alreadySubmitted) {
    return (
      <div style={containerStyle}>
        <h1>Thanks!</h1>
        <p>Your answers for "{poll.title}" were submitted.</p>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <h1>{poll.title}</h1>
      <form onSubmit={handleSubmit}>
        {poll.questions.map((q) => (
          <div key={q.id} style={{ marginBottom: "1rem" }}>
            <p>{q.text}</p>
            {q.type === "text" && (
              <input
                style={{ width: "100%", padding: "0.5rem" }}
                value={(answers[q.id] as string) ?? ""}
                onChange={(e) => setAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))}
              />
            )}
            {q.type === "single" &&
              q.options.map((opt) => (
                <label key={opt} style={{ display: "block" }}>
                  <input
                    type="radio"
                    name={`q-${q.id}`}
                    value={opt}
                    checked={answers[q.id] === opt}
                    onChange={() => setAnswers((prev) => ({ ...prev, [q.id]: opt }))}
                  />{" "}
                  {opt}
                </label>
              ))}
            {q.type === "multi" &&
              q.options.map((opt) => {
                const selected = (answers[q.id] as string[]) ?? [];
                return (
                  <label key={opt} style={{ display: "block" }}>
                    <input
                      type="checkbox"
                      checked={selected.includes(opt)}
                      onChange={(e) => {
                        const next = e.target.checked
                          ? [...selected, opt]
                          : selected.filter((o) => o !== opt);
                        setAnswers((prev) => ({ ...prev, [q.id]: next }));
                      }}
                    />{" "}
                    {opt}
                  </label>
                );
              })}
          </div>
        ))}
        <button type="submit" style={{ width: "100%", padding: "0.6rem" }}>
          Submit
        </button>
      </form>
    </div>
  );
}
