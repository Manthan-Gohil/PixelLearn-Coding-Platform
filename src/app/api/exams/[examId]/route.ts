import { NextRequest, NextResponse } from "next/server";
import { requireAuth, requireAdmin, authError } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET /api/exams/[examId]
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ examId: string }> }
) {
  try {
    const { examId } = await params;
    let user;
    try {
      user = await requireAuth();
    } catch {
      user = null;
    }

    const isAdmin = user?.isAdmin === true;

    const exam = await prisma.exam.findUnique({
      where: { id: examId },
      include: {
        problems: {
          include: {
            testCases: isAdmin
              ? true
              : { where: { isSample: true } },
            _count: { select: { testCases: true } },
          },
          orderBy: { order: "asc" },
        },
      },
    });

    if (!exam) {
      return NextResponse.json({ error: "Exam not found" }, { status: 404 });
    }

    if (!exam.isPublished && !isAdmin) {
      return NextResponse.json({ error: "Exam not found" }, { status: 404 });
    }

    // Get user's attempt if exists
    let attempt = null;
    if (user) {
      attempt = await prisma.examAttempt.findUnique({
        where: { examId_userId: { examId, userId: user.id } },
        include: {
          submissions: {
            orderBy: { submittedAt: "desc" },
          },
        },
      });
    }

    return NextResponse.json({
      exam: {
        ...exam,
        createdAt: exam.createdAt.toISOString(),
        updatedAt: exam.updatedAt.toISOString(),
      },
      attempt: attempt
        ? {
            ...attempt,
            startedAt: attempt.startedAt.toISOString(),
            deadline: attempt.deadline.toISOString(),
            completedAt: attempt.completedAt?.toISOString() || null,
          }
        : null,
    });
  } catch (err) {
    const { status, message } = authError(err);
    return NextResponse.json({ error: message }, { status });
  }
}

// PATCH /api/exams/[examId] — update exam (admin only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ examId: string }> }
) {
  try {
    await requireAdmin();
    const { examId } = await params;
    const body = await request.json();

    const exam = await prisma.exam.update({
      where: { id: examId },
      data: {
        ...(body.title !== undefined && { title: body.title }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.duration !== undefined && { duration: parseInt(body.duration) }),
        ...(body.isPublished !== undefined && { isPublished: body.isPublished }),
      },
    });

    return NextResponse.json({ exam });
  } catch (err) {
    const { status, message } = authError(err);
    return NextResponse.json({ error: message }, { status });
  }
}

// DELETE /api/exams/[examId] — delete exam (admin only)
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ examId: string }> }
) {
  try {
    await requireAdmin();
    const { examId } = await params;

    await prisma.exam.delete({ where: { id: examId } });

    return NextResponse.json({ success: true });
  } catch (err) {
    const { status, message } = authError(err);
    return NextResponse.json({ error: message }, { status });
  }
}
