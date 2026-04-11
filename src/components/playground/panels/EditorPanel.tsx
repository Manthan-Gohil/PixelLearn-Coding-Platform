"use client";

import dynamic from "next/dynamic";
import { Loader2, RotateCcw, CheckCircle2, Play, Plus, FolderPlus, FileCode, Folder, ArrowRightLeft } from "lucide-react";
import type { PlaygroundEditorDidMount } from "@/types/playground";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full flex items-center justify-center bg-surface-alt">
            <Loader2 className="w-6 h-6 text-[#E6C212] animate-spin" />
        </div>
    ),
});

interface EditorPanelProps {
    language: string;
    code: string;
    setCode: (code: string) => void;
    files?: Record<string, string>;
    folders?: string[];
    selectedFile?: string;
    onSelectFile?: (filePath: string) => void;
    onCreateFile?: () => void;
    onCreateFolder?: () => void;
    isRunning: boolean;
    completed: boolean;
    isFrontend: boolean;
    isMultiFile: boolean;
    showTheoryPanel: boolean;
    handleEditorDidMount: PlaygroundEditorDidMount;
    handleMarkComplete: () => void;
    runCode: () => void;
    resetCode: () => void;
    onConvertCode?: () => void;
}

export default function EditorPanel({
    language,
    code,
    setCode,
    files,
    folders,
    selectedFile,
    onSelectFile,
    onCreateFile,
    onCreateFolder,
    isRunning,
    completed,
    isFrontend,
    isMultiFile,
    showTheoryPanel,
    handleEditorDidMount,
    handleMarkComplete,
    runCode,
    resetCode,
    onConvertCode,
}: EditorPanelProps) {
    const selectedFileLower = (selectedFile || "").toLowerCase();
    const monacoLang = selectedFileLower.endsWith(".tsx")
        ? "typescript"
        : selectedFileLower.endsWith(".ts")
            ? "typescript"
            : selectedFileLower.endsWith(".jsx") || selectedFileLower.endsWith(".js")
                ? "javascript"
                : language === "cpp"
                    ? "cpp"
                    : language === "jsx"
                        ? "javascript"
                        : language === "tsx"
                            ? "typescript"
                            : language === "reactjs"
                                ? "javascript"
                                : language;

    const fileEntries = Object.keys(files || {}).sort((a, b) => a.localeCompare(b));
    const folderEntries = (folders || []).slice().sort((a, b) => a.localeCompare(b));

    return (
        <div
            className={`flex flex-col overflow-hidden border-r border-border transition-all duration-300 w-full ${isFrontend
                ? showTheoryPanel
                    ? "lg:w-[38%]"
                    : "lg:w-1/2"
                : showTheoryPanel
                    ? "lg:w-1/2"
                    : "lg:w-full"
                }`}
        >
            <div className="flex items-center justify-between px-2 py-2 border-b border-border bg-surface-alt/50 shrink-0 overflow-x-auto gap-2">
                <div className="flex items-center gap-1.5 shrink-0">
                    <div className="px-2 py-1 rounded-md bg-[#E6C212]/10 border border-[#E6C212]/30 text-[10px] font-bold text-[#E6C212] uppercase tracking-wider fb-mono whitespace-nowrap">
                        {language === "cpp" ? "C++" : language === "java" ? "Java" : language === "jsx" ? "React (JSX)" : language === "tsx" ? "React (TSX)" : language === "reactjs" ? "React (JS)" : language}
                    </div>
                    <button
                        onClick={resetCode}
                        className="flex items-center gap-1 px-2 py-1 rounded text-xs text-text-muted hover:text-text-primary hover:bg-surface-hover transition-colors whitespace-nowrap shrink-0"
                        title="Reset code"
                    >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Reset
                    </button>
                    {onConvertCode && (
                        <button
                            onClick={onConvertCode}
                            className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium text-[#00FFFF] bg-[#00FFFF]/5 border border-[#00FFFF]/20 hover:bg-[#00FFFF]/10 hover:border-[#00FFFF]/40 transition-all whitespace-nowrap shrink-0"
                            title="Convert code to another language"
                        >
                            <ArrowRightLeft className="w-3.5 h-3.5" />
                            Convert
                        </button>
                    )}
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                    {!completed && (
                        <button
                            onClick={handleMarkComplete}
                            className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium border border-success/30 text-success hover:bg-success/10 transition-all whitespace-nowrap"
                        >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Complete
                        </button>
                    )}
                    <button
                        onClick={runCode}
                        disabled={isRunning}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#E6C212] text-black hover:bg-[#f0d030] disabled:opacity-50 transition-all shadow-lg shadow-black/30 fb-mono whitespace-nowrap shrink-0"
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

            <div className="flex-1 min-h-0">
                {isMultiFile && files && selectedFile && onSelectFile && (
                    <div className="border-b border-border bg-surface-alt/40 px-2 py-2">
                        <div className="flex items-center justify-between gap-2 mb-2">
                            <span className="text-[11px] uppercase tracking-wide text-text-muted font-semibold">Workspace</span>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={onCreateFolder}
                                    className="inline-flex items-center gap-1 px-2 py-1 rounded text-[11px] text-text-muted hover:text-text-primary hover:bg-surface-hover transition-colors"
                                    title="Create folder"
                                >
                                    <FolderPlus className="w-3.5 h-3.5" />
                                    Folder
                                </button>
                                <button
                                    onClick={onCreateFile}
                                    className="inline-flex items-center gap-1 px-2 py-1 rounded text-[11px] text-text-muted hover:text-text-primary hover:bg-surface-hover transition-colors"
                                    title="Create file"
                                >
                                    <Plus className="w-3.5 h-3.5" />
                                    File
                                </button>
                            </div>
                        </div>

                        {folderEntries.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-2">
                                {folderEntries.map((folder) => (
                                    <span key={folder} className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-border text-[10px] text-text-muted">
                                        <Folder className="w-3 h-3" />
                                        {folder}
                                    </span>
                                ))}
                            </div>
                        )}

                        <div className="flex flex-wrap gap-1 max-h-20 overflow-auto pr-1">
                            {fileEntries.map((file) => (
                                <button
                                    key={file}
                                    onClick={() => onSelectFile(file)}
                                    className={`inline-flex items-center gap-1 px-2 py-1 rounded text-[11px] border transition-colors ${selectedFile === file
                                        ? "border-[#E6C212]/40 bg-[#E6C212]/10 text-[#E6C212]"
                                        : "border-border text-text-muted hover:text-text-primary hover:bg-surface-hover"
                                        }`}
                                    title={file}
                                >
                                    <FileCode className="w-3.5 h-3.5" />
                                    {file}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

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
