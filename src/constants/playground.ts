// Languages that show a browser preview panel (instead of output panel)
export const PREVIEW_LANGUAGES = [
  "html",
  "css",
  "jsx",
  "tsx",
  "reactjs",
] as const;

// Languages that support multi-file workspace (only React-based)
export const MULTI_FILE_LANGUAGES = [
  "jsx",
  "tsx",
  "reactjs",
] as const;

// Keep FRONTEND_LANGUAGES as alias for PREVIEW_LANGUAGES for backward compatibility
export const FRONTEND_LANGUAGES = PREVIEW_LANGUAGES;

export const PREVIEW_DEBOUNCE_MS = 500;

export const PROCTOR_ALERT_FREQUENCY = 3;
