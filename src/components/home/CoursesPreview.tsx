"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { ArrowRight, Terminal, Play } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CATEGORY_ICONS } from "@/constants/ui";

gsap.registerPlugin(ScrollTrigger);

/*
 * Portfolio-3 style accent colors for each card inner.
 * Card 1: warm coral  |  Card 2: pale yellow  |  Card 3: soft teal
 * These match the --accent1/2/3 from portfolio-3 globals.css
 */
const CARD_COLORS = [
    { bg: "#00b4d8", text: "#141414", muted: "#3a1a16", codeBg: "#0096c7", codeText: "#141414" },
    { bg: "#f4f1bb", text: "#141414", muted: "#5a5830", codeBg: "#e8e5a0", codeText: "#141414" },
    { bg: "#9bc1bc", text: "#141414", muted: "#344745", codeBg: "#89b0ab", codeText: "#141414" },
    // If there's a 4th, use dark (--fg from portfolio-3)
    { bg: "#141414", text: "#edf1e8", muted: "#aaaaaa", codeBg: "#222222", codeText: "#edf1e8" },
];

/* Code editor visual for each card's right side (matching portfolio-3 service-card-img) */
function CourseVisual({ index, theme }: { index: number; theme: typeof CARD_COLORS[0] }) {
    const snippets = [
        {
            title: "main.tsx",
            lines: [
                { text: 'import React from "react";', c: "#2563eb" },
                { text: "", c: "" },
                { text: "export default function App() {", c: "#7c3aed" },
                { text: "  return (", c: theme.text },
                { text: "    <h1>PixelLearn</h1>", c: "#16a34a" },
                { text: "  );", c: theme.text },
            ],
        },
        {
            title: "index.js",
            lines: [
                { text: 'const express = require("express");', c: "#7c3aed" },
                { text: "const app = express();", c: theme.text },
                { text: "", c: "" },
                { text: 'app.get("/", (req, res) => {', c: "#16a34a" },
                { text: '  res.json({ ok: true });', c: "#ca8a04" },
                { text: "});", c: theme.text },
            ],
        },
        {
            title: "app.py",
            lines: [
                { text: "from flask import Flask", c: "#7c3aed" },
                { text: "app = Flask(__name__)", c: theme.text },
                { text: "", c: "" },
                { text: '@app.route("/")', c: "#16a34a" },
                { text: "def hello():", c: "#2563eb" },
                { text: '    return "Hello!"', c: "#ca8a04" },
            ],
        },
    ];
    const s = snippets[index % snippets.length];

    return (
        <div
            className="rounded-2xl overflow-hidden flex flex-col"
            style={{ backgroundColor: theme.codeBg, border: `2px solid ${theme.text}22` }}
        >
            <div className="flex items-center gap-2 px-4 py-3" style={{ borderBottom: `1px solid ${theme.text}15` }}>
                <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                    <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                    <div className="w-3 h-3 rounded-full bg-[#28c840]" />
                </div>
                <span className="text-xs ml-3 font-mono opacity-60" style={{ color: theme.text }}>{s.title}</span>
            </div>
            <div className="px-5 py-4 font-mono text-sm leading-7 flex-1">
                {s.lines.map((line, i) => (
                    <div key={i} className="flex gap-4">
                        <span className="opacity-30 w-5 text-right select-none" style={{ color: theme.text, fontSize: "12px" }}>{i + 1}</span>
                        <span style={{ color: line.c || theme.text }}>{line.text || "\u00A0"}</span>
                    </div>
                ))}
            </div>
            <div className="flex items-center gap-2 px-4 py-2.5" style={{ borderTop: `1px solid ${theme.text}15` }}>
                <Terminal className="w-3.5 h-3.5 opacity-50" style={{ color: theme.text }} />
                <span className="text-xs font-mono opacity-40" style={{ color: theme.text }}>Terminal</span>
                <div className="ml-auto"><Play className="w-3.5 h-3.5 opacity-60" style={{ color: "#16a34a" }} /></div>
            </div>
        </div>
    );
}

