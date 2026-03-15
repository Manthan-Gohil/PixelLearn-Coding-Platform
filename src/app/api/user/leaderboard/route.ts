import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

const LEADERBOARD_LIMIT = 10;

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const currentUser = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: {
        id: true,
        name: true,
        avatar: true,
        xp: true,
        streak: true,
      },
    });

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const topUsers = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        avatar: true,
        xp: true,
        streak: true,
      },
      orderBy: [{ xp: "desc" }, { createdAt: "asc" }],
      take: LEADERBOARD_LIMIT,
    });

    const usersAhead = await prisma.user.count({
      where: {
        xp: { gt: currentUser.xp },
      },
    });

    const topUsersWithRank = topUsers.map((user, index) => ({
      ...user,
      rank: index + 1,
    }));

    return NextResponse.json({
      topUsers: topUsersWithRank,
      currentUser: {
        ...currentUser,
        rank: usersAhead + 1,
      },
    });
  } catch (error) {
    console.error("Leaderboard error:", error);
    return NextResponse.json(
      { error: "Failed to fetch leaderboard" },
      { status: 500 },
    );
  }
}
