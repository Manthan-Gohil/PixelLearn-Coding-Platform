"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface Particle {
    char: string;
    x: number;
    y: number;
    size: number;
    opacity: number;
    color: string;
}

const CODE_CHARS = [
    "{", "}", "(", ")", "<", ">", "/", ";", "=", "+",
    "const", "let", "def", "=>", "fn", "::", "//", "&&",
    "0", "1", "[]", "||", "!=", "++", "#", "@", "$",
];

const PARTICLE_COLORS = [
    "rgba(99, 102, 241, 0.15)",
    "rgba(6, 182, 212, 0.15)",
    "rgba(129, 140, 248, 0.12)",
    "rgba(16, 185, 129, 0.1)",
    "rgba(245, 158, 11, 0.08)",
];

interface FloatingParticlesProps {
    count?: number;
    className?: string;
}

export default function FloatingParticles({ count = 30, className = "" }: FloatingParticlesProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const particles: HTMLSpanElement[] = [];

        for (let i = 0; i < count; i++) {
            const span = document.createElement("span");
            span.textContent = CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
            span.className = "floating-code-particle";
            span.style.cssText = `
                position: absolute;
                font-family: 'JetBrains Mono', monospace;
                font-size: ${Math.random() * 14 + 8}px;
                color: ${PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)]};
                pointer-events: none;
                user-select: none;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                opacity: 0;
            `;
            container.appendChild(span);
            particles.push(span);
        }

        // Animate each particle with unique motion paths
        particles.forEach((p, i) => {
            const delay = Math.random() * 5;
            const duration = 15 + Math.random() * 20;

            gsap.to(p, {
                opacity: parseFloat(p.style.color.split(",").pop()?.replace(")", "") || "0.15"),
                duration: 2,
                delay: delay,
            });

            gsap.to(p, {
                y: `random(-150, 150)`,
                x: `random(-100, 100)`,
                rotation: `random(-180, 180)`,
                duration: duration,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                delay: delay,
            });

            // Fade in/out pulse
            gsap.to(p, {
                opacity: `random(0.03, 0.2)`,
                duration: `random(3, 8)`,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                delay: delay + 2,
            });
        });

        return () => {
            particles.forEach((p) => p.remove());
        };
    }, [count]);

    return (
        <div
            ref={containerRef}
            className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
        />
    );
}
