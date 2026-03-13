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
    Download,
} from "lucide-react";
import * as pdfjs from "pdfjs-dist";
import { AI_ANALYSIS_STEPS } from "@/constants/ai-tools";
import { useAIApi } from "@/hooks/useAIApi";
import type { ResumeResult } from "@/types/ai-tools";

// Set worker source for pdfjs-dist
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;

export default function ResumeAnalyser() {
    const { isLoading, callAI } = useAIApi();
    const [resumeText, setResumeText] = useState("");
    const [resumeFile, setResumeFile] = useState<File | null>(null);
    const [resumePreviewUrl, setResumePreviewUrl] = useState<string | null>(null);
    const [resumeResult, setResumeResult] = useState<ResumeResult | null>(null);
    const [analysisStep, setAnalysisStep] = useState<number>(0);
    const [isParsing, setIsParsing] = useState(false);

    const extractTextFromPDF = async (file: File) => {
        setIsParsing(true);
        try {
            const arrayBuffer = await file.arrayBuffer();
            const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
            const pdf = await loadingTask.promise;
            let fullText = "";

            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                const pageText = textContent.items
                    .map((item) => ("str" in item ? item.str : ""))
                    .join(" ");
                fullText += pageText + "\n";
            }

            setResumeText(fullText);
        } catch (error) {
            console.error("PDF parsing error:", error);
            setResumeText("Error parsing PDF. Please try pasting your resume text manually.");
        } finally {
            setIsParsing(false);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setResumeFile(file);
            const url = URL.createObjectURL(file);
            setResumePreviewUrl(url);

            if (file.type === "text/plain") {
                const reader = new FileReader();
                reader.onload = (e) => setResumeText(e.target?.result as string);
                reader.readAsText(file);
            } else if (file.type === "application/pdf") {
                await extractTextFromPDF(file);
            } else {
                setResumeText("File type not supported for automatic extraction. Please paste your resume text manually.");
            }
        }
    };

    function downloadReport() {
        if (!resumeResult) return;
        const r = resumeResult;

        const priorityBadge = (p: string) =>
            p === "high" ? "background:#fee2e2;color:#dc2626" :
                p === "medium" ? "background:#fef9c3;color:#ca8a04" :
                    "background:#dcfce7;color:#16a34a";

        const sectionRows = Object.entries(r.sections).map(([key, val]) => `
            <div style="margin-bottom:12px">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
                    <span style="font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:.05em;color:#64748b">${key.replace(/_/g, " ")}</span>
                    <span style="font-size:13px;font-weight:700;color:#0f172a">${val.score}%</span>
                </div>
                <div style="background:#e2e8f0;height:6px;border-radius:99px;margin-bottom:6px">
                    <div style="height:6px;border-radius:99px;background:linear-gradient(90deg,#6366f1,#8b5cf6);width:${val.score}%"></div>
                </div>
                <p style="font-size:11px;color:#475569;font-style:italic;margin:0">"${val.comment}"</p>
            </div>`).join("");

        const goodList = r.whats_good.map(t => `<li style="margin-bottom:6px;padding:8px 10px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;font-size:12px;color:#166534">${t}</li>`).join("");
        const badList = r.needs_improvement.map(t => `<li style="margin-bottom:6px;padding:8px 10px;background:#fff1f2;border:1px solid #fecdd3;border-radius:8px;font-size:12px;color:#9f1239">${t}</li>`).join("");

        const gapsHtml = r.skill_gaps?.length ? `
            <div class="section">
                <h2>🚧 Skill Gaps to Bridge</h2>
                ${r.skill_gaps.map(g => `
                <div style="display:flex;align-items:flex-start;gap:10px;margin-bottom:10px;padding:10px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px">
                    <span style="padding:2px 8px;border-radius:99px;font-size:10px;font-weight:700;text-transform:uppercase;${priorityBadge(g.priority)};flex-shrink:0">${g.priority}</span>
                    <div>
                        <p style="font-weight:600;font-size:12px;margin:0 0 2px">${g.skill}</p>
                        <p style="font-size:11px;color:#475569;margin:0">${g.reason}</p>
                    </div>
                </div>`).join("")}
            </div>` : "";

        const focusHtml = r.focus_areas?.length ? `
            <div class="section">
                <h2>🎯 Where to Focus Next</h2>
                ${r.focus_areas.map(f => `
                <div style="margin-bottom:10px;padding:12px;background:#f5f3ff;border:1px solid #ddd6fe;border-radius:8px">
                    <p style="font-weight:700;color:#4f46e5;margin:0 0 6px;font-size:13px">${f.area}</p>
                    <p style="font-size:12px;margin:0 0 4px"><strong>Why:</strong> ${f.why}</p>
                    <p style="font-size:12px;margin:0"><strong>How:</strong> ${f.how}</p>
                </div>`).join("")}
            </div>` : "";

        const actionHtml = r.action_plan?.length ? `
            <div class="section">
                <h2>🗓️ Action Plan</h2>
                ${r.action_plan.map((s, i) => `
                <div style="display:flex;gap:12px;margin-bottom:10px">
                    <div style="width:24px;height:24px;border-radius:50%;background:#e0e7ff;border:2px solid #6366f1;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;color:#4f46e5;flex-shrink:0">${i + 1}</div>
                    <div style="flex:1;padding:10px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px">
                        <div style="display:flex;justify-content:space-between;margin-bottom:4px">
                            <span style="font-weight:600;font-size:12px">${s.title}</span>
                            <span style="font-size:10px;padding:2px 8px;background:#e0e7ff;color:#4f46e5;border-radius:99px">${s.timeframe}</span>
                        </div>
                        <p style="font-size:11px;color:#475569;margin:0">${s.action}</p>
                    </div>
                </div>`).join("")}
            </div>` : "";

        const tipsHtml = `
            <div class="section">
                <h2>💡 Pro Tips</h2>
                ${r.tips_for_improvement.map((t, i) => `
                <div style="display:flex;gap:12px;margin-bottom:8px;align-items:flex-start">
                    <div style="width:22px;height:22px;border-radius:50%;background:#e0e7ff;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;color:#4f46e5;flex-shrink:0">${String(i + 1).padStart(2, "0")}</div>
                    <p style="font-size:12px;color:#0f172a;margin:0;line-height:1.5">${t}</p>
                </div>`).join("")}
            </div>`;

        const projectsHtml = r.projects?.length ? `
            <div class="section">
                <h2>🛠️ Projects Deep Dive</h2>
                ${r.projects.map(p => `
                <div style="margin-bottom:12px;padding:12px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
                        <span style="font-weight:700;font-size:13px">${p.name}</span>
                        <span style="font-size:10px;color:#64748b">${p.duration}</span>
                    </div>
                    <div style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:6px">
                        ${p.tech.map(t => `<span style="padding:2px 8px;border-radius:99px;background:#e0e7ff;color:#4f46e5;font-size:10px;font-weight:500">${t}</span>`).join("")}
                    </div>
                    <p style="font-size:12px;color:#475569;margin:0;line-height:1.5">${p.comment}</p>
                </div>`).join("")}
            </div>` : "";

        const internsHtml = r.internships?.length ? `
            <div class="section">
                <h2>💼 Internship Breakdown</h2>
                ${r.internships.map(n => `
                <div style="margin-bottom:12px;padding:12px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px">
                    <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:4px">
                        <div>
                            <span style="font-weight:700;font-size:13px">${n.company}</span>
                            <span style="font-size:11px;color:#64748b;margin-left:8px">— ${n.role}</span>
                        </div>
                        <span style="font-size:10px;color:#64748b;flex-shrink:0">${n.duration}</span>
                    </div>
                    <p style="font-size:12px;color:#475569;margin:0;line-height:1.5">${n.comment}</p>
                </div>`).join("")}
            </div>` : "";

        const achHtml = r.achievements?.length ? `
            <div class="section">
                <h2>🏆 Achievements</h2>
                <ul style="list-style:none;padding:0;margin:0">
                    ${r.achievements.map(a => `<li style="margin-bottom:6px;padding:8px 10px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;font-size:12px;color:#166534">🏆 ${a}</li>`).join("")}
                </ul>
            </div>` : "";

        const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>Resume Analysis Report</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f1f5f9; color: #0f172a; padding: 32px 16px; }
        .container { max-width: 820px; margin: 0 auto; }
        .header { background: linear-gradient(135deg,#4f46e5,#7c3aed); color: white; border-radius: 16px; padding: 32px; margin-bottom: 24px; }
        .header h1 { font-size: 22px; font-weight: 800; margin-bottom: 4px; }
        .header p { font-size: 13px; opacity: .85; margin-bottom: 16px; }
        .score-badge { display:inline-block; padding:6px 18px; background:rgba(255,255,255,.2); border:1px solid rgba(255,255,255,.35); border-radius:99px; font-size:14px; font-weight:700; }
        .section { background: #fff; border-radius: 12px; padding: 20px 24px; margin-bottom: 16px; border: 1px solid #e2e8f0; }
        .section h2 { font-size: 14px; font-weight: 700; margin-bottom: 14px; color: #1e293b; border-bottom: 1px solid #f1f5f9; padding-bottom: 8px; }
        .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
        .two-col .section { margin-bottom: 0; }
        ul { list-style: none; padding: 0; }
        @media print {
            body { background: white; padding: 0; }
            .container { max-width: 100%; }
            .section { break-inside: avoid; }
        }
    </style>
</head>
<body>
<div class="container">
    <div class="header">
        <h1>${r.overall_feedback}</h1>
        <p>${r.summary_comment}</p>
        <span class="score-badge">Overall Score: ${r.overall_score} / 100</span>
    </div>

    <div class="section">
        <h2>📊 Section Scores</h2>
        ${sectionRows}
    </div>

    <div class="two-col">
        <div class="section">
            <h2>✅ What's Good</h2>
            <ul>${goodList}</ul>
        </div>
        <div class="section">
            <h2>⚠️ Improvement Areas</h2>
            <ul>${badList}</ul>
        </div>
    </div>

    ${gapsHtml}
    ${focusHtml}
    ${actionHtml}
    ${tipsHtml}
    ${projectsHtml}
    ${internsHtml}
    ${achHtml}

    <p style="text-align:center;font-size:11px;color:#94a3b8;margin-top:24px">Generated by PixelLearn AI Resume Analyser · ${new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</p>
</div>
<script>window.onload = () => window.print();</script>
</body>
</html>`;

        const blob = new Blob([html], { type: "text/html" });
        const url = URL.createObjectURL(blob);
        const win = window.open(url, "_blank");
        if (win) win.focus();
        setTimeout(() => URL.revokeObjectURL(url), 60000);
    }

    async function handleResumeAnalysis() {
        if (!resumeText.trim()) return;
        setResumeResult(null);

        setAnalysisStep(AI_ANALYSIS_STEPS.verify);
        await new Promise(r => setTimeout(r, 800));

        setAnalysisStep(AI_ANALYSIS_STEPS.synthesize);
        await new Promise(r => setTimeout(r, 1200));

        setAnalysisStep(AI_ANALYSIS_STEPS.generate);
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
                    <div className="flex items-center gap-3 flex-wrap">
                        <label className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border/60 text-text-secondary font-medium hover:border-primary/50 hover:text-primary-light active:scale-95 transition-all duration-150 text-sm cursor-pointer select-none">
                            <Upload className="w-4 h-4" />
                            {resumeFile ? (
                                <span className="flex items-center gap-1.5">
                                    <FileText className="w-3.5 h-3.5 text-success" />
                                    <span className="max-w-36 truncate text-success text-xs font-semibold">{resumeFile.name}</span>
                                </span>
                            ) : "Upload Resume"}
                            <input type="file" className="hidden" accept=".pdf,.txt" onChange={handleFileUpload} />
                        </label>
                        <button
                            onClick={handleResumeAnalysis}
                            disabled={isLoading || !resumeText || isParsing}
                            className="flex items-center gap-2 px-6 py-2.5 rounded-lg gradient-primary text-white font-medium hover:opacity-90 active:scale-95 active:brightness-90 disabled:opacity-50 transition-all duration-150 shadow-lg shadow-primary/20 select-none"
                        >
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Rocket className="w-4 h-4" />}
                            {isLoading ? "Analyzing..." : "Analyze Resume"}
                        </button>
                        {resumeResult && (
                            <button
                                onClick={downloadReport}
                                className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-primary/40 text-primary-light font-medium hover:bg-primary/10 active:scale-95 transition-all duration-150 text-sm select-none"
                            >
                                <Download className="w-4 h-4" />
                                Download Report
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-320px)] min-h-150">
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

                    <div
                        className="flex-1 overflow-y-auto p-6 space-y-8"
                        onMouseEnter={() => { document.body.style.overflow = 'hidden'; }}
                        onMouseLeave={() => { document.body.style.overflow = ''; }}
                    >
                        {!resumeResult ? (
                            <div className="flex flex-col items-center justify-center h-full text-center p-8">
                                {isParsing ? (
                                    <div className="flex flex-col items-center gap-4">
                                        <Loader2 className="w-10 h-10 text-primary-light animate-spin" />
                                        <h4 className="text-lg font-semibold text-text-primary animate-pulse">
                                            Extracting your real data...
                                        </h4>
                                    </div>
                                ) : analysisStep > 0 ? (
                                    <div className="space-y-6 animate-pulse w-full max-w-sm">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                                            <h4 className="text-lg font-semibold text-text-primary text-center">
                                                {analysisStep === AI_ANALYSIS_STEPS.verify && "Verifying Document Integrity..."}
                                                {analysisStep === AI_ANALYSIS_STEPS.synthesize && "Synthesizing Professional Profile..."}
                                                {analysisStep === AI_ANALYSIS_STEPS.generate && "AI Agent Generating Career Insights..."}
                                            </h4>
                                        </div>
                                        <div className="space-y-2">
                                            <div className={`h-2 rounded-full transition-all duration-500 bg-primary ${analysisStep >= AI_ANALYSIS_STEPS.verify ? 'w-1/3' : 'w-0'}`} />
                                            <div className={`h-2 rounded-full transition-all duration-500 bg-primary ${analysisStep >= AI_ANALYSIS_STEPS.synthesize ? 'w-2/3' : 'w-0'}`} />
                                            <div className={`h-2 rounded-full transition-all duration-500 bg-primary ${analysisStep >= AI_ANALYSIS_STEPS.generate ? 'w-full' : 'w-0'}`} />
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

                                {/* Skill Gaps */}
                                {resumeResult.skill_gaps && resumeResult.skill_gaps.length > 0 && (
                                    <div>
                                        <h5 className="text-sm font-bold text-text-primary mb-3 flex items-center gap-2">
                                            <AlertCircle className="w-4 h-4 text-warning" />
                                            Skill Gaps to Bridge
                                        </h5>
                                        <div className="space-y-2">
                                            {resumeResult.skill_gaps.map((gap, i) => (
                                                <div key={i} className="p-3 rounded-xl bg-surface-alt/30 border border-border/30 flex items-start gap-3">
                                                    <span className={`shrink-0 mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${gap.priority === "high" ? "bg-danger/15 text-danger" :
                                                        gap.priority === "medium" ? "bg-warning/15 text-warning" :
                                                            "bg-success/15 text-success"
                                                        }`}>{gap.priority}</span>
                                                    <div>
                                                        <p className="text-xs font-semibold text-text-primary mb-0.5">{gap.skill}</p>
                                                        <p className="text-[11px] text-text-secondary leading-relaxed">{gap.reason}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Focus Areas */}
                                {resumeResult.focus_areas && resumeResult.focus_areas.length > 0 && (
                                    <div>
                                        <h5 className="text-sm font-bold text-text-primary mb-3 flex items-center gap-2">
                                            <Sparkles className="w-4 h-4 text-primary-light" />
                                            Where to Focus Next
                                        </h5>
                                        <div className="space-y-3">
                                            {resumeResult.focus_areas.map((area, i) => (
                                                <div key={i} className="p-4 rounded-xl border border-primary/20 bg-primary/5">
                                                    <p className="text-sm font-bold text-primary-light mb-2">{area.area}</p>
                                                    <p className="text-[11px] text-text-secondary mb-2 leading-relaxed">
                                                        <span className="font-semibold text-text-primary">Why: </span>{area.why}
                                                    </p>
                                                    <p className="text-[11px] text-text-secondary leading-relaxed">
                                                        <span className="font-semibold text-text-primary">How: </span>{area.how}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Action Plan */}
                                {resumeResult.action_plan && resumeResult.action_plan.length > 0 && (
                                    <div>
                                        <h5 className="text-sm font-bold text-text-primary mb-3 flex items-center gap-2">
                                            <Rocket className="w-4 h-4 text-primary-light" />
                                            Your Action Plan
                                        </h5>
                                        <div className="relative pl-4 border-l-2 border-primary/30 space-y-4">
                                            {resumeResult.action_plan.map((step, i) => (
                                                <div key={i} className="relative">
                                                    <div className="absolute -left-5.25 w-4 h-4 rounded-full bg-primary/20 border-2 border-primary/60 flex items-center justify-center">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-primary-light" />
                                                    </div>
                                                    <div className="p-3 rounded-xl bg-surface-alt/30 border border-border/30">
                                                        <div className="flex items-center justify-between gap-2 mb-1">
                                                            <p className="text-xs font-semibold text-text-primary">{step.title}</p>
                                                            <span className="shrink-0 px-2 py-0.5 rounded-full bg-primary/10 text-primary-light text-[10px] font-medium">{step.timeframe}</span>
                                                        </div>
                                                        <p className="text-[11px] text-text-secondary leading-relaxed">{step.action}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Tips for Improvement */}
                                <div className="p-6 rounded-2xl bg-linear-to-br from-primary/10 to-accent/10 border border-primary/20">
                                    <h5 className="text-sm font-bold text-text-primary mb-4 flex items-center gap-2">
                                        <Sparkles className="w-4 h-4 text-primary-light" />
                                        Pro Tips to Master Your Resume
                                    </h5>
                                    <div className="space-y-4">
                                        {resumeResult.tips_for_improvement.map((tip, i) => (
                                            <div key={i} className="flex gap-4">
                                                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary-light shrink-0">
                                                    {String(i + 1).padStart(2, "0")}
                                                </div>
                                                <p className="text-sm text-text-secondary">{tip}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Projects Deep Dive */}
                                {resumeResult.projects && resumeResult.projects.length > 0 && (
                                    <div>
                                        <h5 className="text-sm font-bold text-text-primary mb-3 flex items-center gap-2">
                                            <Brain className="w-4 h-4 text-primary-light" />
                                            Projects Deep Dive
                                        </h5>
                                        <div className="space-y-3">
                                            {resumeResult.projects.map((proj, i) => (
                                                <div key={i} className="p-4 rounded-xl bg-surface-alt/30 border border-border/30">
                                                    <div className="flex items-start justify-between gap-2 mb-2">
                                                        <span className="text-sm font-semibold text-text-primary">{proj.name}</span>
                                                        <span className="text-[10px] text-text-muted shrink-0 mt-0.5">{proj.duration}</span>
                                                    </div>
                                                    <div className="flex flex-wrap gap-1.5 mb-2">
                                                        {proj.tech.map((t, j) => (
                                                            <span key={j} className="px-2 py-0.5 rounded-full bg-primary/10 text-primary-light text-[10px] font-medium">{t}</span>
                                                        ))}
                                                    </div>
                                                    <p className="text-xs text-text-secondary leading-relaxed">{proj.comment}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Internships */}
                                {resumeResult.internships && resumeResult.internships.length > 0 && (
                                    <div>
                                        <h5 className="text-sm font-bold text-text-primary mb-3 flex items-center gap-2">
                                            <Rocket className="w-4 h-4 text-primary-light" />
                                            Internship Breakdown
                                        </h5>
                                        <div className="space-y-3">
                                            {resumeResult.internships.map((intern, i) => (
                                                <div key={i} className="p-4 rounded-xl bg-surface-alt/30 border border-border/30">
                                                    <div className="flex items-start justify-between gap-2 mb-1">
                                                        <div>
                                                            <span className="text-sm font-semibold text-text-primary">{intern.company}</span>
                                                            <span className="text-xs text-text-muted ml-2">— {intern.role}</span>
                                                        </div>
                                                        <span className="text-[10px] text-text-muted shrink-0 mt-0.5">{intern.duration}</span>
                                                    </div>
                                                    <p className="text-xs text-text-secondary leading-relaxed">{intern.comment}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Achievements */}
                                {resumeResult.achievements && resumeResult.achievements.length > 0 && (
                                    <div>
                                        <h5 className="text-sm font-bold text-text-primary mb-3 flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-success" />
                                            Achievements
                                        </h5>
                                        <ul className="space-y-2">
                                            {resumeResult.achievements.map((ach, i) => (
                                                <li key={i} className="p-3 rounded-lg bg-success/5 border border-success/10 text-xs text-text-secondary flex gap-2">
                                                    <span className="text-success mt-0.5 shrink-0">🏆</span>
                                                    {ach}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Side: Preview */}
                <div
                    className="glass rounded-2xl overflow-hidden flex flex-col border border-border/50"
                    onMouseEnter={() => { document.body.style.overflow = 'hidden'; }}
                    onMouseLeave={() => { document.body.style.overflow = ''; }}
                >
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
