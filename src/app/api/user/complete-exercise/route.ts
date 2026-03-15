import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { BADGES } from "@/services/data";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { exerciseId, xpReward, courseId, code, newlyUnlockedBadgeIds } =
      await request.json();
    if (!exerciseId) {
      return NextResponse.json(
        { error: "exerciseId required" },
        { status: 400 },
      );
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
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        xp: { increment: xpReward || 0 },
        lastActive: new Date(),
      },
    });

    // Update daily activity — use UTC midnight to be consistent with daily-check
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
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

    const knownBadgeIds = new Set(BADGES.map((b) => b.id));
    const validBadgeIds: string[] = Array.isArray(newlyUnlockedBadgeIds)
      ? newlyUnlockedBadgeIds.filter(
          (id): id is string =>
            typeof id === "string" && id.length > 0 && knownBadgeIds.has(id),
        )
      : [];

    if (validBadgeIds.length > 0) {
      await Promise.all(
        validBadgeIds
          .filter(
            (badgeId): badgeId is string =>
              typeof badgeId === "string" && badgeId.length > 0,
          )
          .map((badgeId) =>
            prisma.userBadge.upsert({
              where: {
                userId_badgeId: {
                  userId: user.id,
                  badgeId,
                },
              },
              update: {},
              create: {
                userId: user.id,
                badgeId,
              },
            }),
          ),
      );
    }

    return NextResponse.json({
      success: true,
      xp: updatedUser.xp,
      streak: updatedUser.streak,
      lastActive: updatedUser.lastActive.toISOString(),
    });
  } catch (error) {
    console.error("Complete exercise error:", error);
    return NextResponse.json({ error: "Failed to complete" }, { status: 500 });
  }
}
