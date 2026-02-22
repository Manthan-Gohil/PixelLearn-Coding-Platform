"use client";

import { useState } from "react";
import { AppProvider, useApp } from "@/lib/store";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
    Brain,
    FileText,
    Rocket,
    Send,
    Loader2,
    Upload,
    ChevronRight,
    Star,
    AlertCircle,
    CheckCircle2,
    Target,
    Clock,
    Sparkles,
    ArrowRight,
    Lock,
} from "lucide-react";

type AITab = "career-qa" | "resume" | "roadmap";

interface ResumeResult {
    atsScore: number;
    overallFeedback: string;
    skillsGap: string[];
    formattingFeedback: string[];
    missingKeywords: string[];
    improvements: { section: string; suggestion: string; priority: string }[];
}

interface RoadmapStepData {
    step: number;
    title: string;
    description: string;
    duration: string;
    skills: string[];
    resources: string[];
    milestone: string;
}

function AIToolsContent() {
    const { user } = useApp();
    const [activeTab, setActiveTab] = useState<AITab>("career-qa");
    const [isLoading, setIsLoading] = useState(false);

    // Career Q&A State
    const [question, setQuestion] = useState("");
    const [careerAnswer, setCareerAnswer] = useState("");

    // Resume State
    const [resumeText, setResumeText] = useState("");
    const [resumeResult, setResumeResult] = useState<ResumeResult | null>(null);

    // Roadmap State
    const [desiredRole, setDesiredRole] = useState("");
    const [currentSkills, setCurrentSkills] = useState("");
    const [experienceLevel, setExperienceLevel] = useState("beginner");
    const [roadmapSteps, setRoadmapSteps] = useState<RoadmapStepData[]>([]);

    const isPro = user.subscription === "pro";

    async function callAI(type: string, data: Record<string, unknown>) {
        setIsLoading(true);
        try {
            const res = await fetch("/api/ai", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type, data }),
            });
            const result = await res.json();
            return result.result;
        } catch {
            return "Error: Unable to process request. Please try again.";
        } finally {
            setIsLoading(false);
        }
    }

    async function handleCareerQA() {
        if (!question.trim()) return;
        const result = await callAI("career-qa", { question });
        setCareerAnswer(result);
    }

    async function handleResumeAnalysis() {
        if (!resumeText.trim()) return;
        const result = await callAI("resume-analyze", { resumeText });
        try {
            const parsed = typeof result === "string" ? JSON.parse(result) : result;
            setResumeResult(parsed);
        } catch {
            setResumeResult({
                atsScore: 72,
                overallFeedback: result,
                skillsGap: [],
                formattingFeedback: [],
                missingKeywords: [],
                improvements: [],
            });
        }
    }

    async function handleRoadmap() {
        if (!desiredRole.trim()) return;
        const result = await callAI("roadmap", {
            desiredRole,
            currentSkills: currentSkills.split(",").map((s) => s.trim()),
            experienceLevel,
        });
        try {
            const parsed = typeof result === "string" ? JSON.parse(result) : result;
            setRoadmapSteps(Array.isArray(parsed) ? parsed : []);
        } catch {
            setRoadmapSteps([]);
        }
    }

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
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                    {/* Career Q&A */}
                    {activeTab === "career-qa" && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="glass rounded-xl p-6">
                                <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                                    <Brain className="w-5 h-5 text-primary-light" />
                                    Ask a Career Question
                                </h2>
                                <textarea
                                    value={question}
                                    onChange={(e) => setQuestion(e.target.value)}
                                    placeholder="e.g., What skills do I need to become a full-stack developer? How long will it take to transition from QA to development?"
                                    className="w-full h-40 p-4 rounded-lg bg-surface-alt border border-border text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary/50 resize-none"
                                />
                                <button
                                    onClick={handleCareerQA}
                                    disabled={isLoading || !question.trim()}
                                    className="mt-4 flex items-center gap-2 px-6 py-2.5 rounded-lg gradient-primary text-white font-medium hover:opacity-90 disabled:opacity-50 transition-all shadow-lg shadow-primary/20"
                                >
                                    {isLoading ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Send className="w-4 h-4" />
                                    )}
                                    {isLoading ? "Thinking..." : "Ask AI"}
                                </button>

                                {/* Suggested Questions */}
                                <div className="mt-6">
                                    <p className="text-xs text-text-muted mb-2">Try asking:</p>
                                    <div className="space-y-2">
                                        {[
                                            "What skills do I need for a frontend developer role?",
                                            "How to transition from non-tech to software engineering?",
                                            "Is it better to learn React or Vue.js in 2026?",
                                        ].map((q) => (
                                            <button
                                                key={q}
                                                onClick={() => setQuestion(q)}
                                                className="block w-full text-left p-2.5 rounded-lg bg-surface-hover/50 text-xs text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-colors"
                                            >
                                                <ChevronRight className="w-3 h-3 inline mr-1" />
                                                {q}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Answer */}
                            <div className="glass rounded-xl p-6">
                                <h2 className="text-lg font-semibold text-text-primary mb-4">
                                    AI Response
                                </h2>
                                {careerAnswer ? (
                                    <div className="prose prose-sm prose-invert max-w-none">
                                        {careerAnswer.split("\n").map((line, i) => {
                                            if (line.startsWith("## "))
                                                return (
                                                    <h2
                                                        key={i}
                                                        className="text-lg font-bold text-text-primary mt-4 mb-2"
                                                    >
                                                        {line.replace("## ", "")}
                                                    </h2>
                                                );
                                            if (line.startsWith("### "))
                                                return (
                                                    <h3
                                                        key={i}
                                                        className="text-base font-semibold text-text-primary mt-3 mb-1"
                                                    >
                                                        {line.replace("### ", "")}
                                                    </h3>
                                                );
                                            if (line.startsWith("- "))
                                                return (
                                                    <div key={i} className="flex items-start gap-2 text-sm text-text-secondary ml-2">
                                                        <span className="text-primary-light mt-1">•</span>
                                                        <span>{line.replace("- ", "")}</span>
                                                    </div>
                                                );
                                            if (line.match(/^\d+\.\s/))
                                                return (
                                                    <p
                                                        key={i}
                                                        className="text-sm text-text-secondary ml-2"
                                                    >
                                                        {line}
                                                    </p>
                                                );
                                            if (line.startsWith("**") && line.endsWith("**"))
                                                return (
                                                    <p
                                                        key={i}
                                                        className="text-sm font-semibold text-text-primary mt-2"
                                                    >
                                                        {line.replace(/\*\*/g, "")}
                                                    </p>
                                                );
                                            if (line.trim())
                                                return (
                                                    <p key={i} className="text-sm text-text-secondary">
                                                        {line}
                                                    </p>
                                                );
                                            return <br key={i} />;
                                        })}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-64 text-text-muted">
                                        <Brain className="w-12 h-12 mb-3 opacity-30" />
                                        <p className="text-sm">Ask a question to get started</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Resume Analyzer */}
                    {activeTab === "resume" && (
                        <div className="space-y-6">
                            <div className="glass rounded-xl p-6">
                                <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-accent" />
                                    Paste Your Resume Text
                                </h2>
                                <p className="text-sm text-text-secondary mb-4">
                                    Paste the contents of your resume below for AI-powered analysis. Get ATS score, skills gap analysis, and improvement suggestions.
                                </p>
                                <textarea
                                    value={resumeText}
                                    onChange={(e) => setResumeText(e.target.value)}
                                    placeholder="Paste your resume text here..."
                                    className="w-full h-48 p-4 rounded-lg bg-surface-alt border border-border text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary/50 resize-none font-mono text-sm"
                                />
                                <div className="flex items-center gap-4 mt-4">
                                    <button
                                        onClick={handleResumeAnalysis}
                                        disabled={isLoading || !resumeText.trim()}
                                        className="flex items-center gap-2 px-6 py-2.5 rounded-lg gradient-primary text-white font-medium hover:opacity-90 disabled:opacity-50 transition-all shadow-lg shadow-primary/20"
                                    >
                                        {isLoading ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <Upload className="w-4 h-4" />
                                        )}
                                        {isLoading ? "Analyzing..." : "Analyze Resume"}
                                    </button>
                                    <span className="text-xs text-text-muted">
                                        Your data is processed securely and not stored
                                    </span>
                                </div>
                            </div>

                            {/* Results */}
                            {resumeResult && (
                                <div className="animate-slide-up space-y-6">
                                    {/* ATS Score */}
                                    <div className="glass rounded-xl p-6">
                                        <h3 className="text-lg font-semibold text-text-primary mb-4">
                                            ATS Score
                                        </h3>
                                        <div className="flex items-center gap-8">
                                            <div className="relative w-32 h-32">
                                                <svg
                                                    className="w-full h-full -rotate-90"
                                                    viewBox="0 0 100 100"
                                                >
                                                    <circle
                                                        cx="50"
                                                        cy="50"
                                                        r="42"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="8"
                                                        className="text-surface-hover"
                                                    />
                                                    <circle
                                                        cx="50"
                                                        cy="50"
                                                        r="42"
                                                        fill="none"
                                                        stroke={
                                                            resumeResult.atsScore >= 80
                                                                ? "#10b981"
                                                                : resumeResult.atsScore >= 50
                                                                    ? "#f59e0b"
                                                                    : "#ef4444"
                                                        }
                                                        strokeWidth="8"
                                                        strokeLinecap="round"
                                                        strokeDasharray={`${2 * Math.PI * 42}`}
                                                        strokeDashoffset={`${2 * Math.PI * 42 * (1 - resumeResult.atsScore / 100)
                                                            }`}
                                                    />
                                                </svg>
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <div className="text-center">
                                                        <div className="text-3xl font-bold text-text-primary">
                                                            {resumeResult.atsScore}
                                                        </div>
                                                        <div className="text-xs text-text-muted">/100</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-text-secondary text-sm leading-relaxed">
                                                    {resumeResult.overallFeedback}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Skills Gap */}
                                        {resumeResult.skillsGap.length > 0 && (
                                            <div className="glass rounded-xl p-6">
                                                <h3 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
                                                    <Target className="w-4 h-4 text-warning" />
                                                    Skills Gap
                                                </h3>
                                                <div className="flex flex-wrap gap-2">
                                                    {resumeResult.skillsGap.map((skill, i) => (
                                                        <span
                                                            key={i}
                                                            className="px-3 py-1 rounded-full bg-warning/10 text-warning text-xs font-medium"
                                                        >
                                                            {skill}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Missing Keywords */}
                                        {resumeResult.missingKeywords.length > 0 && (
                                            <div className="glass rounded-xl p-6">
                                                <h3 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
                                                    <AlertCircle className="w-4 h-4 text-danger" />
                                                    Missing Keywords
                                                </h3>
                                                <div className="flex flex-wrap gap-2">
                                                    {resumeResult.missingKeywords.map((kw, i) => (
                                                        <span
                                                            key={i}
                                                            className="px-3 py-1 rounded-full bg-danger/10 text-danger text-xs font-medium"
                                                        >
                                                            {kw}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Improvements */}
                                    {resumeResult.improvements.length > 0 && (
                                        <div className="glass rounded-xl p-6">
                                            <h3 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
                                                <CheckCircle2 className="w-4 h-4 text-success" />
                                                Improvement Suggestions
                                            </h3>
                                            <div className="space-y-3">
                                                {resumeResult.improvements.map((imp, i) => (
                                                    <div
                                                        key={i}
                                                        className="flex items-start gap-3 p-3 rounded-lg bg-surface-alt/50 border border-border"
                                                    >
                                                        <span
                                                            className={`px-2 py-0.5 rounded text-xs font-medium shrink-0 mt-0.5 ${imp.priority === "high"
                                                                    ? "bg-danger/10 text-danger"
                                                                    : imp.priority === "medium"
                                                                        ? "bg-warning/10 text-warning"
                                                                        : "bg-success/10 text-success"
                                                                }`}
                                                        >
                                                            {imp.priority}
                                                        </span>
                                                        <div>
                                                            <div className="text-sm font-medium text-text-primary">
                                                                {imp.section}
                                                            </div>
                                                            <div className="text-xs text-text-secondary mt-0.5">
                                                                {imp.suggestion}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Formatting Feedback */}
                                    {resumeResult.formattingFeedback.length > 0 && (
                                        <div className="glass rounded-xl p-6">
                                            <h3 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
                                                <FileText className="w-4 h-4 text-primary-light" />
                                                Formatting Tips
                                            </h3>
                                            <ul className="space-y-2">
                                                {resumeResult.formattingFeedback.map((fb, i) => (
                                                    <li
                                                        key={i}
                                                        className="flex items-start gap-2 text-sm text-text-secondary"
                                                    >
                                                        <span className="text-primary-light mt-0.5">•</span>
                                                        {fb}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Career Roadmap */}
                    {activeTab === "roadmap" && (
                        <div className="space-y-6">
                            <div className="glass rounded-xl p-6">
                                <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                                    <Rocket className="w-5 h-5 text-success" />
                                    Generate Your Career Roadmap
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm text-text-secondary mb-1.5">
                                            Desired Role
                                        </label>
                                        <input
                                            type="text"
                                            value={desiredRole}
                                            onChange={(e) => setDesiredRole(e.target.value)}
                                            placeholder="e.g., Full Stack Developer"
                                            className="w-full p-3 rounded-lg bg-surface-alt border border-border text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary/50"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-text-secondary mb-1.5">
                                            Current Skills
                                        </label>
                                        <input
                                            type="text"
                                            value={currentSkills}
                                            onChange={(e) => setCurrentSkills(e.target.value)}
                                            placeholder="e.g., HTML, CSS, Python"
                                            className="w-full p-3 rounded-lg bg-surface-alt border border-border text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary/50"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-text-secondary mb-1.5">
                                            Experience Level
                                        </label>
                                        <select
                                            value={experienceLevel}
                                            onChange={(e) => setExperienceLevel(e.target.value)}
                                            className="w-full p-3 rounded-lg bg-surface-alt border border-border text-text-primary focus:outline-none focus:border-primary/50"
                                        >
                                            <option value="beginner">Beginner</option>
                                            <option value="intermediate">Intermediate</option>
                                            <option value="advanced">Advanced</option>
                                        </select>
                                    </div>
                                </div>
                                <button
                                    onClick={handleRoadmap}
                                    disabled={isLoading || !desiredRole.trim()}
                                    className="mt-4 flex items-center gap-2 px-6 py-2.5 rounded-lg gradient-primary text-white font-medium hover:opacity-90 disabled:opacity-50 transition-all shadow-lg shadow-primary/20"
                                >
                                    {isLoading ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Rocket className="w-4 h-4" />
                                    )}
                                    {isLoading ? "Generating..." : "Generate Roadmap"}
                                </button>
                            </div>

                            {/* Roadmap Steps */}
                            {roadmapSteps.length > 0 && (
                                <div className="animate-slide-up">
                                    <h3 className="text-lg font-semibold text-text-primary mb-6">
                                        Your Personalized Roadmap
                                    </h3>
                                    <div className="relative">
                                        {/* Timeline Line */}
                                        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />

                                        <div className="space-y-6">
                                            {roadmapSteps.map((step, i) => (
                                                <div key={i} className="relative flex gap-6">
                                                    {/* Timeline Dot */}
                                                    <div className="relative z-10 w-12 h-12 rounded-xl gradient-primary flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-primary/20 shrink-0">
                                                        {step.step}
                                                    </div>

                                                    {/* Content */}
                                                    <div className="flex-1 glass rounded-xl p-6 hover:border-primary/20 transition-all">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <h4 className="text-lg font-semibold text-text-primary">
                                                                {step.title}
                                                            </h4>
                                                            <span className="flex items-center gap-1 text-xs text-text-muted">
                                                                <Clock className="w-3 h-3" />
                                                                {step.duration}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-text-secondary mb-4">
                                                            {step.description}
                                                        </p>

                                                        {/* Skills */}
                                                        <div className="mb-3">
                                                            <div className="text-xs font-medium text-text-muted mb-1.5">
                                                                Skills to Learn
                                                            </div>
                                                            <div className="flex flex-wrap gap-1.5">
                                                                {step.skills.map((skill, j) => (
                                                                    <span
                                                                        key={j}
                                                                        className="px-2 py-0.5 rounded bg-primary/10 text-primary-light text-xs font-medium"
                                                                    >
                                                                        {skill}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>

                                                        {/* Resources */}
                                                        <div className="mb-3">
                                                            <div className="text-xs font-medium text-text-muted mb-1.5">
                                                                Resources
                                                            </div>
                                                            <div className="flex flex-wrap gap-1.5">
                                                                {step.resources.map((resource, j) => (
                                                                    <span
                                                                        key={j}
                                                                        className="px-2 py-0.5 rounded bg-accent/10 text-accent text-xs"
                                                                    >
                                                                        {resource}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>

                                                        {/* Milestone */}
                                                        <div className="p-3 rounded-lg bg-success/5 border border-success/20 flex items-start gap-2">
                                                            <Star className="w-4 h-4 text-success mt-0.5 shrink-0" />
                                                            <div>
                                                                <div className="text-xs font-medium text-success">
                                                                    Milestone
                                                                </div>
                                                                <div className="text-xs text-text-secondary">
                                                                    {step.milestone}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
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
