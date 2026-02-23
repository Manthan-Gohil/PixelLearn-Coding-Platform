"use client";

import { use, useState, useCallback, useRef, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { AppProvider, useApp } from "@/store";
import { COURSES } from "@/services/data";
import { Course, Chapter, Exercise } from "@/types";
import {
    Play,
    RotateCcw,
    CheckCircle2,
    ArrowLeft,
    ArrowRight,
    Lightbulb,
    BookOpen,
    Terminal,
    Loader2,
    Zap,
    Code2,
    Eye,
    EyeOff,
    X,
    Trophy,
    Globe,
    PanelLeftClose,
    PanelRightClose,
} from "lucide-react";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full flex items-center justify-center bg-surface-alt">
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
        </div>
    ),
});

// Frontend languages that need browser preview
const FRONTEND_LANGUAGES = ["html", "css", "jsx", "tsx", "reactjs"];

function isFrontendLanguage(lang: string) {
    return FRONTEND_LANGUAGES.includes(lang.toLowerCase());
}

function PlaygroundContent({
    courseId,
    exerciseId,
}: {
    courseId: string;
    exerciseId: string;
}) {
    const { user, completeExercise, isExerciseCompleted, enrollCourse } = useApp();
    const [course, setCourse] = useState<Course | null>(null);
    const [exercise, setExercise] = useState<Exercise | null>(null);
    const [loading, setLoading] = useState(true);
    const [code, setCode] = useState("");
    const [output, setOutput] = useState("");
    const [isRunning, setIsRunning] = useState(false);
    const [showHints, setShowHints] = useState(false);
    const [currentHintIndex, setCurrentHintIndex] = useState(0);
    const [showTheory, setShowTheory] = useState(true);
    const [showSuccess, setShowSuccess] = useState(false);
    const [language, setLanguage] = useState("python");
    const [showTheoryPanel, setShowTheoryPanel] = useState(true);
    const [previewHtml, setPreviewHtml] = useState("");
    const iframeRef = useRef<HTMLIFrameElement>(null);

    useEffect(() => {
        fetch("/api/courses")
            .then((res) => res.json())
            .then((data) => {
                const foundCourse = data.find((c: Course) => c.id === courseId);
                if (foundCourse) {
                    setCourse(foundCourse);
                    const allEx = foundCourse.chapters.flatMap((ch: Chapter) => ch.exercises);
                    const foundEx = allEx.find((e: Exercise) => e.id === exerciseId);
                    if (foundEx) {
                        setExercise(foundEx);
                    }
                }
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [courseId, exerciseId]);

    const allExercises = course?.chapters.flatMap((ch: Chapter) => ch.exercises) || [];
    const exerciseIndex = allExercises.findIndex((e: any) => e.id === exerciseId);
    const prevExercise = exerciseIndex > 0 ? allExercises[exerciseIndex - 1] : null;
    const nextExercise =
        exerciseIndex < allExercises.length - 1
            ? allExercises[exerciseIndex + 1]
            : null;

    const completed = exercise ? isExerciseCompleted(exercise.id) : false;
    const isFrontend = exercise ? isFrontendLanguage(exercise.language) : false;

    // Initialize code on exercise change
    useEffect(() => {
        if (exercise) {
            setCode(exercise.starterCode);
            setLanguage(exercise.language);
            setOutput("");
            setPreviewHtml("");
            setShowHints(false);
            setCurrentHintIndex(0);
        }
    }, [exercise?.id]); // eslint-disable-line react-hooks/exhaustive-deps

    // Auto-update preview for frontend languages
    useEffect(() => {
        if (isFrontend && code) {
            const timer = setTimeout(() => {
                updatePreview(code, language);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [code, isFrontend, language]);

    const updatePreview = useCallback((htmlCode: string, lang: string) => {
        let fullHtml = "";
        const normalizedLang = lang.toLowerCase();

        if (normalizedLang === "html") {
            if (htmlCode.includes("<html") || htmlCode.includes("<!DOCTYPE")) {
                fullHtml = htmlCode;
            } else {
                fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { font-family: 'Inter', system-ui, sans-serif; padding: 20px; margin: 0; background: #fff; color: #1a1a1a; }
    * { box-sizing: border-box; }
  </style>
</head>
<body>${htmlCode}</body>
</html>`;
            }
        } else if (normalizedLang === "css") {
            fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: 'Inter', system-ui, sans-serif; padding: 20px; margin: 0; background: #fff; color: #1a1a1a; }
    ${htmlCode}
  </style>
</head>
<body>
  <div class="container">
    <header><h1>CSS Preview</h1><p>Mastering Layouts</p></header>
    <main>
      <section class="card"><h2>Card Title</h2><p>This is a preview element to test your CSS.</p><button>Action Button</button></section>
    </main>
  </div>
</body>
</html>`;
        } else if (["jsx", "tsx", "javascript", "typescript"].includes(normalizedLang)) {
            // Check if it's React code (imports React or uses JSX)
            const isReact = htmlCode.includes("React") || htmlCode.includes("<") || normalizedLang === "jsx" || normalizedLang === "tsx";

            if (isReact) {
                fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { font-family: 'Inter', system-ui, sans-serif; margin: 0; background: #f8fafc; color: #0f172a; }
  </style>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel">
    /** @jsx React.createElement */
    /** @jsxFrag React.Fragment */
    try {
      // Clean previous logs
      window.parent.postMessage({ type: 'console', method: 'clear' }, '*');
      
      // Override console.log to send messages back to parent
      const originalLog = console.log;
      console.log = (...args) => {
        window.parent.postMessage({ 
          type: 'console', 
          method: 'log', 
          content: args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ') 
        }, '*');
        originalLog.apply(console, args);
      };

      // The code provided by the user
      ${htmlCode.replace(/import\s+React.*\s+from\s+['"]react['"];?/g, '') // Remove React imports
                        .replace(/export\s+default\s+/g, 'const App = ') // Convert export default to local var
                    }
      
      // Auto-mount if App is defined
      if (typeof App !== 'undefined') {
        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(<App />);
      } else {
          // If no App, look for any other component to mount or show warning
          document.getElementById('root').innerHTML = '<div style="padding: 2.5rem; text-align: center; color: #64748b; border: 2px dashed #e2e8f0; margin: 1rem; border-radius: 1rem;">No export default App found. Please export a default component named App.</div>';
      }
    } catch (err) {
      console.error(err);
      document.getElementById('root').innerHTML = '<div style="color: #ef4444; padding: 1.5rem; background: #fef2f2; border: 1px solid #fee2e2; margin: 1rem; border-radius: 0.5rem; font-family: monospace; font-size: 14px;"><strong>Transpilation Error:</strong><br/>' + err.message + '</div>';
    }
  </script>
</body>
</html>`;
            } else {
                // Regular JS preview
                fullHtml = `<!DOCTYPE html><html><body><div id="root"></div><script>${htmlCode}<\/script></body></html>`;
            }
        }
        setPreviewHtml(fullHtml);
    }, []);

    const runCode = useCallback(async () => {
        if (!exercise || isRunning) return;
        setIsRunning(true);
        setOutput("");

        // For frontend languages, update preview
        if (isFrontend) {
            updatePreview(code, language);
            setOutput("✓ Preview updated successfully");
            setIsRunning(false);
            return;
        }

        try {
            const response = await fetch("/api/execute", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code, language: exercise.language }),
            });

            const result = await response.json();

            if (result.error && result.error.trim()) {
                setOutput(`Error: ${result.error}\n\n⏱ Execution time: ${result.executionTime}ms`);
            } else if (result.output !== undefined) {
                setOutput(
                    `${result.output}\n\n✓ Execution time: ${result.executionTime}ms`
                );
            } else {
                setOutput("(No output)");
            }
        } catch {
            // Fallback: basic local execution for demo
            try {
                if (exercise.language === "javascript") {
                    let capturedOutput = "";
                    const mockConsole = {
                        log: (...args: unknown[]) => {
                            capturedOutput +=
                                args
                                    .map((a) =>
                                        typeof a === "object" ? JSON.stringify(a, null, 2) : String(a)
                                    )
                                    .join(" ") + "\n";
                        },
                    };
                    const fn = new Function("console", code);
                    fn(mockConsole);
                    setOutput(capturedOutput.trimEnd() || "(No output)");
                } else {
                    setOutput(
                        "⚠ Code execution service unavailable. Please try again."
                    );
                }
            } catch (e: unknown) {
                setOutput(
                    `Error: ${e instanceof Error ? e.message : "Unknown error"}`
                );
            }
        }

        setIsRunning(false);
    }, [code, exercise, isRunning, isFrontend, language, updatePreview]);

    const handleMarkComplete = useCallback(() => {
        if (exercise && !completed) {
            completeExercise(exercise.id, exercise.xpReward);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        }
    }, [exercise, completed, completeExercise]);

    const resetCode = useCallback(() => {
        if (exercise) {
            setCode(exercise.starterCode);
            setOutput("");
            setPreviewHtml("");
        }
    }, [exercise]);

    // Auto-enroll if visiting playground
    useEffect(() => {
        if (courseId && !user.enrolledCourses.includes(courseId)) {
            enrollCourse(courseId);
        }
    }, [courseId, user.enrolledCourses, enrollCourse]);

    if (!course || !exercise) {
        return (
            <main className="min-h-screen bg-surface flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-text-primary mb-2">
                        Exercise Not Found
                    </h1>
                    <Link href="/courses" className="text-primary-light hover:underline">
                        ← Back to Courses
                    </Link>
                </div>
            </main>
        );
    }

    // Get Monaco language
    const monacoLang = language === "cpp" ? "cpp" : language === "jsx" ? "javascript" : language === "tsx" ? "typescript" : language === "reactjs" ? "javascript" : language;

    return (
        <div className="h-screen bg-surface flex flex-col overflow-hidden">
            {/* Top Bar */}
            <div className="h-14 border-b border-border bg-surface-alt/80 flex items-center justify-between px-4 shrink-0">
                <div className="flex items-center gap-4">
                    <Link
                        href={`/courses/${courseId}`}
                        className="flex items-center gap-1 text-text-secondary hover:text-text-primary text-sm transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span className="hidden sm:inline">{course.title}</span>
                    </Link>
                    <span className="text-border">|</span>
                    <h1 className="text-sm font-semibold text-text-primary truncate max-w-[300px]">
                        {exercise.title}
                    </h1>
                    {completed && (
                        <span className="flex items-center gap-1 text-xs text-success font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    {/* Toggle theory panel */}
                    <button
                        onClick={() => setShowTheoryPanel(!showTheoryPanel)}
                        className="p-1.5 rounded-lg hover:bg-surface-hover text-text-muted hover:text-text-primary transition-colors"
                        title={showTheoryPanel ? "Hide theory" : "Show theory"}
                    >
                        {showTheoryPanel ? (
                            <PanelLeftClose className="w-4 h-4" />
                        ) : (
                            <PanelRightClose className="w-4 h-4" />
                        )}
                    </button>
                    <span className="text-border">|</span>
                    {/* Nav Exercises */}
                    {prevExercise && (
                        <Link
                            href={`/playground/${courseId}/${prevExercise.id}`}
                            className="p-1.5 rounded-lg hover:bg-surface-hover text-text-muted hover:text-text-primary transition-colors"
                            title="Previous exercise"
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </Link>
                    )}
                    <span className="text-xs text-text-muted">
                        {exerciseIndex + 1} / {allExercises.length}
                    </span>
                    {nextExercise && (
                        <Link
                            href={`/playground/${courseId}/${nextExercise.id}`}
                            className="p-1.5 rounded-lg hover:bg-surface-hover text-text-muted hover:text-text-primary transition-colors"
                            title="Next exercise"
                        >
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    )}
                    <span className="text-border mx-1">|</span>
                    <span className="flex items-center gap-1 text-xs text-warning font-medium">
                        <Zap className="w-3 h-3" /> {exercise.xpReward} XP
                    </span>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left Panel - Theory/Problem */}
                {showTheoryPanel && (
                    <div
                        className={`border-r border-border flex flex-col overflow-hidden transition-all duration-300 ${isFrontend ? "w-1/4" : "w-1/2"
                            }`}
                    >
                        {/* Panel Tabs */}
                        <div className="flex items-center border-b border-border bg-surface-alt/50 shrink-0">
                            <button
                                onClick={() => setShowTheory(true)}
                                className={`px-4 py-2.5 text-sm font-medium transition-colors ${showTheory
                                    ? "text-primary-light border-b-2 border-primary"
                                    : "text-text-muted hover:text-text-primary"
                                    }`}
                            >
                                <span className="flex items-center gap-1.5">
                                    <BookOpen className="w-4 h-4" />
                                    Theory
                                </span>
                            </button>
                            <button
                                onClick={() => setShowTheory(false)}
                                className={`px-4 py-2.5 text-sm font-medium transition-colors ${!showTheory
                                    ? "text-primary-light border-b-2 border-primary"
                                    : "text-text-muted hover:text-text-primary"
                                    }`}
                            >
                                <span className="flex items-center gap-1.5">
                                    <Code2 className="w-4 h-4" />
                                    Problem
                                </span>
                            </button>
                        </div>

                        {/* Panel Content */}
                        <div className="flex-1 overflow-y-auto p-5">
                            {showTheory ? (
                                <div className="prose prose-invert prose-sm max-w-none">
                                    <div className="mb-6">
                                        <h2 className="text-lg font-bold text-text-primary mb-3">
                                            {exercise.title}
                                        </h2>
                                        <p className="text-text-secondary text-sm mb-4">
                                            {exercise.description}
                                        </p>
                                    </div>
                                    <div className="space-y-3">
                                        {exercise.theory.split("\n").map((line: string, i: number) => {
                                            if (line.startsWith("### ")) {
                                                return (
                                                    <h3
                                                        key={i}
                                                        className="text-base font-semibold text-text-primary mt-4"
                                                    >
                                                        {line.replace("### ", "")}
                                                    </h3>
                                                );
                                            }
                                            if (line.startsWith("```")) {
                                                return null;
                                            }
                                            if (line.startsWith("- ")) {
                                                return (
                                                    <div
                                                        key={i}
                                                        className="flex items-start gap-2 text-sm text-text-secondary"
                                                    >
                                                        <span className="text-primary-light mt-1">•</span>
                                                        <span>{line.replace("- ", "")}</span>
                                                    </div>
                                                );
                                            }
                                            if (line.trim()) {
                                                return (
                                                    <p
                                                        key={i}
                                                        className="text-sm text-text-secondary leading-relaxed"
                                                    >
                                                        {line}
                                                    </p>
                                                );
                                            }
                                            return <br key={i} />;
                                        })}
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-5">
                                    <div>
                                        <h3 className="text-base font-bold text-text-primary mb-2">
                                            Problem Statement
                                        </h3>
                                        <p className="text-text-secondary text-sm leading-relaxed">
                                            {exercise.problemStatement}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 gap-3">
                                        <div className="p-3 rounded-xl bg-surface-alt border border-border">
                                            <div className="text-xs font-medium text-text-muted mb-1">
                                                Input
                                            </div>
                                            <code className="text-sm text-text-primary font-mono">
                                                {exercise.inputExample}
                                            </code>
                                        </div>
                                        <div className="p-3 rounded-xl bg-surface-alt border border-border">
                                            <div className="text-xs font-medium text-text-muted mb-1">
                                                Expected Output
                                            </div>
                                            <code className="text-sm text-success font-mono">
                                                {exercise.outputExample}
                                            </code>
                                        </div>
                                    </div>

                                    {exercise.constraints.length > 0 && (
                                        <div>
                                            <h4 className="text-sm font-semibold text-text-primary mb-2">
                                                Constraints
                                            </h4>
                                            <ul className="space-y-1">
                                                {exercise.constraints.map((c: string, i: number) => (
                                                    <li
                                                        key={i}
                                                        className="flex items-start gap-2 text-sm text-text-secondary"
                                                    >
                                                        <span className="text-warning mt-0.5">⚠</span>
                                                        {c}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* Hints */}
                                    <div>
                                        <button
                                            onClick={() => setShowHints(!showHints)}
                                            className="flex items-center gap-2 text-sm font-medium text-primary-light hover:text-primary transition-colors"
                                        >
                                            {showHints ? (
                                                <EyeOff className="w-4 h-4" />
                                            ) : (
                                                <Eye className="w-4 h-4" />
                                            )}
                                            <Lightbulb className="w-4 h-4" />
                                            {showHints
                                                ? "Hide Hints"
                                                : `Show Hints (${exercise.hints.length})`}
                                        </button>
                                        {showHints && (
                                            <div className="mt-3 space-y-2">
                                                {exercise.hints
                                                    .slice(0, currentHintIndex + 1)
                                                    .map((hint: string, i: number) => (
                                                        <div
                                                            key={i}
                                                            className="p-3 rounded-lg bg-warning/5 border border-warning/20 text-sm text-text-secondary animate-fade-in"
                                                        >
                                                            <span className="font-medium text-warning">
                                                                Hint {i + 1}:
                                                            </span>{" "}
                                                            {hint}
                                                        </div>
                                                    ))}
                                                {currentHintIndex < exercise.hints.length - 1 && (
                                                    <button
                                                        onClick={() => setCurrentHintIndex((p) => p + 1)}
                                                        className="text-xs text-primary-light hover:text-primary"
                                                    >
                                                        Show next hint →
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Middle Panel - Code Editor */}
                <div
                    className={`flex flex-col overflow-hidden border-r border-border transition-all duration-300 ${isFrontend
                        ? showTheoryPanel
                            ? "w-[38%]"
                            : "w-1/2"
                        : showTheoryPanel
                            ? "w-1/2"
                            : "w-full"
                        }`}
                >
                    {/* Editor Toolbar */}
                    <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-surface-alt/50 shrink-0">
                        <div className="flex items-center gap-2">
                            <select
                                value={language}
                                onChange={(e) => setLanguage(e.target.value)}
                                className="px-2 py-1 rounded bg-surface-hover border border-border text-xs text-text-primary focus:outline-none"
                            >
                                <option value="python">Python</option>
                                <option value="javascript">JavaScript</option>
                                <option value="jsx">React (JSX)</option>
                                <option value="tsx">React (TSX)</option>
                                <option value="html">HTML</option>
                                <option value="css">CSS</option>
                                <option value="java">Java</option>
                                <option value="cpp">C++</option>
                            </select>
                            <button
                                onClick={resetCode}
                                className="flex items-center gap-1 px-2 py-1 rounded text-xs text-text-muted hover:text-text-primary hover:bg-surface-hover transition-colors"
                                title="Reset code"
                            >
                                <RotateCcw className="w-3.5 h-3.5" />
                                Reset
                            </button>
                        </div>
                        <div className="flex items-center gap-2">
                            {!completed && (
                                <button
                                    onClick={handleMarkComplete}
                                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border border-success/30 text-success hover:bg-success/10 transition-all"
                                >
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    Complete
                                </button>
                            )}
                            <button
                                onClick={runCode}
                                disabled={isRunning}
                                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold gradient-primary text-white hover:opacity-90 disabled:opacity-50 transition-all shadow-lg shadow-primary/20"
                            >
                                {isRunning ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                    <Play className="w-3.5 h-3.5" />
                                )}
                                {isRunning ? "Running..." : "Run Code"}
                            </button>
                        </div>
                    </div>

                    {/* Monaco Editor */}
                    <div className={`${isFrontend ? "flex-1" : "flex-1"} min-h-0`}>
                        <MonacoEditor
                            height="100%"
                            language={monacoLang}
                            value={code}
                            onChange={(value) => setCode(value || "")}
                            theme="vs-dark"
                            options={{
                                fontSize: 14,
                                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                                minimap: { enabled: false },
                                scrollBeyondLastLine: false,
                                padding: { top: 16 },
                                lineNumbersMinChars: 3,
                                renderLineHighlight: "line",
                                tabSize: 2,
                                insertSpaces: true,
                                wordWrap: "on",
                                automaticLayout: true,
                                smoothScrolling: true,
                                cursorBlinking: "smooth",
                                cursorSmoothCaretAnimation: "on",
                            }}
                        />
                    </div>

                    {/* Output Console - only for non-frontend languages */}
                    {!isFrontend && (
                        <div className="h-48 border-t border-border bg-surface-alt flex flex-col shrink-0">
                            <div className="flex items-center justify-between px-4 py-2 border-b border-border">
                                <div className="flex items-center gap-2 text-xs text-text-muted">
                                    <Terminal className="w-4 h-4" />
                                    Output Console
                                </div>
                                {output && (
                                    <button
                                        onClick={() => setOutput("")}
                                        className="p-1 rounded hover:bg-surface-hover text-text-muted hover:text-text-primary transition-colors"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                )}
                            </div>
                            <div className="flex-1 overflow-y-auto p-4 font-mono text-sm">
                                {output ? (
                                    <pre
                                        className={`whitespace-pre-wrap ${output.includes("Error") ? "text-danger" : "text-success"
                                            }`}
                                    >
                                        {output}
                                    </pre>
                                ) : (
                                    <span className="text-text-muted text-xs">
                                        Click &quot;Run Code&quot; to see output here...
                                    </span>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Panel - Browser Preview (frontend languages only) */}
                {isFrontend && (
                    <div
                        className={`flex flex-col overflow-hidden transition-all duration-300 ${showTheoryPanel ? "w-[38%]" : "w-1/2"
                            }`}
                    >
                        {/* Preview Header */}
                        <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-surface-alt/50 shrink-0">
                            <div className="flex items-center gap-2 text-xs text-text-muted">
                                <Globe className="w-4 h-4 text-primary-light" />
                                <span className="font-medium text-text-primary">Browser Preview</span>
                            </div>
                            <div className="flex items-center gap-1">
                                {/* Browser dots */}
                                <div className="flex items-center gap-1 mr-2">
                                    <div className="w-2.5 h-2.5 rounded-full bg-danger/60" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-warning/60" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-success/60" />
                                </div>
                                <div className="px-2 py-0.5 rounded bg-surface-hover border border-border text-[10px] text-text-muted font-mono">
                                    localhost:preview
                                </div>
                            </div>
                        </div>

                        {/* Preview iframe */}
                        <div className="flex-1 bg-white overflow-hidden relative">
                            {previewHtml ? (
                                <iframe
                                    ref={iframeRef}
                                    srcDoc={previewHtml}
                                    className="w-full h-full border-0"
                                    title="Code Preview"
                                    sandbox="allow-scripts allow-modals"
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full bg-surface-alt">
                                    <div className="text-center">
                                        <Globe className="w-12 h-12 text-text-muted/30 mx-auto mb-3" />
                                        <p className="text-text-muted text-sm">
                                            Write some HTML/CSS and it will preview here
                                        </p>
                                        <p className="text-text-muted/60 text-xs mt-1">
                                            Auto-updates as you type
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Console output for frontend */}
                        <div className="h-28 border-t border-border bg-surface-alt flex flex-col shrink-0">
                            <div className="flex items-center justify-between px-4 py-1.5 border-b border-border">
                                <div className="flex items-center gap-2 text-xs text-text-muted">
                                    <Terminal className="w-3.5 h-3.5" />
                                    Console
                                </div>
                                {output && (
                                    <button
                                        onClick={() => setOutput("")}
                                        className="p-0.5 rounded hover:bg-surface-hover text-text-muted hover:text-text-primary transition-colors"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                )}
                            </div>
                            <div className="flex-1 overflow-y-auto p-3 font-mono text-xs">
                                {output ? (
                                    <pre
                                        className={`whitespace-pre-wrap ${output.includes("Error") ? "text-danger" : "text-success"
                                            }`}
                                    >
                                        {output}
                                    </pre>
                                ) : (
                                    <span className="text-text-muted text-xs">
                                        Preview updates automatically as you type...
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Success Toast */}
            {showSuccess && (
                <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
                    <div className="glass rounded-xl p-4 flex items-center gap-3 shadow-2xl border-success/30 border">
                        <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                            <Trophy className="w-5 h-5 text-success" />
                        </div>
                        <div>
                            <div className="text-sm font-semibold text-text-primary">
                                Exercise Completed! 🎉
                            </div>
                            <div className="text-xs text-text-secondary">
                                +{exercise.xpReward} XP earned
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function PlaygroundPage({
    params,
}: {
    params: Promise<{ courseId: string; exerciseId: string }>;
}) {
    const resolvedParams = use(params);
    return (
        <AppProvider>
            <PlaygroundContent
                courseId={resolvedParams.courseId}
                exerciseId={resolvedParams.exerciseId}
            />
        </AppProvider>
    );
}
