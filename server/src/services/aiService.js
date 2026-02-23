const { GROQ_API_KEY, GROQ_API_URL, MODEL } = require("../config/groq");
const {
  RESUME_ANALYSIS_PROMPT,
  CAREER_QA_PROMPT,
  ROADMAP_PROMPT,
} = require("../utils/constants");
const AppError = require("../utils/errors");

/**
 * Call Groq API with structured messages
 */
async function callGroqAPI(messages) {
  if (!GROQ_API_KEY) {
    return generateMockResponse(messages[messages.length - 1].content);
  }

  try {
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        messages,
        temperature: 0.7,
        max_tokens: 2048,
      }),
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.statusCode}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || "No response generated.";
  } catch (error) {
    console.error("[Groq API Error]", error.message);
    return generateMockResponse(messages[messages.length - 1].content);
  }
}

/**
 * Career Q&A Agent
 */
async function careerQA(question) {
  if (!question || question.trim().length === 0) {
    throw new AppError("Question cannot be empty", 400);
  }

  const messages = [
    {
      role: "system",
      content: CAREER_QA_PROMPT,
    },
    {
      role: "user",
      content: question,
    },
  ];

  const response = await callGroqAPI(messages);
  return response;
}

/**
 * Resume Analysis Agent
 * Input: resume text extracted from file
 */
async function analyzeResume(resumeText) {
  if (!resumeText || resumeText.trim().length === 0) {
    throw new AppError("Resume text cannot be empty", 400);
  }

  const messages = [
    {
      role: "system",
      content: RESUME_ANALYSIS_PROMPT,
    },
    {
      role: "user",
      content: `Analyze this resume:\n\n${resumeText}`,
    },
  ];

  const response = await callGroqAPI(messages);

  // Parse and validate JSON response
  try {
    // If response is already parsed, return it
    if (typeof response === "object") {
      return response;
    }

    // Try to parse JSON from string response
    const cleanResponse = response
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();
    const parsed = JSON.parse(cleanResponse);
    return parsed;
  } catch (error) {
    console.error("[Resume Analysis Parse Error]", error);
    // Return structured mock response if parsing fails
    return generateMockResumeResponse(resumeText);
  }
}

/**
 * Roadmap Generator Agent
 */
async function generateRoadmap(desiredRole, currentSkills, experienceLevel) {
  if (!desiredRole || desiredRole.trim().length === 0) {
    throw new AppError("Desired role cannot be empty", 400);
  }

  const skillsText = Array.isArray(currentSkills)
    ? currentSkills.join(", ")
    : currentSkills;

  const messages = [
    {
      role: "system",
      content: ROADMAP_PROMPT,
    },
    {
      role: "user",
      content: `Create a learning roadmap for:
- Desired Role: ${desiredRole}
- Current Skills: ${skillsText}
- Experience Level: ${experienceLevel}`,
    },
  ];

  const response = await callGroqAPI(messages);

  // Parse and validate JSON response
  try {
    if (Array.isArray(response)) {
      return response;
    }

    const cleanResponse = response
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();
    const parsed = JSON.parse(cleanResponse);
    return Array.isArray(parsed) ? parsed : [parsed];
  } catch (error) {
    console.error("[Roadmap Parse Error]", error);
    return generateMockRoadmapResponse(desiredRole);
  }
}

/**
 * Mock response generators for fallback
 */
function generateMockResponse(query) {
  const lower = query.toLowerCase();

  if (lower.includes("career") || lower.includes("role")) {
    return `## Career Guidance

Based on your question, here's my analysis:

### Key Skills to Focus On
1. **JavaScript/TypeScript** – Essential for modern web development
2. **React.js / Next.js** – Most in-demand frontend frameworks
3. **Node.js** – Server-side JavaScript for full-stack capabilities
4. **PostgreSQL** – Industry-standard relational database

### Recommended Path
1. Master core fundamentals (2-3 months)
2. Build 3-5 portfolio projects (2-3 months)
3. Practice system design and DSA (1-2 months)
4. Start applying to jobs

### Resources
- freeCodeCamp
- LeetCode for DSA practice
- Frontend Masters for advanced topics
- Official documentation for frameworks`;
  }

  return `## Career Guidance

I understand you're looking for career direction. Here are some general recommendations:

1. **Build practical projects** – Real-world experience matters
2. **Master the fundamentals** – Strong foundation is crucial
3. **Network actively** – Connect with professionals in your field
4. **Stay updated** – Tech changes rapidly
5. **Practice consistently** – Dedicate time daily to learning`;
}

function generateMockResumeResponse(resumeText) {
  return {
    atsScore: 72,
    overallFeedback:
      "Your resume has a good structure but needs improvements in keyword optimization and quantifiable achievements.",
    skillsGap: [
      "Cloud Computing (AWS/GCP)",
      "System Design",
      "CI/CD Pipelines",
      "TypeScript",
    ],
    formattingFeedback: [
      "Use consistent date formatting throughout",
      "Add more white space between sections",
      "Ensure all bullet points start with action verbs",
      "Keep resume to 1-2 pages maximum",
    ],
    missingKeywords: [
      "Agile",
      "Scrum",
      "RESTful APIs",
      "Microservices",
      "Docker",
      "Kubernetes",
    ],
    improvements: [
      {
        section: "Summary",
        suggestion:
          "Add a compelling professional summary with years of experience and key technologies",
        priority: "high",
      },
      {
        section: "Experience",
        suggestion:
          "Quantify achievements with metrics (e.g., 'Improved performance by 40%')",
        priority: "high",
      },
      {
        section: "Skills",
        suggestion: "Organize skills by category and include proficiency levels",
        priority: "medium",
      },
      {
        section: "Projects",
        suggestion: "Add links to live demos or GitHub repositories",
        priority: "medium",
      },
    ],
  };
}

function generateMockRoadmapResponse(desiredRole) {
  return [
    {
      step: 1,
      title: "Foundation Building",
      description: "Master core programming fundamentals and web development basics",
      duration: "2-3 months",
      skills: ["HTML/CSS", "JavaScript", "Git", "Command Line"],
      resources: ["freeCodeCamp", "MDN Web Docs", "The Odin Project"],
      milestone: "Build 3 responsive landing pages",
    },
    {
      step: 2,
      title: "Frontend Framework Mastery",
      description: "Learn React.js ecosystem and modern frontend development",
      duration: "2-3 months",
      skills: ["React.js", "TypeScript", "Next.js", "Tailwind CSS"],
      resources: ["React docs", "Vercel tutorials", "Frontend Masters"],
      milestone: "Build a full-stack web application",
    },
    {
      step: 3,
      title: "Backend Development",
      description: "Learn server-side programming and database management",
      duration: "2-3 months",
      skills: ["Node.js", "Express.js", "PostgreSQL", "REST APIs"],
      resources: ["Node.js docs", "PostgreSQL tutorials", "Backend courses"],
      milestone: "Build and deploy an API with authentication",
    },
  ];
}

module.exports = {
  careerQA,
  analyzeResume,
  generateRoadmap,
  callGroqAPI,
};
