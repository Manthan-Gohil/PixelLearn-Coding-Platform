"use client";

import Link from "next/link";
import { ArrowLeft, CheckCircle2, ShieldAlert, PanelLeftClose, PanelRightClose, ArrowRight, Zap } from "lucide-react";

interface PlaygroundHeaderProps {
    courseId: string;
    courseTitle: string;
    exerciseTitle: string;
    completed: boolean;
    exerciseXp: number;
    showTheoryPanel: boolean;
    setShowTheoryPanel: (show: boolean) => void;
    prevExerciseId?: string;
    nextExerciseId?: string;
    exerciseIndex: number;
    totalExercises: number;
}

export default function PlaygroundHeader({
    courseId,
    courseTitle,
    exerciseTitle,
    completed,
    exerciseXp,
    showTheoryPanel,
    setShowTheoryPanel,
    prevExerciseId,
    nextExerciseId,
    exerciseIndex,
    totalExercises,
}: PlaygroundHeaderProps) {
    return (
        <div className="h-14 border-b border-border bg-surface-alt/80 flex items-center justify-between px-4 shrink-0">
            <div className="flex items-center gap-4">
                <Link
                    href={`/courses/${courseId}`}
                    className="flex items-center gap-1 text-text-secondary hover:text-text-primary text-sm transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">{courseTitle}</span>
                </Link>
                <span className="text-border">|</span>
                <h1 className="text-sm font-semibold text-text-primary truncate max-w-75">
                    {exerciseTitle}
                </h1>
                {completed && (
                    <span className="flex items-center gap-1 text-xs text-success font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                    </span>
                )}
                {/* Proctor Badge */}
                <span className="flex items-center gap-1 text-xs text-danger/80 font-medium bg-danger/5 border border-danger/20 px-2 py-0.5 rounded-full fb-mono">
                    <ShieldAlert className="w-3 h-3" /> Proctor Mode
                </span>
            </div>
            <div className="flex items-center gap-2">
                {/* Toggle theory panel */}
                <button
                    onClick={() => setShowTheoryPanel(!showTheoryPanel)}
                    className="p-1.5 rounded-lg hover:bg-surface-hover text-text-muted hover:text-text-primary transition-colors"
                    title={showTheoryPanel ? "Hide theory" : "Show theory"}
                >
                    {showTheoryPanel ? (
                        <PanelLeftClose className="w-4 h-4" />
                    ) : (
                        <PanelRightClose className="w-4 h-4" />
                    )}
                </button>
                <span className="text-border">|</span>
                {/* Nav Exercises */}
                {prevExerciseId && (
                    <Link
                        href={`/playground/${courseId}/${prevExerciseId}`}
                        className="p-1.5 rounded-lg hover:bg-surface-hover text-text-muted hover:text-text-primary transition-colors"
                        title="Previous exercise"
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </Link>
                )}
                <span className="text-xs text-text-muted fb-mono">
                    {exerciseIndex + 1} / {totalExercises}
                </span>
                {nextExerciseId && (
                    <Link
                        href={`/playground/${courseId}/${nextExerciseId}`}
                        className="p-1.5 rounded-lg hover:bg-surface-hover text-text-muted hover:text-text-primary transition-colors"
                        title="Next exercise"
                    >
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                )}
                <span className="text-border mx-1">|</span>
                <span className="flex items-center gap-1 text-xs text-[#E6C212] font-medium fb-mono">
                    <Zap className="w-3 h-3" /> {exerciseXp} XP
                </span>
            </div>
        </div>
    );
}
