"use client";

import { useEffect, useRef, useCallback } from "react";

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
    opacity: number;
    color: string;
}

export default function MouseParticles() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouseRef = useRef({ x: -1000, y: -1000 });
    const particlesRef = useRef<Particle[]>([]);
    const animRef = useRef<number>(0);

    const initParticles = useCallback((w: number, h: number) => {
        const colors = [
            "rgba(230,194,18,0.4)",   // yellow
            "rgba(103,232,249,0.3)",   // teal
            "rgba(74,222,128,0.25)",   // green
            "rgba(255,255,255,0.15)",  // white
            "rgba(230,194,18,0.2)",    // yellow faint
        ];
        const particles: Particle[] = [];
        for (let i = 0; i < 60; i++) {
            particles.push({
                x: Math.random() * w,
                y: Math.random() * h,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                radius: Math.random() * 2.5 + 0.5,
                opacity: Math.random() * 0.5 + 0.1,
                color: colors[Math.floor(Math.random() * colors.length)],
            });
        }
        particlesRef.current = particles;
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            if (particlesRef.current.length === 0) {
                initParticles(canvas.width, canvas.height);
            }
        };

        resize();
        window.addEventListener("resize", resize);

        const handleMouse = (e: MouseEvent) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };
        };
        window.addEventListener("mousemove", handleMouse);

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const mouse = mouseRef.current;

            for (const p of particlesRef.current) {
                // Mouse attraction
                const dx = mouse.x - p.x;
                const dy = mouse.y - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 200 && dist > 0) {
                    const force = (200 - dist) / 200 * 0.015;
                    p.vx += (dx / dist) * force;
                    p.vy += (dy / dist) * force;
                }

                // Apply velocity with damping
                p.vx *= 0.98;
                p.vy *= 0.98;
                p.x += p.vx;
                p.y += p.vy;

                // Wrap around edges
                if (p.x < -10) p.x = canvas.width + 10;
                if (p.x > canvas.width + 10) p.x = -10;
                if (p.y < -10) p.y = canvas.height + 10;
                if (p.y > canvas.height + 10) p.y = -10;

                // Draw particle
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.fill();

                // Glow
                if (p.radius > 1.5) {
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.radius * 3, 0, Math.PI * 2);
                    const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 3);
                    grad.addColorStop(0, p.color);
                    grad.addColorStop(1, "transparent");
                    ctx.fillStyle = grad;
                    ctx.fill();
                }

                // Draw connection lines between nearby particles
                for (const p2 of particlesRef.current) {
                    if (p === p2) continue;
                    const d = Math.sqrt((p.x - p2.x) ** 2 + (p.y - p2.y) ** 2);
                    if (d < 100) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.strokeStyle = `rgba(230,194,18,${0.03 * (1 - d / 100)})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }

            animRef.current = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            cancelAnimationFrame(animRef.current);
            window.removeEventListener("resize", resize);
            window.removeEventListener("mousemove", handleMouse);
        };
    }, [initParticles]);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-[1]"
            style={{ mixBlendMode: "screen" }}
        />
    );
}
