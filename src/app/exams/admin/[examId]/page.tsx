"use client";

import { useState, useEffect } from "react";
import { useApp } from "@/store";
import { useParams, useRouter } from "next/navigation";
import StandardLayout from "@/components/layout/StandardLayout";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Save,
  ChevronDown,
  ChevronRight,
  Loader2,
  Eye,
  EyeOff,
  Code2,
  Users,
  Shield,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  FileCode,
  ShieldAlert,
  ShieldCheck,
  Search,
  ExternalLink,
  Copy,
  Check,
  Layers,
  Sparkles,
} from "lucide-react";

interface TestCase {
  id: string;
  input: string;
  output: string;
  isSample: boolean;
}

interface Problem {
  id: string;
  title: string;
  statement: string;
  constraints: string[];
  inputFormat: string;
  outputFormat: string;
  examples: { input: string; output: string; explanation?: string }[];
  difficulty: string;
  points: number;
  timeLimit: number;
  memoryLimit: number;
  supportedLangs: string[];
  order: number;
  testCases: TestCase[];
  _count?: { testCases: number };
}

interface ExamData {
  id: string;
  title: string;
  description: string;
  duration: number;
  isPublished: boolean;
  problems: Problem[];
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

interface MultiBoxTestCase {
  inputs: string[];
  output: string;
  isSample: boolean;
}

export default function ExamEditorPage() {
  const { user } = useApp();
  const params = useParams();
  const router = useRouter();
  const examId = params.examId as string;

  const [exam, setExam] = useState<ExamData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [expandedProblem, setExpandedProblem] = useState<string | null>(null);
  const [addingProblem, setAddingProblem] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Multi-parameter problem form
  const [paramCount, setParamCount] = useState(2); // e.g. 2 inputs (nums, target)
  const [paramLabels, setParamLabels] = useState(["nums", "target"]);
  const [pForm, setPForm] = useState({
    title: "",
    statement: "",
    constraints: "1 <= N <= 10^5\n1 <= nums[i] <= 10^9\n1 <= target <= 10^9",
    inputFormat: "Line 1: Array of integers (nums)\nLine 2: Target integer (target)",
    outputFormat: "Indices of the two numbers such that they add up to target.",
    examples: [{ input: "2 7 11 15\n9", output: "0 1", explanation: "nums[0] + nums[1] == 9, return [0, 1]" }],
    difficulty: "medium",
    points: 100,
    timeLimit: 2,
    memoryLimit: 256,
    supportedLangs: ["cpp", "python", "java", "javascript"],
    multiBoxTestCases: [
      { inputs: ["2 7 11 15", "9"], output: "0 1", isSample: true },
      { inputs: ["3 2 4", "6"], output: "1 2", isSample: true },
      { inputs: ["3 3", "6"], output: "0 1", isSample: false },
    ] as MultiBoxTestCase[],
  });

  // Results viewing
  const [results, setResults] = useState<CandidateAttempt[] | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateAttempt | null>(null);
  const [activeSubProblemId, setActiveSubProblemId] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!user.isAdmin) {
      router.push("/exams");
      return;
    }
    fetchExam();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [examId]);

  const fetchExam = async () => {
    try {
      const res = await fetch(`/api/exams/${examId}`);
      const data = await res.json();
      setExam(data.exam);
      if (data.exam?.problems?.length > 0 && !expandedProblem) {
        setExpandedProblem(data.exam.problems[0].id);
      }
    } catch {}
    setLoading(false);
  };

  const updateExam = async (updates: Record<string, unknown>) => {
    setSaving(true);
    try {
      await fetch(`/api/exams/${examId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      fetchExam();
      showTemporaryStatus("Exam settings updated successfully.");
    } catch {}
    setSaving(false);
  };

  const showTemporaryStatus = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleAddParam = () => {
    setParamCount((c) => c + 1);
    setParamLabels((prev) => [...prev, `param${prev.length + 1}`]);
    setPForm((prev) => ({
      ...prev,
      multiBoxTestCases: prev.multiBoxTestCases.map((tc) => ({
        ...tc,
        inputs: [...tc.inputs, ""],
      })),
    }));
  };

  const handleRemoveParam = (idx: number) => {
    if (paramCount <= 1) return;
    setParamCount((c) => c - 1);
    setParamLabels((prev) => prev.filter((_, i) => i !== idx));
    setPForm((prev) => ({
      ...prev,
      multiBoxTestCases: prev.multiBoxTestCases.map((tc) => ({
        ...tc,
        inputs: tc.inputs.filter((_, i) => i !== idx),
      })),
    }));
  };

  const addProblem = async () => {
    if (!pForm.title.trim() || !pForm.statement.trim()) {
      alert("Please provide problem title and statement.");
      return;
    }
    setAddingProblem(true);
    try {
      // Flatten multi-box inputs by joining with \n
      const testCasesToSubmit = pForm.multiBoxTestCases.map((tc) => ({
        input: tc.inputs.join("\n").trim(),
        output: tc.output.trim(),
        isSample: tc.isSample,
      })).filter((tc) => tc.input || tc.output);

      const res = await fetch(`/api/exams/${examId}/problems`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: pForm.title,
          statement: pForm.statement,
          difficulty: pForm.difficulty,
          points: pForm.points,
          timeLimit: pForm.timeLimit,
          memoryLimit: pForm.memoryLimit,
          supportedLangs: pForm.supportedLangs,
          inputFormat: pForm.inputFormat,
          outputFormat: pForm.outputFormat,
          constraints: pForm.constraints.split("\n").filter((c) => c.trim()),
          examples: pForm.examples,
          testCases: testCasesToSubmit,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to add problem.");
      } else {
        // Reset form for next problem
        setPForm({
          title: "",
          statement: "",
          constraints: "1 <= N <= 10^5\n1 <= A[i] <= 10^9",
          inputFormat: "",
          outputFormat: "",
          examples: [{ input: "", output: "", explanation: "" }],
          difficulty: "medium",
          points: 100,
          timeLimit: 2,
          memoryLimit: 256,
          supportedLangs: ["cpp", "python", "java", "javascript"],
          multiBoxTestCases: [
            { inputs: new Array(paramCount).fill(""), output: "", isSample: true },
          ],
        });
        await fetchExam();
        if (data.problem?.id) {
          setExpandedProblem(data.problem.id);
        }
        showTemporaryStatus("Problem successfully added to this exam!");
      }
    } catch {
      alert("Network error while adding problem.");
    }
    setAddingProblem(false);
  };

  const deleteProblem = async (problemId: string) => {
    if (!confirm("Delete this problem and all its test cases from the exam?")) return;
    await fetch(`/api/exams/${examId}/problems/${problemId}`, {
      method: "DELETE",
    });
    fetchExam();
  };

  const addTestCaseToProblem = async (
    problemId: string,
    inputs: string[],
    output: string,
    isSample: boolean
  ) => {
    const formattedInput = inputs.join("\n").trim();
    await fetch(`/api/exams/${examId}/problems/${problemId}/test-cases`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input: formattedInput, output: output.trim(), isSample }),
    });
    fetchExam();
  };

  const deleteTestCase = async (problemId: string, tcId: string) => {
    await fetch(`/api/exams/${examId}/problems/${problemId}/test-cases?id=${tcId}`, {
      method: "DELETE",
    });
    fetchExam();
  };

  const fetchResults = async () => {
    try {
      const res = await fetch(`/api/exams/${examId}/results`);
      const data = await res.json();
      setResults(data.attempts || []);
      setShowResults(true);
    } catch {}
  };

  const calculateDuration = (startStr: string, endStr: string | null) => {
    if (!endStr) return "In Progress";
    const start = new Date(startStr).getTime();
    const end = new Date(endStr).getTime();
    const diffSec = Math.max(0, Math.floor((end - start) / 1000));
    const mins = Math.floor(diffSec / 60);
    const secs = diffSec % 60;
    return `${mins}m ${secs}s`;
  };

  if (!user.isAdmin) return null;

  if (loading) {
    return (
      <StandardLayout particlesCount={8} showFooter={false} flowblockTheme>
        <div className="max-w-5xl mx-auto py-20 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#E6C212] mx-auto" />
        </div>
      </StandardLayout>
    );
  }

  if (!exam) {
    return (
      <StandardLayout particlesCount={8} showFooter={false} flowblockTheme>
        <div className="max-w-5xl mx-auto py-20 text-center">
          <p className="text-text-muted">Exam not found.</p>
        </div>
      </StandardLayout>
    );
  }

  const filteredResults = (results || []).filter(
    (a) =>
      a.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <StandardLayout particlesCount={8} showFooter={false} flowblockTheme>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <Link
            href="/exams/admin"
            className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-text-primary transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Exams Admin
          </Link>

          {statusMessage && (
            <div className="px-3 py-1 bg-green-500/10 border border-green-500/30 text-green-400 text-xs rounded-lg animate-fade-in flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{statusMessage}</span>
            </div>
          )}
        </div>

        {/* ── Exam Details & Meta ── */}
        <div className="fb-card rounded-xl p-6">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#E6C212]" />
              {exam.title}
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={fetchResults}
                className="px-3.5 py-1.5 rounded-lg bg-surface-alt border border-border text-xs font-semibold text-text-primary hover:bg-surface-hover transition-colors flex items-center gap-1.5"
              >
                <Users className="w-4 h-4 text-[#E6C212]" />
                <span>Candidate Results ({exam.problems.length} Qs)</span>
              </button>
              <button
                onClick={() => updateExam({ isPublished: !exam.isPublished })}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                  exam.isPublished
                    ? "bg-green-500/10 text-green-400 border border-green-500/30 hover:bg-green-500/20"
                    : "bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20"
                }`}
              >
                {exam.isPublished ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                <span>{exam.isPublished ? "Live & Published" : "Draft (Unpublished)"}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-text-muted block mb-1">Exam Title</label>
              <input
                defaultValue={exam.title}
                onBlur={(e) => e.target.value !== exam.title && updateExam({ title: e.target.value })}
                className="w-full p-2.5 rounded-lg bg-surface-alt border border-border text-sm text-text-primary focus:outline-none focus:border-[#E6C212]/60"
              />
            </div>
            <div>
              <label className="text-xs text-text-muted block mb-1">Duration (minutes)</label>
              <input
                type="number"
                defaultValue={exam.duration}
                onBlur={(e) => updateExam({ duration: e.target.value })}
                className="w-full p-2.5 rounded-lg bg-surface-alt border border-border text-sm text-text-primary focus:outline-none focus:border-[#E6C212]/60"
              />
            </div>
            <div>
              <label className="text-xs text-text-muted block mb-1">Total Problems</label>
              <p className="p-2.5 text-sm font-semibold text-[#E6C212]">{exam.problems.length} Problem(s) in Exam</p>
            </div>
            <div className="sm:col-span-3">
              <label className="text-xs text-text-muted block mb-1">Guidelines & Description</label>
              <textarea
                defaultValue={exam.description}
                onBlur={(e) => updateExam({ description: e.target.value })}
                rows={2}
                className="w-full p-2.5 rounded-lg bg-surface-alt border border-border text-sm text-text-primary focus:outline-none focus:border-[#E6C212]/60 resize-none"
              />
            </div>
          </div>
        </div>

        {/* ── Results & Anti-Cheat Candidate Inspection Modal ── */}
        {showResults && results && (
          <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="fb-card rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-slide-up border border-[#E6C212]/30 shadow-2xl">
              <div className="p-5 border-b border-border flex items-center justify-between bg-surface-card shrink-0">
                <div>
                  <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
                    <Users className="w-5 h-5 text-[#E6C212]" />
                    Candidate Assessment Results & Proctoring Audit
                  </h3>
                  <p className="text-xs text-text-muted mt-0.5">
                    {exam.title} · {results.length} candidate attempts
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowResults(false);
                    setSelectedCandidate(null);
                  }}
                  className="px-3 py-1 rounded-lg border border-border text-xs text-text-muted hover:text-text-primary hover:bg-surface-hover transition-colors"
                >
                  Close
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5">
                {selectedCandidate ? (
                  <div className="space-y-6">
                    <button
                      onClick={() => setSelectedCandidate(null)}
                      className="inline-flex items-center gap-1.5 text-xs text-[#E6C212] hover:underline"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" /> Back to Candidates List
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
                          <p className="text-xs text-text-muted">Score Achieved</p>
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

                      {selectedCandidate.violations && selectedCandidate.violations.length > 0 ? (
                        <div className="space-y-1.5 pt-2 border-t border-border">
                          <p className="text-xs font-medium text-text-muted">Violation Timestamps:</p>
                          <div className="max-h-36 overflow-y-auto space-y-1">
                            {selectedCandidate.violations.map((v, idx) => (
                              <div
                                key={idx}
                                className="text-xs p-2 rounded bg-red-500/10 border border-red-500/20 text-red-300 flex items-center justify-between"
                              >
                                <span>
                                  ⚠️ <strong>{v.type === "tab_switch" ? "Tab Switch / Window Blur" : v.type}</strong>
                                </span>
                                <span className="text-text-muted font-mono">
                                  {new Date(v.timestamp).toLocaleTimeString()}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-green-400/80 pt-1">
                          ✓ Candidate remained on the test page without unauthorized tab switches.
                        </p>
                      )}
                    </div>

                    {/* Candidate Submissions */}
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
                              const active =
                                (activeSubProblemId || selectedCandidate.submissions[0].id) === sub.id;
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
                  <div className="space-y-4">
                    <div className="relative">
                      <Search className="w-4 h-4 text-text-muted absolute left-3 top-3" />
                      <input
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search candidate name or email..."
                        className="w-full pl-9 pr-3 py-2 rounded-lg bg-surface-alt border border-border text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-[#E6C212]/60"
                      />
                    </div>

                    {filteredResults.length === 0 ? (
                      <div className="p-12 text-center text-text-muted">
                        <Users className="w-10 h-10 mx-auto mb-2 opacity-20" />
                        <p className="text-sm">No candidate submissions recorded.</p>
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
          </div>
        )}

        {/* ── Problem List (Supports adding 2, 3, 4+ problems to same exam) ── */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#E6C212]" />
              Configured Problems in this Exam ({exam.problems.length})
            </h3>
          </div>

          {exam.problems.length === 0 ? (
            <div className="fb-card rounded-xl p-8 text-center mb-6">
              <Code2 className="w-12 h-12 text-text-muted opacity-20 mx-auto mb-3" />
              <p className="text-text-muted text-sm">No problems added yet. Use the Problem Builder below to add your first question.</p>
            </div>
          ) : (
            <div className="space-y-3 mb-6">
              {exam.problems.map((problem, i) => (
                <div key={problem.id} className="fb-card rounded-xl overflow-hidden border border-border">
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() =>
                      setExpandedProblem(
                        expandedProblem === problem.id ? null : problem.id
                      )
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        setExpandedProblem(
                          expandedProblem === problem.id ? null : problem.id
                        );
                      }
                    }}
                    className="w-full p-4 flex items-center justify-between hover:bg-surface-hover transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-lg bg-[#E6C212]/10 border border-[#E6C212]/30 flex items-center justify-center text-xs font-bold text-[#E6C212]">
                        Q{i + 1}
                      </span>
                      <div className="text-left">
                        <p className="text-sm font-bold text-text-primary">
                          {problem.title}
                        </p>
                        <p className="text-xs text-text-muted">
                          {problem.difficulty} · {problem.points} pts · {problem.timeLimit || 2}s ·{" "}
                          {problem.testCases?.length || problem._count?.testCases || 0} test cases
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteProblem(problem.id);
                        }}
                        className="p-1.5 rounded text-red-400 hover:bg-red-500/10 transition-colors"
                        title="Delete Problem"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <ChevronDown
                        className={`w-4 h-4 text-text-muted transition-transform ${
                          expandedProblem === problem.id ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </div>

                  {expandedProblem === problem.id && (
                    <div className="p-5 border-t border-border space-y-4 bg-surface-alt/50">
                      <div>
                        <h4 className="text-xs font-semibold text-text-muted uppercase mb-1">Problem Statement</h4>
                        <div className="text-xs text-text-secondary whitespace-pre-wrap bg-surface-card p-3 rounded-lg border border-border">
                          {problem.statement}
                        </div>
                      </div>

                      {/* Test Cases for this problem */}
                      <div>
                        <h4 className="text-xs font-bold text-text-primary uppercase tracking-wide mb-2 flex items-center justify-between">
                          <span>Test Cases ({problem.testCases?.length || 0})</span>
                        </h4>
                        <div className="space-y-2">
                          {problem.testCases?.map((tc, tcIdx) => (
                            <div
                              key={tc.id}
                              className="p-3 rounded-lg bg-surface-card border border-border flex items-start justify-between gap-3"
                            >
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1.5">
                                  <span className="text-xs font-mono text-text-muted">Test Case #{tcIdx + 1}</span>
                                  <span
                                    className={`text-xs px-2 py-0.5 rounded font-semibold ${
                                      tc.isSample
                                        ? "bg-green-500/10 text-green-400 border border-green-500/20"
                                        : "bg-surface-hover text-text-muted border border-border"
                                    }`}
                                  >
                                    {tc.isSample ? "Sample (Visible)" : "Hidden Test"}
                                  </span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                                  <div>
                                    <span className="text-text-muted text-[11px] block">Standard Input (stdin):</span>
                                    <pre className="text-text-secondary font-mono mt-0.5 p-1.5 bg-[#0a0a0a] rounded border border-border truncate whitespace-pre-wrap">
                                      {tc.input}
                                    </pre>
                                  </div>
                                  <div>
                                    <span className="text-text-muted text-[11px] block">Expected Output:</span>
                                    <pre className="text-text-secondary font-mono mt-0.5 p-1.5 bg-[#0a0a0a] rounded border border-border truncate whitespace-pre-wrap">
                                      {tc.output}
                                    </pre>
                                  </div>
                                </div>
                              </div>
                              <button
                                onClick={() => deleteTestCase(problem.id, tc.id)}
                                className="p-1 text-red-400 hover:bg-red-500/10 rounded transition-colors shrink-0"
                                title="Delete Test Case"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>

                        {/* Add Test Case Form for this specific problem */}
                        <AddMultiBoxTestCaseForm
                          paramLabels={paramLabels}
                          onAdd={(inputs, output, isSample) =>
                            addTestCaseToProblem(problem.id, inputs, output, isSample)
                          }
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Problem Builder Form: Add Problem with Multi-Box Input Test Cases ── */}
        <div className="fb-card rounded-xl p-6 border border-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
              <Plus className="w-5 h-5 text-[#E6C212]" />
              Add Another Problem to &quot;{exam.title}&quot;
            </h3>
            <span className="text-xs text-text-muted">
              Add multiple questions (Q1, Q2, Q3) to this contest
            </span>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="sm:col-span-2">
                <label className="text-xs text-text-muted block mb-1">Problem Title</label>
                <input
                  value={pForm.title}
                  onChange={(e) => setPForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="e.g. Two Sum / Trapping Rain Water"
                  className="w-full p-2.5 rounded-lg bg-surface-alt border border-border text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-[#E6C212]/60"
                />
              </div>
              <div>
                <label className="text-xs text-text-muted block mb-1">Difficulty</label>
                <select
                  value={pForm.difficulty}
                  onChange={(e) => setPForm((f) => ({ ...f, difficulty: e.target.value }))}
                  className="w-full p-2.5 rounded-lg bg-surface-alt border border-border text-text-primary text-sm focus:outline-none cursor-pointer"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-text-muted block mb-1">Points</label>
                <input
                  type="number"
                  value={pForm.points}
                  onChange={(e) => setPForm((f) => ({ ...f, points: parseInt(e.target.value) || 0 }))}
                  placeholder="Points"
                  className="w-full p-2.5 rounded-lg bg-surface-alt border border-border text-text-primary text-sm focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-text-muted block mb-1">Problem Statement & Description</label>
              <textarea
                value={pForm.statement}
                onChange={(e) => setPForm((f) => ({ ...f, statement: e.target.value }))}
                placeholder="Given an array of integers nums and an integer target, return indices of the two numbers..."
                rows={4}
                className="w-full p-3 rounded-lg bg-surface-alt border border-border text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-[#E6C212]/60 resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-text-muted block mb-1">Input Format (e.g. Line 1: nums, Line 2: target)</label>
                <textarea
                  value={pForm.inputFormat}
                  onChange={(e) => setPForm((f) => ({ ...f, inputFormat: e.target.value }))}
                  placeholder="Line 1: N integers\nLine 2: target integer"
                  rows={2}
                  className="w-full p-2.5 rounded-lg bg-surface-alt border border-border text-text-primary text-sm placeholder:text-text-muted focus:outline-none resize-none"
                />
              </div>
              <div>
                <label className="text-xs text-text-muted block mb-1">Output Format</label>
                <textarea
                  value={pForm.outputFormat}
                  onChange={(e) => setPForm((f) => ({ ...f, outputFormat: e.target.value }))}
                  placeholder="Return the two space-separated indices"
                  rows={2}
                  className="w-full p-2.5 rounded-lg bg-surface-alt border border-border text-text-primary text-sm placeholder:text-text-muted focus:outline-none resize-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-text-muted block mb-1">Constraints (one per line)</label>
              <textarea
                value={pForm.constraints}
                onChange={(e) => setPForm((f) => ({ ...f, constraints: e.target.value }))}
                placeholder="1 <= N <= 10^5&#10;1 <= nums[i] <= 10^9"
                rows={2}
                className="w-full p-2.5 rounded-lg bg-surface-alt border border-border text-text-primary text-sm placeholder:text-text-muted focus:outline-none resize-none font-mono text-xs"
              />
            </div>

            {/* ── Multi-Box Test Case Input Configuration (LeetCode Style) ── */}
            <div className="p-4 rounded-xl bg-surface-alt border border-border space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
                <div>
                  <h4 className="text-xs font-bold text-text-primary uppercase tracking-wide flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#E6C212]" />
                    Test Case Inputs & Outputs (Multi-Box Support)
                  </h4>
                  <p className="text-[11px] text-text-muted mt-0.5">
                    For problems with multiple input values (e.g. Array + Target), use separate boxes for each input parameter.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-text-muted">Input Parameters:</span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleRemoveParam(paramCount - 1)}
                      disabled={paramCount <= 1}
                      className="px-2 py-0.5 rounded bg-surface-card border border-border text-xs disabled:opacity-30"
                    >
                      -
                    </button>
                    <span className="text-xs font-mono font-bold px-2">{paramCount} Input(s)</span>
                    <button
                      type="button"
                      onClick={handleAddParam}
                      className="px-2 py-0.5 rounded bg-surface-card border border-border text-xs"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Param Labels Editor */}
              <div className="flex flex-wrap gap-2 text-xs">
                {paramLabels.map((lbl, idx) => (
                  <div key={idx} className="flex items-center gap-1 bg-surface-card px-2 py-1 rounded border border-border">
                    <span className="text-text-muted font-mono text-[11px]">Box #{idx + 1}:</span>
                    <input
                      value={lbl}
                      onChange={(e) => {
                        const updated = [...paramLabels];
                        updated[idx] = e.target.value;
                        setParamLabels(updated);
                      }}
                      className="bg-transparent text-text-primary text-xs w-20 focus:outline-none font-semibold"
                    />
                  </div>
                ))}
              </div>

              {/* Test Cases List with Multi-Boxes */}
              <div className="space-y-3">
                {pForm.multiBoxTestCases.map((tc, tcIdx) => (
                  <div key={tcIdx} className="bg-surface-card p-3 rounded-lg border border-border space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-text-primary">Test Case #{tcIdx + 1}</span>
                      <div className="flex items-center gap-3">
                        <label className="flex items-center gap-1.5 text-xs text-text-muted cursor-pointer">
                          <input
                            type="checkbox"
                            checked={tc.isSample}
                            onChange={(e) => {
                              const updated = [...pForm.multiBoxTestCases];
                              updated[tcIdx] = { ...updated[tcIdx], isSample: e.target.checked };
                              setPForm((f) => ({ ...f, multiBoxTestCases: updated }));
                            }}
                            className="accent-[#E6C212]"
                          />
                          <span>Sample (Candidate sees)</span>
                        </label>
                        {pForm.multiBoxTestCases.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              setPForm((f) => ({
                                ...f,
                                multiBoxTestCases: f.multiBoxTestCases.filter((_, i) => i !== tcIdx),
                              }));
                            }}
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {/* Input Boxes for each param */}
                      {tc.inputs.map((inp, pIdx) => (
                        <div key={pIdx}>
                          <label className="text-[10px] text-text-muted block mb-0.5">
                            {paramLabels[pIdx] || `Input #${pIdx + 1}`}
                          </label>
                          <input
                            value={inp}
                            onChange={(e) => {
                              const updated = [...pForm.multiBoxTestCases];
                              const newInputs = [...updated[tcIdx].inputs];
                              newInputs[pIdx] = e.target.value;
                              updated[tcIdx] = { ...updated[tcIdx], inputs: newInputs };
                              setPForm((f) => ({ ...f, multiBoxTestCases: updated }));
                            }}
                            placeholder={`e.g. ${pIdx === 0 ? "2 7 11 15" : "9"}`}
                            className="w-full p-2 rounded bg-[#0a0a0a] border border-border text-xs font-mono text-text-primary focus:outline-none"
                          />
                        </div>
                      ))}

                      {/* Expected Output Box */}
                      <div>
                        <label className="text-[10px] text-[#E6C212] block mb-0.5">
                          Expected Output
                        </label>
                        <input
                          value={tc.output}
                          onChange={(e) => {
                            const updated = [...pForm.multiBoxTestCases];
                            updated[tcIdx] = { ...updated[tcIdx], output: e.target.value };
                            setPForm((f) => ({ ...f, multiBoxTestCases: updated }));
                          }}
                          placeholder="e.g. 0 1"
                          className="w-full p-2 rounded bg-[#0a0a0a] border border-[#E6C212]/40 text-xs font-mono text-text-primary focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => {
                  setPForm((f) => ({
                    ...f,
                    multiBoxTestCases: [
                      ...f.multiBoxTestCases,
                      { inputs: new Array(paramCount).fill(""), output: "", isSample: false },
                    ],
                  }));
                }}
                className="text-xs text-[#E6C212] hover:text-[#c9a810] transition-colors font-semibold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Another Test Case
              </button>
            </div>

            <button
              onClick={addProblem}
              disabled={addingProblem || !pForm.title.trim() || !pForm.statement.trim()}
              className="fb-btn-primary disabled:opacity-50 inline-flex items-center gap-2 !py-2.5 !px-5"
            >
              {addingProblem ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
              <span>Save Problem to Exam</span>
            </button>
          </div>
        </div>
      </div>
    </StandardLayout>
  );
}

// ─── Inline Multi-Box Add Test Case Component ────────────────────────

function AddMultiBoxTestCaseForm({
  paramLabels,
  onAdd,
}: {
  paramLabels: string[];
  onAdd: (inputs: string[], output: string, isSample: boolean) => void;
}) {
  const [inputs, setInputs] = useState<string[]>(new Array(Math.max(1, paramLabels.length)).fill(""));
  const [output, setOutput] = useState("");
  const [isSample, setIsSample] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    setInputs(new Array(Math.max(1, paramLabels.length)).fill(""));
  }, [paramLabels.length]);

  if (!show) {
    return (
      <button
        onClick={() => setShow(true)}
        className="mt-2 text-xs text-[#E6C212] hover:text-[#c9a810] transition-colors flex items-center gap-1 font-medium"
      >
        <Plus className="w-3.5 h-3.5" /> Add New Test Case to this Problem
      </button>
    );
  }

  return (
    <div className="mt-3 p-3.5 rounded-lg bg-surface-card border border-border space-y-3">
      <h5 className="text-xs font-bold text-text-primary">Add Test Case (Multi-Box Input)</h5>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {inputs.map((inp, idx) => (
          <div key={idx}>
            <label className="text-[10px] text-text-muted block mb-0.5">
              {paramLabels[idx] || `Input #${idx + 1}`}
            </label>
            <input
              value={inp}
              onChange={(e) => {
                const updated = [...inputs];
                updated[idx] = e.target.value;
                setInputs(updated);
              }}
              placeholder="Input value"
              className="w-full p-2 rounded bg-[#0a0a0a] border border-border text-xs text-text-primary font-mono focus:outline-none"
            />
          </div>
        ))}
        <div>
          <label className="text-[10px] text-[#E6C212] block mb-0.5">Expected Output</label>
          <input
            value={output}
            onChange={(e) => setOutput(e.target.value)}
            placeholder="Expected stdout"
            className="w-full p-2 rounded bg-[#0a0a0a] border border-[#E6C212]/40 text-xs text-text-primary font-mono focus:outline-none"
          />
        </div>
      </div>
      <div className="flex items-center justify-between pt-1">
        <label className="flex items-center gap-1.5 text-xs text-text-muted cursor-pointer">
          <input
            type="checkbox"
            checked={isSample}
            onChange={(e) => setIsSample(e.target.checked)}
            className="accent-[#E6C212]"
          />
          <span>Visible sample case for candidate</span>
        </label>
        <div className="flex gap-2">
          <button
            onClick={() => setShow(false)}
            className="px-3 py-1 rounded text-xs text-text-muted hover:text-text-primary transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onAdd(inputs, output, isSample);
              setInputs(new Array(Math.max(1, paramLabels.length)).fill(""));
              setOutput("");
              setIsSample(false);
              setShow(false);
            }}
            disabled={!output.trim() || inputs.every((i) => !i.trim())}
            className="px-3 py-1 rounded bg-[#E6C212] text-black text-xs font-semibold hover:bg-[#c9a810] disabled:opacity-40 transition-colors"
          >
            Save Test Case
          </button>
        </div>
      </div>
    </div>
  );
}
