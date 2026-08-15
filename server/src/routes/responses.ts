import { Router } from "express";
import { db } from "../db/connection.js";

export const responsesRouter = Router();

responsesRouter.post("/", async (req, res) => {
  const { device_token, question_id, answer } = req.body as {
    device_token?: string;
    question_id?: number;
    answer?: unknown;
  };

  if (!device_token || !question_id || answer === undefined) {
    res.status(400).json({ error: "device_token, question_id, and answer are required" });
    return;
  }

  const participant = (await db.prepare("SELECT * FROM participants WHERE device_token = ?").get(device_token)) as
    | { id: number; session_id: number }
    | undefined;
  if (!participant) {
    res.status(403).json({ error: "Unknown participant" });
    return;
  }

  const question = (await db
    .prepare(
      `SELECT pq.id, p.session_id FROM poll_questions pq
       JOIN polls p ON p.id = pq.poll_id
       WHERE pq.id = ?`
    )
    .get(question_id)) as { id: number; session_id: number } | undefined;

  if (!question || question.session_id !== participant.session_id) {
    res.status(400).json({ error: "Question does not belong to your session" });
    return;
  }

  await db
    .prepare(
      `INSERT INTO poll_responses (question_id, session_id, participant_id, answer_json, submitted_at)
       VALUES (?, ?, ?, ?, ?)
       ON CONFLICT(question_id, participant_id) DO UPDATE SET answer_json = excluded.answer_json, submitted_at = excluded.submitted_at`
    )
    .run(question_id, participant.session_id, participant.id, JSON.stringify(answer), new Date().toISOString());

  res.status(201).json({ ok: true });
});
