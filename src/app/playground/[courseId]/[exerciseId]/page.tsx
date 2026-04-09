"use client";

import { use, useState, useCallback, useRef, useEffect, useMemo, Suspense } from "react";
import Link from "next/link";
import { useApp } from "@/store";
import { PREVIEW_DEBOUNCE_MS, PROCTOR_ALERT_FREQUENCY } from "@/constants/playground";
import { generateFlowchart } from "@/utils/generateFlowchart";
import { buildPreviewHtml, getExerciseNavigation, isFrontendLanguage, isMultiFileLanguage } from "@/utils/playground";
import type { Chapter, Course, Exercise } from "@/types";
import { PlaygroundEditorDidMount } from "@/types/playground";
import { Loader2 } from "lucide-react";

// Extracted Components
import PlaygroundHeader from "@/components/playground/PlaygroundHeader";
import TheoryPanel from "@/components/playground/panels/TheoryPanel";
import EditorPanel from "@/components/playground/panels/EditorPanel";
import OutputPanel from "@/components/playground/panels/OutputPanel";
import PreviewPanel from "@/components/playground/panels/PreviewPanel";
import PasteBlockedAlert from "@/components/playground/PasteBlockedAlert";
import FlowchartHintModal from "@/components/playground/FlowchartHintModal";
import CodeConverterModal from "@/components/playground/CodeConverterModal";

