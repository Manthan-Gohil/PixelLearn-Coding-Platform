"use client";

import Link from "next/link";
import { Sparkles, Brain, GraduationCap, Rocket, ArrowRight } from "lucide-react";
import { useScrollReveal, useStaggerReveal } from "@/hooks/useScrollReveal";

export default function AIToolsHighlight() {
    const headerRef = useScrollReveal<HTMLDivElement>({ direction: "up", distance: 30 });
    const gridRef = useStaggerReveal<HTMLDivElement>(".ai-card", {
        direction: "up",
        distance: 60,
        stagger: 0.12,
        duration: 0.7,
        scale: 0.95,
    });

    const tools = [
        {
            icon: Brain,
            title: "AI Career Q&A",
            description:
                "Ask any career question and get detailed, personalized guidance with skill recommendations and timelines.",
            gradient: "from-primary to-primary-dark",
        },
        {
            icon: GraduationCap,
            title: "Resume Analyzer",
            description:
                "Upload your resume for AI-powered ATS scoring, skills gap analysis, and actionable improvement suggestions.",
            gradient: "from-accent to-accent-dark",
        },
        {
            icon: Rocket,
            title: "Career Roadmap",
            description:
                "Generate a personalized step-by-step roadmap to your dream role with milestones and resource recommendations.",
            gradient: "from-success to-green-700",
        },
    ];

    return (
        <section className="py-24 relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-pattern opacity-30" />
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div ref={headerRef} className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-4 animate-shimmer">
                        <Sparkles className="w-4 h-4 text-primary-light animate-float-subtle" />
                        <span className="text-sm font-medium text-primary-light">
                            Powered by AI
                        </span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
                        AI Career{" "}
                        <span className="gradient-text">Intelligence</span>
                    </h2>
                    <p className="text-text-secondary max-w-2xl mx-auto text-lg">
                        Get personalized career guidance powered by advanced AI models.
                        Make data-driven decisions about your career path.
                    </p>
                </div>

                <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {tools.map((tool, i) => (
                        <div
                            key={i}
                            className="ai-card group relative glass rounded-2xl p-8 hover:border-primary/20 transition-all duration-300 card-hover-glow spotlight-card"
                            onMouseMove={(e) => {
                                const rect = e.currentTarget.getBoundingClientRect();
                                e.currentTarget.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
                                e.currentTarget.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
                            }}
                        >
                            <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center mb-6 shadow-lg shadow-primary/20 group-hover:shadow-xl group-hover:shadow-primary/30 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                                <tool.icon className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="text-xl font-semibold text-text-primary mb-3">
                                {tool.title}
                            </h3>
                            <p className="text-text-secondary mb-6 leading-relaxed">
                                {tool.description}
                            </p>
                            <Link
                                href="/ai-tools"
                                className="inline-flex items-center gap-1 text-sm font-medium text-primary-light hover:text-primary transition-colors group"
                            >
                                Try it now
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
