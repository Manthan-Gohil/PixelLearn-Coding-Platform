"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Terminal, Users, BookOpen, Zap } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import dynamic from "next/dynamic";
import TypingText from "@/components/ui/TypingText";
import AnimatedCounter from "@/components/ui/AnimatedCounter";

gsap.registerPlugin(ScrollTrigger);

// Dynamic import to avoid SSR issues with Three.js
const ParticleSphere = dynamic(() => import("@/components/ui/ParticleSphere"), {
    ssr: false,
    loading: () => null,
});

// Tilt card component
function TiltCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
    const cardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = cardRef.current;
        if (!el) return;

        const handleMouseMove = (e: MouseEvent) => {
            const rect = el.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;
            const rotateX = (y - 0.5) * -8;
            const rotateY = (x - 0.5) * 8;

            gsap.to(el, {
                rotationX: rotateX,
                rotationY: rotateY,
                duration: 0.4,
                ease: "power2.out",
                transformPerspective: 1000,
            });
        };

        const handleMouseLeave = () => {
            gsap.to(el, {
                rotationX: 0,
                rotationY: 0,
                duration: 0.6,
                ease: "power2.out",
            });
        };

        el.addEventListener("mousemove", handleMouseMove);
        el.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            el.removeEventListener("mousemove", handleMouseMove);
            el.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, []);

    return (
        <div ref={cardRef} className={className} style={{ transformStyle: "preserve-3d" }}>
            {children}
        </div>
    );
}

// Code line component for the IDE demo
function CodeLine({ num, indent = 0, children }: { num: number; indent?: number; children: React.ReactNode }) {
    return (
        <div className="flex gap-4 group leading-6">
            <span className="text-[#333] select-none w-6 text-right shrink-0 text-[12px]">{num}</span>
            <span style={{ paddingLeft: `${indent * 20}px` }}>{children}</span>
        </div>
    );
}

