import type { ExperienceLevel } from "./index";

export type AITabId = "career-qa" | "resume" | "roadmap";

export type AIToolTabIconName = "Brain" | "FileText" | "Rocket";

export interface AIToolTabConfig {
  id: AITabId;
  label: string;
  icon: AIToolTabIconName;
  description: string;
}

export type AIToolRequestType = "career-qa" | "resume-analyze" | "roadmap";

export interface ResumeResult {
  overall_score: number;
  overall_feedback: string;
  summary_comment: string;
  sections: {
    contact_info: { score: number; comment: string };
    experience: { score: number; comment: string };
    education: { score: number; comment: string };
    skills: { score: number; comment: string };
  };
  projects?: {
    name: string;
    tech: string[];
    duration: string;
    comment: string;
  }[];
  internships?: {
    company: string;
    role: string;
    duration: string;
    comment: string;
  }[];
  achievements?: string[];
  skill_gaps?: {
    skill: string;
    reason: string;
    priority: "high" | "medium" | "low";
  }[];
  focus_areas?: { area: string; why: string; how: string }[];
  action_plan?: { title: string; action: string; timeframe: string }[];
  tips_for_improvement: string[];
  whats_good: string[];
  needs_improvement: string[];
}

export type { ExperienceLevel };

export interface RoadmapStepData {
  step: number;
  title: string;
  description: string;
  duration: string;
  skills: string[];
  resources: string[];
  milestone: string;
}
