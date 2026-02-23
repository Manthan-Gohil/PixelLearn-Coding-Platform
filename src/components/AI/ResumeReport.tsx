"use client";

import { Target, AlertCircle, TrendingUp, Zap } from "lucide-react";

interface ResumeResult {
  atsScore: number;
  overallFeedback: string;
  skillsGap: string[];
  formattingFeedback: string[];
  missingKeywords: string[];
  improvements: Array<{
    section: string;
    suggestion: string;
    priority: "high" | "medium" | "low";
  }>;
}

interface ResumeReportProps {
  result: ResumeResult;
  fileName?: string;
}

export default function ResumeReport({ result, fileName }: ResumeReportProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return { bg: "bg-success/10", text: "text-success", label: "Excellent" };
    if (score >= 60) return { bg: "bg-warning/10", text: "text-warning", label: "Good Start" };
    return { bg: "bg-danger/10", text: "text-danger", label: "Needs Work" };
  };

  const scoreColor = getScoreColor(result.atsScore);

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      {fileName && (
        <div className="text-sm text-text-muted">
          Analyzing: <span className="font-medium text-text-primary">{fileName}</span>
        </div>
      )}

      {/* Overall Score Card */}
      <div className="glass rounded-xl p-8 border border-primary/10">
        <h3 className="text-lg font-semibold text-text-primary mb-6">Resume Score</h3>

        <div className="flex items-center gap-8">
          {/* Circular Score Display */}
          <div className="relative w-40 h-40 flex-shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="6"
                className="text-surface-hover"
              />
              {/* Progress circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke={
                  result.atsScore >= 80
                    ? "#10b981"
                    : result.atsScore >= 60
                      ? "#f59e0b"
                      : "#ef4444"
                }
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 45}`}
                strokeDashoffset={`${2 * Math.PI * 45 * (1 - result.atsScore / 100)}`}
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl font-bold text-text-primary">
                  {result.atsScore}
                </div>
                <div className="text-xs text-text-muted mt-1">out of 100</div>
              </div>
            </div>
          </div>

          {/* Feedback */}
          <div className="flex-1">
            <div className={`inline-block px-3 py-1 rounded-full ${scoreColor.bg} mb-3`}>
              <span className={`text-xs font-semibold ${scoreColor.text}`}>
                {scoreColor.label}
              </span>
            </div>
            <p className="text-text-secondary leading-relaxed">
              {result.overallFeedback}
            </p>
          </div>
        </div>
      </div>

      {/* Skills Gap & Formatting Issues */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Skills Gap */}
        {result.skillsGap.length > 0 && (
          <div className="glass rounded-xl p-6">
            <h3 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
              <Target className="w-4 h-4 text-warning" />
              Skills Gap
            </h3>
            <div className="flex flex-wrap gap-2">
              {result.skillsGap.map((skill, i) => (
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
        {result.missingKeywords.length > 0 && (
          <div className="glass rounded-xl p-6">
            <h3 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-danger" />
              Missing Keywords
            </h3>
            <div className="flex flex-wrap gap-2">
              {result.missingKeywords.map((kw, i) => (
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

      {/* Formatting Feedback */}
      {result.formattingFeedback.length > 0 && (
        <div className="glass rounded-xl p-6">
          <h3 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
            <Zap className="w-4 h-4 text-accent" />
            Formatting Feedback
          </h3>
          <ul className="space-y-2">
            {result.formattingFeedback.map((feedback, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-text-secondary">
                <span className="text-accent mt-1.5">✓</span>
                <span>{feedback}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Improvements */}
      {result.improvements.length > 0 && (
        <div className="glass rounded-xl p-6">
          <h3 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary-light" />
            Top Improvements
          </h3>
          <div className="space-y-4">
            {result.improvements.slice(0, 5).map((improvement, i) => (
              <div
                key={i}
                className={`p-4 rounded-lg border-l-4 ${
                  improvement.priority === "high"
                    ? "border-danger bg-danger/5"
                    : improvement.priority === "medium"
                      ? "border-warning bg-warning/5"
                      : "border-success bg-success/5"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <p className="font-medium text-text-primary text-sm">
                    {improvement.section}
                  </p>
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      improvement.priority === "high"
                        ? "bg-danger/20 text-danger"
                        : improvement.priority === "medium"
                          ? "bg-warning/20 text-warning"
                          : "bg-success/20 text-success"
                    }`}
                  >
                    {improvement.priority.charAt(0).toUpperCase() +
                      improvement.priority.slice(1)}
                  </span>
                </div>
                <p className="text-sm text-text-secondary">{improvement.suggestion}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Items */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-primary-light mb-1">
            {result.skillsGap.length}
          </div>
          <p className="text-xs text-text-muted">Skills to Learn</p>
        </div>
        <div className="glass rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-warning mb-1">
            {result.missingKeywords.length}
          </div>
          <p className="text-xs text-text-muted">Keywords to Add</p>
        </div>
        <div className="glass rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-success mb-1">
            {result.improvements.length}
          </div>
          <p className="text-xs text-text-muted">Improvements Suggested</p>
        </div>
      </div>
    </div>
  );
}
