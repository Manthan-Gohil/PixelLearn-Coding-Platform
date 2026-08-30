import { NextRequest, NextResponse } from "next/server";
import { requireAuth, authError } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Runner } from "@/lib/runner";

// POST /api/exams/[examId]/run — run code against sample test cases only
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

    // Get sample test cases only
    const testCases = await prisma.examTestCase.findMany({
      where: { problemId, isSample: true },
      orderBy: { id: "asc" },
    });

    if (testCases.length === 0) {
      return NextResponse.json(
        { error: "No sample test cases available" },
        { status: 404 }
      );
    }

    // Run code against each sample test case
    const results = [];
    for (const tc of testCases) {
      const result = await Runner.execute(language, code, tc.input);

      const actualOutput = (result.stdout || "").trim();
      const expectedOutput = tc.output.trim();
      const passed = result.success && actualOutput === expectedOutput;

      let verdict = "Accepted";
      if (!result.success) {
        if (result.timedOut) verdict = "Time Limit Exceeded";
        else if (result.stderr?.toLowerCase().includes("error"))
          verdict = "Compilation Error";
        else verdict = "Runtime Error";
      } else if (!passed) {
        verdict = "Wrong Answer";
      }

      results.push({
        input: tc.input,
        expectedOutput: tc.output,
        actualOutput,
        verdict,
        passed,
        error: result.stderr || "",
        executionTime: result.executionTime,
      });
    }

    return NextResponse.json({ results });
  } catch (err) {
    const { status, message } = authError(err);
    return NextResponse.json({ error: message }, { status });
  }
}
