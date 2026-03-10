"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { useApp } from "@/store";
import StandardLayout from "@/components/layout/StandardLayout";
import { Course, Chapter, Exercise } from "@/types";
import { CATEGORY_ICONS, DIFFICULTY_COLORS } from "@/constants/ui";
import {
    BookOpen,
    Star,
    Users,
    Clock,
    ArrowLeft,
    Loader2,
} from "lucide-react";

// Extracted Components
import ChapterItem from "@/components/courses/ChapterItem";
import CourseSummaryCard from "@/components/courses/CourseSummaryCard";

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
                if (found) setCourse(found);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [courseId]);

    if (loading) return <div className="h-screen flex items-center justify-center bg-surface"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>;
    if (!course) return <div className="h-screen flex items-center justify-center bg-surface"><div className="text-center"><h1 className="text-2xl font-bold text-text-primary mb-2">Course Not Found</h1><Link href="/courses" className="text-primary-light hover:underline">← Back to Courses</Link></div></div>;

    const isEnrolled = user.enrolledCourses.includes(course.id);
    const progress = getUserProgress(course.id);
    const totalExercises = course.chapters.reduce((sum: number, ch: Chapter) => sum + ch.exercises.length, 0);
    const totalXPEarnable = course.chapters.reduce((sum: number, ch: Chapter) => sum + ch.exercises.reduce((s: number, ex: Exercise) => s + ex.xpReward, 0), 0);

    const toggleChapter = (chapterId: string) => {
        setExpandedChapters((prev) => prev.includes(chapterId) ? prev.filter((id) => id !== chapterId) : [...prev, chapterId]);
    };

    return (
        <StandardLayout particlesCount={15} containerClassName="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Link href="/courses" className="inline-flex items-center gap-2 text-text-secondary hover:text-text-primary mb-6 transition-colors text-sm"><ArrowLeft className="w-4 h-4" />Back to Courses</Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="glass rounded-2xl overflow-hidden">
                        <div className="h-48 gradient-card flex items-center justify-center relative">
                            <span className="text-7xl group-hover:scale-125 transition-transform">{CATEGORY_ICONS[course.category] || "📚"}</span>
                            <div className="absolute top-4 right-4 flex gap-2">
                                {course.isPremium && <span className="px-3 py-1 rounded-full text-xs font-semibold gradient-primary text-white">PRO</span>}
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${DIFFICULTY_COLORS[course.difficulty]}`}>{course.difficulty}</span>
                            </div>
                        </div>
                        <div className="p-6">
                            <h1 className="text-2xl sm:text-3xl font-bold text-text-primary mb-3">{course.title}</h1>
                            <p className="text-text-secondary mb-4 leading-relaxed">{course.description}</p>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-text-muted">
                                <span className="flex items-center gap-1"><Star className="w-4 h-4 text-warning fill-warning" />{course.rating} rating</span>
                                <span className="flex items-center gap-1"><Users className="w-4 h-4" />{course.enrolledCount.toLocaleString()} students</span>
                                <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{course.estimatedHours} hours</span>
                                <span className="flex items-center gap-1"><BookOpen className="w-4 h-4" />{totalExercises} exercises</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h2 className="text-xl font-bold text-text-primary mb-4">Course Curriculum</h2>
                        {course.chapters.map((chapter: Chapter) => (
                            <ChapterItem
                                key={chapter.id}
                                chapter={chapter}
                                isExpanded={expandedChapters.includes(chapter.id)}
                                onToggle={() => toggleChapter(chapter.id)}
                                isExerciseCompleted={isExerciseCompleted}
                                userSubscription={user.subscription}
                                isEnrolled={isEnrolled}
                                courseId={course.id}
                            />
                        ))}
                    </div>
                </div>

                <div className="space-y-6">
                    <CourseSummaryCard
                        course={course}
                        progress={progress}
                        totalXPEarnable={totalXPEarnable}
                        isEnrolled={isEnrolled}
                        userSubscription={user.subscription}
                        onEnroll={enrollCourse}
                    />
                </div>
            </div>
        </StandardLayout>
    );
}

export default function CourseDetailPage({ params }: { params: Promise<{ courseId: string }> }) {
    const resolvedParams = use(params);
    return <CourseDetailContent courseId={resolvedParams.courseId} />;
}
