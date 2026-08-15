import { Router } from "express";
import { db } from "../db/connection.js";
import { toCsv } from "../services/csvService.js";
import { requireAuth } from "../middleware/requireAuth.js";

export const exportRouter = Router();
exportRouter.use(requireAuth); // instructor-only — exports contain full session/assessment data

function sendCsv(res: import("express").Response, filename: string, csv: string) {
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
  res.send(csv);
}

exportRouter.get("/sessions.csv", async (_req, res) => {
  const rows = (await db
    .prepare(
      `SELECT s.session_number, s.date, s.scheduled_start_time, s.scheduled_end_time, s.instructor_name,
              c.name as class_section_name, t.title as topic_title, s.status, s.attendance_count, s.notes,
              s.started_at, s.completed_at
       FROM sessions s
       LEFT JOIN curriculum_topics t ON t.id = s.topic_id
       LEFT JOIN class_sections c ON c.id = s.class_section_id
       ORDER BY s.session_number`
    )
    .all()) as Record<string, unknown>[];

  sendCsv(
    res,
    "sessions.csv",
    toCsv(rows, [
      "session_number",
      "date",
      "scheduled_start_time",
      "scheduled_end_time",
      "instructor_name",
      "class_section_name",
      "topic_title",
      "status",
      "attendance_count",
      "notes",
      "started_at",
      "completed_at",
    ])
  );
});

exportRouter.get("/poll-responses.csv", async (_req, res) => {
  const rows = (await db
    .prepare(
      `SELECT s.session_number, c.name as class_section_name, p.title as poll_title,
              pq.text as question_text, part.display_name as participant_name,
              pr.answer_json, pr.submitted_at
       FROM poll_responses pr
       JOIN poll_questions pq ON pq.id = pr.question_id
       JOIN polls p ON p.id = pq.poll_id
       JOIN sessions s ON s.id = pr.session_id
       LEFT JOIN class_sections c ON c.id = s.class_section_id
       JOIN participants part ON part.id = pr.participant_id
       ORDER BY s.session_number, p.id, pq.order_index`
    )
    .all()) as Record<string, unknown>[];

  const flattened = rows.map((r) => ({
    ...r,
    answer: JSON.parse(String(r.answer_json)),
  }));

  sendCsv(
    res,
    "poll-responses.csv",
    toCsv(flattened, [
      "session_number",
      "class_section_name",
      "poll_title",
      "question_text",
      "participant_name",
      "answer",
      "submitted_at",
    ])
  );
});

exportRouter.get("/assessment-results.csv", async (_req, res) => {
  const rows = (await db
    .prepare(
      `SELECT s.session_number, c.name as class_section_name, ai.name as instrument_name,
              part.display_name as participant_name, ar.answers_json, ar.submitted_at,
              aq.id as question_id, aq.scoring_dimension
       FROM assessment_responses ar
       JOIN assessment_instruments ai ON ai.id = ar.instrument_id
       JOIN sessions s ON s.id = ar.session_id
       LEFT JOIN class_sections c ON c.id = s.class_section_id
       JOIN participants part ON part.id = ar.participant_id
       JOIN assessment_questions aq ON aq.instrument_id = ar.instrument_id
       ORDER BY s.session_number, part.id`
    )
    .all()) as {
    session_number: number;
    class_section_name: string | null;
    instrument_name: string;
    participant_name: string;
    answers_json: string;
    submitted_at: string;
    question_id: number;
    scoring_dimension: string | null;
  }[];

  // One row per (participant, dimension) with the answered value for that question.
  const flattened = rows.map((r) => {
    const answers = JSON.parse(r.answers_json) as Record<string, string>;
    return {
      session_number: r.session_number,
      class_section_name: r.class_section_name,
      instrument_name: r.instrument_name,
      participant_name: r.participant_name,
      scoring_dimension: r.scoring_dimension,
      answer_value: answers[String(r.question_id)] ?? "",
      submitted_at: r.submitted_at,
    };
  });

  sendCsv(
    res,
    "assessment-results.csv",
    toCsv(flattened, [
      "session_number",
      "class_section_name",
      "instrument_name",
      "participant_name",
      "scoring_dimension",
      "answer_value",
      "submitted_at",
    ])
  );
});

exportRouter.get("/all.json", async (_req, res) => {
  const [
    class_sections,
    curriculum_topics,
    sessions,
    participants,
    polls,
    poll_questions,
    poll_responses,
    assessment_instruments,
    assessment_questions,
    assessment_responses,
  ] = await Promise.all([
    db.prepare("SELECT * FROM class_sections").all(),
    db.prepare("SELECT * FROM curriculum_topics").all(),
    db.prepare("SELECT * FROM sessions").all(),
    db.prepare("SELECT * FROM participants").all(),
    db.prepare("SELECT * FROM polls").all(),
    db.prepare("SELECT * FROM poll_questions").all(),
    db.prepare("SELECT * FROM poll_responses").all(),
    db.prepare("SELECT * FROM assessment_instruments").all(),
    db.prepare("SELECT * FROM assessment_questions").all(),
    db.prepare("SELECT * FROM assessment_responses").all(),
  ]);

  const dump = {
    class_sections,
    curriculum_topics,
    sessions,
    participants,
    polls,
    poll_questions,
    poll_responses,
    assessment_instruments,
    assessment_questions,
    assessment_responses,
    exported_at: new Date().toISOString(),
  };

  res.setHeader("Content-Type", "application/json");
  res.setHeader("Content-Disposition", 'attachment; filename="career-counseling-export.json"');
  res.json(dump);
});
