"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import StandardLayout from "@/components/layout/StandardLayout";
import Link from "next/link";
import {
  Trophy,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowLeft,
  Target,
  AlertTriangle,
  Shield,
} from "lucide-react";

interface BestSubmission {
  problemId: string;
  problemTitle: string;
  problemPoints: number;
  verdict: string;
  score: number;
  passedTests: number;
  totalTests: number;
  language: string;
}

interface AttemptData {
  id: string;
  examTitle: string;
  examDuration: number;
  totalScore: number;
  maxScore: number;
  startedAt: string;
  completedAt: string | null;
  terminatedByProctor: boolean;
  violations: unknown[] | null;
}

export default function ExamResultsPage() {
  const params = useParams();
  const examId = params.examId as string;
  const [attempt, setAttempt] = useState<AttemptData | null>(null);
  const [submissions, setSubmissions] = useState<BestSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/exams/${examId}/results`)
      .then((r) => r.json())
      .then((d) => {
        setAttempt(d.attempt);
        setSubmissions(d.bestSubmissions || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [examId]);

  if (loading) {
    return (
      <StandardLayout particlesCount={8} showFooter={false} flowblockTheme>
        <div className="max-w-3xl mx-auto py-20 text-center">
          <div className="fb-card rounded-xl p-12 animate-pulse">
            <div className="h-8 bg-surface-hover rounded w-1/2 mx-auto mb-4" />
            <div className="h-20 bg-surface-hover rounded w-1/3 mx-auto" />
          </div>
        </div>
      </StandardLayout>
    );
  }

  if (!attempt) {
    return (
      <StandardLayout particlesCount={8} showFooter={false} flowblockTheme>
        <div className="max-w-3xl mx-auto py-20 text-center">
          <div className="fb-card rounded-xl p-12">
            <Trophy className="w-16 h-16 text-text-muted opacity-20 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-text-primary mb-2">No Results Found</h2>
            <p className="text-text-muted mb-6">You haven&apos;t attempted this exam yet.</p>
            <Link href="/exams" className="fb-btn-primary">
              <ArrowLeft className="w-4 h-4" /> Back to Exams
            </Link>
          </div>
        </div>
      </StandardLayout>
    );
  }

  const percentage = attempt.maxScore > 0
    ? Math.round((attempt.totalScore / attempt.maxScore) * 100)
    : 0;

  const startedAt = new Date(attempt.startedAt);
  const completedAt = attempt.completedAt ? new Date(attempt.completedAt) : null;
  const timeTaken = completedAt
    ? Math.floor((completedAt.getTime() - startedAt.getTime()) / 1000)
    : 0;
  const timeMins = Math.floor(timeTaken / 60);
  const timeSecs = timeTaken % 60;

  return (
    <StandardLayout particlesCount={8} showFooter={false} flowblockTheme>
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6 animate-slide-up" style={{ animationDuration: "0.4s" }}>
        <Link
          href="/exams"
          className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Exams
        </Link>

        {attempt.terminatedByProctor && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-300">
                Exam Terminated — Proctoring Violation
              </p>
              <p className="text-xs text-red-400 mt-1">
                Your exam was auto-submitted due to repeated proctoring violations.
              </p>
            </div>
          </div>
        )}

        {/* Score Card */}
        <div className="fb-card rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-text-primary mb-1">{attempt.examTitle}</h2>
          <p className="text-sm text-text-muted mb-6 flex items-center justify-center gap-2">
            <Shield className="w-3.5 h-3.5" /> Proctored Exam
          </p>

          <div
            className={`text-6xl font-black mb-2 ${
              percentage >= 70
                ? "text-green-400"
                : percentage >= 40
                ? "text-yellow-400"
                : "text-red-400"
            }`}
          >
            {attempt.totalScore}
            <span className="text-2xl text-text-muted">/{attempt.maxScore}</span>
          </div>
          <p className="text-lg text-text-muted mb-6">{percentage}%</p>

          <div className="grid grid-cols-3 gap-4">
            <div className="p-3 rounded-lg bg-surface-alt">
              <Target className="w-5 h-5 text-[#E6C212] mx-auto mb-1" />
              <p className="text-xl font-bold text-text-primary">{submissions.length}</p>
              <p className="text-xs text-text-muted">Problems Attempted</p>
            </div>
            <div className="p-3 rounded-lg bg-surface-alt">
              <CheckCircle2 className="w-5 h-5 text-green-400 mx-auto mb-1" />
              <p className="text-xl font-bold text-text-primary">
                {submissions.filter((s) => s.verdict === "Accepted").length}
              </p>
              <p className="text-xs text-text-muted">Accepted</p>
            </div>
            <div className="p-3 rounded-lg bg-surface-alt">
              <Clock className="w-5 h-5 text-text-muted mx-auto mb-1" />
              <p className="text-xl font-bold text-text-primary">
                {timeMins}m {timeSecs}s
              </p>
              <p className="text-xs text-text-muted">Time Taken</p>
            </div>
          </div>
        </div>

        {/* Per-Problem Results */}
        <div className="fb-card rounded-xl p-6">
          <h3 className="text-base font-semibold text-text-primary mb-4">
            Problem-wise Results
          </h3>
          <div className="space-y-3">
            {submissions.map((sub) => (
              <div
                key={sub.problemId}
                className={`p-4 rounded-lg border flex items-center justify-between ${
                  sub.verdict === "Accepted"
                    ? "border-green-500/20 bg-green-500/5"
                    : "border-red-500/20 bg-red-500/5"
                }`}
              >
                <div className="flex items-center gap-3">
                  {sub.verdict === "Accepted" ? (
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-400" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-text-primary">
                      {sub.problemTitle}
                    </p>
                    <p className="text-xs text-text-muted">
                      {sub.verdict} · {sub.passedTests}/{sub.totalTests} tests ·{" "}
                      {sub.language}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`text-lg font-bold ${
                      sub.verdict === "Accepted" ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {sub.score}
                  </p>
                  <p className="text-xs text-text-muted">/ {sub.problemPoints} pts</p>
                </div>
              </div>
            ))}

            {submissions.length === 0 && (
              <p className="text-sm text-text-muted text-center py-4">
                No submissions were made during this exam.
              </p>
            )}
          </div>
        </div>
      </div>
    </StandardLayout>
  );
}
