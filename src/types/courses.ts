import type {
  CourseDifficulty,
  CourseDifficultyFilter,
  ExerciseDifficulty,
  FlowchartEdge,
  FlowchartNode,
  SubscriptionTier,
  TestCase,
} from "./index";

export type {
  CourseDifficulty,
  CourseDifficultyFilter,
  ExerciseDifficulty,
  SubscriptionTier,
  TestCase,
};

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
