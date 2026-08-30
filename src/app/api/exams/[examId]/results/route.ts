import { NextRequest, NextResponse } from "next/server";
import { requireAuth, requireAdmin, authError } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET /api/exams/[examId]/results — get results (user sees own, admin sees all)
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ examId: string }> }
) {
  try {
    const user = await requireAuth();
    const { examId } = await params;

    if (user.isAdmin) {
      // Admin view — all attempts with submissions
      const attempts = await prisma.examAttempt.findMany({
        where: { examId },
        include: {
          user: {
            select: { id: true, name: true, email: true, avatar: true },
          },
          submissions: {
            include: {
              problem: { select: { title: true, points: true } },
            },
            orderBy: { submittedAt: "desc" },
          },
        },
        orderBy: { totalScore: "desc" },
      });

      return NextResponse.json({
        attempts: attempts.map((a) => ({
          ...a,
          startedAt: a.startedAt.toISOString(),
          deadline: a.deadline.toISOString(),
          completedAt: a.completedAt?.toISOString() || null,
          submissions: a.submissions.map((s) => ({
            ...s,
            submittedAt: s.submittedAt.toISOString(),
          })),
        })),
      });
    }

    // User view — own attempt only
    const attempt = await prisma.examAttempt.findUnique({
      where: { examId_userId: { examId, userId: user.id } },
      include: {
        submissions: {
          include: {
            problem: { select: { title: true, points: true } },
          },
          orderBy: { submittedAt: "desc" },
        },
        exam: {
          select: { title: true, duration: true },
        },
      },
    });

    if (!attempt) {
      return NextResponse.json(
        { error: "No attempt found" },
        { status: 404 }
      );
    }

    // Get best submission per problem
    const bestByProblem: Record<string, typeof attempt.submissions[0]> = {};
    for (const s of attempt.submissions) {
      if (!bestByProblem[s.problemId] || s.score > bestByProblem[s.problemId].score) {
        bestByProblem[s.problemId] = s;
      }
    }

    return NextResponse.json({
      attempt: {
        id: attempt.id,
        examTitle: attempt.exam.title,
        examDuration: attempt.exam.duration,
        totalScore: attempt.totalScore,
        maxScore: attempt.maxScore,
        startedAt: attempt.startedAt.toISOString(),
        deadline: attempt.deadline.toISOString(),
        completedAt: attempt.completedAt?.toISOString() || null,
        terminatedByProctor: attempt.terminatedByProctor,
        violations: attempt.violations,
      },
      bestSubmissions: Object.values(bestByProblem).map((s) => ({
        problemId: s.problemId,
        problemTitle: s.problem.title,
        problemPoints: s.problem.points,
        verdict: s.verdict,
        score: s.score,
        passedTests: s.passedTests,
        totalTests: s.totalTests,
        language: s.language,
      })),
    });
  } catch (err) {
    const { status, message } = authError(err);
    return NextResponse.json({ error: message }, { status });
  }
}
