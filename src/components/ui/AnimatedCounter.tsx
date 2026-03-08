"use client";

import { useEffect, useRef, useState } from "react";

interface AnimatedCounterProps {
    value: number;
    suffix?: string;
    prefix?: string;
    duration?: number;
    className?: string;
}

export default function AnimatedCounter({
    value,
    suffix = "",
    prefix = "",
    duration = 2000,
    className = "",
}: AnimatedCounterProps) {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);
    const hasAnimated = useRef(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !hasAnimated.current) {
                        hasAnimated.current = true;
                        const startTime = performance.now();

                        const animate = (currentTime: number) => {
                            const elapsed = currentTime - startTime;
                            const progress = Math.min(elapsed / duration, 1);
                            // Ease out cubic
                            const easedProgress = 1 - Math.pow(1 - progress, 3);
                            setCount(Math.round(easedProgress * value));

                            if (progress < 1) {
                                requestAnimationFrame(animate);
                            }
                        };

                        requestAnimationFrame(animate);
                        observer.unobserve(el);
                    }
                });
            },
            { threshold: 0.5 }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [value, duration]);

    return (
        <span ref={ref} className={className}>
            {prefix}{count.toLocaleString()}{suffix}
        </span>
    );
}
