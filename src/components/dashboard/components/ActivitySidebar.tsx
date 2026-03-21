"use client";

import Link from "next/link";
import {
    BarChart3,
    TrendingUp,
    Calendar,
    BookOpen,
    Zap,
    ArrowRight
} from "lucide-react";
import type { User } from "@/types";
import { WEEKLY_ACTIVITY } from "@/services/data";
import { DASHBOARD_QUICK_ACTIONS, STREAK_DAYS } from "@/constants/dashboard";
import { DashboardQuickActionIconName } from "@/types/dashboard";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import { useScrollReveal } from "@/hooks/useScrollReveal";

interface ActivitySidebarProps {
    user: User;
    weeklyXP: number;
    maxActivityXP: number;
}

export default function ActivitySidebar({ user, weeklyXP, maxActivityXP }: ActivitySidebarProps) {
    const activityRef = useScrollReveal<HTMLDivElement>({ direction: "right", distance: 40, duration: 0.6 });
    const streakRef = useScrollReveal<HTMLDivElement>({ direction: "right", distance: 40, duration: 0.6, delay: 0.1 });
    const quickRef = useScrollReveal<HTMLDivElement>({ direction: "right", distance: 40, duration: 0.6, delay: 0.2 });

    const quickActionIcons: Record<DashboardQuickActionIconName, typeof BookOpen> = {
        BookOpen,
        BarChart3,
        Zap,
    };

    const today = new Date();
    const todayUtc = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
    const lastStreakDate = user.lastStreakDate ? new Date(user.lastStreakDate) : null;
    const lastStreakUtc = lastStreakDate
        ? Date.UTC(lastStreakDate.getUTCFullYear(), lastStreakDate.getUTCMonth(), lastStreakDate.getUTCDate())
        : null;
    const checkedInToday = lastStreakUtc === todayUtc;
    const activeStreakDays = Math.min(user.streak, STREAK_DAYS);
    const streakHint = checkedInToday
        ? "Streak secured for today. Come back tomorrow to extend it."
        : "Complete one exercise today to keep your streak alive.";

    return (
        <div className="space-y-6">
            {/* Weekly Activity */}
            <div ref={activityRef} className="fb-card rounded-xl p-6 card-hover-glow">
                <h3 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-[#E6C212]" />
                    Weekly Activity
                </h3>
                <div className="flex items-end justify-between gap-2 h-32 mb-3">
                    {WEEKLY_ACTIVITY.map((day, i) => (
                        <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
                            <div
                                className="w-full rounded-t-md bg-[#E6C212] transition-all duration-500 hover:opacity-80 min-h-1 animate-fill-bar"
                                style={{
                                    height: `${(day.xpEarned / maxActivityXP) * 100}%`,
                                    animationDelay: `${0.3 + i * 0.1}s`,
                                }}
                            />
                            <span className="text-xs text-text-muted">{day.date}</span>
                        </div>
                    ))}
                </div>
                <div className="flex items-center justify-between text-xs text-text-muted pt-3 border-t border-border">
                    <span>Total: <AnimatedCounter value={weeklyXP} duration={1500} /> XP</span>
                    <span className="text-success flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" /> +12%
                    </span>
                </div>
            </div>

            {/* Streak Calendar */}
            <div ref={streakRef} className="fb-card rounded-xl p-6 card-hover-glow">
                <h3 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#E6C212]" />
                    Current Streak
                </h3>
                <div className="text-center">
                    <div className="text-5xl font-bold text-[#E6C212] mb-1 fb-mono">
                        <AnimatedCounter value={user.streak} duration={1200} />
                    </div>
                    <div className="text-sm text-text-muted mb-4">
                        days in a row
                    </div>
                    <p className="text-xs text-text-secondary mb-4">
                        {streakHint}
                    </p>
                    <div className="flex justify-center gap-1">
                        {Array.from({ length: STREAK_DAYS }).map((_, i) => (
                            <div
                                key={i}
                                className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium stagger-fade-up ${i < activeStreakDays
                                    ? "bg-[#E6C212] text-black"
                                    : "bg-surface-hover text-text-muted"
                                    }`}
                                style={{ animationDelay: `${0.5 + i * 0.06}s` }}
                            >
                                {i < activeStreakDays ? "🔥" : "·"}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Quick Links */}
            <div ref={quickRef} className="fb-card rounded-xl p-6 card-hover-glow">
                <h3 className="text-sm font-semibold text-text-primary mb-4">
                    Quick Actions
                </h3>
                <div className="space-y-2">
                    {DASHBOARD_QUICK_ACTIONS.map((link) => {
                        const Icon = quickActionIcons[link.icon];
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="flex items-center gap-3 p-3 rounded-lg hover:bg-surface-hover transition-all duration-200 group hover-bounce"
                            >
                                <Icon className="w-4 h-4 text-text-muted group-hover:text-[#E6C212] transition-colors" />
                                <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors">
                                    {link.label}
                                </span>
                                <ArrowRight className="w-4 h-4 text-text-muted ml-auto group-hover:text-[#E6C212] group-hover:translate-x-1 transition-all" />
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
