import type { LanguageStrategy } from "../types";
import { pythonStrategy } from "./python";
import { cppStrategy } from "./cpp";
import { cStrategy } from "./c";
import { javaStrategy } from "./java";

// ─── Language Registry ───────────────────────────────────────────────────────
// Maps language identifiers (as received from the frontend) to their
// execution strategies. Handles common aliases (e.g., "c++" → cpp).
//
// To add a new language:
//   1. Create a new strategy file in this directory (e.g., go.ts)
//   2. Import it here
//   3. Add one (or more) entries to the registry below
//
// That's it — no other files need to change.

const registry = new Map<string, LanguageStrategy>();

// ── Python ──────────────────────────────────────────────────────────────────
registry.set("python", pythonStrategy);

// ── C++ ─────────────────────────────────────────────────────────────────────
registry.set("cpp", cppStrategy);
registry.set("c++", cppStrategy);

// ── C ───────────────────────────────────────────────────────────────────────
registry.set("c", cStrategy);

// ── Java ────────────────────────────────────────────────────────────────────
registry.set("java", javaStrategy);

/**
 * Retrieves the execution strategy for a given language identifier.
 * Returns undefined if the language is not supported.
 */
export function getStrategy(language: string): LanguageStrategy | undefined {
  return registry.get(language.toLowerCase());
}

/**
 * Returns a list of all supported language identifiers.
 * Useful for error messages listing available languages.
 */
export function getSupportedLanguages(): string[] {
  // Deduplicate — some languages have aliases pointing to the same strategy
  const seen = new Set<LanguageStrategy>();
  const languages: string[] = [];

  for (const [key, strategy] of registry) {
    if (!seen.has(strategy)) {
      seen.add(strategy);
      languages.push(key);
    }
  }

  return languages;
}
