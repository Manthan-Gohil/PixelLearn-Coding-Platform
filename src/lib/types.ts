// ===== User Types =====
export interface User {
  id: string;
  clerkId?: string;
  email: string;
  name: string;
  avatar?: string;
  subscription: "free" | "pro";
  xp: number;
  streak: number;
  badges: Badge[];
  enrolledCourses: string[];
  completedExercises: string[];
  referralCode: string;
  referralCount: number;
  createdAt: string;
  lastActive: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  requirement: {
    type: "xp" | "streak" | "course_complete" | "exercises";
    value: number;
  };
}

// ===== Course Types =====
export interface Course {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  category: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  thumbnail: string;
  isPremium: boolean;
  totalXP: number;
  estimatedHours: number;
  chapters: Chapter[];
  enrolledCount: number;
  rating: number;
  tags: string[];
  createdAt: string;
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

export interface Exercise {
  id: string;
  chapterId: string;
  courseId: string;
  title: string;
  description: string;
  theory: string;
  problemStatement: string;
  inputExample: string;
  outputExample: string;
  hints: string[];
  constraints: string[];
  starterCode: string;
  solution: string;
  testCases: TestCase[];
  xpReward: number;
  difficulty: "easy" | "medium" | "hard";
  language: string;
  order: number;
}

export interface TestCase {
  input: string;
  expectedOutput: string;
  description: string;
}

// ===== Progress Types =====
export interface UserProgress {
  courseId: string;
  completedExercises: string[];
  totalExercises: number;
  progressPercentage: number;
  lastActivity: string;
  xpEarned: number;
}

export interface DailyActivity {
  date: string;
  exercisesCompleted: number;
  xpEarned: number;
  minutesActive: number;
}

// ===== AI Types =====
export interface CareerQuestion {
  question: string;
  context?: string;
}

export interface CareerAnswer {
  answer: string;
  skills: string[];
  roadmap: RoadmapStep[];
  timeline: string;
  recommendedStack: string[];
}

export interface ResumeAnalysis {
  atsScore: number;
  overallFeedback: string;
  skillsGap: string[];
  formattingFeedback: string[];
  missingKeywords: string[];
  improvements: Improvement[];
}

export interface Improvement {
  section: string;
  suggestion: string;
  priority: "high" | "medium" | "low";
}

export interface RoadmapInput {
  desiredRole: string;
  currentSkills: string[];
  experienceLevel: "beginner" | "intermediate" | "advanced";
}

export interface RoadmapStep {
  step: number;
  title: string;
  description: string;
  duration: string;
  skills: string[];
  resources: string[];
  milestone: string;
}

// ===== Subscription Types =====
export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  interval: "monthly" | "yearly";
  features: string[];
  isPopular: boolean;
}

// ===== Code Execution Types =====
export interface CodeExecutionRequest {
  code: string;
  language: string;
  input?: string;
}

export interface CodeExecutionResult {
  output: string;
  error?: string;
  executionTime: number;
  success: boolean;
}
