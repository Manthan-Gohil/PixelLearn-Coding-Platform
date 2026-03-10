"use client";

import { use, useState, useCallback, useRef, useEffect, useMemo, Suspense } from "react";
import Link from "next/link";
import { useApp } from "@/store";
import { generateFlowchart } from "@/utils/generateFlowchart";
import { Course, Chapter, Exercise } from "@/types";
import { Loader2 } from "lucide-react";

// Extracted Components
import PlaygroundHeader from "@/components/playground/PlaygroundHeader";
import TheoryPanel from "@/components/playground/panels/TheoryPanel";
import EditorPanel from "@/components/playground/panels/EditorPanel";
import OutputPanel from "@/components/playground/panels/OutputPanel";
import PreviewPanel from "@/components/playground/panels/PreviewPanel";
import PasteBlockedAlert from "@/components/playground/PasteBlockedAlert";
import FlowchartHintModal from "@/components/playground/FlowchartHintModal";

// Constants & Helpers
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
    const [language, setLanguage] = useState("python");
    const [showTheoryPanel, setShowTheoryPanel] = useState(true);
    const [previewHtml, setPreviewHtml] = useState("");
    const [showPasteAlert, setShowPasteAlert] = useState(false);
    const [showFlowchart, setShowFlowchart] = useState(false);
    const editorRef = useRef<any>(null);

    useEffect(() => {
        fetch("/api/courses")
            .then((res) => res.json())
            .then((data) => {
                const foundCourse = data.find((c: Course) => c.id === courseId);
                if (foundCourse) {
                    setCourse(foundCourse);
                    const allEx = foundCourse.chapters.flatMap((ch: Chapter) => ch.exercises);
                    const foundEx = allEx.find((e: Exercise) => e.id === exerciseId);
                    if (foundEx) setExercise(foundEx);
                }
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [courseId, exerciseId]);

    const allExercises = course?.chapters.flatMap((ch: Chapter) => ch.exercises) || [];
    const exerciseIndex = allExercises.findIndex((e: any) => e.id === exerciseId);
    const prevExercise = exerciseIndex > 0 ? allExercises[exerciseIndex - 1] : null;
    const nextExercise = exerciseIndex < allExercises.length - 1 ? allExercises[exerciseIndex + 1] : null;

    const completed = exercise ? isExerciseCompleted(exercise.id) : false;
    const isFrontend = exercise ? isFrontendLanguage(exercise.language) : false;

    const exerciseFlowchart = useMemo(() => {
        if (!exercise) return null;
        if (exercise.flowchart) return exercise.flowchart;
        return generateFlowchart(exercise);
    }, [exercise]);

    useEffect(() => {
        if (exercise) {
            setCode(exercise.starterCode);
            setLanguage(exercise.language);
            setOutput("");
            setPreviewHtml("");
            setShowHints(false);
            setCurrentHintIndex(0);
            setShowFlowchart(false);
        }
    }, [exercise?.id]);

    const updatePreview = useCallback((htmlCode: string, lang: string) => {
        let fullHtml = "";
        const normalizedLang = lang.toLowerCase();

        if (normalizedLang === "html") {
            fullHtml = htmlCode.includes("<html") || htmlCode.includes("<!DOCTYPE") ? htmlCode : `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><script src="https://cdn.tailwindcss.com"></script><style>body { font-family: 'Inter', system-ui, sans-serif; padding: 20px; margin: 0; background: #fff; color: #1a1a1a; } * { box-sizing: border-box; }</style></head><body>${htmlCode}</body></html>`;
        } else if (normalizedLang === "css") {
            fullHtml = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><style>body { font-family: 'Inter', system-ui, sans-serif; padding: 20px; margin: 0; background: #fff; color: #1a1a1a; } ${htmlCode}</style></head><body><div class="container"><header><h1>CSS Preview</h1><p>Mastering Layouts</p></header><main><section class="card"><h2>Card Title</h2><p>This is a preview element to test your CSS.</p><button>Action Button</button></section></main></div></body></html>`;
        } else if (["jsx", "tsx", "javascript", "typescript"].includes(normalizedLang)) {
            const isReact = htmlCode.includes("React") || htmlCode.includes("<") || normalizedLang === "jsx" || normalizedLang === "tsx";
            if (isReact) {
                fullHtml = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><script src="https://unpkg.com/react@18/umd/react.production.min.js"></script><script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script><script src="https://unpkg.com/@babel/standalone/babel.min.js"></script><script src="https://cdn.tailwindcss.com"></script><style>body { font-family: 'Inter', system-ui, sans-serif; margin: 0; background: #f8fafc; color: #0f172a; }</style></head><body><div id="root"></div><script type="text/babel">/** @jsx React.createElement */ /** @jsxFrag React.Fragment */ try { window.parent.postMessage({ type: 'console', method: 'clear' }, '*'); const originalLog = console.log; console.log = (...args) => { window.parent.postMessage({ type: 'console', method: 'log', content: args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ') }, '*'); originalLog.apply(console, args); }; ${htmlCode.replace(/import\s+React.*\s+from\s+['"]react['"];?/g, '').replace(/export\s+default\s+/g, 'const App = ')} if (typeof App !== 'undefined') { const root = ReactDOM.createRoot(document.getElementById('root')); root.render(<App />); } else { document.getElementById('root').innerHTML = 'No export default App found.'; } } catch (err) { console.error(err); document.getElementById('root').innerHTML = err.message; }</script></body></html>`;
            } else {
                fullHtml = `<!DOCTYPE html><html><body><div id="root"></div><script>${htmlCode}<\/script></body></html>`;
            }
        }
        setPreviewHtml(fullHtml);
    }, []);

    useEffect(() => {
        if (isFrontend && code) {
            const timer = setTimeout(() => updatePreview(code, language), 500);
            return () => clearTimeout(timer);
        }
    }, [code, isFrontend, language, updatePreview]);

    const handleEditorDidMount = useCallback((editor: any, monaco: any) => {
        editorRef.current = editor;
        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyV, () => setShowPasteAlert(true));
        editor.addCommand(monaco.KeyMod.Shift | monaco.KeyCode.Insert, () => setShowPasteAlert(true));
    }, []);

    useEffect(() => {
        const handlePaste = (e: ClipboardEvent) => {
            const target = e.target as HTMLElement;
            if (target.closest('.monaco-editor')) {
                e.preventDefault(); e.stopPropagation(); setShowPasteAlert(true);
            }
        };
        document.addEventListener("paste", handlePaste, true);
        return () => document.removeEventListener("paste", handlePaste, true);
    }, []);

    const runCode = useCallback(async () => {
        if (!exercise || isRunning) return;
        setIsRunning(true); setOutput("");
        if (isFrontend) {
            updatePreview(code, language); setOutput("✓ Preview updated successfully");
            setIsRunning(false); return;
        }
        try {
            const response = await fetch("/api/execute", {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code, language: exercise.language }),
            });
            const result = await response.json();
            if (result.error && result.error.trim()) setOutput(`Error: ${result.error}\n\n⏱ Execution time: ${result.executionTime}ms`);
            else if (result.output !== undefined) setOutput(`${result.output}\n\n✓ Execution time: ${result.executionTime}ms`);
            else setOutput("(No output)");
        } catch {
            setOutput("⚠ Execution service unavailable.");
        }
        setIsRunning(false);
    }, [code, exercise, isRunning, isFrontend, language, updatePreview]);

    const handleMarkComplete = useCallback(() => {
        if (exercise && !completed) completeExercise(exercise.id, exercise.xpReward);
    }, [exercise, completed, completeExercise]);

    const resetCode = useCallback(() => {
        if (exercise) { setCode(exercise.starterCode); setOutput(""); setPreviewHtml(""); }
    }, [exercise]);

    useEffect(() => {
        if (courseId && !user.enrolledCourses.includes(courseId)) enrollCourse(courseId);
    }, [courseId, user.enrolledCourses, enrollCourse]);

    if (loading) return <div className="h-screen flex items-center justify-center bg-surface"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

    if (!course || !exercise) return <main className="min-h-screen bg-surface flex items-center justify-center"><div className="text-center"><h1 className="text-2xl font-bold text-text-primary mb-2">Exercise Not Found</h1><Link href="/courses" className="text-primary-light hover:underline">← Back to Courses</Link></div></main>;

    return (
        <div className="h-screen bg-surface flex flex-col overflow-hidden">
            <PasteBlockedAlert show={showPasteAlert} onClose={() => setShowPasteAlert(false)} />
            <FlowchartHintModal show={showFlowchart} onClose={() => setShowFlowchart(false)} exercise={exercise} flowchart={exerciseFlowchart} />
            <PlaygroundHeader courseId={courseId} courseTitle={course.title} exerciseTitle={exercise.title} completed={completed} exerciseXp={exercise.xpReward} showTheoryPanel={showTheoryPanel} setShowTheoryPanel={setShowTheoryPanel} prevExerciseId={prevExercise?.id} nextExerciseId={nextExercise?.id} exerciseIndex={exerciseIndex} totalExercises={allExercises.length} />
            <div className="flex-1 flex overflow-hidden">
                {showTheoryPanel && (
                    <TheoryPanel exercise={exercise} showTheory={showTheory} setShowTheory={setShowTheory} showHints={showHints} setShowHints={setShowHints} currentHintIndex={currentHintIndex} setCurrentHintIndex={setCurrentHintIndex} setShowFlowchart={setShowFlowchart} isFrontend={isFrontend} courseId={courseId} exerciseFlowchart={exerciseFlowchart} />
                )}
                <EditorPanel language={language} setLanguage={setLanguage} code={code} setCode={setCode} isRunning={isRunning} completed={completed} isFrontend={isFrontend} showTheoryPanel={showTheoryPanel} handleEditorDidMount={handleEditorDidMount} handleMarkComplete={handleMarkComplete} runCode={runCode} resetCode={resetCode} />
                {!isFrontend && <OutputPanel output={output} setOutput={setOutput} />}
                {isFrontend && <PreviewPanel showTheoryPanel={showTheoryPanel} previewHtml={previewHtml} />}
            </div>
        </div>
    );
}

export default function PlaygroundPage({ params }: { params: Promise<{ courseId: string; exerciseId: string }> }) {
    const resolvedParams = use(params);
    return <Suspense fallback={<div className="h-screen bg-surface flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>}><PlaygroundContent courseId={resolvedParams.courseId} exerciseId={resolvedParams.exerciseId} /></Suspense>;
}
