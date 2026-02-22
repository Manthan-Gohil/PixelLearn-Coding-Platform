import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { clerkId, email, name, avatar } = body;

    if (!clerkId || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
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

    return NextResponse.json({
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
      enrolledCourses: user.enrollments.map((e) => e.courseId),
      completedExercises: user.completedExercises.map((e) => e.exerciseId),
      badges: user.badges.map((b) => ({
        id: b.badgeId,
        unlockedAt: b.unlockedAt.toISOString(),
      })),
    });
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

    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      subscription: user.subscription,
      xp: user.xp,
      streak: user.streak,
      referralCode: user.referralCode,
      referralCount: user.referralCount,
      enrolledCourses: user.enrollments.map((e) => e.courseId),
      completedExercises: user.completedExercises.map((e) => e.exerciseId),
      badges: user.badges,
    });
  } catch (error) {
    console.error("Get user error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
