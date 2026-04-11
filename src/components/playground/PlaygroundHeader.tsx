"use client";

import Link from "next/link";
import { ArrowLeft, CheckCircle2, ShieldAlert, PanelLeftClose, PanelRightClose, ArrowRight, Zap, Menu, BookOpen, FileCode, Terminal } from "lucide-react";
import { useState } from "react";

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
    mobilePanel?: "theory" | "editor" | "output";
    setMobilePanel?: (panel: "theory" | "editor" | "output") => void;
    isFrontend?: boolean;
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
    mobilePanel,
    setMobilePanel,
    isFrontend,
}: PlaygroundHeaderProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <>
            <div className="h-14 border-b border-border bg-surface-alt/80 flex items-center shrink-0 overflow-x-auto">
                <div className="flex items-center justify-between px-4 gap-3 min-w-max w-full">
                    <div className="flex items-center gap-3">
                        <Link
                            href={`/courses/${courseId}`}
                            className="flex items-center gap-1 text-text-secondary hover:text-text-primary text-sm transition-colors whitespace-nowrap"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span className="hidden sm:inline">{courseTitle}</span>
                        </Link>
                        <span className="text-border">|</span>
                        <h1 className="text-sm font-semibold text-text-primary truncate max-w-40 sm:max-w-75">
                            {exerciseTitle}
                        </h1>
                        {completed && (
                            <span className="flex items-center gap-1 text-xs text-success font-medium whitespace-nowrap">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                            </span>
                        )}
                        {/* Proctor Badge */}
                        <span className="flex items-center gap-1 text-xs text-danger/80 font-medium bg-danger/5 border border-danger/20 px-2 py-0.5 rounded-full fb-mono whitespace-nowrap">
                            <ShieldAlert className="w-3 h-3" /> Proctor Mode
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        {/* Toggle theory panel (Desktop Only) */}
                        <button
                            onClick={() => setShowTheoryPanel(!showTheoryPanel)}
                            className="hidden lg:block p-1.5 rounded-lg hover:bg-surface-hover text-text-muted hover:text-text-primary transition-colors"
                            title={showTheoryPanel ? "Hide theory" : "Show theory"}
                        >
                            {showTheoryPanel ? (
                                <PanelLeftClose className="w-4 h-4" />
                            ) : (
                                <PanelRightClose className="w-4 h-4" />
                            )}
                        </button>
                        <span className="hidden lg:inline text-border">|</span>
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
                        <span className="text-xs text-text-muted fb-mono whitespace-nowrap">
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
                        <span className="flex items-center gap-1 text-xs text-[#E6C212] font-medium fb-mono whitespace-nowrap">
                            <Zap className="w-3 h-3" /> {exerciseXp} XP
                        </span>

                        {/* Mobile Menu Toggle */}
                        {setMobilePanel && (
                            <>
                                <span className="lg:hidden text-border mx-1">|</span>
                                <button
                                    onClick={() => setIsMenuOpen(true)}
                                    className="lg:hidden flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#E6C212]/10 text-[#E6C212] hover:bg-[#E6C212]/20 transition-colors border border-[#E6C212]/20 shadow-sm"
                                    title="Open Menu"
                                >
                                    <Menu className="w-4 h-4" />
                                    <span className="text-xs font-semibold uppercase tracking-wider hidden sm:inline">
                                        {mobilePanel === 'editor' ? 'Code' : mobilePanel === 'theory' ? 'Theory' : 'Output'}
                                    </span>
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isMenuOpen && setMobilePanel && (
                <div className="fixed inset-0 z-[110] lg:hidden">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)} />
                    <div className="absolute top-14 right-2 w-56 bg-surface-alt border border-border rounded-xl shadow-2xl overflow-hidden animate-in slide-in-from-top-2 fade-in duration-200">
                        <div className="px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider border-b border-border bg-surface-hover/50">
                            Navigation Menu
                        </div>
                        <div className="flex flex-col p-1.5 space-y-0.5">
                            <button
                                onClick={() => { setMobilePanel('theory'); setIsMenuOpen(false); }}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                                    mobilePanel === 'theory' 
                                        ? 'bg-[#E6C212]/10 text-[#E6C212] font-medium' 
                                        : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary'
                                }`}
                            >
                                <BookOpen className={`w-4 h-4 ${mobilePanel === 'theory' ? 'text-[#E6C212]' : 'text-text-muted'}`} />
                                Theory
                            </button>
                            <button
                                onClick={() => { setMobilePanel('editor'); setIsMenuOpen(false); }}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                                    mobilePanel === 'editor' 
                                        ? 'bg-[#E6C212]/10 text-[#E6C212] font-medium' 
                                        : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary'
                                }`}
                            >
                                <FileCode className={`w-4 h-4 ${mobilePanel === 'editor' ? 'text-[#E6C212]' : 'text-text-muted'}`} />
                                Code Editor
                            </button>
                            <button
                                onClick={() => { setMobilePanel('output'); setIsMenuOpen(false); }}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                                    mobilePanel === 'output' 
                                        ? 'bg-[#E6C212]/10 text-[#E6C212] font-medium' 
                                        : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary'
                                }`}
                            >
                                <Terminal className={`w-4 h-4 ${mobilePanel === 'output' ? 'text-[#E6C212]' : 'text-text-muted'}`} />
                                {isFrontend ? 'Live Preview' : 'Output Terminal'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
