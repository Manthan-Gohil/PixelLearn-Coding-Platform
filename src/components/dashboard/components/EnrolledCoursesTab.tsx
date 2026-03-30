"use client";

import Link from "next/link";
import { BookOpen, CheckCircle2, Clock, ChevronRight } from "lucide-react";
import type { Course } from "@/types";
import { CourseProgressSummary, DashboardTabId } from "@/types/dashboard";
import { getCategoryIcon } from "@/utils/courses";

interface EnrolledCoursesTabProps {
    enrolledCourses: Course[];
    getUserProgress: (courseId: string, course?: Course) => CourseProgressSummary;
    setActiveTab: (tab: DashboardTabId) => void;
}

export default function EnrolledCoursesTab({ enrolledCourses, getUserProgress, setActiveTab }: EnrolledCoursesTabProps) {
    if (enrolledCourses.length === 0) {
        return (
            <div className="fb-card rounded-xl p-12 text-center">
                <BookOpen className="w-12 h-12 text-text-muted mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                    No courses enrolled yet
                </h3>
                <p className="text-text-secondary mb-4">
                    Start learning by exploring our courses
                </p>
                <button
                    onClick={() => setActiveTab("explore")}
                    className="fb-btn-primary"
                >
                    Explore Courses
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {enrolledCourses.map((course) => {
                const progress = getUserProgress(course.id, course);
                return (
                    <Link
                        key={course.id}
                        href={`/courses/${course.id}`}
                        className="group fb-card rounded-xl p-5 flex items-center gap-5 hover:border-border-light transition-all"
                    >
                        <div className="w-16 h-16 rounded-xl bg-[#0f0f0f] flex items-center justify-center text-3xl shrink-0 border border-border overflow-hidden">
                            {course.thumbnail ? (
                                <img
                                    src={course.thumbnail}
                                    alt={course.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                            ) : (
                                getCategoryIcon(course.category)
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-text-primary group-hover:text-[#E6C212] transition-colors truncate">
                                    {course.title}
                                </h3>
                                {course.isPremium && (
                                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-[#E6C212] text-black shrink-0">
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
                                    className="h-2 rounded-full bg-[#E6C212] transition-all duration-500"
                                    style={{
                                        width: `${progress.percentage}%`,
                                    }}
                                />
                            </div>
                        </div>
                        <div className="text-right shrink-0">
                            <div className="text-lg font-bold text-[#E6C212] fb-mono">
                                {progress.percentage}%
                            </div>
                            <div className="text-xs text-text-muted">
                                complete
                            </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-text-muted group-hover:text-[#E6C212] transition-colors shrink-0" />
                    </Link>
                );
            })}
        </div>
    );
}
