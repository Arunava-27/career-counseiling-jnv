// Interactive lab activities — self-contained HTML visuals (one per folder, touch/mouse only,
// no typing, no data stored) shown alongside a class's slide deck. Unlike decks.ts's single
// file per grade, a grade can have several labs, each with its own suggested run-time and
// facilitation notes (from the source README) for the instructor to skim before presenting.
export interface LabInfo {
  id: string;
  grade: number;
  order: number;
  title: string;
  minutes: string;
  prompt: string;
  file: string;
}

export const LABS: LabInfo[] = [
  {
    id: "mystery-career",
    grade: 7,
    order: 1,
    title: "Mystery Career",
    minutes: "5 min",
    prompt: "Who am I? Listen to the clues and call out your answer.",
    file: "/labs/class-7/01_mystery_career/index.html",
  },
  {
    id: "career-detective",
    grade: 7,
    order: 2,
    title: "Career Detective",
    minutes: "12–15 min",
    prompt: "What does this person do all day? Would you enjoy that day?",
    file: "/labs/class-7/02_career_detective/index.html",
  },
  {
    id: "career-universe",
    grade: 7,
    order: 3,
    title: "Career Universe",
    minutes: "10 min",
    prompt: "Which of these eight areas would you want to look inside?",
    file: "/labs/class-7/03_career_universe/index.html",
  },
  {
    id: "one-problem-many-careers",
    grade: 7,
    order: 4,
    title: "One Problem → Many Careers",
    minutes: "10–12 min",
    prompt: "Our school wants to reduce plastic waste by 50%. Who do we need on the team?",
    file: "/labs/class-7/04_one_problem_many_careers/index.html",
  },
  {
    id: "subjects-as-tools",
    grade: 7,
    order: 5,
    title: "Subjects Are Tools",
    minutes: "10 min",
    prompt: "Which tools does this career use?",
    file: "/labs/class-7/05_subjects_as_tools/index.html",
  },
  {
    id: "future-of-work",
    grade: 7,
    order: 6,
    title: "The Future of Work",
    minutes: "8–10 min",
    prompt: "What problems will exist when you are 25?",
    file: "/labs/class-7/06_future_of_work/index.html",
  },
  {
    id: "what-made-this",
    grade: 7,
    order: 7,
    title: "What Made This?",
    minutes: "8 min",
    prompt: "How many different careers are hidden inside one smartphone?",
    file: "/labs/class-7/07_what_made_this/index.html",
  },
  {
    id: "career-radar",
    grade: 7,
    order: 8,
    title: "My Career Radar",
    minutes: "10 min",
    prompt: "Copy these six lines into your notebook and answer them for yourself.",
    file: "/labs/class-7/08_career_radar/index.html",
  },
  {
    id: "career-decision-matrix",
    grade: 7,
    order: 9,
    title: "Career Decision Matrix",
    minutes: "8–10 min",
    prompt: "How would you investigate a career before deciding anything about it?",
    file: "/labs/class-7/09_career_decision_matrix/index.html",
  },
  {
    id: "strengths-compass",
    grade: 8,
    order: 1,
    title: "Strengths Compass",
    minutes: "10 min",
    prompt: "Which of these sound like you? Touch a strength, then try mixing two together.",
    file: "/labs/class-8/01_strengths_compass/index.html",
  },
  {
    id: "path-ahead",
    grade: 8,
    order: 2,
    title: "Path Ahead",
    minutes: "10 min",
    prompt: "Touch a path — Science, Commerce, or Arts & Humanities — to see where it can lead.",
    file: "/labs/class-8/02_path_ahead/index.html",
  },
];

export function labsForGrade(grade: number | null): LabInfo[] {
  if (grade == null) return [];
  return LABS.filter((l) => l.grade === grade).sort((a, b) => a.order - b.order);
}
