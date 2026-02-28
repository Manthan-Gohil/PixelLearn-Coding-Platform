"use client";

import { Crown, Zap, Check } from "lucide-react";
import { SubscriptionPlan, User } from "@/types";

interface PricingCardsProps {
    plans: SubscriptionPlan[];
    user: User;
    updateSubscription: (type: "free" | "pro") => void;
}

export default function PricingCards({ plans, user, updateSubscription }: PricingCardsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-20">
            {plans.map((plan) => {
                const isCurrent =
                    (user.subscription === "free" && plan.price === 0) ||
                    (user.subscription === "pro" && plan.price > 0);

                return (
                    <div
                        key={plan.id}
                        className={`relative glass rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1 ${plan.isPopular
                                ? "border-primary/40 shadow-2xl shadow-primary/15 scale-105 z-10"
                                : "hover:border-primary/20"
                            }`}
                    >
                        {plan.isPopular && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full gradient-primary text-white text-xs font-semibold shadow-lg shadow-primary/25">
                                Most Popular
                            </div>
                        )}

                        <div className="flex items-center gap-2 mb-2">
                            {plan.price > 0 ? (
                                <Crown className="w-5 h-5 text-primary-light" />
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
                                    className="flex items-start gap-2 text-sm text-text-secondary"
                                >
                                    <Check
                                        className={`w-4 h-4 mt-0.5 shrink-0 ${plan.isPopular ? "text-primary-light" : "text-success"
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
                                className={`block w-full text-center py-3 rounded-xl font-semibold transition-all ${plan.isPopular
                                        ? "gradient-primary text-white hover:opacity-90 shadow-lg shadow-primary/25"
                                        : "border border-border text-text-primary hover:bg-surface-hover hover:border-primary/30"
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
