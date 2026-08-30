import { NextRequest, NextResponse } from "next/server";
import { requireAuth, requireAdmin, authError } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET /api/exams — list exams
export async function GET() {
  try {
    let user;
    try {
      user = await requireAuth();
    } catch {
      user = null;
    }

    const isAdmin = user?.isAdmin === true;

    const exams = await prisma.exam.findMany({
      where: isAdmin ? {} : { isPublished: true },
      include: {
        problems: {
          select: { id: true, title: true, difficulty: true, points: true },
          orderBy: { order: "asc" },
        },
        _count: { select: { attempts: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    // If user, include their attempt status
    let attemptMap: Record<string, { completedAt: string | null; totalScore: number }> = {};
    if (user) {
      const attempts = await prisma.examAttempt.findMany({
        where: { userId: user.id },
        select: { examId: true, completedAt: true, totalScore: true },
      });
      for (const a of attempts) {
        attemptMap[a.examId] = {
          completedAt: a.completedAt?.toISOString() || null,
          totalScore: a.totalScore,
        };
      }
    }

    const result = exams.map((exam) => ({
      id: exam.id,
      title: exam.title,
      description: exam.description,
      duration: exam.duration,
      isPublished: exam.isPublished,
      problemCount: exam.problems.length,
      totalPoints: exam.problems.reduce((sum, p) => sum + p.points, 0),
      participantCount: exam._count.attempts,
      problems: isAdmin ? exam.problems : undefined,
      createdAt: exam.createdAt.toISOString(),
      userAttempt: attemptMap[exam.id] || null,
    }));

    return NextResponse.json({ exams: result });
  } catch (err) {
    const { status, message } = authError(err);
    return NextResponse.json({ error: message }, { status });
  }
}

// POST /api/exams — create exam (admin only)
export async function POST(request: NextRequest) {
  try {
    await requireAdmin();

    const body = await request.json();
    const { title, description, duration } = body;

    if (!title || !description || !duration) {
      return NextResponse.json(
        { error: "Title, description, and duration are required" },
        { status: 400 }
      );
    }

    const exam = await prisma.exam.create({
      data: {
        title,
        description,
        duration: parseInt(duration),
        isPublished: true,
      },
    });

    return NextResponse.json({ exam });
  } catch (err) {
    const { status, message } = authError(err);
    return NextResponse.json({ error: message }, { status });
  }
}
