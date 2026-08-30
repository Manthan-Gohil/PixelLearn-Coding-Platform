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

  // Problem form
  const [pForm, setPForm] = useState({
    title: "",
    statement: "",
    constraints: "",
    inputFormat: "",
    outputFormat: "",
    examples: [{ input: "", output: "", explanation: "" }],
    difficulty: "medium",
    points: 100,
    supportedLangs: ["cpp", "python", "java", "javascript"],
    testCases: [{ input: "", output: "", isSample: true }],
  });

  // Results viewing
  const [results, setResults] = useState<any[] | null>(null);
  const [showResults, setShowResults] = useState(false);

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
    } catch {}
    setSaving(false);
  };

  const addProblem = async () => {
    setAddingProblem(true);
    try {
      await fetch(`/api/exams/${examId}/problems`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...pForm,
          constraints: pForm.constraints
            .split("\n")
            .filter((c) => c.trim()),
          testCases: pForm.testCases.filter(
            (tc) => tc.input.trim() || tc.output.trim()
          ),
        }),
      });
      setPForm({
        title: "",
        statement: "",
        constraints: "",
        inputFormat: "",
        outputFormat: "",
        examples: [{ input: "", output: "", explanation: "" }],
        difficulty: "medium",
        points: 100,
        supportedLangs: ["cpp", "python", "java", "javascript"],
        testCases: [{ input: "", output: "", isSample: true }],
      });
      fetchExam();
    } catch {}
    setAddingProblem(false);
  };

  const deleteProblem = async (problemId: string) => {
    if (!confirm("Delete this problem and all its test cases?")) return;
    await fetch(`/api/exams/${examId}/problems/${problemId}`, {
      method: "DELETE",
    });
    fetchExam();
  };

  const addTestCase = async (problemId: string, input: string, output: string, isSample: boolean) => {
    await fetch(
      `/api/exams/${examId}/problems/${problemId}/test-cases`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input, output, isSample }),
      }
    );
    fetchExam();
  };

  const deleteTestCase = async (problemId: string, tcId: string) => {
    await fetch(
      `/api/exams/${examId}/problems/${problemId}/test-cases?id=${tcId}`,
      { method: "DELETE" }
    );
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

  return (
    <StandardLayout particlesCount={8} showFooter={false} flowblockTheme>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <Link
          href="/exams/admin"
          className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Admin
        </Link>

        {/* Exam Details */}
        <div className="fb-card rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#E6C212]" />
              {exam.title}
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={fetchResults}
                className="px-3 py-1.5 rounded-lg border border-border text-sm text-text-secondary hover:bg-surface-hover transition-colors flex items-center gap-1"
              >
                <Users className="w-4 h-4" /> View Results
              </button>
              <button
                onClick={() => updateExam({ isPublished: !exam.isPublished })}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1 transition-colors ${
                  exam.isPublished
                    ? "bg-green-500/10 text-green-400 border border-green-500/30 hover:bg-green-500/20"
                    : "bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20"
                }`}
              >
                {exam.isPublished ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                {exam.isPublished ? "Published" : "Draft"}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-text-muted block mb-1">Title</label>
              <input
                defaultValue={exam.title}
                onBlur={(e) => e.target.value !== exam.title && updateExam({ title: e.target.value })}
                className="w-full p-2 rounded-lg bg-surface-alt border border-border text-sm text-text-primary focus:outline-none focus:border-[#E6C212]/60"
              />
            </div>
            <div>
              <label className="text-xs text-text-muted block mb-1">Duration (min)</label>
              <input
                type="number"
                defaultValue={exam.duration}
                onBlur={(e) => updateExam({ duration: e.target.value })}
                className="w-full p-2 rounded-lg bg-surface-alt border border-border text-sm text-text-primary focus:outline-none focus:border-[#E6C212]/60"
              />
            </div>
            <div>
              <label className="text-xs text-text-muted block mb-1">Problems</label>
              <p className="p-2 text-sm text-text-primary">{exam.problems.length} problems</p>
            </div>
          </div>
        </div>

        {/* Results Modal */}
        {showResults && results && (
          <div className="fb-card rounded-xl p-6 animate-slide-up" style={{ animationDuration: "0.3s" }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-text-primary">
                Submissions ({results.length})
              </h3>
              <button
                onClick={() => setShowResults(false)}
                className="text-text-muted hover:text-text-primary text-sm"
              >
                Close
              </button>
            </div>
            {results.length === 0 ? (
              <p className="text-sm text-text-muted">No submissions yet.</p>
            ) : (
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {results.map((a: any) => (
                  <div
                    key={a.id}
                    className="p-3 rounded-lg bg-surface-alt border border-border flex items-center justify-between"
                  >
                    <div>
                      <p className="text-sm font-medium text-text-primary">{a.user?.name}</p>
                      <p className="text-xs text-text-muted">
                        {a.user?.email} ·{" "}
                        {a.completedAt ? "Completed" : "In Progress"}
                        {a.terminatedByProctor && (
                          <span className="text-red-400 ml-2">
                            <AlertTriangle className="w-3 h-3 inline" /> Proctoring Terminated
                          </span>
                        )}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-text-primary">
                        {a.totalScore}
                        <span className="text-sm text-text-muted">/{a.maxScore}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Existing Problems */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-text-primary">Problems</h3>
          </div>

          {exam.problems.length === 0 ? (
            <div className="fb-card rounded-xl p-8 text-center">
              <Code2 className="w-12 h-12 text-text-muted opacity-20 mx-auto mb-3" />
              <p className="text-text-muted">No problems yet. Add one below.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {exam.problems.map((problem, i) => (
                <div key={problem.id} className="fb-card rounded-xl overflow-hidden">
                  <button
                    onClick={() =>
                      setExpandedProblem(
                        expandedProblem === problem.id ? null : problem.id
                      )
                    }
                    className="w-full p-4 flex items-center justify-between hover:bg-surface-hover transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-lg bg-surface-alt flex items-center justify-center text-xs font-bold text-text-muted">
                        {i + 1}
                      </span>
                      <div className="text-left">
                        <p className="text-sm font-medium text-text-primary">
                          {problem.title}
                        </p>
                        <p className="text-xs text-text-muted">
                          {problem.difficulty} · {problem.points} pts ·{" "}
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
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <ChevronDown
                        className={`w-4 h-4 text-text-muted transition-transform ${
                          expandedProblem === problem.id ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </button>

                  {expandedProblem === problem.id && (
                    <div className="p-4 border-t border-border space-y-4 bg-surface-alt/50">
                      <div className="text-sm text-text-secondary whitespace-pre-wrap">
                        {problem.statement.substring(0, 300)}
                        {problem.statement.length > 300 && "..."}
                      </div>

                      {/* Test Cases */}
                      <div>
                        <h4 className="text-sm font-semibold text-text-primary mb-2">
                          Test Cases ({problem.testCases?.length || 0})
                        </h4>
                        <div className="space-y-2">
                          {problem.testCases?.map((tc) => (
                            <div
                              key={tc.id}
                              className="p-2 rounded-lg bg-surface-alt border border-border flex items-start justify-between gap-2"
                            >
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <span
                                    className={`text-xs px-1.5 py-0.5 rounded ${
                                      tc.isSample
                                        ? "bg-green-500/10 text-green-400"
                                        : "bg-surface-hover text-text-muted"
                                    }`}
                                  >
                                    {tc.isSample ? "Sample" : "Hidden"}
                                  </span>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                  <div>
                                    <span className="text-text-muted">Input:</span>
                                    <pre className="text-text-secondary font-mono mt-0.5 truncate">
                                      {tc.input.substring(0, 80)}
                                    </pre>
                                  </div>
                                  <div>
                                    <span className="text-text-muted">Output:</span>
                                    <pre className="text-text-secondary font-mono mt-0.5 truncate">
                                      {tc.output.substring(0, 80)}
                                    </pre>
                                  </div>
                                </div>
                              </div>
                              <button
                                onClick={() => deleteTestCase(problem.id, tc.id)}
                                className="p-1 text-red-400 hover:bg-red-500/10 rounded transition-colors shrink-0"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>

                        {/* Add Test Case */}
                        <AddTestCaseForm
                          onAdd={(input, output, isSample) =>
                            addTestCase(problem.id, input, output, isSample)
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

        {/* Add Problem Form */}
        <div className="fb-card rounded-xl p-6">
          <h3 className="text-base font-semibold text-text-primary mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5 text-[#E6C212]" />
            Add Problem
          </h3>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <input
                value={pForm.title}
                onChange={(e) => setPForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="Problem Title"
                className="col-span-2 p-3 rounded-lg bg-surface-alt border border-border text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-[#E6C212]/60"
              />
              <div className="flex gap-2">
                <select
                  value={pForm.difficulty}
                  onChange={(e) => setPForm((f) => ({ ...f, difficulty: e.target.value }))}
                  className="flex-1 p-3 rounded-lg bg-surface-alt border border-border text-text-primary text-sm focus:outline-none"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
                <input
                  type="number"
                  value={pForm.points}
                  onChange={(e) => setPForm((f) => ({ ...f, points: parseInt(e.target.value) || 0 }))}
                  placeholder="Points"
                  className="w-24 p-3 rounded-lg bg-surface-alt border border-border text-text-primary text-sm focus:outline-none"
                />
              </div>
            </div>

            <textarea
              value={pForm.statement}
              onChange={(e) => setPForm((f) => ({ ...f, statement: e.target.value }))}
              placeholder="Problem Statement"
              rows={4}
              className="w-full p-3 rounded-lg bg-surface-alt border border-border text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-[#E6C212]/60 resize-none"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <textarea
                value={pForm.inputFormat}
                onChange={(e) => setPForm((f) => ({ ...f, inputFormat: e.target.value }))}
                placeholder="Input Format"
                rows={2}
                className="p-3 rounded-lg bg-surface-alt border border-border text-text-primary text-sm placeholder:text-text-muted focus:outline-none resize-none"
              />
              <textarea
                value={pForm.outputFormat}
                onChange={(e) => setPForm((f) => ({ ...f, outputFormat: e.target.value }))}
                placeholder="Output Format"
                rows={2}
                className="p-3 rounded-lg bg-surface-alt border border-border text-text-primary text-sm placeholder:text-text-muted focus:outline-none resize-none"
              />
            </div>

            <textarea
              value={pForm.constraints}
              onChange={(e) => setPForm((f) => ({ ...f, constraints: e.target.value }))}
              placeholder="Constraints (one per line)"
              rows={2}
              className="w-full p-3 rounded-lg bg-surface-alt border border-border text-text-primary text-sm placeholder:text-text-muted focus:outline-none resize-none"
            />

            {/* Examples */}
            <div>
              <label className="text-xs text-text-muted mb-2 block">Examples</label>
              {pForm.examples.map((ex, i) => (
                <div key={i} className="grid grid-cols-3 gap-2 mb-2">
                  <input
                    value={ex.input}
                    onChange={(e) => {
                      const updated = [...pForm.examples];
                      updated[i] = { ...updated[i], input: e.target.value };
                      setPForm((f) => ({ ...f, examples: updated }));
                    }}
                    placeholder="Input"
                    className="p-2 rounded-lg bg-surface-alt border border-border text-text-primary text-xs focus:outline-none font-mono"
                  />
                  <input
                    value={ex.output}
                    onChange={(e) => {
                      const updated = [...pForm.examples];
                      updated[i] = { ...updated[i], output: e.target.value };
                      setPForm((f) => ({ ...f, examples: updated }));
                    }}
                    placeholder="Output"
                    className="p-2 rounded-lg bg-surface-alt border border-border text-text-primary text-xs focus:outline-none font-mono"
                  />
                  <input
                    value={ex.explanation}
                    onChange={(e) => {
                      const updated = [...pForm.examples];
                      updated[i] = { ...updated[i], explanation: e.target.value };
                      setPForm((f) => ({ ...f, examples: updated }));
                    }}
                    placeholder="Explanation (optional)"
                    className="p-2 rounded-lg bg-surface-alt border border-border text-text-primary text-xs focus:outline-none"
                  />
                </div>
              ))}
              <button
                onClick={() =>
                  setPForm((f) => ({
                    ...f,
                    examples: [...f.examples, { input: "", output: "", explanation: "" }],
                  }))
                }
                className="text-xs text-[#E6C212] hover:text-[#c9a810] transition-colors"
              >
                + Add Example
              </button>
            </div>

            {/* Test Cases */}
            <div>
              <label className="text-xs text-text-muted mb-2 block">
                Test Cases (added with the problem)
              </label>
              {pForm.testCases.map((tc, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <input
                    value={tc.input}
                    onChange={(e) => {
                      const updated = [...pForm.testCases];
                      updated[i] = { ...updated[i], input: e.target.value };
                      setPForm((f) => ({ ...f, testCases: updated }));
                    }}
                    placeholder="Input"
                    className="flex-1 p-2 rounded-lg bg-surface-alt border border-border text-text-primary text-xs focus:outline-none font-mono"
                  />
                  <input
                    value={tc.output}
                    onChange={(e) => {
                      const updated = [...pForm.testCases];
                      updated[i] = { ...updated[i], output: e.target.value };
                      setPForm((f) => ({ ...f, testCases: updated }));
                    }}
                    placeholder="Output"
                    className="flex-1 p-2 rounded-lg bg-surface-alt border border-border text-text-primary text-xs focus:outline-none font-mono"
                  />
                  <label className="flex items-center gap-1 text-xs text-text-muted shrink-0">
                    <input
                      type="checkbox"
                      checked={tc.isSample}
                      onChange={(e) => {
                        const updated = [...pForm.testCases];
                        updated[i] = { ...updated[i], isSample: e.target.checked };
                        setPForm((f) => ({ ...f, testCases: updated }));
                      }}
                      className="accent-[#E6C212]"
                    />
                    Sample
                  </label>
                </div>
              ))}
              <button
                onClick={() =>
                  setPForm((f) => ({
                    ...f,
                    testCases: [...f.testCases, { input: "", output: "", isSample: false }],
                  }))
                }
                className="text-xs text-[#E6C212] hover:text-[#c9a810] transition-colors"
              >
                + Add Test Case
              </button>
            </div>

            <button
              onClick={addProblem}
              disabled={addingProblem || !pForm.title.trim() || !pForm.statement.trim()}
              className="fb-btn-primary disabled:opacity-50"
            >
              {addingProblem ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
              Add Problem
            </button>
          </div>
        </div>
      </div>
    </StandardLayout>
  );
}

// ─── Add Test Case inline form ──────────────────────────────────────

function AddTestCaseForm({
  onAdd,
}: {
  onAdd: (input: string, output: string, isSample: boolean) => void;
}) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [isSample, setIsSample] = useState(false);
  const [show, setShow] = useState(false);

  if (!show) {
    return (
      <button
        onClick={() => setShow(true)}
        className="mt-2 text-xs text-[#E6C212] hover:text-[#c9a810] transition-colors flex items-center gap-1"
      >
        <Plus className="w-3 h-3" /> Add Test Case
      </button>
    );
  }

  return (
    <div className="mt-2 p-3 rounded-lg bg-surface-alt border border-border space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Input"
          rows={2}
          className="p-2 rounded bg-[#0d0d0d] border border-border text-xs text-text-primary font-mono focus:outline-none resize-none"
        />
        <textarea
          value={output}
          onChange={(e) => setOutput(e.target.value)}
          placeholder="Expected Output"
          rows={2}
          className="p-2 rounded bg-[#0d0d0d] border border-border text-xs text-text-primary font-mono focus:outline-none resize-none"
        />
      </div>
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-1 text-xs text-text-muted">
          <input
            type="checkbox"
            checked={isSample}
            onChange={(e) => setIsSample(e.target.checked)}
            className="accent-[#E6C212]"
          />
          Visible to students (sample)
        </label>
        <div className="flex gap-2">
          <button
            onClick={() => setShow(false)}
            className="text-xs text-text-muted hover:text-text-primary transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onAdd(input, output, isSample);
              setInput("");
              setOutput("");
              setIsSample(false);
              setShow(false);
            }}
            disabled={!input.trim() || !output.trim()}
            className="text-xs text-[#E6C212] font-medium hover:text-[#c9a810] disabled:opacity-40 transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
