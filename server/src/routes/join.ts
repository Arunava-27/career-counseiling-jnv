import { Router } from "express";
import { db } from "../db/connection.js";

export const joinRouter = Router();

joinRouter.get("/:code", async (req, res) => {
  const code = req.params.code.toUpperCase();
  const session = await db
    .prepare(
      `SELECT s.id, s.session_number, s.status, t.title as topic_title, c.name as class_section_name
       FROM sessions s
       LEFT JOIN curriculum_topics t ON t.id = s.topic_id
       LEFT JOIN class_sections c ON c.id = s.class_section_id
       WHERE s.join_code = ? AND s.status = 'in_progress'`
    )
    .get(code);

  if (!session) {
    res.status(404).json({ error: "No active session with that code" });
    return;
  }

  res.json(session);
});
