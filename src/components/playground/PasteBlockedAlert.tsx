"use client";

import { ShieldAlert, AlertTriangle } from "lucide-react";

interface PasteBlockedAlertProps {
    show: boolean;
    onClose: () => void;
}

export default function PasteBlockedAlert({ show, onClose }: PasteBlockedAlertProps) {
    if (!show) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="relative max-w-md w-full mx-4 animate-scale-in">
                {/* Glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-danger via-warning to-danger rounded-2xl opacity-40 blur-lg animate-pulse-slow" />
                <div className="relative p-6 rounded-2xl bg-surface-alt border border-danger/30 shadow-2xl">
                    {/* Shield icon */}
                    <div className="flex items-center justify-center mb-4">
                        <div className="w-16 h-16 rounded-full bg-danger/10 border-2 border-danger/30 flex items-center justify-center">
                            <ShieldAlert className="w-8 h-8 text-danger" />
                        </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-text-primary text-center mb-2">
                        Paste Blocked! 🚫
                    </h3>

                    {/* Message */}
                    <p className="text-text-secondary text-sm text-center mb-2">
                        <span className="text-danger font-semibold">Copying code from external sources is not allowed</span> in PixelLearn exercises.
                    </p>
                    <p className="text-text-muted text-xs text-center mb-5">
                        This is a proctor-enabled environment. Please write your own code to build real programming skills. You can use the theory section and hints provided to help you solve the exercise.
                    </p>

                    {/* Warning details */}
                    <div className="flex items-start gap-3 p-3 rounded-xl bg-warning/5 border border-warning/20 mb-5">
                        <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
                        <div className="text-xs text-text-secondary">
                            <strong className="text-warning">Proctor Mode Active:</strong> Pasting code from AI tools, websites, or any external source into the code editor is detected and blocked to ensure genuine learning.
                        </div>
                    </div>

                    {/* Action button */}
                    <button
                        onClick={onClose}
                        className="w-full py-2.5 rounded-xl font-semibold text-sm gradient-primary text-white hover:opacity-90 transition-all shadow-lg shadow-primary/20"
                    >
                        I Understand — I&apos;ll Write My Own Code
                    </button>
                </div>
            </div>
        </div>
    );
}
