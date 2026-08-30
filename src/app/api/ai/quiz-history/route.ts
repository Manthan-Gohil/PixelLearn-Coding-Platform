import { NextResponse } from "next/server";
import { requireAuth, authError } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const user = await requireAuth();

    const attempts = await prisma.quizAttempt.findMany({
      where: { userId: user.id },
      include: {
        quiz: {
          select: {
            title: true,
            topic: true,
            difficulty: true,
            questionCount: true,
          },
        },
      },
      orderBy: { completedAt: "desc" },
      take: 50,
    });

    return NextResponse.json({ attempts });
  } catch (err) {
    const { status, message } = authError(err);
    return NextResponse.json({ error: message }, { status });
  }
}
