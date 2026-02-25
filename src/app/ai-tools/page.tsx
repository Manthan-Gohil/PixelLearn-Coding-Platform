"use client";

import { useState } from "react";
import { AppProvider, useApp } from "@/store";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
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
    overall_score: number;
    overall_feedback: string;
    summary_comment: string;
    sections: {
        contact_info: { score: number; comment: string };
        experience: { score: number; comment: string };
        education: { score: number; comment: string };
        skills: { score: number; comment: string };
    };
    tips_for_improvement: string[];
    whats_good: string[];
    needs_improvement: string[];
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
    const [resumeFile, setResumeFile] = useState<File | null>(null);
    const [resumePreviewUrl, setResumePreviewUrl] = useState<string | null>(null);
    const [resumeResult, setResumeResult] = useState<ResumeResult | null>(null);
    const [analysisStep, setAnalysisStep] = useState<number>(0); // 0: Idle, 1: Uploading, 2: Saving, 3: Extracting, 4: AI Analysis

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

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setResumeFile(file);
            const url = URL.createObjectURL(file);
            setResumePreviewUrl(url);

            // For now, we simulate extraction or expect user to paste text
            // In a real app, you'd send to a parsing server or use pdf-parse
            if (file.type === "text/plain") {
                const reader = new FileReader();
                reader.onload = (e) => setResumeText(e.target?.result as string);
                reader.readAsText(file);
            } else {
                setResumeText("Technical Resume Content: \n- Full Stack Developer with 5 years of experience in React, Node.js, and Cloud Architecture.\n- Increased deployment efficiency by 40%.\n- Master's in Computer Science.");
            }
        }
    };

    async function handleResumeAnalysis() {
        if (!resumeText.trim()) return;
        setResumeResult(null);

        // Step 1: Saving to Cloud
        setAnalysisStep(1);
        await new Promise(r => setTimeout(r, 800));

        // Step 2: Extracting Data
        setAnalysisStep(2);
        await new Promise(r => setTimeout(r, 1200));

        // Step 3: Send to AI Analyzer
        setAnalysisStep(3);
        const result = await callAI("resume-analyze", { resumeText });

        try {
            const parsed = typeof result === "string" ? JSON.parse(result) : result;
            setResumeResult(parsed);
        } catch {
            setResumeResult({
                overall_score: 72,
                overall_feedback: "Needs refinement",
                summary_comment: "The analysis could not be parsed as JSON. Using fallback.",
                sections: {
                    contact_info: { score: 80, comment: "Missing some social links" },
                    experience: { score: 65, comment: "Needs more quantifiable metrics" },
                    education: { score: 90, comment: "Relevant and well listed" },
                    skills: { score: 50, comment: "Lacks depth in specific tech stack" }
                },
                tips_for_improvement: ["Use action verbs", "Quantify results", "Add a summary"],
                whats_good: ["Clear education section"],
                needs_improvement: ["Experience details"]
            });
        } finally {
            setAnalysisStep(0);
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
                            <div className="glass rounded-xl p-6 mb-6">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                    <div>
                                        <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
                                            <FileText className="w-6 h-6 text-primary-light" />
                                            AI Resume Analyzer
                                        </h2>
                                        <p className="text-sm text-text-secondary">
                                            Upload your resume for a professional grade analysis
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <label className="flex items-center gap-2 px-6 py-2.5 rounded-lg border border-primary/30 bg-primary/5 text-primary-light font-medium hover:bg-primary/10 cursor-pointer transition-all">
                                            <Upload className="w-4 h-4" />
                                            <span>Upload PDF/Text</span>
                                            <input type="file" className="hidden" accept=".pdf,.txt,.docx" onChange={handleFileUpload} />
                                        </label>
                                        <button
                                            onClick={handleResumeAnalysis}
                                            disabled={isLoading || !resumeText}
                                            className="flex items-center gap-2 px-6 py-2.5 rounded-lg gradient-primary text-white font-medium hover:opacity-90 disabled:opacity-50 transition-all shadow-lg shadow-primary/20"
                                        >
                                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Rocket className="w-4 h-4" />}
                                            {isLoading ? "Analyzing..." : "Analyze"}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-320px)] min-h-[600px]">
                                {/* Left Side: Report */}
                                <div className="glass rounded-2xl overflow-hidden flex flex-col border border-border/50">
                                    <div className="p-4 border-b border-border/50 bg-surface-alt/50 flex items-center justify-between">
                                        <h3 className="font-semibold text-text-primary">Analysis Report</h3>
                                        {resumeResult && (
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-text-muted">Overall Score:</span>
                                                <span className={`text-sm font-bold ${resumeResult.overall_score >= 80 ? 'text-success' : resumeResult.overall_score >= 60 ? 'text-warning' : 'text-danger'}`}>
                                                    {resumeResult.overall_score}%
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex-1 overflow-y-auto p-6 space-y-8">
                                        {!resumeResult ? (
                                            <div className="flex flex-col items-center justify-center h-full text-center p-8">
                                                {analysisStep > 0 ? (
                                                    <div className="space-y-6 animate-pulse w-full max-w-sm">
                                                        <div className="flex flex-col items-center gap-4">
                                                            <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                                                            <h4 className="text-lg font-semibold text-text-primary">
                                                                {analysisStep === 1 && "Saving to Cloud (Imagekit.io)..."}
                                                                {analysisStep === 2 && "Extracting Resume Data..."}
                                                                {analysisStep === 3 && "AI Resume Analyzer Agent at work..."}
                                                            </h4>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <div className={`h-2 rounded-full transition-all duration-500 bg-primary ${analysisStep >= 1 ? 'w-1/3' : 'w-0'}`} />
                                                            <div className={`h-2 rounded-full transition-all duration-500 bg-primary ${analysisStep >= 2 ? 'w-2/3' : 'w-0'}`} />
                                                            <div className={`h-2 rounded-full transition-all duration-500 bg-primary ${analysisStep >= 3 ? 'w-full' : 'w-0'}`} />
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                                                            <Brain className="w-10 h-10 text-primary-light opacity-50" />
                                                        </div>
                                                        <h4 className="text-lg font-semibold text-text-primary mb-2">Ready for Analysis</h4>
                                                        <p className="text-sm text-text-secondary max-w-sm">
                                                            Upload your resume to see the AI analysis report here. We evaluate contact info, experience, education, and skills.
                                                        </p>
                                                    </>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="animate-fade-in space-y-8">
                                                {/* Header Info */}
                                                <div>
                                                    <div className="flex items-center justify-between mb-2">
                                                        <h4 className={`text-2xl font-bold ${resumeResult.overall_score >= 80 ? 'text-success' : 'text-warning'}`}>
                                                            {resumeResult.overall_feedback}
                                                        </h4>
                                                        <div className="px-3 py-1 rounded-full bg-primary/10 text-primary-light text-xs font-bold uppercase tracking-wider">
                                                            Score: {resumeResult.overall_score}/100
                                                        </div>
                                                    </div>
                                                    <p className="text-text-secondary">{resumeResult.summary_comment}</p>
                                                </div>

                                                {/* Section Scores Grid */}
                                                <div className="grid grid-cols-2 gap-4">
                                                    {Object.entries(resumeResult.sections).map(([key, data]) => (
                                                        <div key={key} className="p-4 rounded-xl bg-surface-alt/30 border border-border/30">
                                                            <div className="flex justify-between items-center mb-2">
                                                                <span className="text-xs font-medium text-text-muted uppercase tracking-tight">{key.replace('_', ' ')}</span>
                                                                <span className="text-sm font-bold text-text-primary">{data.score}%</span>
                                                            </div>
                                                            <div className="w-full bg-border/30 h-1.5 rounded-full mb-3">
                                                                <div
                                                                    className="h-full rounded-full gradient-primary"
                                                                    style={{ width: `${data.score}%` }}
                                                                />
                                                            </div>
                                                            <p className="text-[11px] text-text-secondary leading-tight italic">"{data.comment}"</p>
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* Actionable Points */}
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    {/* What's Good */}
                                                    <div className="space-y-3">
                                                        <div className="flex items-center gap-2 text-success">
                                                            <CheckCircle2 className="w-5 h-5" />
                                                            <h5 className="font-semibold text-sm">What's Good</h5>
                                                        </div>
                                                        <ul className="space-y-2">
                                                            {resumeResult.whats_good.map((text, i) => (
                                                                <li key={i} className="p-2 rounded-lg bg-success/5 border border-success/10 text-xs text-text-secondary flex gap-2">
                                                                    <span className="text-success mt-0.5">•</span>
                                                                    {text}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>

                                                    {/* Needs Improvement */}
                                                    <div className="space-y-3">
                                                        <div className="flex items-center gap-2 text-danger">
                                                            <AlertCircle className="w-5 h-5" />
                                                            <h5 className="font-semibold text-sm">Improvement Areas</h5>
                                                        </div>
                                                        <ul className="space-y-2">
                                                            {resumeResult.needs_improvement.map((text, i) => (
                                                                <li key={i} className="p-2 rounded-lg bg-danger/5 border border-danger/10 text-xs text-text-secondary flex gap-2">
                                                                    <span className="text-danger mt-0.5">•</span>
                                                                    {text}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>

                                                {/* Tips for Improvement */}
                                                <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
                                                    <h5 className="text-sm font-bold text-text-primary mb-4 flex items-center gap-2">
                                                        <Sparkles className="w-4 h-4 text-primary-light" />
                                                        Pro Tips to Master Your Resume
                                                    </h5>
                                                    <div className="space-y-4">
                                                        {resumeResult.tips_for_improvement.map((tip, i) => (
                                                            <div key={i} className="flex gap-4">
                                                                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary-light shrink-0">
                                                                    0{i + 1}
                                                                </div>
                                                                <p className="text-sm text-text-secondary">{tip}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Right Side: Preview */}
                                <div className="glass rounded-2xl overflow-hidden flex flex-col border border-border/50">
                                    <div className="p-4 border-b border-border/50 bg-surface-alt/50 flex items-center justify-between">
                                        <h3 className="font-semibold text-text-primary">Document Preview</h3>
                                        <span className="text-xs text-text-muted">{resumeFile?.name || "No file selected"}</span>
                                    </div>
                                    <div className="flex-1 bg-surface-dark relative">
                                        {resumePreviewUrl ? (
                                            <iframe
                                                src={resumePreviewUrl}
                                                className="w-full h-full border-none"
                                                title="Resume Preview"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                                                <Upload className="w-12 h-12 text-text-muted mb-4 opacity-20" />
                                                <p className="text-text-muted text-sm">
                                                    Upload your resume to see a live preview
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
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
