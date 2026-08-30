"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Trophy,
  Send,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle2,
  XCircle,
  MinusCircle,
  AlertTriangle,
  Shield,
  RotateCcw,
  History,
  Sparkles,
  Target,
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────────

interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface QuizData {
  id: string;
  title: string;
  topic: string;
  difficulty: string;
  questionCount: number;
  duration: number;
  questions: QuizQuestion[];
}

interface QuizResult {
  quizTitle: string;
  topic: string;
  difficulty: string;
  score: number;
  totalQuestions: number;
  correctCount: number;
  incorrectCount: number;
  skippedCount: number;
  timeTaken: number;
  terminatedByProctor: boolean;
  questionResults: {
    questionIndex: number;
    question: string;
    options: string[];
    correctIndex: number;
    userAnswer: number | null;
    isCorrect: boolean;
    isSkipped: boolean;
    explanation: string;
  }[];
}

interface HistoryItem {
  id: string;
  score: number;
  totalQuestions: number;
  correctCount: number;
  timeTaken: number;
  isProctored: boolean;
  terminatedByProctor: boolean;
  completedAt: string;
  quiz: {
    title: string;
    topic: string;
    difficulty: string;
    questionCount: number;
  };
}

// ─── Phase: Input ──────────────────────────────────────────────────

