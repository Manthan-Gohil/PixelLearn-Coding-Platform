"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import gsap from "gsap";
import { Terminal, Code2, Cpu, Database, Sparkles, MessageSquare, FileJson, Globe, Shield } from "lucide-react";

const CODE_POOL = [
    "import { PixelLearn } from '@pixellearn/core';",
    "const platform = new PixelLearn();",
    "platform.init({ ai: true, sandbox: 'browser' });",
    "// Initializing AI Career Assistant...",
    "// Connecting to Interactive Playground...",
    "function startLearning() {",
    "  const student = platform.getActiveStudent();",
    "  platform.load('Python_Mastery_v2');",
    "  return '🚀 Ready to Code!';",
    "}",
    "class AIHandler extends BaseAI {",
    "  analyze(code) { return this.suggest(code); }",
    "}",
    "// Compiling components...",
    "// Loading learning paths...",
    "const roadmap = platform.createRoadmap('Web3');",
    "// PIXELLEARN: The Future of Coding",
    "console.log('System initialized: 100%');",
];

export default function LandingReveal() {
    const overlayRef = useRef<HTMLDivElement>(null);
    const terminalRef = useRef<HTMLDivElement>(null);
    const [currentValue, setCurrentValue] = useState(0);
    const [visibleLines, setVisibleLines] = useState<string[]>([]);

    const allLines = useMemo(() => {
        const lines = [];
        for (let i = 0; i < 30; i++) {
            lines.push(CODE_POOL[i % CODE_POOL.length]);
        }
        return lines;
    }, []);

    useEffect(() => {
        let value = 0;
        const updateCounter = () => {
            if (value >= 100) {
                value = 100;
                setCurrentValue(100);
                animateReveal();
                return;
            }

            const increment = Math.floor(Math.random() * 5);
            value += increment;
            if (value > 100) value = 100;

            setCurrentValue(value);
            const totalVisibleLines = Math.floor((value / 100) * 30);
            setVisibleLines(allLines.slice(0, totalVisibleLines));

            const delay = Math.floor(Math.random() * 30) + 40;
            setTimeout(updateCounter, delay);
        };

        const animateReveal = () => {
            const tl = gsap.timeline();

            // Hide terminal and floating elements
            tl.to(".reveal-item", {
                opacity: 0,
                y: -20,
                duration: 0.5,
                stagger: 0.05,
                ease: "power2.in",
            });

            // Show Logo Container
            tl.set(".logo-reveal", { opacity: 1 });

            // Animate Badge
            tl.fromTo(".logo-badge",
                { scale: 0.8, opacity: 0 },
                { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.7)" }
            );

            // Animate "PIXEL" letters
            tl.fromTo(".pixel-char",
                {
                    x: () => Math.random() * 400 - 200,
                    y: () => Math.random() * 400 - 200,
                    rotation: () => Math.random() * 360,
                    opacity: 0,
                    scale: 0
                },
                {
                    x: 0,
                    y: 0,
                    rotation: 0,
                    opacity: 1,
                    scale: 1,
                    duration: 1,
                    stagger: 0.05,
                    ease: "power4.out"
                },
                "-=0.4"
            );

            // Animate "LEARN" letters
            tl.fromTo(".learn-char",
                {
                    x: () => Math.random() * 400 - 200,
                    y: () => Math.random() * 400 - 200,
                    rotation: () => Math.random() * 360,
                    opacity: 0,
                    scale: 0
                },
                {
                    x: 0,
                    y: 0,
                    rotation: 0,
                    opacity: 1,
                    scale: 1,
                    duration: 1,
                    stagger: 0.05,
                    ease: "power4.out"
                },
                "-=0.8"
            );

            // Final Glow Flare
            tl.to(".logo-reveal-container", {
                filter: "drop-shadow(0 0 30px rgba(99, 102, 241, 0.6))",
                duration: 0.5,
            });

            // Mission text reveal
            tl.fromTo(".mission-text",
                { opacity: 0, y: 10 },
                { opacity: 0.6, y: 0, duration: 0.5 },
                "-=0.3"
            );

            // Reveal actual site
            tl.to(overlayRef.current, {
                y: "-100%",
                duration: 1.2,
                ease: "power4.inOut",
                delay: 1.2,
            });
        };

        updateCounter();

        // Subtle background drift for tech icons
        gsap.to(".drifting-element", {
            x: "random(-60, 60)",
            y: "random(-60, 60)",
            duration: "random(10, 20)",
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
        });

        return () => { };
    }, [allLines]);

    useEffect(() => {
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
    }, [visibleLines]);

    const pixelChars = "PIXEL".split("");
    const learnChars = "LEARN".split("");

    return (
        <div
            ref={overlayRef}
            className="fixed inset-0 bg-[#0f1729] flex flex-col z-[9999] overflow-hidden font-mono"
        >
            {/* Dynamic Floating Backdrop */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="drifting-element absolute top-[10%] right-[5%] w-72 h-52 glass rounded-2xl border border-white/10 p-4 opacity-[0.08] reveal-item">
                    <div className="flex gap-1.5 mb-3">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-400/30" />
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/30" />
                        <div className="w-2.5 h-2.5 rounded-full bg-green-400/30" />
                    </div>
                    <div className="space-y-2">
                        <div className="h-1.5 bg-primary/20 w-full rounded" />
                        <div className="h-1.5 bg-accent/20 w-4/5 rounded" />
                        <div className="h-1.5 bg-white/5 w-11/12 rounded" />
                        <div className="h-1.5 bg-white/5 w-3/4 rounded" />
                    </div>
                </div>

                <div className="drifting-element absolute bottom-[15%] left-[5%] w-60 h-40 glass rounded-2xl border border-primary/10 p-5 opacity-[0.08] reveal-item">
                    <div className="flex items-center gap-2 mb-4">
                        <Sparkles className="w-5 h-5 text-primary" />
                        <div className="h-2.5 bg-primary/10 w-20 rounded" />
                    </div>
                    <div className="space-y-2">
                        <div className="h-1 bg-white/5 w-full rounded" />
                        <div className="h-1 bg-white/5 w-5/6 rounded" />
                        <div className="h-1 bg-white/5 w-4/6 rounded" />
                    </div>
                </div>

                <div className="drifting-element absolute top-[35%] left-[10%] opacity-[0.03] reveal-item">
                    <Cpu className="w-48 h-48 text-primary" />
                </div>
                <div className="drifting-element absolute bottom-[20%] right-[15%] opacity-[0.03] reveal-item">
                    <Database className="w-40 h-40 text-accent" />
                </div>
            </div>

            {/* Top Header */}
            <div className="relative z-10 flex items-center justify-between px-6 py-3 bg-black/40 border-b border-white/5 reveal-item">
                <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/40" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/40" />
                    <div className="w-3 h-3 rounded-full bg-green-500/40" />
                </div>
                <div className="text-[10px] text-white/20 uppercase tracking-[0.3em] font-bold">
                    PIXELLEARN_CORE_PROTOCOL::SEC_v4.0
                </div>
                <div className="w-12 text-right">
                    <Globe className="w-4 h-4 text-white/10 inline" />
                </div>
            </div>

            {/* Terminal Content */}
            <div
                ref={terminalRef}
                className="terminal-content flex-1 p-10 overflow-hidden text-sm sm:text-base relative z-10 reveal-item"
            >
                <div className="max-w-3xl mx-auto space-y-2">
                    {visibleLines.map((line, i) => (
                        <div key={i} className="flex gap-8 group">
                            <span className="text-white/5 select-none w-6 text-right shrink-0 font-bold">{i + 1}</span>
                            <span className={`
                ${line.startsWith("//") ? "text-text-muted italic" : ""}
                ${line.includes("const") || line.includes("let") || line.includes("import") || line.includes("class") ? "text-primary-light font-medium" : ""}
                ${line.includes("function") || line.includes("return") ? "text-accent font-medium" : ""}
                ${line.includes("'") ? "text-success" : ""}
                ${!line.startsWith("//") && !line.includes("'") && !line.includes("const") ? "text-white/60" : ""}
              `}>
                                {line}
                            </span>
                        </div>
                    ))}
                    {currentValue < 100 && (
                        <div className="flex gap-8">
                            <span className="text-white/5 select-none w-6 text-right shrink-0 font-bold">{visibleLines.length + 1}</span>
                            <span className="w-2.5 h-6 bg-primary animate-pulse shadow-[0_0_15px_rgba(99,102,241,0.6)]" />
                        </div>
                    )}
                </div>
            </div>

            {/* Creative Big Reveal (PIXELLEARN) */}
            <div className="logo-reveal absolute inset-0 flex items-center justify-center opacity-0 pointer-events-none z-20">
                <div className="logo-reveal-container text-center relative">
                    {/* Sparkles / Particles could go here if using a particle lib, but we use pure CSS/GSAP */}

                    <div className="logo-badge inline-flex items-center gap-3 px-5 py-2 rounded-full border border-primary/30 bg-primary/10 mb-8 glass shadow-2xl">
                        <Sparkles className="w-5 h-5 text-primary-light animate-pulse" />
                        <span className="text-xs font-bold text-white tracking-[0.2em] uppercase">
                            AI-Powered Coding Excellence
                        </span>
                    </div>

                    <div className="flex items-center justify-center">
                        <h1 className="text-7xl sm:text-9xl font-extrabold flex items-center justify-center tracking-tighter">
                            {/* PIXEL */}
                            <div className="flex text-white py-2">
                                {pixelChars.map((char, i) => (
                                    <span key={`p-${i}`} className="pixel-char inline-block select-none">{char}</span>
                                ))}
                            </div>

                            {/* LEARN */}
                            <div className="flex py-2 ml-1 sm:ml-2">
                                {learnChars.map((char, i) => (
                                    <span
                                        key={`l-${i}`}
                                        className="learn-char inline-block select-none gradient-text"
                                    >
                                        {char}
                                    </span>
                                ))}
                            </div>
                        </h1>
                    </div>

                    <div className="mission-text mt-8 font-mono text-primary-light tracking-[0.3em] text-xs opacity-0 uppercase font-bold">
                        {">"} MISSION_INITIALIZED_SUCCESSFULLY
                    </div>
                </div>
            </div>

            {/* Bottom Status Panel */}
            <div className="relative z-10 bg-black/60 border-t border-white/5 p-8 flex items-center justify-between backdrop-blur-2xl reveal-item">
                <div className="flex items-center gap-10 text-[11px]">
                    <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-primary/10 border border-primary/20 shadow-inner">
                        <span className="w-2.5 h-2.5 rounded-full bg-success animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                        <span className="text-primary-light font-black tracking-[0.2em] uppercase">SYSTEM_READY</span>
                    </div>
                    <div className="hidden lg:flex items-center gap-3 text-white/30 font-medium">
                        <FileJson className="w-4 h-4" />
                        <span>AI_LEVEL:</span>
                        <span className="text-white/70 tracking-widest uppercase">Apex_Neural_v2</span>
                    </div>
                </div>

                <div className="flex items-center gap-8">
                    <div className="flex flex-col items-end gap-2">
                        <div className="w-56 h-1.5 bg-white/5 rounded-full overflow-hidden shadow-inner">
                            <div
                                className="h-full bg-gradient-to-r from-primary via-accent to-success transition-all duration-300 ease-out shadow-[0_0_20px_rgba(6,182,212,0.4)]"
                                style={{ width: `${currentValue}%` }}
                            />
                        </div>
                        <div className="flex justify-between w-full">
                            <span className="text-[10px] text-white/20 tracking-[0.3em] font-bold">BOOT_SEQ_INITIALIZE</span>
                            <span className="text-lg font-black text-white leading-none">
                                {currentValue}<span className="text-primary-light text-xs ml-0.5 select-none">%</span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Overlay Effects */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.06] z-0">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:50px_50px]" />
            </div>
            <div className="absolute inset-0 pointer-events-none z-10 opacity-[0.03]" style={{ background: 'repeating-linear-gradient(0deg, #000 0px, #000 1px, transparent 1px, transparent 2px)', backgroundSize: '100% 2px' }} />
        </div>
    );
}
