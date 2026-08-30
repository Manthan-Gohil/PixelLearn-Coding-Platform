import { NextRequest, NextResponse } from "next/server";
import { requireAuth, authError } from "@/lib/auth";
import prisma from "@/lib/prisma";

const GROQ_API_KEY = process.env.GROQ_API_KEY || "";

const QUIZ_SYSTEM_PROMPT = `You are a Quiz Generator AI for PixelLearn, an educational platform.

Your job is to generate high-quality, accurate quiz questions based on the user's request.

INSTRUCTIONS:
1. Parse the user's request to extract: topic, number of questions, and difficulty level.
2. If the user doesn't specify a count, default to 10 questions.
3. If the user doesn't specify difficulty, default to "intermediate".
4. Difficulty levels: "beginner", "intermediate", "advanced".
5. Generate multiple-choice questions (4 options each).
6. Questions must be accurate, non-duplicate, and appropriate for the stated difficulty.
7. Each question must have exactly one correct answer.
8. Each explanation should be 20-30 words explaining WHY the correct answer is right.
9. The quiz works for ALL educational topics — not just programming.

RETURN ONLY a valid JSON object with this exact structure, no other text:
{
  "title": "string — quiz title (e.g., 'OOP in C++ Quiz')",
  "topic": "string — the core topic",
  "difficulty": "beginner" | "intermediate" | "advanced",
  "questionCount": number,
  "duration": number (total seconds — 45 seconds per question for beginner, 60 for intermediate, 90 for advanced),
  "questions": [
    {
      "question": "string — the question text",
      "options": ["option A", "option B", "option C", "option D"],
      "correctIndex": 0-3,
      "explanation": "string — 20-30 word explanation"
    }
  ]
}

CRITICAL RULES:
- Return ONLY raw JSON. No markdown, no code fences, no extra text.
- correctIndex must be a valid index (0-3) into the options array.
- Never include duplicate questions.
- All questions must be factually accurate.
- Options should be plausible to test real understanding.`;

async function callGroqAPI(messages: { role: string; content: string }[]) {
  if (!GROQ_API_KEY) {
    return null;
  }

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "openai/gpt-oss-20b",
      messages,
      temperature: 0.7,
      max_tokens: 8192,
    }),
  });

  if (!res.ok) {
    throw new Error(`Groq API returned status ${res.status}`);
  }

  const data = await res.json();
  let content: string =
    data.choices?.[0]?.message?.content || "";
  // Strip markdown code fences
  const codeFenceMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeFenceMatch) {
    content = codeFenceMatch[1].trim();
  }
  return content;
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();

    const body = await request.json();
    const { prompt } = body;

    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      return NextResponse.json(
        { error: "Please provide a quiz prompt" },
        { status: 400 }
      );
    }

    // Check 24h proctoring restriction
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentViolation = await prisma.quizAttempt.findFirst({
      where: {
        userId: user.id,
        isProctored: true,
        terminatedByProctor: true,
        completedAt: { gte: twentyFourHoursAgo },
      },
    });

    if (recentViolation) {
      const restrictionEnds = new Date(
        new Date(recentViolation.completedAt!).getTime() + 24 * 60 * 60 * 1000
      );
      return NextResponse.json(
        {
          error: "You are restricted from generating quizzes due to a proctoring violation.",
          restrictedUntil: restrictionEnds.toISOString(),
        },
        { status: 403 }
      );
    }

    const messages = [
      { role: "system", content: QUIZ_SYSTEM_PROMPT },
      { role: "user", content: prompt },
    ];

    const response = await callGroqAPI(messages);

    if (!response) {
      // Mock fallback
      const mockQuiz = generateMockQuiz(prompt);
      const saved = await prisma.quiz.create({
        data: {
          userId: user.id,
          title: mockQuiz.title,
          topic: mockQuiz.topic,
          difficulty: mockQuiz.difficulty,
          questionCount: mockQuiz.questionCount,
          duration: mockQuiz.duration,
          questions: mockQuiz.questions as any,
        },
      });
      return NextResponse.json({ ...mockQuiz, id: saved.id });
    }

    let quizData;
    try {
      quizData = JSON.parse(response);
    } catch {
      return NextResponse.json(
        { error: "Failed to parse quiz data from AI. Please try again." },
        { status: 500 }
      );
    }

    // Validate structure
    if (
      !quizData.title ||
      !quizData.topic ||
      !quizData.difficulty ||
      !Array.isArray(quizData.questions) ||
      quizData.questions.length === 0
    ) {
      return NextResponse.json(
        { error: "Invalid quiz data structure. Please try again." },
        { status: 500 }
      );
    }

    // Validate each question
    for (const q of quizData.questions) {
      if (
        !q.question ||
        !Array.isArray(q.options) ||
        q.options.length !== 4 ||
        typeof q.correctIndex !== "number" ||
        q.correctIndex < 0 ||
        q.correctIndex > 3
      ) {
        return NextResponse.json(
          { error: "Invalid question format in quiz data. Please try again." },
          { status: 500 }
        );
      }
    }

    quizData.questionCount = quizData.questions.length;

    // Save to database
    const saved = await prisma.quiz.create({
      data: {
        userId: user.id,
        title: quizData.title,
        topic: quizData.topic,
        difficulty: quizData.difficulty,
        questionCount: quizData.questionCount,
        duration: quizData.duration || quizData.questionCount * 60,
        questions: quizData.questions as any,
      },
    });

    return NextResponse.json({ ...quizData, id: saved.id });
  } catch (err) {
    const { status, message } = authError(err);
    return NextResponse.json({ error: message }, { status });
  }
}

function generateMockQuiz(prompt: string) {
  const lower = prompt.toLowerCase();
  const countMatch = lower.match(/(\d+)\s*questions?/);
  const count = countMatch ? Math.min(parseInt(countMatch[1]), 30) : 10;

  let difficulty = "intermediate";
  if (lower.includes("beginner") || lower.includes("easy")) difficulty = "beginner";
  if (lower.includes("advanced") || lower.includes("hard")) difficulty = "advanced";

  const topic = prompt.replace(/generate|create|make|give|quiz|questions?|\d+|beginner|intermediate|advanced|easy|hard|about|of|with|me|a|an|the/gi, "").trim() || "General Knowledge";

  const questions = Array.from({ length: count }, (_, i) => ({
    question: `Sample question ${i + 1} about ${topic}?`,
    options: [`Option A`, `Option B`, `Option C`, `Option D`],
    correctIndex: i % 4,
    explanation: `This is the correct answer because it directly relates to the core concept of ${topic}.`,
  }));

  return {
    title: `${topic} Quiz`,
    topic,
    difficulty,
    questionCount: count,
    duration: count * 60,
    questions,
  };
}
