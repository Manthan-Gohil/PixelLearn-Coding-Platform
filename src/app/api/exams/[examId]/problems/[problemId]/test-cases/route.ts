import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, authError } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET — list test cases for a problem (admin only shows all; users see only sample via exam route)
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ examId: string; problemId: string }> }
) {
  try {
    await requireAdmin();
    const { problemId } = await params;

    const testCases = await prisma.examTestCase.findMany({
      where: { problemId },
      orderBy: { id: "asc" },
    });

    return NextResponse.json({ testCases });
  } catch (err) {
    const { status, message } = authError(err);
    return NextResponse.json({ error: message }, { status });
  }
}

// POST — add test case (admin only)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ examId: string; problemId: string }> }
) {
  try {
    await requireAdmin();
    const { problemId } = await params;
    const body = await request.json();

    const testCase = await prisma.examTestCase.create({
      data: {
        problemId,
        input: body.input || "",
        output: body.output || "",
        isSample: body.isSample || false,
      },
    });

    return NextResponse.json({ testCase });
  } catch (err) {
    const { status, message } = authError(err);
    return NextResponse.json({ error: message }, { status });
  }
}

// DELETE — delete test case (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ examId: string; problemId: string }> }
) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(request.url);
    const testCaseId = searchParams.get("id");

    if (!testCaseId) {
      return NextResponse.json(
        { error: "Test case ID required" },
        { status: 400 }
      );
    }

    await prisma.examTestCase.delete({ where: { id: testCaseId } });

    return NextResponse.json({ success: true });
  } catch (err) {
    const { status, message } = authError(err);
    return NextResponse.json({ error: message }, { status });
  }
}
