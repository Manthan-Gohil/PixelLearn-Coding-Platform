# Docker-Based Code Execution Engine for Pixelearn

Replace all third-party code execution APIs (Wandbox, Piston) with a self-hosted Docker-based execution engine running on Docker Desktop (Windows), designed for later deployment to a Linux server.

## Current State — What Gets Removed

All code execution currently goes through one file:

- [route.ts](file:///c:/Users/manth/Desktop/PixelLearn-Coding-Platform/src/app/api/execute/route.ts) — Contains `PISTON_APIS` (lines 3–8, unused but defined), `WANDBOX_URL` + `WANDBOX_MAP` (lines 11–21), `tryWandbox()` function (lines 118–153), and the `POST` handler that calls Wandbox (line 177). **This entire file will be rewritten.**

Two frontend files call `/api/execute`:
- [page.tsx](file:///c:/Users/manth/Desktop/PixelLearn-Coding-Platform/src/app/playground/%5BcourseId%5D/%5BexerciseId%5D/page.tsx) — Line 310. **No changes needed** (it just calls `/api/execute`, which stays the same endpoint).
- [CodeConverterModal.tsx](file:///c:/Users/manth/Desktop/PixelLearn-Coding-Platform/src/components/playground/CodeConverterModal.tsx) — Line 160. **No changes needed** (same reason).

The Pyodide runner ([pyodide-runner.ts](file:///c:/Users/manth/Desktop/PixelLearn-Coding-Platform/src/utils/pyodide-runner.ts)) handles Python visualization in the browser. **This stays untouched** — it's a client-side WASM runner for matplotlib, completely independent of the backend execution path.

> [!IMPORTANT]
> **Zero frontend changes required.** The `/api/execute` endpoint contract (input: `{code, language, input}`, output: `{output, error, executionTime, success, plots, status}`) remains identical. Only the backend implementation changes.

## New Architecture

```
Browser → POST /api/execute → Runner.execute(lang, code, stdin)
                                    ↓
                            LanguageStrategy (python.ts, cpp.ts, etc.)
                                    ↓
                            DockerExecutor.run(image, commands, mountDir)
                                    ↓
                            Docker Desktop (child_process.spawn)
                                    ↓
                            { stdout, stderr, exitCode, executionTime }
```

### Key Design Decisions

1. **Strategy Pattern for Languages** — Each language is an isolated module exporting a standard interface (`filename`, `dockerImage`, `buildCmd`, `runCmd`). Adding Go, Rust, or Kotlin later is just creating a new file — no switch statements, no touching the runner core.

2. **DockerExecutor as the single Docker interface** — All Docker interactions go through one class. Uses `child_process.spawn` (not `exec`) with explicit argument arrays for safety. This class handles container creation, volume mounting, timeout killing, and cleanup. When you later move to a Linux server, only the Docker socket path (or potentially a remote Docker API) changes.

3. **Temporary `jobs/` directory at project root** — Each execution gets a UUID folder (`jobs/<uuid>/`). Source files are written there, the folder is bind-mounted into the container at `/code`, and the folder is deleted in a `finally` block. The `jobs/` directory is added to `.gitignore`.

4. **Resource Limits on Every Container** — `--memory=256m`, `--cpus=0.5`, `--network none`, `--pids-limit 64`, `--read-only` (with a tmpfs for `/tmp`). These prevent infinite memory allocation, fork bombs, and network access.

5. **Timeout Handling** — A configurable timeout (default 10s) kills the container via `docker kill` if execution exceeds the limit. This is implemented at the Node.js level using `AbortController`/`setTimeout`, not relying on Docker's `--stop-timeout` alone.

6. **Plot Capture for Python** — The existing `injectPlotCapture()` and `parsePlotOutput()` functions from the current route.ts are preserved. They work by injecting matplotlib capture code and parsing base64 markers from stdout. These are moved into the Python language strategy.

7. **Cross-Platform Compatibility** — Path separators use `path.join()` and `path.resolve()`. Docker commands use the same CLI on Windows and Linux. The `jobs/` directory uses OS-native temp paths. `spawn` is invoked with `shell: false` (Windows handles this fine with Docker Desktop).

---

## Proposed Changes

### New: Execution Engine Module (`src/lib/runner/`)

#### [NEW] [config.ts](file:///c:/Users/manth/Desktop/PixelLearn-Coding-Platform/src/lib/runner/config.ts)
Centralized configuration for the execution engine:
- `JOBS_DIR` — Absolute path to `jobs/` in project root
- `DOCKER_TIMEOUT_MS` — Default execution timeout (10000ms)
- `DOCKER_MEMORY_LIMIT` — Container memory limit (`256m`)
- `DOCKER_CPU_LIMIT` — Container CPU limit (`0.5`)
- `DOCKER_NETWORK` — Network mode (`none`)

#### [NEW] [types.ts](file:///c:/Users/manth/Desktop/PixelLearn-Coding-Platform/src/lib/runner/types.ts)
TypeScript interfaces for the execution engine:
- `ExecutionRequest` — `{ language, code, stdin }`
- `ExecutionResult` — `{ stdout, stderr, exitCode, executionTime, success }`
- `LanguageStrategy` — The interface every language module implements:
  ```ts
  interface LanguageStrategy {
    language: string;
    dockerImage: string;
    filename: string;
    buildCommands?: string[];  // Compile step (C/C++/Java)
    runCommand: string[];       // Execution step
    preprocess?: (code: string) => { code: string; plots?: boolean };
    postprocess?: (result: ExecutionResult) => ExecutionResult & { plots?: string[] };
  }
  ```

#### [NEW] [DockerExecutor.ts](file:///c:/Users/manth/Desktop/PixelLearn-Coding-Platform/src/lib/runner/DockerExecutor.ts)
The core Docker interaction layer:
- `execute(strategy, jobDir)` — Runs `docker run --rm` with bind mounts, resource limits, and timeout
- Uses `child_process.spawn('docker', [...args])` — no shell injection possible
- Handles Windows path conversion for Docker bind mounts (converts `C:\...` to `/c/...` for Docker Desktop's Linux VM)
- Implements timeout via `AbortController` + `docker kill <container_name>`
- Returns `ExecutionResult`
- Static `isDockerAvailable()` health check method

#### [NEW] [Runner.ts](file:///c:/Users/manth/Desktop/PixelLearn-Coding-Platform/src/lib/runner/Runner.ts)
The orchestrator that ties everything together:
1. Validates the language and selects the strategy
2. Creates a UUID job directory under `jobs/`
3. Writes the source code to `jobDir/<filename>`
4. Calls the strategy's `preprocess()` if defined (e.g., Python viz injection)
5. Passes to `DockerExecutor.execute()`
6. Calls the strategy's `postprocess()` if defined (e.g., parsing plot markers)
7. Cleans up the job directory in `finally`
8. Returns the final result

#### [NEW] [index.ts](file:///c:/Users/manth/Desktop/PixelLearn-Coding-Platform/src/lib/runner/index.ts)
Re-exports `Runner` and types for clean imports.

---

### New: Language Strategies (`src/lib/runner/languages/`)

Each file exports a `LanguageStrategy` object. No classes needed — plain objects.

#### [NEW] [python.ts](file:///c:/Users/manth/Desktop/PixelLearn-Coding-Platform/src/lib/runner/languages/python.ts)
- Image: `python:3.12-slim`  (slim saves ~800MB vs full image)
- Filename: `main.py`
- Run: `["python", "main.py"]`
- `preprocess`: Detects matplotlib/viz imports → injects plot capture code
- `postprocess`: Parses `__PIXELLEARN_PLOT_START__` / `__PIXELLEARN_PLOT_END__` markers from stdout

#### [NEW] [cpp.ts](file:///c:/Users/manth/Desktop/PixelLearn-Coding-Platform/src/lib/runner/languages/cpp.ts)
- Image: `gcc:latest`
- Filename: `main.cpp`
- Build: `["g++", "-O2", "-std=c++20", "-o", "main", "main.cpp"]`
- Run: `["./main"]`

#### [NEW] [c.ts](file:///c:/Users/manth/Desktop/PixelLearn-Coding-Platform/src/lib/runner/languages/c.ts)
- Image: `gcc:latest`
- Filename: `main.c`
- Build: `["gcc", "-O2", "-o", "main", "main.c"]`
- Run: `["./main"]`

#### [NEW] [java.ts](file:///c:/Users/manth/Desktop/PixelLearn-Coding-Platform/src/lib/runner/languages/java.ts)
- Image: `openjdk:21-slim`
- Filename: `Main.java`
- Build: `["javac", "Main.java"]`
- Run: `["java", "Main"]`
- `preprocess`: Strips `public` from `public class Main` (same hack as current Wandbox code, required for single-file execution)

#### [NEW] [registry.ts](file:///c:/Users/manth/Desktop/PixelLearn-Coding-Platform/src/lib/runner/languages/registry.ts)
A `Map<string, LanguageStrategy>` that maps language names to strategies. Handles aliases (`"c++"` → `cpp` strategy). Adding a new language = import it and add one line to the registry.

---

### Modified: API Route

#### [MODIFY] [route.ts](file:///c:/Users/manth/Desktop/PixelLearn-Coding-Platform/src/app/api/execute/route.ts)
**Complete rewrite.** The new version:
1. Parses `{ code, language, input }` from the request body
2. Handles frontend languages (HTML/CSS/ReactJS) with immediate preview return (preserving existing behavior)
3. Calls `Runner.execute(language, code, input)` for all other languages
4. Returns the same response shape: `{ output, error, executionTime, success, plots, status }`
5. Error handling: catches Docker-not-available, unsupported language, timeout, and general errors — returning descriptive messages instead of crashing

**The API contract is identical — no frontend changes needed.**

---

### Modified: Gitignore

#### [MODIFY] [.gitignore](file:///c:/Users/manth/Desktop/PixelLearn-Coding-Platform/.gitignore)
Add `/jobs` to prevent temporary execution directories from being committed.

---

## Files NOT Modified

| File | Reason |
|---|---|
| [page.tsx](file:///c:/Users/manth/Desktop/PixelLearn-Coding-Platform/src/app/playground/%5BcourseId%5D/%5BexerciseId%5D/page.tsx) | Calls `/api/execute` — contract unchanged |
| [CodeConverterModal.tsx](file:///c:/Users/manth/Desktop/PixelLearn-Coding-Platform/src/components/playground/CodeConverterModal.tsx) | Calls `/api/execute` — contract unchanged |
| [OutputPanel.tsx](file:///c:/Users/manth/Desktop/PixelLearn-Coding-Platform/src/components/playground/panels/OutputPanel.tsx) | Displays output/plots — no changes |
| [pyodide-runner.ts](file:///c:/Users/manth/Desktop/PixelLearn-Coding-Platform/src/utils/pyodide-runner.ts) | Client-side Python for matplotlib — independent of backend |
| [playground.ts](file:///c:/Users/manth/Desktop/PixelLearn-Coding-Platform/src/utils/playground.ts) | Preview HTML builder — unrelated |
| All other components, store, types, constants | Unaffected |

---

## Open Questions

> [!IMPORTANT]
> **Docker Image Sizes** — The first run of each language will pull its Docker image (e.g., `gcc:latest` is ~1.4GB, `python:3.12-slim` is ~150MB). Should I add a setup script that pre-pulls all images, or is it fine to let them pull on first execution?

> [!IMPORTANT]
> **Python Visualization in Docker** — Currently, Python code with matplotlib runs client-side via Pyodide (WASM). With Docker, we *could* also run matplotlib server-side (the plot capture injection code already exists). The plan preserves both paths: Pyodide for client-side viz, Docker for non-viz Python. Should I keep this dual-path approach, or route ALL Python through Docker?

---

## Verification Plan

### Automated Tests
```bash
# 1. Verify Docker is accessible
docker info

# 2. Test each language manually via curl
# Python
curl -X POST http://localhost:3000/api/execute -H "Content-Type: application/json" -d "{\"code\":\"print('Hello from Docker')\",\"language\":\"python\",\"input\":\"\"}"

# C++
curl -X POST http://localhost:3000/api/execute -H "Content-Type: application/json" -d "{\"code\":\"#include <iostream>\\nint main() { std::cout << \\\"Hello C++\\\"; return 0; }\",\"language\":\"cpp\",\"input\":\"\"}"

# C
curl -X POST http://localhost:3000/api/execute -H "Content-Type: application/json" -d "{\"code\":\"#include <stdio.h>\\nint main() { printf(\\\"Hello C\\\"); return 0; }\",\"language\":\"c\",\"input\":\"\"}"

# Java
curl -X POST http://localhost:3000/api/execute -H "Content-Type: application/json" -d "{\"code\":\"public class Main { public static void main(String[] args) { System.out.println(\\\"Hello Java\\\"); } }\",\"language\":\"java\",\"input\":\"\"}"
```

### Manual Verification
1. Open the Pixelearn playground in the browser
2. Run a Python exercise → verify output appears in the output panel
3. Run a C++ exercise → verify compilation + execution
4. Test with stdin input (e.g., a Python `input()` call)
5. Test a compilation error (syntax error in C++) → verify error message displays
6. Test an infinite loop → verify timeout kills the container after 10s
7. Test with Docker Desktop stopped → verify graceful "Docker not available" error
8. Verify `jobs/` directory is cleaned up after each execution (no leftover folders)

### Future Language Test
To prove extensibility, I'll add a brief note showing how adding JavaScript/Node.js support would look (one new file, one registry line).
