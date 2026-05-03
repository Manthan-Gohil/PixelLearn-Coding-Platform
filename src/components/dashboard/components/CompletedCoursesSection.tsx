"use client";

import { Award, CheckCircle2, Sparkles } from "lucide-react";
import type { Course } from "@/types";
import { CourseProgressSummary } from "@/types/dashboard";
import { getCategoryIcon } from "@/utils/courses";
import { useStaggerReveal } from "@/hooks/useScrollReveal";

interface CompletedCoursesSectionProps {
    completedCourses: Course[];
}

// Map course language/category to a proficiency label
function getProficiencyLabel(course: Course): string {
    const title = course.title.toLowerCase();
    if (title.includes("react")) return "React.js";
    if (title.includes("next")) return "Next.js";
    if (title.includes("python")) return "Python";
    if (title.includes("javascript") || title.includes("js")) return "JavaScript";
    if (title.includes("typescript") || title.includes("ts")) return "TypeScript";
    if (title.includes("java ") || title === "java") return "Java";
    if (title.includes("c++") || title.includes("cpp")) return "C++";
    if (title.includes("html")) return "HTML";
    if (title.includes("css")) return "CSS";
    if (title.includes("node")) return "Node.js";
    if (title.includes("rust")) return "Rust";
    if (title.includes("go ") || title.includes("golang")) return "Go";
    if (title.includes("sql")) return "SQL";
    if (title.includes("dsa") || title.includes("data structure")) return "Data Structures & Algorithms";
    // Fallback: use the course title directly
    return course.title.replace(/\b(course|tutorial|masterclass|bootcamp|fundamentals|basics)\b/gi, "").trim();
}

// Gradient colors for proficiency badges
const BADGE_GRADIENTS = [
    "from-emerald-500/20 to-cyan-500/20",
    "from-violet-500/20 to-fuchsia-500/20",
    "from-amber-500/20 to-orange-500/20",
    "from-sky-500/20 to-blue-500/20",
    "from-rose-500/20 to-pink-500/20",
    "from-lime-500/20 to-green-500/20",
];

const BADGE_BORDERS = [
    "border-emerald-500/40",
    "border-violet-500/40",
    "border-amber-500/40",
    "border-sky-500/40",
    "border-rose-500/40",
    "border-lime-500/40",
];

const BADGE_TEXT_COLORS = [
    "text-emerald-400",
    "text-violet-400",
    "text-amber-400",
    "text-sky-400",
    "text-rose-400",
    "text-lime-400",
];

export default function CompletedCoursesSection({ completedCourses }: CompletedCoursesSectionProps) {
    const gridRef = useStaggerReveal<HTMLDivElement>(".proficiency-badge", {
        direction: "up",
        distance: 25,
        stagger: 0.1,
        scale: 0.95,
        duration: 0.5,
    });

    if (completedCourses.length === 0) return null;

    return (
        <div className="mb-8">
            {/* Section Header */}
            <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#E6C212]/20 to-emerald-500/20 border border-[#E6C212]/30 flex items-center justify-center">
                    <Award className="w-5 h-5 text-[#E6C212]" />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
                        Your Proficiencies
                        <Sparkles className="w-4 h-4 text-[#E6C212] animate-pulse" />
                    </h2>
                    <p className="text-xs text-text-muted">
                        Courses you&apos;ve mastered — {completedCourses.length} completed
                    </p>
                </div>
            </div>

            {/* Proficiency Badges Grid */}
            <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {completedCourses.map((course, index) => {
                    const gradientIdx = index % BADGE_GRADIENTS.length;
                    const proficiency = getProficiencyLabel(course);

                    return (
                        <div
                            key={course.id}
                            className={`proficiency-badge group relative rounded-xl border ${BADGE_BORDERS[gradientIdx]} bg-gradient-to-br ${BADGE_GRADIENTS[gradientIdx]} p-4 hover:scale-[1.02] transition-all duration-300 cursor-default overflow-hidden`}
                        >
                            {/* Subtle shine effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                            <div className="relative flex items-center gap-3">
                                {/* Course icon */}
                                <div className="w-11 h-11 rounded-xl bg-surface/80 border border-border flex items-center justify-center text-xl shrink-0 overflow-hidden">
                                    {course.thumbnail ? (
                                        <img
                                            src={course.thumbnail}
                                            alt={course.title}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        getCategoryIcon(course.category)
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    {/* Proficiency label */}
                                    <div className="flex items-center gap-1.5 mb-0.5">
                                        <CheckCircle2 className={`w-3.5 h-3.5 ${BADGE_TEXT_COLORS[gradientIdx]} shrink-0`} />
                                        <span className={`text-xs font-bold ${BADGE_TEXT_COLORS[gradientIdx]} uppercase tracking-wider`}>
                                            Proficient
                                        </span>
                                    </div>
                                    {/* Language/Framework name */}
                                    <p className="text-sm font-semibold text-text-primary truncate">
                                        {proficiency}
                                    </p>
                                    {/* XP earned */}
                                    <p className="text-[10px] text-text-muted mt-0.5">
                                        {course.totalXP} XP earned • {course.chapters.reduce((sum, ch) => sum + ch.exercises.length, 0)} exercises
                                    </p>
                                </div>

                                {/* Completion badge */}
                                <div className="shrink-0">
                                    <div className={`w-8 h-8 rounded-lg bg-surface/60 border ${BADGE_BORDERS[gradientIdx]} flex items-center justify-center`}>
                                        <span className="text-lg">🏆</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
