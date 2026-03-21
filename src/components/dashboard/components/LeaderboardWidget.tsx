"use client";

import { Crown, Medal, RefreshCw, Flame } from "lucide-react";
import { useLeaderboard } from "@/hooks/useLeaderboard";

export default function LeaderboardWidget() {
    const { topUsers, currentUser, loading, error, refresh } = useLeaderboard();

    if (loading) {
        return (
            <div className="fb-card rounded-xl p-6">
                <p className="text-sm text-text-secondary">Loading leaderboard...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="fb-card rounded-xl p-6">
                <p className="text-sm text-danger mb-3">{error}</p>
                <button
                    onClick={refresh}
                    className="fb-btn-primary text-sm px-4 py-2"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="fb-card rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
                        <Medal className="w-5 h-5 text-[#E6C212]" />
                        Leaderboard
                    </h3>
                    <button
                        onClick={refresh}
                        className="p-2 rounded-lg hover:bg-surface-hover text-text-muted hover:text-text-primary transition-colors"
                        aria-label="Refresh leaderboard"
                    >
                        <RefreshCw className="w-4 h-4" />
                    </button>
                </div>

                <div className="space-y-2">
                    {topUsers.length === 0 && (
                        <p className="text-sm text-text-secondary">No leaderboard data yet.</p>
                    )}

                    {topUsers.map((entry) => {
                        const isCurrentUser = currentUser?.id === entry.id;
                        return (
                            <div
                                key={entry.id}
                                className={`rounded-xl border p-3 flex items-center gap-3 ${isCurrentUser
                                    ? "border-[#E6C212]/30 bg-[#E6C212]/5"
                                    : "border-border bg-surface-alt/50"
                                    }`}
                            >
                                <div className="w-8 h-8 rounded-lg bg-surface-hover flex items-center justify-center text-sm font-bold text-text-primary">
                                    {entry.rank === 1 ? (
                                        <Crown className="w-4 h-4 text-warning" />
                                    ) : (
                                        `#${entry.rank}`
                                    )}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-semibold text-text-primary truncate">
                                        {entry.name}
                                    </p>
                                    <p className="text-xs text-text-muted flex items-center gap-1">
                                        <Flame className="w-3.5 h-3.5 text-warning" />
                                        {entry.streak}-day streak
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-text-primary">{entry.xp} XP</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {currentUser && !topUsers.some((entry) => entry.id === currentUser.id) && (
                <div className="fb-card rounded-xl p-5 border border-[#E6C212]/20">
                    <p className="text-xs text-text-muted mb-1">Your Rank</p>
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-text-primary">#{currentUser.rank}</p>
                        <p className="text-sm text-text-secondary">{currentUser.xp} XP</p>
                    </div>
                </div>
            )}
        </div>
    );
}
