"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import {
  Clock,
  Play,
  Send,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Shield,
  Loader2,
  Code2,
  ArrowLeft,
  Copy,
  Check,
  Terminal,
  Maximize2,
  HelpCircle,
  FileCode,
  Sparkles,
  Zap,
  ShieldAlert,
} from "lucide-react";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full bg-[#0a0a0a] text-text-muted">
      <Loader2 className="w-6 h-6 animate-spin text-[#E6C212]" />
    </div>
  ),
});

interface ExamProblem {
  id: string;
  title: string;
  statement: string;
  constraints: string[];
  inputFormat: string;
  outputFormat: string;
  examples: { input: string; output: string; explanation?: string }[];
  difficulty: string;
  points: number;
  timeLimit?: number;
  memoryLimit?: number;
  supportedLangs: string[];
  testCases: { id: string; input: string; output: string }[];
}

interface RunResult {
  input: string;
  expectedOutput: string;
  actualOutput: string;
  verdict: string;
  passed: boolean;
  error: string;
}

interface SubmitResult {
  id: string;
  verdict: string;
  passedTests: number;
  totalTests: number;
  score: number;
  output: string;
  error: string;
}

const LANG_MAP: Record<string, string> = {
  cpp: "C++ (GCC)",
  python: "Python 3",
  java: "Java (OpenJDK)",
  javascript: "JavaScript (Node.js)",
};

const MONACO_LANG_MAP: Record<string, string> = {
  cpp: "cpp",
  python: "python",
  java: "java",
  javascript: "javascript",
};

const STARTER_CODE: Record<string, string> = {
  cpp: `#include <iostream>
#include <vector>
#include <string>
#include <algorithm>

using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    
    // Write your solution here
    
    return 0;
}
`,
  python: `# Write your solution here
import sys

def solve():
    input = sys.stdin.read
    # Process input and output results
    pass

if __name__ == '__main__':
    solve()
`,
  java: `import java.util.*;
import java.io.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Write your solution here
        
    }
}
`,
  javascript: `const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const lines = [];
rl.on('line', (line) => {
    lines.push(line);
});

rl.on('close', () => {
    // Process lines and output answer
    
});
`,
};

