import { NextRequest, NextResponse } from "next/server";
import { requireAuth, authError } from "@/lib/auth";
import prisma from "@/lib/prisma";

// POST /api/exams/[examId]/start — start an exam attempt
export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ examId: string }> }
) {
  try {
    const user = await requireAuth();
    const { examId } = await params;

    const exam = await prisma.exam.findUnique({
      where: { id: examId },
      include: {
        problems: {
          include: {
            testCases: { where: { isSample: true } },
          },
          orderBy: { order: "asc" },
        },
      },
    });

    if (!exam || (!exam.isPublished && !user.isAdmin)) {
      return NextResponse.json({ error: "Exam not found" }, { status: 404 });
    }

    // Check if already attempted
    const existing = await prisma.examAttempt.findUnique({
      where: { examId_userId: { examId, userId: user.id } },
    });

    if (existing) {
      return NextResponse.json(
        {
          error: "You have already attempted this exam",
          attempt: {
            ...existing,
            startedAt: existing.startedAt.toISOString(),
            deadline: existing.deadline.toISOString(),
            completedAt: existing.completedAt?.toISOString() || null,
          },
        },
        { status: 409 }
      );
    }

    const now = new Date();
    const deadline = new Date(now.getTime() + exam.duration * 60 * 1000);
    const maxScore = exam.problems.reduce((sum, p) => sum + p.points, 0);

    const attempt = await prisma.examAttempt.create({
      data: {
        examId,
        userId: user.id,
        deadline,
        maxScore,
      },
    });

    return NextResponse.json({
      attempt: {
        id: attempt.id,
        examId: attempt.examId,
        startedAt: attempt.startedAt.toISOString(),
        deadline: attempt.deadline.toISOString(),
        maxScore: attempt.maxScore,
      },
      exam: {
        title: exam.title,
        duration: exam.duration,
        problems: exam.problems.map((p) => ({
          id: p.id,
          title: p.title,
          statement: p.statement,
          constraints: p.constraints,
          inputFormat: p.inputFormat,
          outputFormat: p.outputFormat,
          examples: p.examples,
          difficulty: p.difficulty,
          points: p.points,
          supportedLangs: p.supportedLangs,
          testCases: p.testCases,
        })),
      },
    });
  } catch (err) {
    const { status, message } = authError(err);
    return NextResponse.json({ error: message }, { status });
  }
}
