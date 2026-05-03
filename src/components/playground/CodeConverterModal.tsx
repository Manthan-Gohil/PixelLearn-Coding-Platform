"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { X, ArrowRightLeft, Loader2, Copy, Check, ChevronDown, Sparkles, AlertTriangle, Play, Terminal } from "lucide-react";

const TARGET_LANGUAGES = [
    { value: "python", label: "Python" },
    { value: "javascript", label: "JavaScript" },
    { value: "typescript", label: "TypeScript" },
    { value: "java", label: "Java" },
    { value: "cpp", label: "C++" },
    { value: "c", label: "C" },
    { value: "csharp", label: "C#" },
    { value: "go", label: "Go" },
    { value: "rust", label: "Rust" },
    { value: "ruby", label: "Ruby" },
    { value: "php", label: "PHP" },
    { value: "swift", label: "Swift" },
    { value: "kotlin", label: "Kotlin" },
    { value: "dart", label: "Dart" },
    { value: "scala", label: "Scala" },
    { value: "r", label: "R" },
    { value: "lua", label: "Lua" },
    { value: "bash", label: "Bash / Shell" },
    { value: "sql", label: "SQL" },
];

interface CodeConverterModalProps {
    show: boolean;
    onClose: () => void;
    code: string;
    sourceLanguage: string;
}

function getSourceLabel(lang: string): string {
    const map: Record<string, string> = {
        javascript: "JavaScript", typescript: "TypeScript", python: "Python",
        java: "Java", cpp: "C++", c: "C", csharp: "C#", go: "Go", rust: "Rust",
        ruby: "Ruby", php: "PHP", swift: "Swift", kotlin: "Kotlin", dart: "Dart",
        html: "HTML", css: "CSS", reactjs: "React (JS)", jsx: "React (JSX)", tsx: "React (TSX)",
    };
    return map[lang.toLowerCase()] || lang;
}

