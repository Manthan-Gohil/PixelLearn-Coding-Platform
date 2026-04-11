import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

function serializeUser(user: {
  id: string;
  clerkId: string;
  email: string;
  name: string;
  avatar: string | null;
  subscription: string;
  xp: number;
  streak: number;
  referralCode: string;
  referralCount: number;
  createdAt: Date;
  lastActive: Date;
  lastStreakDate?: Date | null;
  lastDailyBonusDate?: Date | null;
  enrollments: { courseId: string }[];
  completedExercises: { exerciseId: string }[];
  badges: { badgeId: string; unlockedAt: Date }[];
}) {
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

export async function POST(request: NextRequest) {
  try {
    const { userId: authenticatedClerkId } = await auth();
    if (!authenticatedClerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { clerkId, email, name, avatar } = body;

    if (!clerkId || !email) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Ensure the authenticated session matches the user being synced
    if (clerkId !== authenticatedClerkId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Upsert user - create if not exists, update if exists
    const user = await prisma.user.upsert({
      where: { clerkId },
      update: {
        email,
        name,
        avatar: avatar || null,
        lastActive: new Date(),
      },
      create: {
        clerkId,
        email,
        name,
        avatar: avatar || null,
      },
      include: {
        enrollments: true,
        completedExercises: true,
        badges: true,
      },
    });

    return NextResponse.json(serializeUser(user));
  } catch (error) {
    console.error("User sync error:", error);
    return NextResponse.json({ error: "Failed to sync user" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: {
        enrollments: true,
        completedExercises: true,
        badges: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(serializeUser(user));
  } catch (error) {
    console.error("Get user error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
