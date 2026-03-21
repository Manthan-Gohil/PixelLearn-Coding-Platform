"use client";

import { Crown, Zap } from "lucide-react";
import type { SubscriptionPlan, User } from "@/types";
import { useStaggerReveal } from "@/hooks/useScrollReveal";

interface PricingCardsProps {
    plans: SubscriptionPlan[];
    user: User;
    updateSubscription: (type: "free" | "pro") => void;
}

function getPlanDetails(plan: SubscriptionPlan) {
    const isFree = plan.id === "free";

    return [
        { label: "Access to Courses", value: isFree ? "Free Only" : "All Courses" },
        { label: "Coding Playground", value: isFree ? "Basic" : "Unlimited" },
        { label: "AI Career Tools", value: isFree ? "Limited" : "Full Access" },
        { label: "Daily Exercises", value: isFree ? "5 / day" : "Unlimited" },
        { label: "Priority Support", value: isFree ? "—" : "✓" },
    ];
}

export default function PricingCards({ plans, user, updateSubscription }: PricingCardsProps) {
    const gridRef = useStaggerReveal<HTMLDivElement>(".plan-card", {
        direction: "up",
        distance: 60,
        stagger: 0.15,
        scale: 0.9,
        duration: 0.7,
    });

    return (
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-20">
            {plans.map((plan) => {
                const isCurrent =
                    (user.subscription === "free" && plan.price === 0) ||
                    (user.subscription === "pro" && plan.price > 0);

                return (
                    <div
                        key={plan.id}
                        className={`plan-card relative fb-card rounded-2xl p-8 transition-all duration-300 card-hover-glow spotlight-card ${plan.isPopular
                            ? "border-[#E6C212]/60 shadow-2xl shadow-black/50 scale-105 z-10 animate-glow-pulse"
                            : "hover:border-border-light"
                            }`}
                        onMouseMove={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            e.currentTarget.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
                            e.currentTarget.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
                        }}
                    >
                        {plan.isPopular && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#E6C212] text-black text-xs font-semibold shadow-lg shadow-black/40 animate-shimmer">
                                Most Popular
                            </div>
                        )}

                        <div className="flex items-center gap-2 mb-4">
                            {plan.price > 0 ? (
                                <Crown className="w-5 h-5 text-[#E6C212] animate-float-subtle" />
                            ) : (
                                <Zap className="w-5 h-5 text-text-muted" />
                            )}
                            <h3 className="text-xl font-bold text-text-primary">
                                {plan.name}
                            </h3>
                        </div>

                        <div className="mb-6">
                            <div className="fb-mono text-4xl sm:text-5xl font-bold text-text-primary mb-1">
                                ${plan.price}
                                <span className="text-lg text-text-muted font-normal">
                                    /{plan.interval === "yearly" ? "year" : "mo"}
                                </span>
                            </div>
                            <div className="fb-divider my-4" />
                            <h4 className="fb-mono text-sm text-text-secondary text-center tracking-wider uppercase">
                                {plan.name} Plan
                            </h4>
                            <div className="fb-divider my-4" />
                        </div>

                        <div className="space-y-0 mb-8">
                            {getPlanDetails(plan).map((detail, i) => (
                                <div key={i} className="fb-pricing-row">
                                    <span className="fb-pricing-label">{detail.label}</span>
                                    <span className="fb-pricing-value">{detail.value}</span>
                                </div>
                            ))}
                        </div>

                        {isCurrent ? (
                            <div className="block text-center py-3 rounded-lg font-semibold border border-[#E6C212]/40 text-[#E6C212] bg-[#E6C212]/5 fb-mono">
                                Current Plan
                            </div>
                        ) : (
                            <button
                                onClick={() =>
                                    updateSubscription(plan.price > 0 ? "pro" : "free")
                                }
                                className={`block w-full text-center py-3 rounded-lg font-semibold transition-all ${plan.price === 0
                                    ? "bg-[#E6C212] text-black hover:bg-[#f0d030]"
                                    : "border border-[#333] text-white hover:bg-[#111] hover:border-[#555]"
                                    }`}
                            >
                                {plan.price === 0 ? "Get Started Free" : "Subscribe Now"}
                            </button>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
