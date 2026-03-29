"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface TextRevealProps {
    children: string;
    className?: string;
    tag?: "h1" | "h2" | "h3" | "p" | "span";
    stagger?: number;
    duration?: number;
    triggerStart?: string;
}

export default function TextReveal({
    children,
    className = "",
    tag: Tag = "p",
    stagger = 0.08,
    duration = 0.8,
    triggerStart = "top 85%",
}: TextRevealProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const words = el.querySelectorAll(".tr-word");

        const ctx = gsap.context(() => {
            gsap.fromTo(
                words,
                {
                    opacity: 0,
                    y: 30,
                    rotateX: -40,
                    filter: "blur(4px)",
                },
                {
                    opacity: 1,
                    y: 0,
                    rotateX: 0,
                    filter: "blur(0px)",
                    duration,
                    stagger,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: el,
                        start: triggerStart,
                        toggleActions: "play none none none",
                    },
                }
            );
        }, el);

        return () => ctx.revert();
    }, [stagger, duration, triggerStart]);

    const words = children.split(" ");

    return (
        <div ref={containerRef} style={{ perspective: "600px" }}>
            <Tag className={className}>
                {words.map((word, i) => (
                    <span
                        key={i}
                        className="tr-word inline-block mr-[0.3em]"
                        style={{ transformOrigin: "center bottom" }}
                    >
                        {word}
                    </span>
                ))}
            </Tag>
        </div>
    );
}
