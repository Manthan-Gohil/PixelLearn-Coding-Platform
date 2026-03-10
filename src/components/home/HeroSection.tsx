"use client";

import Link from "next/link";
import { Sparkles, ChevronRight, Play, ArrowRight, Terminal } from "lucide-react";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import TypingText from "@/components/ui/TypingText";
import { useMagneticHover, useTiltCard } from "@/hooks/useScrollReveal";

export default function HeroSection() {
    const magneticRef = useMagneticHover<HTMLAnchorElement>(0.15);
    const codeCardRef = useTiltCard<HTMLDivElement>(8);

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-grid-pattern" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/3 rounded-full blur-[100px] animate-morph" />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="text-center max-w-4xl mx-auto">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/20 mb-8 animate-fade-in animate-shimmer">
                        <Sparkles className="w-4 h-4 text-primary-light animate-float-subtle" />
                        <span className="text-sm font-medium text-text-secondary">
                            AI-Powered Learning Platform
                        </span>
                        <ChevronRight className="w-4 h-4 text-text-muted" />
                    </div>

                    {/* Heading */}
                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 animate-slide-up">
                        <span className="text-text-primary">Master </span>
                        <TypingText
                            texts={["Coding", "Python", "React", "JavaScript", "AI/ML"]}
                            className="gradient-text"
                            typingSpeed={80}
                            deletingSpeed={40}
                            pauseDuration={1800}
                        />
                        <br />
                        <span className="gradient-text">by Doing It</span>
                    </h1>

                    {/* Subtitle */}
                    <p className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up" style={{ animationDelay: "0.1s" }}>
                        Build real programming skills with interactive coding environments,
                        structured courses, and AI-powered career intelligence.{" "}
                        <span className="text-text-primary font-medium">
                            Practice-first learning
                        </span>{" "}
                        that actually works.
                    </p>

                    {/* CTAs */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-slide-up" style={{ animationDelay: "0.2s" }}>
                        <Link
                            ref={magneticRef}
                            href="/dashboard"
                            className="group flex items-center gap-2 px-8 py-4 rounded-xl gradient-primary text-white font-semibold text-lg hover:opacity-90 transition-all duration-200 shadow-xl shadow-primary/25 hover:shadow-2xl hover:shadow-primary/30 animate-glow-pulse"
                        >
                            Start Learning Free
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            href="/courses"
                            className="group flex items-center gap-2 px-8 py-4 rounded-xl border border-border text-text-primary font-semibold text-lg hover:bg-surface-hover hover:border-primary/30 transition-all duration-200"
                        >
                            <Play className="w-5 h-5 text-primary" />
                            Explore Courses
                        </Link>
                    </div>

                    {/* Stats - Animated Counters */}
                    <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto animate-slide-up" style={{ animationDelay: "0.3s" }}>
                        {[
                            { value: 50000, suffix: "+", label: "Active Learners" },
                            { value: 200, suffix: "+", label: "Exercises" },
                            { value: 4.8, label: "Average Rating", isRating: true },
                        ].map((stat) => (
                            <div key={stat.label} className="text-center group">
                                <div className="text-2xl sm:text-3xl font-bold gradient-text transition-transform group-hover:scale-110 duration-300">
                                    {stat.isRating ? (
                                        <span>4.8★</span>
                                    ) : (
                                        <AnimatedCounter value={stat.value as number} suffix={stat.suffix} duration={2500} />
                                    )}
                                </div>
                                <div className="text-xs sm:text-sm text-text-muted mt-1">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Code Preview Card */}
                <div className="mt-20 max-w-4xl mx-auto animate-slide-up" style={{ animationDelay: "0.4s" }}>
                    <div ref={codeCardRef} className="glass rounded-2xl overflow-hidden shadow-2xl shadow-primary/10 border border-border card-hover-glow">
                        {/* Window Bar */}
                        <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-surface-alt/50">
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-danger/70 hover:bg-danger transition-colors cursor-pointer" />
                                <div className="w-3 h-3 rounded-full bg-warning/70 hover:bg-warning transition-colors cursor-pointer" />
                                <div className="w-3 h-3 rounded-full bg-success/70 hover:bg-success transition-colors cursor-pointer" />
                            </div>
                            <span className="text-xs text-text-muted ml-2 font-mono">
                                playground.py
                            </span>
                            <div className="ml-auto flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                                <span className="text-[10px] text-success/70 font-mono">live</span>
                            </div>
                        </div>
                        {/* Code Content */}
                        <div className="p-6 font-mono text-sm">
                            <div className="space-y-1">
                                <div>
                                    <span className="text-primary-light">def</span>{" "}
                                    <span className="text-accent">learn_with_pixellearn</span>
                                    <span className="text-text-muted">(</span>
                                    <span className="text-warning">student</span>
                                    <span className="text-text-muted">):</span>
                                </div>
                                <div className="pl-6">
                                    <span className="text-text-muted">&quot;&quot;&quot;</span>
                                    <span className="text-success">Your journey to mastery starts here</span>
                                    <span className="text-text-muted">&quot;&quot;&quot;</span>
                                </div>
                                <div className="pl-6">
                                    <span className="text-primary-light">skills</span>
                                    <span className="text-text-muted"> = </span>
                                    <span className="text-text-muted">[</span>
                                    <span className="text-success">&quot;Python&quot;</span>
                                    <span className="text-text-muted">, </span>
                                    <span className="text-success">&quot;JavaScript&quot;</span>
                                    <span className="text-text-muted">, </span>
                                    <span className="text-success">&quot;React&quot;</span>
                                    <span className="text-text-muted">]</span>
                                </div>
                                <div className="pl-6">
                                    <span className="text-primary-light">for</span>{" "}
                                    <span className="text-warning">skill</span>{" "}
                                    <span className="text-primary-light">in</span>{" "}
                                    <span className="text-text-primary">skills</span>
                                    <span className="text-text-muted">:</span>
                                </div>
                                <div className="pl-12">
                                    <span className="text-text-primary">student</span>
                                    <span className="text-text-muted">.</span>
                                    <span className="text-accent">practice</span>
                                    <span className="text-text-muted">(</span>
                                    <span className="text-warning">skill</span>
                                    <span className="text-text-muted">)</span>
                                </div>
                                <div className="pl-12">
                                    <span className="text-text-primary">student</span>
                                    <span className="text-text-muted">.</span>
                                    <span className="text-accent">earn_xp</span>
                                    <span className="text-text-muted">(</span>
                                    <span className="text-primary-light">100</span>
                                    <span className="text-text-muted">)</span>
                                </div>
                                <div className="pl-6 mt-2">
                                    <span className="text-primary-light">return</span>{" "}
                                    <span className="text-success">&quot;🚀 Career Ready!&quot;</span>
                                </div>
                            </div>
                            {/* Output */}
                            <div className="mt-4 pt-4 border-t border-border">
                                <div className="flex items-center gap-2 text-text-muted mb-2">
                                    <Terminal className="w-4 h-4" />
                                    <span className="text-xs">Output</span>
                                </div>
                                <div className="text-success typewriter-line">
                                    ▸ 🚀 Career Ready!
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
