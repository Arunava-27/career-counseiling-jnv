import { db } from "./connection.js";
import { TOPIC_QUESTION_BANK } from "./topicQuestionBank.js";
import { TOPIC_SCRIPTS } from "./topicScripts.js";
import { TOPIC_ACTIVITIES } from "./topicActivities.js";

interface CurriculumTopicSeed {
  title: string;
  minClass: number;
  maxClass: number;
}

// Our own curriculum (no longer based on the reference programme PDF) — 24 topics across three
// bands, each band with content genuinely written for that age group rather than one topic
// serving Class 6-12 at once:
//  - Middle School (VI-VIII): light, exploratory, no exam-prep tone.
//  - Secondary (IX-X): self-awareness + stream-choice groundwork.
//  - Senior Secondary (XI-XII): decision-making, exam prep, and planning.
//
// Note: taking the psychometric test itself is NOT a curriculum topic/session-tracker slot —
// it's an independent assessment instrument (see ASSESSMENT_INSTRUMENTS below), launchable
// from the Psychometry Test panel on any session regardless of that session's topic. Only
// debriefing/interpreting the results afterward ("Understanding Your Results") is a normal
// discussion-based topic.
const CURRICULUM_TOPICS: CurriculumTopicSeed[] = [
  // Middle School (VI-VIII)
  { title: "Discovering My Interests", minClass: 6, maxClass: 8 },
  { title: "The World of Work", minClass: 6, maxClass: 8 },
  { title: "Everyone Has a Talent", minClass: 6, maxClass: 8 },
  { title: "Speaking Up with Confidence", minClass: 6, maxClass: 8 },
  { title: "Working Together", minClass: 6, maxClass: 8 },

  // Secondary (IX-X)
  { title: "Knowing Yourself", minClass: 9, maxClass: 10 },
  { title: "Understanding Your Results", minClass: 9, maxClass: 10 },
  { title: "Career Opportunities Across Industries", minClass: 9, maxClass: 10 },
  { title: "Choosing a Stream", minClass: 9, maxClass: 10 },
  { title: "Communication Skills - The Basics", minClass: 9, maxClass: 10 },
  { title: "Public Speaking & Confidence Building", minClass: 9, maxClass: 10 },
  { title: "Group Discussion & Teamwork", minClass: 9, maxClass: 10 },
  { title: "Emerging Career Trends", minClass: 9, maxClass: 10 },
  { title: "Artificial Intelligence (AI) & Automation", minClass: 9, maxClass: 10 },

  // Senior Secondary (XI-XII)
  { title: "Matching Interests with Career Choices", minClass: 11, maxClass: 12 },
  { title: "Decision Making & Goal Identification", minClass: 11, maxClass: 12 },
  { title: "Presentation Skills & Professional Behaviour", minClass: 11, maxClass: 12 },
  { title: "Competitive English - Vocabulary Development", minClass: 11, maxClass: 12 },
  { title: "Competitive English - Grammar & Comprehension", minClass: 11, maxClass: 12 },
  { title: "Quantitative Aptitude Fundamentals", minClass: 11, maxClass: 12 },
  { title: "Logical Reasoning & Analytical Thinking", minClass: 11, maxClass: 12 },
  { title: "Problem Solving & Data Interpretation", minClass: 11, maxClass: 12 },
  { title: "Entrepreneurship & Freelancing", minClass: 11, maxClass: 12 },
  { title: "Career Planning & Personal Roadmap", minClass: 11, maxClass: 12 },
];

// Old title -> new title, for topics that were kept but renamed rather than dropped. Migrated
// via UPDATE (not delete+reinsert) so the row's id — and any session that already references
// it — is preserved.
const RENAMED_TOPICS: Record<string, string> = {
  "Understanding Psychometric Results": "Understanding Your Results",
};

