import type { LanguageStrategy } from "../types";

// ─── C++ Strategy ────────────────────────────────────────────────────────────
// Uses GCC with C++20 and -O2 optimization.
// The build step compiles to a binary, then the run step executes it.

export const cppStrategy: LanguageStrategy = {
  language: "C++",
  dockerImage: "gcc:latest",
  filename: "main.cpp",
  buildCommands: ["g++ -O2 -std=c++20 -o main main.cpp"],
  runCommand: ["./main"],
};