const DEFAULT_REACT_ENTRY_FILE = "src/App.jsx";

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
    const [input, setInput] = useState("");
    const [isRunning, setIsRunning] = useState(false);
    const [showHints, setShowHints] = useState(false);
    const [currentHintIndex, setCurrentHintIndex] = useState(0);
    const [showTheory, setShowTheory] = useState(true);
    const [language, setLanguage] = useState("python");
    const [files, setFiles] = useState<Record<string, string>>({});
    const [folders, setFolders] = useState<string[]>([]);
    const [selectedFile, setSelectedFile] = useState<string>("");
    const [showTheoryPanel, setShowTheoryPanel] = useState(true);
    const [previewHtml, setPreviewHtml] = useState("");
    const [showPasteAlert, setShowPasteAlert] = useState(false);
    const [showFlowchart, setShowFlowchart] = useState(false);
    const [tabSwitchCount, setTabSwitchCount] = useState(0);
    const editorRef = useRef<Parameters<PlaygroundEditorDidMount>[0] | null>(null);
    const [showConverter, setShowConverter] = useState(false);

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

    const allExercises = course?.chapters.flatMap((chapter: Chapter) => chapter.exercises) || [];
    const { exerciseIndex, prevExercise, nextExercise } = useMemo(
        () => getExerciseNavigation(allExercises, exerciseId),
        [allExercises, exerciseId]
    );

    const completed = exercise ? isExerciseCompleted(exercise.id) : false;
    const isFrontend = exercise ? isFrontendLanguage(exercise.language) : false;
    const isMultiFile = exercise ? isMultiFileLanguage(exercise.language) : false;

    const exerciseFlowchart = useMemo(() => {
        if (!exercise) return null;
        if (exercise.flowchart) return exercise.flowchart;
        return generateFlowchart(exercise);
    }, [exercise]);

    useEffect(() => {
        if (exercise) {
            setLanguage(exercise.language);
            setOutput("");
            setInput("");
            setPreviewHtml("");
            setShowHints(false);
            setCurrentHintIndex(0);
            setShowFlowchart(false);

            if (isMultiFileLanguage(exercise.language)) {
                const initialFiles: Record<string, string> = {
                    [DEFAULT_REACT_ENTRY_FILE]: exercise.starterCode,
                };
                setFiles(initialFiles);
                setFolders(["src"]);
                setSelectedFile(DEFAULT_REACT_ENTRY_FILE);
                setCode(exercise.starterCode);
            } else {
                setFiles({});
                setFolders([]);
                setSelectedFile("");
                setCode(exercise.starterCode);
            }
        }
    }, [exercise?.id]);

    useEffect(() => {
        if (!isMultiFile || !selectedFile) return;
        const content = files[selectedFile];
        if (typeof content === "string") {
            setCode(content);
        }
    }, [files, selectedFile, isMultiFile]);

    const entryFile = useMemo(() => {
        const keys = Object.keys(files);
        if (!isMultiFile || keys.length === 0) return "";

        const preferred = ["src/App.jsx", "App.jsx", "src/App.tsx", "App.tsx"];
        const found = preferred.find((file) => keys.includes(file));
        if (found) return found;
        if (selectedFile && keys.includes(selectedFile)) return selectedFile;
        return keys[0];
    }, [files, isMultiFile, selectedFile]);

    const updatePreview = useCallback((htmlCode: string, lang: string, sourceFiles?: Record<string, string>, previewEntryFile?: string) => {
        setPreviewHtml(buildPreviewHtml(htmlCode, lang, sourceFiles, previewEntryFile));
    }, []);

    useEffect(() => {
        if (isFrontend && code) {
            // For multi-file React, pass files and entryFile for bundling
            // For single-file HTML/CSS, just pass the code directly
            const timer = setTimeout(
                () => updatePreview(code, language, isMultiFile ? files : undefined, isMultiFile ? entryFile : undefined),
                PREVIEW_DEBOUNCE_MS
            );
            return () => clearTimeout(timer);
        }
    }, [code, isFrontend, isMultiFile, language, files, entryFile, updatePreview]);

    const handleCodeChange = useCallback((updatedCode: string) => {
        setCode(updatedCode);
        if (!isMultiFile || !selectedFile) return;
        setFiles((prev) => ({
            ...prev,
            [selectedFile]: updatedCode,
        }));
    }, [isMultiFile, selectedFile]);

    const handleSelectFile = useCallback((filePath: string) => {
        setSelectedFile(filePath);
        const fileContent = files[filePath];
        if (typeof fileContent === "string") {
            setCode(fileContent);
        }
    }, [files]);

    const handleCreateFolder = useCallback(() => {
        if (!isMultiFile) return;
        const folderPath = window.prompt("Enter folder path (example: src/components)", "src/components");
        if (!folderPath) return;
        const normalized = folderPath.replace(/\\/g, "/").replace(/^\/+|\/+$/g, "");
        if (!normalized) return;
        setFolders((prev) => (prev.includes(normalized) ? prev : [...prev, normalized]));
    }, [isMultiFile]);

    const handleCreateFile = useCallback(() => {
        if (!isMultiFile) return;
        const filePathInput = window.prompt("Enter file path (example: src/Child.jsx)", "src/Child.jsx");
        if (!filePathInput) return;

        let normalized = filePathInput.replace(/\\/g, "/").replace(/^\/+|\/+$/g, "");
        if (!/\.(jsx|tsx|js|ts)$/.test(normalized)) {
            normalized = `${normalized}.jsx`;
        }

        setFiles((prev) => {
            if (prev[normalized]) return prev;
            const baseName = normalized.split("/").pop()?.replace(/\.[^.]+$/, "") || "Component";
            const starter = `import React from 'react';\n\nexport default function ${baseName.replace(/[^a-zA-Z0-9_$]/g, "") || "Component"}() {\n  return <div>${baseName} works</div>;\n}\n`;
            return {
                ...prev,
                [normalized]: starter,
            };
        });

        const folderPath = normalized.includes("/") ? normalized.slice(0, normalized.lastIndexOf("/")) : "";
        if (folderPath) {
            setFolders((prev) => (prev.includes(folderPath) ? prev : [...prev, folderPath]));
        }
        setSelectedFile(normalized);
    }, [isFrontend]);

    const handleEditorDidMount = useCallback<PlaygroundEditorDidMount>((editor, monaco) => {
        editorRef.current = editor;
        // Block Paste commands
        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyV, () => setShowPasteAlert(true));
        editor.addCommand(monaco.KeyMod.Shift | monaco.KeyCode.Insert, () => setShowPasteAlert(true));
        // Block Copy/Cut commands
        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyC, () => { });
        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyX, () => { });
    }, []);

    // Proctoring: Tab Visibility and Focus Detection
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden') {
                setTabSwitchCount(prev => prev + 1);
            }
        };

        const handleBlur = () => {
            // Optional: detect when window loses focus (e.g. ALT+TAB)
            // setTabSwitchCount(prev => prev + 1);
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        window.addEventListener("blur", handleBlur);

        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            window.removeEventListener("blur", handleBlur);
        };
    }, []);

    useEffect(() => {
        const handleClipboard = (e: ClipboardEvent) => {
            const target = e.target as HTMLElement;
            if (target.closest('.monaco-editor')) {
                if (e.type === 'paste') {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowPasteAlert(true);
                } else if (e.type === 'copy' || e.type === 'cut') {
                    // Optionally prevent copy/cut as well
                    e.preventDefault();
                    e.stopPropagation();
                }
            }
        };

        const handleDrop = (e: DragEvent) => {
            const target = e.target as HTMLElement;
            if (target.closest('.monaco-editor')) {
                e.preventDefault();
                e.stopPropagation();
            }
        };

        document.addEventListener("paste", handleClipboard, true);
        document.addEventListener("copy", handleClipboard, true);
        document.addEventListener("cut", handleClipboard, true);
        document.addEventListener("drop", handleDrop, true);

        return () => {
            document.removeEventListener("paste", handleClipboard, true);
            document.removeEventListener("copy", handleClipboard, true);
            document.removeEventListener("cut", handleClipboard, true);
            document.removeEventListener("drop", handleDrop, true);
        };
    }, []);

    const runCode = useCallback(async () => {
        if (!exercise || isRunning) return;
        setIsRunning(true); setOutput("");
        if (isFrontend) {
            updatePreview(code, language, isMultiFile ? files : undefined, isMultiFile ? entryFile : undefined);
            setOutput("✓ Preview updated successfully");
            setIsRunning(false); return;
        }
        try {
            const response = await fetch("/api/execute", {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code, language: exercise.language, input }),
            });
            const result = await response.json();
            if (result.error && result.error.trim()) setOutput(result.error);
            else if (result.output !== undefined) setOutput(result.output);
            else setOutput("(No output)");
        } catch {
            setOutput("⚠ Execution service unavailable.");
        } finally {
            setIsRunning(false);
        }
    }, [code, exercise, isRunning, isFrontend, language, input, updatePreview, files, entryFile]);

    const handleMarkComplete = useCallback(() => {
        if (exercise && !completed) completeExercise(exercise.id, exercise.xpReward);
    }, [exercise, completed, completeExercise]);

    const resetCode = useCallback(() => {
        if (!exercise) return;

        if (isMultiFile) {
            const nextEntry = entryFile || DEFAULT_REACT_ENTRY_FILE;
            setFiles((prev) => ({
                ...prev,
                [nextEntry]: exercise.starterCode,
            }));
            setSelectedFile(nextEntry);
        }

        setCode(exercise.starterCode);
        setOutput("");
        setInput("");
        setPreviewHtml("");
    }, [exercise, isMultiFile, entryFile]);

    useEffect(() => {
        if (courseId && !user.enrolledCourses.includes(courseId)) enrollCourse(courseId);
    }, [courseId, user.enrolledCourses, enrollCourse]);

    if (loading) return <div className="h-screen flex items-center justify-center bg-surface"><Loader2 className="w-8 h-8 animate-spin text-[#E6C212]" /></div>;

    if (!course || !exercise) return <main className="min-h-screen bg-surface flex items-center justify-center"><div className="text-center"><h1 className="text-2xl font-bold text-text-primary mb-2">Exercise Not Found</h1><Link href="/courses" className="text-[#E6C212] hover:underline">← Back to Courses</Link></div></main>;

    return (
        <div className="h-screen bg-surface flex flex-col overflow-hidden select-none relative">
            <div className="absolute inset-0 fb-dot-grid opacity-20 pointer-events-none" />
            <PasteBlockedAlert show={showPasteAlert} onClose={() => setShowPasteAlert(false)} />
            {tabSwitchCount > 0 && tabSwitchCount % PROCTOR_ALERT_FREQUENCY === 0 && (
                <div className="fixed top-4 right-4 z-110 bg-danger/90 backdrop-blur text-white px-4 py-2 rounded-lg shadow-xl animate-bounce-short text-xs font-bold border border-white/20">
                    ⚠️ Tab switching detected! ({tabSwitchCount} times)
                </div>
            )}
            <FlowchartHintModal show={showFlowchart} onClose={() => setShowFlowchart(false)} exercise={exercise} flowchart={exerciseFlowchart} />
            <CodeConverterModal show={showConverter} onClose={() => setShowConverter(false)} code={code} sourceLanguage={language} />
            <PlaygroundHeader courseId={courseId} courseTitle={course.title} exerciseTitle={exercise.title} completed={completed} exerciseXp={exercise.xpReward} showTheoryPanel={showTheoryPanel} setShowTheoryPanel={setShowTheoryPanel} prevExerciseId={prevExercise?.id} nextExerciseId={nextExercise?.id} exerciseIndex={exerciseIndex} totalExercises={allExercises.length} />
            <div className="flex-1 flex overflow-hidden">
                {showTheoryPanel && (
                    <TheoryPanel exercise={exercise} showTheory={showTheory} setShowTheory={setShowTheory} showHints={showHints} setShowHints={setShowHints} currentHintIndex={currentHintIndex} setCurrentHintIndex={setCurrentHintIndex} setShowFlowchart={setShowFlowchart} isFrontend={isFrontend} courseId={courseId} exerciseFlowchart={exerciseFlowchart} />
                )}
                <EditorPanel language={language} code={code} setCode={handleCodeChange} files={isMultiFile ? files : undefined} folders={isMultiFile ? folders : undefined} selectedFile={isMultiFile ? selectedFile : undefined} onSelectFile={isMultiFile ? handleSelectFile : undefined} onCreateFile={isMultiFile ? handleCreateFile : undefined} onCreateFolder={isMultiFile ? handleCreateFolder : undefined} isRunning={isRunning} completed={completed} isFrontend={isFrontend} isMultiFile={isMultiFile} showTheoryPanel={showTheoryPanel} handleEditorDidMount={handleEditorDidMount} handleMarkComplete={handleMarkComplete} runCode={runCode} resetCode={resetCode} onConvertCode={() => setShowConverter(true)} />
                {!isFrontend && (
                    <div className="w-[30%] flex flex-col border-l border-border bg-surface-alt">
                        <div className="flex-1 flex flex-col min-h-0">
                            <OutputPanel output={output} setOutput={setOutput} />
                            <div className="flex-1 flex flex-col border-t border-border min-h-0">
                                <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-surface-alt/50 shrink-0">
                                    <div className="flex items-center gap-2 text-xs text-text-muted">
                                        <Loader2 className="w-3.5 h-3.5" />
                                        Input (stdin)
                                    </div>
                                </div>
                                <textarea
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Enter program input here (if needed)..."
                                    className="flex-1 w-full bg-transparent p-4 font-mono text-sm resize-none focus:outline-none text-text-secondary"
                                />
                            </div>
                        </div>
                    </div>
                )}
                {isFrontend && <PreviewPanel showTheoryPanel={showTheoryPanel} previewHtml={previewHtml} />}
            </div>
        </div>
    );
}

export default function PlaygroundPage({ params }: { params: Promise<{ courseId: string; exerciseId: string }> }) {
    const resolvedParams = use(params);
    return <Suspense fallback={<div className="h-screen bg-surface flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-[#E6C212]" /></div>}><PlaygroundContent courseId={resolvedParams.courseId} exerciseId={resolvedParams.exerciseId} /></Suspense>;
}