// Topics dropped entirely from the curriculum (not just renamed) — either thin content that
// didn't earn its own 90-minute slot, or superseded by the new Middle School band.
const RETIRED_TOPICS = [
  "Introduction to Career Counselling & Future of Careers",
  "Traditional vs. Modern Career Paths",
  "Skills for Future Careers",
  "Interests & Personality Assessment",
  "Strengths, Weaknesses & Learning Styles",
  "Speed Mathematics & Calculation Tricks",
];

interface AssessmentQuestionSeed {
  text: string;
  scoring_dimension: string;
}

interface AssessmentInstrumentSeed {
  name: string;
  type: string;
  description: string;
  // Soft, non-clinical title the student sees at the kiosk — instructors always see `name`
  // (the clear/technical label), students only ever see this one.
  studentLabel: string;
  // Recommended class range. Psychometric instruments genuinely need different wording,
  // length, and concept difficulty per age group — this is NOT the same tagging-only approach
  // used for curriculum topics; each band below gets an actually distinct instrument.
  minClass: number;
  maxClass: number;
  // Rating scale size for every question in this instrument — 5-point for the standard
  // RIASEC/VARK instruments, a simpler 3-point scale for the Middle School one below.
  scalePoints: number;
  questions: AssessmentQuestionSeed[];
}

