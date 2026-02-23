"use client";

import { use } from "react";
import Link from "next/link";
import { AppProvider, useApp } from "@/store";
import Navbar from "@/components/layout/Navbar";
import { COURSES } from "@/services/data";
import { Course, Chapter, Exercise } from "@/types";
import { useState, useEffect } from "react";
import {
    BookOpen,
    CheckCircle2,
    Lock,
    Play,
    Zap,
    Star,
    Users,
    Clock,
    ArrowLeft,
    ChevronDown,
    ChevronUp,
    Trophy,
    BarChart3,
    Loader2,
} from "lucide-react";

function CourseDetailContent({ courseId }: { courseId: string }) {
    const { user, enrollCourse, getUserProgress, isExerciseCompleted } = useApp();
    const [course, setCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState(true);
    const [expandedChapters, setExpandedChapters] = useState<string[]>([]);

    useEffect(() => {
        fetch("/api/courses")
            .then((res) => res.json())
            .then((data) => {
                const found = data.find((c: Course) => c.id === courseId);
                if (found) {
                    setCourse(found);
                }
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [courseId]);

    if (loading) {
        return (
            <main className="min-h-screen bg-surface pt-16 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </main>
        );
    }

    if (!course) {
        return (
            <main className="min-h-screen bg-surface pt-16 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-text-primary mb-2">Course Not Found</h1>
                    <Link href="/courses" className="text-primary-light hover:underline">
                        ← Back to Courses
                    </Link>
                </div>
            </main>
        );
    }

    const isEnrolled = user.enrolledCourses.includes(course.id);
    const progress = getUserProgress(course.id);
    const totalExercises = course.chapters.reduce(
        (sum: number, ch: Chapter) => sum + ch.exercises.length,
        0
    );
    const totalXPEarnable = course.chapters.reduce(
        (sum: number, ch: Chapter) => sum + ch.exercises.reduce((s: number, ex: Exercise) => s + ex.xpReward, 0),
        0
    );

    const toggleChapter = (chapterId: string) => {
        setExpandedChapters((prev) =>
            prev.includes(chapterId)
                ? prev.filter((id) => id !== chapterId)
                : [...prev, chapterId]
        );
    };

    const categoryIcons: Record<string, string> = {
        Python: "🐍",
        JavaScript: "⚡",
        "Web Development": "🌐",
        React: "⚛️",
        DSA: "🧮",
    };

    const difficultyColors: Record<string, string> = {
        beginner: "text-success bg-success/10",
        intermediate: "text-warning bg-warning/10",
        advanced: "text-danger bg-danger/10",
    };

    return (
        <main className="min-h-screen bg-surface pt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Back Link */}
                <Link
                    href="/courses"
                    className="inline-flex items-center gap-2 text-text-secondary hover:text-text-primary mb-6 transition-colors text-sm"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Courses
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Course Header */}
                        <div className="glass rounded-2xl overflow-hidden">
                            <div className="h-48 gradient-card flex items-center justify-center relative">
                                <span className="text-7xl">
                                    {categoryIcons[course.category] || "📚"}
                                </span>
                                <div className="absolute top-4 right-4 flex gap-2">
                                    {course.isPremium && (
                                        <span className="px-3 py-1 rounded-full text-xs font-semibold gradient-primary text-white">
                                            PRO
                                        </span>
                                    )}
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-medium ${difficultyColors[course.difficulty]}`}
                                    >
                                        {course.difficulty}
                                    </span>
                                </div>
                            </div>
                            <div className="p-6">
                                <h1 className="text-2xl sm:text-3xl font-bold text-text-primary mb-3">
                                    {course.title}
                                </h1>
                                <p className="text-text-secondary mb-4 leading-relaxed">
                                    {course.description}
                                </p>
                                <div className="flex flex-wrap items-center gap-4 text-sm text-text-muted">
                                    <span className="flex items-center gap-1">
                                        <Star className="w-4 h-4 text-warning fill-warning" />
                                        {course.rating} rating
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Users className="w-4 h-4" />
                                        {course.enrolledCount.toLocaleString()} students
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-4 h-4" />
                                        {course.estimatedHours} hours
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <BookOpen className="w-4 h-4" />
                                        {totalExercises} exercises
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Chapters */}
                        <div className="space-y-3">
                            <h2 className="text-xl font-bold text-text-primary mb-4">
                                Course Curriculum
                            </h2>
                            {course.chapters.map((chapter: Chapter) => {
                                const isExpanded = expandedChapters.includes(chapter.id);
                                const chapterCompleted = chapter.exercises.filter((ex: Exercise) =>
                                    isExerciseCompleted(ex.id)
                                ).length;
                                const chapterTotal = chapter.exercises.length;
                                const isLocked =
                                    chapter.isPremium && user.subscription === "free";

                                return (
                                    <div
                                        key={chapter.id}
                                        className={`glass rounded-xl overflow-hidden transition-all ${isLocked ? "opacity-60" : ""
                                            }`}
                                    >
                                        {/* Chapter Header */}
                                        <button
                                            onClick={() => toggleChapter(chapter.id)}
                                            className="w-full flex items-center gap-4 p-4 hover:bg-surface-hover/50 transition-colors"
                                        >
                                            <div
                                                className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold ${chapterCompleted === chapterTotal && chapterTotal > 0
                                                    ? "bg-success/10 text-success"
                                                    : "bg-primary/10 text-primary-light"
                                                    }`}
                                            >
                                                {chapterCompleted === chapterTotal && chapterTotal > 0
                                                    ? "✓"
                                                    : chapter.order}
                                            </div>
                                            <div className="flex-1 text-left">
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-semibold text-text-primary">
                                                        {chapter.title}
                                                    </h3>
                                                    {isLocked && (
                                                        <Lock className="w-4 h-4 text-text-muted" />
                                                    )}
                                                    {chapter.isPremium && (
                                                        <span className="px-1.5 py-0.5 rounded text-xs font-medium gradient-primary text-white">
                                                            PRO
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-xs text-text-muted mt-0.5">
                                                    {chapter.description} · {chapterCompleted}/
                                                    {chapterTotal} completed
                                                </p>
                                            </div>
                                            {/* Progress */}
                                            <div className="hidden sm:block w-24">
                                                <div className="w-full bg-surface-hover rounded-full h-1.5">
                                                    <div
                                                        className="h-1.5 rounded-full gradient-primary"
                                                        style={{
                                                            width: `${chapterTotal > 0
                                                                ? (chapterCompleted / chapterTotal) * 100
                                                                : 0
                                                                }%`,
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            {isExpanded ? (
                                                <ChevronUp className="w-5 h-5 text-text-muted" />
                                            ) : (
                                                <ChevronDown className="w-5 h-5 text-text-muted" />
                                            )}
                                        </button>

                                        {/* Exercises List */}
                                        {isExpanded && (
                                            <div className="border-t border-border">
                                                {chapter.exercises.map((exercise: Exercise) => {
                                                    const completed = isExerciseCompleted(exercise.id);
                                                    const canAccess = isEnrolled && !isLocked;

                                                    return (
                                                        <div
                                                            key={exercise.id}
                                                            className="flex items-center gap-4 px-4 py-3 border-b border-border/50 last:border-0 hover:bg-surface-hover/30 transition-colors"
                                                        >
                                                            <div
                                                                className={`w-6 h-6 rounded-full flex items-center justify-center ${completed
                                                                    ? "bg-success text-white"
                                                                    : canAccess
                                                                        ? "border-2 border-primary/40"
                                                                        : "border-2 border-border"
                                                                    }`}
                                                            >
                                                                {completed && (
                                                                    <CheckCircle2 className="w-4 h-4" />
                                                                )}
                                                            </div>
                                                            <div className="flex-1">
                                                                <div className="text-sm font-medium text-text-primary">
                                                                    {exercise.title}
                                                                </div>
                                                                <div className="text-xs text-text-muted">
                                                                    {exercise.description}
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-3">
                                                                <span
                                                                    className={`text-xs px-2 py-0.5 rounded ${(exercise.difficulty === 'easy' ? "text-success bg-success/10" : exercise.difficulty === 'medium' ? "text-warning bg-warning/10" : "text-danger bg-danger/10")}`}
                                                                >
                                                                    {exercise.difficulty}
                                                                </span>
                                                                <span className="text-xs text-text-muted flex items-center gap-1">
                                                                    <Zap className="w-3 h-3 text-warning" />
                                                                    {exercise.xpReward}
                                                                </span>
                                                                {canAccess ? (
                                                                    <Link
                                                                        href={`/playground/${course.id}/${exercise.id}`}
                                                                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${completed
                                                                            ? "border border-success/30 text-success hover:bg-success/10"
                                                                            : "gradient-primary text-white hover:opacity-90"
                                                                            }`}
                                                                    >
                                                                        {completed ? "Review" : "Start"}
                                                                    </Link>
                                                                ) : (
                                                                    <span className="px-3 py-1 rounded-lg text-xs text-text-muted border border-border">
                                                                        <Lock className="w-3 h-3 inline" />
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right Panel - Summary */}
                    <div className="space-y-6">
                        {/* Progress Card */}
                        <div className="glass rounded-xl p-6 sticky top-24">
                            <h3 className="text-lg font-semibold text-text-primary mb-4">
                                Course Progress
                            </h3>

                            {/* Circular Progress */}
                            <div className="flex justify-center mb-6">
                                <div className="relative w-32 h-32">
                                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                                        <circle
                                            cx="50"
                                            cy="50"
                                            r="42"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="8"
                                            className="text-surface-hover"
                                        />
                                        <circle
                                            cx="50"
                                            cy="50"
                                            r="42"
                                            fill="none"
                                            stroke="url(#progressGradient)"
                                            strokeWidth="8"
                                            strokeLinecap="round"
                                            strokeDasharray={`${2 * Math.PI * 42}`}
                                            strokeDashoffset={`${2 * Math.PI * 42 * (1 - progress.percentage / 100)
                                                }`}
                                            className="transition-all duration-1000"
                                        />
                                        <defs>
                                            <linearGradient id="progressGradient">
                                                <stop offset="0%" stopColor="#6366f1" />
                                                <stop offset="100%" stopColor="#06b6d4" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-text-primary">
                                                {progress.percentage}%
                                            </div>
                                            <div className="text-xs text-text-muted">complete</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="space-y-3 mb-6">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-text-secondary flex items-center gap-2">
                                        <BookOpen className="w-4 h-4" />
                                        Exercises
                                    </span>
                                    <span className="font-medium text-text-primary">
                                        {progress.completed}/{progress.total}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-text-secondary flex items-center gap-2">
                                        <Zap className="w-4 h-4 text-warning" />
                                        XP Available
                                    </span>
                                    <span className="font-medium text-text-primary">
                                        {totalXPEarnable}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-text-secondary flex items-center gap-2">
                                        <Trophy className="w-4 h-4 text-accent" />
                                        Chapters
                                    </span>
                                    <span className="font-medium text-text-primary">
                                        {course.chapters.length}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-text-secondary flex items-center gap-2">
                                        <BarChart3 className="w-4 h-4 text-primary-light" />
                                        Difficulty
                                    </span>
                                    <span
                                        className={`px-2 py-0.5 rounded text-xs font-medium ${difficultyColors[course.difficulty]}`}
                                    >
                                        {course.difficulty}
                                    </span>
                                </div>
                            </div>

                            {/* Action Button */}
                            {!isEnrolled ? (
                                <button
                                    onClick={() => enrollCourse(course.id)}
                                    disabled={
                                        course.isPremium && user.subscription === "free"
                                    }
                                    className={`w-full py-3 rounded-xl font-semibold transition-all ${course.isPremium && user.subscription === "free"
                                        ? "border border-border text-text-muted cursor-not-allowed"
                                        : "gradient-primary text-white hover:opacity-90 shadow-lg shadow-primary/25"
                                        }`}
                                >
                                    {course.isPremium && user.subscription === "free" ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <Lock className="w-4 h-4" /> Upgrade to Pro
                                        </span>
                                    ) : (
                                        <span className="flex items-center justify-center gap-2">
                                            <Play className="w-4 h-4" /> Enroll Now
                                        </span>
                                    )}
                                </button>
                            ) : (
                                <Link
                                    href={`/playground/${course.id}/${course.chapters[0]?.exercises[0]?.id || ""
                                        }`}
                                    className="block w-full text-center py-3 rounded-xl font-semibold gradient-primary text-white hover:opacity-90 shadow-lg shadow-primary/25 transition-all"
                                >
                                    <span className="flex items-center justify-center gap-2">
                                        <Play className="w-4 h-4" /> Continue Learning
                                    </span>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default function CourseDetailPage({
    params,
}: {
    params: Promise<{ courseId: string }>;
}) {
    const resolvedParams = use(params);
    return (
        <AppProvider>
            <Navbar />
            <CourseDetailContent courseId={resolvedParams.courseId} />
        </AppProvider>
    );
}
