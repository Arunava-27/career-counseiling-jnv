import { Router } from "express";
import { db } from "../db/connection.js";
import { requireAuth } from "../middleware/requireAuth.js";

export const pollsRouter = Router();

interface QuestionInput {
  text: string;
  type?: "single" | "multi" | "text" | "scale";
  options?: string[];
}

interface QuestionRow {
  id: number;
  poll_id: number;
  order_index: number;
  text: string;
  type: string;
  options_json: string | null;
  correct_answer: string | null;
}

export async function getPollWithQuestions(pollId: number | bigint) {
  const poll = (await db.prepare("SELECT * FROM polls WHERE id = ?").get(pollId)) as
    | { id: number; session_id: number | null; topic_id: number | null; title: string; type: string; status: string }
    | undefined;
  if (!poll) return null;

  const questionRows = (await db
    .prepare("SELECT * FROM poll_questions WHERE poll_id = ? ORDER BY order_index")
    .all(pollId)) as unknown as QuestionRow[];
  const questions = questionRows.map((q) => ({ ...q, options: q.options_json ? JSON.parse(q.options_json) : [] }));

  return { ...poll, questions };
}

// Strips correct_answer before sending to students — the only line of defense against a
// quiz's answers leaking to whoever is about to answer it.
function forStudents<T extends { questions: { correct_answer: string | null }[] }>(poll: T) {
  return {
    ...poll,
    questions: poll.questions.map(({ correct_answer, ...q }) => q),
  };
}

pollsRouter.get("/:sessionId/polls", requireAuth, async (req, res) => {
  const polls = (await db
    .prepare("SELECT * FROM polls WHERE session_id = ? ORDER BY id")
    .all(req.params.sessionId)) as { id: number }[];
  res.json(await Promise.all(polls.map((p) => getPollWithQuestions(p.id))));
});

pollsRouter.post("/:sessionId/polls", requireAuth, async (req, res) => {
  const { title, type, questions } = req.body as {
    title: string;
    type?: "poll" | "quiz";
    questions: QuestionInput[];
  };

  if (!title || !questions || questions.length === 0) {
    res.status(400).json({ error: "title and at least one question are required" });
    return;
  }

  const pollResult = await db
    .prepare("INSERT INTO polls (session_id, title, type, status) VALUES (?, ?, ?, 'draft')")
    .run(req.params.sessionId, title, type ?? "poll");

  const insertQuestion = db.prepare(
    "INSERT INTO poll_questions (poll_id, order_index, text, type, options_json) VALUES (?, ?, ?, ?, ?)"
  );
  for (const [index, q] of questions.entries()) {
    await insertQuestion.run(
      pollResult.lastInsertRowid!,
      index + 1,
      q.text,
      q.type ?? "single",
      q.options ? JSON.stringify(q.options) : null
    );
  }

  res.status(201).json(await getPollWithQuestions(pollResult.lastInsertRowid!));
});

pollsRouter.post("/:sessionId/polls/from-template/:templatePollId", requireAuth, async (req, res) => {
  const template = await getPollWithQuestions(Number(req.params.templatePollId));
  if (!template || template.session_id !== null) {
    res.status(404).json({ error: "Template not found" });
    return;
  }

  const pollResult = await db
    .prepare("INSERT INTO polls (session_id, title, type, status) VALUES (?, ?, ?, 'draft')")
    .run(req.params.sessionId, template.title, template.type);

  const insertQuestion = db.prepare(
    "INSERT INTO poll_questions (poll_id, order_index, text, type, options_json, correct_answer) VALUES (?, ?, ?, ?, ?, ?)"
  );
  for (const [index, q] of template.questions.entries()) {
    await insertQuestion.run(
      pollResult.lastInsertRowid!,
      index + 1,
      q.text,
      q.type,
      q.options_json,
      q.correct_answer
    );
  }

  res.status(201).json(await getPollWithQuestions(pollResult.lastInsertRowid!));
});