export default function HeroSection() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const headingRef = useRef<HTMLHeadingElement>(null);
    const subtitleRef = useRef<HTMLParagraphElement>(null);
    const buttonsRef = useRef<HTMLDivElement>(null);
    const statsRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

            tl.fromTo(
                headingRef.current,
                { opacity: 0, y: 80 },
                { opacity: 1, y: 0, duration: 1.0 }
            )
            .fromTo(
                subtitleRef.current,
                { opacity: 0, y: 40 },
                { opacity: 1, y: 0, duration: 0.8 },
                "-=0.5"
            )
            .fromTo(
                buttonsRef.current,
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.7 },
                "-=0.4"
            )
            .fromTo(
                statsRef.current,
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.7 },
                "-=0.3"
            )
            .fromTo(
                videoRef.current,
                { opacity: 0, y: 60, scale: 0.95 },
                { opacity: 1, y: 0, scale: 1, duration: 1.0 },
                "-=0.3"
            );
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden edge-glow-left edge-glow-right">
            {/* Three.js Particle Sphere */}
            <ParticleSphere />

            {/* Dot Grid Background */}
            <div className="absolute inset-0 fb-dot-grid" />

            {/* Teal spotlight glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[radial-gradient(ellipse,rgba(0,255,255,0.06)_0%,transparent_70%)] pointer-events-none" />

            <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
                {/* Heading with typing text animation */}
                <h1
                    ref={headingRef}
                    className="text-5xl sm:text-7xl lg:text-[88px] font-extrabold text-white leading-[1.05] tracking-tight mb-8 opacity-0"
                    style={{ perspective: '600px' }}
                >
                    {"AI Powered Learning".split(" ").map((word, i) => (
                        <span key={i} className="split-word inline-block mr-[0.3em]" style={{ animationDelay: `${0.6 + i * 0.12}s` }}>
                            {word}
                        </span>
                    ))}
                    <br />
                    {"Platform for".split(" ").map((word, i) => (
                        <span key={`b-${i}`} className="split-word inline-block mr-[0.3em]" style={{ animationDelay: `${1.0 + i * 0.12}s` }}>
                            {word}
                        </span>
                    ))}{" "}
                    <span className="text-[#E6C212] split-word inline-block" style={{ animationDelay: '1.3s' }}>
                        <TypingText 
                            texts={["React", "JavaScript", "Python", "TypeScript", "Node.js", "CSS", "HTML"]}
                            typingSpeed={80}
                            deletingSpeed={40}
                            pauseDuration={1800}
                            className="inline"
                        />
                    </span>
                </h1>

                {/* Subtitle */}
                <p
                    ref={subtitleRef}
                    className="fb-mono text-[15px] sm:text-[17px] text-[#A1A1AA] max-w-2xl leading-relaxed mb-10 opacity-0"
                >
                    A complete coding environment with interactive courses, AI-powered career intelligence, and practice-first learning — built for developers who want to level up.
                </p>

                {/* CTA Buttons */}
                <div ref={buttonsRef} className="flex flex-col sm:flex-row items-start gap-4 mb-16 opacity-0">
                    <Link href="/dashboard" className="fb-btn-primary text-base">
                        Start Learning
                    </Link>
                    <Link href="/pricing" className="fb-btn-outline text-base">
                        See Pricing
                    </Link>
                </div>

                {/* Stats Counters */}
                <div ref={statsRef} className="grid grid-cols-3 gap-8 mb-24 max-w-xl opacity-0">
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-1">
                            <Users className="w-4 h-4 text-[#E6C212]" />
                            <span className="text-2xl sm:text-3xl font-extrabold text-white fb-mono">
                                <AnimatedCounter value={10000} suffix="+" duration={2000} />
                            </span>
                        </div>
                        <p className="text-xs text-[#71717A] uppercase tracking-wider fb-mono">Developers</p>
                    </div>
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-1">
                            <BookOpen className="w-4 h-4 text-[#67e8f9]" />
                            <span className="text-2xl sm:text-3xl font-extrabold text-white fb-mono">
                                <AnimatedCounter value={50} suffix="+" duration={2000} />
                            </span>
                        </div>
                        <p className="text-xs text-[#71717A] uppercase tracking-wider fb-mono">Courses</p>
                    </div>
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-1">
                            <Zap className="w-4 h-4 text-[#4ade80]" />
                            <span className="text-2xl sm:text-3xl font-extrabold text-white fb-mono">
                                <AnimatedCounter value={500} suffix="+" duration={2000} />
                            </span>
                        </div>
                        <p className="text-xs text-[#71717A] uppercase tracking-wider fb-mono">Exercises</p>
                    </div>
                </div>

                {/* Video / Interactive Demo with Tilt */}
                <div ref={videoRef} className="max-w-4xl mx-auto opacity-0">
                    <TiltCard className="relative">
                        {/* Glow behind card */}
                        <div className="absolute -inset-4 bg-[radial-gradient(ellipse,rgba(0,255,255,0.08)_0%,transparent_70%)] blur-2xl pointer-events-none" />

                        <div className="relative fb-card overflow-hidden shadow-2xl shadow-black/50">
                            {/* Window Bar */}
                            <div className="flex items-center gap-2 px-4 py-3 border-b border-[#222] bg-[#0a0a0a]">
                                <div className="flex gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                                    <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                                    <div className="w-3 h-3 rounded-full bg-[#28c840]" />
                                </div>
                                <span className="text-xs text-[#71717A] ml-2 fb-mono">
                                    pixellearn — interactive playground
                                </span>
                                <div className="ml-auto flex items-center gap-1">
                                    <span className="w-2 h-2 rounded-full bg-[#28c840] animate-pulse" />
                                    <span className="text-[10px] text-[#28c840]/70 fb-mono">live</span>
                                </div>
                            </div>

                            {/* Animated Code IDE Simulation */}
                            <div className="relative bg-[#0a0a0a] overflow-hidden" style={{ height: '360px' }}>
                                {/* Editor Panel */}
                                <div className="flex h-full">
                                    {/* File sidebar */}
                                    <div className="w-48 border-r border-[#222] py-3 hidden sm:block">
                                        <div className="px-3 mb-2">
                                            <span className="text-[10px] tracking-wider text-[#71717A] uppercase fb-mono">Explorer</span>
                                        </div>
                                        <div className="space-y-0.5 px-1">
                                            <div className="flex items-center gap-2 px-2 py-1.5 rounded bg-[#1a1a1a] text-white">
                                                <span className="text-[10px]">🐍</span>
                                                <span className="text-[11px] fb-mono">main.py</span>
                                            </div>
                                            <div className="flex items-center gap-2 px-2 py-1.5 rounded text-[#71717A] hover:text-[#A1A1AA] transition-colors">
                                                <span className="text-[10px]">📦</span>
                                                <span className="text-[11px] fb-mono">utils.py</span>
                                            </div>
                                            <div className="flex items-center gap-2 px-2 py-1.5 rounded text-[#71717A] hover:text-[#A1A1AA] transition-colors">
                                                <span className="text-[10px]">⚛️</span>
                                                <span className="text-[11px] fb-mono">App.tsx</span>
                                            </div>
                                            <div className="flex items-center gap-2 px-2 py-1.5 rounded text-[#71717A] hover:text-[#A1A1AA] transition-colors">
                                                <span className="text-[10px]">🎨</span>
                                                <span className="text-[11px] fb-mono">styles.css</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Code editor */}
                                    <div className="flex-1 p-4 fb-mono text-[13px] overflow-hidden">
                                        <div className="space-y-1 animate-code-scroll">
                                            <CodeLine num={1} indent={0}><span className="text-[#c084fc]">import</span> <span className="text-[#fbbf24]">torch</span></CodeLine>
                                            <CodeLine num={2} indent={0}><span className="text-[#c084fc]">from</span> <span className="text-[#fbbf24]">transformers</span> <span className="text-[#c084fc]">import</span> <span className="text-[#67e8f9]">AutoTokenizer</span></CodeLine>
                                            <CodeLine num={3} indent={0}><span className="text-[#71717A]"># Initialize the AI model</span></CodeLine>
                                            <CodeLine num={4} indent={0}>&nbsp;</CodeLine>
                                            <CodeLine num={5} indent={0}><span className="text-[#c084fc]">class</span> <span className="text-[#67e8f9]">CodeAssistant</span><span className="text-[#71717A]">:</span></CodeLine>
                                            <CodeLine num={6} indent={1}><span className="text-[#c084fc]">def</span> <span className="text-[#67e8f9]">__init__</span><span className="text-[#71717A]">(</span><span className="text-[#fbbf24]">self</span><span className="text-[#71717A]">):</span></CodeLine>
                                            <CodeLine num={7} indent={2}><span className="text-white">self</span><span className="text-[#71717A]">.</span><span className="text-white">model</span> <span className="text-[#71717A]">=</span> <span className="text-[#67e8f9]">load_model</span><span className="text-[#71717A]">(</span><span className="text-[#4ade80]">&quot;pixellearn-v2&quot;</span><span className="text-[#71717A]">)</span></CodeLine>
                                            <CodeLine num={8} indent={2}><span className="text-white">self</span><span className="text-[#71717A]">.</span><span className="text-white">tokenizer</span> <span className="text-[#71717A]">=</span> <span className="text-[#67e8f9]">AutoTokenizer</span><span className="text-[#71717A]">.</span><span className="text-[#67e8f9]">from_pretrained</span><span className="text-[#71717A]">(</span><span className="text-[#4ade80]">&quot;gpt-4&quot;</span><span className="text-[#71717A]">)</span></CodeLine>
                                            <CodeLine num={9} indent={0}>&nbsp;</CodeLine>
                                            <CodeLine num={10} indent={1}><span className="text-[#c084fc]">def</span> <span className="text-[#67e8f9]">analyze</span><span className="text-[#71717A]">(</span><span className="text-[#fbbf24]">self</span><span className="text-[#71717A]">,</span> <span className="text-[#fbbf24]">code</span><span className="text-[#71717A]">):</span></CodeLine>
                                            <CodeLine num={11} indent={2}><span className="text-[#71717A]"># AI-powered code analysis</span></CodeLine>
                                            <CodeLine num={12} indent={2}><span className="text-white">suggestions</span> <span className="text-[#71717A]">=</span> <span className="text-white">self</span><span className="text-[#71717A]">.</span><span className="text-white">model</span><span className="text-[#71717A]">.</span><span className="text-[#67e8f9]">predict</span><span className="text-[#71717A]">(</span><span className="text-white">code</span><span className="text-[#71717A]">)</span></CodeLine>
                                            <CodeLine num={13} indent={2}><span className="text-[#c084fc]">return</span> <span className="text-white">suggestions</span><span className="inline-block w-[2px] h-4 bg-[#E6C212] align-middle animate-blink ml-0.5" /></CodeLine>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Terminal output bar */}
                                <div className="absolute bottom-0 left-0 right-0 border-t border-[#222] bg-[#0a0a0a] px-4 py-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-black/60 border border-[#333]/50">
                                                <Terminal className="w-3 h-3 text-[#4ade80]" />
                                                <span className="text-[11px] text-white fb-mono">Python 3.12</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-black/60 border border-[#333]/50">
                                                <Zap className="w-3 h-3 text-[#E6C212]" />
                                                <span className="text-[11px] text-white fb-mono">AI Assisted</span>
                                            </div>
                                        </div>
                                        <div className="px-3 py-1.5 rounded bg-[#E6C212]/90">
                                            <span className="text-[11px] text-black font-semibold fb-mono">▸ Run Code</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TiltCard>
                </div>
            </div>
        </section>
    );
}
