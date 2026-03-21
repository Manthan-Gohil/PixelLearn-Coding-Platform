"use client";

import { Zap, Flame, Target, Award } from "lucide-react";
import type { User } from "@/types";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import { useStaggerReveal } from "@/hooks/useScrollReveal";

interface StatsCardsProps {
    user: User;
    totalExercisesCompleted: number;
}

export default function StatsCards({ user, totalExercisesCompleted }: StatsCardsProps) {
    const gridRef = useStaggerReveal<HTMLDivElement>(".stat-card", {
        direction: "up",
        distance: 30,
        stagger: 0.08,
        scale: 0.95,
        duration: 0.5,
    });

    const stats = [
        {
            icon: Zap,
            label: "Total XP",
            value: user.xp,
            suffix: "",
            color: "text-warning",
            bgColor: "bg-warning/10",
            glowColor: "shadow-warning/20",
        },
        {
            icon: Flame,
            label: "Day Streak",
            value: user.streak,
            suffix: "",
            color: "text-danger",
            bgColor: "bg-danger/10",
            glowColor: "shadow-danger/20",
        },
        {
            icon: Target,
            label: "Exercises Done",
            value: totalExercisesCompleted,
            suffix: "",
            color: "text-[#E6C212]",
            bgColor: "bg-[#E6C212]/10",
            glowColor: "shadow-primary/20",
        },
        {
            icon: Award,
            label: "Badges Earned",
            value: user.badges.length,
            suffix: "",
            color: "text-accent",
            bgColor: "bg-accent/10",
            glowColor: "shadow-accent/20",
        },
    ];

    return (
        <div ref={gridRef} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, i) => (
                <div
                    key={stat.label}
                    className={`stat-card fb-card rounded-xl p-4 hover:border-border-light transition-all duration-300 card-hover-glow spotlight-card`}
                    onMouseMove={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        e.currentTarget.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
                        e.currentTarget.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
                    }}
                >
                    <div className="flex items-center gap-3">
                        <div
                            className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform`}
                        >
                            <stat.icon className={`w-5 h-5 ${stat.color} animate-float-subtle`} style={{ animationDelay: `${i * 0.5}s` }} />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-text-primary">
                                <AnimatedCounter value={stat.value} suffix={stat.suffix} duration={1500} />
                            </div>
                            <div className="text-xs text-text-muted">{stat.label}</div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