pollsRouter.post("/:sessionId/polls/:pollId/launch", requireAuth, async (req, res) => {
  const { sessionId, pollId } = req.params;

  // Only one poll can be active per session at a time.
  await db.prepare("UPDATE polls SET status = 'closed' WHERE session_id = ? AND status = 'active'").run(sessionId);
  await db.prepare("UPDATE polls SET status = 'active' WHERE id = ? AND session_id = ?").run(pollId, sessionId);

  const poll = await getPollWithQuestions(Number(pollId));
  if (!poll) {
    res.status(404).json({ error: "Poll not found" });
    return;
  }
  res.json(poll);
});

pollsRouter.post("/:sessionId/polls/:pollId/close", requireAuth, async (req, res) => {
  await db
    .prepare("UPDATE polls SET status = 'closed' WHERE id = ? AND session_id = ?")
    .run(req.params.pollId, req.params.sessionId);
  res.json(await getPollWithQuestions(Number(req.params.pollId)));
});

// Student-facing — must never include correct_answer.
pollsRouter.get("/:sessionId/active-poll", async (req, res) => {
  const poll = (await db
    .prepare("SELECT id FROM polls WHERE session_id = ? AND status = 'active' LIMIT 1")
    .get(req.params.sessionId)) as { id: number } | undefined;

  if (!poll) {
    res.json(null);
    return;
  }
  const full = await getPollWithQuestions(poll.id);
  res.json(full ? forStudents(full) : null);
});

// Instructor records a class-wide show of hands for a question — used instead of (or
// alongside) individual device responses when students have no devices of their own.
// Replaces the full set of counts each time so the instructor can correct a miscount.
pollsRouter.post("/:sessionId/polls/:pollId/questions/:questionId/tally", requireAuth, async (req, res) => {
  const { tallies } = req.body as { tallies?: Record<string, number> };
  if (!tallies) {
    res.status(400).json({ error: "tallies is required" });
    return;
  }

  const upsert = db.prepare(
    `INSERT INTO poll_option_tallies (question_id, option_text, count) VALUES (?, ?, ?)
     ON CONFLICT(question_id, option_text) DO UPDATE SET count = excluded.count`
  );
  for (const [option, count] of Object.entries(tallies)) {
    await upsert.run(req.params.questionId, option, Number(count) || 0);
  }

  res.json({ ok: true });
});

pollsRouter.get("/:sessionId/polls/:pollId/results", requireAuth, async (req, res) => {
  const poll = await getPollWithQuestions(Number(req.params.pollId));
  if (!poll) {
    res.status(404).json({ error: "Poll not found" });
    return;
  }

  const results = await Promise.all(
    poll.questions.map(async (q) => {
      const responses = (await db
        .prepare("SELECT answer_json FROM poll_responses WHERE question_id = ?")
        .all(q.id)) as { answer_json: string }[];

      const manualTallies = (await db
        .prepare("SELECT option_text, count FROM poll_option_tallies WHERE question_id = ?")
        .all(q.id)) as { option_text: string; count: number }[];

      const tally: Record<string, number> = {};
      const textAnswers: string[] = [];
      let correctCount = 0;
      let deviceResponseCount = 0;

      for (const r of responses) {
        const answer = JSON.parse(r.answer_json);
        if (q.type === "text") {
          textAnswers.push(String(answer));
        } else {
          deviceResponseCount++;
          const choices = Array.isArray(answer) ? answer : [answer];
          for (const choice of choices) {
            tally[choice] = (tally[choice] ?? 0) + 1;
          }
          if (q.correct_answer && !Array.isArray(answer) && answer === q.correct_answer) {
            correctCount++;
          }
        }
      }

      let manualTotal = 0;
      for (const { option_text, count } of manualTallies) {
        tally[option_text] = (tally[option_text] ?? 0) + count;
        manualTotal += count;
        if (q.correct_answer && option_text === q.correct_answer) {
          correctCount += count;
        }
      }

      const totalResponses = deviceResponseCount + manualTotal;

      return {
        question_id: q.id,
        text: q.text,
        type: q.type,
        response_count: totalResponses,
        tally,
        textAnswers,
        correct_answer: q.correct_answer,
        correct_count: q.correct_answer ? correctCount : null,
        accuracy: q.correct_answer && totalResponses > 0 ? Math.round((correctCount / totalResponses) * 100) : null,
      };
    })
  );

  res.json({ poll_id: poll.id, title: poll.title, results });
});
