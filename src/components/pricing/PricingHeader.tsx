"use client";

import { Sparkles } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { PRICING_BILLING_LABELS, PRICING_YEARLY_SAVE_TEXT } from "@/constants/pricing";
import type { BillingCycle } from "@/types/pricing";

interface PricingHeaderProps {
    billing: BillingCycle;
    onBillingChange: (billing: BillingCycle) => void;
}

export default function PricingHeader({ billing, onBillingChange }: PricingHeaderProps) {
    const headerRef = useScrollReveal<HTMLDivElement>({ direction: "up", distance: 40, duration: 0.7 });

    return (
        <div ref={headerRef} className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-card border border-border-light mb-4 animate-shimmer">
                <Sparkles className="w-4 h-4 text-[#E6C212] animate-float-subtle" />
                <span className="text-sm font-medium text-[#E6C212]">
                    Simple Pricing
                </span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold text-text-primary mb-4">
                Choose Your <span className="text-[#E6C212]">Learning Plan</span>
            </h1>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
                Start free, upgrade when you need more. No hidden fees, cancel
                anytime.
            </p>

            {/* Billing Toggle */}
            <div className="mt-8 inline-flex items-center gap-3 p-1 fb-card rounded-xl animate-glow-pulse">
                <button
                    onClick={() => onBillingChange("monthly")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${billing === "monthly"
                        ? "bg-[#E6C212] text-black"
                        : "text-text-muted hover:text-text-primary"
                        }`}
                >
                    {PRICING_BILLING_LABELS.monthly}
                </button>
                <button
                    onClick={() => onBillingChange("yearly")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${billing === "yearly"
                        ? "bg-[#E6C212] text-black"
                        : "text-text-muted hover:text-text-primary"
                        }`}
                >
                    {PRICING_BILLING_LABELS.yearly}
                    <span className="ml-1 text-xs text-[#E6C212]">{PRICING_YEARLY_SAVE_TEXT}</span>
                </button>
            </div>
        </div>
    );
}
