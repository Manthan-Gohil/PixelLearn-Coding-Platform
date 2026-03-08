"use client";

import { Check, X, Crown } from "lucide-react";
import { useScrollReveal, useStaggerReveal } from "@/hooks/useScrollReveal";

interface Feature {
    name: string;
    free: boolean | string;
    pro: boolean | string;
}

const comparisonFeatures: Feature[] = [
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

export default function ComparisonTable() {
    const headerRef = useScrollReveal<HTMLHeadingElement>({ direction: "up", distance: 30 });
    const tableRef = useStaggerReveal<HTMLDivElement>(".comparison-row", {
        direction: "left",
        distance: 30,
        stagger: 0.04,
        duration: 0.4,
    });

    return (
        <div className="max-w-3xl mx-auto mb-20">
            <h2 ref={headerRef} className="text-2xl font-bold text-text-primary mb-8 text-center">
                Feature Comparison
            </h2>
            <div ref={tableRef} className="glass rounded-2xl overflow-hidden animate-glow-pulse">
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
                        className={`comparison-row grid grid-cols-3 gap-0 p-4 ${i % 2 === 0 ? "bg-surface-alt/20" : ""
                            } border-b border-border/50 last:border-0 hover:bg-surface-hover/30 transition-colors duration-200`}
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
    );
}
