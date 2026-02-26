"use client";

import { useState } from "react";
import { AppProvider, useApp } from "@/store";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
    Brain,
    FileText,
    Rocket,
    Sparkles,
    ArrowRight,
    Lock,
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

    const tabs = [
        { id: "career-qa" as AITab, label: "Career Q&A", icon: Brain, description: "Ask career questions" },
        { id: "resume" as AITab, label: "Resume Analyzer", icon: FileText, description: "Analyze your resume" },
        { id: "roadmap" as AITab, label: "Career Roadmap", icon: Rocket, description: "Generate a roadmap" },
    ];

    if (!isPro) {
        return (
            <main className="min-h-screen bg-surface pt-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
                    <div className="glass rounded-2xl p-12">
                        <Lock className="w-16 h-16 text-primary-light mx-auto mb-6" />
                        <h1 className="text-3xl font-bold text-text-primary mb-4">
                            AI Tools are <span className="gradient-text">Pro Only</span>
                        </h1>
                        <p className="text-text-secondary mb-8 max-w-lg mx-auto">
                            Upgrade to Pro to access AI Career Q&A, Resume Analyzer, and Career
                            Roadmap Generator. Get personalized insights powered by advanced AI.
                        </p>
                        <a
                            href="/pricing"
                            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl gradient-primary text-white font-semibold hover:opacity-90 transition-all shadow-xl shadow-primary/25"
                        >
                            Upgrade to Pro
                            <ArrowRight className="w-5 h-5" />
                        </a>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-surface pt-16">
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-3">
                        <Sparkles className="w-4 h-4 text-primary-light" />
                        <span className="text-sm font-medium text-primary-light">AI-Powered</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-text-primary mb-2">
                        AI Career <span className="gradient-text">Intelligence</span>
                    </h1>
                    <p className="text-text-secondary text-lg">
                        Get personalized career guidance, resume analysis, and roadmap generation
                    </p>
                </div>

                {/* Tabs */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`p-4 rounded-xl border transition-all text-left ${activeTab === tab.id
                                ? "border-primary/40 bg-primary/5 shadow-lg shadow-primary/10"
                                : "border-border glass hover:border-primary/20"
                                }`}
                        >
                            <tab.icon
                                className={`w-6 h-6 mb-2 ${activeTab === tab.id ? "text-primary-light" : "text-text-muted"
                                    }`}
                            />
                            <div className="font-semibold text-text-primary text-sm">
                                {tab.label}
                            </div>
                            <div className="text-xs text-text-muted">{tab.description}</div>
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="animate-fade-in">
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
