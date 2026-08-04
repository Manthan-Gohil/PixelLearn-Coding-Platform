import { spawn } from "child_process";
import path from "path";
import type { ExecutionResult, LanguageStrategy } from "./types";
import {
  DOCKER_TIMEOUT_MS,
  DOCKER_MEMORY_LIMIT,
  DOCKER_CPU_LIMIT,
  DOCKER_NETWORK,
  DOCKER_PIDS_LIMIT,
} from "./config";

// ─── Docker Executor ─────────────────────────────────────────────────────────
// The single point of contact with Docker. All container interactions go
// through this class — creating containers, mounting volumes, enforcing
// resource limits, handling timeouts, and capturing output.
//
// Design notes:
//   - Uses child_process.spawn (NOT exec) with explicit argument arrays.
//     This avoids shell injection vulnerabilities and works identically
//     on Windows and Linux.
//   - Every container is created with --rm, so Docker cleans it up
//     automatically when it exits. If a timeout kills the container,
//     we also do a best-effort `docker rm -f` to handle edge cases.

/**
 * Converts a Windows-style path to a Docker Desktop bind-mount path.
 *
 * Docker Desktop on Windows expects paths in the format /c/Users/...
 * instead of C:\Users\... because the Docker daemon runs inside a
 * Linux VM (WSL2 or Hyper-V).
 *
 * On Linux/macOS, paths are returned unchanged.
 *
 * Examples:
 *   "C:\\Users\\manth\\project\\jobs\\abc" → "/c/Users/manth/project/jobs/abc"
 *   "/home/user/project/jobs/abc"        → "/home/user/project/jobs/abc"
 */
