"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { Rocket } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function CTASection() {
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                sectionRef.current,
                { opacity: 0, y: 60 },
                {
                    opacity: 1, y: 0, duration: 0.9,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top 85%",
                        toggleActions: "play none none none",
                    },
                }
            );
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section className="py-28 relative">
            <div className="absolute inset-0 fb-dot-grid opacity-20" />
            {/* Subtle glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[radial-gradient(ellipse,rgba(230,194,18,0.05)_0%,transparent_70%)] pointer-events-none" />

            <div ref={sectionRef} className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center opacity-0">
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight">
                    Ready to Start Your
                    <br />
                    <span className="text-[#E6C212]">Coding Journey?</span>
                </h2>
                <p className="fb-mono text-[15px] sm:text-[17px] text-[#A1A1AA] mb-12 max-w-2xl mx-auto leading-relaxed">
                    Join thousands of developers who are mastering programming through
                    practice, not just theory. Start for free today.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        href="/dashboard"
                        className="fb-btn-primary text-base gap-3"
                    >
                        <Rocket className="w-5 h-5" />
                        Start Learning Now
                    </Link>
                </div>
            </div>
        </section>
    );
}
