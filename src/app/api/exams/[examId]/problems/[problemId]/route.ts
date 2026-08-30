import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, authError } from "@/lib/auth";
import prisma from "@/lib/prisma";

// PATCH /api/exams/[examId]/problems/[problemId]
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ examId: string; problemId: string }> }
) {
  try {
    await requireAdmin();
    const { problemId } = await params;
    const body = await request.json();

    const problem = await prisma.examProblem.update({
      where: { id: problemId },
      data: {
        ...(body.title !== undefined && { title: body.title }),
        ...(body.statement !== undefined && { statement: body.statement }),
        ...(body.constraints !== undefined && { constraints: body.constraints }),
        ...(body.inputFormat !== undefined && { inputFormat: body.inputFormat }),
        ...(body.outputFormat !== undefined && { outputFormat: body.outputFormat }),
        ...(body.examples !== undefined && { examples: body.examples }),
        ...(body.difficulty !== undefined && { difficulty: body.difficulty }),
        ...(body.points !== undefined && { points: body.points }),
        ...(body.timeLimit !== undefined && { timeLimit: body.timeLimit }),
        ...(body.memoryLimit !== undefined && { memoryLimit: body.memoryLimit }),
        ...(body.supportedLangs !== undefined && { supportedLangs: body.supportedLangs }),
        ...(body.order !== undefined && { order: body.order }),
      },
    });

    return NextResponse.json({ problem });
  } catch (err) {
    const { status, message } = authError(err);
    return NextResponse.json({ error: message }, { status });
  }
}

// DELETE /api/exams/[examId]/problems/[problemId]
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ examId: string; problemId: string }> }
) {
  try {
    await requireAdmin();
    const { problemId } = await params;

    await prisma.examProblem.delete({ where: { id: problemId } });

    return NextResponse.json({ success: true });
  } catch (err) {
    const { status, message } = authError(err);
    return NextResponse.json({ error: message }, { status });
  }
}
