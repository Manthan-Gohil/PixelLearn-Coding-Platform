import { NextRequest, NextResponse } from "next/server";
import { requireAuth, authError } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Runner } from "@/lib/runner";

// POST /api/exams/[examId]/submit — submit code for a problem (runs against ALL test cases)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ examId: string }> }
) {
  try {
    const user = await requireAuth();
    const { examId } = await params;
    const body = await request.json();
    const { problemId, code, language } = body;

    if (!problemId || !code || !language) {
      return NextResponse.json(
        { error: "problemId, code, and language are required" },
        { status: 400 }
      );
    }

    // Verify active attempt
    const attempt = await prisma.examAttempt.findUnique({
      where: { examId_userId: { examId, userId: user.id } },
    });

    if (!attempt || attempt.completedAt) {
      return NextResponse.json(
        { error: "No active exam attempt" },
        { status: 403 }
      );
    }

    // Check deadline
    if (new Date() > attempt.deadline) {
      return NextResponse.json(
        { error: "Exam time has expired" },
        { status: 403 }
      );
    }

    // Get problem and ALL test cases
    const problem = await prisma.examProblem.findUnique({
      where: { id: problemId },
      include: { testCases: true },
    });

    if (!problem) {
      return NextResponse.json({ error: "Problem not found" }, { status: 404 });
    }

    // Run code against all test cases
    let passedTests = 0;
    const totalTests = problem.testCases.length;
    let finalVerdict = "Accepted";
    let lastOutput = "";
    let lastError = "";

    for (const tc of problem.testCases) {
      const result = await Runner.execute(language, code, tc.input);

      const actualOutput = (result.stdout || "").trim();
      const expectedOutput = tc.output.trim();

      if (!result.success) {
        if (result.timedOut) {
          finalVerdict = "Time Limit Exceeded";
        } else if (result.stderr?.toLowerCase().includes("error")) {
          finalVerdict = "Compilation Error";
        } else {
          finalVerdict = "Runtime Error";
        }
        lastError = result.stderr || "";
        break;
      }

      if (actualOutput !== expectedOutput) {
        finalVerdict = "Wrong Answer";
        lastOutput = actualOutput;
        break;
      }

      passedTests++;
      lastOutput = actualOutput;
    }

    if (passedTests === totalTests) {
      finalVerdict = "Accepted";
    }

    const score = finalVerdict === "Accepted" ? problem.points : 0;

    // Upsert submission (keep best score per problem)
    const existingSubmission = await prisma.examSubmission.findFirst({
      where: {
        attemptId: attempt.id,
        problemId,
      },
      orderBy: { score: "desc" },
    });

    const submission = await prisma.examSubmission.create({
      data: {
        attemptId: attempt.id,
        problemId,
        userId: user.id,
        code,
        language,
        verdict: finalVerdict,
        passedTests,
        totalTests,
        score,
        output: lastOutput || null,
        error: lastError || null,
      },
    });

    // Update total score on attempt (sum of best scores per problem)
    const allSubmissions = await prisma.examSubmission.findMany({
      where: { attemptId: attempt.id },
      orderBy: { score: "desc" },
    });

    // Get best score per problem
    const bestScores: Record<string, number> = {};
    for (const s of allSubmissions) {
      if (!bestScores[s.problemId] || s.score > bestScores[s.problemId]) {
        bestScores[s.problemId] = s.score;
      }
    }

    const totalScore = Object.values(bestScores).reduce((sum, s) => sum + s, 0);

    await prisma.examAttempt.update({
      where: { id: attempt.id },
      data: { totalScore },
    });

    return NextResponse.json({
      submission: {
        id: submission.id,
        verdict: finalVerdict,
        passedTests,
        totalTests,
        score,
        output: lastOutput,
        error: lastError,
      },
      totalScore,
      previousBest: existingSubmission?.score || 0,
    });
  } catch (err) {
    const { status, message } = authError(err);
    return NextResponse.json({ error: message }, { status });
  }
}
