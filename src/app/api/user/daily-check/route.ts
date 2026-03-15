import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

const DAILY_BONUS_XP = 25;

function startOfUtcDay(date: Date) {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
  );
}

function getDayDiff(fromDate: Date, toDate: Date) {
  const from = startOfUtcDay(fromDate).getTime();
  const to = startOfUtcDay(toDate).getTime();
  return Math.floor((to - from) / (1000 * 60 * 60 * 24));
}

function serializeUser(
  user: {
    id: string;
    clerkId: string;
    email: string;
    name: string;
    avatar: string | null;
    subscription: "free" | "pro";
    xp: number;
    streak: number;
    referralCode: string;
    referralCount: number;
    createdAt: Date;
    lastActive: Date;
    enrollments: { courseId: string }[];
    completedExercises: { exerciseId: string }[];
    badges: { badgeId: string; unlockedAt: Date }[];
  } & {
    lastStreakDate?: Date | null;
    lastDailyBonusDate?: Date | null;
  },
) {
  return {
    id: user.id,
    clerkId: user.clerkId,
    email: user.email,
    name: user.name,
    avatar: user.avatar,
    subscription: user.subscription,
    xp: user.xp,
    streak: user.streak,
    referralCode: user.referralCode,
    referralCount: user.referralCount,
    createdAt: user.createdAt.toISOString(),
    lastActive: user.lastActive.toISOString(),
    lastStreakDate: user.lastStreakDate
      ? user.lastStreakDate.toISOString()
      : null,
    lastDailyBonusDate: user.lastDailyBonusDate
      ? user.lastDailyBonusDate.toISOString()
      : null,
    enrolledCourses: user.enrollments.map((e) => e.courseId),
    completedExercises: user.completedExercises.map((e) => e.exerciseId),
    badges: user.badges.map((b) => ({
      id: b.badgeId,
      unlockedAt: b.unlockedAt.toISOString(),
    })),
  };
}

async function getSerializedUserById(userId: string) {
  const user = (await prisma.user.findUnique({
    where: { id: userId },
    include: {
      enrollments: true,
      completedExercises: true,
      badges: true,
    },
  })) as {
    id: string;
    clerkId: string;
    email: string;
    name: string;
    avatar: string | null;
    subscription: "free" | "pro";
    xp: number;
    streak: number;
    referralCode: string;
    referralCount: number;
    createdAt: Date;
    lastActive: Date;
    enrollments: { courseId: string }[];
    completedExercises: { exerciseId: string }[];
    badges: { badgeId: string; unlockedAt: Date }[];
    lastStreakDate?: Date | null;
    lastDailyBonusDate?: Date | null;
  } | null;

  return user ? serializeUser(user) : null;
}

export async function POST() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const now = new Date();
    const today = startOfUtcDay(now);

    const user = (await prisma.user.findUnique({
      where: { clerkId: userId },
    })) as {
      id: string;
      xp: number;
      streak: number;
      lastStreakDate?: Date | null;
      lastDailyBonusDate?: Date | null;
    } | null;

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const lastStreakDate = user.lastStreakDate ?? null;
    const lastBonusDate = user.lastDailyBonusDate ?? null;

    let nextStreak = user.streak;
    if (!lastStreakDate) {
      nextStreak = Math.max(1, user.streak);
    } else {
      const streakDiff = getDayDiff(lastStreakDate, now);
      if (streakDiff > 1) {
        nextStreak = 1;
      } else if (streakDiff === 1) {
        nextStreak = user.streak + 1;
      }
    }

    let bonusAwarded = false;
    let bonusXp = 0;
    if (!lastBonusDate || getDayDiff(lastBonusDate, now) >= 1) {
      bonusAwarded = true;
      bonusXp = DAILY_BONUS_XP;
    }

    let mutationSucceeded = true;

    try {
      await prisma.$transaction(async (tx) => {
        await tx.user.update({
          where: { id: user.id },
          data: {
            streak: nextStreak,
            xp: bonusAwarded ? { increment: bonusXp } : undefined,
            lastStreakDate: today,
            lastDailyBonusDate: bonusAwarded ? today : undefined,
            lastActive: now,
          },
        });

        if (bonusAwarded) {
          await tx.dailyActivity.upsert({
            where: {
              userId_date: { userId: user.id, date: today },
            },
            update: {
              xpEarned: { increment: bonusXp },
            },
            create: {
              userId: user.id,
              date: today,
              xpEarned: bonusXp,
              exercisesCompleted: 0,
              minutesActive: 0,
            },
          });
        }
      });
    } catch (error) {
      mutationSucceeded = false;
      bonusAwarded = false;
      bonusXp = 0;
      console.error("Daily check transaction error:", error);
    }

    const serializedUser = await getSerializedUserById(user.id);

    if (!serializedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: mutationSucceeded,
      bonusAwarded,
      bonusXp,
      user: serializedUser,
    });
  } catch (error) {
    console.error("Daily check error:", error);
    return NextResponse.json({ error: "Failed daily check" }, { status: 500 });
  }
}
