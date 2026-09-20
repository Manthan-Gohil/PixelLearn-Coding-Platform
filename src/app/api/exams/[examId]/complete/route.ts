import { NextRequest, NextResponse } from "next/server";
import { requireAuth, authError } from "@/lib/auth";
import prisma from "@/lib/prisma";

// POST /api/exams/[examId]/complete — finalize exam attempt
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ examId: string }> }
) {
  try {
    const user = await requireAuth();
    const { examId } = await params;
    const body = await request.json().catch(() => ({}));
    const { terminatedByProctor = false, violations = [], cognitiveTelemetry = {} } = body;

    const attempt = await prisma.examAttempt.findUnique({
      where: { examId_userId: { examId, userId: user.id } },
    });

    if (!attempt) {
      return NextResponse.json(
        { error: "No exam attempt found" },
        { status: 404 }
      );
    }

    if (attempt.completedAt) {
      return NextResponse.json(
        { error: "Exam already completed" },
        { status: 409 }
      );
    }

    // Merge any new violations and cognitive telemetry with existing
    const existingViolations = (attempt.violations as Array<unknown>) || [];
    const allViolations = [...existingViolations, ...violations];

    if (cognitiveTelemetry && Object.keys(cognitiveTelemetry).length > 0) {
      allViolations.push({
        type: "cognitive_telemetry",
        timestamp: new Date().toISOString(),
        stats: cognitiveTelemetry,
      });
    }

    const updated = await prisma.examAttempt.update({
      where: { id: attempt.id },
      data: {
        completedAt: new Date(),
        terminatedByProctor,
        violations: allViolations.length > 0 ? allViolations : undefined,
      },
    });

    return NextResponse.json({
      success: true,
      attempt: {
        id: updated.id,
        totalScore: updated.totalScore,
        maxScore: updated.maxScore,
        completedAt: updated.completedAt?.toISOString(),
        terminatedByProctor: updated.terminatedByProctor,
      },
    });
  } catch (err) {
    const { status, message } = authError(err);
    return NextResponse.json({ error: message }, { status });
  }
}
