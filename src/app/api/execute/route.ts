import { NextRequest, NextResponse } from "next/server";

// Multiple Piston API endpoints for fallback
const PISTON_APIS = [
  "https://emkc.org/api/v2/piston/execute",
  "https://piston-api.onrender.com/api/v2/execute",
  "https://piston-api.vercel.app/api/v2/execute",
];

// Industry Standard Fallbacks (Wandbox is highly robust for C++/Python)
const WANDBOX_URL = "https://wandbox.org/api/compile.json";

const WANDBOX_MAP: Record<string, { compiler: string }> = {
  python: { compiler: "cpython-head" },
  javascript: { compiler: "nodejs-head" },
  typescript: { compiler: "typescript-head" },
  java: { compiler: "openjdk-head" },
  cpp: { compiler: "gcc-head" },
  "c++": { compiler: "gcc-head" },
  c: { compiler: "gcc-head" },
};

async function tryWandbox(code: string, langKey: string, input: string) {
  const config = WANDBOX_MAP[langKey];
  if (!config) return null;

  try {
    const response = await fetch(WANDBOX_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        compiler: config.compiler,
        code: code,
        stdin: input || "",
        "compiler-option-raw": langKey.includes("c") ? "-O2\n-std=c++20" : "",
      }),
    });

    if (response.ok) {
      const result = await response.json();
      return {
        output: result.program_output || "",
        error: result.compiler_error || result.program_error || "",
        success: result.status === "0",
        compilerOutput: result.compiler_output || "",
      };
    }
  } catch (e) {
    console.warn(`Wandbox API fail:`, e);
  }
  return null;
}

export async function POST(request: NextRequest) {
  try {
    const { code, language, input } = await request.json();
    const lang = language.toLowerCase();
    const startTime = Date.now();

    // 1. Frontend Languages (Immediate Full Page View)
    if (lang === "html" || lang === "css" || lang === "reactjs") {
      return NextResponse.json({
        output: code,
        executionTime: 0,
        success: true,
        isPreview: true,
      });
    }

    // 2. Try Wandbox (No-Auth, High Accuracy for C++/Python)
    const data = await tryWandbox(code, lang, input || "");

    if (data) {
      const execTime = Date.now() - startTime;
      return NextResponse.json({
        output: data.output.trimEnd(),
        error: data.error,
        executionTime: execTime,
        success: data.success,
        status: data.success ? "Accepted" : (data.error.includes("error") ? "Compilation Error" : "Runtime Error")
      });
    }

    // 3. Fail State
    return NextResponse.json({
      output: "",
      error: "All code execution backends are currently unreachable. Please check your internet connection or try again later.",
      executionTime: Date.now() - startTime,
      success: false,
      status: "Service Unavailable"
    });

  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

// End of execution route
