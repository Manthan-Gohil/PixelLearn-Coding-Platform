"use client";

import Link from "next/link";
import { BookOpen, CheckCircle2, Clock, ChevronRight } from "lucide-react";
import { Course } from "@/store";

interface EnrolledCoursesTabProps {
    enrolledCourses: Course[];
    getUserProgress: (courseId: string) => any;
    setActiveTab: (tab: any) => void;
}

export default function EnrolledCoursesTab({ enrolledCourses, getUserProgress, setActiveTab }: EnrolledCoursesTabProps) {
    if (enrolledCourses.length === 0) {
        return (
            <div className="glass rounded-xl p-12 text-center">
                <BookOpen className="w-12 h-12 text-text-muted mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                    No courses enrolled yet
                </h3>
                <p className="text-text-secondary mb-4">
                    Start learning by exploring our courses
                </p>
                <button
                    onClick={() => setActiveTab("explore")}
                    className="px-6 py-2 rounded-lg gradient-primary text-white font-medium"
                >
                    Explore Courses
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {enrolledCourses.map((course) => {
                const progress = getUserProgress(course.id);
                return (
                    <Link
                        key={course.id}
                        href={`/courses/${course.id}`}
                        className="group glass rounded-xl p-5 flex items-center gap-5 hover:border-primary/20 transition-all"
                    >
                        <div className="w-16 h-16 rounded-xl gradient-card flex items-center justify-center text-3xl shrink-0 border border-border">
                            {course.category === "Python"
                                ? "🐍"
                                : course.category === "JavaScript"
                                    ? "⚡"
                                    : course.category === "Web Development"
                                        ? "🌐"
                                        : "📚"}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-text-primary group-hover:text-primary-light transition-colors truncate">
                                    {course.title}
                                </h3>
                                {course.isPremium && (
                                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold gradient-primary text-white shrink-0">
                                        PRO
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-4 text-xs text-text-muted mb-2">
                                <span className="flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3 text-success" />
                                    {progress.completed}/{progress.total} exercises
                                </span>
                                <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {course.estimatedHours}h
                                </span>
                            </div>
                            {/* Progress Bar */}
                            <div className="w-full bg-surface-hover rounded-full h-2">
                                <div
                                    className="h-2 rounded-full gradient-primary transition-all duration-500"
                                    style={{
                                        width: `${progress.percentage}%`,
                                    }}
                                />
                            </div>
                        </div>
                        <div className="text-right shrink-0">
                            <div className="text-lg font-bold text-text-primary">
                                {progress.percentage}%
                            </div>
                            <div className="text-xs text-text-muted">
                                complete
                            </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-text-muted group-hover:text-primary-light transition-colors shrink-0" />
                    </Link>
                );
            })}
        </div>
    );
}