const ASSESSMENT_INSTRUMENTS: AssessmentInstrumentSeed[] = [
  {
    name: "Interests & Activities Explorer (Middle School)",
    type: "psychometric",
    description:
      "A simple, age-appropriate interests explorer for younger students. Rate each statement 1-3 (1 = Not really, 2 = A little, 3 = Yes, a lot!). Results are for instructor interpretation only and are never shown to students directly.",
    studentLabel: "What Do You Enjoy?",
    minClass: 6,
    maxClass: 8,
    scalePoints: 3,
    questions: [
      { text: "I like making or fixing things with my hands — crafts, gadgets, bikes, and so on.", scoring_dimension: "Realistic" },
      { text: "I'd rather be doing something active or outdoors than sitting and reading.", scoring_dimension: "Realistic" },
      { text: "I like playing sports or being physically active.", scoring_dimension: "Realistic" },
      { text: "I enjoy taking things apart to see how they work.", scoring_dimension: "Realistic" },
      { text: "I like working with animals or plants, like gardening or having pets.", scoring_dimension: "Realistic" },
      { text: "I like figuring out how and why things work.", scoring_dimension: "Investigative" },
      { text: "I enjoy asking a lot of 'why' questions and finding the answers.", scoring_dimension: "Investigative" },
      { text: "I enjoy science experiments or solving tricky puzzles.", scoring_dimension: "Investigative" },
      { text: "I like learning interesting facts about space, nature, or how things are made.", scoring_dimension: "Investigative" },
      { text: "I enjoy games or activities that make me think hard.", scoring_dimension: "Investigative" },
      { text: "I like drawing, singing, dancing, or making up stories.", scoring_dimension: "Artistic" },
      { text: "I enjoy coming up with new and different ideas.", scoring_dimension: "Artistic" },
      { text: "I like decorating things or making them look nice.", scoring_dimension: "Artistic" },
      { text: "I enjoy acting, performing, or making up games with my friends.", scoring_dimension: "Artistic" },
      { text: "I like it when I get to choose how to do a project, instead of following one set way.", scoring_dimension: "Artistic" },
      { text: "I like helping my friends or younger kids with something they find hard.", scoring_dimension: "Social" },
      { text: "I feel good when I help someone else feel better.", scoring_dimension: "Social" },
      { text: "I enjoy working in a group more than working alone.", scoring_dimension: "Social" },
      { text: "I like listening to my friends when they have a problem.", scoring_dimension: "Social" },
      { text: "I would enjoy a job where I get to take care of or teach other people.", scoring_dimension: "Social" },
      { text: "I like being the one who organizes a game or a group activity.", scoring_dimension: "Enterprising" },
      { text: "I enjoy convincing my friends to try my idea.", scoring_dimension: "Enterprising" },
      { text: "I like being in charge of a group project.", scoring_dimension: "Enterprising" },
      { text: "I enjoy selling things, like at a school fair or fundraiser.", scoring_dimension: "Enterprising" },
      { text: "I like competing in games or contests to win.", scoring_dimension: "Enterprising" },
      { text: "I like keeping my things neatly organized.", scoring_dimension: "Conventional" },
      { text: "I enjoy following clear steps to finish a task.", scoring_dimension: "Conventional" },
      { text: "I like making lists or schedules.", scoring_dimension: "Conventional" },
      { text: "I feel comfortable when I know exactly what the rules are.", scoring_dimension: "Conventional" },
      { text: "I enjoy counting, sorting, or organizing things, like a coin collection or a bookshelf.", scoring_dimension: "Conventional" },
    ],
  },
  {
    name: "Career Interest Assessment (Psychometric Test)",
    type: "psychometric",
    description:
      "A RIASEC-style interest inventory (rate each statement 1-5). Results are for instructor interpretation only and are never shown to students directly.",
    studentLabel: "Discover Your Interests",
    minClass: 9,
    maxClass: 12,
    scalePoints: 5,
    questions: [
      { text: "I enjoy building, fixing, or working with tools and machines.", scoring_dimension: "Realistic" },
      { text: "I would rather work with my hands on a practical task than sit through long theory lessons.", scoring_dimension: "Realistic" },
      { text: "I like working with plants, animals, or the outdoors.", scoring_dimension: "Realistic" },
      { text: "I enjoy activities like carpentry, electronics, mechanics, or sports.", scoring_dimension: "Realistic" },
      { text: "I would rather assemble or repair something myself than call someone else to do it.", scoring_dimension: "Realistic" },
      { text: "I like investigating how things work or solving scientific problems.", scoring_dimension: "Investigative" },
      { text: "I enjoy researching topics deeply and asking 'why' or 'how' questions.", scoring_dimension: "Investigative" },
      { text: "I enjoy analyzing data, numbers, or patterns to find an answer.", scoring_dimension: "Investigative" },
      { text: "I like reading about scientific discoveries or new research.", scoring_dimension: "Investigative" },
      { text: "I would enjoy a career that involves experiments, testing, or solving complex problems.", scoring_dimension: "Investigative" },
      { text: "I enjoy creative activities like art, music, writing, or design.", scoring_dimension: "Artistic" },
      { text: "I like expressing my ideas in original or imaginative ways.", scoring_dimension: "Artistic" },
      { text: "I enjoy activities that let me use my imagination freely, without strict rules.", scoring_dimension: "Artistic" },
      { text: "I like creating things — whether it's writing, photography, design, or performance.", scoring_dimension: "Artistic" },
      { text: "I would enjoy a career where I get to express myself creatively every day.", scoring_dimension: "Artistic" },
      { text: "I like helping, teaching, or working closely with other people.", scoring_dimension: "Social" },
      { text: "I feel motivated when I can support or guide someone else.", scoring_dimension: "Social" },
      { text: "I enjoy volunteering or community service activities.", scoring_dimension: "Social" },
      { text: "I like listening to people's problems and helping them find solutions.", scoring_dimension: "Social" },
      { text: "I would enjoy a career centered around caring for or educating others.", scoring_dimension: "Social" },
      { text: "I enjoy leading, persuading, or starting new projects/businesses.", scoring_dimension: "Enterprising" },
      { text: "I like taking initiative and convincing others to support my ideas.", scoring_dimension: "Enterprising" },
      { text: "I enjoy competing to achieve goals or targets.", scoring_dimension: "Enterprising" },
      { text: "I like negotiating, selling, or promoting an idea or product.", scoring_dimension: "Enterprising" },
      { text: "I would enjoy a career where I get to make decisions and take charge.", scoring_dimension: "Enterprising" },
      { text: "I prefer organized, detail-oriented tasks like planning or record-keeping.", scoring_dimension: "Conventional" },
      { text: "I feel comfortable following clear rules, structures, and procedures.", scoring_dimension: "Conventional" },
      { text: "I like working with numbers, spreadsheets, or organized data.", scoring_dimension: "Conventional" },
      { text: "I prefer a predictable routine over one that keeps changing.", scoring_dimension: "Conventional" },
      { text: "I would enjoy a career involving accounting, administration, or systematic record-keeping.", scoring_dimension: "Conventional" },
    ],
  },
  {
    name: "Learning Style Assessment (VARK)",
    type: "psychometric",
    description:
      "A short inventory (rate each statement 1-5) identifying how you learn best — Visual, Auditory, Reading/Writing, or Kinesthetic. Results are for instructor interpretation only and are never shown to students directly.",
    studentLabel: "How Do You Learn Best?",
    minClass: 9,
    maxClass: 12,
    scalePoints: 5,
    questions: [
      { text: "I understand information better when I see diagrams, charts, or pictures.", scoring_dimension: "Visual" },
      { text: "I remember things more easily when I write them down or see them written.", scoring_dimension: "Visual" },
      { text: "I learn well by listening to explanations, discussions, or lectures.", scoring_dimension: "Auditory" },
      { text: "I remember information better after talking it through out loud.", scoring_dimension: "Auditory" },
      { text: "I prefer reading textbooks or written notes to understand a topic.", scoring_dimension: "Reading/Writing" },
      { text: "I like to take detailed written notes when learning something new.", scoring_dimension: "Reading/Writing" },
      { text: "I learn best by doing hands-on activities or practical exercises.", scoring_dimension: "Kinesthetic" },
      { text: "I find it easier to understand something by physically trying it out.", scoring_dimension: "Kinesthetic" },
    ],
  },
];

