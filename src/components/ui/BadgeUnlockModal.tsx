"use client";

import { Sparkles, X } from "lucide-react";
import { useApp } from "@/store";

export default function BadgeUnlockModal() {
    const { activeBadgeUnlock, dismissActiveBadgeUnlock } = useApp();

    if (!activeBadgeUnlock) return null;

    return (
        <div className="fixed bottom-5 right-5 z-120 w-full max-w-sm px-4 sm:px-0 animate-fade-in">
            <div className="relative">
                <div className="absolute -inset-1 rounded-2xl bg-linear-to-r from-warning via-primary to-accent opacity-30 blur-md" />
                <div className="relative rounded-2xl border border-primary/30 bg-surface-alt/95 backdrop-blur p-4 shadow-2xl animate-scale-in">
                    <button
                        onClick={dismissActiveBadgeUnlock}
                        className="absolute right-2 top-2 p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-hover transition-colors"
                        aria-label="Dismiss badge unlock"
                    >
                        <X className="w-4 h-4" />
                    </button>

                    <div className="flex items-start gap-3 pr-8">
                        <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-2xl">
                            {activeBadgeUnlock.icon}
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs font-semibold uppercase tracking-wide text-warning flex items-center gap-1">
                                <Sparkles className="w-3.5 h-3.5" />
                                New Badge Unlocked
                            </p>
                            <h4 className="text-base font-bold text-text-primary truncate">
                                {activeBadgeUnlock.name}
                            </h4>
                            <p className="text-sm text-text-secondary mt-0.5">
                                {activeBadgeUnlock.description}
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={dismissActiveBadgeUnlock}
                        className="mt-4 w-full py-2 rounded-lg gradient-primary text-white text-sm font-semibold hover:opacity-90 transition-opacity"
                    >
                        Awesome
                    </button>
                </div>
            </div>
        </div>
    );
}
