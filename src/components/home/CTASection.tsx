"use client";

import Link from "next/link";
import { Rocket, ArrowRight } from "lucide-react";
import FloatingParticles from "@/components/ui/FloatingParticles";
import { useScrollReveal, useMagneticHover } from "@/hooks/useScrollReveal";

export default function CTASection() {
    const sectionRef = useScrollReveal<HTMLDivElement>({ direction: "up", distance: 50, duration: 0.8 });
    const magneticRef = useMagneticHover<HTMLAnchorElement>(0.12);

    return (
        <section className="py-24 relative overflow-hidden">
            <div className="absolute inset-0 gradient-primary opacity-10" />
            {/* Animated morphing blobs */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-morph" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-morph" style={{ animationDelay: "4s" }} />
            <FloatingParticles count={20} />

            <div ref={sectionRef} className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl sm:text-5xl font-bold text-text-primary mb-6">
                    Ready to Start Your
                    <br />
                    <span className="gradient-text">Coding Journey?</span>
                </h2>
                <p className="text-lg text-text-secondary mb-10 max-w-2xl mx-auto">
                    Join thousands of developers who are mastering programming through
                    practice, not just theory. Start for free today.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        ref={magneticRef}
                        href="/dashboard"
                        className="group flex items-center gap-2 px-8 py-4 rounded-xl gradient-primary text-white font-semibold text-lg hover:opacity-90 transition-all shadow-xl shadow-primary/25 animate-glow-pulse"
                    >
                        <Rocket className="w-5 h-5 group-hover:animate-bounce" />
                        Start Learning Now
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
