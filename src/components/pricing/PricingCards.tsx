"use client";

import { Crown, Zap, Check } from "lucide-react";
import type { SubscriptionPlan, User } from "@/types";
import { useStaggerReveal } from "@/hooks/useScrollReveal";

interface PricingCardsProps {
    plans: SubscriptionPlan[];
    user: User;
    updateSubscription: (type: "free" | "pro") => void;
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

                        <div className="flex items-center gap-2 mb-2">
                            {plan.price > 0 ? (
                                <Crown className="w-5 h-5 text-[#E6C212] animate-float-subtle" />
                            ) : (
                                <Zap className="w-5 h-5 text-text-muted" />
                            )}
                            <h3 className="text-xl font-bold text-text-primary">
                                {plan.name}
                            </h3>
                        </div>

                        <div className="flex items-baseline gap-1 mb-1">
                            <span className="text-4xl font-bold text-text-primary">
                                ${plan.price}
                            </span>
                            <span className="text-text-muted text-sm">
                                /{plan.interval === "yearly" ? "year" : "mo"}
                            </span>
                        </div>
                        {plan.interval === "yearly" && plan.price > 0 && (
                            <p className="text-xs text-success mb-4">
                                That&apos;s just ${(plan.price / 12).toFixed(2)}/month
                            </p>
                        )}
                        {plan.price === 0 && (
                            <p className="text-xs text-text-muted mb-4">
                                Free forever, no credit card
                            </p>
                        )}
                        {plan.interval === "monthly" && plan.price > 0 && (
                            <p className="text-xs text-text-muted mb-4">
                                Billed monthly, cancel anytime
                            </p>
                        )}

                        <ul className="space-y-3 mb-8">
                            {plan.features.map((feature, i) => (
                                <li
                                    key={i}
                                    className="flex items-start gap-2 text-sm text-text-secondary stagger-fade-up"
                                    style={{ animationDelay: `${0.5 + i * 0.05}s` }}
                                >
                                    <Check
                                        className={`w-4 h-4 mt-0.5 shrink-0 ${plan.isPopular ? "text-[#E6C212]" : "text-success"
                                            }`}
                                    />
                                    {feature}
                                </li>
                            ))}
                        </ul>

                        {isCurrent ? (
                            <div className="block text-center py-3 rounded-xl font-semibold border border-success/30 text-success">
                                Current Plan
                            </div>
                        ) : (
                            <button
                                onClick={() =>
                                    updateSubscription(plan.price > 0 ? "pro" : "free")
                                }
                                className={`block w-full text-center py-3 rounded-xl font-semibold transition-all hover-bounce ${plan.isPopular
                                    ? "bg-[#E6C212] text-black hover:bg-[#f0d030]"
                                    : "fb-btn-outline w-full justify-center py-3"
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
