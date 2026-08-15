import { useEffect, useState } from "react";
import { api, type AssessmentInstrument } from "../shared/api";

interface Props {
  sessionId: number;
  deviceToken: string;
  onSubmitted?: () => void;
}

export function ActiveAssessment({ sessionId, deviceToken, onSubmitted }: Props) {
  const [instrument, setInstrument] = useState<AssessmentInstrument | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submittedInstrumentId, setSubmittedInstrumentId] = useState<number | null>(null);
  const [lastSeenInstrumentId, setLastSeenInstrumentId] = useState<number | null>(null);

  useEffect(() => {
    const check = () =>
      api
        .activeAssessment(sessionId)
        .then((i) => {
          setInstrument(i);
          if (i && i.id !== lastSeenInstrumentId) {
            // Only clear answers when a genuinely new assessment appears, not on every poll tick.
            setAnswers({});
            setLastSeenInstrumentId(i.id);
          }
        })
        .catch(() => undefined);
    check();
    const interval = setInterval(check, 3000);
    return () => clearInterval(interval);
  }, [sessionId, lastSeenInstrumentId]);

  if (!instrument) return null;
  if (instrument.id === submittedInstrumentId) {
    return (
      <div style={{ marginTop: "1.5rem", padding: "1rem", border: "1px solid #ddd" }}>
        <p>Thanks — your responses for "{instrument.name}" were submitted.</p>
      </div>
    );
  }

  const allAnswered = instrument.questions.every((q) => answers[q.id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!instrument) return;
    await api.submitAssessmentResponse(deviceToken, instrument.id, answers);
    setSubmittedInstrumentId(instrument.id);
    onSubmitted?.();
  }

  return (
    <div style={{ marginTop: "1.5rem", padding: "1rem", border: "1px solid #ddd" }}>
      <h2>{instrument.name}</h2>
      {instrument.description && <p style={{ fontSize: "0.85rem", color: "#666" }}>{instrument.description}</p>}
      <form onSubmit={handleSubmit}>
        {instrument.questions.map((q) => (
          <div key={q.id} style={{ marginBottom: "0.8rem" }}>
            <p>{q.text}</p>
            <div style={{ display: "flex", gap: "0.8rem" }}>
              {q.options.map((opt) => (
                <label key={opt}>
                  <input
                    type="radio"
                    name={`aq-${q.id}`}
                    value={opt}
                    checked={answers[q.id] === opt}
                    onChange={() => setAnswers((prev) => ({ ...prev, [q.id]: opt }))}
                  />{" "}
                  {opt}
                </label>
              ))}
            </div>
          </div>
        ))}
        <button type="submit" disabled={!allAnswered} style={{ width: "100%", padding: "0.6rem" }}>
          Submit
        </button>
      </form>
    </div>
  );
}
