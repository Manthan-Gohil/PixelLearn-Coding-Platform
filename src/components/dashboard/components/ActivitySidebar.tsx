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
import { User } from "@/store";
import { WEEKLY_ACTIVITY } from "@/services/data";

interface ActivitySidebarProps {
    user: User;
    weeklyXP: number;
    maxActivityXP: number;
}

export default function ActivitySidebar({ user, weeklyXP, maxActivityXP }: ActivitySidebarProps) {
    return (
        <div className="space-y-6">
            {/* Weekly Activity */}
            <div className="glass rounded-xl p-6">
                <h3 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-primary-light" />
                    Weekly Activity
                </h3>
                <div className="flex items-end justify-between gap-2 h-32 mb-3">
                    {WEEKLY_ACTIVITY.map((day) => (
                        <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
                            <div
                                className="w-full rounded-t-md gradient-primary transition-all duration-300 hover:opacity-80 min-h-[4px]"
                                style={{
                                    height: `${(day.xpEarned / maxActivityXP) * 100}%`,
                                }}
                            />
                            <span className="text-xs text-text-muted">{day.date}</span>
                        </div>
                    ))}
                </div>
                <div className="flex items-center justify-between text-xs text-text-muted pt-3 border-t border-border">
                    <span>Total: {weeklyXP} XP</span>
                    <span className="text-success flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" /> +12%
                    </span>
                </div>
            </div>

            {/* Streak Calendar */}
            <div className="glass rounded-xl p-6">
                <h3 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-warning" />
                    Current Streak
                </h3>
                <div className="text-center">
                    <div className="text-5xl font-bold gradient-text mb-1">
                        {user.streak}
                    </div>
                    <div className="text-sm text-text-muted mb-4">
                        days in a row
                    </div>
                    <div className="flex justify-center gap-1">
                        {Array.from({ length: 7 }).map((_, i) => (
                            <div
                                key={i}
                                className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium ${i < 5
                                    ? "gradient-primary text-white"
                                    : "bg-surface-hover text-text-muted"
                                    }`}
                            >
                                {i < 5 ? "🔥" : "·"}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Quick Links */}
            <div className="glass rounded-xl p-6">
                <h3 className="text-sm font-semibold text-text-primary mb-4">
                    Quick Actions
                </h3>
                <div className="space-y-2">
                    {[
                        {
                            href: "/courses",
                            label: "Browse Courses",
                            icon: BookOpen,
                        },
                        { href: "/ai-tools", label: "AI Career Tools", icon: BarChart3 },
                        { href: "/pricing", label: "Upgrade to Pro", icon: Zap },
                    ].map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-surface-hover transition-colors group"
                        >
                            <link.icon className="w-4 h-4 text-text-muted group-hover:text-primary-light" />
                            <span className="text-sm text-text-secondary group-hover:text-text-primary">
                                {link.label}
                            </span>
                            <ArrowRight className="w-4 h-4 text-text-muted ml-auto group-hover:text-primary-light" />
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
