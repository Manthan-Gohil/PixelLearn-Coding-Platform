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

function normalizePath(path: string): string {
  return path.replace(/\\/g, "/").replace(/\/+/g, "/").replace(/^\//, "");
}

function dirname(path: string): string {
  const normalized = normalizePath(path);
  const idx = normalized.lastIndexOf("/");
  return idx >= 0 ? normalized.slice(0, idx) : "";
}

function joinPath(baseDir: string, target: string): string {
  const raw = normalizePath(`${baseDir}/${target}`);
  const parts = raw.split("/");
  const stack: string[] = [];

  for (const part of parts) {
    if (!part || part === ".") continue;
    if (part === "..") stack.pop();
    else stack.push(part);
  }

  return stack.join("/");
}

function resolveImportPath(
  fromPath: string,
  importPath: string,
  files: Record<string, string>,
): string | null {
  const normalizedFiles = Object.keys(files).map((file) => normalizePath(file));

  const candidates = [
    joinPath(dirname(fromPath), importPath),
    `${joinPath(dirname(fromPath), importPath)}.js`,
    `${joinPath(dirname(fromPath), importPath)}.jsx`,
    `${joinPath(dirname(fromPath), importPath)}.ts`,
    `${joinPath(dirname(fromPath), importPath)}.tsx`,
    `${joinPath(dirname(fromPath), importPath)}/index.js`,
    `${joinPath(dirname(fromPath), importPath)}/index.jsx`,
    `${joinPath(dirname(fromPath), importPath)}/index.ts`,
    `${joinPath(dirname(fromPath), importPath)}/index.tsx`,
  ];

  for (const candidate of candidates) {
    const idx = normalizedFiles.findIndex(
      (f) => f === normalizePath(candidate),
    );
    if (idx >= 0) {
      return Object.keys(files)[idx];
    }
  }

  return null;
}

function toSafeVarName(path: string): string {
  return `__module_${normalizePath(path).replace(/[^a-zA-Z0-9_]/g, "_")}`;
}

function transformModuleSource(
  path: string,
  source: string,
  files: Record<string, string>,
): { transformed: string; unresolved: string[] } {
  const unresolved: string[] = [];
  let transformed = source;

  transformed = transformed.replace(
    /import\s+([\s\S]*?)\s+from\s+['"]([^'"]+)['"];?/g,
    (full, specifiers: string, importPath: string) => {
      if (!importPath.startsWith(".")) {
        if (/^react(\/.*)?$/.test(importPath)) {
          return "";
        }
        unresolved.push(importPath);
        return `/* Unsupported external import: ${importPath} */`;
      }

      const resolved = resolveImportPath(path, importPath, files);
      if (!resolved) {
        unresolved.push(importPath);
        return `/* Unresolved import: ${importPath} */`;
      }

      const moduleVar = toSafeVarName(resolved);
      const spec = specifiers.trim();

      if (spec.startsWith("{")) {
        return `const ${spec} = ${moduleVar};`;
      }

      if (spec.startsWith("* as ")) {
        const alias = spec.replace("* as", "").trim();
        return `const ${alias} = ${moduleVar};`;
      }

      if (spec.includes("{")) {
        const [defaultImport, namedPart] = spec.split(",");
        return `const ${defaultImport.trim()} = ${moduleVar}.default; const ${namedPart.trim()} = ${moduleVar};`;
      }

      return `const ${spec} = ${moduleVar}.default;`;
    },
  );

  transformed = transformed.replace(
    /export\s+default\s+function\s+([a-zA-Z0-9_$]+)/,
    "function $1",
  );
  transformed = transformed.replace(
    /export\s+default\s+class\s+([a-zA-Z0-9_$]+)/,
    "class $1",
  );
  transformed = transformed.replace(
    /export\s+function\s+([a-zA-Z0-9_$]+)/g,
    "function $1",
  );
  transformed = transformed.replace(
    /export\s+const\s+([a-zA-Z0-9_$]+)/g,
    "const $1",
  );
  transformed = transformed.replace(
    /export\s+let\s+([a-zA-Z0-9_$]+)/g,
    "let $1",
  );
  transformed = transformed.replace(
    /export\s+var\s+([a-zA-Z0-9_$]+)/g,
    "var $1",
  );

  transformed = transformed.replace(
    /export\s+default\s+([a-zA-Z0-9_$]+);?/g,
    (_full, identifier: string) => {
      return `const __default_export__ = ${identifier};`;
    },
  );

  const defaultFunction = source.match(
    /export\s+default\s+function\s+([a-zA-Z0-9_$]+)/,
  )?.[1];
  const defaultClass = source.match(
    /export\s+default\s+class\s+([a-zA-Z0-9_$]+)/,
  )?.[1];
  const defaultIdentifier = source.match(
    /export\s+default\s+([a-zA-Z0-9_$]+);?/,
  )?.[1];

  const namedExports = [
    ...Array.from(source.matchAll(/export\s+function\s+([a-zA-Z0-9_$]+)/g)).map(
      (m) => m[1],
    ),
    ...Array.from(source.matchAll(/export\s+const\s+([a-zA-Z0-9_$]+)/g)).map(
      (m) => m[1],
    ),
    ...Array.from(source.matchAll(/export\s+let\s+([a-zA-Z0-9_$]+)/g)).map(
      (m) => m[1],
    ),
    ...Array.from(source.matchAll(/export\s+var\s+([a-zA-Z0-9_$]+)/g)).map(
      (m) => m[1],
    ),
  ];

  const exportListMatch = source.match(/export\s*\{([^}]+)\};?/);
  if (exportListMatch) {
    transformed = transformed.replace(/export\s*\{([^}]+)\};?/g, "");
    const names = exportListMatch[1]
      .split(",")
      .map((n) => n.trim())
      .filter(Boolean)
      .map((n) => (n.includes(" as ") ? n.split(" as ")[0].trim() : n));
    namedExports.push(...names);
  }

  const exportLines = new Set<string>();
  for (const name of namedExports) {
    exportLines.add(`exports.${name} = ${name};`);
  }

  if (defaultFunction) {
    exportLines.add(`exports.default = ${defaultFunction};`);
  } else if (defaultClass) {
    exportLines.add(`exports.default = ${defaultClass};`);
  } else if (defaultIdentifier) {
    exportLines.add(`exports.default = __default_export__;`);
  }

  return {
    transformed: `${transformed}\n${Array.from(exportLines).join("\n")}`,
    unresolved,
  };
}

