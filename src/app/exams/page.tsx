"use client";

import { useState, useEffect } from "react";
import { useApp } from "@/store";
import StandardLayout from "@/components/layout/StandardLayout";
import { useScrollReveal, useStaggerReveal } from "@/hooks/useScrollReveal";
import {
  Trophy,
  Clock,
  Users,
  ChevronRight,
  Shield,
  CheckCircle2,
  Lock,
  Sparkles,
  Plus,
  Settings,
  Code2,
  Target,
  ArrowRight,
  Play,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface ExamItem {
  id: string;
  title: string;
  description: string;
  duration: number;
  isPublished: boolean;
  problemCount: number;
  totalPoints: number;
  participantCount: number;
  createdAt: string;
  userAttempt: {
    completedAt: string | null;
    totalScore: number;
  } | null;
}

function ExamsContent() {
  const { user } = useApp();
  const router = useRouter();
  const [exams, setExams] = useState<ExamItem[]>([]);
  const [loading, setLoading] = useState(true);

  const headerRef = useScrollReveal<HTMLDivElement>({
    direction: "up",
    distance: 30,
    duration: 0.6,
  });
  const cardsRef = useStaggerReveal<HTMLDivElement>(".exam-card", {
    direction: "up",
    distance: 30,
    stagger: 0.1,
    duration: 0.5,
  });

  const fetchExams = () => {
    fetch("/api/exams")
      .then((r) => r.json())
      .then((d) => setExams(d.exams || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchExams();
  }, [user.id, user.isAdmin]);

  const getDifficultyColor = (problems: number) => {
    if (problems <= 2) return "text-green-400";
    if (problems <= 5) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <StandardLayout particlesCount={12} showFooter={false} flowblockTheme>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div ref={headerRef} className="mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-card border border-border-light mb-3 animate-shimmer">
                <Sparkles className="w-4 h-4 text-[#E6C212] animate-float-subtle" />
                <span className="text-sm font-medium text-[#E6C212]">
                  Assessments & Contests
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-text-primary mb-2">
                Coding <span className="text-[#E6C212]">Exams</span>
              </h1>
              <p className="text-text-secondary text-lg fb-mono">
                Timed coding assessments with automated test case evaluation & anti-cheat proctoring
              </p>
            </div>

            {/* Admin Controls (Only visible to verified DB Admin users) */}
            {user.isAdmin && (
              <div className="flex items-center gap-3">
                <Link
                  href="/exams/admin"
                  className="fb-btn-primary flex items-center gap-2 !py-2.5 !px-5 shadow-lg shadow-[#E6C212]/10"
                >
                  <Settings className="w-4 h-4" />
                  <span>Admin Dashboard</span>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Exams Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="fb-card rounded-xl p-6 animate-pulse">
                <div className="h-6 bg-surface-hover rounded w-3/4 mb-4" />
                <div className="h-4 bg-surface-hover rounded w-full mb-2" />
                <div className="h-4 bg-surface-hover rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : exams.length === 0 ? (
          <div className="fb-card rounded-xl p-16 text-center">
            <Trophy className="w-16 h-16 text-text-muted opacity-20 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-text-primary mb-2">
              No Exams Available Currently
            </h3>
            <p className="text-text-muted max-w-md mx-auto mb-6">
              {user.isAdmin
                ? "You haven't created any exams yet. Head to the Admin Dashboard to create your first exam!"
                : "There are no exams scheduled right now. Please check back later!"}
            </p>
            {user.isAdmin && (
              <Link href="/exams/admin" className="fb-btn-primary inline-flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Create First Exam
              </Link>
            )}
          </div>
        ) : (
          <div
            ref={cardsRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {exams.map((exam) => {
              const completed = exam.userAttempt?.completedAt;
              const inProgress =
                exam.userAttempt && !exam.userAttempt.completedAt;

              return (
                <div
                  key={exam.id}
                  className="exam-card fb-card rounded-xl overflow-hidden spotlight-card hover-bounce group flex flex-col justify-between"
                  onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    e.currentTarget.style.setProperty(
                      "--mouse-x",
                      `${e.clientX - rect.left}px`
                    );
                    e.currentTarget.style.setProperty(
                      "--mouse-y",
                      `${e.clientY - rect.top}px`
                    );
                  }}
                >
                  <div>
                    {/* Status Banner */}
                    {completed && (
                      <div className="bg-green-500/10 border-b border-green-500/20 px-4 py-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-400" />
                          <span className="text-xs font-medium text-green-400">
                            Completed
                          </span>
                        </div>
                        <span className="text-xs font-bold text-green-400">
                          {exam.userAttempt!.totalScore} / {exam.totalPoints} pts
                        </span>
                      </div>
                    )}
                    {inProgress && (
                      <div className="bg-[#E6C212]/10 border-b border-[#E6C212]/20 px-4 py-2 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-[#E6C212]" />
                        <span className="text-xs font-medium text-[#E6C212]">
                          In Progress
                        </span>
                      </div>
                    )}
                    {!exam.isPublished && (
                      <div className="bg-red-500/10 border-b border-red-500/20 px-4 py-2 flex items-center gap-2">
                        <Lock className="w-4 h-4 text-red-400" />
                        <span className="text-xs font-medium text-red-400">
                          Draft (Admin Only)
                        </span>
                      </div>
                    )}

                    <div className="p-6">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="text-lg font-bold text-text-primary group-hover:text-[#E6C212] transition-colors line-clamp-1">
                          {exam.title}
                        </h3>
                        <span className="text-xs px-2 py-0.5 rounded bg-surface-alt text-[#E6C212] shrink-0 flex items-center gap-1 border border-[#E6C212]/20">
                          <Shield className="w-3 h-3 text-[#E6C212]" /> Full-Screen Proctored
                        </span>
                      </div>

                      <p className="text-sm text-text-muted mb-4 line-clamp-2 min-h-[40px]">
                        {exam.description || "Timed coding assessment testing algorithmic problem solving and efficiency."}
                      </p>

                      <div className="grid grid-cols-3 gap-3 mb-5">
                        <div className="text-center p-2.5 rounded-lg bg-surface-alt">
                          <Clock className="w-4 h-4 text-text-muted mx-auto mb-1" />
                          <p className="text-sm font-semibold text-text-primary">
                            {exam.duration}m
                          </p>
                          <p className="text-[11px] text-text-muted">Duration</p>
                        </div>
                        <div className="text-center p-2.5 rounded-lg bg-surface-alt">
                          <Code2
                            className={`w-4 h-4 mx-auto mb-1 ${getDifficultyColor(
                              exam.problemCount
                            )}`}
                          />
                          <p className="text-sm font-semibold text-text-primary">
                            {exam.problemCount}
                          </p>
                          <p className="text-[11px] text-text-muted">Problems</p>
                        </div>
                        <div className="text-center p-2.5 rounded-lg bg-surface-alt">
                          <Target className="w-4 h-4 text-[#E6C212] mx-auto mb-1" />
                          <p className="text-sm font-semibold text-text-primary">
                            {exam.totalPoints}
                          </p>
                          <p className="text-[11px] text-text-muted">Points</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom / Actions */}
                  <div className="px-6 pb-6 pt-0">
                    <div className="flex items-center justify-between border-t border-border pt-4">
                      <div className="flex items-center gap-1.5 text-xs text-text-muted">
                        <Users className="w-3.5 h-3.5" />
                        <span>{exam.participantCount} candidates</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {user.isAdmin && (
                          <Link
                            href={`/exams/admin/${exam.id}`}
                            className="text-xs px-3 py-1.5 rounded-lg border border-border text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-colors"
                          >
                            Edit
                          </Link>
                        )}
                        {completed ? (
                          <Link
                            href={`/exams/${exam.id}/results`}
                            className="flex items-center gap-1 text-xs font-semibold px-3.5 py-1.5 rounded-lg bg-green-500/10 text-green-400 border border-green-500/30 hover:bg-green-500/20 transition-colors"
                          >
                            <span>View Results</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </Link>
                        ) : (
                          <Link
                            href={`/exams/${exam.id}`}
                            className="flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-lg bg-[#E6C212] text-black hover:bg-[#c9a810] transition-colors shadow-md active:scale-95"
                          >
                            {inProgress ? (
                              <>
                                <Play className="w-3.5 h-3.5 fill-black" />
                                <span>Resume Test</span>
                              </>
                            ) : (
                              <>
                                <span>Start Exam</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </>
                            )}
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </StandardLayout>
  );
}

export default function ExamsPage() {
  return <ExamsContent />;
}