// Cleanly retires a curriculum topic that's no longer part of CURRICULUM_TOPICS (e.g. the
// psychometric test, decoupled into its own independent assessment flow — see
// ASSESSMENT_INSTRUMENTS above). Safe to run on every boot:
//  - Unlinks (doesn't delete) any session that referenced this topic, preserving that session's
//    actual data.
//  - Deletes only the topic's reusable poll/quiz TEMPLATES (topic_id set, session_id NULL) —
//    never a session-instance poll copy, which never carries topic_id (see polls.ts) and may
//    hold real recorded student responses.
//  - No-ops once the topic is already gone.
async function retireCurriculumTopic(title: string) {
  const topic = (await db.prepare("SELECT id FROM curriculum_topics WHERE title = ?").get(title)) as
    | { id: number }
    | undefined;
  if (!topic) return;

  await db.prepare("UPDATE sessions SET topic_id = NULL WHERE topic_id = ?").run(topic.id);

  const templatePolls = (await db.prepare("SELECT id FROM polls WHERE topic_id = ?").all(topic.id)) as {
    id: number;
  }[];
  for (const poll of templatePolls) {
    await db.prepare("DELETE FROM poll_option_tallies WHERE question_id IN (SELECT id FROM poll_questions WHERE poll_id = ?)").run(poll.id);
    await db.prepare("DELETE FROM poll_questions WHERE poll_id = ?").run(poll.id);
    await db.prepare("DELETE FROM polls WHERE id = ?").run(poll.id);
  }

  await db.prepare("DELETE FROM curriculum_topics WHERE id = ?").run(topic.id);
}

// Renames a topic in place (UPDATE, not delete+reinsert) so its id — and any session that
// already references it — survives. No-ops if the old title is already gone (already renamed,
// or never existed on this database) or the new title already exists (already migrated).
async function renameCurriculumTopic(oldTitle: string, newTitle: string) {
  const old = (await db.prepare("SELECT id FROM curriculum_topics WHERE title = ?").get(oldTitle)) as
    | { id: number }
    | undefined;
  if (!old) return;

  await db.prepare("UPDATE curriculum_topics SET title = ? WHERE id = ?").run(newTitle, old.id);
}

