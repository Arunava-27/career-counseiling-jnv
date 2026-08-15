import { useEffect, useState } from "react";
import { api, type Poll, type PollResults, type QuestionType } from "../shared/api";

interface QuestionDraft {
  text: string;
  type: QuestionType;
  optionsText: string;
}

function emptyQuestion(): QuestionDraft {
  return { text: "", type: "single", optionsText: "" };
}

export function PollManager({ sessionId, topicId }: { sessionId: number; topicId: number | null }) {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [templates, setTemplates] = useState<Poll[]>([]);
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState<QuestionDraft[]>([emptyQuestion()]);
  const [results, setResults] = useState<Record<number, PollResults>>({});
  const [error, setError] = useState<string | null>(null);
  const [tallyDrafts, setTallyDrafts] = useState<Record<number, Record<string, string>>>({});

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
    await api.createPollFromTemplate(sessionId, templatePollId);
    refreshPolls();
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
      refreshPolls();
    } catch (err) {
      setError(String(err));
    }
  }

  async function handleLaunch(pollId: number) {
    await api.launchPoll(sessionId, pollId);
    refreshPolls();
  }

  async function handleClose(pollId: number) {
    await api.closePoll(sessionId, pollId);
    refreshPolls();
  }

  function tallyDraftFor(questionId: number, option: string, currentCount: number): string {
    return tallyDrafts[questionId]?.[option] ?? String(currentCount);
  }

  function updateTallyDraft(questionId: number, option: string, value: string) {
    setTallyDrafts((prev) => ({ ...prev, [questionId]: { ...prev[questionId], [option]: value } }));
  }

  async function handleSaveTally(pollId: number, questionId: number, options: string[]) {
    const draft = tallyDrafts[questionId] ?? {};
    const tallies: Record<string, number> = {};
    for (const option of options) {
      tallies[option] = Number(draft[option]) || 0;
    }
    await api.recordTally(sessionId, pollId, questionId, tallies);
    const r = await api.pollResults(sessionId, pollId);
    setResults((prev) => ({ ...prev, [pollId]: r }));
  }

  return (
    <div style={{ marginTop: "2rem" }}>
      <h2>Polls</h2>

      {templates.length > 0 && (
        <div style={{ marginBottom: "1rem" }}>
          <h3 style={{ fontSize: "1rem" }}>From this topic's question bank</h3>
          <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
            {templates.map((t) => (
              <div key={t.id} style={{ border: "1px solid #ddd", padding: "0.6rem", flex: "1 1 200px" }}>
                <strong>{t.title}</strong> ({t.type === "quiz" ? "scored quiz" : "discussion poll"})
                <div>{t.questions.length} questions</div>
                <button onClick={() => handleLoadTemplate(t.id)}>Add to this session</button>
              </div>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={handleCreatePoll} style={{ border: "1px solid #ccc", padding: "1rem", marginBottom: "1rem" }}>
        <input
          placeholder="Poll title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{ width: "100%", marginBottom: "0.5rem", padding: "0.4rem" }}
        />
        {questions.map((q, i) => (
          <div key={i} style={{ display: "flex", gap: "0.4rem", marginBottom: "0.4rem" }}>
            <input
              placeholder={`Question ${i + 1}`}
              value={q.text}
              onChange={(e) => updateQuestion(i, { text: e.target.value })}
              style={{ flex: 2, padding: "0.4rem" }}
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
                style={{ flex: 2, padding: "0.4rem" }}
              />
            )}
          </div>
        ))}
        <button type="button" onClick={() => setQuestions((prev) => [...prev, emptyQuestion()])}>
          + Add question
        </button>
        <button type="submit" style={{ marginLeft: "0.5rem" }}>
          Create Poll
        </button>
      </form>

      {error && <p style={{ color: "crimson" }}>{error}</p>}

      {polls.map((poll) => (
        <div key={poll.id} style={{ border: "1px solid #eee", padding: "0.8rem", marginBottom: "0.6rem" }}>
          <strong>{poll.title}</strong> — {poll.status}
          {poll.status === "draft" && (
            <button style={{ marginLeft: "0.6rem" }} onClick={() => handleLaunch(poll.id)}>
              Launch
            </button>
          )}
          {poll.status === "active" && (
            <button style={{ marginLeft: "0.6rem" }} onClick={() => handleClose(poll.id)}>
              Close
            </button>
          )}
          {poll.status === "closed" && (
            <button style={{ marginLeft: "0.6rem" }} onClick={() => handleLaunch(poll.id)}>
              Relaunch
            </button>
          )}

          {results[poll.id] && (
            <div style={{ marginTop: "0.6rem" }}>
              {results[poll.id].results.map((r) => {
                const question = poll.questions.find((q) => q.id === r.question_id);
                const hasOptions = question && question.options.length > 0;
                return (
                  <div key={r.question_id} style={{ marginBottom: "0.8rem" }}>
                    <div>
                      {r.text} ({r.response_count} responses)
                      {r.accuracy !== null && <strong> — {r.accuracy}% correct</strong>}
                    </div>
                    {r.type === "text" ? (
                      <ul>
                        {r.textAnswers.map((a, idx) => (
                          <li key={idx}>{a}</li>
                        ))}
                      </ul>
                    ) : (
                      <ul>
                        {Object.entries(r.tally).map(([option, count]) => (
                          <li key={option} style={option === r.correct_answer ? { fontWeight: "bold" } : undefined}>
                            {option}: {count}
                            {option === r.correct_answer && " ✓ correct"}
                          </li>
                        ))}
                      </ul>
                    )}

                    {poll.status === "active" && hasOptions && (
                      <div style={{ border: "1px dashed #bbb", padding: "0.5rem", marginTop: "0.3rem" }}>
                        <div style={{ fontSize: "0.85rem", marginBottom: "0.3rem" }}>
                          Record show of hands (ask the class, then enter the counts):
                        </div>
                        <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", alignItems: "center" }}>
                          {question!.options.map((option) => (
                            <label key={option} style={{ fontSize: "0.85rem" }}>
                              {option}{" "}
                              <input
                                type="number"
                                min={0}
                                style={{ width: "3.5rem" }}
                                value={tallyDraftFor(r.question_id, option, r.tally[option] ?? 0)}
                                onChange={(e) => updateTallyDraft(r.question_id, option, e.target.value)}
                              />
                            </label>
                          ))}
                          <button onClick={() => handleSaveTally(poll.id, r.question_id, question!.options)}>
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
    </div>
  );
}
