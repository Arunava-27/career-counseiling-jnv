import { randomUUID } from "node:crypto";
import { Router } from "express";
import { db } from "../db/connection.js";
import { generateJoinCode } from "../services/joinCodeService.js";
import { requireAuth } from "../middleware/requireAuth.js";

export const sessionsRouter = Router();

const SESSION_LIST_QUERY = `
  SELECT
    s.id, s.session_number, s.date, s.scheduled_start_time, s.scheduled_end_time,
    s.instructor_name, s.status,
    s.join_code, s.started_at, s.completed_at, s.notes, s.active_assessment_id, s.attendance_count,
    t.id as topic_id, t.title as topic_title,
    c.id as class_section_id, c.name as class_section_name
  FROM sessions s
  LEFT JOIN curriculum_topics t ON t.id = s.topic_id
  LEFT JOIN class_sections c ON c.id = s.class_section_id
  ORDER BY s.session_number
`;

sessionsRouter.get("/", requireAuth, async (_req, res) => {
  res.json(await db.prepare(SESSION_LIST_QUERY).all());
});

interface SessionInput {
  session_number: number;
  date?: string;
  scheduled_start_time?: string;
  scheduled_end_time?: string;
  topic_id?: number;
  class_section_id?: number;
  instructor_name?: string;
  notes?: string;
  attendance_count?: number;
}

sessionsRouter.post("/", requireAuth, async (req, res) => {
  const {
    session_number,
    date,
    scheduled_start_time,
    scheduled_end_time,
    topic_id,
    class_section_id,
    instructor_name,
    notes,
    attendance_count,
  } = req.body as SessionInput;

  if (!session_number) {
    res.status(400).json({ error: "session_number is required" });
    return;
  }

  const result = await db
    .prepare(
      `INSERT INTO sessions
        (session_number, date, scheduled_start_time, scheduled_end_time, topic_id, class_section_id, instructor_name, notes, attendance_count, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'scheduled')`
    )
    .run(
      session_number,
      date ?? null,
      scheduled_start_time ?? null,
      scheduled_end_time ?? null,
      topic_id ?? null,
      class_section_id ?? null,
      instructor_name ?? null,
      notes ?? null,
      attendance_count ?? null
    );

  const created = await db
    .prepare(SESSION_LIST_QUERY.replace("ORDER BY s.session_number", "WHERE s.id = ?"))
    .get(result.lastInsertRowid!);
  res.status(201).json(created);
});

sessionsRouter.put("/:id", requireAuth, async (req, res) => {
  const existing = await db.prepare("SELECT id FROM sessions WHERE id = ?").get(req.params.id);
  if (!existing) {
    res.status(404).json({ error: "Session not found" });
    return;
  }

  const {
    session_number,
    date,
    scheduled_start_time,
    scheduled_end_time,
    topic_id,
    class_section_id,
    instructor_name,
    notes,
    attendance_count,
  } = req.body as Partial<SessionInput>;

  await db
    .prepare(
      `UPDATE sessions SET
        session_number = COALESCE(?, session_number),
        date = COALESCE(?, date),
        scheduled_start_time = COALESCE(?, scheduled_start_time),
        scheduled_end_time = COALESCE(?, scheduled_end_time),
        topic_id = COALESCE(?, topic_id),
        class_section_id = COALESCE(?, class_section_id),
        instructor_name = COALESCE(?, instructor_name),
        notes = COALESCE(?, notes),
        attendance_count = COALESCE(?, attendance_count)
      WHERE id = ?`
    )
    .run(
      session_number ?? null,
      date ?? null,
      scheduled_start_time ?? null,
      scheduled_end_time ?? null,
      topic_id ?? null,
      class_section_id ?? null,
      instructor_name ?? null,
      notes ?? null,
      attendance_count ?? null,
      req.params.id
    );

  const updated = await db
    .prepare(SESSION_LIST_QUERY.replace("ORDER BY s.session_number", "WHERE s.id = ?"))
    .get(req.params.id);
  res.json(updated);
});

