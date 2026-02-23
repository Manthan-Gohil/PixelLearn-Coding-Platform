/**
 * AI-related types and interfaces
 */

export interface ResumeAnalysisResult {
  atsScore: number;
  overallFeedback: string;
  skillsGap: string[];
  formattingFeedback: string[];
  missingKeywords: string[];
  improvements: ResizeImprovement[];
}

export interface ResizeImprovement {
  section: string;
  suggestion: string;
  priority: "high" | "medium" | "low";
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

export interface CareerQAResponse {
  success: boolean;
  type: "career-qa";
  result: string;
}

export interface ResumeAnalysisResponse {
  success: boolean;
  type: "resume-analyze";
  result: ResumeAnalysisResult;
  fileName: string;
  fileSize: number;
}

export interface RoadmapResponse {
  success: boolean;
  type: "roadmap";
  result: RoadmapStep[];
  metadata: {
    desiredRole: string;
    experienceLevel: string;
    skillsCount: number;
  };
}

export type AIResponse =
  | CareerQAResponse
  | ResumeAnalysisResponse
  | RoadmapResponse;
