"use client";

import { useState } from "react";
import { useApp } from "@/store";
import StandardLayout from "@/components/layout/StandardLayout";
import {
    AI_TOOL_TABS,
    AI_TOOLS_PRO_ONLY_DESCRIPTION,
    AI_TOOLS_PRO_ONLY_TITLE_HIGHLIGHT,
    AI_TOOLS_PRO_ONLY_TITLE_PREFIX,
    AI_TOOLS_UPGRADE_HREF,
} from "@/constants/ai-tools";
import { useScrollReveal, useStaggerReveal } from "@/hooks/useScrollReveal";
import {
    Brain,
    FileText,
    Rocket,
    Sparkles,
    ArrowRight,
    Lock,
    Zap,
} from "lucide-react";
import type { AITabId, AIToolTabIconName } from "@/types/ai-tools";

// Components
import CareerQA from "@/components/ai-tools/CareerQA";
import ResumeAnalyser from "@/components/ai-tools/ResumeAnalyser";
import RoadmapGenerator from "@/components/ai-tools/RoadmapGenerator";

function AIToolsContent() {
    const { user } = useApp();
    const [activeTab, setActiveTab] = useState<AITabId>("career-qa");
    const isPro = user.subscription === "pro";

    const headerRef = useScrollReveal<HTMLDivElement>({ direction: "up", distance: 30, duration: 0.6 });
    const tabsRef = useStaggerReveal<HTMLDivElement>(".ai-tab", {
        direction: "up",
        distance: 30,
        stagger: 0.1,
        duration: 0.5,
    });

    const tabIcons: Record<AIToolTabIconName, typeof Brain> = {
        Brain,
        FileText,
        Rocket,
    };

    if (!isPro) {
        return (
            <StandardLayout particlesCount={15} showFooter={false} flowblockTheme>
                <div className="relative max-w-4xl mx-auto py-20 text-center">
                    <div className="fb-card rounded-2xl p-12 animate-glow-pulse">
                        <Lock className="w-16 h-16 text-[#E6C212] mx-auto mb-6 animate-float-subtle" />
                        <h1 className="text-3xl font-bold text-text-primary mb-4">
                            {AI_TOOLS_PRO_ONLY_TITLE_PREFIX}<span className="text-[#E6C212]">{AI_TOOLS_PRO_ONLY_TITLE_HIGHLIGHT}</span>
                        </h1>
                        <p className="text-text-secondary mb-8 max-w-lg mx-auto">
                            {AI_TOOLS_PRO_ONLY_DESCRIPTION}
                        </p>
                        <a
                            href={AI_TOOLS_UPGRADE_HREF}
                            className="fb-btn-primary text-base"
                        >
                            <Zap className="w-5 h-5" />
                            Upgrade to Pro
                            <ArrowRight className="w-5 h-5" />
                        </a>
                    </div>
                </div>
            </StandardLayout>
        );
    }

    return (
        <StandardLayout
            particlesCount={15}
            flowblockTheme
            containerClassName="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8"
        >
            {/* Header */}
            <div ref={headerRef} className="mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-card border border-border-light mb-3 animate-shimmer">
                    <Sparkles className="w-4 h-4 text-[#E6C212] animate-float-subtle" />
                    <span className="text-sm font-medium text-[#E6C212]">AI-Powered</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold text-text-primary mb-2">
                    AI Career <span className="text-[#E6C212]">Intelligence</span>
                </h1>
                <p className="text-text-secondary text-lg fb-mono">
                    Get personalized career guidance, resume analysis, and roadmap generation
                </p>
            </div>

            {/* Tabs */}
            <div ref={tabsRef} className="grid grid-cols-3 gap-4 mb-8">
                {AI_TOOL_TABS.map((tab) => {
                    const Icon = tabIcons[tab.icon];
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`ai-tab p-4 rounded-xl border transition-all duration-300 text-left spotlight-card hover-bounce ${activeTab === tab.id
                                ? "border-[#E6C212]/50 bg-[#0f0f0f] shadow-lg shadow-black/40 animate-glow-pulse"
                                : "border-border fb-card hover:border-border-light"
                                }`}
                            onMouseMove={(e) => {
                                const rect = e.currentTarget.getBoundingClientRect();
                                e.currentTarget.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
                                e.currentTarget.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
                            }}
                        >
                            <Icon
                                className={`w-6 h-6 mb-2 transition-all duration-300 ${activeTab === tab.id
                                    ? "text-[#E6C212] scale-110"
                                    : "text-text-muted"
                                    }`}
                            />
                            <div className="font-semibold text-text-primary text-sm">
                                {tab.label}
                            </div>
                            <div className="text-xs text-text-muted">{tab.description}</div>
                        </button>
                    );
                })}
            </div>

            {/* Content with animation */}
            <div key={activeTab} className="animate-slide-up" style={{ animationDuration: "0.4s" }}>
                {activeTab === "career-qa" && <CareerQA />}
                {activeTab === "resume" && <ResumeAnalyser />}
                {activeTab === "roadmap" && <RoadmapGenerator />}
            </div>
        </StandardLayout>
    );
}

export default function AIToolsPage() {
    return <AIToolsContent />;
}
