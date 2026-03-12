import { NextRequest, NextResponse } from "next/server";

const GROQ_API_KEY = process.env.GROQ_API_KEY || "";

async function callGroqAPI(messages: { role: string; content: string }[]) {
  if (!GROQ_API_KEY) {
    // Return mock response if no API key
    return generateMockResponse(messages[messages.length - 1].content);
  }

  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages,
        temperature: 0.7,
        max_tokens: 4096,
      }),
    });

    const data = await res.json();
    let content: string =
      data.choices?.[0]?.message?.content || "No response generated.";
    // Strip markdown code fences that LLMs often wrap JSON responses in
    const codeFenceMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (codeFenceMatch) {
      content = codeFenceMatch[1].trim();
    }
    return content;
  } catch {
    return generateMockResponse(messages[messages.length - 1].content);
  }
}

function generateMockResponse(query: string): string {
  const lower = query.toLowerCase();

  if (lower.includes("resume") || lower.includes("analyze")) {
    return JSON.stringify({
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
          suggestion:
            "Organize skills by category and include proficiency levels",
          priority: "medium",
        },
        {
          section: "Projects",
          suggestion: "Add links to live demos or GitHub repositories",
          priority: "medium",
        },
        {
          section: "Education",
          suggestion: "Include relevant coursework and GPA if above 3.5",
          priority: "low",
        },
      ],
    });
  }

  if (lower.includes("roadmap") || lower.includes("path")) {
    return JSON.stringify([
      {
        step: 1,
        title: "Foundation Building",
        description:
          "Master core programming fundamentals and web development basics",
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
      {
        step: 4,
        title: "DevOps & Deployment",
        description: "Learn cloud deployment, CI/CD, and infrastructure",
        duration: "1-2 months",
        skills: ["Docker", "AWS/Vercel", "CI/CD", "Monitoring"],
        resources: ["AWS Free Tier", "Docker docs", "GitHub Actions"],
        milestone: "Deploy 2 production applications",
      },
      {
        step: 5,
        title: "Interview Preparation",
        description: "Prepare for technical interviews and build portfolio",
        duration: "1-2 months",
        skills: ["DSA", "System Design", "Behavioral", "Portfolio"],
        resources: ["LeetCode", "System Design Primer", "Pramp"],
        milestone: "Complete 100 DSA problems and prepare portfolio",
      },
    ]);
  }

  // Career Q&A response
  return `## Career Guidance

Based on your question, here's my analysis:

### Key Skills to Focus On
1. **JavaScript/TypeScript** – Essential for modern web development
2. **React.js / Next.js** – Most in-demand frontend frameworks
3. **Node.js** – Server-side JavaScript for full-stack capabilities
4. **PostgreSQL** – Industry-standard relational database
5. **Cloud Services** – AWS, GCP, or Azure fundamentals

### Recommended Learning Path
- Start with fundamentals (2-3 months)
- Build projects to demonstrate skills (ongoing)
- Contribute to open source (builds credibility)
- Practice DSA for interviews (1-2 months)

### Timeline
- **3-6 months** for career transition with focused study
- **6-12 months** for a complete beginner to job-ready

### Industry Insights
- Remote opportunities have increased significantly
- Full-stack developers are the most versatile hires
- Portfolio projects matter more than certificates
- Networking through tech communities accelerates job search

### Action Items
1. Complete a structured course (PixelLearn has great ones!)
2. Build 3-5 portfolio projects
3. Create a professional GitHub profile
4. Practice interviewing with mock sessions
5. Apply to 5-10 positions per week during job search`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data } = body;

    let systemPrompt = "";
    let userMessage = "";

    switch (type) {
      case "career-qa":
        systemPrompt =
          "You are a professional career counselor specializing in tech careers. Provide detailed, actionable advice. Format your response with markdown headers, bullet points, and clear sections.";
        userMessage = data.question;
        break;

      case "resume-analyze":
        systemPrompt = `You are an expert AI Resume Analyst. Your job is to deeply read the provided resume and return a HIGHLY SPECIFIC, PERSONALISED analysis.

CRITICAL RULES:
- Read every word of the resume carefully.
- Reference exact project names, company names, technologies, dates, CGPA, percentages, and achievements as they appear in the resume. Never give generic advice.
- Do NOT fabricate information. Only reference what is actually written.
- Return ONLY a raw JSON object. No markdown, no code fences, no extra text before or after the JSON.

Return this exact JSON schema:
{
  "overall_score": number (0-100, honest and calibrated),
  "overall_feedback": "string (3-6 word verdict e.g. 'Strong junior developer profile')",
  "summary_comment": "string (2-3 sentences summarising the candidate using their real name, degree, and standout qualities from the resume)",
  "sections": {
    "contact_info": {
      "score": number,
      "comment": "string (list which contact details are present: phone, email, LinkedIn, GitHub, Portfolio. Note what is missing if anything.)"
    },
    "experience": {
      "score": number,
      "comment": "string (name exact companies and roles, e.g. 'Careerwill Full Stack Intern May-Jul 2025 and USTART Web Dev Intern Mar-Sep 2025 — good production exposure. Add quantifiable metrics beyond the 45% load time reduction already mentioned.')"
    },
    "education": {
      "score": number,
      "comment": "string (mention exact degree, specialisation, CGPA/percentage, and years)"
    },
    "skills": {
      "score": number,
      "comment": "string (list skills found in resume, highlight strong ones, and name specific gaps like Cloud/DevOps, testing frameworks, system design)"
    }
  },
  "projects": [
    {
      "name": "string (exact project name from resume)",
      "tech": ["string (each technology used)"],
      "duration": "string (exact dates from resume)",
      "comment": "string (2-3 sentences: what was built, what is technically impressive, what is missing — e.g. no tests, no CI/CD, no live demo link)"
    }
  ],
  "internships": [
    {
      "company": "string (exact company name)",
      "role": "string (exact role title)",
      "duration": "string (exact dates)",
      "comment": "string (2-3 sentences: what they did, what was impressive, what metrics or outcomes are missing)"
    }
  ],
  "achievements": ["string (each achievement with full context, e.g. '1st place DevXpo Hackathon at NSUT Delhi organised by GDSC')"],
  "skill_gaps": [
    {
      "skill": "string (exact skill or technology name that is missing or weak)",
      "reason": "string (why this skill matters for this candidate's profile and career goals — reference their projects/internships)",
      "priority": "high | medium | low"
    }
  ],
  "focus_areas": [
    {
      "area": "string (concise area title, e.g. 'Cloud & DevOps', 'Testing & Quality', 'System Design')",
      "why": "string (why this is the most important thing for this specific candidate to focus on — reference their actual resume content)",
      "how": "string (concrete steps to improve: specific courses, projects to add, skills to learn — be precise)"
    }
  ],
  "action_plan": [
    {
      "title": "string (short action title)",
      "action": "string (specific actionable step — name actual skills, project ideas, or platforms relevant to this candidate)",
      "timeframe": "string (e.g. 'Next 2 weeks', '1 month', '3 months')"
    }
  ],
  "tips_for_improvement": ["string (4-5 specific, actionable tips that directly reference this candidate's resume — mention actual project or skill names)"],
  "whats_good": ["string (3-4 specific strengths with evidence from the resume)"],
  "needs_improvement": ["string (3-4 specific gaps with context from the resume)"]
}`;
        userMessage = `Analyze this resume and return ONLY the JSON, no code fences:\n\n${data.resumeText}`;
        break;

      case "roadmap":
        systemPrompt = `You are a career roadmap expert. Generate a step-by-step roadmap. Return a JSON array with this structure:
[{"step": number, "title": "string", "description": "string", "duration": "string", "skills": ["string"], "resources": ["string"], "milestone": "string"}]
Return ONLY the JSON array, no additional text.`;
        userMessage = `Create a roadmap for: Role: ${data.desiredRole}, Current Skills: ${data.currentSkills?.join(", ") || "None"}, Experience: ${data.experienceLevel}`;
        break;

      default:
        return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    const messages = [
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage },
    ];

    const response = await callGroqAPI(messages);

    return NextResponse.json({ result: response });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
