import { db } from "./connection.js";
import { TOPIC_QUESTION_BANK } from "./topicQuestionBank.js";
import { TOPIC_SCRIPTS } from "./topicScripts.js";

// Based on the reference JNV Birbhum programme's topic sequence.
const CURRICULUM_TOPICS = [
  "Introduction to Career Counselling & Future of Careers",
  "Traditional vs. Modern Career Paths",
  "Emerging Career Trends",
  "Artificial Intelligence (AI) & Automation",
  "Career Opportunities Across Industries",
  "Skills for Future Careers",
  "Knowing Yourself",
  "Interests & Personality Assessment",
  "Strengths, Weaknesses & Learning Styles",
  "Career Interest Assessment (Psychometric Test)",
  "Understanding Psychometric Results",
  "Decision Making & Goal Identification",
  "Matching Interests with Career Choices",
  "Communication Skills - The Basics",
  "Public Speaking & Confidence Building",
  "Group Discussion & Teamwork",
  "Presentation Skills & Professional Behaviour",
  "Competitive English - Vocabulary Development",
  "Competitive English - Grammar & Comprehension",
  "Quantitative Aptitude Fundamentals",
  "Speed Mathematics & Calculation Tricks",
  "Logical Reasoning & Analytical Thinking",
  "Problem Solving & Data Interpretation",
  "Entrepreneurship & Freelancing",
  "Career Planning & Personal Roadmap",
];

interface AssessmentQuestionSeed {
  text: string;
  scoring_dimension: string;
}

interface AssessmentInstrumentSeed {
  name: string;
  type: string;
  description: string;
  questions: AssessmentQuestionSeed[];
}

const ASSESSMENT_INSTRUMENTS: AssessmentInstrumentSeed[] = [
  {
    name: "Career Interest Assessment (Psychometric Test)",
    type: "psychometric",
    description:
      "A RIASEC-style interest inventory (rate each statement 1-5). Results are for instructor interpretation only and are never shown to students directly.",
    questions: [
      { text: "I enjoy building, fixing, or working with tools and machines.", scoring_dimension: "Realistic" },
      { text: "I would rather work with my hands on a practical task than sit through long theory lessons.", scoring_dimension: "Realistic" },
      { text: "I like investigating how things work or solving scientific problems.", scoring_dimension: "Investigative" },
      { text: "I enjoy researching topics deeply and asking 'why' or 'how' questions.", scoring_dimension: "Investigative" },
      { text: "I enjoy creative activities like art, music, writing, or design.", scoring_dimension: "Artistic" },
      { text: "I like expressing my ideas in original or imaginative ways.", scoring_dimension: "Artistic" },
      { text: "I like helping, teaching, or working closely with other people.", scoring_dimension: "Social" },
      { text: "I feel motivated when I can support or guide someone else.", scoring_dimension: "Social" },
      { text: "I enjoy leading, persuading, or starting new projects/businesses.", scoring_dimension: "Enterprising" },
      { text: "I like taking initiative and convincing others to support my ideas.", scoring_dimension: "Enterprising" },
      { text: "I prefer organized, detail-oriented tasks like planning or record-keeping.", scoring_dimension: "Conventional" },
      { text: "I feel comfortable following clear rules, structures, and procedures.", scoring_dimension: "Conventional" },
    ],
  },
  {
    name: "Learning Style Assessment (VARK)",
    type: "psychometric",
    description:
      "A short inventory (rate each statement 1-5) identifying how you learn best — Visual, Auditory, Reading/Writing, or Kinesthetic. Results are for instructor interpretation only and are never shown to students directly.",
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

export async function seed() {
  // Class sections are NOT seeded — which classes/sections exist varies by school and often
  // isn't known until the instructor arrives, so they're added on the fly from the Dashboard.

  const topicCount = (await db.prepare("SELECT COUNT(*) as count FROM curriculum_topics").get()) as {
    count: number;
  };
  if (topicCount.count === 0) {
    const insertTopic = db.prepare(
      "INSERT INTO curriculum_topics (order_index, title, description, content_markdown) VALUES (?, ?, ?, ?)"
    );
    for (const [index, title] of CURRICULUM_TOPICS.entries()) {
      const script = TOPIC_SCRIPTS[title];
      await insertTopic.run(index + 1, title, null, script ?? `# ${title}\n\n_Content to be added._`);
    }
  }

  const instrumentCount = (await db.prepare("SELECT COUNT(*) as count FROM assessment_instruments").get()) as {
    count: number;
  };
  if (instrumentCount.count === 0) {
    const insertInstrument = db.prepare("INSERT INTO assessment_instruments (name, type, description) VALUES (?, ?, ?)");
    const insertQuestion = db.prepare(
      "INSERT INTO assessment_questions (instrument_id, order_index, text, options_json, scoring_dimension) VALUES (?, ?, ?, ?, ?)"
    );

    for (const { name, type, description, questions } of ASSESSMENT_INSTRUMENTS) {
      const instrumentResult = await insertInstrument.run(name, type, description);
      for (const [index, q] of questions.entries()) {
        await insertQuestion.run(
          instrumentResult.lastInsertRowid!,
          index + 1,
          q.text,
          JSON.stringify(["1", "2", "3", "4", "5"]),
          q.scoring_dimension
        );
      }
    }
  }

  // Reusable per-topic poll/quiz templates — instructors load these into a live session
  // with one click instead of authoring questions in front of students each day.
  const templatePollCount = (await db
    .prepare("SELECT COUNT(*) as count FROM polls WHERE topic_id IS NOT NULL")
    .get()) as { count: number };
  if (templatePollCount.count === 0) {
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
        const pollResult = await insertPoll.run(topic.id, bankPoll.title, bankPoll.type);
        for (const [index, q] of bankPoll.questions.entries()) {
          await insertQuestion.run(
            pollResult.lastInsertRowid!,
            index + 1,
            q.text,
            "single",
            JSON.stringify(q.options),
            q.correct_answer ?? null
          );
        }
      }
    }
  }
}