export default function CoursesPreview() {
    const [featuredCourses, setFeaturedCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const sectionRef = useRef<HTMLDivElement>(null);
    const headingRef = useRef<HTMLDivElement>(null);
    const endMarkerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetch("/api/courses")
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    setFeaturedCourses(data.slice(0, 3));
                }
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    /* Heading scroll reveal */
    useEffect(() => {
        if (!headingRef.current) return;
        const ctx = gsap.context(() => {
            gsap.fromTo(headingRef.current, { opacity: 0, y: 60 }, {
                opacity: 1, y: 0, duration: 0.9, ease: "power3.out",
                scrollTrigger: { trigger: headingRef.current, start: "top 85%", toggleActions: "play none none none" },
            });
        });
        return () => ctx.revert();
    }, []);

    /*
     * EXACT portfolio-3 services.js animation:
     * 1. Pin each card (except last) using ScrollTrigger pin + pinSpacing: false
     * 2. Animate .service-card-inner upward with scrub so it slides up as next card arrives
     */
    const initAnimations = useCallback(() => {
        if (featuredCourses.length === 0 || !sectionRef.current) return;

        // Kill previous ScrollTrigger instances in this context
        ScrollTrigger.getAll().forEach((st) => {
            if (st.vars?.id?.startsWith?.("course-stack-")) {
                st.kill();
            }
        });

        // Skip on mobile
        if (window.innerWidth <= 1000) return;

        const cards = gsap.utils.toArray<HTMLElement>(".p3-service-card");
        if (cards.length === 0) return;

        const endTriggerEl = endMarkerRef.current || cards[cards.length - 1];

        cards.forEach((card, index) => {
            const isLast = index === cards.length - 1;
            const inner = card.querySelector(".p3-card-inner") as HTMLElement;
            if (!inner) return;

            if (!isLast) {
                // Pin the card at 10% of viewport so full content is visible
                ScrollTrigger.create({
                    id: `course-stack-pin-${index}`,
                    trigger: card,
                    start: "top 10%",
                    endTrigger: endTriggerEl,
                    end: "top 90%",
                    pin: true,
                    pinSpacing: false,
                });

                // Animate inner content upward as user scrolls (scrub)
                gsap.to(inner, {
                    y: `-${(cards.length - index) * 14}vh`,
                    ease: "none",
                    scrollTrigger: {
                        id: `course-stack-scroll-${index}`,
                        trigger: card,
                        start: "top 10%",
                        endTrigger: endTriggerEl,
                        end: "top 90%",
                        scrub: true,
                    },
                });
            }
        });
    }, [featuredCourses]);

    useEffect(() => {
        // Small delay to ensure DOM is ready
        const timer = setTimeout(() => {
            initAnimations();
        }, 100);

        const handleResize = () => initAnimations();
        window.addEventListener("resize", handleResize);

        return () => {
            clearTimeout(timer);
            window.removeEventListener("resize", handleResize);
            ScrollTrigger.getAll().forEach((st) => {
                if (st.vars?.id?.startsWith?.("course-stack-")) {
                    st.kill();
                }
            });
        };
    }, [initAnimations]);

    if (loading || featuredCourses.length === 0) return null;

    return (
        <section className="relative">
            {/* Section Heading */}
            <div className="py-20 relative">
                <div className="absolute inset-0 fb-dot-grid opacity-30" />
                <div ref={headingRef} className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center opacity-0">
                    <span className="fb-mono text-[12px] text-[#E6C212] uppercase tracking-[0.3em] mb-4 block">
                        Featured Courses
                    </span>
                    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6">
                        Master the Skills That{" "}
                        <span className="text-[#E6C212]">Matter</span>
                    </h2>
                    <p className="fb-mono text-[15px] text-[#A1A1AA] max-w-2xl mx-auto leading-relaxed">
                        Scroll to explore our top courses — each slides over the last, like pages of a book.
                    </p>
                </div>
            </div>

            {/* Portfolio-3 Style Stacking Cards */}
            <div ref={sectionRef} className="p3-services">
                {featuredCourses.map((course, i) => {
                    const theme = CARD_COLORS[i % CARD_COLORS.length];
                    const num = String(i + 1).padStart(2, "0");

                    return (
                        <div key={course.id} className="p3-service-card">
                            <div
                                className="p3-card-inner"
                                style={{ backgroundColor: theme.bg, color: theme.text }}
                            >
                                {/* Left: Content */}
                                <div className="p3-card-content">
                                    {/* Number + Category */}
                                    <div className="flex items-center gap-4 mb-4">
                                        <span className="text-[80px] sm:text-[100px] font-black leading-none opacity-[0.15]" style={{ fontStyle: "italic" }}>
                                            {num}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-2xl">{CATEGORY_ICONS[course.category] || "📚"}</span>
                                            <span className="font-mono text-[11px] uppercase tracking-[0.2em] opacity-60">
                                                {course.category}
                                            </span>
                                            {course.isPremium && (
                                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#141414] text-white uppercase tracking-wider">
                                                    Pro
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Title — big, uppercase, italic like portfolio-3 */}
                                    <h3 className="text-[clamp(2rem,5vw,4.5rem)] font-black uppercase italic leading-[0.95] tracking-[-0.02em] mb-6">
                                        {course.title}
                                    </h3>

                                    {/* Description + Meta */}
                                    <p className="text-[14px] leading-[1.6] opacity-70 max-w-md mb-6">
                                        {course.shortDescription || course.description}
                                    </p>

                                    <div className="flex flex-wrap gap-x-6 gap-y-2 mb-6 font-mono text-[12px] uppercase tracking-wider opacity-50">
                                        <span>{course.difficulty}</span>
                                        <span>{course.estimatedHours}h</span>
                                        <span>{course.enrolledCount?.toLocaleString()}+ students</span>
                                        <span>★ {course.rating?.toFixed(1)}</span>
                                    </div>

                                    {/* Explore link — underlined, like portfolio-3 */}
                                    <Link
                                        href={`/courses/${course.id}`}
                                        className="group inline-flex items-center gap-2 text-[14px] font-medium uppercase tracking-wider pb-1"
                                        style={{ borderBottom: `2px solid ${theme.text}` }}
                                    >
                                        <span>Explore Course</span>
                                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                    </Link>
                                </div>

                                {/* Right: Visual (like service-card-img) */}
                                <div className="p3-card-img hidden lg:block">
                                    <CourseVisual index={i} theme={theme} />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* End marker for ScrollTrigger endTrigger */}
            <div ref={endMarkerRef} />

            {/* View All Courses */}
            <div className="py-16 text-center relative">
                <div className="absolute inset-0 fb-dot-grid opacity-20" />
                <Link href="/courses" className="fb-btn-outline inline-flex items-center gap-2 text-sm relative z-10">
                    View All Courses
                    <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </section>
    );
}
