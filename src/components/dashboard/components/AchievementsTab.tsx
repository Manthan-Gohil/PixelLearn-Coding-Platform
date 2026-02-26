"use client";

import { Trophy, TrendingUp } from "lucide-react";
import { User } from "@/store";

interface AchievementsTabProps {
    user: User;
}

export default function AchievementsTab({ user }: AchievementsTabProps) {
    return (
        <div className="space-y-6">
            <div className="glass rounded-xl p-6">
                <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-warning" />
                    Badges Collection
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {[
                        ...user.badges.map((b) => ({ ...b, unlocked: true })),
                        ...[
                            {
                                id: "xp-5000",
                                name: "Elite Coder",
                                description: "Earn 5000 XP",
                                icon: "💎",
                                unlocked: false,
                                requirement: { type: "xp" as const, value: 5000 },
                            },
                            {
                                id: "streak-30",
                                name: "Monthly Warrior",
                                description: "30-day streak",
                                icon: "🛡️",
                                unlocked: false,
                                requirement: {
                                    type: "streak" as const,
                                    value: 30,
                                },
                            },
                            {
                                id: "exercises-50",
                                name: "Problem Solver",
                                description: "Complete 50 exercises",
                                icon: "🧩",
                                unlocked: false,
                                requirement: {
                                    type: "exercises" as const,
                                    value: 50,
                                },
                            },
                        ].filter(
                            (b) => !user.badges.some((ub) => ub.id === b.id)
                        ),
                    ].map((badge) => (
                        <div
                            key={badge.id}
                            className={`p-4 rounded-xl border text-center transition-all ${"unlocked" in badge && badge.unlocked
                                ? "border-primary/30 bg-primary/5"
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
            <div className="glass rounded-xl p-6">
                <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary-light" />
                    XP Milestones
                </h3>
                <div className="space-y-4">
                    {[
                        { target: 1000, label: "Beginner" },
                        { target: 2500, label: "Intermediate" },
                        { target: 5000, label: "Advanced" },
                        { target: 10000, label: "Master" },
                    ].map((milestone) => {
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
                                            : "gradient-primary"
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
