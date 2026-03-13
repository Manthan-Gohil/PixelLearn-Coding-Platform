import { CATEGORY_ICONS } from "@/constants/ui";
import {
  DEFAULT_CATEGORY_ICON,
  COURSE_DIFFICULTY_FILTERS,
} from "@/constants/courses";
import type {
  Chapter,
  Course,
  CourseDifficultyFilter,
  CoursesFilterState,
  SubscriptionTier,
} from "@/types/courses";

const normalize = (value: string) => value.toLowerCase();

export function getCategoryIcon(category: string): string {
  return CATEGORY_ICONS[category] ?? DEFAULT_CATEGORY_ICON;
}

export function isPremiumLocked(
  isPremium: boolean,
  userSubscription: SubscriptionTier,
): boolean {
  return isPremium && userSubscription === "free";
}

export function getCourseExerciseCount(course: Course): number {
  return course.chapters.reduce(
    (sum, chapter) => sum + chapter.exercises.length,
    0,
  );
}

export function getCourseXPTotal(course: Course): number {
  return course.chapters.reduce(
    (sum, chapter) =>
      sum +
      chapter.exercises.reduce(
        (chapterSum, exercise) => chapterSum + exercise.xpReward,
        0,
      ),
    0,
  );
}

export function getCourseTotals(course: Course): {
  totalExercises: number;
  totalXPEarnable: number;
} {
  return {
    totalExercises: getCourseExerciseCount(course),
    totalXPEarnable: getCourseXPTotal(course),
  };
}

export function getCourseCategories(courses: Course[]): string[] {
  return [
    "all",
    ...Array.from(new Set(courses.map((course) => course.category))),
  ];
}

export function filterCourses(
  courses: Course[],
  filters: Pick<
    CoursesFilterState,
    "search" | "categoryFilter" | "difficultyFilter"
  >,
): Course[] {
  const normalizedSearch = normalize(filters.search.trim());

  return courses.filter((course) => {
    const matchesSearch =
      normalizedSearch.length === 0 ||
      normalize(course.title).includes(normalizedSearch) ||
      normalize(course.description).includes(normalizedSearch) ||
      course.tags.some((tag) => normalize(tag).includes(normalizedSearch));

    const matchesCategory =
      filters.categoryFilter === "all" ||
      course.category === filters.categoryFilter;

    const matchesDifficulty =
      filters.difficultyFilter === "all" ||
      course.difficulty === filters.difficultyFilter;

    return matchesSearch && matchesCategory && matchesDifficulty;
  });
}

export function getChapterCompletion(
  chapter: Chapter,
  isExerciseCompleted: (exerciseId: string) => boolean,
): { completed: number; total: number } {
  const completed = chapter.exercises.filter((exercise) =>
    isExerciseCompleted(exercise.id),
  ).length;
  return { completed, total: chapter.exercises.length };
}

export function getDifficultyFilters(): ReadonlyArray<CourseDifficultyFilter> {
  return COURSE_DIFFICULTY_FILTERS;
}
