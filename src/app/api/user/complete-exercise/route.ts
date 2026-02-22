import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { exerciseId, xpReward, courseId, code } = await request.json();
    if (!exerciseId) {
      return NextResponse.json({ error: "exerciseId required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { clerkId: userId } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Create completed exercise record
    await prisma.completedExercise.upsert({
      where: {
        userId_exerciseId: { userId: user.id, exerciseId },
      },
      update: {},
      create: {
        userId: user.id,
        exerciseId,
        courseId: courseId || "",
        xpEarned: xpReward || 0,
        code: code || null,
      },
    });

    // Update user XP and streak
    await prisma.user.update({
      where: { id: user.id },
      data: {
        xp: { increment: xpReward || 0 },
        streak: { increment: 1 },
        lastActive: new Date(),
      },
    });

    // Update daily activity
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    await prisma.dailyActivity.upsert({
      where: {
        userId_date: { userId: user.id, date: today },
      },
      update: {
        exercisesCompleted: { increment: 1 },
        xpEarned: { increment: xpReward || 0 },
        minutesActive: { increment: 5 },
      },
      create: {
        userId: user.id,
        date: today,
        exercisesCompleted: 1,
        xpEarned: xpReward || 0,
        minutesActive: 5,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Complete exercise error:", error);
    return NextResponse.json({ error: "Failed to complete" }, { status: 500 });
  }
}
