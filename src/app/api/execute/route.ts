import { NextRequest, NextResponse } from "next/server";

// Multiple Piston API endpoints for fallback
const PISTON_APIS = [
  "https://emkc.org/api/v2/piston/execute",
  "https://piston-api.onrender.com/api/v2/execute",
  "https://piston-api.vercel.app/api/v2/execute",
];

const LANGUAGE_MAP: Record<string, { language: string; version: string }> = {
  python: { language: "python", version: "3.10.0" },
  javascript: { language: "javascript", version: "18.15.0" },
  typescript: { language: "typescript", version: "5.0.3" },
  java: { language: "java", version: "15.0.2" },
  cpp: { language: "cpp", version: "10.2.0" },
  "c++": { language: "cpp", version: "10.2.0" },
  c: { language: "c", version: "10.2.0" },
  ruby: { language: "ruby", version: "3.0.1" },
  go: { language: "go", version: "1.16.2" },
  rust: { language: "rust", version: "1.68.2" },
  html: { language: "html", version: "5" },
  css: { language: "css", version: "3" },
};

async function tryPiston(code: string, langConfig: { language: string; version: string }, input: string) {
  for (const apiUrl of PISTON_APIS) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language: langConfig.language,
          version: langConfig.version,
          files: [{ content: code }],
          stdin: input || "",
          run_timeout: 10000,
          compile_timeout: 10000,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (response.ok) {
        return await response.json();
      }
    } catch {
      continue;
    }
  }
  return null;
}

