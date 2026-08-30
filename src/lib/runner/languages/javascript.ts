import type { LanguageStrategy } from "../types";

// ─── JavaScript (Node.js) Strategy ──────────────────────────────────────────
// Executes JavaScript code using Node.js 20 inside a Docker container.

export const javascriptStrategy: LanguageStrategy = {
  language: "JavaScript",
  dockerImage: "node:20-slim",
  filename: "main.js",
  runCommand: ["node", "main.js"],
};
