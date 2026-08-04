import { NextRequest, NextResponse } from "next/server";
import { Runner } from "@/lib/runner";

// ─── POST /api/execute ───────────────────────────────────────────────────────
// Receives { code, language, input } and returns execution results.
//
// This route is the sole entry point for all server-side code execution.
// It replaces the previous Wandbox/Piston-based implementation with a
// Docker-based execution engine that runs containers locally.
//
// Frontend languages (HTML, CSS, ReactJS) are returned immediately as
// preview content — they never touch Docker.

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, language, input } = body;

    if (!code || !language) {
      return NextResponse.json(
        {
          output: "",
          plots: [],
          error: "Missing required fields: code, language",
          executionTime: 0,
          success: false,
          status: "Bad Request",
        },
        { status: 400 },
      );
    }

    const lang = language.toLowerCase();

    // ── 1. Frontend Languages — Immediate Preview (no Docker) ──────────
    if (lang === "html" || lang === "css" || lang === "reactjs") {
      return NextResponse.json({
        output: code,
        executionTime: 0,
        success: true,
        isPreview: true,
      });
    }

    // ── 2. Server-side Execution via Docker ───────────────────────────
    const result = await Runner.execute(lang, code, input || "");

    // Determine status label for the frontend
    let status = "Accepted";
    if (!result.success) {
      if (result.timedOut) {
        status = "Time Limit Exceeded";
      } else if (result.stderr?.toLowerCase().includes("error")) {
        status = "Compilation Error";
      } else {
        status = "Runtime Error";
      }
    }

    return NextResponse.json({
      output: (result.stdout || "").trimEnd(),
      plots: result.plots || [],
      error: (result.stderr || "").trim(),
      executionTime: result.executionTime,
      success: result.success,
      status,
    });
  } catch (error) {
    console.error("[/api/execute] Unhandled error:", error);
    return NextResponse.json(
      {
        output: "",
        plots: [],
        error: "Internal server error. Please try again.",
        executionTime: 0,
        success: false,
        status: "Internal Error",
      },
      { status: 500 },
    );
  }
}
