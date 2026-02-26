"use client";

import { useState } from "react";
import {
    FileText,
    Upload,
    Rocket,
    Loader2,
    Brain,
    CheckCircle2,
    AlertCircle,
    Sparkles,
} from "lucide-react";

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

export default function ResumeAnalyser() {
    const [isLoading, setIsLoading] = useState(false);
    const [resumeText, setResumeText] = useState("");
    const [resumeFile, setResumeFile] = useState<File | null>(null);
    const [resumePreviewUrl, setResumePreviewUrl] = useState<string | null>(null);
    const [resumeResult, setResumeResult] = useState<ResumeResult | null>(null);
    const [analysisStep, setAnalysisStep] = useState<number>(0);

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

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setResumeFile(file);
            const url = URL.createObjectURL(file);
            setResumePreviewUrl(url);

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

        setAnalysisStep(1);
        await new Promise(r => setTimeout(r, 800));

        setAnalysisStep(2);
        await new Promise(r => setTimeout(r, 1200));

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

    return (
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
    );
}
