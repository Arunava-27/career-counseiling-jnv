import { Router } from "express";
import { db } from "../db/connection.js";
import { requireAuth } from "../middleware/requireAuth.js";

export const reportsRouter = Router();
reportsRouter.use(requireAuth); // instructor-only — this is exactly the psychometric data students must never see

// Consolidated, programme-wide psychometric report (all sessions, all classes) — the
// instructor hands this to the Principal at the end of the programme.
reportsRouter.get("/psychometry", async (_req, res) => {
  const instruments = (await db
    .prepare("SELECT id, name, description FROM assessment_instruments ORDER BY id")
    .all()) as {
    id: number;
    name: string;
    description: string | null;
  }[];

  const report = await Promise.all(
    instruments.map(async (instrument) => {
      const questions = (await db
        .prepare("SELECT id, scoring_dimension FROM assessment_questions WHERE instrument_id = ?")
        .all(instrument.id)) as { id: number; scoring_dimension: string | null }[];
      const dimensionByQuestion = new Map(questions.map((q) => [q.id, q.scoring_dimension]));
      const dimensions = [...new Set(questions.map((q) => q.scoring_dimension).filter(Boolean))] as string[];

      const rows = (await db
        .prepare(
          `SELECT ar.answers_json, ar.submitted_at, p.display_name, p.class_name, p.section, p.roll_number,
                  s.date as session_date, c.name as session_class_section_name
           FROM assessment_responses ar
           JOIN participants p ON p.id = ar.participant_id
           JOIN sessions s ON s.id = ar.session_id
           LEFT JOIN class_sections c ON c.id = s.class_section_id
           WHERE ar.instrument_id = ?
           ORDER BY p.class_name, p.section, p.display_name`
        )
        .all(instrument.id)) as {
        answers_json: string;
        submitted_at: string;
        display_name: string;
        class_name: string | null;
        section: string | null;
        roll_number: string | null;
        session_date: string | null;
        session_class_section_name: string | null;
      }[];

      const participants = rows.map((row) => {
        const answers = JSON.parse(row.answers_json) as Record<string, string>;
        const dimensionTotals: Record<string, number> = {};
        for (const [questionId, value] of Object.entries(answers)) {
          const dimension = dimensionByQuestion.get(Number(questionId));
          const numeric = Number(value);
          if (dimension && !Number.isNaN(numeric)) {
            dimensionTotals[dimension] = (dimensionTotals[dimension] ?? 0) + numeric;
          }
        }
        // Prefer the student's own stated class/section (mandatory since every participant now
        // enters it themselves) — falls back to the session's class for older records taken
        // before that was captured per-student.
        const classSection =
          row.class_name || row.section
            ? [row.class_name, row.section].filter(Boolean).join(" ")
            : row.session_class_section_name;
        return {
          display_name: row.display_name,
          roll_number: row.roll_number,
          class_section_name: classSection,
          session_date: row.session_date,
          submitted_at: row.submitted_at,
          dimension_totals: dimensionTotals,
        };
      });

      return {
        instrument_id: instrument.id,
        name: instrument.name,
        description: instrument.description,
        dimensions,
        participants,
      };
    })
  );

  res.json(report);
});
