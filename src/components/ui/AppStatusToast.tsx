"use client";

import { AlertTriangle, RefreshCw, X } from "lucide-react";
import { useApp } from "@/store";

export default function AppStatusToast() {
    const { appError, dismissAppError, retryLastAction, isRetryingAction } = useApp();

    if (!appError) return null;

    return (
        <div className="fixed top-5 right-5 z-110 w-full max-w-sm px-4 sm:px-0 animate-fade-in">
            <div className="rounded-2xl border border-warning/30 bg-surface-alt/95 backdrop-blur shadow-2xl p-4">
                <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-warning/10 border border-warning/20 flex items-center justify-center shrink-0">
                        <AlertTriangle className="w-5 h-5 text-warning" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-text-primary">Heads up</p>
                        <p className="text-sm text-text-secondary mt-1">{appError.message}</p>
                    </div>
                    <button
                        onClick={dismissAppError}
                        className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-hover transition-colors"
                        aria-label="Dismiss status message"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {appError.retryLabel && (
                    <button
                        onClick={retryLastAction}
                        disabled={isRetryingAction}
                        className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg gradient-primary text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        <RefreshCw className={`w-4 h-4 ${isRetryingAction ? "animate-spin" : ""}`} />
                        {isRetryingAction ? "Retrying..." : appError.retryLabel}
                    </button>
                )}
            </div>
        </div>
    );
}
