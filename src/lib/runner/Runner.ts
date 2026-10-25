import { randomUUID } from "crypto";
import fs from "fs/promises";
import path from "path";
import { DockerExecutor } from "./DockerExecutor";
import { getStrategy, getSupportedLanguages } from "./languages/registry";
import { JOBS_DIR, CODE_RUNNER_URL, CODE_RUNNER_SECRET } from "./config";
import type { RunnerResult } from "./types";

// ─── Runner ──────────────────────────────────────────────────────────────────
// The top-level orchestrator for code execution. This is the only export
// that the API route needs to interact with.
//
// Lifecycle for each execution:
//   0. If CODE_RUNNER_URL is set, forward execution via HTTP (hybrid Vercel + EC2)
//   1. Validate the language and retrieve its strategy
//   2. Check that Docker is available
//   3. Create a UUID-named job directory
//   4. Write the (optionally preprocessed) source code to disk
//   5. Hand off to DockerExecutor for container-based execution
//   6. Optionally postprocess the result (e.g., extract plots)
//   7. Clean up the job directory (always, even on failure)
//   8. Return the result

export class Runner {
  /**
   * Executes user code in a Docker container.
   *
   * @param language  Language identifier (e.g., "python", "cpp", "java")
   * @param code      Source code to execute
   * @param stdin     Standard input to pipe to the program
   * @returns         Execution result with stdout, stderr, timing, and optional plots
   *
   * @throws Error with descriptive message for:
   *   - Unsupported language
   *   - Docker not available
   *   - Filesystem errors
   *   - Container errors (caught and returned as result, not thrown)
   */
  static async execute(
    language: string,
    code: string,
    stdin: string = "",
  ): Promise<RunnerResult> {
    // ── 0. Optional Remote Runner Forwarding ───────────────────────────────
    // When deployed on serverless (e.g., Vercel) where Docker cannot run,
    // setting CODE_RUNNER_URL proxies the execution directly to your EC2 instance.
    if (CODE_RUNNER_URL) {
      try {
        const endpoint = CODE_RUNNER_URL.endsWith("/execute")
          ? CODE_RUNNER_URL
          : `${CODE_RUNNER_URL.replace(/\/+$/, "")}/api/execute`;

        const res = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(CODE_RUNNER_SECRET ? { "x-runner-secret": CODE_RUNNER_SECRET } : {}),
          },
          body: JSON.stringify({ language, code, input: stdin }),
          signal: AbortSignal.timeout(15_000),
        });

        if (!res.ok) {
          const errText = await res.text();
          return {
            stdout: "",
            stderr: `Runner service error (${res.status}): ${errText || res.statusText}`,
            exitCode: 1,
            executionTime: 0,
            success: false,
          };
        }

        const data = await res.json();
        return {
          stdout: data.output || data.stdout || "",
          stderr: data.error || data.stderr || "",
          exitCode: data.exitCode ?? (data.success ? 0 : 1),
          executionTime: data.executionTime || 0,
          success: Boolean(data.success),
          plots: data.plots || [],
          timedOut: Boolean(data.timedOut),
        };
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        return {
          stdout: "",
          stderr: `Failed to connect to execution runner (${CODE_RUNNER_URL}): ${errorMsg}`,
          exitCode: 1,
          executionTime: 0,
          success: false,
        };
      }
    }

    // ── 1. Resolve language strategy ──────────────────────────────────────
    const strategy = getStrategy(language);
    if (!strategy) {
      const supported = getSupportedLanguages().join(", ");
      return {
        stdout: "",
        stderr: `Unsupported language: "${language}". Supported languages: ${supported}`,
        exitCode: 1,
        executionTime: 0,
        success: false,
      };
    }

    // ── 2. Check Docker availability ─────────────────────────────────────
    const dockerAvailable = await DockerExecutor.isAvailable();
    if (!dockerAvailable) {
      return {
        stdout: "",
        stderr:
          "Docker is not available. Please ensure Docker Desktop is installed and running.",
        exitCode: 1,
        executionTime: 0,
        success: false,
      };
    }

    // ── 3. Create job directory ──────────────────────────────────────────
    const jobId = randomUUID();
    const jobDir = path.join(JOBS_DIR, jobId);

    try {
      await fs.mkdir(jobDir, { recursive: true });

      // ── 4. Preprocess code (if strategy defines it) ───────────────────
      let sourceCode = code;
      if (strategy.preprocess) {
        const preprocessed = strategy.preprocess(code);
        sourceCode = preprocessed.code;
      }

      // ── 5. Write source file ──────────────────────────────────────────
      const sourceFile = path.join(jobDir, strategy.filename);
      await fs.writeFile(sourceFile, sourceCode, "utf-8");

      // ── 6. Execute in Docker ──────────────────────────────────────────
      const rawResult = await DockerExecutor.execute(strategy, jobDir, stdin);

      // ── 7. Postprocess result (if strategy defines it) ────────────────
      if (strategy.postprocess) {
        return strategy.postprocess(rawResult);
      }

      return { ...rawResult, plots: [] };
    } finally {
      // ── 8. Cleanup — always runs, even if an error was thrown ─────────
      try {
        await fs.rm(jobDir, { recursive: true, force: true });
      } catch {
        // Best-effort cleanup — don't let cleanup errors mask the real error
        console.warn(`[Runner] Failed to clean up job directory: ${jobDir}`);
      }
    }
  }
}
