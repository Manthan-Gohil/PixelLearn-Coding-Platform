"use client";

import { Code2, BookOpen, Trophy, Brain, Shield, BarChart3 } from "lucide-react";
import { useScrollReveal, useStaggerReveal } from "@/hooks/useScrollReveal";

export default function FeaturesSection() {
    const sectionRef = useScrollReveal<HTMLDivElement>({ direction: "up", distance: 40, duration: 0.7 });
    const gridRef = useStaggerReveal<HTMLDivElement>(".feature-card", {
        direction: "up",
        distance: 40,
        stagger: 0.1,
        duration: 0.6,
    });

    const features = [
        {
            icon: Code2,
            title: "Interactive Code Editor",
            description:
                "Write, run, and test code in our Monaco-based editor with syntax highlighting, auto-completion, and instant feedback.",
            color: "text-primary-light",
            bgColor: "bg-primary/10",
        },
        {
            icon: BookOpen,
            title: "Structured Courses",
            description:
                "Learn through carefully designed courses with chapters and exercises that build progressively from beginner to advanced.",
            color: "text-accent",
            bgColor: "bg-accent/10",
        },
        {
            icon: Trophy,
            title: "Progress Gamification",
            description:
                "Earn XP, unlock badges, and maintain streaks. Track your growth with detailed analytics and professional dashboards.",
            color: "text-warning",
            bgColor: "bg-warning/10",
        },
        {
            icon: Brain,
            title: "AI Career Intelligence",
            description:
                "Get personalized career guidance, resume analysis, and roadmap generation powered by advanced AI models.",
            color: "text-success",
            bgColor: "bg-success/10",
        },
        {
            icon: Shield,
            title: "Secure Sandbox",
            description:
                "Run code safely in our isolated execution environment. Support for Python, JavaScript, Java, C++, and more.",
            color: "text-danger",
            bgColor: "bg-danger/10",
        },
        {
            icon: BarChart3,
            title: "Learning Analytics",
            description:
                "Visualize your progress with weekly activity charts, completion rates, and personalized insights.",
            color: "text-primary",
            bgColor: "bg-primary/10",
        },
    ];

    return (
        <section className="py-24 relative">
            <div className="absolute inset-0 bg-grid-pattern opacity-50" />
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div ref={sectionRef} className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
                        Everything You Need to{" "}
                        <span className="gradient-text">Level Up</span>
                    </h2>
                    <p className="text-text-secondary max-w-2xl mx-auto text-lg">
                        A complete platform designed for developers who want to learn by
                        building, not just watching.
                    </p>
                </div>

                <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, i) => (
                        <div
                            key={i}
                            className="feature-card group glass rounded-2xl p-6 hover:border-primary/20 transition-all duration-300 card-hover-glow spotlight-card"
                            onMouseMove={(e) => {
                                const rect = e.currentTarget.getBoundingClientRect();
                                e.currentTarget.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
                                e.currentTarget.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
                            }}
                        >
                            <div
                                className={`w-12 h-12 rounded-xl ${feature.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 animate-float-subtle`}
                                style={{ animationDelay: `${i * 0.5}s` }}
                            >
                                <feature.icon className={`w-6 h-6 ${feature.color}`} />
                            </div>
                            <h3 className="text-lg font-semibold text-text-primary mb-2">
                                {feature.title}
                            </h3>
                            <p className="text-sm text-text-secondary leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
