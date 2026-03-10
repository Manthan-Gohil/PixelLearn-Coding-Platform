"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Star, Users, Zap, ArrowRight } from "lucide-react";
import FloatingParticles from "@/components/ui/FloatingParticles";
import { useScrollReveal, useStaggerReveal } from "@/hooks/useScrollReveal";
import { CATEGORY_ICONS, DIFFICULTY_COLORS } from "@/constants/ui";

export default function CoursesPreview() {
    const [featuredCourses, setFeaturedCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const headerRef = useScrollReveal<HTMLDivElement>({ direction: "up", distance: 30 });
    const gridRef = useStaggerReveal<HTMLDivElement>(".course-card", {
        direction: "up",
        distance: 50,
        stagger: 0.15,
        duration: 0.7,
    });

    useEffect(() => {
        fetch("/api/courses")
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    setFeaturedCourses(data.slice(0, 3));
                }
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    return (
        <section className="py-24 bg-surface-alt/30 relative overflow-hidden">
            <FloatingParticles count={15} />
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div ref={headerRef} className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
                        Featured <span className="gradient-text">Courses</span>
                    </h2>
                    <p className="text-text-secondary max-w-2xl mx-auto text-lg">
                        Start your journey with our most popular courses, designed by
                        industry experts.
                    </p>
                </div>

                <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {featuredCourses.map((course) => (
                        <Link
                            key={course.id}
                            href={`/courses/${course.id}`}
                            className="course-card group glass rounded-2xl overflow-hidden hover:border-primary/20 transition-all duration-300 card-hover-glow"
                        >
                            {/* Thumbnail */}
                            <div className="h-48 gradient-card flex items-center justify-center relative overflow-hidden">
                                <span className="text-6xl group-hover:scale-125 group-hover:rotate-6 transition-all duration-500">
                                    {CATEGORY_ICONS[course.category] || "📚"}
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-t from-surface/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <div className="absolute top-3 right-3 flex gap-2">
                                    {course.isPremium && (
                                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold gradient-primary text-white shadow-lg shadow-primary/25 animate-shimmer">
                                            PRO
                                        </span>
                                    )}
                                </div>
                                <div className="absolute bottom-3 left-3">
                                    <span
                                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${DIFFICULTY_COLORS[course.difficulty]}`}
                                    >
                                        {course.difficulty}
                                    </span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-5">
                                <h3 className="text-lg font-semibold text-text-primary mb-2 group-hover:text-primary-light transition-colors">
                                    {course.title}
                                </h3>
                                <p className="text-sm text-text-secondary mb-4 line-clamp-2">
                                    {course.shortDescription}
                                </p>
                                <div className="flex items-center justify-between text-xs text-text-muted">
                                    <div className="flex items-center gap-3">
                                        <span className="flex items-center gap-1">
                                            <Star className="w-3 h-3 text-warning fill-warning" />
                                            {course.rating.toFixed(1)}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Users className="w-3 h-3" />
                                            {course.enrolledCount.toLocaleString()}
                                        </span>
                                    </div>
                                    <span className="flex items-center gap-1">
                                        <Zap className="w-3 h-3 text-primary" />
                                        {course.totalXP} XP
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="text-center">
                    <Link
                        href="/courses"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border text-text-primary font-medium hover:bg-surface-hover hover:border-primary/30 transition-all hover-bounce"
                    >
                        View All Courses
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
