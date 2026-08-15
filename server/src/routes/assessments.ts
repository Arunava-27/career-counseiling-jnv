import { Router } from "express";
import { db } from "../db/connection.js";
import { requireAuth } from "../middleware/requireAuth.js";

export const assessmentLibraryRouter = Router();
assessmentLibraryRouter.use(requireAuth); // instructor-only — students never browse the instrument library
export const assessmentsRouter = Router();

interface AssessmentQuestionInput {
  text: string;
  scoring_dimension?: string;
  options?: string[];
}

async function getInstrumentWithQuestions(instrumentId: number | bigint) {
  const instrument = (await db.prepare("SELECT * FROM assessment_instruments WHERE id = ?").get(instrumentId)) as
    | { id: number; name: string; type: string; description: string | null }
    | undefined;
  if (!instrument) return null;

  const questionRows = (await db
    .prepare("SELECT * FROM assessment_questions WHERE instrument_id = ? ORDER BY order_index")
    .all(instrumentId)) as {
    id: number;
    instrument_id: number;
    order_index: number;
    text: string;
    options_json: string | null;
    scoring_dimension: string | null;
  }[];
  const questions = questionRows.map((q) => ({ ...q, options: q.options_json ? JSON.parse(q.options_json) : [] }));

  return { ...instrument, questions };
}

// Instrument library (not session-scoped — reusable across the whole programme).
assessmentLibraryRouter.get("/", async (_req, res) => {
  const instruments = (await db.prepare("SELECT id FROM assessment_instruments ORDER BY id").all()) as {
    id: number;
  }[];
  res.json(await Promise.all(instruments.map((i) => getInstrumentWithQuestions(i.id))));
});

assessmentLibraryRouter.post("/", async (req, res) => {
  const { name, type, description, questions } = req.body as {
    name: string;
    type?: string;
    description?: string;
    questions: AssessmentQuestionInput[];
  };

  if (!name || !questions || questions.length === 0) {
    res.status(400).json({ error: "name and at least one question are required" });
    return;
  }

  const instrumentResult = await db
    .prepare("INSERT INTO assessment_instruments (name, type, description) VALUES (?, ?, ?)")
    .run(name, type ?? "psychometric", description ?? null);

  const insertQuestion = db.prepare(
    "INSERT INTO assessment_questions (instrument_id, order_index, text, options_json, scoring_dimension) VALUES (?, ?, ?, ?, ?)"
  );
  for (const [index, q] of questions.entries()) {
    await insertQuestion.run(
      instrumentResult.lastInsertRowid!,
      index + 1,
      q.text,
      q.options ? JSON.stringify(q.options) : JSON.stringify(["1", "2", "3", "4", "5"]),
      q.scoring_dimension ?? null
    );
  }

  res.status(201).json(await getInstrumentWithQuestions(instrumentResult.lastInsertRowid!));
});

// Session-scoped launch/close/active — mounted at /api/sessions.
assessmentsRouter.post("/:sessionId/assessments/:instrumentId/launch", requireAuth, async (req, res) => {
  const { sessionId, instrumentId } = req.params;
  const session = await db.prepare("SELECT * FROM sessions WHERE id = ?").get(sessionId);
  if (!session) {
    res.status(404).json({ error: "Session not found" });
    return;
  }

  await db.prepare("UPDATE sessions SET active_assessment_id = ? WHERE id = ?").run(instrumentId, sessionId);
  res.json(await getInstrumentWithQuestions(Number(instrumentId)));
});

assessmentsRouter.post("/:sessionId/assessments/close", requireAuth, async (req, res) => {
  await db.prepare("UPDATE sessions SET active_assessment_id = NULL WHERE id = ?").run(req.params.sessionId);
  res.json({ ok: true });
});

// Student-facing: question list only, never any response/score data.
assessmentsRouter.get("/:sessionId/active-assessment", async (req, res) => {
  const session = (await db
    .prepare("SELECT active_assessment_id FROM sessions WHERE id = ?")
    .get(req.params.sessionId)) as { active_assessment_id: number | null } | undefined;

  if (!session || !session.active_assessment_id) {
    res.json(null);
    return;
  }
  res.json(await getInstrumentWithQuestions(session.active_assessment_id));
});

// Instructor-only: per-participant raw answers plus a simple per-dimension sum.
assessmentsRouter.get("/:sessionId/assessments/:instrumentId/results", requireAuth, async (req, res) => {
  const instrument = await getInstrumentWithQuestions(Number(req.params.instrumentId));
  if (!instrument) {
    res.status(404).json({ error: "Instrument not found" });
    return;
  }

  const rows = (await db
    .prepare(
      `SELECT ar.participant_id, p.display_name, ar.answers_json, ar.submitted_at
       FROM assessment_responses ar
       JOIN participants p ON p.id = ar.participant_id
       WHERE ar.instrument_id = ? AND ar.session_id = ?`
    )
    .all(req.params.instrumentId, req.params.sessionId)) as {
    participant_id: number;
    display_name: string;
    answers_json: string;
    submitted_at: string;
  }[];

  const questionDimension = new Map(instrument.questions.map((q) => [q.id, q.scoring_dimension]));

  const participantResults = rows.map((row) => {
    const answers = JSON.parse(row.answers_json) as Record<string, string>;
    const dimensionTotals: Record<string, number> = {};

    for (const [questionId, value] of Object.entries(answers)) {
      const dimension = questionDimension.get(Number(questionId));
      const numeric = Number(value);
      if (dimension && !Number.isNaN(numeric)) {
        dimensionTotals[dimension] = (dimensionTotals[dimension] ?? 0) + numeric;
      }
    }

    return {
      participant_id: row.participant_id,
      display_name: row.display_name,
      answers,
      dimension_totals: dimensionTotals,
      submitted_at: row.submitted_at,
    };
  });

  res.json({ instrument_id: instrument.id, name: instrument.name, participants: participantResults });
});
