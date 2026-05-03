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

async function callGroq(messages: { role: string; content: string }[], temperature = 0.3) {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages,
      temperature,
      max_tokens: 4096,
    }),
  });

  const data = await res.json();
  let content: string =
    data.choices?.[0]?.message?.content || "";

  // Strip markdown code fences
  const codeFenceMatch = content.match(/```(?:\w+)?\s*([\s\S]*?)```/);
  if (codeFenceMatch) {
    content = codeFenceMatch[1].trim();
  }

  return content;
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

    if (!GROQ_API_KEY) {
      // Fallback mock response when no API key
      const mockConverted = `// Converted from ${srcLabel} to ${tgtLabel}\n// Note: Groq API key not configured. This is a placeholder.\n\n${code}`;
      return NextResponse.json({ compatible: true, convertedCode: mockConverted });
    }

    // =========================================================
    // STEP 1: Compatibility Check
    // =========================================================
    const compatibilitySystemPrompt = `You are a programming language expert. Your job is to determine whether a piece of source code can be meaningfully and correctly converted from one language to another.

RULES FOR INCOMPATIBILITY — return compatible: false if ANY of these apply:
1. The source code relies on libraries, frameworks, or ecosystems that have NO equivalent in the target language (e.g., Python matplotlib/seaborn/pandas visualization → C/C++, Python numpy heavy computation → HTML/CSS).
2. The source and target languages serve fundamentally different purposes (e.g., C++ algorithmic code → HTML/CSS, SQL queries → CSS, Python backend logic → CSS).
3. The code uses language-specific paradigms that cannot be replicated (e.g., CSS selectors → Python, HTML DOM structure → C++).
4. The conversion would produce code that is non-functional, meaningless, or cannot produce the same output.

RULES FOR COMPATIBILITY — return compatible: true if:
1. The core logic (algorithms, data structures, control flow) can be replicated in the target language.
2. Standard library equivalents exist for the functionality used.
3. Both languages can handle the same type of problem (e.g., Python fibonacci → Java fibonacci, JavaScript sorting → C++ sorting).

Return ONLY a raw JSON object with this exact structure, no other text:
{"compatible": true/false, "reason": "brief explanation"}`;

    const compatibilityUserMsg = `Source language: ${srcLabel}
Target language: ${tgtLabel}

Source code:
${code}

Is this code compatible for conversion to ${tgtLabel}? Return ONLY the JSON.`;

    const compatResult = await callGroq([
      { role: "system", content: compatibilitySystemPrompt },
      { role: "user", content: compatibilityUserMsg },
    ], 0.1);

    let compatibility: { compatible: boolean; reason: string };
    try {
      compatibility = JSON.parse(compatResult);
    } catch {
      // If parsing fails, assume compatible and proceed
      compatibility = { compatible: true, reason: "" };
    }

    if (!compatibility.compatible) {
      return NextResponse.json({
        compatible: false,
        reason: compatibility.reason || `This ${srcLabel} code cannot be meaningfully converted to ${tgtLabel}.`,
      });
    }

    // =========================================================
    // STEP 2: Convert Code (only if compatible)
    // =========================================================
    const systemPrompt = `You are an expert programming language translator. Your job is to convert code from one programming language to another while preserving the exact same logic, functionality, and output.

CRITICAL RULES:
- Convert the code accurately. The converted code must produce the same output as the original.
- Use idiomatic patterns and best practices for the target language.
- Include necessary imports/headers for the target language.
- Add brief inline comments only where the target language syntax differs significantly.
- Return ONLY the converted code. No explanations, no markdown fences, no additional text before or after.
- If the source code has comments, translate them too.`;

    const userMessage = `Convert the following ${srcLabel} code to ${tgtLabel}. Return ONLY the converted code, nothing else.

Source code (${srcLabel}):
${code}`;

    const content = await callGroq([
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage },
    ], 0.3);

    if (!content) {
      return NextResponse.json(
        { error: "Conversion failed. No response from AI." },
        { status: 500 }
      );
    }

    return NextResponse.json({ compatible: true, convertedCode: content });
  } catch {
    return NextResponse.json(
      { error: "Failed to convert code. Please try again." },
      { status: 500 }
    );
  }
}
