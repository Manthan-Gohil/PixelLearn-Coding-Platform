import { NextRequest, NextResponse } from "next/server";
import { requireAuth, authError } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET /api/exams/[examId]/results — get results
// Returns candidate's own attempt & best submissions, plus if admin, all candidates' attempts
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ examId: string }> }
) {
  try {
    const user = await requireAuth();
    const { examId } = await params;

    // 1. Fetch user's own attempt (if attempted)
    const ownAttempt = await prisma.examAttempt.findUnique({
      where: { examId_userId: { examId, userId: user.id } },
      include: {
        submissions: {
          include: {
            problem: { select: { id: true, title: true, points: true, difficulty: true } },
          },
          orderBy: { submittedAt: "desc" },
        },
        exam: {
          select: { title: true, duration: true },
        },
      },
    });

    let formattedOwnAttempt = null;
    let bestSubmissions: Array<{
      problemId: string;
      problemTitle: string;
      problemPoints: number;
      verdict: string;
      score: number;
      passedTests: number;
      totalTests: number;
      language: string;
    }> = [];

    if (ownAttempt) {
      const bestByProblem: Record<string, typeof ownAttempt.submissions[0]> = {};
      for (const s of ownAttempt.submissions) {
        if (!bestByProblem[s.problemId] || s.score > bestByProblem[s.problemId].score) {
          bestByProblem[s.problemId] = s;
        }
      }

      formattedOwnAttempt = {
        id: ownAttempt.id,
        examTitle: ownAttempt.exam.title,
        examDuration: ownAttempt.exam.duration,
        totalScore: ownAttempt.totalScore,
        maxScore: ownAttempt.maxScore,
        startedAt: ownAttempt.startedAt.toISOString(),
        deadline: ownAttempt.deadline.toISOString(),
        completedAt: ownAttempt.completedAt?.toISOString() || null,
        terminatedByProctor: ownAttempt.terminatedByProctor,
        violations: ownAttempt.violations,
      };

      bestSubmissions = Object.values(bestByProblem).map((s) => ({
        problemId: s.problemId,
        problemTitle: s.problem.title,
        problemPoints: s.problem.points,
        verdict: s.verdict,
        score: s.score,
        passedTests: s.passedTests,
        totalTests: s.totalTests,
        language: s.language,
      }));
    }

    // 2. If Admin, also fetch ALL candidates' attempts with submissions & user details
    let allAttempts: Array<unknown> = [];
    if (user.isAdmin) {
      const attempts = await prisma.examAttempt.findMany({
        where: { examId },
        include: {
          user: {
            select: { id: true, name: true, email: true, avatar: true },
          },
          submissions: {
            include: {
              problem: { select: { id: true, title: true, points: true, difficulty: true } },
            },
            orderBy: { submittedAt: "desc" },
          },
        },
        orderBy: { totalScore: "desc" },
      });

      allAttempts = attempts.map((a) => ({
        ...a,
        startedAt: a.startedAt.toISOString(),
        deadline: a.deadline.toISOString(),
        completedAt: a.completedAt?.toISOString() || null,
        submissions: a.submissions.map((s) => ({
          ...s,
          submittedAt: s.submittedAt.toISOString(),
        })),
      }));
    }

    // Return unified payload
    return NextResponse.json({
      attempt: formattedOwnAttempt,
      bestSubmissions,
      attempts: user.isAdmin ? allAttempts : undefined,
    });
  } catch (err) {
    const { status, message } = authError(err);
    return NextResponse.json({ error: message }, { status });
  }
}
