"use client";

import dynamic from "next/dynamic";
import { Loader2, RotateCcw, CheckCircle2, Play } from "lucide-react";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full flex items-center justify-center bg-surface-alt">
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
        </div>
    ),
});

interface EditorPanelProps {
    language: string;
    code: string;
    setCode: (code: string) => void;
    isRunning: boolean;
    completed: boolean;
    isFrontend: boolean;
    showTheoryPanel: boolean;
    handleEditorDidMount: (editor: any, monaco: any) => void;
    handleMarkComplete: () => void;
    runCode: () => void;
    resetCode: () => void;
}

export default function EditorPanel({
    language,
    code,
    setCode,
    isRunning,
    completed,
    isFrontend,
    showTheoryPanel,
    handleEditorDidMount,
    handleMarkComplete,
    runCode,
    resetCode,
}: EditorPanelProps) {
    const monacoLang = language === "cpp" ? "cpp" : language === "jsx" ? "javascript" : language === "tsx" ? "typescript" : language === "reactjs" ? "javascript" : language;

    return (
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
                    <div className="px-3 py-1 rounded-md bg-primary/10 border border-primary/20 text-[11px] font-bold text-primary-light uppercase tracking-wider">
                        {language === "cpp" ? "C++" : language === "jsx" ? "React (JSX)" : language === "tsx" ? "React (TSX)" : language === "reactjs" ? "React (JS)" : language}
                    </div>
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
            <div className="flex-1 min-h-0">
                <MonacoEditor
                    height="100%"
                    language={monacoLang}
                    value={code}
                    onChange={(value) => setCode(value || "")}
                    onMount={handleEditorDidMount}
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
                        contextmenu: false,
                        dragAndDrop: false,
                    }}
                />
            </div>
        </div>
    );
}
