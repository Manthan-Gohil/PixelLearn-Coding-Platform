import { NextRequest, NextResponse } from "next/server";

const GROQ_API_KEY = process.env.GROQ_API_KEY || "";

const LANGUAGE_NAMES: Record<string, string> = {
  javascript: "JavaScript",
  typescript: "TypeScript",
  python: "Python",
  java: "Java",
  cpp: "C++",
  c: "C",
  csharp: "C#",
  go: "Go",
  rust: "Rust",
  ruby: "Ruby",
  php: "PHP",
  swift: "Swift",
  kotlin: "Kotlin",
  dart: "Dart",
  scala: "Scala",
  r: "R",
  perl: "Perl",
  lua: "Lua",
  html: "HTML",
  css: "CSS",
  sql: "SQL",
  bash: "Bash/Shell",
  reactjs: "React (JavaScript)",
};

function getLanguageLabel(lang: string): string {
  return LANGUAGE_NAMES[lang.toLowerCase()] || lang;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, sourceLanguage, targetLanguage } = body;

    if (!code || !sourceLanguage || !targetLanguage) {
      return NextResponse.json(
        { error: "Missing required fields: code, sourceLanguage, targetLanguage" },
        { status: 400 }
      );
    }

    const srcLabel = getLanguageLabel(sourceLanguage);
    const tgtLabel = getLanguageLabel(targetLanguage);

    const systemPrompt = `You are an expert programming language translator. Your job is to convert code from one programming language to another while preserving the exact same logic, functionality, and output.

CRITICAL RULES:
- Convert the code accurately. The converted code must produce the same output as the original.
- Use idiomatic patterns and best practices for the target language.
- Include necessary imports/headers for the target language.
- Add brief inline comments only where the target language syntax differs significantly.
- Return ONLY the converted code. No explanations, no markdown fences, no additional text before or after.
- If the source code has comments, translate them too.
- If the conversion is not possible (e.g., converting CSS to Python makes no sense), return a comment in the target language explaining why.`;

    const userMessage = `Convert the following ${srcLabel} code to ${tgtLabel}. Return ONLY the converted code, nothing else.

Source code (${srcLabel}):
${code}`;

    if (!GROQ_API_KEY) {
      // Fallback mock response when no API key
      const mockConverted = `// Converted from ${srcLabel} to ${tgtLabel}\n// Note: Groq API key not configured. This is a placeholder.\n\n${code}`;
      return NextResponse.json({ convertedCode: mockConverted });
    }

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
        temperature: 0.3,
        max_tokens: 4096,
      }),
    });

    const data = await res.json();
    let content: string =
      data.choices?.[0]?.message?.content || "// Conversion failed. No response from AI.";

    // Strip markdown code fences that LLMs often wrap code in
    const codeFenceMatch = content.match(/```(?:\w+)?\s*([\s\S]*?)```/);
    if (codeFenceMatch) {
      content = codeFenceMatch[1].trim();
    }

    return NextResponse.json({ convertedCode: content });
  } catch {
    return NextResponse.json(
      { error: "Failed to convert code. Please try again." },
      { status: 500 }
    );
  }
}