export default function ExamInterfacePage() {
  const params = useParams();
  const router = useRouter();
  const examId = params.examId as string;

  const [loading, setLoading] = useState(true);
  const [initError, setInitError] = useState<string | null>(null);
  const [examTitle, setExamTitle] = useState("");
  const [problems, setProblems] = useState<ExamProblem[]>([]);
  const [activeProblem, setActiveProblem] = useState(0);
  const [deadline, setDeadline] = useState<Date | null>(null);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);

  // Code state per problem
  const [codeMap, setCodeMap] = useState<Record<string, string>>({});
  const [langMap, setLangMap] = useState<Record<string, string>>({});

  // Execution state
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<"testcase" | "result">("testcase");
  const [selectedCaseIdx, setSelectedCaseIdx] = useState(0);
  const [runResults, setRunResults] = useState<RunResult[] | null>(null);
  const [submitResult, setSubmitResult] = useState<SubmitResult | null>(null);
  const [verdicts, setVerdicts] = useState<Record<string, string>>({});

  // Proctoring: STRICT 1-TAB-SWITCH LIMIT
  const [violations, setViolations] = useState<{ type: string; timestamp: string }[]>([]);
  const [showWarning, setShowWarning] = useState(false);
  const [proctorTerminated, setProctorTerminated] = useState(false);
  const [copiedExample, setCopiedExample] = useState<number | null>(null);
  const violationCount = useRef(0);
  const completed = useRef(false);

  // ── Auto-submit on completion / proctor termination ──
  const handleComplete = useCallback(
    async (terminated: boolean) => {
      if (completed.current) return;
      completed.current = true;

      try {
        await fetch(`/api/exams/${examId}/complete`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            terminatedByProctor: terminated,
            violations,
          }),
        });
      } catch {}

      router.push(`/exams/${examId}/results`);
    },
    [examId, violations, router]
  );

  // ── Initialize exam attempt ──
  useEffect(() => {
    async function init() {
      try {
        const res = await fetch(`/api/exams/${examId}/start`, {
          method: "POST",
        });
        const data = await res.json();

        if (res.status === 409 && data.attempt) {
          // Already started — check if finished
          if (data.attempt.completedAt) {
            router.push(`/exams/${examId}/results`);
            return;
          }
          // Resume active attempt
          const detRes = await fetch(`/api/exams/${examId}`);
          const detData = await detRes.json();

          if (detData.exam && detData.exam.problems?.length > 0) {
            setExamTitle(detData.exam.title);
            setProblems(detData.exam.problems);
            setDeadline(new Date(data.attempt.deadline));
            setAttemptId(data.attempt.id);

            const codes: Record<string, string> = {};
            const langs: Record<string, string> = {};
            const vds: Record<string, string> = {};
            for (const p of detData.exam.problems) {
              const defaultLang = p.supportedLangs?.[0] || "cpp";
              codes[p.id] = STARTER_CODE[defaultLang] || "";
              langs[p.id] = defaultLang;
            }
            if (detData.attempt?.submissions) {
              for (const s of detData.attempt.submissions) {
                if (s.code) {
                  codes[s.problemId] = s.code;
                  langs[s.problemId] = s.language;
                  vds[s.problemId] = s.verdict;
                }
              }
            }
            setCodeMap(codes);
            setLangMap(langs);
            setVerdicts(vds);
            setLoading(false);
            return;
          }
        } else if (data.exam && data.attempt) {
          // Fresh start
          setExamTitle(data.exam.title);
          setProblems(data.exam.problems || []);
          setDeadline(new Date(data.attempt.deadline));
          setAttemptId(data.attempt.id);

          const codes: Record<string, string> = {};
          const langs: Record<string, string> = {};
          for (const p of data.exam.problems || []) {
            const defaultLang = p.supportedLangs?.[0] || "cpp";
            codes[p.id] = STARTER_CODE[defaultLang] || "";
            langs[p.id] = defaultLang;
          }
          setCodeMap(codes);
          setLangMap(langs);
          setLoading(false);
          return;
        }

        // If exam details fetch fallback
        const fallbackRes = await fetch(`/api/exams/${examId}`);
        const fallbackData = await fallbackRes.json();
        if (fallbackData.exam) {
          setExamTitle(fallbackData.exam.title);
          setProblems(fallbackData.exam.problems || []);
          setLoading(false);
          return;
        }

        setInitError("Unable to load exam. Please ensure this exam is published.");
      } catch (err) {
        setInitError("Network error initializing exam. Please retry.");
      }
      setLoading(false);
    }
    init();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [examId]);

  // ── Countdown Timer ──
  useEffect(() => {
    if (!deadline) return;
    const interval = setInterval(() => {
      const diff = Math.max(0, Math.floor((deadline.getTime() - Date.now()) / 1000));
      setTimeLeft(diff);
      if (diff <= 0) {
        clearInterval(interval);
        handleComplete(false);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [deadline, handleComplete]);

  // ── Strict Proctoring (Max 1 Warning, 2nd switch auto-terminates) ──
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden && !completed.current) {
        violationCount.current++;
        const v = { type: "tab_switch", timestamp: new Date().toISOString() };
        setViolations((prev) => [...prev, v]);

        if (violationCount.current >= 2) {
          // 2nd tab switch = IMMEDIATE TERMINATION
          setProctorTerminated(true);
          handleComplete(true);
        } else {
          // 1st tab switch = FINAL WARNING
          setShowWarning(true);
        }
      }
    };

    // Prevent copy/paste and right click to block cheating
    const blockCopyPaste = (e: ClipboardEvent) => {
      if (!completed.current) {
        e.preventDefault();
      }
    };

    const blockContextMenu = (e: MouseEvent) => {
      if (!completed.current) {
        e.preventDefault();
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    document.addEventListener("copy", blockCopyPaste);
    document.addEventListener("paste", blockCopyPaste);
    document.addEventListener("cut", blockCopyPaste);
    document.addEventListener("contextmenu", blockContextMenu);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      document.removeEventListener("copy", blockCopyPaste);
      document.removeEventListener("paste", blockCopyPaste);
      document.removeEventListener("cut", blockCopyPaste);
      document.removeEventListener("contextmenu", blockContextMenu);
    };
  }, [handleComplete]);

  const handleRun = async () => {
    const problem = problems[activeProblem];
    if (!problem || running) return;
    setRunning(true);
    setRunResults(null);
    setSubmitResult(null);
    setActiveTab("result");

    try {
      const res = await fetch(`/api/exams/${examId}/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          problemId: problem.id,
          code: codeMap[problem.id] || "",
          language: langMap[problem.id] || "cpp",
        }),
      });
      const data = await res.json();
      if (data.results) {
        setRunResults(data.results);
        setSelectedCaseIdx(0);
      } else if (data.error) {
        setRunResults([
          {
            input: "",
            expectedOutput: "",
            actualOutput: "",
            verdict: "Error",
            passed: false,
            error: data.error,
          },
        ]);
      }
    } catch {
      setRunResults([
        {
          input: "",
          expectedOutput: "",
          actualOutput: "",
          verdict: "Error",
          passed: false,
          error: "Execution service temporarily unavailable.",
        },
      ]);
    }
    setRunning(false);
  };

  const handleSubmit = async () => {
    const problem = problems[activeProblem];
    if (!problem || submitting) return;
    setSubmitting(true);
    setSubmitResult(null);
    setRunResults(null);
    setActiveTab("result");

    try {
      const res = await fetch(`/api/exams/${examId}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          problemId: problem.id,
          code: codeMap[problem.id] || "",
          language: langMap[problem.id] || "cpp",
        }),
      });
      const data = await res.json();
      if (data.submission) {
        setSubmitResult(data.submission);
        setVerdicts((prev) => ({ ...prev, [problem.id]: data.submission.verdict }));
      }
    } catch {}
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center flex-col gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#E6C212]" />
        <p className="text-xs text-text-muted font-mono">Initializing Proctored Assessment Sandbox...</p>
      </div>
    );
  }

  if (initError) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center p-4">
        <div className="fb-card rounded-xl p-8 max-w-md w-full text-center space-y-4">
          <AlertTriangle className="w-12 h-12 text-yellow-400 mx-auto" />
          <h3 className="text-lg font-bold text-text-primary">Unable to Open Exam</h3>
          <p className="text-xs text-text-muted">{initError}</p>
          <button onClick={() => router.push("/exams")} className="fb-btn-primary w-full justify-center text-xs">
            Return to Exams List
          </button>
        </div>
      </div>
    );
  }

  const currentProblem = problems[activeProblem];
  const currentLang = langMap[currentProblem?.id] || "cpp";
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="h-screen flex flex-col bg-[#0d0d0d] text-text-primary overflow-hidden font-sans select-none">
      {/* ── Strict Proctor Warning (1st violation) ── */}
      {showWarning && (
        <div className="fixed inset-0 z-[150] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="fb-card rounded-2xl p-8 max-w-md w-full text-center animate-slide-up border border-yellow-500/50 shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center mx-auto mb-4">
              <ShieldAlert className="w-8 h-8 text-yellow-400" />
            </div>
            <h3 className="text-xl font-bold text-text-primary mb-2">
              Proctoring Warning (1/1 Allowed)
            </h3>
            <p className="text-sm text-text-secondary mb-4 leading-relaxed">
              Window blur or tab switch detected! Leaving the assessment tab is strictly prohibited.
            </p>
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-xs mb-6 font-semibold">
              ⚠️ Warning: Any further tab switch will immediately terminate and submit your assessment with a cheating violation!
            </div>
            <button
              onClick={() => setShowWarning(false)}
              className="fb-btn-primary w-full justify-center text-sm py-2.5 font-bold"
            >
              I Understand & Return to Exam
            </button>
          </div>
        </div>
      )}

      {/* ── Auto-Terminated Modal (2nd violation) ── */}
      {proctorTerminated && (
        <div className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-4">
          <div className="fb-card rounded-2xl p-8 max-w-md w-full text-center space-y-4 border border-red-500 shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center mx-auto">
              <XCircle className="w-8 h-8 text-red-400" />
            </div>
            <h3 className="text-xl font-bold text-red-400">Exam Terminated</h3>
            <p className="text-xs text-text-secondary">
              Multiple tab switches detected. Your assessment has been auto-submitted and flagged for proctor review.
            </p>
            <Loader2 className="w-5 h-5 animate-spin text-red-400 mx-auto" />
          </div>
        </div>
      )}

      {/* ── TOP NAV / CONTEST HEADER ── */}
      <header className="h-14 border-b border-border bg-[#121212] flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (confirm("Leave assessment? Your progress is saved, but the timer will continue running.")) {
                router.push("/exams");
              }
            }}
            className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-hover transition-colors"
            title="Back to Exams"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-text-primary truncate max-w-[200px] sm:max-w-[300px]">
              {examTitle}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#E6C212]/10 text-[#E6C212] font-semibold border border-[#E6C212]/30 flex items-center gap-1">
              <Shield className="w-3 h-3" /> Proctored (1 Tab Switch Max)
            </span>
          </div>
        </div>

        {/* Center: Problem Tabs (Q1, Q2, Q3...) */}
        <div className="hidden md:flex items-center gap-1.5 bg-surface-alt p-1 rounded-xl border border-border">
          {problems.map((p, idx) => {
            const isCurrent = idx === activeProblem;
            const verdict = verdicts[p.id];
            return (
              <button
                key={p.id}
                onClick={() => {
                  setActiveProblem(idx);
                  setRunResults(null);
                  setSubmitResult(null);
                }}
                className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  isCurrent
                    ? "bg-[#E6C212] text-black shadow-md"
                    : verdict === "Accepted"
                    ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                    : verdict
                    ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                    : "text-text-muted hover:text-text-primary hover:bg-surface-hover"
                }`}
              >
                {verdict === "Accepted" ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                ) : verdict ? (
                  <XCircle className="w-3.5 h-3.5 text-red-400" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-text-muted/40" />
                )}
                <span>Q{idx + 1}</span>
              </button>
            );
          })}
        </div>

        {/* Right: Timer & Finish Action */}
        <div className="flex items-center gap-3">
          <div
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-mono text-sm font-bold border transition-colors ${
              timeLeft < 300
                ? "bg-red-500/20 border-red-500/40 text-red-400 animate-pulse"
                : "bg-surface-alt border-border text-text-primary"
            }`}
          >
            <Clock className="w-4 h-4 text-[#E6C212]" />
            <span>
              {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
            </span>
          </div>

          <button
            onClick={() => {
              if (confirm("Finish and submit your final assessment? This action is permanent.")) {
                handleComplete(false);
              }
            }}
            className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#E6C212] to-[#c9a810] text-black text-xs font-bold hover:brightness-110 transition-all shadow-md active:scale-95"
          >
            Finish Exam
          </button>
        </div>
      </header>

      {/* ── WORKSPACE SPLIT SCREEN ── */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT PANE: Problem Description & Inputs */}
        <section className="w-full md:w-[45%] lg:w-[42%] border-r border-border flex flex-col bg-[#101010] overflow-y-auto">
          {currentProblem ? (
            <div className="p-6 space-y-6">
              <div>
                <div className="flex items-center justify-between gap-3 mb-2">
                  <h1 className="text-xl font-bold text-text-primary">
                    {activeProblem + 1}. {currentProblem.title}
                  </h1>
                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-semibold capitalize ${
                        currentProblem.difficulty === "easy"
                          ? "bg-green-500/10 text-green-400 border border-green-500/20"
                          : currentProblem.difficulty === "medium"
                          ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                          : "bg-red-500/10 text-red-400 border border-red-500/20"
                      }`}
                    >
                      {currentProblem.difficulty}
                    </span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-surface-alt border border-border text-[#E6C212] font-semibold">
                      {currentProblem.points} pts
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-[11px] text-text-muted font-mono pt-1">
                  <span>⏱ Time Limit: {currentProblem.timeLimit || 2}s</span>
                  <span>💾 Memory Limit: {currentProblem.memoryLimit || 256}MB</span>
                </div>
              </div>

              <div className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">
                {currentProblem.statement}
              </div>

              {(currentProblem.inputFormat || currentProblem.outputFormat) && (
                <div className="space-y-3 pt-2">
                  {currentProblem.inputFormat && (
                    <div className="p-3.5 rounded-xl bg-surface-alt border border-border">
                      <h4 className="text-xs font-bold text-text-primary uppercase tracking-wide mb-1">
                        Input Format
                      </h4>
                      <p className="text-xs text-text-secondary whitespace-pre-wrap">
                        {currentProblem.inputFormat}
                      </p>
                    </div>
                  )}

                  {currentProblem.outputFormat && (
                    <div className="p-3.5 rounded-xl bg-surface-alt border border-border">
                      <h4 className="text-xs font-bold text-text-primary uppercase tracking-wide mb-1">
                        Output Format
                      </h4>
                      <p className="text-xs text-text-secondary whitespace-pre-wrap">
                        {currentProblem.outputFormat}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {currentProblem.constraints && currentProblem.constraints.length > 0 && (
                <div className="p-3.5 rounded-xl bg-surface-alt border border-border space-y-1.5">
                  <h4 className="text-xs font-bold text-text-primary uppercase tracking-wide mb-1">
                    Constraints
                  </h4>
                  <ul className="list-disc list-inside text-xs text-text-muted space-y-1 font-mono">
                    {currentProblem.constraints.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Sample Test Cases with Multi-Input Formatting */}
              {currentProblem.examples && currentProblem.examples.length > 0 && (
                <div className="space-y-4 pt-1">
                  <h4 className="text-xs font-bold text-text-primary uppercase tracking-wide">
                    Sample Test Cases
                  </h4>
                  {currentProblem.examples.map((ex, i) => (
                    <div
                      key={i}
                      className="rounded-xl border border-border bg-[#0d0d0d] overflow-hidden"
                    >
                      <div className="px-3.5 py-2 bg-surface-alt border-b border-border flex items-center justify-between">
                        <span className="text-xs font-semibold text-text-primary">
                          Example {i + 1}
                        </span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(ex.input);
                            setCopiedExample(i);
                            setTimeout(() => setCopiedExample(null), 2000);
                          }}
                          className="text-[11px] text-text-muted hover:text-text-primary transition-colors flex items-center gap-1"
                        >
                          {copiedExample === i ? (
                            <Check className="w-3 h-3 text-green-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                          <span>{copiedExample === i ? "Copied" : "Copy Input"}</span>
                        </button>
                      </div>

                      <div className="p-3.5 space-y-2 text-xs font-mono">
                        <div>
                          <span className="text-text-muted block text-[11px] mb-0.5">Input:</span>
                          <pre className="p-2 bg-[#050505] rounded-lg border border-border text-text-secondary overflow-x-auto whitespace-pre-wrap">
                            {ex.input}
                          </pre>
                        </div>
                        <div>
                          <span className="text-text-muted block text-[11px] mb-0.5">Expected Output:</span>
                          <pre className="p-2 bg-[#050505] rounded-lg border border-border text-text-secondary overflow-x-auto whitespace-pre-wrap">
                            {ex.output}
                          </pre>
                        </div>
                        {ex.explanation && (
                          <div className="pt-1 text-text-muted font-sans text-xs">
                            <strong className="text-text-secondary">Explanation: </strong>
                            {ex.explanation}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 text-center text-text-muted text-xs">
              No problems configured in this exam.
            </div>
          )}
        </section>

        {/* RIGHT PANE: Code Editor & Testcase Panel */}
        <section className="flex-1 flex flex-col bg-[#0b0b0b] overflow-hidden">
          <div className="h-12 border-b border-border bg-[#141414] flex items-center justify-between px-4 shrink-0">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-[#E6C212]" />
              <select
                value={currentLang}
                onChange={(e) => {
                  const newLang = e.target.value;
                  if (currentProblem) {
                    setLangMap((prev) => ({ ...prev, [currentProblem.id]: newLang }));
                    const currentCode = codeMap[currentProblem.id] || "";
                    const oldStarter = STARTER_CODE[currentLang] || "";
                    if (!currentCode || currentCode === oldStarter) {
                      setCodeMap((prev) => ({
                        ...prev,
                        [currentProblem.id]: STARTER_CODE[newLang] || "",
                      }));
                    }
                  }
                }}
                className="bg-surface-alt border border-border rounded-lg px-2.5 py-1 text-xs text-text-primary font-semibold focus:outline-none focus:border-[#E6C212]/60 cursor-pointer"
              >
                {(currentProblem?.supportedLangs || ["cpp", "python", "java", "javascript"]).map(
                  (l) => (
                    <option key={l} value={l}>
                      {LANG_MAP[l] || l}
                    </option>
                  )
                )}
              </select>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={handleRun}
                disabled={running || submitting}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-surface-alt border border-border text-xs font-semibold text-text-primary hover:bg-surface-hover hover:border-border-light disabled:opacity-40 transition-all active:scale-95"
              >
                {running ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#E6C212]" />
                ) : (
                  <Play className="w-3.5 h-3.5 text-text-muted" />
                )}
                <span>Run Code</span>
              </button>

              <button
                onClick={handleSubmit}
                disabled={running || submitting}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#E6C212] text-black text-xs font-bold hover:bg-[#c9a810] disabled:opacity-40 transition-all shadow-md active:scale-95"
              >
                {submitting ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
                <span>Submit Solution</span>
              </button>
            </div>
          </div>

          <div className="flex-1 min-h-0 relative">
            <MonacoEditor
              height="100%"
              language={MONACO_LANG_MAP[currentLang] || "plaintext"}
              theme="vs-dark"
              value={currentProblem ? codeMap[currentProblem.id] || "" : ""}
              onChange={(v) => {
                if (currentProblem) {
                  setCodeMap((prev) => ({
                    ...prev,
                    [currentProblem.id]: v || "",
                  }));
                }
              }}
              options={{
                minimap: { enabled: false },
                fontSize: 13.5,
                fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
                scrollBeyondLastLine: false,
                padding: { top: 14, bottom: 14 },
                lineNumbers: "on",
                tabSize: 4,
                wordWrap: "on",
                automaticLayout: true,
                cursorBlinking: "smooth",
                smoothScrolling: true,
              }}
            />
          </div>

          {/* ── Testcase & Results Bottom Panel ── */}
          <div className="h-56 border-t border-border bg-[#101010] flex flex-col shrink-0">
            <div className="h-9 px-4 border-b border-border bg-[#141414] flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setActiveTab("testcase")}
                  className={`text-xs font-semibold py-2 border-b-2 transition-colors flex items-center gap-1.5 ${
                    activeTab === "testcase"
                      ? "border-[#E6C212] text-[#E6C212]"
                      : "border-transparent text-text-muted hover:text-text-primary"
                  }`}
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Testcase</span>
                </button>
                <button
                  onClick={() => setActiveTab("result")}
                  className={`text-xs font-semibold py-2 border-b-2 transition-colors flex items-center gap-1.5 ${
                    activeTab === "result"
                      ? "border-[#E6C212] text-[#E6C212]"
                      : "border-transparent text-text-muted hover:text-text-primary"
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Test Result</span>
                </button>
              </div>

              {running && (
                <span className="text-[11px] text-[#E6C212] font-mono flex items-center gap-1.5">
                  <Loader2 className="w-3 h-3 animate-spin" /> Running sample test cases...
                </span>
              )}
              {submitting && (
                <span className="text-[11px] text-[#E6C212] font-mono flex items-center gap-1.5">
                  <Loader2 className="w-3 h-3 animate-spin" /> Evaluating all hidden test cases...
                </span>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {activeTab === "testcase" ? (
                <div className="space-y-3">
                  <div className="flex gap-2">
                    {(currentProblem?.examples || [{ input: "Sample input", output: "" }]).map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedCaseIdx(idx)}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                          selectedCaseIdx === idx
                            ? "bg-surface-alt text-text-primary border border-border"
                            : "text-text-muted hover:text-text-secondary"
                        }`}
                      >
                        Case {idx + 1}
                      </button>
                    ))}
                  </div>

                  {currentProblem?.examples?.[selectedCaseIdx] ? (
                    <div className="space-y-2 text-xs">
                      <div>
                        <span className="text-text-muted block text-[11px] mb-1 font-mono">Standard Input:</span>
                        <pre className="p-2.5 bg-[#050505] rounded-lg border border-border text-text-secondary font-mono whitespace-pre-wrap">
                          {currentProblem.examples[selectedCaseIdx].input}
                        </pre>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-text-muted">No test cases configured.</p>
                  )}
                </div>
              ) : (
                <div>
                  {runResults ? (
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        {runResults.map((res, idx) => (
                          <button
                            key={idx}
                            onClick={() => setSelectedCaseIdx(idx)}
                            className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                              selectedCaseIdx === idx
                                ? res.passed
                                  ? "bg-green-500/20 text-green-400 border border-green-500/40"
                                  : "bg-red-500/20 text-red-400 border border-red-500/40"
                                : "bg-surface-alt text-text-muted hover:text-text-primary"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                res.passed ? "bg-green-400" : "bg-red-400"
                              }`}
                            />
                            <span>Case {idx + 1}</span>
                          </button>
                        ))}
                      </div>

                      {runResults[selectedCaseIdx] && (
                        <div className="space-y-2.5 text-xs font-mono">
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2 py-0.5 rounded text-xs font-bold ${
                                runResults[selectedCaseIdx].passed
                                  ? "bg-green-500/20 text-green-400"
                                  : "bg-red-500/20 text-red-400"
                              }`}
                            >
                              {runResults[selectedCaseIdx].verdict}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <span className="text-text-muted block text-[11px] mb-1 font-sans">Input:</span>
                              <pre className="p-2 bg-[#050505] rounded border border-border text-text-secondary truncate whitespace-pre-wrap">
                                {runResults[selectedCaseIdx].input}
                              </pre>
                            </div>
                            <div>
                              <span className="text-text-muted block text-[11px] mb-1 font-sans">Expected Output:</span>
                              <pre className="p-2 bg-[#050505] rounded border border-border text-text-secondary truncate whitespace-pre-wrap">
                                {runResults[selectedCaseIdx].expectedOutput}
                              </pre>
                            </div>
                          </div>

                          <div>
                            <span className="text-text-muted block text-[11px] mb-1 font-sans">Actual Output:</span>
                            <pre
                              className={`p-2 rounded border text-text-secondary font-mono whitespace-pre-wrap ${
                                runResults[selectedCaseIdx].passed
                                  ? "bg-[#050505] border-green-500/20"
                                  : "bg-red-500/10 border-red-500/30 text-red-300"
                              }`}
                            >
                              {runResults[selectedCaseIdx].actualOutput ||
                                runResults[selectedCaseIdx].error ||
                                "(Empty output)"}
                            </pre>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : submitResult ? (
                    <div className="space-y-3">
                      <div
                        className={`p-4 rounded-xl border flex items-center justify-between ${
                          submitResult.verdict === "Accepted"
                            ? "bg-green-500/10 border-green-500/30"
                            : "bg-red-500/10 border-red-500/30"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {submitResult.verdict === "Accepted" ? (
                            <CheckCircle2 className="w-6 h-6 text-green-400" />
                          ) : (
                            <XCircle className="w-6 h-6 text-red-400" />
                          )}
                          <div>
                            <h4
                              className={`text-base font-bold ${
                                submitResult.verdict === "Accepted"
                                  ? "text-green-400"
                                  : "text-red-400"
                              }`}
                            >
                              {submitResult.verdict}
                            </h4>
                            <p className="text-xs text-text-muted mt-0.5">
                              Passed {submitResult.passedTests} / {submitResult.totalTests} test cases
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-text-muted">Points Awarded</p>
                          <p className="text-lg font-black text-text-primary">
                            +{submitResult.score} pts
                          </p>
                        </div>
                      </div>

                      {submitResult.error && (
                        <div className="p-3 rounded-lg bg-[#050505] border border-red-500/30">
                          <p className="text-xs font-semibold text-red-400 mb-1">Execution / Traceback Error:</p>
                          <pre className="text-xs text-red-300 font-mono whitespace-pre-wrap overflow-x-auto max-h-24">
                            {submitResult.error}
                          </pre>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center text-center text-text-muted text-xs py-8">
                      <p>Click &quot;Run Code&quot; to test sample cases, or &quot;Submit Solution&quot; to evaluate against all hidden test cases.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
