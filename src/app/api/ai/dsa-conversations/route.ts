import { NextRequest, NextResponse } from "next/server";
import { requireAuth, authError } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    let user;
    try {
      user = await requireAuth();
    } catch {
      return NextResponse.json({ conversations: [] }, { status: 200 });
    }

    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get("id");

    if (conversationId) {
      // Return specific conversation with all messages
      const conversation = await prisma.dSAConversation.findFirst({
        where: { id: conversationId, userId: user.id },
        include: {
          messages: {
            orderBy: { createdAt: "asc" },
            select: {
              id: true,
              role: true,
              content: true,
              createdAt: true,
            },
          },
        },
      });

      if (!conversation) {
        return NextResponse.json(
          { error: "Conversation not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        conversation: {
          id: conversation.id,
          title: conversation.title,
          messages: conversation.messages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        },
      });
    }

    // Return conversation list
    const conversations = await prisma.dSAConversation.findMany({
      where: { userId: user.id },
      orderBy: { updatedAt: "desc" },
      take: 50,
      select: {
        id: true,
        title: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ conversations: conversations || [] }, { status: 200 });
  } catch (err) {
    console.error("DSA conversations GET error:", err);
    return NextResponse.json({ conversations: [] }, { status: 200 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await requireAuth();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Conversation ID required" },
        { status: 400 }
      );
    }

    const conversation = await prisma.dSAConversation.findFirst({
      where: { id, userId: user.id },
    });

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }

    await prisma.dSAConversation.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    const { status, message } = authError(err);
    return NextResponse.json({ error: message }, { status });
  }
}
