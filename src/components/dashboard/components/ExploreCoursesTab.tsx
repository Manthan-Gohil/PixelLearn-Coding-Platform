"use client";

import Link from "next/link";
import { Star, Users, Zap, Play, Lock } from "lucide-react";
import { User } from "@/store";
import { COURSES } from "@/services/data";

interface ExploreCoursesTabProps {
    user: User;
    enrollCourse: (courseId: string) => void;
}

export default function ExploreCoursesTab({ user, enrollCourse }: ExploreCoursesTabProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {COURSES.map((course) => {
                const isEnrolled = user.enrolledCourses.includes(course.id);
                return (
                    <div
                        key={course.id}
                        className="glass rounded-xl overflow-hidden hover:border-primary/20 transition-all group"
                    >
                        <div className="h-32 gradient-card flex items-center justify-center relative">
                            <span className="text-4xl group-hover:scale-110 transition-transform">
                                {course.category === "Python"
                                    ? "🐍"
                                    : course.category === "JavaScript"
                                        ? "⚡"
                                        : course.category === "Web Development"
                                            ? "🌐"
                                            : course.category === "React"
                                                ? "⚛️"
                                                : "🧮"}
                            </span>
                            {course.isPremium && (
                                <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-xs font-semibold gradient-primary text-white">
                                    PRO
                                </span>
                            )}
                        </div>
                        <div className="p-4">
                            <h3 className="font-semibold text-text-primary mb-1">
                                {course.title}
                            </h3>
                            <p className="text-xs text-text-secondary mb-3 line-clamp-2">
                                {course.shortDescription}
                            </p>
                            <div className="flex items-center justify-between text-xs text-text-muted mb-3">
                                <span className="flex items-center gap-1">
                                    <Star className="w-3 h-3 text-warning fill-warning" />
                                    {course.rating}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Users className="w-3 h-3" />
                                    {course.enrolledCount.toLocaleString()}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Zap className="w-3 h-3 text-primary" />
                                    {course.totalXP} XP
                                </span>
                            </div>
                            {isEnrolled ? (
                                <Link
                                    href={`/courses/${course.id}`}
                                    className="block text-center py-2 rounded-lg border border-success/30 text-success text-sm font-medium hover:bg-success/10 transition-colors"
                                >
                                    <span className="flex items-center justify-center gap-1">
                                        <Play className="w-3 h-3" /> Continue Learning
                                    </span>
                                </Link>
                            ) : (
                                <button
                                    onClick={() => enrollCourse(course.id)}
                                    className={`block w-full text-center py-2 rounded-lg text-sm font-medium transition-all ${course.isPremium &&
                                        user.subscription === "free"
                                        ? "border border-border text-text-muted cursor-not-allowed"
                                        : "gradient-primary text-white hover:opacity-90"
                                        }`}
                                    disabled={
                                        course.isPremium &&
                                        user.subscription === "free"
                                    }
                                >
                                    {course.isPremium &&
                                        user.subscription === "free" ? (
                                        <span className="flex items-center justify-center gap-1">
                                            <Lock className="w-3 h-3" /> Pro Required
                                        </span>
                                    ) : (
                                        "Enroll Now"
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
