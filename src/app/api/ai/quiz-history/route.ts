import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    let user;
    try {
      user = await requireAuth();
    } catch {
      // If user is guest or not authenticated, return empty list gracefully
      return NextResponse.json({ attempts: [] }, { status: 200 });
    }

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

    return NextResponse.json({ attempts: attempts || [] }, { status: 200 });
  } catch (err) {
    console.error("Quiz history error:", err);
    return NextResponse.json({ attempts: [] }, { status: 200 });
  }
}