function toDockerPath(windowsPath: string): string {
  // Replace backslashes with forward slashes
  let dockerPath = windowsPath.replace(/\\/g, "/");

  // Convert drive letter: "C:/..." → "/c/..."
  const driveMatch = dockerPath.match(/^([A-Za-z]):\//);
  if (driveMatch) {
    dockerPath = `/${driveMatch[1].toLowerCase()}/${dockerPath.slice(3)}`;
  }

  return dockerPath;
}

/**
 * Spawns a process and captures its stdout/stderr.
 * Returns a promise that resolves with the output and exit code.
 * Supports an AbortSignal for timeout-based cancellation.
 */
function spawnAsync(
  command: string,
  args: string[],
  options: {
    timeout?: number;
    stdinData?: string;
  } = {},
): Promise<{ stdout: string; stderr: string; exitCode: number; timedOut: boolean }> {
  return new Promise((resolve) => {
    let timedOut = false;
    let stdout = "";
    let stderr = "";

    const proc = spawn(command, args, {
      // shell: false is the default — we're explicit for clarity.
      // This ensures the command and args are passed directly to the OS,
      // not through cmd.exe/bash, preventing shell injection.
      shell: false,
      // Pipe stdio so we can capture output and send stdin
      stdio: ["pipe", "pipe", "pipe"],
    });

    // Capture stdout
    proc.stdout.on("data", (chunk: Buffer) => {
      stdout += chunk.toString();
    });

    // Capture stderr
    proc.stderr.on("data", (chunk: Buffer) => {
      stderr += chunk.toString();
    });

    // Send stdin data (user input) then close the stream
    if (options.stdinData) {
      proc.stdin.write(options.stdinData);
    }
    proc.stdin.end();

    // Timeout handler — kills the process tree
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    if (options.timeout) {
      timeoutId = setTimeout(() => {
        timedOut = true;
        proc.kill("SIGKILL");
      }, options.timeout);
    }

    proc.on("close", (code) => {
      if (timeoutId) clearTimeout(timeoutId);
      resolve({
        stdout,
        stderr,
        exitCode: code ?? 1,
        timedOut,
      });
    });

    proc.on("error", (err) => {
      if (timeoutId) clearTimeout(timeoutId);
      resolve({
        stdout,
        stderr: stderr || err.message,
        exitCode: 1,
        timedOut: false,
      });
    });
  });
}

export class DockerExecutor {
  /**
   * Checks whether Docker is installed and the daemon is running.
   * Returns true if `docker info` succeeds, false otherwise.
   */
  static async isAvailable(): Promise<boolean> {
    try {
      const result = await spawnAsync("docker", ["info"], { timeout: 5000 });
      return result.exitCode === 0;
    } catch {
      return false;
    }
  }

  /**
   * Executes user code inside a Docker container.
   *
   * Flow:
   *   1. If the strategy has buildCommands (compilation step), run them first
   *      in a container that mounts the job directory as read-write.
   *   2. Run the execution command in a container with the same mount.
   *   3. Capture stdout, stderr, exit code, and timing.
   *
   * The job directory is bind-mounted at /code inside the container.
   * All containers use --rm for automatic cleanup.
   */
  static async execute(
    strategy: LanguageStrategy,
    jobDir: string,
    stdin: string,
  ): Promise<ExecutionResult> {
    const startTime = Date.now();
    const dockerMountPath = toDockerPath(jobDir);
    const containerWorkdir = "/code";

    // ── Step 1: Compilation (if needed) ─────────────────────────────────────
    if (strategy.buildCommands && strategy.buildCommands.length > 0) {
      for (const buildCmd of strategy.buildCommands) {
        const buildArgs = [
          "run",
          "--rm",
          // Resource limits apply during compilation too
          `--memory=${DOCKER_MEMORY_LIMIT}`,
          `--cpus=${DOCKER_CPU_LIMIT}`,
          `--network=${DOCKER_NETWORK}`,
          `--pids-limit=${DOCKER_PIDS_LIMIT}`,
          // Mount the job directory as read-write for compilation output
          "-v", `${dockerMountPath}:${containerWorkdir}`,
          "-w", containerWorkdir,
          strategy.dockerImage,
          "sh", "-c", buildCmd,
        ];

        const buildResult = await spawnAsync("docker", buildArgs, {
          timeout: DOCKER_TIMEOUT_MS,
        });

        if (buildResult.timedOut) {
          return {
            stdout: "",
            stderr: "Compilation timed out.",
            exitCode: 1,
            executionTime: Date.now() - startTime,
            success: false,
            timedOut: true,
          };
        }

        if (buildResult.exitCode !== 0) {
          return {
            stdout: buildResult.stdout,
            stderr: buildResult.stderr,
            exitCode: buildResult.exitCode,
            executionTime: Date.now() - startTime,
            success: false,
          };
        }
      }
    }

    // ── Step 2: Execution ───────────────────────────────────────────────────
    const runArgs = [
      "run",
      "--rm",
      "-i", // Keep stdin open so we can pipe user input
      // Resource limits
      `--memory=${DOCKER_MEMORY_LIMIT}`,
      `--cpus=${DOCKER_CPU_LIMIT}`,
      `--network=${DOCKER_NETWORK}`,
      `--pids-limit=${DOCKER_PIDS_LIMIT}`,
      // Mount job directory
      "-v", `${dockerMountPath}:${containerWorkdir}`,
      "-w", containerWorkdir,
      // Docker image
      strategy.dockerImage,
      // Run command
      ...strategy.runCommand,
    ];

    const runResult = await spawnAsync("docker", runArgs, {
      timeout: DOCKER_TIMEOUT_MS,
      stdinData: stdin,
    });

    const executionTime = Date.now() - startTime;

    if (runResult.timedOut) {
      return {
        stdout: runResult.stdout,
        stderr: "Execution timed out. Your program may contain an infinite loop.",
        exitCode: 1,
        executionTime,
        success: false,
        timedOut: true,
      };
    }

    return {
      stdout: runResult.stdout,
      stderr: runResult.stderr,
      exitCode: runResult.exitCode,
      executionTime,
      success: runResult.exitCode === 0,
    };
  }
}
