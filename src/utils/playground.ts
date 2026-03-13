import { FRONTEND_LANGUAGES } from "@/constants/playground";
import type { Exercise } from "@/types";
import type { ExerciseNavigation } from "@/types/playground";

export function isFrontendLanguage(language: string): boolean {
  return FRONTEND_LANGUAGES.includes(
    language.toLowerCase() as (typeof FRONTEND_LANGUAGES)[number],
  );
}

export function getExerciseNavigation(
  allExercises: Exercise[],
  exerciseId: string,
): ExerciseNavigation {
  const exerciseIndex = allExercises.findIndex(
    (exercise) => exercise.id === exerciseId,
  );
  const prevExercise =
    exerciseIndex > 0 ? allExercises[exerciseIndex - 1] : null;
  const nextExercise =
    exerciseIndex >= 0 && exerciseIndex < allExercises.length - 1
      ? allExercises[exerciseIndex + 1]
      : null;

  return {
    exerciseIndex,
    prevExercise,
    nextExercise,
  };
}

export function buildPreviewHtml(code: string, language: string): string {
  const normalizedLanguage = language.toLowerCase();

  if (normalizedLanguage === "html") {
    if (code.includes("<html") || code.includes("<!DOCTYPE")) {
      return code;
    }
    return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><script src="https://cdn.tailwindcss.com"></script><style>body { font-family: 'Inter', system-ui, sans-serif; padding: 20px; margin: 0; background: #fff; color: #1a1a1a; } * { box-sizing: border-box; }</style></head><body>${code}</body></html>`;
  }

  if (normalizedLanguage === "css") {
    return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><style>body { font-family: 'Inter', system-ui, sans-serif; padding: 20px; margin: 0; background: #fff; color: #1a1a1a; } ${code}</style></head><body><div class="container"><header><h1>CSS Preview</h1><p>Mastering Layouts</p></header><main><section class="card"><h2>Card Title</h2><p>This is a preview element to test your CSS.</p><button>Action Button</button></section></main></div></body></html>`;
  }

  if (
    ["jsx", "tsx", "javascript", "typescript", "reactjs"].includes(
      normalizedLanguage,
    )
  ) {
    const isReactCode =
      code.includes("React") ||
      code.includes("<") ||
      ["jsx", "tsx", "reactjs"].includes(normalizedLanguage);

    if (!isReactCode) {
      return `<!DOCTYPE html><html><body><div id="root"></div><script>${code}<\/script></body></html>`;
    }

    let cleanCode = code.replace(/import\s+.*?\s+from\s+['"].*?['"];?/g, "");
    let componentName = "App";

    const functionMatch = cleanCode.match(
      /export\s+default\s+function\s+([a-zA-Z0-9_$]+)/,
    );
    const classMatch = cleanCode.match(
      /export\s+default\s+class\s+([a-zA-Z0-9_$]+)/,
    );
    const identifierMatch = cleanCode.match(
      /export\s+default\s+([a-zA-Z0-9_$]+);?$/,
    );

    if (functionMatch) {
      componentName = functionMatch[1];
      cleanCode = cleanCode.replace(/export\s+default\s+function/, "function");
    } else if (classMatch) {
      componentName = classMatch[1];
      cleanCode = cleanCode.replace(/export\s+default\s+class/, "class");
    } else if (identifierMatch) {
      componentName = identifierMatch[1];
      cleanCode = cleanCode.replace(/export\s+default\s+[a-zA-Z0-9_$]+;?$/, "");
    } else {
      cleanCode = cleanCode.replace(/export\s+default\s+/, "const App = ");
    }

    return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><script src="https://unpkg.com/react@18/umd/react.development.js"></script><script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script><script src="https://unpkg.com/@babel/standalone/babel.min.js"></script><script src="https://cdn.tailwindcss.com"></script><style>body { font-family: 'Inter', system-ui, sans-serif; margin: 0; background: #fff; }</style></head><body><div id="root"></div><script type="text/babel">const { useState, useEffect, useMemo, useCallback, useRef, useReducer, useContext } = React; try { ${cleanCode} const Root = (typeof ${componentName} !== 'undefined') ? ${componentName} : (typeof App !== 'undefined' ? App : null); if (Root) { ReactDOM.createRoot(document.getElementById('root')).render(<Root />); } else { document.getElementById('root').innerHTML = '<div style="color:red;padding:20px;">No default export or "${componentName}" component found.</div>'; } } catch (error) { document.getElementById('root').innerHTML = '<div style="color:red;padding:20px;">' + error.message + '</div>'; console.error(error); }</script></body></html>`;
  }

  return "";
}
