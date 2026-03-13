import type { AIToolTabConfig, ExperienceLevel } from "@/types/ai-tools";

export const AI_TOOL_TABS: AIToolTabConfig[] = [
  {
    id: "career-qa",
    label: "Career Q&A",
    icon: "Brain",
    description: "Ask career questions",
  },
  {
    id: "resume",
    label: "Resume Analyzer",
    icon: "FileText",
    description: "Analyze your resume",
  },
  {
    id: "roadmap",
    label: "Career Roadmap",
    icon: "Rocket",
    description: "Generate a roadmap",
  },
];

export const AI_TOOLS_UPGRADE_HREF = "/pricing";

export const AI_TOOLS_PRO_ONLY_TITLE_PREFIX = "AI Tools are ";

export const AI_TOOLS_PRO_ONLY_TITLE_HIGHLIGHT = "Pro Only";

export const AI_TOOLS_PRO_ONLY_DESCRIPTION =
  "Upgrade to Pro to access AI Career Q&A, Resume Analyzer, and Career Roadmap Generator. Get personalized insights powered by advanced AI.";

export const CAREER_QA_SUGGESTED_QUESTIONS: string[] = [
  "What skills do I need for a frontend developer role?",
  "How to transition from non-tech to software engineering?",
  "Is it better to learn React or Vue.js in 2026?",
];

export const ROADMAP_EXPERIENCE_LEVELS: ExperienceLevel[] = [
  "beginner",
  "intermediate",
  "advanced",
];

export const AI_ANALYSIS_STEPS = {
  verify: 1,
  synthesize: 2,
  generate: 3,
} as const;
