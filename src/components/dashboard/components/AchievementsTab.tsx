"use client";

import { Trophy, TrendingUp } from "lucide-react";
import type { User } from "@/types";
import { LOCKED_ACHIEVEMENT_BADGES, XP_MILESTONES } from "@/constants/dashboard";

interface AchievementsTabProps {
    user: User;
}

export default function AchievementsTab({ user }: AchievementsTabProps) {
    return (
        <div className="space-y-6">
            <div className="fb-card rounded-xl p-6">
                <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-[#E6C212]" />
                    Badges Collection
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {[
                        ...user.badges.map((b) => ({ ...b, unlocked: true })),
                        ...LOCKED_ACHIEVEMENT_BADGES.map((badge) => ({ ...badge, unlocked: false })).filter(
                            (b) => !user.badges.some((ub) => ub.id === b.id)
                        ),
                    ].map((badge) => (
                        <div
                            key={badge.id}
                            className={`p-4 rounded-xl border text-center transition-all ${"unlocked" in badge && badge.unlocked
                                ? "border-[#E6C212]/30 bg-[#E6C212]/5"
                                : "border-border bg-surface-alt/50 opacity-50"
                                }`}
                        >
                            <div className="text-3xl mb-2">{badge.icon}</div>
                            <div className="text-sm font-semibold text-text-primary">
                                {badge.name}
                            </div>
                            <div className="text-xs text-text-muted mt-1">
                                {badge.description}
                            </div>
                            {"unlocked" in badge && badge.unlocked && (
                                <div className="mt-2 text-xs text-success font-medium">
                                    ✓ Unlocked
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* XP Milestones */}
            <div className="fb-card rounded-xl p-6">
                <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-[#E6C212]" />
                    XP Milestones
                </h3>
                <div className="space-y-4">
                    {XP_MILESTONES.map((milestone) => {
                        const progress = Math.min(
                            (user.xp / milestone.target) * 100,
                            100
                        );
                        return (
                            <div key={milestone.target}>
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm text-text-secondary">
                                        {milestone.label}
                                    </span>
                                    <span className="text-sm font-medium text-text-primary">
                                        {user.xp}/{milestone.target} XP
                                    </span>
                                </div>
                                <div className="w-full bg-surface-hover rounded-full h-2">
                                    <div
                                        className={`h-2 rounded-full transition-all duration-500 ${progress >= 100
                                            ? "bg-success"
                                            : "bg-[#E6C212]"
                                            }`}
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