// Deleting a session is a deliberate, irreversible instructor action (confirmed client-side
// before this ever gets called) — it cascades through every dependent record rather than being
// blocked by them, since "delete this session" should mean exactly that.
sessionsRouter.delete("/:id", requireAuth, async (req, res) => {
  const id = req.params.id;

  await db
    .prepare("DELETE FROM poll_responses WHERE session_id = ?")
    .run(id);
  await db
    .prepare(
      "DELETE FROM poll_option_tallies WHERE question_id IN (SELECT pq.id FROM poll_questions pq JOIN polls p ON p.id = pq.poll_id WHERE p.session_id = ?)"
    )
    .run(id);
  await db
    .prepare("DELETE FROM poll_questions WHERE poll_id IN (SELECT id FROM polls WHERE session_id = ?)")
    .run(id);
  await db.prepare("DELETE FROM polls WHERE session_id = ?").run(id);
  await db.prepare("DELETE FROM assessment_responses WHERE session_id = ?").run(id);
  await db.prepare("DELETE FROM participants WHERE session_id = ?").run(id);
  await db.prepare("DELETE FROM sessions WHERE id = ?").run(id);

  res.status(204).end();
});

sessionsRouter.post("/:id/start", requireAuth, async (req, res) => {
  const session = await db.prepare("SELECT * FROM sessions WHERE id = ?").get(req.params.id);
  if (!session) {
    res.status(404).json({ error: "Session not found" });
    return;
  }

  const joinCode = generateJoinCode();
  await db
    .prepare("UPDATE sessions SET status = 'in_progress', join_code = ?, started_at = ? WHERE id = ?")
    .run(joinCode, new Date().toISOString(), req.params.id);

  const updated = await db
    .prepare(SESSION_LIST_QUERY.replace("ORDER BY s.session_number", "WHERE s.id = ?"))
    .get(req.params.id);
  res.json(updated);
});

sessionsRouter.get("/:id/participants", requireAuth, async (req, res) => {
  const participants = await db
    .prepare(
      "SELECT id, display_name, class_name, section, roll_number, joined_at FROM participants WHERE session_id = ? ORDER BY joined_at"
    )
    .all(req.params.id);
  res.json(participants);
});

// Every student taking a test — psychometry or otherwise — states their own full name, class,
// section, and roll number, rather than inheriting it from the session (a walk-up psychometry
// kiosk session can serve students from several different classes in one sitting). This is also
// exactly the record the instructor later hands the Principal, so all four are mandatory here,
// not just in the UI.
sessionsRouter.post("/:id/participants", async (req, res) => {
  const { display_name, class_name, section, roll_number } = req.body as {
    display_name?: string;
    class_name?: string;
    section?: string;
    roll_number?: string;
  };

  const missing: string[] = [];
  if (!display_name || !display_name.trim()) missing.push("full name");
  if (!class_name || !class_name.trim()) missing.push("class");
  if (!section || !section.trim()) missing.push("section");
  if (!roll_number || !roll_number.trim()) missing.push("roll number");
  if (missing.length > 0) {
    res.status(400).json({ error: `Please enter your ${missing.join(", ")}.` });
    return;
  }

  const session = (await db.prepare("SELECT * FROM sessions WHERE id = ?").get(req.params.id)) as
    | { status: string }
    | undefined;
  if (!session || session.status !== "in_progress") {
    res.status(400).json({ error: "Session is not currently active" });
    return;
  }

  const deviceToken = randomUUID();
  const result = await db
    .prepare(
      "INSERT INTO participants (session_id, display_name, class_name, section, roll_number, joined_at, device_token) VALUES (?, ?, ?, ?, ?, ?, ?)"
    )
    .run(
      req.params.id,
      display_name!.trim(),
      class_name!.trim(),
      section!.trim(),
      roll_number!.trim(),
      new Date().toISOString(),
      deviceToken
    );

  res.status(201).json({
    participant_id: Number(result.lastInsertRowid),
    device_token: deviceToken,
    session_id: Number(req.params.id),
  });
});

sessionsRouter.post("/:id/complete", requireAuth, async (req, res) => {
  const session = await db.prepare("SELECT * FROM sessions WHERE id = ?").get(req.params.id);
  if (!session) {
    res.status(404).json({ error: "Session not found" });
    return;
  }

  await db
    .prepare("UPDATE sessions SET status = 'completed', completed_at = ? WHERE id = ?")
    .run(new Date().toISOString(), req.params.id);

  const updated = await db
    .prepare(SESSION_LIST_QUERY.replace("ORDER BY s.session_number", "WHERE s.id = ?"))
    .get(req.params.id);
  res.json(updated);
});
