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
} from "lucide-react";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full bg-[#0d0d0d] text-text-muted">
      <Loader2 className="w-6 h-6 animate-spin" />
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
  cpp: "C++",
  python: "Python",
  java: "Java",
  javascript: "JavaScript",
};

const MONACO_LANG_MAP: Record<string, string> = {
  cpp: "cpp",
  python: "python",
  java: "java",
  javascript: "javascript",
};

const STARTER_CODE: Record<string, string> = {
  cpp: '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    // Your code here\n    \n    return 0;\n}\n',
  python: '# Your code here\n\n',
  java: 'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Your code here\n        \n    }\n}\n',
  javascript: '// Your code here\nconst readline = require("readline");\nconst rl = readline.createInterface({ input: process.stdin });\nconst lines = [];\nrl.on("line", (l) => lines.push(l));\nrl.on("close", () => {\n    // Process input here\n    \n});\n',
};

export default function ExamInterfacePage() {
  const params = useParams();
  const router = useRouter();
  const examId = params.examId as string;

  const [loading, setLoading] = useState(true);
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
  const [runResults, setRunResults] = useState<RunResult[] | null>(null);
  const [submitResult, setSubmitResult] = useState<SubmitResult | null>(null);
  const [verdicts, setVerdicts] = useState<Record<string, string>>({});

  // Proctoring
  const [violations, setViolations] = useState<{ type: string; timestamp: string }[]>([]);
  const [showWarning, setShowWarning] = useState(false);
  const violationCount = useRef(0);
  const completed = useRef(false);

  // Initialize exam
  useEffect(() => {
    async function init() {
      try {
        // Start exam attempt
        const res = await fetch(`/api/exams/${examId}/start`, {
          method: "POST",
        });
        const data = await res.json();

        if (res.status === 409 && data.attempt) {
          // Already started — check if completed
          if (data.attempt.completedAt) {
            router.push(`/exams/${examId}/results`);
            return;
          }
          // Resume — fetch exam details
          const detRes = await fetch(`/api/exams/${examId}`);
          const detData = await detRes.json();

          if (detData.exam) {
            setExamTitle(detData.exam.title);
            setProblems(detData.exam.problems);
            setDeadline(new Date(data.attempt.deadline));
            setAttemptId(data.attempt.id);

            // Init code/lang
            const codes: Record<string, string> = {};
            const langs: Record<string, string> = {};
            const vds: Record<string, string> = {};
            for (const p of detData.exam.problems) {
              const defaultLang = p.supportedLangs[0] || "cpp";
              codes[p.id] = STARTER_CODE[defaultLang] || "";
              langs[p.id] = defaultLang;
            }
            // Apply saved submissions
            if (detData.attempt?.submissions) {
              for (const s of detData.attempt.submissions) {
                if (!codes[s.problemId] || s.code) {
                  codes[s.problemId] = s.code;
                  langs[s.problemId] = s.language;
                  vds[s.problemId] = s.verdict;
                }
              }
            }
            setCodeMap(codes);
            setLangMap(langs);
            setVerdicts(vds);
          }
        } else if (data.exam) {
          // Fresh start
          setExamTitle(data.exam.title);
          setProblems(data.exam.problems);
          setDeadline(new Date(data.attempt.deadline));
          setAttemptId(data.attempt.id);

          const codes: Record<string, string> = {};
          const langs: Record<string, string> = {};
          for (const p of data.exam.problems) {
            const defaultLang = p.supportedLangs[0] || "cpp";
            codes[p.id] = STARTER_CODE[defaultLang] || "";
            langs[p.id] = defaultLang;
          }
          setCodeMap(codes);
          setLangMap(langs);
        } else {
          router.push("/exams");
          return;
        }
      } catch {
        router.push("/exams");
        return;
      }
      setLoading(false);
    }
    init();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [examId]);

  // Timer
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deadline]);

  // Proctoring
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden && !completed.current) {
        violationCount.current++;
        const v = { type: "tab_switch", timestamp: new Date().toISOString() };
        setViolations((prev) => [...prev, v]);
        if (violationCount.current >= 3) {
          handleComplete(true);
        } else {
          setShowWarning(true);
        }
      }
    };

    // Block copy/paste/cut
    const blockEvent = (e: Event) => {
      if (!completed.current) {
        e.preventDefault();
      }
    };

    // Block right-click
    const blockContext = (e: MouseEvent) => {
      if (!completed.current) {
        e.preventDefault();
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    document.addEventListener("copy", blockEvent);
    document.addEventListener("paste", blockEvent);
    document.addEventListener("cut", blockEvent);
    document.addEventListener("contextmenu", blockContext);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      document.removeEventListener("copy", blockEvent);
      document.removeEventListener("paste", blockEvent);
      document.removeEventListener("cut", blockEvent);
      document.removeEventListener("contextmenu", blockContext);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const handleRun = async () => {
    const problem = problems[activeProblem];
    if (!problem || running) return;
    setRunning(true);
    setRunResults(null);
    setSubmitResult(null);

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
      if (data.results) setRunResults(data.results);
      else if (data.error) setRunResults([{ input: "", expectedOutput: "", actualOutput: "", verdict: data.error, passed: false, error: data.error }]);
    } catch {
      setRunResults([{ input: "", expectedOutput: "", actualOutput: "", verdict: "Error", passed: false, error: "Network error" }]);
    }
    setRunning(false);
  };

  const handleSubmit = async () => {
    const problem = problems[activeProblem];
    if (!problem || submitting) return;
    setSubmitting(true);
    setSubmitResult(null);
    setRunResults(null);

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
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#E6C212]" />
      </div>
    );
  }

  const currentProblem = problems[activeProblem];
  const currentLang = langMap[currentProblem?.id] || "cpp";
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="h-screen flex flex-col bg-surface text-text-primary overflow-hidden">
      {/* Warning Modal */}
      {showWarning && (
        <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4">
          <div className="fb-card rounded-xl p-8 max-w-md w-full text-center animate-slide-up" style={{ animationDuration: "0.3s" }}>
            <AlertTriangle className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-text-primary mb-2">
              Proctoring Warning! ({violationCount.current}/3)
            </h3>
            <p className="text-text-secondary mb-6">
              Tab switch detected. After <strong>3 violations</strong> your exam will be automatically
              submitted and terminated.
            </p>
            <button onClick={() => setShowWarning(false)} className="fb-btn-primary">
              I Understand
            </button>
          </div>
        </div>
      )}

      {/* Top Bar */}
      <div className="h-12 border-b border-border bg-surface-card flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (confirm("Are you sure you want to leave? Your progress is saved.")) {
                router.push("/exams");
              }
            }}
            className="text-text-muted hover:text-text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <span className="font-semibold text-sm text-text-primary">{examTitle}</span>
          <span className="text-xs text-text-muted flex items-center gap-1">
            <Shield className="w-3 h-3" /> Proctored
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div
            className={`flex items-center gap-2 px-3 py-1 rounded-lg font-mono text-sm font-bold ${
              timeLeft < 300
                ? "bg-red-500/20 text-red-400 animate-pulse"
                : "bg-surface-alt text-text-primary"
            }`}
          >
            <Clock className="w-4 h-4" />
            {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
          </div>
          <button
            onClick={() => {
              if (confirm("Submit exam and finish? This cannot be undone.")) {
                handleComplete(false);
              }
            }}
            className="px-3 py-1 rounded-lg bg-[#E6C212] text-black text-sm font-semibold hover:bg-[#c9a810] transition-colors"
          >
            Finish Exam
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Problem Sidebar */}
        <div className="w-12 border-r border-border bg-surface-card flex flex-col items-center py-2 gap-1 shrink-0">
          {problems.map((p, i) => (
            <button
              key={p.id}
              onClick={() => {
                setActiveProblem(i);
                setRunResults(null);
                setSubmitResult(null);
              }}
              title={p.title}
              className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                i === activeProblem
                  ? "bg-[#E6C212] text-black"
                  : verdicts[p.id] === "Accepted"
                  ? "bg-green-500/20 text-green-400 border border-green-500/30"
                  : verdicts[p.id]
                  ? "bg-red-500/20 text-red-400 border border-red-500/30"
                  : "bg-surface-alt text-text-muted hover:bg-surface-hover"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>

        {/* Problem Panel */}
        <div className="w-[45%] min-w-[300px] border-r border-border overflow-y-auto p-5">
          {currentProblem && (
            <div className="space-y-5">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-lg font-bold text-text-primary">
                    {activeProblem + 1}. {currentProblem.title}
                  </h2>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      currentProblem.difficulty === "easy"
                        ? "bg-green-500/10 text-green-400"
                        : currentProblem.difficulty === "medium"
                        ? "bg-yellow-500/10 text-yellow-400"
                        : "bg-red-500/10 text-red-400"
                    }`}
                  >
                    {currentProblem.difficulty} · {currentProblem.points} pts
                  </span>
                </div>
              </div>

              <div className="text-sm text-text-secondary whitespace-pre-wrap">
                {currentProblem.statement}
              </div>

              {currentProblem.constraints.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-text-primary mb-1">
                    Constraints
                  </h4>
                  <ul className="list-disc list-inside text-sm text-text-muted space-y-0.5">
                    {currentProblem.constraints.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>
              )}

              {currentProblem.inputFormat && (
                <div>
                  <h4 className="text-sm font-semibold text-text-primary mb-1">
                    Input Format
                  </h4>
                  <p className="text-sm text-text-muted whitespace-pre-wrap">
                    {currentProblem.inputFormat}
                  </p>
                </div>
              )}

              {currentProblem.outputFormat && (
                <div>
                  <h4 className="text-sm font-semibold text-text-primary mb-1">
                    Output Format
                  </h4>
                  <p className="text-sm text-text-muted whitespace-pre-wrap">
                    {currentProblem.outputFormat}
                  </p>
                </div>
              )}

              {(currentProblem.examples as { input: string; output: string; explanation?: string }[]).map(
                (ex, i) => (
                  <div key={i} className="space-y-2">
                    <h4 className="text-sm font-semibold text-text-primary">
                      Example {i + 1}
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-xs text-text-muted mb-1">Input</p>
                        <pre className="p-2 bg-[#0d0d0d] rounded-lg text-xs text-text-secondary font-mono overflow-x-auto">
                          {ex.input}
                        </pre>
                      </div>
                      <div>
                        <p className="text-xs text-text-muted mb-1">Output</p>
                        <pre className="p-2 bg-[#0d0d0d] rounded-lg text-xs text-text-secondary font-mono overflow-x-auto">
                          {ex.output}
                        </pre>
                      </div>
                    </div>
                    {ex.explanation && (
                      <p className="text-xs text-text-muted italic">
                        💡 {ex.explanation}
                      </p>
                    )}
                  </div>
                )
              )}
            </div>
          )}
        </div>

        {/* Editor Panel */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Editor Header */}
          <div className="h-10 border-b border-border bg-surface-card flex items-center justify-between px-3 shrink-0">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-text-muted" />
              <select
                value={currentLang}
                onChange={(e) => {
                  const newLang = e.target.value;
                  if (currentProblem) {
                    setLangMap((prev) => ({ ...prev, [currentProblem.id]: newLang }));
                    // Only reset code if it's still default starter code
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
                className="bg-surface-alt border border-border rounded px-2 py-0.5 text-xs text-text-primary focus:outline-none"
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

            <div className="flex items-center gap-2">
              <button
                onClick={handleRun}
                disabled={running || submitting}
                className="flex items-center gap-1 px-3 py-1 rounded bg-surface-alt border border-border text-xs text-text-primary hover:bg-surface-hover disabled:opacity-40 transition-colors"
              >
                {running ? <Loader2 className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3" />}
                Run
              </button>
              <button
                onClick={handleSubmit}
                disabled={running || submitting}
                className="flex items-center gap-1 px-3 py-1 rounded bg-[#E6C212] text-black text-xs font-semibold hover:bg-[#c9a810] disabled:opacity-40 transition-colors"
              >
                {submitting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                Submit
              </button>
            </div>
          </div>

          {/* Monaco Editor */}
          <div className="flex-1 min-h-0">
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
                fontSize: 14,
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                scrollBeyondLastLine: false,
                padding: { top: 16 },
                lineNumbers: "on",
                tabSize: 4,
                wordWrap: "on",
                automaticLayout: true,
              }}
            />
          </div>

          {/* Output Panel */}
          {(runResults || submitResult) && (
            <div className="h-48 border-t border-border bg-surface-card overflow-y-auto p-3 shrink-0">
              {runResults && (
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-text-muted uppercase">
                    Sample Test Results
                  </h4>
                  {runResults.map((r, i) => (
                    <div
                      key={i}
                      className={`p-2 rounded-lg text-xs ${
                        r.passed
                          ? "bg-green-500/10 border border-green-500/20"
                          : "bg-red-500/10 border border-red-500/20"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        {r.passed ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5 text-red-400" />
                        )}
                        <span
                          className={`font-medium ${
                            r.passed ? "text-green-400" : "text-red-400"
                          }`}
                        >
                          Test {i + 1}: {r.verdict}
                        </span>
                      </div>
                      {!r.passed && (
                        <div className="grid grid-cols-2 gap-2 mt-1">
                          <div>
                            <p className="text-text-muted">Expected:</p>
                            <pre className="text-text-secondary font-mono">
                              {r.expectedOutput}
                            </pre>
                          </div>
                          <div>
                            <p className="text-text-muted">Got:</p>
                            <pre className="text-text-secondary font-mono">
                              {r.actualOutput || r.error || "(empty)"}
                            </pre>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {submitResult && (
                <div
                  className={`p-3 rounded-lg ${
                    submitResult.verdict === "Accepted"
                      ? "bg-green-500/10 border border-green-500/20"
                      : "bg-red-500/10 border border-red-500/20"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {submitResult.verdict === "Accepted" ? (
                      <CheckCircle2 className="w-5 h-5 text-green-400" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-400" />
                    )}
                    <span
                      className={`font-semibold text-sm ${
                        submitResult.verdict === "Accepted"
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {submitResult.verdict}
                    </span>
                    <span className="text-xs text-text-muted ml-auto">
                      {submitResult.passedTests}/{submitResult.totalTests} test cases ·{" "}
                      {submitResult.score} pts
                    </span>
                  </div>
                  {submitResult.error && (
                    <pre className="text-xs text-red-300 mt-2 font-mono overflow-x-auto">
                      {submitResult.error}
                    </pre>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