function InputPhase({
  onGenerate,
  isLoading,
  restriction,
}: {
  onGenerate: (prompt: string, proctored: boolean) => void;
  isLoading: boolean;
  restriction: string | null;
}) {
  const [prompt, setPrompt] = useState("");
  const [proctored, setProctored] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    if (showHistory) {
      fetch("/api/ai/quiz-history")
        .then((r) => r.json())
        .then((d) => setHistory(d.attempts || []))
        .catch(() => {});
    }
  }, [showHistory]);

  const suggestions = [
    "Generate a quiz of 20 questions about OOP in C++",
    "Create a beginner Python quiz with 15 questions",
    "Give me an advanced DBMS quiz",
    "10 questions on JavaScript closures and promises",
    "Create a quiz about World War 2 history",
    "15 questions about organic chemistry",
  ];

  return (
    <div className="space-y-6">
      <div className="fb-card rounded-xl p-6">
        <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-[#E6C212]" />
          Generate a Quiz
        </h2>

        {restriction && (
          <div className="mb-4 p-4 rounded-lg bg-red-500/10 border border-red-500/30 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-red-300 font-medium">Quiz Access Restricted</p>
              <p className="text-xs text-red-400 mt-1">
                You violated proctoring rules. Access resumes at{" "}
                {new Date(restriction).toLocaleString()}.
              </p>
            </div>
          </div>
        )}

        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder='e.g., "Generate a quiz of 20 questions about OOP in C++"'
          className="w-full h-32 p-4 rounded-lg bg-surface-alt border border-border text-text-primary placeholder:text-text-muted focus:outline-none focus:border-[#E6C212]/60 resize-none"
          disabled={!!restriction}
        />

        <div className="flex flex-wrap items-center gap-3 mt-4">
          <button
            onClick={() => onGenerate(prompt, proctored)}
            disabled={isLoading || !prompt.trim() || !!restriction}
            className="fb-btn-primary disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            {isLoading ? "Generating..." : "Generate Quiz"}
          </button>

          <label className="flex items-center gap-2 cursor-pointer select-none">
            <div
              className={`relative w-10 h-5 rounded-full transition-colors ${
                proctored ? "bg-[#E6C212]" : "bg-border-light"
              }`}
              onClick={() => !restriction && setProctored(!proctored)}
            >
              <div
                className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                  proctored ? "translate-x-5" : "translate-x-0.5"
                }`}
              />
            </div>
            <span className="text-sm text-text-secondary flex items-center gap-1">
              <Shield className="w-3.5 h-3.5" />
              Proctored Mode
            </span>
          </label>

          <button
            onClick={() => setShowHistory(!showHistory)}
            className="ml-auto text-sm text-text-muted hover:text-text-primary transition-colors flex items-center gap-1"
          >
            <History className="w-4 h-4" />
            History
          </button>
        </div>

        {/* Suggested prompts */}
        <div className="mt-6">
          <p className="text-xs text-text-muted mb-2">Try asking:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => setPrompt(s)}
                disabled={!!restriction}
                className="text-left p-2.5 rounded-lg bg-surface-hover/50 text-xs text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-colors"
              >
                <ChevronRight className="w-3 h-3 inline mr-1" />
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* History Panel */}
      {showHistory && (
        <div className="fb-card rounded-xl p-6 animate-slide-up" style={{ animationDuration: "0.3s" }}>
          <h3 className="text-base font-semibold text-text-primary mb-4">Quiz History</h3>
          {history.length === 0 ? (
            <p className="text-sm text-text-muted">No quizzes taken yet.</p>
          ) : (
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {history.map((h) => (
                <div
                  key={h.id}
                  className="p-3 rounded-lg bg-surface-alt border border-border flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm font-medium text-text-primary">{h.quiz.title}</p>
                    <p className="text-xs text-text-muted">
                      {h.quiz.difficulty} · {h.correctCount}/{h.totalQuestions} correct ·{" "}
                      {Math.floor(h.timeTaken / 60)}m {h.timeTaken % 60}s
                      {h.terminatedByProctor && (
                        <span className="text-red-400 ml-2">⚠ Proctoring terminated</span>
                      )}
                    </p>
                  </div>
                  <div
                    className={`text-lg font-bold ${
                      h.score >= 70
                        ? "text-green-400"
                        : h.score >= 40
                        ? "text-yellow-400"
                        : "text-red-400"
                    }`}
                  >
                    {h.score}%
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Phase: Quiz ───────────────────────────────────────────────────

function QuizPhase({
  quiz,
  isProctored,
  onSubmit,
}: {
  quiz: QuizData;
  isProctored: boolean;
  onSubmit: (answers: Record<string, number>, timeTaken: number, terminated: boolean, violations: unknown[]) => void;
}) {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState(quiz.duration);
  const [violations, setViolations] = useState<{ type: string; timestamp: string }[]>([]);
  const [showWarning, setShowWarning] = useState(false);
  const startTime = useRef(Date.now());
  const violationCount = useRef(0);

  // Timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          const timeTaken = Math.floor((Date.now() - startTime.current) / 1000);
          onSubmit(answers, timeTaken, false, violations);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Proctoring: tab visibility
  useEffect(() => {
    if (!isProctored) return;

    const handleVisibility = () => {
      if (document.hidden) {
        violationCount.current++;
        const v = { type: "tab_switch", timestamp: new Date().toISOString() };
        setViolations((prev) => [...prev, v]);

        if (violationCount.current >= 2) {
          const timeTaken = Math.floor((Date.now() - startTime.current) / 1000);
          onSubmit(answers, timeTaken, true, [...violations, v]);
        } else {
          setShowWarning(true);
        }
      }
    };

    const handleBlur = () => {
      violationCount.current++;
      const v = { type: "window_blur", timestamp: new Date().toISOString() };
      setViolations((prev) => [...prev, v]);

      if (violationCount.current >= 2) {
        const timeTaken = Math.floor((Date.now() - startTime.current) / 1000);
        onSubmit(answers, timeTaken, true, [...violations, v]);
      } else {
        setShowWarning(true);
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("blur", handleBlur);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("blur", handleBlur);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isProctored]);

  const selectAnswer = (qIdx: number, optIdx: number) => {
    setAnswers((prev) => ({ ...prev, [String(qIdx)]: optIdx }));
  };

  const handleSubmit = () => {
    const timeTaken = Math.floor((Date.now() - startTime.current) / 1000);
    onSubmit(answers, timeTaken, false, violations);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const q = quiz.questions[currentQ];
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="space-y-4">
      {/* Warning Modal */}
      {showWarning && (
        <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4">
          <div className="fb-card rounded-xl p-8 max-w-md w-full text-center animate-slide-up" style={{ animationDuration: "0.3s" }}>
            <AlertTriangle className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-text-primary mb-2">Proctoring Warning!</h3>
            <p className="text-text-secondary mb-6">
              Tab switch detected. This is your <strong>first warning</strong>. A second violation
              will automatically terminate and submit your quiz.
            </p>
            <button onClick={() => setShowWarning(false)} className="fb-btn-primary">
              I Understand
            </button>
          </div>
        </div>
      )}

      {/* Header Bar */}
      <div className="fb-card rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-text-primary">{quiz.title}</h2>
          <p className="text-xs text-text-muted">
            {quiz.difficulty} · {quiz.questionCount} questions
            {isProctored && (
              <span className="ml-2 text-[#E6C212]">
                <Shield className="w-3 h-3 inline" /> Proctored
              </span>
            )}
          </p>
        </div>
        <div
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-lg font-bold ${
            timeLeft < 60 ? "bg-red-500/20 text-red-400 animate-pulse" : "bg-surface-alt text-text-primary"
          }`}
        >
          <Clock className="w-5 h-5" />
          {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
        </div>
      </div>

      {/* Progress */}
      <div className="fb-card rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-text-muted">
            Question {currentQ + 1} of {quiz.questionCount}
          </span>
          <span className="text-xs text-text-muted">{answeredCount} answered</span>
        </div>
        <div className="h-1.5 bg-surface-alt rounded-full overflow-hidden">
          <div
            className="h-full bg-[#E6C212] rounded-full transition-all duration-300"
            style={{ width: `${((currentQ + 1) / quiz.questionCount) * 100}%` }}
          />
        </div>

        {/* Question nav dots */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {quiz.questions.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentQ(i)}
              className={`w-7 h-7 rounded-md text-xs font-medium transition-all ${
                i === currentQ
                  ? "bg-[#E6C212] text-black"
                  : answers[String(i)] !== undefined
                  ? "bg-green-500/20 text-green-400 border border-green-500/30"
                  : "bg-surface-alt text-text-muted hover:bg-surface-hover"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Question */}
      <div className="fb-card rounded-xl p-6">
        <p className="text-base font-medium text-text-primary mb-6">{q.question}</p>
        <div className="space-y-3">
          {q.options.map((opt, oi) => (
            <button
              key={oi}
              onClick={() => selectAnswer(currentQ, oi)}
              className={`w-full text-left p-4 rounded-lg border transition-all duration-200 ${
                answers[String(currentQ)] === oi
                  ? "border-[#E6C212] bg-[#E6C212]/10 text-text-primary"
                  : "border-border bg-surface-alt text-text-secondary hover:border-border-light hover:bg-surface-hover"
              }`}
            >
              <span
                className={`inline-flex items-center justify-center w-6 h-6 rounded-full mr-3 text-xs font-bold ${
                  answers[String(currentQ)] === oi
                    ? "bg-[#E6C212] text-black"
                    : "bg-border text-text-muted"
                }`}
              >
                {String.fromCharCode(65 + oi)}
              </span>
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={() => setCurrentQ((p) => Math.max(0, p - 1))}
          disabled={currentQ === 0}
          className="px-4 py-2 rounded-lg border border-border text-text-secondary hover:bg-surface-hover disabled:opacity-30 transition-colors flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" /> Previous
        </button>

        {currentQ === quiz.questionCount - 1 ? (
          <button onClick={handleSubmit} className="fb-btn-primary">
            <Send className="w-4 h-4" /> Submit Quiz
          </button>
        ) : (
          <button
            onClick={() => setCurrentQ((p) => Math.min(quiz.questionCount - 1, p + 1))}
            className="px-4 py-2 rounded-lg bg-[#E6C212] text-black font-semibold hover:bg-[#c9a810] transition-colors flex items-center gap-2"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Phase: Results ────────────────────────────────────────────────

function ResultsPhase({
  result,
  onReset,
}: {
  result: QuizResult;
  onReset: () => void;
}) {
  const [expanded, setExpanded] = useState<Set<number>>(new Set());

  const toggle = (idx: number) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(idx) ? next.delete(idx) : next.add(idx);
      return next;
    });
  };

  const minutes = Math.floor(result.timeTaken / 60);
  const seconds = result.timeTaken % 60;

  return (
    <div className="space-y-6 animate-slide-up" style={{ animationDuration: "0.4s" }}>
      {result.terminatedByProctor && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-300">Exam Terminated — Proctoring Violation</p>
            <p className="text-xs text-red-400 mt-1">
              Your quiz was auto-submitted due to repeated tab switching. You are restricted from
              generating quizzes for 24 hours.
            </p>
          </div>
        </div>
      )}

      {/* Score Card */}
      <div className="fb-card rounded-xl p-8 text-center">
        <h2 className="text-2xl font-bold text-text-primary mb-2">{result.quizTitle}</h2>
        <p className="text-sm text-text-muted mb-6">{result.topic} · {result.difficulty}</p>

        <div
          className={`text-6xl font-black mb-2 ${
            result.score >= 70
              ? "text-green-400"
              : result.score >= 40
              ? "text-yellow-400"
              : "text-red-400"
          }`}
        >
          {result.score}%
        </div>
        <p className="text-text-muted text-sm mb-8">
          {result.score >= 70
            ? "Excellent! Great work! 🎉"
            : result.score >= 40
            ? "Good effort, keep practicing! 💪"
            : "Needs improvement. Review the topics! 📚"}
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Total", value: result.totalQuestions, icon: Target, color: "text-text-primary" },
            { label: "Correct", value: result.correctCount, icon: CheckCircle2, color: "text-green-400" },
            { label: "Incorrect", value: result.incorrectCount, icon: XCircle, color: "text-red-400" },
            { label: "Skipped", value: result.skippedCount, icon: MinusCircle, color: "text-yellow-400" },
          ].map((stat) => (
            <div key={stat.label} className="p-3 rounded-lg bg-surface-alt">
              <stat.icon className={`w-5 h-5 ${stat.color} mx-auto mb-1`} />
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-text-muted">{stat.label}</p>
            </div>
          ))}
        </div>

        <p className="text-sm text-text-muted mt-4">
          Time: {minutes}m {seconds}s
        </p>
      </div>

      {/* Question-wise Results */}
      <div className="fb-card rounded-xl p-6">
        <h3 className="text-base font-semibold text-text-primary mb-4">Question-wise Results</h3>
        <div className="space-y-3">
          {result.questionResults.map((qr) => (
            <div key={qr.questionIndex} className="rounded-lg border border-border overflow-hidden">
              <button
                onClick={() => toggle(qr.questionIndex)}
                className={`w-full p-4 flex items-center gap-3 text-left transition-colors ${
                  qr.isCorrect
                    ? "bg-green-500/5 hover:bg-green-500/10"
                    : qr.isSkipped
                    ? "bg-yellow-500/5 hover:bg-yellow-500/10"
                    : "bg-red-500/5 hover:bg-red-500/10"
                }`}
              >
                {qr.isCorrect ? (
                  <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
                ) : qr.isSkipped ? (
                  <MinusCircle className="w-5 h-5 text-yellow-400 shrink-0" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-400 shrink-0" />
                )}
                <span className="text-sm text-text-primary flex-1">
                  <span className="text-text-muted mr-2">Q{qr.questionIndex + 1}.</span>
                  {qr.question}
                </span>
                <ChevronRight
                  className={`w-4 h-4 text-text-muted transition-transform ${
                    expanded.has(qr.questionIndex) ? "rotate-90" : ""
                  }`}
                />
              </button>

              {expanded.has(qr.questionIndex) && (
                <div className="p-4 bg-surface-alt border-t border-border space-y-2 text-sm">
                  {qr.options.map((opt, oi) => (
                    <div
                      key={oi}
                      className={`p-2 rounded ${
                        oi === qr.correctIndex
                          ? "bg-green-500/10 text-green-300"
                          : oi === qr.userAnswer && !qr.isCorrect
                          ? "bg-red-500/10 text-red-300"
                          : "text-text-secondary"
                      }`}
                    >
                      <span className="font-medium mr-2">{String.fromCharCode(65 + oi)}.</span>
                      {opt}
                      {oi === qr.correctIndex && " ✓"}
                      {oi === qr.userAnswer && oi !== qr.correctIndex && " ✗ (your answer)"}
                    </div>
                  ))}
                  <p className="text-text-muted mt-2 pt-2 border-t border-border">
                    💡 {qr.explanation}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center">
        <button onClick={onReset} className="fb-btn-primary">
          <RotateCcw className="w-4 h-4" /> Generate Another Quiz
        </button>
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────

export default function QuizGenerator() {
  const [phase, setPhase] = useState<"input" | "quiz" | "results">("input");
  const [isLoading, setIsLoading] = useState(false);
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [isProctored, setIsProctored] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [restriction, setRestriction] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check restriction on mount
  useEffect(() => {
    fetch("/api/ai/quiz-generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: "__check_restriction__" }),
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.restrictedUntil) setRestriction(d.restrictedUntil);
      })
      .catch(() => {});
  }, []);

  const handleGenerate = useCallback(
    async (prompt: string, proctored: boolean) => {
      setIsLoading(true);
      setIsProctored(proctored);
      try {
        const res = await fetch("/api/ai/quiz-generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt }),
        });
        const data = await res.json();

        if (data.error) {
          if (data.restrictedUntil) setRestriction(data.restrictedUntil);
          alert(data.error);
          return;
        }

        setQuizData(data);
        setPhase("quiz");
      } catch {
        alert("Failed to generate quiz. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const handleSubmit = useCallback(
    async (
      answers: Record<string, number>,
      timeTaken: number,
      terminated: boolean,
      violations: unknown[]
    ) => {
      if (!quizData || isSubmitting) return;
      setIsSubmitting(true);

      try {
        const res = await fetch("/api/ai/quiz-submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            quizId: quizData.id,
            answers,
            timeTaken,
            isProctored,
            terminatedByProctor: terminated,
            violations,
          }),
        });
        const data = await res.json();

        if (data.error) {
          alert(data.error);
          return;
        }

        setResult(data);
        setPhase("results");

        if (terminated) {
          setRestriction(new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString());
        }
      } catch {
        alert("Failed to submit quiz.");
      } finally {
        setIsSubmitting(false);
      }
    },
    [quizData, isProctored, isSubmitting]
  );

  const handleReset = () => {
    setPhase("input");
    setQuizData(null);
    setResult(null);
    setIsProctored(false);
  };

  if (phase === "quiz" && quizData) {
    return (
      <QuizPhase quiz={quizData} isProctored={isProctored} onSubmit={handleSubmit} />
    );
  }

  if (phase === "results" && result) {
    return <ResultsPhase result={result} onReset={handleReset} />;
  }

  return (
    <InputPhase
      onGenerate={handleGenerate}
      isLoading={isLoading}
      restriction={restriction}
    />
  );
}
