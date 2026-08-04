import type { LanguageStrategy } from "../types";

// ─── Java Strategy ───────────────────────────────────────────────────────────
// Uses OpenJDK 21 slim image.
//
// Java requires the filename to match the public class name. Since users
// typically write `public class Main`, the file must be named Main.java.
// The preprocess step strips `public` from `public class Main` because
// javac in a single-file context sometimes conflicts when the access
// modifier doesn't match expectations in sandboxed environments.

export const javaStrategy: LanguageStrategy = {
  language: "Java",
  dockerImage: "eclipse-temurin:21-jdk-jammy",
  filename: "Main.java",
  buildCommands: ["javac Main.java"],
  runCommand: ["java", "Main"],

  preprocess(code: string) {
    // Strip 'public' from 'public class Main' to avoid filename/class conflicts
    const processed = code.replace(/public\s+class\s+Main/g, "class Main");
    return { code: processed };
  },
};
