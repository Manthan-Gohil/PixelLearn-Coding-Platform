/**
 * Application constants
 */

const SUPPORTED_FILE_TYPES = ["application/pdf", "text/plain", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
const SUPPORTED_FILE_EXTENSIONS = [".pdf", ".txt", ".docx"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const RESUME_ANALYSIS_PROMPT = `You are an expert ATS (Applicant Tracking System) resume analyzer. 
Analyze the provided resume and return a JSON response with the following structure:
{
  "atsScore": <number 0-100>,
  "overallFeedback": "<string>",
  "skillsGap": [<list of missing skills>],
  "formattingFeedback": [<list of formatting issues>],
  "missingKeywords": [<list of ATS keywords>],
  "improvements": [
    {
      "section": "<section name>",
      "suggestion": "<improvement suggestion>",
      "priority": "<high|medium|low>"
    }
  ]
}
Provide only valid JSON, no markdown or explanation.`;

const CAREER_QA_PROMPT = `You are an expert career counselor specializing in tech industry careers. 
Provide detailed, actionable guidance based on the user's question.
Format your response in markdown with clear sections and bullet points.`;

const ROADMAP_PROMPT = `You are an expert learning path designer. 
Create a structured learning roadmap as a JSON array of step objects with this structure:
[
  {
    "step": <number>,
    "title": "<step title>",
    "description": "<description>",
    "duration": "<estimated duration>",
    "skills": [<list of skills>],
    "resources": [<list of resources>],
    "milestone": "<milestone description>"
  }
]
Provide only valid JSON, no markdown or explanation.`;

module.exports = {
  SUPPORTED_FILE_TYPES,
  SUPPORTED_FILE_EXTENSIONS,
  MAX_FILE_SIZE,
  RESUME_ANALYSIS_PROMPT,
  CAREER_QA_PROMPT,
  ROADMAP_PROMPT,
};
