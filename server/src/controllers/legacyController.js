/**
 * Legacy route handlers for backward compatibility
 */

/**
 * Health check endpoint
 */
function handleHealthCheck(req, res) {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
}

/**
 * Code execution endpoint
 * Uses Piston API for running code
 */
async function handleCodeExecute(req, res) {
  const { code, language, input } = req.body;

  if (!code || !language) {
    return res
      .status(400)
      .json({ error: "Code and language are required" });
  }

  const LANGUAGE_MAP = {
    python: { language: "python", version: "3.10.0" },
    javascript: { language: "javascript", version: "18.15.0" },
    typescript: { language: "typescript", version: "5.0.3" },
    java: { language: "java", version: "15.0.2" },
    cpp: { language: "c++", version: "10.2.0" },
    c: { language: "c", version: "10.2.0" },
  };

  const langConfig = LANGUAGE_MAP[language.toLowerCase()];
  if (!langConfig) {
    return res
      .status(400)
      .json({ error: `Unsupported language: ${language}` });
  }

  const startTime = Date.now();

  try {
    const response = await fetch("https://emkc.org/api/v2/piston/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        language: langConfig.language,
        version: langConfig.version,
        files: [{ content: code }],
        stdin: input || "",
        run_timeout: 10000,
      }),
    });

    const data = await response.json();
    const executionTime = Date.now() - startTime;

    if (data.run) {
      res.json({
        output: (data.run.stdout || "").trimEnd(),
        error: data.run.stderr || "",
        executionTime,
        success: data.run.code === 0,
      });
    } else if (data.compile && data.compile.stderr) {
      res.json({
        output: "",
        error: data.compile.stderr,
        executionTime: Date.now() - startTime,
        success: false,
      });
    } else {
      res.json({
        output: "",
        error: "Execution failed",
        executionTime: Date.now() - startTime,
        success: false,
      });
    }
  } catch (error) {
    res.json({
      output: "",
      error: "Execution service unavailable",
      executionTime: Date.now() - startTime,
      success: false,
    });
  }
}

module.exports = {
  handleHealthCheck,
  handleCodeExecute,
};
