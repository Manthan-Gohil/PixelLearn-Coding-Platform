"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { AppProvider, useApp } from "@/store";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingParticles from "@/components/ui/FloatingParticles";
import GlowOrbs from "@/components/ui/GlowOrbs";
import { useScrollReveal, useStaggerReveal } from "@/hooks/useScrollReveal";
import { Course, Chapter } from "@/types";
import {
    Search,
    Filter,
    Star,
    Users,
    Zap,
    Clock,
    BookOpen,
    Lock,
    ArrowRight,
    Sparkles,
    Code2,
} from "lucide-react";

function CoursesContent() {
    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [difficultyFilter, setDifficultyFilter] = useState("all");
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const { user, enrollCourse } = useApp();

    const headerRef = useScrollReveal<HTMLDivElement>({ direction: "up", distance: 30, duration: 0.6 });
    const searchRef = useScrollReveal<HTMLDivElement>({ direction: "up", distance: 20, duration: 0.5, delay: 0.1 });
    const gridRef = useStaggerReveal<HTMLDivElement>(".course-item", {
        direction: "up",
        distance: 40,
        stagger: 0.06,
        duration: 0.5,
    });

    useEffect(() => {
        fetch("/api/courses")
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    setCourses(data);
                }
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const categories = [
        "all",
        ...Array.from(new Set(courses.map((c) => c.category))),
    ];
    const difficulties = ["all", "beginner", "intermediate", "advanced"];

    const filteredCourses = courses.filter((course) => {
        const matchesSearch =
            course.title.toLowerCase().includes(search.toLowerCase()) ||
            course.description.toLowerCase().includes(search.toLowerCase()) ||
            course.tags.some((t: string) =>
                t.toLowerCase().includes(search.toLowerCase())
            );
        const matchesCategory =
            categoryFilter === "all" || course.category === categoryFilter;
        const matchesDifficulty =
            difficultyFilter === "all" || course.difficulty === difficultyFilter;
        return matchesSearch && matchesCategory && matchesDifficulty;
    });

    const difficultyColors: Record<string, string> = {
        beginner: "text-success bg-success/10",
        intermediate: "text-warning bg-warning/10",
        advanced: "text-danger bg-danger/10",
    };

    const categoryIcons: Record<string, string> = {
        Python: "🐍",
        JavaScript: "⚡",
        "Web Development": "🌐",
        React: "⚛️",
        DSA: "🧮",
    };

    return (
        <main className="min-h-screen bg-surface pt-16 relative overflow-hidden">
            <GlowOrbs />
            <FloatingParticles count={20} />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div ref={headerRef} className="mb-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-3 animate-shimmer">
                        <Code2 className="w-4 h-4 text-primary-light animate-float-subtle" />
                        <span className="text-sm font-medium text-primary-light">Learn by Building</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-text-primary mb-2">
                        Explore <span className="animate-gradient-text">Courses</span>
                    </h1>
                    <p className="text-text-secondary text-lg">
                        Master programming with hands-on, practice-first courses
                    </p>
                </div>

                {/* Search & Filters */}
                <div ref={searchRef} className="glass rounded-xl p-4 mb-8 animate-glow-pulse">
                    <div className="flex flex-col sm:flex-row gap-4">
                        {/* Search */}
                        <div className="relative flex-1 group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-primary-light transition-colors" />
                            <input
                                type="text"
                                placeholder="Search courses, topics, or technologies..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-surface-alt border border-border text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary/50 focus:shadow-[0_0_15px_rgba(99,102,241,0.15)] transition-all duration-300"
                            />
                        </div>

                        {/* Category Filter */}
                        <div className="flex items-center gap-2">
                            <Filter className="w-4 h-4 text-text-muted" />
                            <select
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                className="px-3 py-2.5 rounded-lg bg-surface-alt border border-border text-text-primary focus:outline-none focus:border-primary/50 text-sm transition-all duration-300"
                            >
                                {categories.map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat === "all" ? "All Categories" : cat}
                                    </option>
                                ))}
                            </select>

                            <select
                                value={difficultyFilter}
                                onChange={(e) => setDifficultyFilter(e.target.value)}
                                className="px-3 py-2.5 rounded-lg bg-surface-alt border border-border text-text-primary focus:outline-none focus:border-primary/50 text-sm transition-all duration-300"
                            >
                                {difficulties.map((diff) => (
                                    <option key={diff} value={diff}>
                                        {diff === "all"
                                            ? "All Levels"
                                            : diff.charAt(0).toUpperCase() + diff.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Results Count */}
                <div className="mb-4 text-sm text-text-muted animate-fade-in flex items-center gap-2">
                    <Sparkles className="w-3 h-3 text-primary-light" />
                    Showing {filteredCourses.length} course
                    {filteredCourses.length !== 1 ? "s" : ""}
                </div>

                {/* Course Grid */}
                <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCourses.map((course) => {
                        const isEnrolled = user.enrolledCourses.includes(course.id);
                        const totalExercises = course.chapters.reduce(
                            (sum: number, ch: Chapter) => sum + ch.exercises.length,
                            0
                        );

                        return (
                            <div
                                key={course.id}
                                className="course-item group glass rounded-2xl overflow-hidden hover:border-primary/20 transition-all duration-300 card-hover-glow spotlight-card flex flex-col"
                                onMouseMove={(e) => {
                                    const rect = e.currentTarget.getBoundingClientRect();
                                    e.currentTarget.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
                                    e.currentTarget.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
                                }}
                            >
                                {/* Thumbnail */}
                                <div className="h-44 gradient-card flex items-center justify-center relative overflow-hidden">
                                    <span className="text-6xl group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 ease-out">
                                        {categoryIcons[course.category] || "📚"}
                                    </span>
                                    <div className="absolute inset-0 bg-gradient-to-t from-surface/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    <div className="absolute top-3 right-3 flex gap-2">
                                        {course.isPremium && (
                                            <span className="px-2.5 py-1 rounded-full text-xs font-semibold gradient-primary text-white shadow-lg animate-shimmer">
                                                PRO
                                            </span>
                                        )}
                                    </div>
                                    <div className="absolute bottom-3 left-3">
                                        <span
                                            className={`px-2.5 py-1 rounded-full text-xs font-medium ${difficultyColors[course.difficulty]}`}
                                        >
                                            {course.difficulty}
                                        </span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-5 flex flex-col flex-1">
                                    <h3 className="text-lg font-semibold text-text-primary mb-2 group-hover:text-primary-light transition-colors duration-300">
                                        {course.title}
                                    </h3>
                                    <p className="text-sm text-text-secondary mb-4 line-clamp-2 flex-1">
                                        {course.shortDescription}
                                    </p>

                                    {/* Meta */}
                                    <div className="flex items-center justify-between text-xs text-text-muted mb-4">
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
                                        <div className="flex items-center gap-3">
                                            <span className="flex items-center gap-1">
                                                <BookOpen className="w-3 h-3" />
                                                {totalExercises} exercises
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {course.estimatedHours}h
                                            </span>
                                        </div>
                                    </div>

                                    {/* Tags */}
                                    <div className="flex flex-wrap gap-1.5 mb-4">
                                        {course.tags.slice(0, 3).map((tag: string) => (
                                            <span
                                                key={tag}
                                                className="px-2 py-0.5 rounded-md bg-surface-hover text-xs text-text-muted hover:bg-primary/10 hover:text-primary-light transition-colors duration-200"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Action */}
                                    <div className="flex items-center gap-2">
                                        <Link
                                            href={`/courses/${course.id}`}
                                            className="flex-1 text-center py-2.5 rounded-lg border border-border text-sm font-medium text-text-primary hover:bg-surface-hover hover:border-primary/30 transition-all flex items-center justify-center gap-1 hover-bounce"
                                        >
                                            View Details
                                            <ArrowRight className="w-3.5 h-3.5" />
                                        </Link>
                                        {!isEnrolled && (
                                            <button
                                                onClick={() => enrollCourse(course.id)}
                                                disabled={
                                                    course.isPremium && user.subscription === "free"
                                                }
                                                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-1 hover-bounce ${course.isPremium && user.subscription === "free"
                                                    ? "border border-border text-text-muted cursor-not-allowed"
                                                    : "gradient-primary text-white hover:opacity-90 shadow-lg shadow-primary/20"
                                                    }`}
                                            >
                                                {course.isPremium && user.subscription === "free" ? (
                                                    <>
                                                        <Lock className="w-3.5 h-3.5" /> Pro Only
                                                    </>
                                                ) : (
                                                    <>
                                                        <Zap className="w-3.5 h-3.5" /> Enroll
                                                    </>
                                                )}
                                            </button>
                                        )}
                                        {isEnrolled && (
                                            <Link
                                                href={`/courses/${course.id}`}
                                                className="flex-1 py-2.5 rounded-lg text-sm font-medium border border-success/30 text-success hover:bg-success/10 transition-all text-center hover-bounce"
                                            >
                                                Continue
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {filteredCourses.length === 0 && (
                    <div className="text-center py-20 animate-fade-in">
                        <Search className="w-12 h-12 text-text-muted mx-auto mb-4 animate-float-subtle" />
                        <h3 className="text-lg font-semibold text-text-primary mb-2">
                            No courses found
                        </h3>
                        <p className="text-text-secondary">
                            Try adjusting your search or filters
                        </p>
                    </div>
                )}
            </div>
            <Footer />
        </main>
    );
}

export default function CoursesPage() {
    return (
        <AppProvider>
            <Navbar />
            <CoursesContent />
        </AppProvider>
    );
}
