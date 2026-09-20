"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useApp } from "@/store";
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
  Users,
  ShieldAlert,
  ShieldCheck,
  FileCode,
  Copy,
  Check,
  Search,
  ChevronRight,
  Settings,
  Brain,
  Activity,
  Volume2,
  Camera,
  Smile,
} from "lucide-react";

interface CognitiveQuestionData {
  questionId: string;
  questionTitle: string;
  totalSamples: number;
  tensedCount: number;
  relaxedCount: number;
  focusedCount: number;
  confusedCount: number;
  dominantExpression: string;
}

function parseProctorData(violationsRaw: unknown) {
  if (!Array.isArray(violationsRaw)) return { infractions: [], cognitiveTelemetry: null };

  const infractions: Array<{ type: string; timestamp: string; details?: string }> = [];
  let cognitiveTelemetry: Record<string, CognitiveQuestionData> | null = null;

  for (const item of violationsRaw) {
    if (item && typeof item === "object") {
      const v = item as { type?: string; timestamp?: string; stats?: Record<string, CognitiveQuestionData>; details?: string };
      if (v.type === "cognitive_telemetry" && v.stats) {
        cognitiveTelemetry = v.stats;
      } else if (v.type) {
        infractions.push({
          type: v.type,
          timestamp: v.timestamp || new Date().toISOString(),
          details: v.details,
        });
      }
    }
  }

  return { infractions, cognitiveTelemetry };
}

function formatViolationType(type: string) {
  switch (type) {
    case "tab_switch":
      return "Tab Switch / Window Blur";
    case "audio_detected":
      return "Voice / Background Audio Detected";
    case "head_movement_detected":
      return "Head Movement / Looking Away";
    case "face_missing":
      return "Face Missing from Camera";
    case "paste_attempt":
      return "Clipboard Paste Attempt";
    case "fullscreen_exit":
      return "Full-Screen Mode Exited";
    default:
      return type;
  }
}

