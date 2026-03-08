"use client";

import { useState } from "react";
import { AppProvider, useApp } from "@/store";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingParticles from "@/components/ui/FloatingParticles";
import GlowOrbs from "@/components/ui/GlowOrbs";
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

// Components
import CareerQA from "@/components/ai-tools/CareerQA";
import ResumeAnalyser from "@/components/ai-tools/ResumeAnalyser";
import RoadmapGenerator from "@/components/ai-tools/RoadmapGenerator";

type AITab = "career-qa" | "resume" | "roadmap";

function AIToolsContent() {
    const { user } = useApp();
    const [activeTab, setActiveTab] = useState<AITab>("career-qa");
    const isPro = user.subscription === "pro";

    const headerRef = useScrollReveal<HTMLDivElement>({ direction: "up", distance: 30, duration: 0.6 });
    const tabsRef = useStaggerReveal<HTMLDivElement>(".ai-tab", {
        direction: "up",
        distance: 30,
        stagger: 0.1,
        duration: 0.5,
    });

    const tabs = [
        { id: "career-qa" as AITab, label: "Career Q&A", icon: Brain, description: "Ask career questions" },
        { id: "resume" as AITab, label: "Resume Analyzer", icon: FileText, description: "Analyze your resume" },
        { id: "roadmap" as AITab, label: "Career Roadmap", icon: Rocket, description: "Generate a roadmap" },
    ];

    if (!isPro) {
        return (
            <main className="min-h-screen bg-surface pt-16 relative overflow-hidden">
                <GlowOrbs />
                <FloatingParticles count={15} />
                <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
                    <div className="glass rounded-2xl p-12 animate-glow-pulse">
                        <Lock className="w-16 h-16 text-primary-light mx-auto mb-6 animate-float-subtle" />
                        <h1 className="text-3xl font-bold text-text-primary mb-4">
                            AI Tools are <span className="animate-gradient-text">Pro Only</span>
                        </h1>
                        <p className="text-text-secondary mb-8 max-w-lg mx-auto">
                            Upgrade to Pro to access AI Career Q&A, Resume Analyzer, and Career
                            Roadmap Generator. Get personalized insights powered by advanced AI.
                        </p>
                        <a
                            href="/pricing"
                            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl gradient-primary text-white font-semibold hover:opacity-90 transition-all shadow-xl shadow-primary/25 hover-bounce"
                        >
                            <Zap className="w-5 h-5" />
                            Upgrade to Pro
                            <ArrowRight className="w-5 h-5" />
                        </a>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-surface pt-16 relative overflow-hidden">
            <GlowOrbs />
            <FloatingParticles count={15} />

            <div className="relative max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div ref={headerRef} className="mb-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-3 animate-shimmer">
                        <Sparkles className="w-4 h-4 text-primary-light animate-float-subtle" />
                        <span className="text-sm font-medium text-primary-light">AI-Powered</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-text-primary mb-2">
                        AI Career <span className="animate-gradient-text">Intelligence</span>
                    </h1>
                    <p className="text-text-secondary text-lg">
                        Get personalized career guidance, resume analysis, and roadmap generation
                    </p>
                </div>

                {/* Tabs */}
                <div ref={tabsRef} className="grid grid-cols-3 gap-4 mb-8">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`ai-tab p-4 rounded-xl border transition-all duration-300 text-left spotlight-card hover-bounce ${activeTab === tab.id
                                ? "border-primary/40 bg-primary/5 shadow-lg shadow-primary/10 animate-glow-pulse"
                                : "border-border glass hover:border-primary/20"
                                }`}
                            onMouseMove={(e) => {
                                const rect = e.currentTarget.getBoundingClientRect();
                                e.currentTarget.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
                                e.currentTarget.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
                            }}
                        >
                            <tab.icon
                                className={`w-6 h-6 mb-2 transition-all duration-300 ${activeTab === tab.id
                                    ? "text-primary-light scale-110"
                                    : "text-text-muted"
                                    }`}
                            />
                            <div className="font-semibold text-text-primary text-sm">
                                {tab.label}
                            </div>
                            <div className="text-xs text-text-muted">{tab.description}</div>
                        </button>
                    ))}
                </div>

                {/* Content with animation */}
                <div key={activeTab} className="animate-slide-up" style={{ animationDuration: "0.4s" }}>
                    {activeTab === "career-qa" && <CareerQA />}
                    {activeTab === "resume" && <ResumeAnalyser />}
                    {activeTab === "roadmap" && <RoadmapGenerator />}
                </div>
            </div>
            <Footer />
        </main>
    );
}

export default function AIToolsPage() {
    return (
        <AppProvider>
            <Navbar />
            <AIToolsContent />
        </AppProvider>
    );
}
