# PixelLearn Architecture Guidelines

This document defines the shared structure used across feature modules (`dashboard`, `courses`, `playground`, `pricing`, `ai-tools`).

## Layer Responsibilities

- `src/app/**` (route layer)
  - Compose page-level layout and feature entry components.
  - Keep route files thin.
  - Avoid embedding feature constants, long helper logic, or large local types.

- `src/components/<feature>/**` (UI layer)
  - Presentational and interaction-focused UI.
  - Receive data/actions through props or approved hooks.
  - Do not contain duplicated API-call helpers across sibling components.

- `src/hooks/**` (behavior/data hooks)
  - Reusable stateful logic.
  - Feature-specific API wrappers (e.g., `useAIApi`) belong here.

- `src/utils/**` (pure helpers)
  - Side-effect-free transformation/computation functions.
  - Shared parsing, filtering, and derivation helpers.

- `src/constants/**` (static configuration)
  - Static arrays/maps, labels, tab configs, magic numbers.
  - Keep one source of truth for reusable constants.

- `src/types/**` (type contracts)
  - Feature-local type contracts (`types/<feature>.ts`) and shared core types.
  - Prefer `import type` where runtime values are not required.

## Import Boundary Rules

1. UI components should import types from `src/types/**` rather than `src/store` re-exports.
2. Route files can depend on store hooks (`useApp`), but leaf components should remain store-agnostic unless required.
3. Avoid duplicate constants across features; reuse global constants when domain matches.
4. Keep imports directional: route -> feature components/hooks/utils/constants/types.
5. Prefer feature-local constants/types for feature-specific values.

## Refactor Checklist (No UI/Behavior Change)

- Move inline static arrays to `constants/<feature>.ts`.
- Move repeated interfaces/unions to `types/<feature>.ts`.
- Move pure helper logic to `utils/<feature>.ts`.
- Remove duplicate API caller code into reusable hook(s).
- Replace loose `any` with typed contracts.
- Validate changed files with diagnostics after refactor.

## Conventions

- Keep naming explicit and feature-prefixed where useful (`AI_TOOL_TABS`, `XP_MILESTONES`).
- Use `type` imports for type-only dependencies.
- Preserve existing visual output and runtime behavior during architecture cleanup passes.
