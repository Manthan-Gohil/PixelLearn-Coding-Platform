/**
 * Pyodide-based Python runner for PixelLearn.
 *
 * Runs Python entirely in the browser (WebAssembly) so that scientific
 * libraries like matplotlib, seaborn, numpy, pandas, scipy, and scikit-learn
 * are available without any server-side installation.
 *
 * The instance is cached globally so Pyodide is only downloaded once per
 * browser session (~10 MB on first use).
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PyodideResult {
  output: string;
  plots: string[]; // base64-encoded PNG strings
  error: string;
  success: boolean;
}

// ─── Singleton Loader ─────────────────────────────────────────────────────────

const PYODIDE_VERSION = "0.27.3";
const PYODIDE_CDN = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;

let _pyodideInstance: any = null;
let _loadingPromise: Promise<any> | null = null;

async function getPyodide(onStatus?: (msg: string) => void): Promise<any> {
  if (_pyodideInstance) return _pyodideInstance;
  if (_loadingPromise) return _loadingPromise;

  _loadingPromise = (async () => {
    // Inject the pyodide bootstrap script if not already present
    if (!(window as any).loadPyodide) {
      onStatus?.("Downloading Python runtime (~10 MB, one-time)…");
      await new Promise<void>((resolve, reject) => {
        const s = document.createElement("script");
        s.src = `${PYODIDE_CDN}pyodide.js`;
        s.onload = () => resolve();
        s.onerror = () => reject(new Error("Failed to load Pyodide script"));
        document.head.appendChild(s);
      });
    }

    onStatus?.("Initialising Python environment…");
    _pyodideInstance = await (window as any).loadPyodide({ indexURL: PYODIDE_CDN });
    return _pyodideInstance;
  })();

  try {
    return await _loadingPromise;
  } catch (e) {
    _loadingPromise = null; // allow retry on next call
    throw e;
  }
}

// ─── Package Detection ────────────────────────────────────────────────────────

const VIZ_LIBS = [
  "matplotlib",
  "seaborn",
  "plotly",
  "bokeh",
  "altair",
  "pygal",
];

/** Returns true when the code imports any recognised visualization library. */
export function isPythonVisualizationCode(code: string): boolean {
  return VIZ_LIBS.some((lib) =>
    new RegExp(`^\\s*(import|from)\\s+${lib}`, "m").test(code),
  );
}

/** Returns an array of Pyodide-compatible package names inferred from imports. */
function detectPackages(code: string): string[] {
  const pkgs: string[] = [];
  const add = (lib: string, pkgName: string) => {
    if (new RegExp(`^\\s*(import|from)\\s+${lib}`, "m").test(code))
      pkgs.push(pkgName);
  };

  add("matplotlib", "matplotlib");
  add("seaborn", "seaborn");
  add("numpy", "numpy");
  add("pandas", "pandas");
  add("scipy", "scipy");
  add("sklearn", "scikit-learn");
  add("PIL|pillow", "Pillow");
  add("statsmodels", "statsmodels");

  return [...new Set(pkgs)];
}

// ─── Runner ───────────────────────────────────────────────────────────────────

/**
 * Runs `code` inside Pyodide, captures stdout/stderr, and extracts any
 * matplotlib figures as base64-encoded PNGs.
 *
 * @param code     Python source code to execute
 * @param stdin    Multi-line string simulating successive input() calls
 * @param onStatus Callback that receives live status messages for the UI
 */
export async function runPythonWithPyodide(
  code: string,
  stdin = "",
  onStatus?: (msg: string) => void,
): Promise<PyodideResult> {
  try {
    const pyodide = await getPyodide(onStatus);

    // ── 1. Install required packages ─────────────────────────────────────────
    const packages = detectPackages(code);
    if (packages.length > 0) {
      onStatus?.(`Installing: ${packages.join(", ")}…`);
      try {
        await pyodide.loadPackage(packages, { messageCallback: () => {} });
      } catch {
        // Fall back to micropip for packages not in the standard set
        await pyodide.runPythonAsync(`
import micropip
for _pkg in ${JSON.stringify(packages)}:
    try:
        await micropip.install(_pkg)
    except Exception:
        pass
`);
      }
    }

    // ── 2. Capture stdout / stderr ───────────────────────────────────────────
    let textOutput = "";
    pyodide.setStdout({
      batched: (s: string) => {
        textOutput += s + "\n";
      },
    });
    pyodide.setStderr({
      batched: (s: string) => {
        textOutput += s + "\n";
      },
    });

    // ── 3. Mock input() with stdin lines ─────────────────────────────────────
    if (stdin.trim()) {
      const lines = stdin.split("\n");
      pyodide.globals.set("__stdin_lines__", pyodide.toPy(lines));
      await pyodide.runPythonAsync(`
import builtins as _bi
_sl = list(__stdin_lines__)
_si = [0]
def _mock_input(prompt=''):
    val = _sl[_si[0]] if _si[0] < len(_sl) else ''
    _si[0] += 1
    return val
_bi.input = _mock_input
`);
    }

    // ── 4. Set matplotlib to non-interactive Agg backend ─────────────────────
    await pyodide.runPythonAsync(`
try:
    import matplotlib as _mpl
    _mpl.use('Agg')
    import matplotlib.pyplot as _plt_pre
    _plt_pre.show = lambda *a, **kw: None
except Exception:
    pass
`);

    // ── 5. Execute user code ─────────────────────────────────────────────────
    onStatus?.("Running…");
    try {
      await pyodide.runPythonAsync(code);
    } catch (err: any) {
      return { output: textOutput.trim(), plots: [], error: String(err), success: false };
    }

    // ── 6. Capture all open matplotlib figures ────────────────────────────────
    const plotsProxy = await pyodide.runPythonAsync(`
_captured = []
try:
    import matplotlib.pyplot as _pc, io as _io2, base64 as _b64v
    for _fn in _pc.get_fignums():
        _buf = _io2.BytesIO()
        _pc.figure(_fn).savefig(_buf, format='png', dpi=120, bbox_inches='tight')
        _buf.seek(0)
        _captured.append(_b64v.b64encode(_buf.read()).decode('ascii'))
        _pc.close(_fn)
except Exception:
    pass
_captured
`);

    const plots: string[] = plotsProxy ? Array.from(plotsProxy.toJs?.() ?? plotsProxy) : [];

    return {
      output: textOutput.trim(),
      plots,
      error: "",
      success: true,
    };
  } catch (err: any) {
    return {
      output: "",
      plots: [],
      error: `Failed to initialise Python runtime: ${String(err)}`,
      success: false,
    };
  }
}
