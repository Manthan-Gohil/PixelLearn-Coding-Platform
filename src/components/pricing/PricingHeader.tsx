"use client";

import { Sparkles } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

interface PricingHeaderProps {
    billing: "monthly" | "yearly";
    onBillingChange: (billing: "monthly" | "yearly") => void;
}

export default function PricingHeader({ billing, onBillingChange }: PricingHeaderProps) {
    const headerRef = useScrollReveal<HTMLDivElement>({ direction: "up", distance: 40, duration: 0.7 });

    return (
        <div ref={headerRef} className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-4 animate-shimmer">
                <Sparkles className="w-4 h-4 text-primary-light animate-float-subtle" />
                <span className="text-sm font-medium text-primary-light">
                    Simple Pricing
                </span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold text-text-primary mb-4">
                Choose Your <span className="animate-gradient-text">Learning Plan</span>
            </h1>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
                Start free, upgrade when you need more. No hidden fees, cancel
                anytime.
            </p>

            {/* Billing Toggle */}
            <div className="mt-8 inline-flex items-center gap-3 p-1 glass rounded-xl animate-glow-pulse">
                <button
                    onClick={() => onBillingChange("monthly")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${billing === "monthly"
                        ? "gradient-primary text-white shadow-lg shadow-primary/25"
                        : "text-text-muted hover:text-text-primary"
                        }`}
                >
                    Monthly
                </button>
                <button
                    onClick={() => onBillingChange("yearly")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${billing === "yearly"
                        ? "gradient-primary text-white shadow-lg shadow-primary/25"
                        : "text-text-muted hover:text-text-primary"
                        }`}
                >
                    Yearly
                    <span className="ml-1 text-xs text-success">Save 35%</span>
                </button>
            </div>
        </div>
    );
}
