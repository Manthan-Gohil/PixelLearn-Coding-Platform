"use client";

import { useState, useCallback, useRef } from "react";
import { X, GitBranch, Loader2, Download, Sparkles } from "lucide-react";
import type { FlowchartNode, FlowchartEdge } from "@/types";
import FlowchartDiagram, { FlowchartDiagramHandle } from "./FlowchartDiagram";

interface CodeFlowchartModalProps {
    show: boolean;
    onClose: () => void;
    code: string;
    language: string;
}

export default function CodeFlowchartModal({
    show,
    onClose,
    code,
    language,
}: CodeFlowchartModalProps) {
    const [flowchart, setFlowchart] = useState<{ nodes: FlowchartNode[]; edges: FlowchartEdge[] } | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState("");
    const [hasGenerated, setHasGenerated] = useState(false);
    const diagramRef = useRef<FlowchartDiagramHandle>(null);

    const handleGenerate = useCallback(async () => {
        if (!code.trim()) return;
        setIsGenerating(true);
        setError("");
        setFlowchart(null);

        try {
            const response = await fetch("/api/ai/generate-flowchart", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code, language }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "Failed to generate flowchart. Please try again.");
                return;
            }

            if (data.flowchart) {
                setFlowchart(data.flowchart);
                setHasGenerated(true);
            }
        } catch {
            setError("Network error. Please check your connection and try again.");
        } finally {
            setIsGenerating(false);
        }
    }, [code, language]);

    const handleDownload = useCallback(() => {
        if (!diagramRef.current) return;

        const canvas = diagramRef.current.getCanvas();
        if (!canvas) return;

        // Create a temporary canvas with white background for better download quality
        const tempCanvas = document.createElement("canvas");
        const tempCtx = tempCanvas.getContext("2d");
        if (!tempCtx) return;

        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;

        // Draw dark background
        tempCtx.fillStyle = "#0f1729";
        tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

        // Draw the original canvas content on top
        tempCtx.drawImage(canvas, 0, 0);

        const dataUrl = tempCanvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.download = `flowchart-${language}-${Date.now()}.png`;
        link.href = dataUrl;
        link.click();
    }, [language]);

    if (!show) return null;

    return (
        <div
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div className="relative max-w-3xl w-full mx-4 max-h-[90vh] animate-scale-in flex flex-col">
                {/* Glow effect */}
                <div className="absolute -inset-1 bg-linear-to-r from-[#00FFFF]/20 via-[#E6C212]/25 to-[#00FFFF]/20 rounded-2xl opacity-25 blur-lg" />
                <div className="relative rounded-2xl bg-surface-alt border border-[#00FFFF]/20 shadow-2xl flex flex-col max-h-[90vh]">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-border shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00FFFF]/15 to-[#E6C212]/15 border border-[#00FFFF]/25 flex items-center justify-center">
                                <GitBranch className="w-5 h-5 text-[#00FFFF]" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-text-primary">
                                    Code Flowchart
                                </h3>
                                <p className="text-xs text-text-muted">
                                    AI-generated flowchart from your code
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {flowchart && (
                                <button
                                    onClick={handleDownload}
                                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-gradient-to-r from-[#00FFFF]/10 to-[#00FFFF]/5 border border-[#00FFFF]/30 text-[#00FFFF] hover:bg-[#00FFFF]/15 transition-all"
                                    title="Download flowchart as PNG"
                                >
                                    <Download className="w-3.5 h-3.5" />
                                    Download PNG
                                </button>
                            )}
                            <button
                                onClick={onClose}
                                className="p-2 rounded-lg hover:bg-surface-hover text-text-muted hover:text-text-primary transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Legend */}
                    {flowchart && (
                        <div className="flex items-center gap-4 px-4 py-2.5 border-b border-border bg-surface/50 shrink-0 overflow-x-auto">
                            <div className="flex items-center gap-1.5 text-[10px] text-text-muted whitespace-nowrap">
                                <div className="w-3 h-3 rounded-full bg-success/20 border border-success/50" />
                                Start/End
                            </div>
                            <div className="flex items-center gap-1.5 text-[10px] text-text-muted whitespace-nowrap">
                                <div className="w-3 h-3 rounded bg-[#E6C212]/20 border border-[#E6C212]/50" />
                                Process
                            </div>
                            <div className="flex items-center gap-1.5 text-[10px] text-text-muted whitespace-nowrap">
                                <div className="w-3 h-3 rotate-45 bg-warning/20 border border-warning/50" />
                                Decision
                            </div>
                            <div className="flex items-center gap-1.5 text-[10px] text-text-muted whitespace-nowrap">
                                <div className="w-3 h-3 -skew-x-12 bg-[#E6C212]/10 border border-[#E6C212]/30" />
                                I/O
                            </div>
                        </div>
                    )}

                    {/* Body */}
                    <div className="flex-1 overflow-auto p-4 min-h-75">
                        {/* Generate button (show if not generated yet or to regenerate) */}
                        {!isGenerating && !flowchart && (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#00FFFF]/10 to-[#E6C212]/10 border border-[#00FFFF]/20 flex items-center justify-center mb-6">
                                    <GitBranch className="w-9 h-9 text-[#00FFFF]/50" />
                                </div>
                                {error ? (
                                    <div className="mb-4 px-4 py-3 rounded-xl bg-danger/10 border border-danger/30 text-danger text-sm animate-scale-in max-w-md">
                                        {error}
                                    </div>
                                ) : (
                                    <>
                                        <p className="text-sm text-text-muted mb-1">
                                            Generate a visual flowchart from your current code
                                        </p>
                                        <p className="text-[11px] text-text-muted/60 mb-6">
                                            AI will analyze your code structure and create a step-by-step diagram
                                        </p>
                                    </>
                                )}
                                <button
                                    onClick={handleGenerate}
                                    disabled={!code.trim()}
                                    className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-[#00FFFF] to-[#00CCCC] text-black hover:shadow-lg hover:shadow-[#00FFFF]/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300"
                                >
                                    <Sparkles className="w-4 h-4" />
                                    {hasGenerated ? "Regenerate Flowchart" : "Generate Flowchart"}
                                </button>
                            </div>
                        )}

                        {/* Loading state */}
                        {isGenerating && (
                            <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
                                <div className="w-16 h-16 rounded-2xl bg-[#00FFFF]/10 border border-[#00FFFF]/20 flex items-center justify-center mb-4">
                                    <Loader2 className="w-8 h-8 text-[#00FFFF] animate-spin" />
                                </div>
                                <p className="text-sm text-text-muted">
                                    Analyzing your code and generating flowchart…
                                </p>
                                <p className="text-[11px] text-text-muted/60 mt-1">
                                    Powered by Groq AI
                                </p>
                            </div>
                        )}

                        {/* Flowchart display */}
                        {flowchart && !isGenerating && (
                            <div className="animate-scale-in">
                                <FlowchartDiagram
                                    ref={diagramRef}
                                    nodes={flowchart.nodes}
                                    edges={flowchart.edges}
                                />
                                {/* Regenerate button */}
                                <div className="mt-4 flex justify-center">
                                    <button
                                        onClick={handleGenerate}
                                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium border border-border hover:border-[#00FFFF]/30 text-text-muted hover:text-[#00FFFF] transition-all"
                                    >
                                        <Sparkles className="w-3.5 h-3.5" />
                                        Regenerate
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-3 border-t border-border bg-surface/50 shrink-0">
                        <p className="text-xs text-text-muted text-center">
                            💡 This flowchart is generated from your actual code. Download it for revision and code review.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