export default function CodeConverterModal({
    show,
    onClose,
    code,
    sourceLanguage,
}: CodeConverterModalProps) {
    const [targetLang, setTargetLang] = useState("");
    const [convertedCode, setConvertedCode] = useState("");
    const [isConverting, setIsConverting] = useState(false);
    const [error, setError] = useState("");
    const [copied, setCopied] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const modalRef = useRef<HTMLDivElement>(null);

    // Compatibility state
    const [incompatible, setIncompatible] = useState(false);
    const [incompatibleReason, setIncompatibleReason] = useState("");

    // Run converted code state
    const [runOutput, setRunOutput] = useState("");
    const [runError, setRunError] = useState("");
    const [isRunning, setIsRunning] = useState(false);
    const [runInput, setRunInput] = useState("");
    const [showRunSection, setShowRunSection] = useState(false);

    // Reset state when modal opens
    useEffect(() => {
        if (show) {
            setConvertedCode("");
            setError("");
            setCopied(false);
            setTargetLang("");
            setDropdownOpen(false);
            setIncompatible(false);
            setIncompatibleReason("");
            setRunOutput("");
            setRunError("");
            setIsRunning(false);
            setRunInput("");
            setShowRunSection(false);
        }
    }, [show]);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleConvert = useCallback(async () => {
        if (!targetLang || !code.trim()) return;
        setIsConverting(true);
        setError("");
        setConvertedCode("");
        setCopied(false);
        setIncompatible(false);
        setIncompatibleReason("");
        setRunOutput("");
        setRunError("");
        setShowRunSection(false);

        try {
            const response = await fetch("/api/ai/convert-code", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    code,
                    sourceLanguage,
                    targetLanguage: targetLang,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "Conversion failed. Please try again.");
                return;
            }

            // Handle incompatibility response
            if (data.compatible === false) {
                setIncompatible(true);
                setIncompatibleReason(data.reason || "This conversion is not possible.");
                return;
            }

            setConvertedCode(data.convertedCode || "");
        } catch {
            setError("Network error. Please check your connection and try again.");
        } finally {
            setIsConverting(false);
        }
    }, [code, sourceLanguage, targetLang]);

    const handleCopy = useCallback(() => {
        if (!convertedCode) return;
        navigator.clipboard.writeText(convertedCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }, [convertedCode]);

    const handleRunConvertedCode = useCallback(async () => {
        if (!convertedCode || !targetLang) return;
        setIsRunning(true);
        setRunOutput("");
        setRunError("");
        setShowRunSection(true);

        try {
            const response = await fetch("/api/execute", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    code: convertedCode,
                    language: targetLang,
                    input: runInput,
                }),
            });

            const result = await response.json();

            if (result.error && result.error.trim()) {
                setRunError(result.error);
            }
            if (result.output !== undefined) {
                setRunOutput(result.output);
            }
            if (!result.output && !result.error) {
                setRunOutput("(No output)");
            }
        } catch {
            setRunError("⚠ Execution service unavailable.");
        } finally {
            setIsRunning(false);
        }
    }, [convertedCode, targetLang, runInput]);

    if (!show) return null;

    const filteredLangs = TARGET_LANGUAGES.filter(
        (l) => l.value !== sourceLanguage.toLowerCase()
    );

    const selectedLangLabel = filteredLangs.find((l) => l.value === targetLang)?.label || "";

    return (
        <div
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div
                ref={modalRef}
                className="relative w-full max-w-2xl mx-4 bg-surface-alt border border-border rounded-2xl shadow-2xl animate-scale-in overflow-hidden"
                style={{ maxHeight: "90vh" }}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface-alt/80">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-[#E6C212]/20 to-[#00FFFF]/10 border border-[#E6C212]/30">
                            <ArrowRightLeft className="w-4.5 h-4.5 text-[#E6C212]" />
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-text-primary">Code Converter</h2>
                            <p className="text-[11px] text-text-muted mt-0.5">
                                AI-powered code translation with compatibility check
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-surface-hover text-text-muted hover:text-text-primary transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto" style={{ maxHeight: "calc(90vh - 130px)" }}>
                    {/* Language selection row */}
                    <div className="flex items-center gap-3 mb-5">
                        {/* Source language badge */}
                        <div className="flex-1 flex items-center gap-2 px-4 py-3 rounded-xl bg-surface border border-border">
                            <span className="text-[11px] uppercase tracking-wider text-text-muted font-semibold">From</span>
                            <span className="px-2.5 py-1 rounded-lg bg-[#E6C212]/10 border border-[#E6C212]/30 text-xs font-bold text-[#E6C212] uppercase tracking-wider">
                                {getSourceLabel(sourceLanguage)}
                            </span>
                        </div>

                        {/* Arrow */}
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-surface border border-border shrink-0">
                            <ArrowRightLeft className="w-4 h-4 text-text-muted" />
                        </div>

                        {/* Target language dropdown */}
                        <div className="flex-1 relative" ref={dropdownRef}>
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="w-full flex items-center justify-between gap-2 px-4 py-3 rounded-xl bg-surface border border-border hover:border-[#E6C212]/40 transition-colors text-left"
                            >
                                <div className="flex items-center gap-2">
                                    <span className="text-[11px] uppercase tracking-wider text-text-muted font-semibold">To</span>
                                    {selectedLangLabel ? (
                                        <span className="px-2.5 py-1 rounded-lg bg-[#00FFFF]/10 border border-[#00FFFF]/30 text-xs font-bold text-[#00FFFF] uppercase tracking-wider">
                                            {selectedLangLabel}
                                        </span>
                                    ) : (
                                        <span className="text-xs text-text-muted">Select language…</span>
                                    )}
                                </div>
                                <ChevronDown className={`w-4 h-4 text-text-muted transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
                            </button>

                            {dropdownOpen && (
                                <div className="absolute top-full left-0 right-0 mt-1 bg-surface-alt border border-border rounded-xl shadow-2xl z-50 max-h-52 overflow-y-auto animate-slide-in-down">
                                    {filteredLangs.map((lang) => (
                                        <button
                                            key={lang.value}
                                            onClick={() => {
                                                setTargetLang(lang.value);
                                                setDropdownOpen(false);
                                                setConvertedCode("");
                                                setError("");
                                                setIncompatible(false);
                                                setIncompatibleReason("");
                                                setRunOutput("");
                                                setRunError("");
                                                setShowRunSection(false);
                                            }}
                                            className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-surface-hover ${targetLang === lang.value
                                                ? "text-[#00FFFF] bg-[#00FFFF]/5 font-medium"
                                                : "text-text-secondary"
                                                }`}
                                        >
                                            {lang.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Convert button */}
                    <button
                        onClick={handleConvert}
                        disabled={!targetLang || isConverting || !code.trim()}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-[#E6C212] to-[#f0d030] text-black hover:shadow-lg hover:shadow-[#E6C212]/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 mb-5"
                    >
                        {isConverting ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Checking compatibility & converting…
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-4 h-4" />
                                Convert Code
                            </>
                        )}
                    </button>

                    {/* Error display */}
                    {error && (
                        <div className="mb-4 px-4 py-3 rounded-xl bg-danger/10 border border-danger/30 text-danger text-sm animate-scale-in">
                            {error}
                        </div>
                    )}

                    {/* ========== INCOMPATIBILITY WARNING ========== */}
                    {incompatible && (
                        <div className="mb-4 animate-scale-in">
                            <div className="relative rounded-2xl overflow-hidden">
                                {/* Glow border */}
                                <div className="absolute -inset-[1px] bg-gradient-to-r from-amber-500/30 via-red-500/30 to-amber-500/30 rounded-2xl blur-sm" />
                                <div className="relative rounded-2xl bg-surface border border-amber-500/30 p-5">
                                    <div className="flex items-start gap-4">
                                        {/* Animated warning icon */}
                                        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-red-500/20 border border-amber-500/40 flex items-center justify-center animate-pulse">
                                            <AlertTriangle className="w-6 h-6 text-amber-400" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-sm font-bold text-amber-400 mb-1 flex items-center gap-2">
                                                <span>Conversion Not Possible</span>
                                                <span className="px-2 py-0.5 rounded-md bg-red-500/15 border border-red-500/30 text-[10px] font-bold text-red-400 uppercase tracking-wider">
                                                    Incompatible
                                                </span>
                                            </h3>
                                            <p className="text-sm text-text-secondary leading-relaxed">
                                                {incompatibleReason}
                                            </p>
                                            <div className="mt-3 flex items-center gap-2 text-[11px] text-text-muted">
                                                <div className="w-1.5 h-1.5 rounded-full bg-amber-400/60" />
                                                <span>
                                                    {getSourceLabel(sourceLanguage)} → {selectedLangLabel} is not a valid conversion for this code
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ========== CONVERTED CODE DISPLAY ========== */}
                    {convertedCode && (
                        <div className="animate-scale-in">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                                        Converted Code
                                    </span>
                                    <span className="px-2 py-0.5 rounded-md bg-success/10 border border-success/30 text-[10px] font-bold text-success uppercase">
                                        {selectedLangLabel}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <button
                                        onClick={handleCopy}
                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-border hover:border-[#E6C212]/40 hover:bg-surface-hover text-text-muted hover:text-text-primary transition-all"
                                    >
                                        {copied ? (
                                            <>
                                                <Check className="w-3.5 h-3.5 text-success" />
                                                <span className="text-success">Copied!</span>
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="w-3.5 h-3.5" />
                                                Copy
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                            <div className="relative rounded-xl overflow-hidden border border-border bg-[#0d0d0d]">
                                <pre className="p-4 overflow-auto text-sm font-mono text-text-secondary leading-relaxed" style={{ maxHeight: "300px" }}>
                                    <code>{convertedCode}</code>
                                </pre>
                                <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-[#0d0d0d] to-transparent pointer-events-none" />
                            </div>

                            {/* ========== RUN CONVERTED CODE SECTION ========== */}
                            <div className="mt-4 space-y-3">
                                {/* Run button + Input toggle */}
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={handleRunConvertedCode}
                                        disabled={isRunning}
                                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:shadow-lg hover:shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                                    >
                                        {isRunning ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                Running…
                                            </>
                                        ) : (
                                            <>
                                                <Play className="w-4 h-4" />
                                                Run Converted Code
                                            </>
                                        )}
                                    </button>
                                    <span className="text-[11px] text-text-muted">
                                        Execute the {selectedLangLabel} code to verify correctness
                                    </span>
                                </div>

                                {/* Input (stdin) area */}
                                <div className="rounded-xl border border-border bg-surface overflow-hidden">
                                    <div className="flex items-center gap-2 px-3 py-2 border-b border-border bg-surface-alt/50">
                                        <Loader2 className="w-3 h-3 text-text-muted" />
                                        <span className="text-[11px] text-text-muted font-medium uppercase tracking-wider">Input (stdin)</span>
                                    </div>
                                    <textarea
                                        value={runInput}
                                        onChange={(e) => setRunInput(e.target.value)}
                                        placeholder="Enter program input here (if needed)..."
                                        rows={2}
                                        className="w-full bg-transparent px-3 py-2 font-mono text-sm resize-none focus:outline-none text-text-secondary placeholder:text-text-muted/40"
                                    />
                                </div>

                                {/* Execution Output */}
                                {showRunSection && (
                                    <div className="rounded-xl border border-border bg-[#0d0d0d] overflow-hidden animate-scale-in">
                                        <div className="flex items-center gap-2 px-3 py-2 border-b border-border bg-surface-alt/30">
                                            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                                            <span className="text-[11px] text-text-muted font-medium uppercase tracking-wider">Execution Output</span>
                                            {!isRunning && (runOutput || runError) && (
                                                <span className={`ml-auto px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${runError && !runOutput ? "bg-red-500/15 border border-red-500/30 text-red-400" : "bg-emerald-500/15 border border-emerald-500/30 text-emerald-400"}`}>
                                                    {runError && !runOutput ? "Error" : "Success"}
                                                </span>
                                            )}
                                        </div>
                                        <div className="p-3 font-mono text-sm min-h-[60px] max-h-[200px] overflow-auto">
                                            {isRunning ? (
                                                <div className="flex items-center gap-2 text-text-muted">
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    <span className="text-xs">Executing {selectedLangLabel} code…</span>
                                                </div>
                                            ) : (
                                                <>
                                                    {runError && (
                                                        <pre className="whitespace-pre-wrap text-red-400 mb-1">{runError}</pre>
                                                    )}
                                                    {runOutput && (
                                                        <pre className="whitespace-pre-wrap text-emerald-400">{runOutput}</pre>
                                                    )}
                                                    {!runOutput && !runError && (
                                                        <span className="text-text-muted text-xs">No output yet. Click &quot;Run Converted Code&quot; to execute.</span>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Empty state when no conversion yet */}
                    {!convertedCode && !error && !isConverting && !incompatible && (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                            <div className="w-16 h-16 rounded-2xl bg-surface border border-border flex items-center justify-center mb-4">
                                <ArrowRightLeft className="w-7 h-7 text-text-muted/40" />
                            </div>
                            <p className="text-sm text-text-muted">
                                Select a target language and click <span className="font-semibold text-[#E6C212]">Convert Code</span> to translate your code
                            </p>
                            <p className="text-[11px] text-text-muted/60 mt-1">
                                Powered by Groq AI • Compatibility check included • Supports 19+ languages
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
