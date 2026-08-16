// Shared helpers for organizing curriculum topics and psychometric instruments by class
// level (1-12). Used by the Dashboard's topic/session-creation picker and by AssessmentManager
// to show only the psychometric instruments appropriate for a session's class.

export interface ClassRanged {
  min_class_level: number | null;
  max_class_level: number | null;
}

// Roman numerals for classes 1-12, matching how this app's class sections are usually named
// (e.g. "IX A", "XI Science", "XII Commerce") rather than plain digits.
const ROMAN_NUMERALS = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];

export function toRoman(n: number): string {
  return ROMAN_NUMERALS[n] ?? String(n);
}

export function classRangeLabel(item: ClassRanged): string | null {
  if (item.min_class_level == null || item.max_class_level == null) return null;
  return item.min_class_level === item.max_class_level
    ? `Class ${toRoman(item.min_class_level)}`
    : `Classes ${toRoman(item.min_class_level)}–${toRoman(item.max_class_level)}`;
}

// School-stage bands used only to group pickers for display — an item's own min/max class
// range (set in the seed data) is the source of truth; this just buckets it.
export const CLASS_BANDS = [
  { label: "Middle School (VI–VIII)", min: 1, max: 8 },
  { label: "Secondary (IX–X)", min: 9, max: 10 },
  { label: "Senior Secondary (XI–XII)", min: 11, max: 12 },
] as const;

export function bandForRange(item: ClassRanged): string {
  if (item.min_class_level == null) return "Ungrouped";
  const band = CLASS_BANDS.find((b) => item.min_class_level! <= b.max && item.min_class_level! >= b.min);
  return band?.label ?? "Ungrouped";
}

// Best-effort: pull a grade number out of a free-text class section name like "IX A" or
// "Class 6B" or "XII Science". Falls back to null (no filtering/reordering) if unparseable.
const ROMAN_TOKEN_TO_NUMBER: Record<string, number> = {
  XII: 12, XI: 11, X: 10, IX: 9, VIII: 8, VII: 7, VI: 6, V: 5, IV: 4, III: 3, II: 2, I: 1,
};

export function parseGradeFromClassName(name: string): number | null {
  const romanMatch = name.toUpperCase().match(/\b(XII|XI|X|IX|VIII|VII|VI|V|IV|III|II|I)\b/);
  if (romanMatch) return ROMAN_TOKEN_TO_NUMBER[romanMatch[1]];
  const digitMatch = name.match(/\b(1[0-2]|[1-9])\b/);
  if (digitMatch) return Number(digitMatch[1]);
  return null;
}

// True if an item with no class range set (legacy/untagged data), or one whose range actually
// covers the given grade. Grade `null` (unparseable class name) always matches everything —
// better to show too much than to silently hide options because of a naming quirk.
export function matchesGrade(item: ClassRanged, grade: number | null): boolean {
  if (grade == null) return true;
  if (item.min_class_level == null || item.max_class_level == null) return true;
  return grade >= item.min_class_level && grade <= item.max_class_level;
}
