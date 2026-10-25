import path from "path";

// ─── Execution Engine Configuration ──────────────────────────────────────────
// All Docker execution parameters are centralized here so they can be tuned
// in one place. When deploying to a Linux server, only JOBS_DIR might need
// adjustment (e.g., pointing to /tmp/pixelearn-jobs or a dedicated volume).

/**
 * Directory where temporary job folders are created.
 * Each execution gets a UUID subdirectory under this path.
 * Resolved relative to the project root (process.cwd()).
 */
export const JOBS_DIR = path.resolve(process.cwd(), "jobs");

/**
 * Maximum execution time in milliseconds before the container is killed.
 * Prevents infinite loops from hanging the server indefinitely.
 */
export const DOCKER_TIMEOUT_MS = 10_000; // 10 seconds

/**
 * Docker memory limit per container.
 * Prevents a single execution from consuming all host memory.
 */
export const DOCKER_MEMORY_LIMIT = "256m";

/**
 * Docker CPU limit per container (fractional cores).
 * 0.5 = half a CPU core — enough for compilation + execution.
 */
export const DOCKER_CPU_LIMIT = "0.5";

/**
 * Docker network mode. "none" disables all networking inside the container,
 * preventing user code from making HTTP requests or exfiltrating data.
 */
export const DOCKER_NETWORK = "none";

/**
 * Maximum number of processes inside the container.
 * Prevents fork bombs from crashing Docker Desktop.
 */
export const DOCKER_PIDS_LIMIT = 64;

/**
 * Sentinel markers used to extract base64-encoded plot images from stdout.
 * The Python strategy injects code that wraps matplotlib figures between
 * these markers so we can separate plots from regular text output.
 */
export const PLOT_START_MARKER = "__PIXELLEARN_PLOT_START__";
export const PLOT_END_MARKER = "__PIXELLEARN_PLOT_END__";

/**
 * Maximum concurrent Docker executions allowed simultaneously.
 * Queues excess jobs to prevent OOM crashes on servers with limited RAM.
 * Default is 4 (safe for 1GB-4GB EC2 instances with 50+ students).
 */
export const DOCKER_MAX_CONCURRENT = parseInt(
  process.env.DOCKER_MAX_CONCURRENT || "4",
  10,
);

/**
 * Optional remote runner service URL.
 * When set, Runner forwards executions via HTTP instead of running Docker locally.
 * Allows decoupling frontend (e.g. Vercel) from Docker runner (e.g. EC2).
 */
export const CODE_RUNNER_URL = process.env.CODE_RUNNER_URL || "";
export const CODE_RUNNER_SECRET = process.env.CODE_RUNNER_SECRET || "";
