import { useEffect, useState } from "react";
import { api, type AssessmentInstrument } from "../shared/api";

interface Props {
  sessionId: number;
  deviceToken: string;
  onSubmitted?: () => void;
}

// Human-readable labels for each rating scale used across instruments, keyed by option count.
// Options are stored/submitted as plain numeric strings ("1".."5") for scoring — these labels
// are display-only, so a student never has to interpret a bare digit.
const SCALE_LABELS: Record<number, string[]> = {
  3: ["Not really", "A little", "Yes, a lot!"],
  5: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
};

function labelFor(options: string[], option: string): string {
  const labels = SCALE_LABELS[options.length];
  if (!labels) return option;
  const idx = options.indexOf(option);
  return labels[idx] ?? option;
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

  if (!instrument) {
    return (
      <div className="card" style={{ textAlign: "center" }}>
        <p className="muted">Waiting for your instructor to begin.</p>
      </div>
    );
  }

  // Students only ever see the soft, non-clinical title — `name` is the technical label
  // instructors see on the console, and `description` is written for instructors too, so
  // neither is shown here.
  const displayTitle = instrument.student_label ?? instrument.name;
  if (instrument.id === submittedInstrumentId) {
    return (
      <div className="card" style={{ textAlign: "center" }}>
        <p style={{ fontSize: "1.1rem" }}>🎉 Thanks — your responses were submitted.</p>
      </div>
    );
  }

  const answeredCount = instrument.questions.filter((q) => answers[q.id]).length;
  const total = instrument.questions.length;
  const allAnswered = answeredCount === total;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!instrument) return;
    await api.submitAssessmentResponse(deviceToken, instrument.id, answers);
    setSubmittedInstrumentId(instrument.id);
    onSubmitted?.();
  }

  return (
    <div style={{ textAlign: "left" }}>
      <h2>{displayTitle}</h2>

      <div style={{ position: "sticky", top: 0, background: "var(--bg)", padding: "0.5rem 0", zIndex: 1 }}>
        <div className="row" style={{ justifyContent: "space-between", fontSize: "0.85rem" }}>
          <span className="muted">
            {answeredCount} of {total} answered
          </span>
          {allAnswered && <span className="badge badge-success">All done!</span>}
        </div>
        <div className="meter-track">
          <div className="meter-fill" style={{ width: `${(answeredCount / total) * 100}%` }} />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="stack" style={{ marginTop: "0.8rem" }}>
        {instrument.questions.map((q, idx) => (
          <div key={q.id} className="card">
            <p style={{ fontWeight: 600, marginBottom: "0.6rem" }}>
              {idx + 1}. {q.text}
            </p>
            <div className="row">
              {q.options.map((opt) => {
                const selected = answers[q.id] === opt;
                return (
                  <label
                    key={opt}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "0.5rem 1rem",
                      borderRadius: "999px",
                      border: `1.5px solid ${selected ? "var(--accent)" : "var(--border-strong)"}`,
                      background: selected ? "var(--accent)" : "var(--surface)",
                      color: selected ? "#fff" : "var(--text)",
                      fontWeight: 600,
                      fontSize: "0.9rem",
                      cursor: "pointer",
                      transition: "all 0.12s ease",
                    }}
                  >
                    <input
                      type="radio"
                      name={`aq-${q.id}`}
                      value={opt}
                      checked={selected}
                      onChange={() => setAnswers((prev) => ({ ...prev, [q.id]: opt }))}
                      style={{ display: "none" }}
                    />
                    {labelFor(q.options, opt)}
                  </label>
                );
              })}
            </div>
          </div>
        ))}
        <button type="submit" className="btn-primary" disabled={!allAnswered} style={{ width: "100%", padding: "0.9rem", fontSize: "1.05rem" }}>
          {allAnswered ? "Submit" : `Answer all ${total} to submit`}
        </button>
      </form>
    </div>
  );
}
