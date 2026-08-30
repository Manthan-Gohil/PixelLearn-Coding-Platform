import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

// POST /api/user/toggle-admin — toggle or set admin status for current authenticated user
export async function POST(request: NextRequest) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let targetState: boolean | undefined = undefined;
    try {
      const body = await request.json();
      if (typeof body.isAdmin === "boolean") {
        targetState = body.isAdmin;
      }
    } catch {
      // Body might be empty, so toggle current state
    }

    const currentUser = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const newAdminStatus = targetState !== undefined ? targetState : !currentUser.isAdmin;

    const updatedUser = await prisma.user.update({
      where: { clerkId },
      data: { isAdmin: newAdminStatus },
    });

    return NextResponse.json({
      success: true,
      isAdmin: updatedUser.isAdmin,
      message: updatedUser.isAdmin
        ? "Admin privileges granted successfully."
        : "Admin privileges revoked.",
    });
  } catch (error) {
    console.error("Toggle admin error:", error);
    return NextResponse.json({ error: "Failed to update admin role" }, { status: 500 });
  }
}