function CognitiveTelemetryView({ data }: { data: Record<string, CognitiveQuestionData> }) {
  const entries = Object.values(data);
  if (entries.length === 0) return null;

  return (
    <div className="fb-card rounded-xl p-6 space-y-4 border border-border">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-400">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-text-primary">
              AI Cognitive & Facial Expression Analysis per Question
            </h3>
            <p className="text-xs text-text-muted">
              Computer vision telemetry measuring mental focus, tension, and relaxation while solving each problem.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        {entries.map((stat, idx) => {
          const total = stat.totalSamples || 1;
          const tensedPct = Math.round((stat.tensedCount / total) * 100);
          const relaxedPct = Math.round((stat.relaxedCount / total) * 100);
          const focusedPct = Math.round((stat.focusedCount / total) * 100);
          const confusedPct = Math.max(0, 100 - (tensedPct + relaxedPct + focusedPct));

          const getDominantBadge = (expr: string) => {
            switch (expr) {
              case "Tensed":
                return { label: "High Tension ⚡", cls: "bg-red-500/20 text-red-400 border-red-500/30" };
              case "Relaxed":
                return { label: "Relaxed State 🌿", cls: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" };
              case "Confused":
                return { label: "Perplexed ❓", cls: "bg-purple-500/20 text-purple-400 border-purple-500/30" };
              case "Focused":
              default:
                return { label: "Steady Focus 🎯", cls: "bg-blue-500/20 text-blue-400 border-blue-500/30" };
            }
          };

          const dominant = getDominantBadge(stat.dominantExpression);

          return (
            <div key={stat.questionId || idx} className="p-4 rounded-xl bg-surface-alt border border-border space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="text-sm font-bold text-text-primary line-clamp-1">
                    {idx + 1}. {stat.questionTitle}
                  </h4>
                  <p className="text-[11px] text-text-muted mt-0.5">
                    {stat.totalSamples} visual telemetry samples evaluated
                  </p>
                </div>
                <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold border shrink-0 ${dominant.cls}`}>
                  {dominant.label}
                </span>
              </div>

              {/* Progress Stack Bar */}
              <div className="space-y-1.5">
                <div className="h-2.5 w-full bg-neutral-800 rounded-full overflow-hidden flex">
                  {tensedPct > 0 && (
                    <div style={{ width: `${tensedPct}%` }} className="bg-red-500 h-full" title={`Tensed: ${tensedPct}%`} />
                  )}
                  {focusedPct > 0 && (
                    <div style={{ width: `${focusedPct}%` }} className="bg-blue-500 h-full" title={`Focused: ${focusedPct}%`} />
                  )}
                  {relaxedPct > 0 && (
                    <div style={{ width: `${relaxedPct}%` }} className="bg-emerald-500 h-full" title={`Relaxed: ${relaxedPct}%`} />
                  )}
                  {confusedPct > 0 && (
                    <div style={{ width: `${confusedPct}%` }} className="bg-purple-500 h-full" title={`Confused: ${confusedPct}%`} />
                  )}
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono text-text-muted pt-0.5">
                  <span className="flex items-center gap-1 text-red-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500" /> Tensed: {tensedPct}%
                  </span>
                  <span className="flex items-center gap-1 text-blue-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Focused: {focusedPct}%
                  </span>
                  <span className="flex items-center gap-1 text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Relaxed: {relaxedPct}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

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

interface CandidateSubmission {
  id: string;
  problemId: string;
  language: string;
  code: string;
  verdict: string;
  score: number;
  passedTests: number;
  totalTests: number;
  output: string | null;
  error: string | null;
  submittedAt: string;
  problem: {
    id: string;
    title: string;
    points: number;
    difficulty?: string;
  };
}

interface CandidateAttempt {
  id: string;
  userId: string;
  examId: string;
  totalScore: number;
  maxScore: number;
  startedAt: string;
  deadline: string;
  completedAt: string | null;
  terminatedByProctor: boolean;
  violations: Array<{ type: string; timestamp: string }> | null;
  user: {
    id: string;
    name: string;
    email: string;
    avatar: string | null;
  };
  submissions: CandidateSubmission[];
}

export default function ExamResultsPage() {
  const params = useParams();
  const { user } = useApp();
  const examId = params.examId as string;

  const [attempt, setAttempt] = useState<AttemptData | null>(null);
  const [submissions, setSubmissions] = useState<BestSubmission[]>([]);
  const [allAttempts, setAllAttempts] = useState<CandidateAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [adminTab, setAdminTab] = useState<"own" | "all">("own");
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateAttempt | null>(null);
  const [activeSubProblemId, setActiveSubProblemId] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch(`/api/exams/${examId}/results`)
      .then((r) => r.json())
      .then((d) => {
        if (d.attempt) {
          setAttempt(d.attempt);
          setSubmissions(d.bestSubmissions || []);
        } else {
          setAdminTab("all");
        }
        if (Array.isArray(d.attempts)) {
          setAllAttempts(d.attempts);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [examId]);

  const calculateDuration = (startStr: string, endStr: string | null) => {
    if (!endStr) return "In Progress";
    const start = new Date(startStr).getTime();
    const end = new Date(endStr).getTime();
    const diffSec = Math.max(0, Math.floor((end - start) / 1000));
    const mins = Math.floor(diffSec / 60);
    const secs = diffSec % 60;
    return `${mins}m ${secs}s`;
  };

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

  if (!attempt && allAttempts.length === 0) {
    return (
      <StandardLayout particlesCount={8} showFooter={false} flowblockTheme>
        <div className="max-w-3xl mx-auto py-20 text-center">
          <div className="fb-card rounded-xl p-12">
            <Trophy className="w-16 h-16 text-text-muted opacity-20 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-text-primary mb-2">No Results Found</h2>
            <p className="text-text-muted mb-6">No assessment results have been recorded for this exam yet.</p>
            <Link href="/exams" className="fb-btn-primary">
              <ArrowLeft className="w-4 h-4" /> Back to Exams
            </Link>
          </div>
        </div>
      </StandardLayout>
    );
  }

  const percentage = attempt && attempt.maxScore > 0
    ? Math.round((attempt.totalScore / attempt.maxScore) * 100)
    : 0;

  const startedAt = attempt ? new Date(attempt.startedAt) : null;
  const completedAt = attempt?.completedAt ? new Date(attempt.completedAt) : null;
  const timeTaken = startedAt && completedAt
    ? Math.floor((completedAt.getTime() - startedAt.getTime()) / 1000)
    : 0;
  const timeMins = Math.floor(timeTaken / 60);
  const timeSecs = timeTaken % 60;

  const filteredResults = allAttempts.filter(
    (a) =>
      a.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <StandardLayout particlesCount={8} showFooter={false} flowblockTheme>
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6 animate-slide-up" style={{ animationDuration: "0.4s" }}>
        {/* Navigation & Role Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/exams"
            className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-text-primary transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Exams
          </Link>

          {user.isAdmin && (
            <div className="flex items-center gap-2">
              <Link
                href={`/exams/admin/${examId}`}
                className="px-3 py-1.5 rounded-lg border border-border text-xs text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-colors flex items-center gap-1.5"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Exam Editor</span>
              </Link>
              {attempt && (
                <div className="flex bg-surface-alt p-1 rounded-lg border border-border">
                  <button
                    onClick={() => setAdminTab("own")}
                    className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                      adminTab === "own"
                        ? "bg-[#E6C212] text-black"
                        : "text-text-muted hover:text-text-primary"
                    }`}
                  >
                    My Result
                  </button>
                  <button
                    onClick={() => setAdminTab("all")}
                    className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors flex items-center gap-1 ${
                      adminTab === "all"
                        ? "bg-[#E6C212] text-black"
                        : "text-text-muted hover:text-text-primary"
                    }`}
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>All Candidates ({allAttempts.length})</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── VIEW 1: All Candidate Attempts & Anti-Cheat Audit (Admin) ── */}
        {user.isAdmin && adminTab === "all" ? (
          <div className="space-y-6">
            <div className="fb-card rounded-2xl p-6 border border-[#E6C212]/30">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
                    <Users className="w-5 h-5 text-[#E6C212]" />
                    Candidate Assessment Submissions ({allAttempts.length})
                  </h2>
                  <p className="text-xs text-text-muted mt-1">
                    Click any candidate to inspect submitted code, execution verdicts, and anti-cheat audit logs.
                  </p>
                </div>
              </div>

              {selectedCandidate ? (
                /* Selected Candidate Deep Dive */
                <div className="space-y-6 pt-2">
                  <button
                    onClick={() => setSelectedCandidate(null)}
                    className="inline-flex items-center gap-1.5 text-xs text-[#E6C212] hover:underline"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back to Candidate List
                  </button>

                  <div className="p-4 rounded-xl bg-surface-alt border border-border flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <h4 className="text-base font-bold text-text-primary">
                        {selectedCandidate.user?.name || "Candidate"}
                      </h4>
                      <p className="text-xs text-text-muted">
                        {selectedCandidate.user?.email} · User ID: {selectedCandidate.userId}
                      </p>
                    </div>
                    <div className="flex items-center gap-6 text-right">
                      <div>
                        <p className="text-xs text-text-muted">Total Score</p>
                        <p className="text-xl font-black text-text-primary">
                          {selectedCandidate.totalScore}{" "}
                          <span className="text-xs text-text-muted">/ {selectedCandidate.maxScore}</span>
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-text-muted">Time Taken</p>
                        <p className="text-sm font-semibold text-text-primary">
                          {calculateDuration(selectedCandidate.startedAt, selectedCandidate.completedAt)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Anti-Cheating Section */}
                  <div className="p-4 rounded-xl border border-border bg-surface-card space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {selectedCandidate.terminatedByProctor ||
                        (selectedCandidate.violations && selectedCandidate.violations.length > 0) ? (
                          <ShieldAlert className="w-5 h-5 text-red-400" />
                        ) : (
                          <ShieldCheck className="w-5 h-5 text-green-400" />
                        )}
                        <h5 className="text-sm font-semibold text-text-primary">
                          Proctoring & Anti-Cheat Audit
                        </h5>
                      </div>
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                          selectedCandidate.terminatedByProctor
                            ? "bg-red-500/20 text-red-400 border border-red-500/30"
                            : selectedCandidate.violations && selectedCandidate.violations.length > 0
                            ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                            : "bg-green-500/20 text-green-400 border border-green-500/30"
                        }`}
                      >
                        {selectedCandidate.terminatedByProctor
                          ? "Auto-Terminated by Proctor"
                          : selectedCandidate.violations && selectedCandidate.violations.length > 0
                          ? `${selectedCandidate.violations.length} Violation(s) Logged`
                          : "Clean (No Violations)"}
                      </span>
                    </div>

                    {(() => {
                      const { infractions, cognitiveTelemetry } = parseProctorData(selectedCandidate.violations);
                      return (
                        <div className="space-y-4 pt-2 border-t border-border">
                          {cognitiveTelemetry && (
                            <div className="space-y-2">
                              <p className="text-xs font-bold text-text-primary flex items-center gap-1.5">
                                <Brain className="w-3.5 h-3.5 text-purple-400" />
                                <span>Question-Level Facial Expression & Cognitive State:</span>
                              </p>
                              <div className="space-y-2">
                                {Object.values(cognitiveTelemetry).map((stat, idx) => {
                                  const total = stat.totalSamples || 1;
                                  const tensedPct = Math.round((stat.tensedCount / total) * 100);
                                  const relaxedPct = Math.round((stat.relaxedCount / total) * 100);
                                  const focusedPct = Math.round((stat.focusedCount / total) * 100);
                                  return (
                                    <div key={idx} className="p-2.5 rounded-lg bg-black/40 border border-white/5 text-xs space-y-1.5">
                                      <div className="flex items-center justify-between">
                                        <span className="font-semibold text-text-primary truncate max-w-[200px]">
                                          {idx + 1}. {stat.questionTitle}
                                        </span>
                                        <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-bold bg-white/5 border border-white/10">
                                          Dominant: {stat.dominantExpression}
                                        </span>
                                      </div>
                                      <div className="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden flex">
                                        <div style={{ width: `${tensedPct}%` }} className="bg-red-500 h-full" />
                                        <div style={{ width: `${focusedPct}%` }} className="bg-blue-500 h-full" />
                                        <div style={{ width: `${relaxedPct}%` }} className="bg-emerald-500 h-full" />
                                      </div>
                                      <div className="flex justify-between text-[10px] text-text-muted font-mono">
                                        <span className="text-red-400">Tensed: {tensedPct}%</span>
                                        <span className="text-blue-400">Focused: {focusedPct}%</span>
                                        <span className="text-emerald-400">Relaxed: {relaxedPct}%</span>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {infractions.length > 0 ? (
                            <div className="space-y-1.5">
                              <p className="text-xs font-medium text-text-muted">Proctor Violation Event Log:</p>
                              <div className="max-h-36 overflow-y-auto space-y-1">
                                {infractions.map((v, idx) => (
                                  <div
                                    key={idx}
                                    className="text-xs p-2 rounded bg-red-500/10 border border-red-500/20 text-red-300 flex items-center justify-between"
                                  >
                                    <span>⚠️ <strong>{formatViolationType(v.type)}</strong> {v.details ? `(${v.details})` : ""}</span>
                                    <span className="text-text-muted font-mono text-[11px]">
                                      {new Date(v.timestamp).toLocaleTimeString()}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <p className="text-xs text-green-400/80 pt-1">
                              ✓ Clean session: No proctoring or tab-switch infractions recorded.
                            </p>
                          )}
                        </div>
                      );
                    })()}
                  </div>

                  {/* Submitted Solutions */}
                  <div className="space-y-3">
                    <h5 className="text-sm font-semibold text-text-primary flex items-center gap-2">
                      <FileCode className="w-4 h-4 text-[#E6C212]" />
                      Submitted Solutions & Test Verdicts
                    </h5>

                    {selectedCandidate.submissions.length === 0 ? (
                      <p className="text-xs text-text-muted italic">No code submitted for this exam.</p>
                    ) : (
                      <div>
                        <div className="flex gap-2 border-b border-border pb-2 mb-3 overflow-x-auto">
                          {selectedCandidate.submissions.map((sub, idx) => {
                            const active = (activeSubProblemId || selectedCandidate.submissions[0].id) === sub.id;
                            return (
                              <button
                                key={sub.id}
                                onClick={() => setActiveSubProblemId(sub.id)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-colors flex items-center gap-1.5 ${
                                  active
                                    ? "bg-[#E6C212] text-black"
                                    : sub.verdict === "Accepted"
                                    ? "bg-green-500/10 text-green-400 border border-green-500/20"
                                    : "bg-surface-alt text-text-secondary hover:bg-surface-hover"
                                }`}
                              >
                                {sub.verdict === "Accepted" ? (
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                ) : (
                                  <XCircle className="w-3.5 h-3.5" />
                                )}
                                <span>{sub.problem?.title || `Problem ${idx + 1}`}</span>
                              </button>
                            );
                          })}
                        </div>

                        {(() => {
                          const sub =
                            selectedCandidate.submissions.find(
                              (s) => s.id === (activeSubProblemId || selectedCandidate.submissions[0].id)
                            ) || selectedCandidate.submissions[0];

                          if (!sub) return null;

                          return (
                            <div className="space-y-3 rounded-xl bg-surface-alt p-4 border border-border">
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <div>
                                  <h6 className="text-sm font-bold text-text-primary">
                                    {sub.problem?.title}
                                  </h6>
                                  <p className="text-xs text-text-muted">
                                    Language: <span className="text-text-primary uppercase font-mono">{sub.language}</span> · Submitted:{" "}
                                    {new Date(sub.submittedAt).toLocaleTimeString()}
                                  </p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span
                                    className={`text-xs px-2.5 py-1 rounded font-semibold ${
                                      sub.verdict === "Accepted"
                                        ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                        : "bg-red-500/20 text-red-400 border border-red-500/30"
                                    }`}
                                  >
                                    {sub.verdict} ({sub.passedTests}/{sub.totalTests} tests)
                                  </span>
                                  <span className="text-xs font-bold text-[#E6C212] bg-[#E6C212]/10 px-2.5 py-1 rounded border border-[#E6C212]/20">
                                    {sub.score} pts
                                  </span>
                                </div>
                              </div>

                              <div className="relative">
                                <div className="flex items-center justify-between px-3 py-1.5 bg-[#141414] rounded-t-lg border border-b-0 border-border">
                                  <span className="text-xs font-mono text-text-muted">solution.{sub.language}</span>
                                  <button
                                    onClick={() => {
                                      navigator.clipboard.writeText(sub.code);
                                      setCopiedCode(true);
                                      setTimeout(() => setCopiedCode(false), 2000);
                                    }}
                                    className="text-xs text-text-muted hover:text-text-primary transition-colors flex items-center gap-1"
                                  >
                                    {copiedCode ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                                    <span>{copiedCode ? "Copied" : "Copy Code"}</span>
                                  </button>
                                </div>
                                <pre className="p-4 bg-[#0a0a0a] rounded-b-lg border border-border text-xs text-text-secondary font-mono overflow-x-auto max-h-72 whitespace-pre-wrap">
                                  <code>{sub.code}</code>
                                </pre>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* Candidates List */
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="w-4 h-4 text-text-muted absolute left-3 top-3" />
                    <input
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search candidate by name or email..."
                      className="w-full pl-9 pr-3 py-2 rounded-lg bg-surface-alt border border-border text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-[#E6C212]/60"
                    />
                  </div>

                  {filteredResults.length === 0 ? (
                    <div className="p-12 text-center text-text-muted">
                      <Users className="w-10 h-10 mx-auto mb-2 opacity-20" />
                      <p className="text-sm">No candidate attempts found.</p>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {filteredResults.map((a) => {
                        const duration = calculateDuration(a.startedAt, a.completedAt);
                        const violationCount = a.violations?.length || 0;

                        return (
                          <div
                            key={a.id}
                            onClick={() => {
                              setSelectedCandidate(a);
                              setActiveSubProblemId(null);
                            }}
                            className="p-4 rounded-xl bg-surface-alt border border-border hover:border-[#E6C212]/40 hover:bg-surface-hover transition-all cursor-pointer flex flex-wrap items-center justify-between gap-4 group"
                          >
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="text-sm font-bold text-text-primary group-hover:text-[#E6C212] transition-colors">
                                  {a.user?.name || "Candidate"}
                                </h4>
                                <span
                                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                    a.completedAt
                                      ? "bg-green-500/10 text-green-400 border border-green-500/20"
                                      : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                                  }`}
                                >
                                  {a.completedAt ? "Finished" : "In Progress"}
                                </span>
                              </div>
                              <p className="text-xs text-text-muted">
                                {a.user?.email} · Started: {new Date(a.startedAt).toLocaleTimeString()}
                              </p>
                            </div>

                            <div className="flex items-center gap-6">
                              <div className="text-right">
                                <p className="text-xs text-text-muted">Duration</p>
                                <p className="text-xs font-semibold text-text-primary flex items-center gap-1">
                                  <Clock className="w-3 h-3 text-text-muted" />
                                  {duration}
                                </p>
                              </div>

                              <div className="text-right">
                                <p className="text-xs text-text-muted">Anti-Cheat</p>
                                <p
                                  className={`text-xs font-semibold ${
                                    a.terminatedByProctor
                                      ? "text-red-400"
                                      : violationCount > 0
                                      ? "text-yellow-400"
                                      : "text-green-400"
                                  }`}
                                >
                                  {a.terminatedByProctor
                                    ? "Terminated"
                                    : violationCount > 0
                                    ? `${violationCount} Violations`
                                    : "Clean"}
                                </p>
                              </div>

                              <div className="text-right min-w-[70px]">
                                <p className="text-xs text-text-muted">Score</p>
                                <p className="text-base font-black text-text-primary">
                                  {a.totalScore}
                                  <span className="text-xs text-text-muted">/{a.maxScore}</span>
                                </p>
                              </div>

                              <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-[#E6C212] transition-colors" />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : attempt ? (
          /* ── VIEW 2: Candidate's Own Assessment Results ── */
          <div className="space-y-6">
            {attempt.terminatedByProctor && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-300">
                    Exam Terminated — Proctoring Violation
                  </p>
                  <p className="text-xs text-red-400 mt-1">
                    Your assessment was auto-submitted due to proctoring tab-switch violations.
                  </p>
                </div>
              </div>
            )}

            {/* Score Card */}
            <div className="fb-card rounded-xl p-8 text-center">
              <h2 className="text-2xl font-bold text-text-primary mb-1">{attempt.examTitle}</h2>
              <p className="text-sm text-text-muted mb-6 flex items-center justify-center gap-2">
                <Shield className="w-3.5 h-3.5" /> Proctored Assessment Result
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
              <p className="text-lg text-text-muted mb-6">{percentage}% Score</p>

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

            {/* Cognitive & Facial Expression Analysis */}
            {(() => {
              const { infractions, cognitiveTelemetry } = parseProctorData(attempt.violations);
              return (
                <div className="space-y-6">
                  {cognitiveTelemetry && (
                    <CognitiveTelemetryView data={cognitiveTelemetry} />
                  )}

                  {/* Proctor & Integrity Audit Section */}
                  <div className="fb-card rounded-xl p-6 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {attempt.terminatedByProctor || infractions.length > 0 ? (
                          <ShieldAlert className="w-5 h-5 text-red-400" />
                        ) : (
                          <ShieldCheck className="w-5 h-5 text-green-400" />
                        )}
                        <h3 className="text-base font-semibold text-text-primary">
                          Anti-Cheat & Proctoring Audit
                        </h3>
                      </div>
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                          attempt.terminatedByProctor
                            ? "bg-red-500/20 text-red-400 border border-red-500/30"
                            : infractions.length > 0
                            ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                            : "bg-green-500/20 text-green-400 border border-green-500/30"
                        }`}
                      >
                        {attempt.terminatedByProctor
                          ? "Auto-Terminated by Proctor"
                          : infractions.length > 0
                          ? `${infractions.length} Infraction(s) Recorded`
                          : "Clean Proctoring Record"}
                      </span>
                    </div>

                    {infractions.length > 0 ? (
                      <div className="space-y-1.5 pt-2 border-t border-border">
                        <p className="text-xs font-medium text-text-muted">Violation Event Timeline:</p>
                        <div className="max-h-40 overflow-y-auto space-y-1.5">
                          {infractions.map((v, idx) => (
                            <div
                              key={idx}
                              className="text-xs p-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 flex items-center justify-between"
                            >
                              <span>
                                ⚠️ <strong>{formatViolationType(v.type)}</strong>
                                {v.details ? ` · ${v.details}` : ""}
                              </span>
                              <span className="text-text-muted font-mono text-[11px]">
                                {new Date(v.timestamp).toLocaleTimeString()}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-green-400/80 pt-1">
                        ✓ Candidate maintained full-screen mode with clear camera visibility and silence throughout the session.
                      </p>
                    )}
                  </div>
                </div>
              );
            })()}

            {/* Per-Problem Results */}
            <div className="fb-card rounded-xl p-6">
              <h3 className="text-base font-semibold text-text-primary mb-4">
                Problem-wise Results & Verdicts
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
                    No submissions were recorded for this exam.
                  </p>
                )}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </StandardLayout>
  );
}
