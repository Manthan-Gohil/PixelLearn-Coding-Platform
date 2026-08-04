import type { LanguageStrategy, ExecutionResult, RunnerResult } from "../types";
import { PLOT_START_MARKER, PLOT_END_MARKER } from "../config";

// ─── Visualization Detection ─────────────────────────────────────────────────

const VIZ_LIBS = ["matplotlib", "seaborn", "plotly", "bokeh", "altair", "pygal"];

/**
 * Detects whether the Python code imports any visualization library.
 * When true, we inject plot-capture code that serializes matplotlib
 * figures to base64 PNGs in stdout.
 */
function hasPythonVisualization(code: string): boolean {
  return VIZ_LIBS.some((lib) =>
    new RegExp(`^\\s*(import|from)\\s+${lib}`, "m").test(code),
  );
}

/**
 * Injects matplotlib-agnostic plot-capture code around the user's source.
 *
 * The injected header:
 *   - Forces the Agg backend (file-based, no GUI) before any other import
 *   - Replaces plt.show() with a no-op so execution doesn't hang
 *
 * The injected footer:
 *   - After the user's code runs, iterates all open figures
 *   - Saves each as a base64-encoded PNG between sentinel markers
 *   - The markers are parsed out in postprocess()
 */
function injectPlotCapture(code: string): string {
  const header = `
import sys as _sys, io as _io, base64 as _b64

# Force non-interactive Agg backend before matplotlib is imported
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
 * Parses stdout to extract base64 plot images and clean text output.
 * Splits on the sentinel markers injected by injectPlotCapture().
 */
function parsePlotOutput(raw: string): { text: string; plots: string[] } {
  const plots: string[] = [];
  const textParts: string[] = [];

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

// ─── Python Strategy ─────────────────────────────────────────────────────────

/**
 * Python execution strategy.
 *
 * Uses python:3.12-slim (150MB vs 1GB+ for the full image).
 * Supports matplotlib plot capture via code injection.
 *
 * The _hasPlots flag is set during preprocess() and read during
 * postprocess() — we store it in a closure-scoped variable since
 * the strategy is a singleton.
 */
let _hasPlots = false;

export const pythonStrategy: LanguageStrategy = {
  language: "Python",
  dockerImage: "python:3.12-slim",
  filename: "main.py",
  runCommand: ["python", "main.py"],

  preprocess(code: string) {
    _hasPlots = hasPythonVisualization(code);
    if (_hasPlots) {
      return { code: injectPlotCapture(code), hasPlots: true };
    }
    return { code };
  },

  postprocess(result: ExecutionResult): RunnerResult {
    if (_hasPlots && result.stdout) {
      const { text, plots } = parsePlotOutput(result.stdout);
      return { ...result, stdout: text, plots };
    }
    return { ...result, plots: [] };
  },
};
