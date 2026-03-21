"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { Brain, GraduationCap, Rocket } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function AIToolsHighlight() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const headingRef = useRef<HTMLDivElement>(null);
    const itemsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
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

            const items = itemsRef.current?.querySelectorAll(".ai-tool-item");
            if (items) {
                gsap.fromTo(
                    items,
                    { opacity: 0, x: -40 },
                    {
                        opacity: 1, x: 0, duration: 0.7,
                        stagger: 0.15,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: itemsRef.current,
                            start: "top 80%",
                            toggleActions: "play none none none",
                        },
                    }
                );
            }
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    const tools = [
        {
            num: "01",
            icon: Brain,
            title: "AI Career Q&A",
            description:
                "Ask any career question and get detailed, personalized guidance with skill recommendations and timelines. Just type your question and let AI guide your path.",
            accent: "#67e8f9",
        },
        {
            num: "02",
            icon: GraduationCap,
            title: "Resume Analyzer",
            description:
                "Upload your resume for AI-powered ATS scoring, skills gap analysis, and actionable improvement suggestions. Get your resume ready for top companies.",
            accent: "#E6C212",
        },
        {
            num: "03",
            icon: Rocket,
            title: "Career Roadmap",
            description:
                "Generate a personalized step-by-step roadmap to your dream role with milestones, timelines, and resource recommendations. Your career, mapped.",
            accent: "#4ade80",
        },
    ];

    return (
        <section ref={sectionRef} className="py-28 relative">
            <div className="absolute inset-0 fb-dot-grid opacity-30" />
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div ref={headingRef} className="mb-20 opacity-0">
                    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6">
                        Made for
                        <span className="text-[#E6C212]"> Your Career..</span>
                    </h2>
                    <p className="fb-mono text-[15px] text-[#A1A1AA] max-w-xl leading-relaxed">
                        AI-powered tools to accelerate your career growth, from resume analysis
                        to personalized roadmaps.
                    </p>
                </div>

                <div ref={itemsRef} className="space-y-0">
                    {tools.map((tool, i) => (
                        <Link
                            key={i}
                            href="/ai-tools"
                            className="ai-tool-item group flex items-start gap-6 sm:gap-10 py-8 border-b border-[#222] hover:bg-[#0a0a0a] transition-all duration-300 px-4 -mx-4 rounded-xl cursor-pointer"
                        >
                            {/* Number */}
                            <span className="fb-mono text-[13px] text-[#71717A] pt-1 shrink-0 w-6">
                                {tool.num}
                            </span>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-3">
                                    <div
                                        className="w-10 h-10 rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                                        style={{ backgroundColor: `${tool.accent}15` }}
                                    >
                                        <tool.icon className="w-5 h-5" style={{ color: tool.accent }} />
                                    </div>
                                    <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-[#E6C212] transition-colors duration-300">
                                        {tool.title}
                                    </h3>
                                </div>
                                <p className="text-[15px] text-[#A1A1AA] leading-relaxed max-w-2xl group-hover:text-[#d4d4d8] transition-colors">
                                    {tool.description}
                                </p>
                            </div>

                            {/* Arrow */}
                            <div className="shrink-0 pt-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-0 group-hover:translate-x-2">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E6C212" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
