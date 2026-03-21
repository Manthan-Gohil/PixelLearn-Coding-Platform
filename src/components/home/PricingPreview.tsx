"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SUBSCRIPTION_PLANS } from "@/services/data";

gsap.registerPlugin(ScrollTrigger);

export default function PricingPreview() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const headingRef = useRef<HTMLDivElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);

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

            const cards = gridRef.current?.querySelectorAll(".pricing-card");
            if (cards) {
                gsap.fromTo(
                    cards,
                    { opacity: 0, y: 50, scale: 0.95 },
                    {
                        opacity: 1, y: 0, scale: 1, duration: 0.7,
                        stagger: 0.12,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: gridRef.current,
                            start: "top 80%",
                            toggleActions: "play none none none",
                        },
                    }
                );
            }
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    // Map plan features to Flowblock-style key-value pairs
    const getPlanDetails = (plan: typeof SUBSCRIPTION_PLANS[0]) => {
        const details = [
            { label: "Access to Courses", value: plan.id === "free" ? "Free Only" : "All Courses" },
            { label: "Coding Playground", value: plan.id === "free" ? "Basic" : "Unlimited" },
            { label: "AI Career Tools", value: plan.id === "free" ? "Limited" : "Full Access" },
            { label: "Daily Exercises", value: plan.id === "free" ? "5 / day" : "Unlimited" },
            { label: "Priority Support", value: plan.id === "free" ? "—" : "✓" },
        ];
        return details;
    };

    return (
        <section ref={sectionRef} className="py-28 relative fb-section-glow">
            <div className="absolute inset-0 fb-dot-grid opacity-30" />
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div ref={headingRef} className="text-center mb-20 opacity-0">
                    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6">
                        Unleash Your Full{" "}
                        <span className="text-[#E6C212]">Potential</span>
                    </h2>
                    <p className="fb-mono text-[15px] text-[#A1A1AA] max-w-2xl mx-auto leading-relaxed">
                        From students to professionals, we&apos;ve crafted plans that work for
                        everyone. Start with our generous free plan.
                    </p>
                </div>

                <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                    {SUBSCRIPTION_PLANS.map((plan) => (
                        <div
                            key={plan.id}
                            className={`pricing-card fb-card p-8 ${
                                plan.isPopular ? "border-[#E6C212]/30" : ""
                            }`}
                        >
                            {/* Price */}
                            <div className="mb-6">
                                <div className="fb-mono text-4xl sm:text-5xl font-bold text-white mb-2">
                                    ${plan.price}
                                    <span className="text-lg text-[#71717A] font-normal">
                                        /{plan.interval === "yearly" ? "year" : "mo"}
                                    </span>
                                </div>
                                <div className="fb-divider my-4" />
                                <h3 className="fb-mono text-sm text-[#A1A1AA] text-center tracking-wider uppercase">
                                    {plan.name} Plan
                                </h3>
                                <div className="fb-divider my-4" />
                            </div>

                            {/* Feature Rows - Flowblock Style */}
                            <div className="space-y-0 mb-8">
                                {getPlanDetails(plan).map((detail, i) => (
                                    <div key={i} className="fb-pricing-row">
                                        <span className="fb-pricing-label">{detail.label}</span>
                                        <span className="fb-pricing-value">{detail.value}</span>
                                    </div>
                                ))}
                            </div>

                            {/* CTA */}
                            <Link
                                href="/pricing"
                                className={`block text-center py-3.5 rounded-lg font-semibold transition-all duration-200 ${
                                    plan.price === 0
                                        ? "fb-btn-primary justify-center w-full !rounded-lg"
                                        : "border border-[#333] text-white hover:bg-[#111] hover:border-[#555]"
                                }`}
                            >
                                {plan.price === 0 ? "Get Started Free" : "Get Started"}
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