export async function seed() {
  // Class sections are NOT seeded — which classes/sections exist varies by school and often
  // isn't known until the instructor arrives, so they're added on the fly from the Dashboard.

  await retireCurriculumTopic("Career Interest Assessment (Psychometric Test)");
  for (const title of RETIRED_TOPICS) {
    await retireCurriculumTopic(title);
  }
  for (const [oldTitle, newTitle] of Object.entries(RENAMED_TOPICS)) {
    await renameCurriculumTopic(oldTitle, newTitle);
  }

  // Upsert by title, not "seed once": CURRICULUM_TOPICS is the authoritative source for class
  // ranges and ordering, and both actively change over time (as they just did — the whole
  // curriculum was reorganized into three bands). A plain "backfill only if NULL" would leave
  // already-provisioned databases (the deployed Turso database included) stuck with stale
  // ranges/order from a previous version of this list, and would never insert a brand-new topic
  // since the old "only seed when the table is empty" gate would skip it entirely.
  const insertTopic = db.prepare(
    "INSERT INTO curriculum_topics (order_index, title, description, content_markdown, min_class_level, max_class_level) VALUES (?, ?, ?, ?, ?, ?)"
  );
  const resyncTopic = db.prepare(
    "UPDATE curriculum_topics SET order_index = ?, min_class_level = ?, max_class_level = ? WHERE title = ?"
  );
  const appendActivity = db.prepare("UPDATE curriculum_topics SET content_markdown = ? WHERE id = ?");

  for (const [index, { title, minClass, maxClass }] of CURRICULUM_TOPICS.entries()) {
    const script = TOPIC_SCRIPTS[title] ?? `# ${title}\n\n_Content to be added._`;
    const activity = TOPIC_ACTIVITIES[title];
    const content = activity ? `${script}\n\n${activity}` : script;

    const existing = (await db.prepare("SELECT id, content_markdown FROM curriculum_topics WHERE title = ?").get(title)) as
      | { id: number; content_markdown: string | null }
      | undefined;

    if (!existing) {
      await insertTopic.run(index + 1, title, null, content, minClass, maxClass);
      continue;
    }

    // Keeps the session-tracker sequence gap-free and ranges current — only touches topics
    // still in CURRICULUM_TOPICS, so any custom topic an instructor added themselves is
    // untouched.
    await resyncTopic.run(index + 1, minClass, maxClass, title);

    // Self-heal: a topic can end up with the placeholder body if it was first inserted before
    // its real script existed in TOPIC_SCRIPTS yet (e.g. mid-edit across a restart). Narrowly
    // scoped to that exact placeholder marker so it never overwrites genuine hand-edited
    // content_markdown (editable via PUT /curriculum/:id, even though no UI does that today).
    if (
      (existing.content_markdown ?? "").includes("_Content to be added._") &&
      TOPIC_SCRIPTS[title]
    ) {
      await appendActivity.run(content, existing.id);
      continue;
    }

    if (activity && !(existing.content_markdown ?? "").includes("## Alternate Activity")) {
      await appendActivity.run(`${existing.content_markdown ?? ""}\n\n${activity}`, existing.id);
    }
  }

  // Upsert by name, not "seed once": different class levels need genuinely different
  // instruments (not just tagging), so this needs to add the Middle School instrument to
  // databases that already ran an earlier version of this seed with only the two 9-12 ones —
  // the deployed Turso database included.
  const insertInstrument = db.prepare(
    "INSERT INTO assessment_instruments (name, type, description, min_class_level, max_class_level, student_label) VALUES (?, ?, ?, ?, ?, ?)"
  );
  const backfillInstrumentRange = db.prepare(
    "UPDATE assessment_instruments SET min_class_level = ?, max_class_level = ? WHERE name = ? AND min_class_level IS NULL"
  );
  const backfillStudentLabel = db.prepare(
    "UPDATE assessment_instruments SET student_label = ? WHERE name = ? AND student_label IS NULL"
  );
  const insertAssessmentQuestion = db.prepare(
    "INSERT INTO assessment_questions (instrument_id, order_index, text, options_json, scoring_dimension) VALUES (?, ?, ?, ?, ?)"
  );

  for (const { name, type, description, studentLabel, minClass, maxClass, scalePoints, questions } of ASSESSMENT_INSTRUMENTS) {
    const existingInstrument = (await db.prepare("SELECT id FROM assessment_instruments WHERE name = ?").get(name)) as
      | { id: number }
      | undefined;

    let instrumentId: number;
    if (existingInstrument) {
      instrumentId = existingInstrument.id;
      await backfillInstrumentRange.run(minClass, maxClass, name);
      await backfillStudentLabel.run(studentLabel, name);
    } else {
      const result = await insertInstrument.run(name, type, description, minClass, maxClass, studentLabel);
      instrumentId = Number(result.lastInsertRowid!);
    }

    const existingQuestions = (await db
      .prepare("SELECT text, order_index FROM assessment_questions WHERE instrument_id = ?")
      .all(instrumentId)) as { text: string; order_index: number }[];
    const existingTexts = new Set(existingQuestions.map((q) => q.text));
    let nextOrder = existingQuestions.reduce((max, q) => Math.max(max, q.order_index), 0);

    const scaleOptions = JSON.stringify(Array.from({ length: scalePoints }, (_, i) => String(i + 1)));
    for (const q of questions) {
      if (existingTexts.has(q.text)) continue; // already seeded in a previous run
      nextOrder += 1;
      await insertAssessmentQuestion.run(instrumentId, nextOrder, q.text, scaleOptions, q.scoring_dimension);
    }
  }

  // Reusable per-topic poll/quiz templates — instructors load these into a live session
  // with one click instead of authoring questions in front of students each day.
  //
  // Upsert, not "seed once": TOPIC_QUESTION_BANK grows over time (more questions added to an
  // existing topic's bank), and this needs to backfill those additions into databases that
  // already ran an earlier version of this seed — the deployed Turso database included, which
  // only re-runs this function on each server restart, never a fresh install.
  const insertPoll = db.prepare("INSERT INTO polls (topic_id, title, type, status) VALUES (?, ?, ?, 'template')");
  const insertQuestion = db.prepare(
    "INSERT INTO poll_questions (poll_id, order_index, text, type, options_json, correct_answer) VALUES (?, ?, ?, ?, ?, ?)"
  );

  for (const entry of TOPIC_QUESTION_BANK) {
    const topic = (await db.prepare("SELECT id FROM curriculum_topics WHERE title = ?").get(entry.topicTitle)) as
      | { id: number }
      | undefined;
    if (!topic) continue;

    for (const bankPoll of [entry.discussionPoll, entry.quizPoll]) {
      const existingPoll = (await db
        .prepare("SELECT id FROM polls WHERE topic_id = ? AND title = ? AND session_id IS NULL")
        .get(topic.id, bankPoll.title)) as { id: number } | undefined;

      let pollId: number;
      if (existingPoll) {
        pollId = existingPoll.id;
      } else {
        const pollResult = await insertPoll.run(topic.id, bankPoll.title, bankPoll.type);
        pollId = Number(pollResult.lastInsertRowid!);
      }

      const existingQuestions = (await db
        .prepare("SELECT text, order_index FROM poll_questions WHERE poll_id = ?")
        .all(pollId)) as { text: string; order_index: number }[];
      const existingTexts = new Set(existingQuestions.map((q) => q.text));
      let nextOrder = existingQuestions.reduce((max, q) => Math.max(max, q.order_index), 0);

      for (const q of bankPoll.questions) {
        if (existingTexts.has(q.text)) continue; // already seeded in a previous run
        nextOrder += 1;
        await insertQuestion.run(pollId, nextOrder, q.text, "single", JSON.stringify(q.options), q.correct_answer ?? null);
      }
    }
  }
}
