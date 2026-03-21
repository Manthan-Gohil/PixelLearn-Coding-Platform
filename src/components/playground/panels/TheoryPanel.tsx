"use client";

import { BookOpen, Code2, GitBranch, EyeOff, Eye, Lightbulb } from "lucide-react";
import type { Exercise, FlowchartEdge, FlowchartNode } from "@/types";

interface TheoryPanelProps {
    exercise: Exercise;
    showTheory: boolean;
    setShowTheory: (show: boolean) => void;
    showHints: boolean;
    setShowHints: (show: boolean) => void;
    currentHintIndex: number;
    setCurrentHintIndex: (index: number | ((p: number) => number)) => void;
    setShowFlowchart: (show: boolean) => void;
    isFrontend: boolean;
    courseId: string;
    exerciseFlowchart: { nodes: FlowchartNode[]; edges: FlowchartEdge[] } | null;
}

export default function TheoryPanel({
    exercise,
    showTheory,
    setShowTheory,
    showHints,
    setShowHints,
    currentHintIndex,
    setCurrentHintIndex,
    setShowFlowchart,
    isFrontend,
    exerciseFlowchart,
}: TheoryPanelProps) {
    return (
        <div
            className={`border-r border-border flex flex-col overflow-hidden transition-all duration-300 ${isFrontend ? "w-1/4" : "w-1/2"
                }`}
        >
            {/* Panel Tabs */}
            <div className="flex items-center border-b border-border bg-surface-alt/50 shrink-0">
                <button
                    onClick={() => setShowTheory(true)}
                    className={`px-4 py-2.5 text-sm font-medium transition-colors ${showTheory
                        ? "text-[#E6C212] border-b-2 border-[#E6C212]"
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
                        ? "text-[#E6C212] border-b-2 border-[#E6C212]"
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
                                            <span className="text-[#E6C212] mt-1">•</span>
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

                        {/* Problem Statement in Theory tab too */}
                        <div className="mt-6 pt-5 border-t border-border">
                            <h3 className="text-base font-semibold text-text-primary mb-2">
                                📝 Exercise Question
                            </h3>
                            <p className="text-text-secondary text-sm leading-relaxed">
                                {exercise.problemStatement}
                            </p>
                        </div>

                        {/* Flowchart Hint Button in Theory */}
                        {exerciseFlowchart && (
                            <div className="mt-5">
                                <button
                                    onClick={() => setShowFlowchart(true)}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#E6C212]/5 border border-[#E6C212]/20 text-[#E6C212] hover:bg-[#E6C212]/10 transition-all group"
                                >
                                    <GitBranch className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                                    <span className="text-sm font-medium">View Solution Flowchart</span>
                                    <span className="text-xs text-text-muted">(Visual Hint)</span>
                                </button>
                            </div>
                        )}
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

                        {/* Flowchart Hint Button */}
                        {exerciseFlowchart && (
                            <div className="p-3 rounded-xl bg-[#0f0f0f] border border-border-light">
                                <button
                                    onClick={() => setShowFlowchart(true)}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#E6C212]/10 border border-[#E6C212]/20 text-[#E6C212] hover:bg-[#E6C212]/15 transition-all group"
                                >
                                    <GitBranch className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                                    <span className="text-sm font-medium">💡 Need Help? View Flowchart</span>
                                </button>
                                <p className="text-[10px] text-text-muted text-center mt-1.5">
                                    See a visual diagram of how to approach this exercise
                                </p>
                            </div>
                        )}

                        {/* Hints */}
                        <div>
                            <button
                                onClick={() => setShowHints(!showHints)}
                                className="flex items-center gap-2 text-sm font-medium text-[#E6C212] hover:text-[#f0d030] transition-colors"
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
                                            onClick={() => setCurrentHintIndex((p: number) => p + 1)}
                                            className="text-xs text-[#E6C212] hover:text-[#f0d030]"
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
    );
}
