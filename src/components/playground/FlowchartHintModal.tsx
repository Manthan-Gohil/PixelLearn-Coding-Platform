"use client";

import { GitBranch, X } from "lucide-react";
import { Exercise, FlowchartNode, FlowchartEdge } from "@/types";
import FlowchartDiagram from "./FlowchartDiagram";

interface FlowchartHintModalProps {
    show: boolean;
    onClose: () => void;
    exercise: Exercise;
    flowchart: { nodes: FlowchartNode[]; edges: FlowchartEdge[] } | null;
}

export default function FlowchartHintModal({
    show,
    onClose,
    exercise,
    flowchart,
}: FlowchartHintModalProps) {
    if (!show || !flowchart) return null;

    return (
        <div className="fixed inset-0 z-90 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="relative max-w-3xl w-full mx-4 max-h-[85vh] animate-scale-in flex flex-col">
                {/* Glow effect */}
                <div className="absolute -inset-1 bg-linear-to-r from-primary via-accent to-primary rounded-2xl opacity-20 blur-lg" />
                <div className="relative rounded-2xl bg-surface-alt border border-primary/20 shadow-2xl flex flex-col max-h-[85vh]">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-border shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                                <GitBranch className="w-5 h-5 text-primary-light" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-text-primary">
                                    Solution Flowchart
                                </h3>
                                <p className="text-xs text-text-muted">
                                    Visual approach to solve: {exercise.title}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-lg hover:bg-surface-hover text-text-muted hover:text-text-primary transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Legend */}
                    <div className="flex items-center gap-4 px-4 py-2.5 border-b border-border bg-surface/50 shrink-0 overflow-x-auto">
                        <div className="flex items-center gap-1.5 text-[10px] text-text-muted whitespace-nowrap">
                            <div className="w-3 h-3 rounded-full bg-success/20 border border-success/50" />
                            Start/End
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] text-text-muted whitespace-nowrap">
                            <div className="w-3 h-3 rounded bg-primary/20 border border-primary/50" />
                            Process
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] text-text-muted whitespace-nowrap">
                            <div className="w-3 h-3 rotate-45 bg-warning/20 border border-warning/50" />
                            Decision
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] text-text-muted whitespace-nowrap">
                            <div className="w-3 h-3 -skew-x-12 bg-accent/20 border border-accent/50" />
                            I/O
                        </div>
                    </div>

                    {/* Flowchart */}
                    <div className="flex-1 overflow-auto p-4 min-h-75">
                        <FlowchartDiagram
                            nodes={flowchart.nodes}
                            edges={flowchart.edges}
                        />
                    </div>

                    {/* Footer tip */}
                    <div className="p-3 border-t border-border bg-surface/50 shrink-0">
                        <p className="text-xs text-text-muted text-center">
                            💡 Follow the flowchart step-by-step to build your solution. Each box represents an action in your code.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
