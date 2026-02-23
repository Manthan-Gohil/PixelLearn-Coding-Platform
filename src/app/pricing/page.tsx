"use client";

import { useState } from "react";
import Link from "next/link";
import { AppProvider, useApp } from "@/store";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { SUBSCRIPTION_PLANS } from "@/services/data";
import {
    Check,
    X,
    Zap,
    Crown,
    ArrowRight,
    Sparkles,
    Shield,
    HelpCircle,
} from "lucide-react";

function PricingContent() {
    const { user, updateSubscription } = useApp();
    const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
    const [showFAQ, setShowFAQ] = useState<number | null>(null);

    const activePlans = SUBSCRIPTION_PLANS.filter(
        (p) => p.interval === billing || p.price === 0
    );

    const faqItems = [
        {
            question: "Can I switch between plans?",
            answer:
                "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and billing is prorated.",
        },
        {
            question: "Is there a free trial for Pro?",
            answer:
                "We offer a 14-day free trial for Pro. No credit card required to start. Cancel anytime during the trial.",
        },
        {
            question: "What payment methods do you accept?",
            answer:
                "We accept all major credit cards (Visa, MasterCard, Amex), PayPal, and UPI. All payments are processed securely.",
        },
        {
            question: "Can I get a refund?",
            answer:
                "Yes, we offer a 30-day money-back guarantee. If you're not satisfied, contact us for a full refund.",
        },
        {
            question: "Do you offer team/student discounts?",
            answer:
                "Yes! We offer 50% discount for students with a valid .edu email and custom pricing for teams of 5+. Contact us for details.",
        },
    ];

    const comparisonFeatures = [
        { name: "Free Courses", free: true, pro: true },
        { name: "Basic Coding Playground", free: true, pro: true },
        { name: "Progress Tracking", free: true, pro: true },
        { name: "Community Support", free: true, pro: true },
        { name: "Daily Exercise Limit", free: "5/day", pro: "Unlimited" },
        { name: "Premium Courses", free: false, pro: true },
        { name: "AI Career Q&A", free: false, pro: true },
        { name: "AI Resume Analyzer", free: false, pro: true },
        { name: "AI Career Roadmap", free: false, pro: true },
        { name: "Certificate of Completion", free: false, pro: true },
        { name: "Priority Support", free: false, pro: true },
        { name: "Advanced Analytics", free: false, pro: true },
    ];

    return (
        <main className="min-h-screen bg-surface pt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-4">
                        <Sparkles className="w-4 h-4 text-primary-light" />
                        <span className="text-sm font-medium text-primary-light">
                            Simple Pricing
                        </span>
                    </div>
                    <h1 className="text-3xl sm:text-5xl font-bold text-text-primary mb-4">
                        Choose Your <span className="gradient-text">Learning Plan</span>
                    </h1>
                    <p className="text-text-secondary text-lg max-w-2xl mx-auto">
                        Start free, upgrade when you need more. No hidden fees, cancel
                        anytime.
                    </p>

                    {/* Billing Toggle */}
                    <div className="mt-8 inline-flex items-center gap-3 p-1 glass rounded-xl">
                        <button
                            onClick={() => setBilling("monthly")}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${billing === "monthly"
                                    ? "gradient-primary text-white shadow-lg"
                                    : "text-text-muted hover:text-text-primary"
                                }`}
                        >
                            Monthly
                        </button>
                        <button
                            onClick={() => setBilling("yearly")}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${billing === "yearly"
                                    ? "gradient-primary text-white shadow-lg"
                                    : "text-text-muted hover:text-text-primary"
                                }`}
                        >
                            Yearly
                            <span className="ml-1 text-xs text-success">Save 35%</span>
                        </button>
                    </div>
                </div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-20">
                    {activePlans.map((plan) => {
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

                {/* Feature Comparison */}
                <div className="max-w-3xl mx-auto mb-20">
                    <h2 className="text-2xl font-bold text-text-primary mb-8 text-center">
                        Feature Comparison
                    </h2>
                    <div className="glass rounded-2xl overflow-hidden">
                        <div className="grid grid-cols-3 gap-0 border-b border-border p-4 bg-surface-alt/50">
                            <div className="text-sm font-semibold text-text-primary">
                                Feature
                            </div>
                            <div className="text-sm font-semibold text-text-primary text-center">
                                Free
                            </div>
                            <div className="text-sm font-semibold text-primary-light text-center flex items-center justify-center gap-1">
                                <Crown className="w-4 h-4" /> Pro
                            </div>
                        </div>
                        {comparisonFeatures.map((feature, i) => (
                            <div
                                key={i}
                                className={`grid grid-cols-3 gap-0 p-4 ${i % 2 === 0 ? "bg-surface-alt/20" : ""
                                    } border-b border-border/50 last:border-0`}
                            >
                                <div className="text-sm text-text-secondary">{feature.name}</div>
                                <div className="text-center">
                                    {typeof feature.free === "boolean" ? (
                                        feature.free ? (
                                            <Check className="w-4 h-4 text-success mx-auto" />
                                        ) : (
                                            <X className="w-4 h-4 text-text-muted mx-auto" />
                                        )
                                    ) : (
                                        <span className="text-sm text-text-muted">
                                            {feature.free}
                                        </span>
                                    )}
                                </div>
                                <div className="text-center">
                                    {typeof feature.pro === "boolean" ? (
                                        feature.pro ? (
                                            <Check className="w-4 h-4 text-primary-light mx-auto" />
                                        ) : (
                                            <X className="w-4 h-4 text-text-muted mx-auto" />
                                        )
                                    ) : (
                                        <span className="text-sm text-primary-light font-medium">
                                            {feature.pro}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* FAQ */}
                <div className="max-w-3xl mx-auto mb-16">
                    <h2 className="text-2xl font-bold text-text-primary mb-8 text-center">
                        Frequently Asked Questions
                    </h2>
                    <div className="space-y-3">
                        {faqItems.map((faq, i) => (
                            <div
                                key={i}
                                className="glass rounded-xl overflow-hidden transition-all"
                            >
                                <button
                                    onClick={() => setShowFAQ(showFAQ === i ? null : i)}
                                    className="w-full flex items-center justify-between p-4 text-left hover:bg-surface-hover/30 transition-colors"
                                >
                                    <span className="flex items-center gap-2 text-sm font-medium text-text-primary">
                                        <HelpCircle className="w-4 h-4 text-primary-light" />
                                        {faq.question}
                                    </span>
                                    <span
                                        className={`transform transition-transform ${showFAQ === i ? "rotate-180" : ""
                                            }`}
                                    >
                                        <ArrowRight className="w-4 h-4 text-text-muted rotate-90" />
                                    </span>
                                </button>
                                {showFAQ === i && (
                                    <div className="px-4 pb-4 pt-0 text-sm text-text-secondary animate-fade-in">
                                        <div className="pl-6">{faq.answer}</div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Trust */}
                <div className="text-center">
                    <div className="inline-flex items-center gap-2 text-text-muted text-sm">
                        <Shield className="w-4 h-4" />
                        30-day money-back guarantee · SSL encrypted · Cancel anytime
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}

export default function PricingPage() {
    return (
        <AppProvider>
            <Navbar />
            <PricingContent />
        </AppProvider>
    );
}
