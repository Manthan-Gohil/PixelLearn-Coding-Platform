"use client";

import { useMemo } from "react";
import { useApp } from "@/store";
import { WEEKLY_ACTIVITY } from "@/services/data";
import { useCoursesData } from "@/hooks/useCoursesData";
import { useScrollReveal } from "@/hooks/useScrollReveal";

// Components
import StatsCards from "./components/StatsCards";
import DashboardTabs from "./components/DashboardTabs";
import ActivitySidebar from "./components/ActivitySidebar";

export default function DashboardContent() {
    const { user, getUserProgress, enrollCourse } = useApp();
    const { courses: allCourses } = useCoursesData({
        search: "",
        categoryFilter: "all",
        difficultyFilter: "all",
    });
    const headerRef = useScrollReveal<HTMLDivElement>({ direction: "up", distance: 25, duration: 0.5 });

    const enrolledCourses = useMemo(
        () => allCourses.filter((c) => user.enrolledCourses.includes(c.id)),
        [allCourses, user.enrolledCourses]
    );

    const exploreCourses = useMemo(
        () => allCourses.filter((c) => !user.enrolledCourses.includes(c.id)),
        [allCourses, user.enrolledCourses]
    );

    const totalExercisesCompleted = useMemo(
        () => user.completedExercises.length,
        [user.completedExercises]
    );

    const weeklyXP = useMemo(
        () => WEEKLY_ACTIVITY.reduce((sum, day) => sum + day.xpEarned, 0),
        []
    );

    const maxActivityXP = useMemo(
        () => Math.max(...WEEKLY_ACTIVITY.map((day) => day.xpEarned)),
        []
    );

    return (
        <>
            {/* Header */}
            <div ref={headerRef} className="mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-text-primary mb-2">
                    Welcome back, <span className="text-[#E6C212]">{user.name}</span>
                </h1>
                <p className="text-text-secondary">
                    Continue your learning journey. You&apos;re on a{" "}
                    <span className="text-[#E6C212] font-semibold">{user.streak}-day</span> streak!
                    <span className="inline-block ml-1 animate-float-subtle">🔥</span>
                </p>
            </div>

            {/* Stats Cards */}
            <StatsCards
                user={user}
                totalExercisesCompleted={totalExercisesCompleted}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content Area (Tabs) */}
                <DashboardTabs
                    user={user}
                    enrolledCourses={enrolledCourses}
                    exploreCourses={exploreCourses}
                    getUserProgress={getUserProgress}
                    enrollCourse={enrollCourse}
                />

                {/* Right Panel - Activity */}
                <ActivitySidebar
                    user={user}
                    weeklyXP={weeklyXP}
                    maxActivityXP={maxActivityXP}
                />
            </div>
        </>
    );
}
