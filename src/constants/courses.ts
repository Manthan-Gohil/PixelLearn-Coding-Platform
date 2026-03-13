import type { CourseDifficulty, CourseDifficultyFilter } from "@/types/courses";
// Category icons live in constants/ui.ts as CATEGORY_ICONS — use getCategoryIcon() from utils/courses.ts
export const DEFAULT_CATEGORY_ICON = "📚";

export const COURSE_DIFFICULTIES: ReadonlyArray<CourseDifficulty> = [
  "beginner",
  "intermediate",
  "advanced",
];

export const COURSE_DIFFICULTY_FILTERS: ReadonlyArray<CourseDifficultyFilter> =
  ["all", ...COURSE_DIFFICULTIES];
