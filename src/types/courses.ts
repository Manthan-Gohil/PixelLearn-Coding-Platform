export type SubscriptionTier = "free" | "pro";

export type CourseDifficulty = "beginner" | "intermediate" | "advanced";
export type ExerciseDifficulty = "easy" | "medium" | "hard";
export type CourseDifficultyFilter = "all" | CourseDifficulty;

export interface FlowchartNode {
  id: string;
  label: string;
  type: "start" | "end" | "process" | "decision" | "io";
}

export interface FlowchartEdge {
  from: string;
  to: string;
  label?: string;
}

export interface TestCase {
  input: string;
  expectedOutput: string;
  description: string;
}

export interface Exercise {
  id: string;
  chapterId: string;
  courseId: string;
  title: string;
  description: string;
  theory: string;
  problemStatement: string;
  inputExample?: string | null;
  outputExample?: string | null;
  hints: string[];
  constraints: string[];
  starterCode: string;
  solution: string;
  testCases?: TestCase[] | null;
  xpReward: number;
  difficulty: ExerciseDifficulty;
  language: string;
  order: number;
  flowchart?: {
    nodes: FlowchartNode[];
    edges: FlowchartEdge[];
  };
}

export interface Chapter {
  id: string;
  courseId: string;
  title: string;
  description: string;
  order: number;
  isPremium: boolean;
  exercises: Exercise[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  category: string;
  difficulty: CourseDifficulty;
  thumbnail?: string | null;
  isPremium: boolean;
  totalXP: number;
  estimatedHours: number;
  chapters: Chapter[];
  enrolledCount: number;
  rating: number;
  tags: string[];
  createdAt: string | Date;
}

export interface CourseProgressSummary {
  percentage: number;
  completed: number;
  total: number;
}

export interface CoursesFilterState {
  search: string;
  categoryFilter: string;
  difficultyFilter: CourseDifficultyFilter;
}
