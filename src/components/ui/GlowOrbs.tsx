"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface GlowOrbsProps {
    className?: string;
}

export default function GlowOrbs({ className = "" }: GlowOrbsProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const orbs = container.querySelectorAll(".glow-orb");

        orbs.forEach((orb, i) => {
            gsap.to(orb, {
                x: `random(-100, 100)`,
                y: `random(-80, 80)`,
                scale: `random(0.8, 1.3)`,
                duration: `random(12, 25)`,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                delay: i * 2,
            });
        });
    }, []);

    return (
        <div ref={containerRef} className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
            <div className="glow-orb absolute top-[10%] left-[15%] w-[400px] h-[400px] rounded-full bg-primary/5 blur-[120px]" />
            <div className="glow-orb absolute top-[60%] right-[10%] w-[350px] h-[350px] rounded-full bg-accent/5 blur-[100px]" />
            <div className="glow-orb absolute bottom-[20%] left-[40%] w-[300px] h-[300px] rounded-full bg-primary-light/4 blur-[80px]" />
            <div className="glow-orb absolute top-[40%] right-[35%] w-[250px] h-[250px] rounded-full bg-success/3 blur-[90px]" />
        </div>
    );
}
