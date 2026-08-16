export const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS class_sections (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS curriculum_topics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_index INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  content_markdown TEXT,
  -- Recommended class range this topic suits, e.g. 9-12. Nullable: unset means "not yet tagged".
  min_class_level INTEGER,
  max_class_level INTEGER
);

CREATE TABLE IF NOT EXISTS sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_number INTEGER NOT NULL,
  date TEXT,
  scheduled_start_time TEXT,
  scheduled_end_time TEXT,
  topic_id INTEGER REFERENCES curriculum_topics(id),
  class_section_id INTEGER REFERENCES class_sections(id),
  instructor_name TEXT,
  status TEXT NOT NULL DEFAULT 'scheduled',
  join_code TEXT,
  started_at TEXT,
  completed_at TEXT,
  notes TEXT,
  active_assessment_id INTEGER REFERENCES assessment_instruments(id),
  attendance_count INTEGER
);

CREATE TABLE IF NOT EXISTS participants (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id INTEGER NOT NULL REFERENCES sessions(id),
  display_name TEXT NOT NULL,
  -- Captured per-student, not inherited from the session's own class_section_id — a
  -- psychometry-only walk-up kiosk session can serve students from several different
  -- classes/sections in one sitting, so each student states their own.
  class_name TEXT,
  section TEXT,
  roll_number TEXT,
  joined_at TEXT NOT NULL,
  device_token TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS polls (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id INTEGER REFERENCES sessions(id),
  topic_id INTEGER REFERENCES curriculum_topics(id),
  title TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'poll',
  status TEXT NOT NULL DEFAULT 'draft'
);

CREATE TABLE IF NOT EXISTS poll_questions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  poll_id INTEGER NOT NULL REFERENCES polls(id),
  order_index INTEGER NOT NULL,
  text TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'single',
  options_json TEXT,
  correct_answer TEXT
);

CREATE TABLE IF NOT EXISTS poll_responses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  question_id INTEGER NOT NULL REFERENCES poll_questions(id),
  session_id INTEGER NOT NULL REFERENCES sessions(id),
  participant_id INTEGER NOT NULL REFERENCES participants(id),
  answer_json TEXT NOT NULL,
  submitted_at TEXT NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_poll_responses_question_participant
  ON poll_responses(question_id, participant_id);

-- Instructor-recorded show-of-hands counts, used when students have no individual devices.
CREATE TABLE IF NOT EXISTS poll_option_tallies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  question_id INTEGER NOT NULL REFERENCES poll_questions(id),
  option_text TEXT NOT NULL,
  count INTEGER NOT NULL DEFAULT 0
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_poll_option_tallies_question_option
  ON poll_option_tallies(question_id, option_text);

CREATE TABLE IF NOT EXISTS assessment_instruments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  description TEXT,
  -- Recommended class range this instrument suits, e.g. 9-12. Different age groups need
  -- genuinely different instruments (wording, length, concept difficulty) rather than one
  -- assessment used everywhere. Nullable: unset means "not yet tagged".
  min_class_level INTEGER,
  max_class_level INTEGER,
  -- Soft, non-clinical title shown to the student taking the test (e.g. "Discover Your
  -- Interests"), distinct from the name column which is the clear/technical label instructors
  -- see on the console ("Career Interest Assessment (Psychometric Test)"). Nullable: falls
  -- back to name if unset.
  student_label TEXT
);

CREATE TABLE IF NOT EXISTS assessment_questions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  instrument_id INTEGER NOT NULL REFERENCES assessment_instruments(id),
  order_index INTEGER NOT NULL,
  text TEXT NOT NULL,
  options_json TEXT,
  scoring_dimension TEXT
);

CREATE TABLE IF NOT EXISTS assessment_responses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  instrument_id INTEGER NOT NULL REFERENCES assessment_instruments(id),
  session_id INTEGER NOT NULL REFERENCES sessions(id),
  participant_id INTEGER NOT NULL REFERENCES participants(id),
  answers_json TEXT NOT NULL,
  computed_scores_json TEXT,
  submitted_at TEXT NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_assessment_responses_instrument_participant
  ON assessment_responses(instrument_id, participant_id);
`;
