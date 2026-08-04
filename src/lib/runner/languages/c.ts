import type { LanguageStrategy } from "../types";

// ─── C Strategy ──────────────────────────────────────────────────────────────
// Uses GCC (same image as C++ since gcc:latest includes both gcc and g++).
// Compiles with -O2 optimization.

export const cStrategy: LanguageStrategy = {
  language: "C",
  dockerImage: "gcc:latest",
  filename: "main.c",
  buildCommands: ["gcc -O2 -o main main.c"],
  runCommand: ["./main"],
};
