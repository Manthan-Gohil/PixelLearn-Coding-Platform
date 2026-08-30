import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

/**
 * Authenticates the current request via Clerk and resolves the internal
 * database user record. Throws a structured error object on failure.
 */
export async function requireAuth() {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    throw { status: 401, message: "Unauthorized" };
  }

  const user = await prisma.user.findUnique({
    where: { clerkId },
  });

  if (!user) {
    throw { status: 404, message: "User not found" };
  }

  return user;
}

/**
 * Same as requireAuth but additionally verifies the user has admin privileges.
 */
export async function requireAdmin() {
  const user = await requireAuth();

  if (!user.isAdmin) {
    throw { status: 403, message: "Forbidden — admin access required" };
  }

  return user;
}

/**
 * Helper to create a JSON error response from auth/permission failures.
 */
export function authError(err: unknown) {
  if (
    typeof err === "object" &&
    err !== null &&
    "status" in err &&
    "message" in err
  ) {
    const { status, message } = err as { status: number; message: string };
    return { status, message };
  }
  return { status: 500, message: "Internal server error" };
}
