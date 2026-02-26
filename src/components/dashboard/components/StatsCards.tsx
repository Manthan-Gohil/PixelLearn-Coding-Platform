"use client";

import { Zap, Flame, Target, Award } from "lucide-react";
import { User } from "@/store";

interface StatsCardsProps {
    user: User;
    totalExercisesCompleted: number;
}

export default function StatsCards({ user, totalExercisesCompleted }: StatsCardsProps) {
    const stats = [
        {
            icon: Zap,
            label: "Total XP",
            value: user.xp.toLocaleString(),
            color: "text-warning",
            bgColor: "bg-warning/10",
        },
        {
            icon: Flame,
            label: "Day Streak",
            value: user.streak.toString(),
            color: "text-danger",
            bgColor: "bg-danger/10",
        },
        {
            icon: Target,
            label: "Exercises Done",
            value: totalExercisesCompleted.toString(),
            color: "text-primary-light",
            bgColor: "bg-primary/10",
        },
        {
            icon: Award,
            label: "Badges Earned",
            value: user.badges.length.toString(),
            color: "text-accent",
            bgColor: "bg-accent/10",
        },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {stats.map((stat) => (
                <div
                    key={stat.label}
                    className="glass rounded-xl p-4 hover:border-primary/20 transition-all"
                >
                    <div className="flex items-center gap-3">
                        <div
                            className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}
                        >
                            <stat.icon className={`w-5 h-5 ${stat.color}`} />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-text-primary">
                                {stat.value}
                            </div>
                            <div className="text-xs text-text-muted">{stat.label}</div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
