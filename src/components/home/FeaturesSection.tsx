"use client";

import { useEffect, useRef } from "react";
import { Code2, BookOpen, Trophy, Brain, Shield, BarChart3 } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function FeaturesSection() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const headingRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Heading reveal
            gsap.fromTo(
                headingRef.current,
                { opacity: 0, y: 60 },
                {
                    opacity: 1, y: 0, duration: 0.9,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: headingRef.current,
                        start: "top 85%",
                        toggleActions: "play none none none",
                    },
                }
            );

            // Staggered items reveal
            const items = listRef.current?.querySelectorAll(".wq-expand-item");
            if (items) {
                gsap.fromTo(
                    items,
                    { opacity: 0, x: -60 },
                    {
                        opacity: 1, x: 0, duration: 0.8,
                        stagger: 0.1,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: listRef.current,
                            start: "top 80%",
                            toggleActions: "play none none none",
                        },
                    }
                );
            }
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    const features = [
        {
            icon: Code2,
            title: "Interactive Code Editor",
            description:
                "Write, run, and test code in our Monaco-based editor with syntax highlighting, auto-completion, and instant feedback in a sandboxed environment.",
            accent: "#67e8f9",
        },
        {
            icon: BookOpen,
            title: "Structured Courses",
            description:
                "Learn through carefully designed courses with chapters and exercises that build progressively from beginner to advanced mastery.",
            accent: "#E6C212",
        },
        {
            icon: Trophy,
            title: "Progress Gamification",
            description:
                "Earn XP, unlock badges, and maintain streaks. Track your growth with detailed analytics and professional dashboards.",
            accent: "#fbbf24",
        },
        {
            icon: Brain,
            title: "AI Career Intelligence",
            description:
                "Get personalized career guidance, resume analysis, and roadmap generation powered by advanced AI models.",
            accent: "#4ade80",
        },
        {
            icon: Shield,
            title: "Secure Sandbox",
            description:
                "Run code safely in our isolated execution environment. Full support for Python, JavaScript, Java, C++, and more.",
            accent: "#f87171",
        },
        {
            icon: BarChart3,
            title: "Learning Analytics",
            description:
                "Visualize your progress with weekly activity charts, completion rates, and personalized insights to optimize your learning.",
            accent: "#a78bfa",
        },
    ];

    return (
        <section ref={sectionRef} className="py-28 relative edge-glow-left edge-glow-right">
            <div className="absolute inset-0 fb-dot-grid opacity-40" />
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Heading — WorldQuant Style */}
                <div ref={headingRef} className="mb-6 opacity-0">
                    <span className="fb-mono text-[12px] text-[#E6C212] uppercase tracking-[0.3em] mb-4 block">
                        Our Platform
                    </span>
                    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight">
                        Everything You Need to{" "}
                        <span className="text-[#E6C212]">Level Up</span>
                    </h2>
                    <p className="fb-mono text-[15px] text-[#A1A1AA] max-w-2xl leading-relaxed">
                        A complete platform designed for developers who want to learn by
                        building, not just watching.
                    </p>
                </div>

                {/* WorldQuant-Style Expandable List */}
                <div ref={listRef} className="mt-16">
                    {features.map((feature, i) => (
                        <div key={i} className="wq-expand-item px-4 sm:px-8 py-6 group">
                            <div className="flex items-start gap-4 sm:gap-8">
                                {/* Number */}
                                <span className="wq-expand-num pt-2">
                                    {String(i + 1).padStart(2, "0")}
                                </span>

                                {/* Main content */}
                                <div className="flex-1">
                                    {/* Title row */}
                                    <div className="flex items-center gap-4">
                                        <h3 className="wq-expand-title">{feature.title}</h3>
                                    </div>

                                    {/* Expandable content */}
                                    <div className="wq-expand-content">
                                        <div className="wq-expand-accent mb-4" />
                                        <div className="flex items-start gap-4">
                                            <div
                                                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                                                style={{ backgroundColor: `${feature.accent}15` }}
                                            >
                                                <feature.icon
                                                    className="w-6 h-6"
                                                    style={{ color: feature.accent }}
                                                />
                                            </div>
                                            <p className="text-[15px] text-[#A1A1AA] leading-relaxed max-w-xl">
                                                {feature.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
