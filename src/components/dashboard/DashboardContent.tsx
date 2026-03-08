"use client";

import { useApp } from "@/store";
import { COURSES, WEEKLY_ACTIVITY } from "@/services/data";
import FloatingParticles from "@/components/ui/FloatingParticles";
import GlowOrbs from "@/components/ui/GlowOrbs";
import { useScrollReveal } from "@/hooks/useScrollReveal";

// Components
import StatsCards from "./components/StatsCards";
import DashboardTabs from "./components/DashboardTabs";
import ActivitySidebar from "./components/ActivitySidebar";

export default function DashboardContent() {
    const { user, getUserProgress, enrollCourse } = useApp();
    const headerRef = useScrollReveal<HTMLDivElement>({ direction: "up", distance: 25, duration: 0.5 });

    const enrolledCourses = COURSES.filter((c) =>
        user.enrolledCourses.includes(c.id)
    );

    const totalExercisesCompleted = user.completedExercises.length;
    const weeklyXP = WEEKLY_ACTIVITY.reduce((sum, d) => sum + d.xpEarned, 0);
    const maxActivityXP = Math.max(...WEEKLY_ACTIVITY.map((d) => d.xpEarned));

    return (
        <main className="min-h-screen bg-surface pt-16 relative overflow-hidden">
            <GlowOrbs />
            <FloatingParticles count={12} />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div ref={headerRef} className="mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-text-primary mb-2">
                        Welcome back, <span className="animate-gradient-text">{user.name}</span>
                    </h1>
                    <p className="text-text-secondary">
                        Continue your learning journey. You&apos;re on a{" "}
                        <span className="text-warning font-semibold">{user.streak}-day</span> streak!
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
            </div>
        </main>
    );
}
