import { Router } from "express";
import { db } from "../db/connection.js";
import { getPollWithQuestions } from "./polls.js";
import { requireAuth } from "../middleware/requireAuth.js";

export const curriculumRouter = Router();
curriculumRouter.use(requireAuth); // instructor-only — no student-facing route needs curriculum data

curriculumRouter.get("/", async (_req, res) => {
  const topics = await db.prepare("SELECT * FROM curriculum_topics ORDER BY order_index").all();
  res.json(topics);
});

curriculumRouter.get("/class-sections", async (_req, res) => {
  const sections = await db.prepare("SELECT * FROM class_sections ORDER BY id").all();
  res.json(sections);
});

// Classes/sections vary by school and are usually only known once the instructor is on-site,
// so they're added here on the fly rather than seeded.
curriculumRouter.post("/class-sections", async (req, res) => {
  const { name } = req.body as { name?: string };
  if (!name || !name.trim()) {
    res.status(400).json({ error: "name is required" });
    return;
  }

  try {
    const result = await db.prepare("INSERT INTO class_sections (name) VALUES (?)").run(name.trim());
    res.status(201).json({ id: Number(result.lastInsertRowid), name: name.trim() });
  } catch {
    res.status(409).json({ error: "A class section with that name already exists" });
  }
});

// Unlink (never delete) any session using this class section first — deleting the class
// shouldn't delete the sessions/records that reference it, just detach the label from them.
curriculumRouter.delete("/class-sections/:id", async (req, res) => {
  await db.prepare("UPDATE sessions SET class_section_id = NULL WHERE class_section_id = ?").run(req.params.id);
  await db.prepare("DELETE FROM class_sections WHERE id = ?").run(req.params.id);
  res.status(204).end();
});

// Reusable poll/quiz templates for a topic (session_id IS NULL, topic_id set) —
// instructor-only, never exposed to students, so including correct_answer is fine.
curriculumRouter.get("/:id/poll-templates", async (req, res) => {
  const templates = (await db
    .prepare("SELECT id FROM polls WHERE topic_id = ? AND session_id IS NULL ORDER BY id")
    .all(req.params.id)) as { id: number }[];
  const withQuestions = await Promise.all(templates.map((t) => getPollWithQuestions(t.id)));
  res.json(withQuestions);
});

curriculumRouter.put("/:id", async (req, res) => {
  const { title, description, content_markdown } = req.body as {
    title?: string;
    description?: string;
    content_markdown?: string;
  };

  const existing = await db.prepare("SELECT * FROM curriculum_topics WHERE id = ?").get(req.params.id);
  if (!existing) {
    res.status(404).json({ error: "Topic not found" });
    return;
  }

  await db
    .prepare(
      "UPDATE curriculum_topics SET title = COALESCE(?, title), description = COALESCE(?, description), content_markdown = COALESCE(?, content_markdown) WHERE id = ?"
    )
    .run(title ?? null, description ?? null, content_markdown ?? null, req.params.id);

  const updated = await db.prepare("SELECT * FROM curriculum_topics WHERE id = ?").get(req.params.id);
  res.json(updated);
});
