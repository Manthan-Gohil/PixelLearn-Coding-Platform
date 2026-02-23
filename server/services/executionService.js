const { PISTON_API_URL, LANGUAGE_MAP } = require("../config/config");

const executeCode = async (code, language, input) => {
    const langConfig = LANGUAGE_MAP[language.toLowerCase()];
    if (!langConfig) {
        throw new Error(`Unsupported language: ${language}`);
    }

    const startTime = Date.now();
    try {
        const response = await fetch(PISTON_API_URL, {
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
            return {
                output: (data.run.stdout || "").trimEnd(),
                error: data.run.stderr || "",
                executionTime,
                success: data.run.code === 0,
            };
        } else if (data.compile && data.compile.stderr) {
            return {
                output: "",
                error: data.compile.stderr,
                executionTime: Date.now() - startTime,
                success: false,
            };
        } else {
            return {
                output: "",
                error: "Execution failed",
                executionTime: Date.now() - startTime,
                success: false,
            };
        }
    } catch (error) {
        return {
            output: "",
            error: "Execution service unavailable",
            executionTime: Date.now() - startTime,
            success: false,
        };
    }
};

module.exports = {
    executeCode
};
