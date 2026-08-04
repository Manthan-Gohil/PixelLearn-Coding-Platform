// ─── Execution Engine Types ──────────────────────────────────────────────────
// Shared interfaces for the Runner, DockerExecutor, and language strategies.

/**
 * Input to the execution engine from the API route.
 */
export interface ExecutionRequest {
  language: string;
  code: string;
  stdin: string;
}

/**
 * Raw result from the Docker container execution.
 * This is what DockerExecutor returns before any language-specific postprocessing.
 */
export interface ExecutionResult {
  stdout: string;
  stderr: string;
  exitCode: number;
  executionTime: number;
  success: boolean;
  timedOut?: boolean;
}

/**
 * Final result returned from Runner to the API route.
 * Extends ExecutionResult with optional plot data (for Python matplotlib).
 */
export interface RunnerResult extends ExecutionResult {
  plots?: string[];
}

/**
 * Interface that every language module must implement.
 *
 * The strategy pattern lets us add new languages without touching the
 * Runner or DockerExecutor — just create a new file in languages/ and
 * register it in the registry.
 *
 * Lifecycle:
 *   1. preprocess(code)  → optionally transform the code before writing to disk
 *   2. DockerExecutor runs buildCommands (if any), then runCommand
 *   3. postprocess(result) → optionally transform the output (e.g., extract plots)
 */
export interface LanguageStrategy {
  /** Display name of the language (e.g., "Python", "C++") */
  language: string;

  /** Docker image to use (e.g., "python:3.12-slim") */
  dockerImage: string;

  /** Filename for the user's source code (e.g., "main.py", "Main.java") */
  filename: string;

  /**
   * Optional compilation commands to run before execution.
   * Each string is a shell command executed inside the container.
   * Example for C++: ["g++ -O2 -std=c++20 -o main main.cpp"]
   */
  buildCommands?: string[];

  /**
   * The command to execute the program inside the container.
   * Example for Python: ["python", "main.py"]
   * Example for compiled C++: ["./main"]
   */
  runCommand: string[];

  /**
   * Optional preprocessing of the user's source code before writing to disk.
   * Returns the (potentially modified) code and metadata flags.
   *
   * Use cases:
   *   - Python: inject matplotlib capture code when viz imports are detected
   *   - Java: strip `public` from `public class Main`
   */
  preprocess?: (code: string) => { code: string; hasPlots?: boolean };

  /**
   * Optional postprocessing of the execution result.
   * Returns the result with any additional data extracted.
   *
   * Use cases:
   *   - Python: parse base64 plot markers from stdout
   */
  postprocess?: (result: ExecutionResult) => RunnerResult;
}
