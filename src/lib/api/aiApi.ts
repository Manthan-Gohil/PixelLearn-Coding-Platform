/**
 * AI API Service Layer
 * Handles communication with backend AI endpoints
 */

export interface CareerQAResponse {
  success: boolean;
  type: string;
  result: string;
}

export interface ResumeAnalysisResponse {
  success: boolean;
  type: string;
  result: {
    atsScore: number;
    overallFeedback: string;
    skillsGap: string[];
    formattingFeedback: string[];
    missingKeywords: string[];
    improvements: Array<{
      section: string;
      suggestion: string;
      priority: "high" | "medium" | "low";
    }>;
  };
  fileName: string;
  fileSize: number;
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

export interface RoadmapResponse {
  success: boolean;
  type: string;
  result: RoadmapStep[];
  metadata: {
    desiredRole: string;
    experienceLevel: string;
    skillsCount: number;
  };
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

/**
 * Career Q&A API Call
 */
export async function callCareerQA(question: string): Promise<CareerQAResponse> {
  const response = await fetch(`${API_BASE_URL}/api/ai/career-qa`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getAuthToken()}`,
    },
    body: JSON.stringify({ question }),
  });

  if (!response.ok) {
    throw new Error(`Career QA failed: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Resume Analysis API Call - File Upload
 */
export async function uploadAndAnalyzeResume(
  file: File
): Promise<ResumeAnalysisResponse> {
  const formData = new FormData();
  formData.append("resume", file);

  const response = await fetch(`${API_BASE_URL}/api/ai/resume-analyze`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Resume analysis failed: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Roadmap Generation API Call
 */
export async function generateRoadmap(
  desiredRole: string,
  currentSkills: string[] = [],
  experienceLevel: string = "beginner"
): Promise<RoadmapResponse> {
  const response = await fetch(`${API_BASE_URL}/api/ai/roadmap`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getAuthToken()}`,
    },
    body: JSON.stringify({
      desiredRole,
      currentSkills,
      experienceLevel,
    }),
  });

  if (!response.ok) {
    throw new Error(`Roadmap generation failed: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get auth token from localStorage or elsewhere
 * In production, this would be handled by your auth provider
 */
function getAuthToken(): string {
  // For demo purposes, return a mock token
  // In production, get this from your auth provider (Clerk, etc.)
  return "Bearer demo-token";
}
