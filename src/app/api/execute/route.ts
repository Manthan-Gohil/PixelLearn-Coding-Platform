import { NextRequest, NextResponse } from "next/server";

// Multiple Piston API endpoints for fallback
const PISTON_APIS = [
  "https://emkc.org/api/v2/piston/execute",
  "https://piston-api.onrender.com/api/v2/execute",
  "https://piston-api.vercel.app/api/v2/execute",
];

// Industry Standard Fallbacks (Wandbox is highly robust for C++/Python)
const WANDBOX_URL = "https://wandbox.org/api/compile.json";

const WANDBOX_MAP: Record<string, { compiler: string; filename: string }> = {
  python: { compiler: "cpython-3.12.7", filename: "solution.py" },
  javascript: { compiler: "nodejs-20.17.0", filename: "solution.js" },
  typescript: { compiler: "typescript-5.6.2", filename: "solution.ts" },
  java: { compiler: "openjdk-jdk-21+35", filename: "Main.java" },
  cpp: { compiler: "gcc-head", filename: "solution.cpp" },
  "c++": { compiler: "gcc-head", filename: "solution.cpp" },
  c: { compiler: "gcc-head", filename: "solution.c" },
};

// ─── Plot Visualization Support ──────────────────────────────────────────────
// Visualization libraries that produce graphical output
const VIZ_LIBS = ["matplotlib", "seaborn", "plotly", "bokeh", "altair", "pygal"];

const PLOT_START_MARKER = "__PIXELLEARN_PLOT_START__";
const PLOT_END_MARKER   = "__PIXELLEARN_PLOT_END__";

/**
 * Detects if the Python code imports any visualization library.
 */
function hasPythonVisualization(code: string): boolean {
  return VIZ_LIBS.some((lib) =>
    new RegExp(`^\\s*(import|from)\\s+${lib}`, "m").test(code),
  );
}

/**
 * Injects a matplotlib-agnostic plot-capture snippet into the user's Python
 * code so that every figure is serialized to a base64 PNG and written to
 * stdout with sentinel markers, instead of opening a GUI window.
 *
 * The snippet:
 *  1. Switches the backend to "Agg" (file-based, no display needed) BEFORE
 *     any other matplotlib import resolves — achieved by patching sys.modules.
 *  2. Replaces plt.show() with a no-op so the user's code doesn't hang.
 *  3. After the user code runs, captures every open figure via the injected
 *     atexit-style footer and emits the base64 PNG to stdout.
 */
function injectPlotCapture(code: string): string {
  const header = `
import sys as _sys, io as _io, base64 as _b64

# Force non-interactive Agg backend before matplotlib is imported
import importlib as _il
try:
    import matplotlib as _mpl
    _mpl.use('Agg')
except Exception:
    pass

# Suppress plt.show() so it never blocks
try:
    import matplotlib.pyplot as _plt_real
    _plt_real.show = lambda *a, **kw: None
except Exception:
    pass

`;

  const footer = `

# ── PixelLearn plot capture ──────────────────────────────────────────────────
try:
    import matplotlib.pyplot as _plt_cap
    for _fig_num in _plt_cap.get_fignums():
        _buf = _io.BytesIO()
        _plt_cap.figure(_fig_num).savefig(_buf, format='png', dpi=120, bbox_inches='tight')
        _buf.seek(0)
        _b64_str = _b64.b64encode(_buf.read()).decode('ascii')
        print("${PLOT_START_MARKER}" + _b64_str + "${PLOT_END_MARKER}")
        _plt_cap.close(_fig_num)
except Exception as _e:
    pass
`;

  return header + code + footer;
}

/**
 * Parses stdout from a Python run that had plot-capture injected.
 * Returns the clean text output and an array of base64 PNG strings.
 */
function parsePlotOutput(raw: string): { text: string; plots: string[] } {
  const plots: string[] = [];
  const textParts: string[] = [];

  // Split on start marker
  const segments = raw.split(PLOT_START_MARKER);
  textParts.push(segments[0]);

  for (let i = 1; i < segments.length; i++) {
    const endIdx = segments[i].indexOf(PLOT_END_MARKER);
    if (endIdx !== -1) {
      plots.push(segments[i].slice(0, endIdx));
      textParts.push(segments[i].slice(endIdx + PLOT_END_MARKER.length));
    } else {
      textParts.push(segments[i]);
    }
  }

  return { text: textParts.join("").trim(), plots };
}

// ─── Execution Backends ───────────────────────────────────────────────────────

async function tryWandbox(code: string, langKey: string, input: string) {
  const config = WANDBOX_MAP[langKey];
  if (!config) return null;

  // HACK: Java requires the filename to match the public class name.
  // To avoid naming conflicts in the sandbox, we strip 'public' from the class declaration.
  let processedCode = code;
  if (langKey === "java") {
    processedCode = code.replace(/public\s+class\s+Main/g, "class Main");
  }

  try {
    const response = await fetch(WANDBOX_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        compiler: config.compiler,
        code: processedCode,
        stdin: input || "",
        "compiler-option-raw": langKey === "cpp" || langKey === "c++" || langKey === "c" ? "-O2\n-std=c++20" : "",
      }),
    });

    if (response.ok) {
      const result = await response.json();
      return {
        output: (result.program_output || "").trim(),
        error: (result.compiler_error || result.program_error || "").trim(),
        success: result.status === "0",
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

    // 2. Python Visualization — inject plot-capture before running
    const isPython = lang === "python";
    const hasViz = isPython && hasPythonVisualization(code);
    const codeToRun = hasViz ? injectPlotCapture(code) : code;

    // 3. Try Wandbox (No-Auth, High Accuracy for C++/Python)
    const data = await tryWandbox(codeToRun, lang, input || "");

    if (data) {
      const execTime = Date.now() - startTime;

      // For Python with viz libs, parse out the embedded plot images
      if (hasViz) {
        const { text, plots } = parsePlotOutput(data.output);
        return NextResponse.json({
          output: text,
          plots,
          error: data.error,
          executionTime: execTime,
          success: data.success,
          status: data.success ? "Accepted" : (data.error.includes("error") ? "Compilation Error" : "Runtime Error"),
        });
      }

      return NextResponse.json({
        output: data.output.trimEnd(),
        plots: [],
        error: data.error,
        executionTime: execTime,
        success: data.success,
        status: data.success ? "Accepted" : (data.error.includes("error") ? "Compilation Error" : "Runtime Error"),
      });
    }

    // 4. Fail State
    return NextResponse.json({
      output: "",
      plots: [],
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
