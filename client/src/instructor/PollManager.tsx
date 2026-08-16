import { useEffect, useState } from "react";
import { api, errorMessage, type Poll, type PollResults, type QuestionType } from "../shared/api";

interface QuestionDraft {
  text: string;
  type: QuestionType;
  optionsText: string;
}

function emptyQuestion(): QuestionDraft {
  return { text: "", type: "single", optionsText: "" };
}

const POLL_STATUS_BADGE: Record<string, string> = {
  draft: "badge-neutral",
  active: "badge-success",
  closed: "badge-info",
};

export function PollManager({ sessionId, topicId }: { sessionId: number; topicId: number | null }) {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [templates, setTemplates] = useState<Poll[]>([]);
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState<QuestionDraft[]>([emptyQuestion()]);
  const [results, setResults] = useState<Record<number, PollResults>>({});
  const [error, setError] = useState<string | null>(null);
  const [tallyDrafts, setTallyDrafts] = useState<Record<number, Record<string, string>>>({});
  const [showCustomForm, setShowCustomForm] = useState(false);

  function refreshPolls() {
    api.polls(sessionId).then(setPolls).catch(() => undefined);
  }

  useEffect(() => {
    refreshPolls();
  }, [sessionId]);

  useEffect(() => {
    if (!topicId) {
      setTemplates([]);
      return;
    }
    api.pollTemplates(topicId).then(setTemplates).catch(() => undefined);
  }, [topicId]);

  async function handleLoadTemplate(templatePollId: number) {
    setError(null);
    try {
      await api.createPollFromTemplate(sessionId, templatePollId);
      refreshPolls();
    } catch (err) {
      setError(errorMessage(err));
    }
  }

  const activePoll = polls.find((p) => p.status === "active");

  useEffect(() => {
    if (!activePoll) return;
    const poll = () =>
      api
        .pollResults(sessionId, activePoll.id)
        .then((r) => setResults((prev) => ({ ...prev, [activePoll.id]: r })))
        .catch(() => undefined);
    poll();
    const interval = setInterval(poll, 2500);
    return () => clearInterval(interval);
  }, [sessionId, activePoll?.id]);

  function updateQuestion(index: number, patch: Partial<QuestionDraft>) {
    setQuestions((prev) => prev.map((q, i) => (i === index ? { ...q, ...patch } : q)));
  }

  async function handleCreatePoll(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await api.createPoll(sessionId, {
        title,
        questions: questions
          .filter((q) => q.text.trim())
          .map((q) => ({
            text: q.text.trim(),
            type: q.type,
            options:
              q.type === "single" || q.type === "multi"
                ? q.optionsText.split(",").map((o) => o.trim()).filter(Boolean)
                : undefined,
          })),
      });
      setTitle("");
      setQuestions([emptyQuestion()]);
      setShowCustomForm(false);
      refreshPolls();
    } catch (err) {
      setError(errorMessage(err));
    }
  }

  async function handleLaunch(pollId: number) {
    setError(null);
    try {
      await api.launchPoll(sessionId, pollId);
      refreshPolls();
    } catch (err) {
      setError(errorMessage(err));
    }
  }

  async function handleClose(pollId: number) {
    setError(null);
    try {
      await api.closePoll(sessionId, pollId);
      refreshPolls();
    } catch (err) {
      setError(errorMessage(err));
    }
  }

  function tallyDraftFor(questionId: number, option: string, currentCount: number): string {
    return tallyDrafts[questionId]?.[option] ?? String(currentCount);
  }

  function updateTallyDraft(questionId: number, option: string, value: string) {
    setTallyDrafts((prev) => ({ ...prev, [questionId]: { ...prev[questionId], [option]: value } }));
  }

  async function handleSaveTally(pollId: number, questionId: number, options: string[]) {
    setError(null);
    try {
      const draft = tallyDrafts[questionId] ?? {};
      const tallies: Record<string, number> = {};
      for (const option of options) {
        tallies[option] = Number(draft[option]) || 0;
      }
      await api.recordTally(sessionId, pollId, questionId, tallies);
      const r = await api.pollResults(sessionId, pollId);
      setResults((prev) => ({ ...prev, [pollId]: r }));
    } catch (err) {
      setError(errorMessage(err));
    }
  }

  return (
    <div className="section">
      <div className="section-header">
        <h2 style={{ margin: 0 }}>Polls & Quizzes</h2>
        <button className="btn-sm" onClick={() => setShowCustomForm((s) => !s)}>
          {showCustomForm ? "✕ Cancel" : "+ Custom poll"}
        </button>
      </div>

      {templates.length > 0 && (
        <div style={{ marginBottom: "1rem" }}>
          <h3 className="muted" style={{ textTransform: "uppercase", fontSize: "0.76rem", letterSpacing: "0.04em" }}>
            From this topic's question bank
          </h3>
          <div className="row" style={{ alignItems: "stretch" }}>
            {templates.map((t) => (
              <div key={t.id} className="card" style={{ flex: "1 1 220px" }}>
                <strong>{t.title}</strong>
                <div className="muted" style={{ margin: "0.25rem 0 0.6rem" }}>
                  {t.type === "quiz" ? "Scored quiz" : "Discussion poll"} · {t.questions.length} questions
                </div>
                <button className="btn-primary btn-sm" onClick={() => handleLoadTemplate(t.id)}>
                  Add to this session
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {showCustomForm && (
        <form onSubmit={handleCreatePoll} className="form-card" style={{ marginBottom: "1rem" }}>
          <input
            placeholder="Poll title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ width: "100%", marginBottom: "0.6rem" }}
          />
          <div className="stack">
            {questions.map((q, i) => (
              <div key={i} className="row" style={{ flexWrap: "nowrap" }}>
                <input
                  placeholder={`Question ${i + 1}`}
                  value={q.text}
                  onChange={(e) => updateQuestion(i, { text: e.target.value })}
                  style={{ flex: 2, minWidth: 0 }}
                />
                <select value={q.type} onChange={(e) => updateQuestion(i, { type: e.target.value as QuestionType })}>
                  <option value="single">Single choice</option>
                  <option value="multi">Multiple choice</option>
                  <option value="text">Text</option>
                </select>
                {(q.type === "single" || q.type === "multi") && (
                  <input
                    placeholder="Options (comma separated)"
                    value={q.optionsText}
                    onChange={(e) => updateQuestion(i, { optionsText: e.target.value })}
                    style={{ flex: 2, minWidth: 0 }}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="row" style={{ marginTop: "0.7rem" }}>
            <button type="button" className="btn-sm" onClick={() => setQuestions((prev) => [...prev, emptyQuestion()])}>
              + Add question
            </button>
            <button type="submit" className="btn-primary btn-sm">
              Create Poll
            </button>
          </div>
        </form>
      )}

      {error && <p className="error-text">{error}</p>}

      <div className="stack">
        {polls.map((poll) => (
          <div key={poll.id} className="card">
            <div className="row" style={{ justifyContent: "space-between" }}>
              <div className="row">
                <strong>{poll.title}</strong>
                <span className={`badge ${POLL_STATUS_BADGE[poll.status] ?? "badge-neutral"}`}>{poll.status}</span>
              </div>
              <div className="row">
                {poll.status === "draft" && (
                  <button className="btn-primary btn-sm" onClick={() => handleLaunch(poll.id)}>
                    Launch
                  </button>
                )}
                {poll.status === "active" && (
                  <button className="btn-sm" onClick={() => handleClose(poll.id)}>
                    Close
                  </button>
                )}
                {poll.status === "closed" && (
                  <button className="btn-sm" onClick={() => handleLaunch(poll.id)}>
                    Relaunch
                  </button>
                )}
              </div>
            </div>

            {results[poll.id] && (
              <div style={{ marginTop: "0.8rem" }} className="stack">
                {results[poll.id].results.map((r) => {
                  const question = poll.questions.find((q) => q.id === r.question_id);
                  const hasOptions = question && question.options.length > 0;
                  const maxCount = Math.max(1, ...Object.values(r.tally));
                  return (
                    <div key={r.question_id}>
                      <div className="row" style={{ justifyContent: "space-between" }}>
                        <span style={{ fontWeight: 600 }}>{r.text}</span>
                        <span className="muted">
                          {r.response_count} responses
                          {r.accuracy !== null && (
                            <span className="badge badge-success" style={{ marginLeft: "0.5rem" }}>
                              {r.accuracy}% correct
                            </span>
                          )}
                        </span>
                      </div>
                      {r.type === "text" ? (
                        <ul style={{ marginTop: "0.4rem" }}>
                          {r.textAnswers.map((a, idx) => (
                            <li key={idx}>{a}</li>
                          ))}
                        </ul>
                      ) : (
                        <div className="stack" style={{ gap: "0.3rem", marginTop: "0.4rem" }}>
                          {Object.entries(r.tally).map(([option, count]) => (
                            <div key={option}>
                              <div className="row" style={{ justifyContent: "space-between", fontSize: "0.85rem" }}>
                                <span style={option === r.correct_answer ? { fontWeight: 700, color: "var(--success)" } : undefined}>
                                  {option}
                                  {option === r.correct_answer && " ✓"}
                                </span>
                                <span className="muted">{count}</span>
                              </div>
                              <div className="meter-track">
                                <div
                                  className="meter-fill"
                                  style={{
                                    width: `${(count / maxCount) * 100}%`,
                                    background: option === r.correct_answer ? "var(--success)" : "var(--accent)",
                                  }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {poll.status === "active" && hasOptions && (
                        <div
                          style={{
                            border: "1px dashed var(--border-strong)",
                            borderRadius: "var(--radius-sm)",
                            padding: "0.6rem",
                            marginTop: "0.5rem",
                            background: "var(--surface-2)",
                          }}
                        >
                          <div className="faint" style={{ marginBottom: "0.4rem" }}>
                            Record show of hands (ask the class, then enter the counts):
                          </div>
                          <div className="row">
                            {question!.options.map((option) => (
                              <label key={option} style={{ fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                                {option}
                                <input
                                  type="number"
                                  min={0}
                                  style={{ width: "3.6rem" }}
                                  value={tallyDraftFor(r.question_id, option, r.tally[option] ?? 0)}
                                  onChange={(e) => updateTallyDraft(r.question_id, option, e.target.value)}
                                />
                              </label>
                            ))}
                            <button className="btn-primary btn-sm" onClick={() => handleSaveTally(poll.id, r.question_id, question!.options)}>
                              Save Tally
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
        {polls.length === 0 && <p className="empty-state">No polls yet for this session — add one from the question bank above.</p>}
      </div>
    </div>
  );
}
