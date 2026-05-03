import { NextRequest, NextResponse } from "next/server";

const GROQ_API_KEY = process.env.GROQ_API_KEY || "";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, language } = body;

    if (!code || !language) {
      return NextResponse.json(
        { error: "Missing required fields: code, language" },
        { status: 400 }
      );
    }

    if (!GROQ_API_KEY) {
      // Fallback mock flowchart when no API key
      return NextResponse.json({
        flowchart: {
          nodes: [
            { id: "1", label: "Start", type: "start" },
            { id: "2", label: "Read input", type: "io" },
            { id: "3", label: "Process data", type: "process" },
            { id: "4", label: "Check condition", type: "decision" },
            { id: "5", label: "Output result", type: "io" },
            { id: "6", label: "End", type: "end" },
          ],
          edges: [
            { from: "1", to: "2" },
            { from: "2", to: "3" },
            { from: "3", to: "4" },
            { from: "4", to: "5", label: "Yes" },
            { from: "4", to: "3", label: "No" },
            { from: "5", to: "6" },
          ],
        },
      });
    }

    const systemPrompt = `You are an expert code analyst and flowchart designer. Your job is to analyze source code and generate a precise flowchart that represents the code's logic and control flow.

RULES:
1. Analyze the code carefully — identify functions, loops, conditionals, I/O operations, and key process steps.
2. Generate a flowchart with nodes and edges that accurately represent the code's execution flow.
3. Each node must have: "id" (string, unique number starting from "1"), "label" (string, max 35 characters, concise description), and "type" (one of: "start", "end", "process", "decision", "io").
4. Node type guidelines:
   - "start": Always the first node with label "Start"
   - "end": Always the last node with label "End"
   - "process": For assignments, function calls, computations, data manipulation
   - "decision": For if/else conditions, while/for loop conditions, switch cases
   - "io": For input reading, output printing, return statements, API calls
5. Each edge must have: "from" (string, source node id), "to" (string, target node id), and optional "label" (string, for decision branches like "Yes"/"No"/"True"/"False").
6. Create between 5-10 nodes (including Start and End) for clarity.
7. For loops, create a decision node for the loop condition with "Yes" going into the loop body and "No" going to the next step after the loop.
8. For conditionals, create a decision node with branches labeled "Yes" and "No" or "True" and "False".
9. Return ONLY a raw JSON object with this exact structure, no other text:

{"nodes": [...], "edges": [...]}`;

    const userMessage = `Analyze the following ${language} code and generate a flowchart representing its logic. Return ONLY the JSON.

Code:
${code}`;

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage },
        ],
        temperature: 0.2,
        max_tokens: 4096,
      }),
    });

    const data = await res.json();
    let content: string =
      data.choices?.[0]?.message?.content || "";

    // Strip markdown code fences
    const codeFenceMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (codeFenceMatch) {
      content = codeFenceMatch[1].trim();
    }

    let flowchart;
    try {
      flowchart = JSON.parse(content);
    } catch {
      return NextResponse.json(
        { error: "Failed to parse AI response. Please try again." },
        { status: 500 }
      );
    }

    // Validate the structure
    if (!flowchart.nodes || !flowchart.edges || !Array.isArray(flowchart.nodes) || !Array.isArray(flowchart.edges)) {
      return NextResponse.json(
        { error: "Invalid flowchart structure from AI. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ flowchart });
  } catch {
    return NextResponse.json(
      { error: "Failed to generate flowchart. Please try again." },
      { status: 500 }
    );
  }
}
