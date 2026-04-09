"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { X, ArrowRightLeft, Loader2, Copy, Check, ChevronDown, Sparkles } from "lucide-react";

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

    // Reset state when modal opens
    useEffect(() => {
        if (show) {
            setConvertedCode("");
            setError("");
            setCopied(false);
            setTargetLang("");
            setDropdownOpen(false);
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
                                AI-powered code translation
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
                                Converting with AI…
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

                    {/* Converted code display */}
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
                            <div className="relative rounded-xl overflow-hidden border border-border bg-[#0d0d0d]">
                                <pre className="p-4 overflow-auto text-sm font-mono text-text-secondary leading-relaxed" style={{ maxHeight: "300px" }}>
                                    <code>{convertedCode}</code>
                                </pre>
                                {/* Gradient fade at bottom */}
                                <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-[#0d0d0d] to-transparent pointer-events-none" />
                            </div>
                        </div>
                    )}

                    {/* Empty state when no conversion yet */}
                    {!convertedCode && !error && !isConverting && (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                            <div className="w-16 h-16 rounded-2xl bg-surface border border-border flex items-center justify-center mb-4">
                                <ArrowRightLeft className="w-7 h-7 text-text-muted/40" />
                            </div>
                            <p className="text-sm text-text-muted">
                                Select a target language and click <span className="font-semibold text-[#E6C212]">Convert Code</span> to translate your code
                            </p>
                            <p className="text-[11px] text-text-muted/60 mt-1">
                                Powered by Groq AI • Supports 19+ languages
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