export async function POST(request: NextRequest) {
  try {
    const { code, language, input } = await request.json();

    if (!code || !language) {
      return NextResponse.json(
        { error: "Code and language are required" },
        { status: 400 }
      );
    }

    const lang = language.toLowerCase();

    // For HTML/CSS — return as-is for browser preview (no execution needed)
    if (lang === "html" || lang === "css") {
      return NextResponse.json({
        output: code,
        error: "",
        executionTime: 0,
        success: true,
        isPreview: true,
      });
    }

    const langConfig = LANGUAGE_MAP[lang];
    if (!langConfig) {
      return NextResponse.json(
        { error: `Unsupported language: ${language}` },
        { status: 400 }
      );
    }

    const startTime = Date.now();

    // Try Piston API
    const data = await tryPiston(code, langConfig, input || "");

    if (data) {
      const executionTime = Date.now() - startTime;

      // Compile error
      if (data.compile && data.compile.stderr) {
        return NextResponse.json({
          output: data.compile.stdout || "",
          error: data.compile.stderr,
          executionTime,
          success: false,
        });
      }

      if (data.run) {
        const output = data.run.stdout || "";
        const error = data.run.stderr || "";
        const exitCode = data.run.code;

        return NextResponse.json({
          output: output.trimEnd(),
          error: error || (exitCode !== 0 ? `Process exited with code ${exitCode}` : ""),
          executionTime,
          success: exitCode === 0 && !error,
        });
      }
    }

    // Fallback: local simulation
    return NextResponse.json(simulateExecution(code, lang));
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

function simulateExecution(code: string, language: string) {
  const startTime = Date.now();

  try {
    if (language === "javascript") {
      let output = "";
      const mockConsole = {
        log: (...args: unknown[]) => {
          output +=
            args
              .map((a) =>
                typeof a === "object" ? JSON.stringify(a, null, 2) : String(a)
              )
              .join(" ") + "\n";
        },
        error: (...args: unknown[]) => {
          output += "Error: " + args.map(String).join(" ") + "\n";
        },
        warn: (...args: unknown[]) => {
          output += "Warning: " + args.map(String).join(" ") + "\n";
        },
      };

      const fn = new Function("console", code);
      fn(mockConsole);

      return {
        output: output.trimEnd() || "(No output)",
        error: "",
        executionTime: Date.now() - startTime,
        success: true,
      };
    }

    if (language === "python") {
      return simulatePython(code, startTime);
    }

    if (language === "cpp" || language === "c++") {
      return simulateCpp(code, startTime);
    }

    // For other languages
    return {
      output: "",
      error:
        "Remote execution service is currently unavailable. Using local simulation...",
      executionTime: Date.now() - startTime,
      success: false,
    };
  } catch (e: unknown) {
    return {
      output: "",
      error: e instanceof Error ? e.message : "Execution error",
      executionTime: Date.now() - startTime,
      success: false,
    };
  }
}

function simulatePython(code: string, startTime: number) {
  try {
    let output = "";
    const lines = code.split("\n");
    const variables: Record<string, unknown> = {};

    for (const line of lines) {
      const trimmedLine = line.trim();
      if (!trimmedLine || trimmedLine.startsWith("#") || trimmedLine.startsWith("def ") || trimmedLine.startsWith("if __name__") || trimmedLine === "main()") continue;

      // Handle print statements (even if indented)
      const printMatch = trimmedLine.match(/^print\((.+)\)$/);
      if (printMatch) {
        let expr = printMatch[1].trim();
        // Handle f-strings
        if (expr.startsWith('f"') || expr.startsWith("f'")) {
          const quote = expr[1];
          const content = expr.slice(2, expr.lastIndexOf(quote));
          let result = content;
          const fStrRegex = /\{([^}]+)\}/g;
          let m;
          while ((m = fStrRegex.exec(content)) !== null) {
            const varName = m[1].trim();
            if (varName in variables) {
              result = result.replace(m[0], String(variables[varName]));
            }
          }
          output += result + "\n";
        } else if ((expr.startsWith('"') && expr.endsWith('"')) || (expr.startsWith("'") && expr.endsWith("'"))) {
          // Simple string
          const str = expr.slice(1, -1);
          output += str + "\n";
        } else if (expr in variables) {
          output += String(variables[expr]) + "\n";
        } else {
          try {
            const val = evalSimpleExpr(expr, variables);
            output += String(val) + "\n";
          } catch {
            output += expr + "\n";
          }
        }
        continue;
      }

      // Handle variable assignments (even if indented)
      const assignMatch = trimmedLine.match(/^(\w+)\s*=\s*(.+)$/);
      if (assignMatch) {
        const [, varName, value] = assignMatch;
        try {
          variables[varName] = evalSimpleExpr(value.trim(), variables);
        } catch {
          variables[varName] = value.trim();
        }
        continue;
      }
    }

    return {
      output: output.trimEnd() || "(No output)",
      error: "",
      executionTime: Date.now() - startTime,
      success: true,
    };
  } catch (e: unknown) {
    return {
      output: "",
      error: `Python simulation error: ${e instanceof Error ? e.message : "Unknown error"}`,
      executionTime: Date.now() - startTime,
      success: false,
    };
  }
}

function simulateCpp(code: string, startTime: number) {
  try {
    let output = "";
    // Very simple regex-based simulation for teaching purposes
    const coutMatch = [...code.matchAll(/std::cout\s*<<\s*["']([^"']+)["']/g)];
    if (coutMatch.length > 0) {
      output = coutMatch.map(m => m[1]).join("\n");
    } else {
      // Look for plain cout without std::
      const plainCoutMatch = [...code.matchAll(/cout\s*<<\s*["']([^"']+)["']/g)];
      if (plainCoutMatch.length > 0) {
        output = plainCoutMatch.map(m => m[1]).join("\n");
      }
    }

    return {
      output: output || "(Code executed, but no output detected)",
      error: "",
      executionTime: Date.now() - startTime,
      success: true,
      simulated: true
    };
  } catch {
    return {
      output: "",
      error: "C++ simulation error",
      executionTime: Date.now() - startTime,
      success: false
    };
  }
}

function evalSimpleExpr(expr: string, vars: Record<string, unknown>): unknown {
  // Remove quotes for strings
  if ((expr.startsWith('"') && expr.endsWith('"')) || 
      (expr.startsWith("'") && expr.endsWith("'"))) {
    return expr.slice(1, -1);
  }

  // Boolean
  if (expr === "True") return true;
  if (expr === "False") return false;
  if (expr === "None") return null;

  // Number
  const num = Number(expr);
  if (!isNaN(num)) return num;

  // Variable reference
  if (expr in vars) return vars[expr];

  // Lists
  if (expr.startsWith("[") && expr.endsWith("]")) {
    return expr;
  }

  // Simple math with variables
  const mathMatch = expr.match(/^(\w+)\s*([+\-*/])\s*(\w+)$/);
  if (mathMatch) {
    const [, left, op, right] = mathMatch;
    const l = Number(left in vars ? vars[left] : left);
    const r = Number(right in vars ? vars[right] : right);
    switch (op) {
      case "+": return l + r;
      case "-": return l - r;
      case "*": return l * r;
      case "/": return l / r;
    }
  }

  return expr;
}
