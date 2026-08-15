import { Router } from "express";
import { db } from "../db/connection.js";

export const assessmentResponsesRouter = Router();

// Student submits answers for the active assessment. Always returns a bare
// acknowledgment — never echoes back scores, so students can't see their own results.
assessmentResponsesRouter.post("/", async (req, res) => {
  const { device_token, instrument_id, answers } = req.body as {
    device_token?: string;
    instrument_id?: number;
    answers?: Record<string, string>;
  };

  if (!device_token || !instrument_id || !answers) {
    res.status(400).json({ error: "device_token, instrument_id, and answers are required" });
    return;
  }

  const participant = (await db.prepare("SELECT * FROM participants WHERE device_token = ?").get(device_token)) as
    | { id: number; session_id: number }
    | undefined;
  if (!participant) {
    res.status(403).json({ error: "Unknown participant" });
    return;
  }

  const session = (await db
    .prepare("SELECT active_assessment_id FROM sessions WHERE id = ?")
    .get(participant.session_id)) as { active_assessment_id: number | null } | undefined;
  if (!session || session.active_assessment_id !== instrument_id) {
    res.status(400).json({ error: "This assessment is not currently active for your session" });
    return;
  }

  await db
    .prepare(
      `INSERT INTO assessment_responses (instrument_id, session_id, participant_id, answers_json, submitted_at)
       VALUES (?, ?, ?, ?, ?)
       ON CONFLICT(instrument_id, participant_id) DO UPDATE SET answers_json = excluded.answers_json, submitted_at = excluded.submitted_at`
    )
    .run(instrument_id, participant.session_id, participant.id, JSON.stringify(answers), new Date().toISOString());

  res.status(201).json({ ok: true });
});