function buildReactMultiFileScript(
  files: Record<string, string>,
  entryFile: string,
): { script: string; unresolved: string[] } {
  const visited = new Set<string>();
  const ordered: string[] = [];
  const unresolved: string[] = [];

  const visit = (filePath: string) => {
    const normalized = normalizePath(filePath);
    if (visited.has(normalized)) return;
    visited.add(normalized);

    const source = files[filePath];
    if (!source) return;

    const importMatches = Array.from(
      source.matchAll(/import\s+[\s\S]*?\s+from\s+['"]([^'"]+)['"];?/g),
    );
    for (const match of importMatches) {
      const importPath = match[1];
      if (!importPath.startsWith(".")) continue;
      const resolved = resolveImportPath(filePath, importPath, files);
      if (resolved) {
        visit(resolved);
      } else {
        unresolved.push(`${filePath} -> ${importPath}`);
      }
    }

    ordered.push(filePath);
  };

  visit(entryFile);

  const moduleDefs = ordered
    .map((filePath) => {
      const moduleVar = toSafeVarName(filePath);
      const { transformed, unresolved: moduleUnresolved } =
        transformModuleSource(filePath, files[filePath], files);
      unresolved.push(...moduleUnresolved.map((u) => `${filePath} -> ${u}`));
      return `const ${moduleVar} = (() => {\nconst exports = {};\n${transformed}\nreturn exports;\n})();`;
    })
    .join("\n\n");

  const entryModuleVar = toSafeVarName(entryFile);
  const script = `${moduleDefs}\n\nconst Root = ${entryModuleVar}.default || ${entryModuleVar}.App || null;`;

  return { script, unresolved };
}

export function buildPreviewHtml(
  code: string,
  language: string,
  files?: Record<string, string>,
  entryFile?: string,
): string {
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

    let injectedScript = cleanCode;
    let rootResolver = `const Root = (typeof ${componentName} !== 'undefined') ? ${componentName} : (typeof App !== 'undefined' ? App : null);`;
    let unresolvedImportComment = "";

    if (files && entryFile && files[entryFile]) {
      const bundle = buildReactMultiFileScript(files, entryFile);
      injectedScript = bundle.script;
      rootResolver = "";
      if (bundle.unresolved.length > 0) {
        unresolvedImportComment = `\nconsole.warn('Unresolved imports:', ${JSON.stringify(bundle.unresolved)});`;
      }
    }

    return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><script src="https://unpkg.com/react@18/umd/react.development.js"></script><script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script><script src="https://unpkg.com/@babel/standalone/babel.min.js"></script><script src="https://cdn.tailwindcss.com"></script><style>body { font-family: 'Inter', system-ui, sans-serif; margin: 0; background: #fff; }</style></head><body><div id="root"></div><script type="text/babel">const { useState, useEffect, useMemo, useCallback, useRef, useReducer, useContext } = React;\ntry {\n${injectedScript}\n\n${rootResolver}\nif (Root) {\n  ReactDOM.createRoot(document.getElementById('root')).render(<Root />);\n} else {\n  document.getElementById('root').innerHTML = '<div style="color:red;padding:20px;">No root component found. Export default from your entry file.</div>';\n}${unresolvedImportComment}\n} catch (error) {\n  document.getElementById('root').innerHTML = '<div style="color:red;padding:20px;">' + error.message + '</div>';\n  console.error(error);\n}</script></body></html>`;
  }

  return "";
}
