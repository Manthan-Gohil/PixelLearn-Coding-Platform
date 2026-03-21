"use client";

import { useEffect, useRef } from "react";
import { Code2, BookOpen, Trophy, Brain, Shield, BarChart3 } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function FeaturesSection() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const headingRef = useRef<HTMLDivElement>(null);
    const cardsRef = useRef<HTMLDivElement>(null);

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

            // Staggered card reveal
            const cards = cardsRef.current?.querySelectorAll(".feature-card");
            if (cards) {
                gsap.fromTo(
                    cards,
                    { opacity: 0, y: 50, scale: 0.95 },
                    {
                        opacity: 1, y: 0, scale: 1, duration: 0.7,
                        stagger: 0.12,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: cardsRef.current,
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
                "Write, run, and test code in our Monaco-based editor with syntax highlighting, auto-completion, and instant feedback.",
            accent: "#67e8f9",
        },
        {
            icon: BookOpen,
            title: "Structured Courses",
            description:
                "Learn through carefully designed courses with chapters and exercises that build progressively from beginner to advanced.",
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
                "Run code safely in our isolated execution environment. Support for Python, JavaScript, Java, C++, and more.",
            accent: "#f87171",
        },
        {
            icon: BarChart3,
            title: "Learning Analytics",
            description:
                "Visualize your progress with weekly activity charts, completion rates, and personalized insights.",
            accent: "#a78bfa",
        },
    ];

    return (
        <section ref={sectionRef} className="py-28 relative fb-section-glow">
            <div className="absolute inset-0 fb-dot-grid opacity-40" />
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div ref={headingRef} className="text-center mb-20 opacity-0">
                    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6">
                        Everything You Need to{" "}
                        <span className="text-[#E6C212]">Level Up</span>
                    </h2>
                    <p className="fb-mono text-[15px] text-[#A1A1AA] max-w-2xl mx-auto leading-relaxed">
                        A complete platform designed for developers who want to learn by
                        building, not just watching.
                    </p>
                </div>

                <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, i) => (
                        <div
                            key={i}
                            className="feature-card fb-card p-7 group cursor-default"
                        >
                            <div
                                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
                                style={{ backgroundColor: `${feature.accent}15` }}
                            >
                                <feature.icon
                                    className="w-6 h-6"
                                    style={{ color: feature.accent }}
                                />
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-3">
                                {feature.title}
                            </h3>
                            <p className="text-sm text-[#A1A1AA] leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
