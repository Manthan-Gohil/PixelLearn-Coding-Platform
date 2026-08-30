import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, authError } from "@/lib/auth";
import prisma from "@/lib/prisma";

// POST /api/exams/[examId]/problems — add problem (admin only)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ examId: string }> }
) {
  try {
    await requireAdmin();
    const { examId } = await params;
    const body = await request.json();

    // Get current max order
    const maxOrder = await prisma.examProblem.findFirst({
      where: { examId },
      orderBy: { order: "desc" },
      select: { order: true },
    });

    const problem = await prisma.examProblem.create({
      data: {
        examId,
        title: body.title || "Untitled Problem",
        statement: body.statement || "",
        constraints: body.constraints || [],
        inputFormat: body.inputFormat || "",
        outputFormat: body.outputFormat || "",
        examples: body.examples || [],
        difficulty: body.difficulty || "medium",
        points: body.points || 100,
        timeLimit: body.timeLimit || 2,
        memoryLimit: body.memoryLimit || 256,
        supportedLangs: body.supportedLangs || ["cpp", "python", "java", "javascript"],
        order: (maxOrder?.order ?? -1) + 1,
      },
    });

    // Create test cases if provided
    if (Array.isArray(body.testCases)) {
      await prisma.examTestCase.createMany({
        data: body.testCases.map((tc: { input: string; output: string; isSample?: boolean }) => ({
          problemId: problem.id,
          input: tc.input,
          output: tc.output,
          isSample: tc.isSample || false,
        })),
      });
    }

    return NextResponse.json({ problem });
  } catch (err) {
    const { status, message } = authError(err);
    return NextResponse.json({ error: message }, { status });
  }
}
