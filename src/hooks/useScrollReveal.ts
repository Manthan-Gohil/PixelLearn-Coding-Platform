"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

type RevealDirection = "up" | "down" | "left" | "right" | "none";

interface ScrollRevealOptions {
    direction?: RevealDirection;
    distance?: number;
    duration?: number;
    delay?: number;
    stagger?: number;
    threshold?: number;
    scale?: number;
    rotate?: number;
    once?: boolean;
    ease?: string;
}

export function useScrollReveal<T extends HTMLElement>(options: ScrollRevealOptions = {}) {
    const ref = useRef<T>(null);

    const {
        direction = "up",
        distance = 60,
        duration = 0.8,
        delay = 0,
        threshold = 0.15,
        scale,
        rotate,
        once = true,
        ease = "power3.out",
    } = options;

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const fromVars: gsap.TweenVars = {
            opacity: 0,
            duration,
            delay,
            ease,
        };

        if (direction === "up") fromVars.y = distance;
        if (direction === "down") fromVars.y = -distance;
        if (direction === "left") fromVars.x = distance;
        if (direction === "right") fromVars.x = -distance;
        if (scale !== undefined) fromVars.scale = scale;
        if (rotate !== undefined) fromVars.rotation = rotate;

        gsap.set(el, fromVars);

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        gsap.to(el, {
                            opacity: 1,
                            x: 0,
                            y: 0,
                            scale: 1,
                            rotation: 0,
                            duration,
                            delay,
                            ease,
                        });
                        if (once) observer.unobserve(el);
                    }
                });
            },
            { threshold }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [direction, distance, duration, delay, threshold, scale, rotate, once, ease]);

    return ref;
}

export function useStaggerReveal<T extends HTMLElement>(
    childSelector: string,
    options: ScrollRevealOptions = {}
) {
    const ref = useRef<T>(null);

    const {
        direction = "up",
        distance = 50,
        duration = 0.6,
        delay = 0,
        stagger = 0.08,
        threshold = 0.1,
        scale,
        once = true,
        ease = "power3.out",
    } = options;

    useEffect(() => {
        const container = ref.current;
        if (!container) return;

        const children = container.querySelectorAll(childSelector);
        if (!children.length) return;

        const fromVars: gsap.TweenVars = {
            opacity: 0,
        };

        if (direction === "up") fromVars.y = distance;
        if (direction === "down") fromVars.y = -distance;
        if (direction === "left") fromVars.x = distance;
        if (direction === "right") fromVars.x = -distance;
        if (scale !== undefined) fromVars.scale = scale;

        gsap.set(children, fromVars);

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        gsap.to(children, {
                            opacity: 1,
                            x: 0,
                            y: 0,
                            scale: 1,
                            duration,
                            delay,
                            ease,
                            stagger,
                        });
                        if (once) observer.unobserve(container);
                    }
                });
            },
            { threshold }
        );

        observer.observe(container);
        return () => observer.disconnect();
    }, [childSelector, direction, distance, duration, delay, stagger, threshold, scale, once, ease]);

    return ref;
}

export function useParallax<T extends HTMLElement>(speed: number = 0.3) {
    const ref = useRef<T>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const handleScroll = () => {
            const rect = el.getBoundingClientRect();
            const scrolled = window.scrollY;
            const rate = (rect.top + scrolled - window.innerHeight / 2) * speed;
            gsap.set(el, { y: rate });
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [speed]);

    return ref;
}

export function useCountUp(
    endValue: number,
    options: { duration?: number; delay?: number; suffix?: string; prefix?: string } = {}
) {
    const ref = useRef<HTMLElement>(null);
    const hasAnimated = useRef(false);

    const { duration = 2, delay = 0, suffix = "", prefix = "" } = options;

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !hasAnimated.current) {
                        hasAnimated.current = true;
                        const obj = { value: 0 };
                        gsap.to(obj, {
                            value: endValue,
                            duration,
                            delay,
                            ease: "power2.out",
                            onUpdate: () => {
                                el.textContent = `${prefix}${Math.round(obj.value).toLocaleString()}${suffix}`;
                            },
                        });
                        observer.unobserve(el);
                    }
                });
            },
            { threshold: 0.5 }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [endValue, duration, delay, suffix, prefix]);

    return ref;
}

export function useMagneticHover<T extends HTMLElement>(strength: number = 0.3) {
    const ref = useRef<T>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const handleMouseMove = (e: MouseEvent) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            gsap.to(el, {
                x: x * strength,
                y: y * strength,
                duration: 0.4,
                ease: "power2.out",
            });
        };

        const handleMouseLeave = () => {
            gsap.to(el, {
                x: 0,
                y: 0,
                duration: 0.6,
                ease: "elastic.out(1, 0.3)",
            });
        };

        el.addEventListener("mousemove", handleMouseMove);
        el.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            el.removeEventListener("mousemove", handleMouseMove);
            el.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, [strength]);

    return ref;
}

export function useTiltCard<T extends HTMLElement>(maxTilt: number = 10) {
    const ref = useRef<T>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const handleMouseMove = (e: MouseEvent) => {
            const rect = el.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;

            const rotateX = (y - 0.5) * -maxTilt;
            const rotateY = (x - 0.5) * maxTilt;

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
    }, [maxTilt]);

    return ref;
}
