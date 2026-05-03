"use client";

import { useState } from "react";
import { Terminal, X, ImageIcon, Download, Maximize2, ChevronDown, ChevronUp } from "lucide-react";

interface OutputPanelProps {
    output: string;
    setOutput: (output: string) => void;
    plots?: string[]; // base64-encoded PNG strings
}

function PlotImage({ b64, index }: { b64: string; index: number }) {
    const [expanded, setExpanded] = useState(false);
    const src = `data:image/png;base64,${b64}`;

    function handleDownload() {
        const a = document.createElement("a");
        a.href = src;
        a.download = `plot-${index + 1}.png`;
        a.click();
    }

    return (
        <>
            {/* Lightbox overlay */}
            {expanded && (
                <div
                    className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
                    onClick={() => setExpanded(false)}
                >
                    <div
                        className="relative max-w-5xl w-full"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setExpanded(false)}
                            className="absolute -top-10 right-0 text-white/70 hover:text-white transition-colors text-sm flex items-center gap-1"
                        >
                            <X className="w-4 h-4" /> Close
                        </button>
                        <img
                            src={src}
                            alt={`Plot ${index + 1}`}
                            className="w-full rounded-xl shadow-2xl border border-white/10"
                        />
                    </div>
                </div>
            )}

            {/* Inline plot card */}
            <div className="mt-3 rounded-xl overflow-hidden border border-border bg-surface/60 shadow-md group">
                {/* Header bar */}
                <div className="flex items-center justify-between px-3 py-1.5 border-b border-border bg-surface-alt/50">
                    <div className="flex items-center gap-1.5 text-xs text-text-muted">
                        <ImageIcon className="w-3.5 h-3.5 text-[#E6C212]" />
                        <span className="font-medium text-[#E6C212]">Plot {index + 1}</span>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                            onClick={handleDownload}
                            title="Download PNG"
                            className="p-1 rounded hover:bg-surface-hover text-text-muted hover:text-text-primary transition-colors"
                        >
                            <Download className="w-3.5 h-3.5" />
                        </button>
                        <button
                            onClick={() => setExpanded(true)}
                            title="Expand"
                            className="p-1 rounded hover:bg-surface-hover text-text-muted hover:text-text-primary transition-colors"
                        >
                            <Maximize2 className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>

                {/* Image */}
                <div className="p-2 bg-white/[0.03]">
                    <img
                        src={src}
                        alt={`Plot ${index + 1}`}
                        className="w-full rounded-lg cursor-zoom-in object-contain max-h-[400px]"
                        onClick={() => setExpanded(true)}
                    />
                </div>
            </div>
        </>
    );
}

export default function OutputPanel({ output, setOutput, plots = [] }: OutputPanelProps) {
    const hasPlots = plots.length > 0;
    const hasText = !!output;
    const isEmpty = !hasText && !hasPlots;

    const isError =
        output.toLowerCase().includes("error") ||
        output.toLowerCase().includes("traceback") ||
        output.startsWith("⚠");

    // Pyodide emits live status strings while loading (e.g., "Downloading…")
    const isStatus =
        !isError &&
        (output.includes("Downloading") ||
            output.includes("Initialising") ||
            output.includes("Installing") ||
            output.includes("Running…"));

    return (
        <div className="flex-1 border-border bg-surface-alt flex flex-col min-h-0">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-border shrink-0">
                <div className="flex items-center gap-2 text-xs text-text-muted">
                    <Terminal className="w-4 h-4" />
                    Output Console
                    {hasPlots && (
                        <span className="ml-2 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E6C212]/20 text-[#E6C212] border border-[#E6C212]/30">
                            {plots.length} Plot{plots.length > 1 ? "s" : ""}
                        </span>
                    )}
                </div>
                {(hasText || hasPlots) && (
                    <button
                        onClick={() => setOutput("")}
                        className="p-1 rounded hover:bg-surface-hover text-text-muted hover:text-text-primary transition-colors"
                    >
                        <X className="w-3 h-3" />
                    </button>
                )}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-1 text-sm">
                {isEmpty ? (
                    <span className="text-text-muted text-xs block text-center sm:text-left mt-2">
                        Click &quot;Run Code&quot; to see output here...
                    </span>
                ) : (
                    <>
                        {/* Text output */}
                        {hasText && (
                            <pre
                                className={`whitespace-pre-wrap font-mono text-sm ${
                                    isError
                                        ? "text-danger"
                                        : isStatus
                                        ? "text-text-muted animate-pulse"
                                        : "text-success"
                                }`}
                            >
                                {output}
                            </pre>
                        )}

                        {/* Plot images — rendered just like Colab cells */}
                        {hasPlots && (
                            <div className="space-y-1">
                                {plots.map((b64, i) => (
                                    <PlotImage key={i} b64={b64} index={i} />
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
