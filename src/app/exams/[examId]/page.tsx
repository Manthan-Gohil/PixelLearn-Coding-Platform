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
  Lock,
  Key,
  EyeOff,
  Maximize,
  Camera,
  Mic,
  Video,
  Volume2,
  UserCheck,
} from "lucide-react";
import { useExamProctor } from "@/hooks/useExamProctor";
import ExamProctorHUD from "@/components/exams/ExamProctorHUD";

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

  // Proctoring: STRICT FULL-SCREEN & TAB-SWITCH PASSWORD LOCK
  const [violations, setViolations] = useState<{ type: string; timestamp: string }[]>([]);
  const [showPasteAlert, setShowPasteAlert] = useState(false);
  const [copiedExample, setCopiedExample] = useState<number | null>(null);
  const violationCount = useRef(0);
  const completed = useRef(false);

  // Full-screen state & enforcement
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [requiresFullscreenModal, setRequiresFullscreenModal] = useState(true);

  // Tab switch termination with password
  const [tabSwitchLocked, setTabSwitchLocked] = useState(false);
  const [tabSwitchTime, setTabSwitchTime] = useState<string | null>(null);
  const [terminationPassword, setTerminationPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isTerminating, setIsTerminating] = useState(false);

  // ── Helper: Exit fullscreen safely ──
  const exitExamFullscreen = async () => {
    try {
      if (typeof document !== "undefined" && document.fullscreenElement) {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          await (document as any).webkitExitFullscreen();
        }
      }
    } catch {}
  };

  // ── Helper: Request fullscreen ──
  const requestExamFullscreen = async () => {
    try {
      const elem = document.documentElement as any;
      if (elem.requestFullscreen) {
        await elem.requestFullscreen();
      } else if (elem.webkitRequestFullscreen) {
        await elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) {
        await elem.msRequestFullscreen();
      }
      setIsFullscreen(true);
      setRequiresFullscreenModal(false);
    } catch (err) {
      console.warn("Fullscreen request error:", err);
      setRequiresFullscreenModal(false);
    }
  };

  // ── Auto-submit on completion / proctor termination ──
  const questionStatsRef = useRef<Record<string, unknown>>({});

  const handleComplete = useCallback(
    async (terminated: boolean) => {
      if (completed.current) return;
      completed.current = true;

      await exitExamFullscreen();

      try {
        await fetch(`/api/exams/${examId}/complete`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            terminatedByProctor: terminated,
            violations,
            cognitiveTelemetry: questionStatsRef.current,
          }),
        });
      } catch {}

      router.push(`/exams/${examId}/results`);
    },
    [examId, violations, router]
  );

  // ── Handle password termination on tab switch ──
  const handlePasswordTermination = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const normalized = terminationPassword.trim().toUpperCase();
    if (normalized !== "TERMINATE" && normalized !== "PROCTOR2026" && normalized !== "QUIT") {
      setPasswordError("Invalid passkey. Type 'TERMINATE' to confirm termination or enter the supervisor password.");
      return;
    }
    setPasswordError("");
    setIsTerminating(true);
    await handleComplete(true);
  };

  const currentProblem = problems[activeProblem];

  // ── AI Video, Audio, Head Pose & Expression Proctoring Hook ──
  const {
    stream: proctorStream,
    hasPermission: cameraPermission,
    permissionError: cameraError,
    requestMediaPermissions,
    videoElementRef,
    audioLevel,
    currentExpression,
    isLookingAway,
    isFaceDetected,
    activeWarning: proctorWarning,
    questionStats,
  } = useExamProctor({
    activeQuestionId: currentProblem?.id,
    activeQuestionTitle: currentProblem?.title,
    isExamActive: !loading && !tabSwitchLocked && !completed.current,
    onViolation: useCallback((v: { type: string; timestamp: string; details?: string }) => {
      setViolations((prev) => [...prev, v]);
    }, []),
  });

  useEffect(() => {
    questionStatsRef.current = questionStats;
  }, [questionStats]);

  const handleLaunchProctoredExam = async () => {
    await requestMediaPermissions();
    await requestExamFullscreen();
  };

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

  // ── Strict Proctoring: Fullscreen Enforcement & Tab-Switch Lock with Password ──
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden && !completed.current && !loading) {
        violationCount.current++;
        const nowIso = new Date().toLocaleTimeString();
        setTabSwitchTime(nowIso);
        const v = { type: "tab_switch", timestamp: new Date().toISOString() };
        setViolations((prev) => [...prev, v]);
        setTabSwitchLocked(true);
      }
    };

    const handleBlur = () => {
      if (!completed.current && !loading) {
        violationCount.current++;
        const nowIso = new Date().toLocaleTimeString();
        setTabSwitchTime((prev) => prev || nowIso);
        const v = { type: "window_blur", timestamp: new Date().toISOString() };
        setViolations((prev) => [...prev, v]);
        setTabSwitchLocked(true);
      }
    };

    const handleFullscreenChange = () => {
      const inFs = !!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement
      );
      setIsFullscreen(inFs);
      if (!inFs && !completed.current && !loading) {
        const v = { type: "fullscreen_exit", timestamp: new Date().toISOString() };
        setViolations((prev) => [...prev, v]);
        setRequiresFullscreenModal(true);
      }
    };

    // Prevent copy/paste/cut/drop and right click with capture phase (true)
    const handleClipboard = (e: ClipboardEvent) => {
      if (completed.current) return;
      if (e.type === "paste") {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        setShowPasteAlert(true);
        const v = { type: "paste_attempt", timestamp: new Date().toISOString() };
        setViolations((prev) => [...prev, v]);
      } else if (e.type === "copy" || e.type === "cut") {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (completed.current) return;
      if ((e.ctrlKey || e.metaKey) && (e.key === "v" || e.key === "V")) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        setShowPasteAlert(true);
        const v = { type: "paste_attempt", timestamp: new Date().toISOString() };
        setViolations((prev) => [...prev, v]);
      } else if (
        (e.ctrlKey || e.metaKey) &&
        (e.key === "c" || e.key === "C" || e.key === "x" || e.key === "X")
      ) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
      }
    };

    const handleDrop = (e: DragEvent) => {
      if (completed.current) return;
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
    };

    const handleContextMenu = (e: MouseEvent) => {
      if (completed.current) return;
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
    };

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("blur", handleBlur);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("copy", handleClipboard, true);
    document.addEventListener("paste", handleClipboard, true);
    document.addEventListener("cut", handleClipboard, true);
    document.addEventListener("drop", handleDrop, true);
    document.addEventListener("keydown", handleKeyDown, true);
    document.addEventListener("contextmenu", handleContextMenu, true);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("blur", handleBlur);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
      document.removeEventListener("copy", handleClipboard, true);
      document.removeEventListener("paste", handleClipboard, true);
      document.removeEventListener("cut", handleClipboard, true);
      document.removeEventListener("drop", handleDrop, true);
      document.removeEventListener("keydown", handleKeyDown, true);
      document.removeEventListener("contextmenu", handleContextMenu, true);
    };
  }, [handleComplete, loading]);

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

  const currentLang = langMap[currentProblem?.id] || "cpp";
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="h-screen flex flex-col bg-[#0a0a0a] text-white overflow-hidden font-sans select-none">
      {/* ── Anti-Cheat Paste Blocked Alert Modal ── */}
      {showPasteAlert && (
        <div className="fixed inset-0 z-[250] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#181818] border-2 border-yellow-500/80 text-white rounded-2xl p-6 sm:p-8 max-w-md w-full text-center space-y-4 shadow-2xl animate-scale-in">
            <div className="w-16 h-16 rounded-full bg-yellow-500/20 border border-yellow-500/50 flex items-center justify-center mx-auto shadow-inner">
              <ShieldAlert className="w-8 h-8 text-[#E6C212]" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-white mb-2">
                Pasting Code Is Disabled
              </h3>
              <p className="text-xs text-neutral-300 leading-relaxed">
                To guarantee assessment integrity and fair evaluation, copying and pasting external code into the test workspace is strictly prohibited. Please write your code manually.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 text-xs font-semibold">
              ⚠️ All clipboard and paste attempts are recorded in your proctoring audit log.
            </div>
            <button
              onClick={() => setShowPasteAlert(false)}
              className="w-full py-3 px-6 rounded-xl bg-[#E6C212] hover:bg-[#d4b20f] text-black font-extrabold text-sm transition-all shadow-lg active:scale-98 cursor-pointer"
            >
              I Understand, Continue Assessment
            </button>
          </div>
        </div>
      )}

      {/* ── Fullscreen & Camera/Audio Pre-Flight Security Gate Modal ── */}
      {requiresFullscreenModal && !tabSwitchLocked && (
        <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#181818] border-2 border-[#E6C212]/80 text-white rounded-2xl p-6 sm:p-8 max-w-lg w-full text-center space-y-5 shadow-2xl animate-scale-in">
            <div className="w-16 h-16 rounded-full bg-[#E6C212]/20 border border-[#E6C212]/50 flex items-center justify-center mx-auto shadow-inner">
              <Shield className="w-8 h-8 text-[#E6C212]" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E6C212]/10 border border-[#E6C212]/30 text-[#E6C212] text-xs font-semibold mb-2">
                <Camera className="w-3.5 h-3.5" /> AI Audio, Video & Full-Screen Proctor
              </div>
              <h2 className="text-2xl font-black text-white">
                Enter Proctored Assessment
              </h2>
              <p className="text-xs text-neutral-300 mt-2 leading-relaxed">
                To guarantee academic integrity, this exam operates in <strong className="text-white">Full-Screen Mode</strong> with continuous <strong className="text-white">Camera & Microphone Monitoring</strong>.
              </p>
            </div>

            <div className="text-left space-y-2.5 bg-black/60 border border-white/10 rounded-xl p-4 text-xs text-neutral-300 font-medium">
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-md bg-yellow-500/20 text-[#E6C212] flex items-center justify-center shrink-0 mt-0.5 font-bold">1</div>
                <span><strong>Full-Screen Lock:</strong> The exam will occupy your entire screen. Browser tabs and external windows are blocked.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-md bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 mt-0.5 font-bold">2</div>
                <span><strong>Webcam & Audio Capture:</strong> Your camera and microphone remain active throughout. Background voice and head movement are monitored in real time.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-md bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 font-bold">3</div>
                <span><strong>Facial Expression Analytics:</strong> Real-time AI tracks your cognitive state (Tensed ⚡, Relaxed 🌿, Focused 🎯) for each problem.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-md bg-red-500/20 text-red-400 flex items-center justify-center shrink-0 mt-0.5 font-bold">4</div>
                <span><strong>Zero-Tolerance Tab Switching:</strong> Switching tabs or minimizing immediately freezes the exam and prompts for the supervisor termination password.</span>
              </div>
            </div>

            {cameraError && (
              <div className="p-2.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs text-left">
                ⚠️ {cameraError}
              </div>
            )}

            <button
              onClick={handleLaunchProctoredExam}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#E6C212] to-[#d4b20f] hover:brightness-110 text-black font-extrabold text-sm transition-all shadow-xl active:scale-98 cursor-pointer flex items-center justify-center gap-2"
            >
              <Maximize2 className="w-4 h-4" />
              <span>Enable Camera/Mic, Enter Full-Screen & Begin</span>
            </button>
          </div>
        </div>
      )}

      {/* ── Strict Tab-Switch Password Termination Modal ── */}
      {tabSwitchLocked && (
        <div className="fixed inset-0 z-[350] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="bg-[#141414] border-2 border-red-500 rounded-2xl p-6 sm:p-8 max-w-lg w-full text-center space-y-5 shadow-2xl shadow-red-950/50 animate-scale-in text-white">
            <div className="w-16 h-16 rounded-full bg-red-500/20 border-2 border-red-500/60 flex items-center justify-center mx-auto animate-pulse">
              <ShieldAlert className="w-9 h-9 text-red-400" />
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-bold mb-2">
                <AlertTriangle className="w-3.5 h-3.5 text-red-400" /> Proctor Security Alert
              </div>
              <h2 className="text-2xl font-black text-red-400">
                Exam Session Locked & Terminated
              </h2>
              <p className="text-xs text-neutral-300 mt-2 leading-relaxed">
                An unauthorized tab switch or window departure was detected{tabSwitchTime ? ` at ${tabSwitchTime}` : ""}.
                Leaving the proctored assessment workspace is strictly prohibited.
              </p>
            </div>

            {/* Notification Bar */}
            <div className="p-3.5 rounded-xl bg-red-950/80 border border-red-500/40 text-red-200 text-xs font-semibold text-left flex items-center gap-2.5">
              <EyeOff className="w-5 h-5 text-red-400 shrink-0" />
              <div>
                <p className="font-bold text-red-300">Violation Audit Record Logged</p>
                <p className="text-[11px] text-neutral-300 font-mono mt-0.5">
                  Action: Tab Switch / Focus Loss | Status: Flagged for Invigilator Review
                </p>
              </div>
            </div>

            {/* Password input form */}
            <form onSubmit={handlePasswordTermination} className="space-y-3.5 text-left pt-1">
              <div>
                <label className="block text-xs font-bold text-neutral-200 mb-1.5 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-[#E6C212]" />
                  <span>Enter Termination Password:</span>
                </label>
                <input
                  type="password"
                  value={terminationPassword}
                  onChange={(e) => {
                    setTerminationPassword(e.target.value);
                    setPasswordError("");
                  }}
                  placeholder="Type 'TERMINATE' or enter supervisor password..."
                  disabled={isTerminating}
                  className="w-full px-4 py-2.5 bg-black/80 border border-border rounded-xl text-xs font-mono text-white placeholder:text-neutral-500 focus:outline-none focus:border-red-500 transition-colors"
                  autoFocus
                />
                <p className="text-[11px] text-neutral-400 mt-1 font-mono">
                  Tip: Type <span className="text-[#E6C212] font-bold">TERMINATE</span> to acknowledge violation and finalize submission.
                </p>
              </div>

              {passwordError && (
                <div className="p-2.5 rounded-lg bg-red-900/40 border border-red-500/40 text-red-300 text-xs font-medium">
                  {passwordError}
                </div>
              )}

              <button
                type="submit"
                disabled={isTerminating || !terminationPassword.trim()}
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 disabled:opacity-50 text-white font-extrabold text-xs transition-all shadow-lg active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isTerminating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Submitting Violation & Finalizing Assessment...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Confirm Password & Terminate Exam</span>
                  </>
                )}
              </button>
            </form>
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
              <Shield className="w-3 h-3" /> Full-Screen Proctored
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
          {!isFullscreen && (
            <button
              onClick={requestExamFullscreen}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-yellow-500/20 text-[#E6C212] border border-yellow-500/40 text-xs font-semibold hover:bg-yellow-500/30 transition-colors animate-pulse"
              title="Re-enter Full-Screen Mode"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Full-Screen</span>
            </button>
          )}

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
        <section className="w-full md:w-[45%] lg:w-[42%] border-r border-border flex flex-col bg-[#101010] overflow-y-auto overscroll-contain">
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
              onMount={(editor, monaco) => {
                editor.onKeyDown((e) => {
                  if ((e.ctrlKey || e.metaKey) && e.keyCode === monaco.KeyCode.KeyV) {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowPasteAlert(true);
                    const v = { type: "paste_attempt", timestamp: new Date().toISOString() };
                    setViolations((prev) => [...prev, v]);
                  }
                  if (
                    (e.ctrlKey || e.metaKey) &&
                    (e.keyCode === monaco.KeyCode.KeyC || e.keyCode === monaco.KeyCode.KeyX)
                  ) {
                    e.preventDefault();
                    e.stopPropagation();
                  }
                });
              }}
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
                contextmenu: false,
                copyWithSyntaxHighlighting: false,
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

      {/* ── Live Picture-in-Picture Audio, Video & Facial Expression Proctor HUD ── */}
      {!loading && !requiresFullscreenModal && !tabSwitchLocked && (
        <ExamProctorHUD
          stream={proctorStream}
          videoElementRef={videoElementRef}
          audioLevel={audioLevel}
          currentExpression={currentExpression}
          isLookingAway={isLookingAway}
          isFaceDetected={isFaceDetected}
          activeWarning={proctorWarning}
        />
      )}
    </div>
  );
}
