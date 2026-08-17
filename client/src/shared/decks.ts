// The 25-topic curriculum + facilitator scripts have been retired for now in favor of these
// exported slide decks — one per class, self-contained HTML files served as static assets from
// client/public/decks/. Which deck a session shows is derived from its class's grade (6-12),
// not stored on the session itself, so there's nothing to keep in sync if a deck is replaced.
export interface DeckInfo {
  grade: number;
  title: string;
  file: string;
}

export const DECKS: DeckInfo[] = [6, 7, 8, 9, 10, 11, 12].map((grade) => ({
  grade,
  title: `Career Counselling — Class ${grade}`,
  file: `/decks/class-${grade}.html`,
}));

export function deckForGrade(grade: number | null): DeckInfo | null {
  if (grade == null) return null;
  return DECKS.find((d) => d.grade === grade) ?? null;
}
