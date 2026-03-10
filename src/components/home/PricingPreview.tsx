"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import FloatingParticles from "@/components/ui/FloatingParticles";
import { useScrollReveal, useStaggerReveal } from "@/hooks/useScrollReveal";
import { SUBSCRIPTION_PLANS } from "@/services/data";

export default function PricingPreview() {
    const headerRef = useScrollReveal<HTMLDivElement>({ direction: "up", distance: 30 });
    const gridRef = useStaggerReveal<HTMLDivElement>(".pricing-card", {
        direction: "up",
        distance: 50,
        stagger: 0.12,
        scale: 0.9,
        duration: 0.7,
    });

    return (
        <section className="py-24 bg-surface-alt/30 relative overflow-hidden">
            <FloatingParticles count={10} />
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div ref={headerRef} className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
                        Simple, Transparent{" "}
                        <span className="gradient-text">Pricing</span>
                    </h2>
                    <p className="text-text-secondary max-w-2xl mx-auto text-lg">
                        Start free, upgrade when you need more. No hidden fees, cancel
                        anytime.
                    </p>
                </div>

                <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                    {SUBSCRIPTION_PLANS.map((plan) => (
                        <div
                            key={plan.id}
                            className={`pricing-card relative glass rounded-2xl p-8 transition-all duration-300 card-hover-glow ${plan.isPopular
                                ? "border-primary/40 shadow-xl shadow-primary/10 scale-105 animate-glow-pulse"
                                : "hover:border-primary/20"
                                }`}
                        >
                            {plan.isPopular && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full gradient-primary text-white text-xs font-semibold animate-shimmer">
                                    Most Popular
                                </div>
                            )}

                            <h3 className="text-xl font-bold text-text-primary mb-1">
                                {plan.name}
                            </h3>
                            <div className="flex items-baseline gap-1 mb-6">
                                <span className="text-4xl font-bold text-text-primary">
                                    ${plan.price}
                                </span>
                                <span className="text-text-muted text-sm">/{plan.interval === "yearly" ? "year" : "mo"}</span>
                            </div>

                            <ul className="space-y-3 mb-8">
                                {plan.features.map((feature, i) => (
                                    <li
                                        key={i}
                                        className="flex items-start gap-2 text-sm text-text-secondary"
                                    >
                                        <Check className="w-4 h-4 text-success mt-0.5 shrink-0" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <Link
                                href="/pricing"
                                className={`block text-center py-3 rounded-xl font-semibold transition-all ${plan.isPopular
                                    ? "gradient-primary text-white hover:opacity-90 shadow-lg shadow-primary/25"
                                    : "border border-border text-text-primary hover:bg-surface-hover hover:border-primary/30"
                                    }`}
                            >
                                {plan.price === 0 ? "Get Started" : "Subscribe Now"}
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
