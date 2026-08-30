"use client";

import { useState, useEffect } from "react";
import { useApp } from "@/store";
import { useRouter } from "next/navigation";
import StandardLayout from "@/components/layout/StandardLayout";
import Link from "next/link";
import {
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Edit3,
  ArrowLeft,
  Loader2,
  Shield,
  Clock,
  Users,
  ChevronRight,
} from "lucide-react";

interface AdminExam {
  id: string;
  title: string;
  description: string;
  duration: number;
  isPublished: boolean;
  problemCount: number;
  totalPoints: number;
  participantCount: number;
  createdAt: string;
}

export default function ExamAdminPage() {
  const { user } = useApp();
  const router = useRouter();
  const [exams, setExams] = useState<AdminExam[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", duration: "90" });

  useEffect(() => {
    if (!user.isAdmin) {
      router.push("/exams");
      return;
    }
    fetchExams();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchExams = async () => {
    try {
      const res = await fetch("/api/exams");
      const data = await res.json();
      setExams(data.exams || []);
    } catch {}
    setLoading(false);
  };

  const createExam = async () => {
    if (!form.title.trim()) return;
    setCreating(true);
    try {
      const res = await fetch("/api/exams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.exam) {
        router.push(`/exams/admin/${data.exam.id}`);
      }
    } catch {}
    setCreating(false);
  };

  const togglePublish = async (examId: string, isPublished: boolean) => {
    await fetch(`/api/exams/${examId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPublished: !isPublished }),
    });
    fetchExams();
  };

  const deleteExam = async (examId: string) => {
    if (!confirm("Delete this exam? All problems, test cases, and submissions will be lost.")) return;
    await fetch(`/api/exams/${examId}`, { method: "DELETE" });
    fetchExams();
  };

  if (!user.isAdmin) return null;

  return (
    <StandardLayout particlesCount={8} showFooter={false} flowblockTheme>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Link
              href="/exams"
              className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-text-primary transition-colors mb-3"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Exams
            </Link>
            <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
              <Shield className="w-6 h-6 text-[#E6C212]" />
              Exam Administration
            </h1>
          </div>
          <button
            onClick={() => setShowCreate(!showCreate)}
            className="fb-btn-primary"
          >
            <Plus className="w-4 h-4" />
            Create Exam
          </button>
        </div>

        {/* Create Form */}
        {showCreate && (
          <div className="fb-card rounded-xl p-6 animate-slide-up" style={{ animationDuration: "0.3s" }}>
            <h3 className="text-base font-semibold text-text-primary mb-4">Create New Exam</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <input
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="Exam Title"
                className="col-span-2 p-3 rounded-lg bg-surface-alt border border-border text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-[#E6C212]/60"
              />
              <input
                value={form.duration}
                onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))}
                placeholder="Duration (minutes)"
                type="number"
                className="p-3 rounded-lg bg-surface-alt border border-border text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-[#E6C212]/60"
              />
              <textarea
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Exam Description"
                rows={2}
                className="col-span-3 p-3 rounded-lg bg-surface-alt border border-border text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-[#E6C212]/60 resize-none"
              />
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowCreate(false)}
                className="px-4 py-2 rounded-lg border border-border text-text-secondary hover:bg-surface-hover text-sm transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={createExam}
                disabled={creating || !form.title.trim()}
                className="fb-btn-primary disabled:opacity-50"
              >
                {creating && <Loader2 className="w-4 h-4 animate-spin" />}
                Create Exam
              </button>
            </div>
          </div>
        )}

        {/* Exam List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="fb-card rounded-xl p-6 animate-pulse">
                <div className="h-6 bg-surface-hover rounded w-1/3 mb-3" />
                <div className="h-4 bg-surface-hover rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : exams.length === 0 ? (
          <div className="fb-card rounded-xl p-12 text-center">
            <p className="text-text-muted">No exams created yet. Click &quot;Create Exam&quot; to get started.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {exams.map((exam) => (
              <div
                key={exam.id}
                className="fb-card rounded-xl p-5 flex flex-wrap items-center justify-between gap-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-base font-semibold text-text-primary truncate">
                      {exam.title}
                    </h3>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${
                        exam.isPublished
                          ? "bg-green-500/10 text-green-400"
                          : "bg-red-500/10 text-red-400"
                      }`}
                    >
                      {exam.isPublished ? "Published" : "Draft"}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-text-muted">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {exam.duration}m
                    </span>
                    <span>{exam.problemCount} problems</span>
                    <span>{exam.totalPoints} pts</span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" /> {exam.participantCount}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={`/exams/admin/${exam.id}`}
                    className="p-2 rounded-lg border border-border text-text-muted hover:text-text-primary hover:bg-surface-hover transition-colors"
                    title="Edit"
                  >
                    <Edit3 className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => togglePublish(exam.id, exam.isPublished)}
                    className="p-2 rounded-lg border border-border text-text-muted hover:text-text-primary hover:bg-surface-hover transition-colors"
                    title={exam.isPublished ? "Unpublish" : "Publish"}
                  >
                    {exam.isPublished ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => deleteExam(exam.id)}
                    className="p-2 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </StandardLayout>
  );
}
