import { NextRequest, NextResponse } from "next/server";
import { requireAuth, authError } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await request.json();
    const {
      quizId,
      answers,
      timeTaken,
      isProctored = false,
      terminatedByProctor = false,
      violations = [],
    } = body;

    if (!quizId || !answers || typeof timeTaken !== "number") {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Fetch the quiz to validate answers server-side
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
    });

    if (!quiz) {
      return NextResponse.json(
        { error: "Quiz not found" },
        { status: 404 }
      );
    }

    const questions = quiz.questions as Array<{
      question: string;
      options: string[];
      correctIndex: number;
      explanation: string;
    }>;

    // Calculate scores server-side (don't trust frontend)
    let correctCount = 0;
    let incorrectCount = 0;
    let skippedCount = 0;
    const answerMap = answers as Record<string, number>;

    const questionResults = questions.map((q, index) => {
      const userAnswer = answerMap[String(index)];
      const isSkipped = userAnswer === undefined || userAnswer === null || userAnswer === -1;
      const isCorrect = !isSkipped && userAnswer === q.correctIndex;

      if (isSkipped) {
        skippedCount++;
      } else if (isCorrect) {
        correctCount++;
      } else {
        incorrectCount++;
      }

      return {
        questionIndex: index,
        question: q.question,
        options: q.options,
        correctIndex: q.correctIndex,
        userAnswer: isSkipped ? null : userAnswer,
        isCorrect,
        isSkipped,
        explanation: q.explanation,
      };
    });

    const totalQuestions = questions.length;
    const score = Math.round((correctCount / totalQuestions) * 100);

    // Save attempt
    const attempt = await prisma.quizAttempt.create({
      data: {
        quizId,
        userId: user.id,
        answers: answerMap as any,
        score,
        totalQuestions,
        correctCount,
        incorrectCount,
        skippedCount,
        timeTaken,
        isProctored,
        terminatedByProctor,
        violations: violations.length > 0 ? violations : undefined,
        completedAt: new Date(),
      },
    });

    return NextResponse.json({
      attemptId: attempt.id,
      quizTitle: quiz.title,
      topic: quiz.topic,
      difficulty: quiz.difficulty,
      score,
      totalQuestions,
      correctCount,
      incorrectCount,
      skippedCount,
      timeTaken,
      isProctored,
      terminatedByProctor,
      questionResults,
    });
  } catch (err) {
    const { status, message } = authError(err);
    return NextResponse.json({ error: message }, { status });
  }
}
