import { NextRequest, NextResponse } from "next/server";
import { requireAuth, authError } from "@/lib/auth";
import prisma from "@/lib/prisma";

const GROQ_API_KEY = process.env.GROQ_API_KEY || "";

const DSA_SYSTEM_PROMPT = `You are **PixelLearn DSA Notes Generator** — a specialized AI assistant that produces detailed, interview-revision-friendly notes for Data Structures & Algorithms problems.

You accept:
- LeetCode problems / coding problems
- Algorithm names (e.g., "Dijkstra's algorithm")
- C++/Python/Java/JavaScript code
- User's attempted solutions
- DSA questions / topics

────────────────────────────────────────────
OUTPUT STRUCTURE (use these exact headings)
────────────────────────────────────────────

# 📌 1. Problem Title
# 🔗 2. LeetCode Question (link if known, or "Custom Problem")
# 📝 3. Problem Statement
# 📎 4. Example (Input / Output / Explanation)
# 💡 5. Intuition — WHY this approach works, in plain language
# 🔑 6. Key Observation — the critical insight
# 🧠 7. Algorithm Idea — step-by-step idea before code
# ✅ 8. Optimized Approach — the user's code IS the primary solution (do NOT rewrite unless incorrect)
# 🔄 9. Dry Run — walk through at least one example step by step
# 📊 10. Visualization — ASCII/table representation where helpful
# ❓ 11. Why This Works? — Correctness argument
# ⏱️ 12. Complexity — Time AND Space, with justification
# 🔀 13. Alternative Approach — industry-standard if different from user's
# 🐢 14. Brute Force Approach — always include for comparison

────────────────────────────────────────────
BEHAVIORAL RULES
────────────────────────────────────────────
- **Beginner-friendly but interview-focused.** Explain WHY, not only HOW.
- **Always include a dry run.** Walk through an example.
- **Always include complexity analysis** for every approach.
- If the user provides code, use it AS-IS as the Optimized Approach. Don't rewrite unless it's wrong.
- Explain helper functions separately.
- If multiple approaches exist in the user's code, explain all of them.
- If a better approach exists, include it under "Alternative Approach" — don't replace the user's.
- Mention known patterns: Sliding Window, Two Pointer, Binary Search, DP, Greedy, Graph, Heap, Trie, Backtracking, etc.
- Handle Linked Lists, Stacks, Binary Search, DP, and Matrix problems with appropriate visual/explanatory treatment.
- If only a problem name is given (no code), explain brute force → better → optimal approaches.
- Output should be **clean Markdown** suitable for Notion.
- Use code blocks with language tags (\`\`\`cpp, \`\`\`python, etc.).
- Keep explanations concise but thorough.

If the user asks a follow-up or general DSA question (not a new problem), answer it conversationally while maintaining context from previous messages.`;

async function callGroqAPI(messages: { role: string; content: string }[]) {
  if (!GROQ_API_KEY) {
    return "## DSA Notes\n\n> **Note:** AI API key not configured. This is a placeholder response.\n\nPlease configure the GROQ_API_KEY to get real DSA notes.";
  }

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "openai/gpt-oss-20b",
      messages,
      temperature: 0.6,
      max_tokens: 8192,
    }),
  });

  if (!res.ok) {
    throw new Error(`Groq API returned status ${res.status}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content || "No response generated.";
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await request.json();
    const { message, conversationId } = body;

    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    let conversation;
    let history: { role: string; content: string }[] = [];

    if (conversationId) {
      // Load existing conversation
      conversation = await prisma.dSAConversation.findFirst({
        where: { id: conversationId, userId: user.id },
        include: {
          messages: {
            orderBy: { createdAt: "asc" },
            take: 20, // Limit context window
          },
        },
      });

      if (!conversation) {
        return NextResponse.json(
          { error: "Conversation not found" },
          { status: 404 }
        );
      }

      // Build history from existing messages
      history = conversation.messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));
    } else {
      // Create new conversation with auto-generated title
      const title =
        message.length > 60 ? message.substring(0, 60) + "..." : message;
      conversation = await prisma.dSAConversation.create({
        data: {
          userId: user.id,
          title,
        },
      });
    }

    // Save user message
    await prisma.dSAMessage.create({
      data: {
        conversationId: conversation.id,
        role: "user",
        content: message,
      },
    });

    // Build messages for API call
    const messages = [
      { role: "system", content: DSA_SYSTEM_PROMPT },
      ...history,
      { role: "user", content: message },
    ];

    const response = await callGroqAPI(messages);

    // Save assistant response
    await prisma.dSAMessage.create({
      data: {
        conversationId: conversation.id,
        role: "assistant",
        content: response,
      },
    });

    // Update conversation timestamp
    await prisma.dSAConversation.update({
      where: { id: conversation.id },
      data: { updatedAt: new Date() },
    });

    return NextResponse.json({
      conversationId: conversation.id,
      response,
    });
  } catch (err) {
    const { status, message } = authError(err);
    return NextResponse.json({ error: message }, { status });
  }
}
