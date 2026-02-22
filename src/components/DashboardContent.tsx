"use client";

import { useState } from "react";
import Link from "next/link";
import { useApp } from "@/lib/store";
import { COURSES, WEEKLY_ACTIVITY } from "@/lib/data";
import {
    BookOpen,
    Compass,
    Trophy,
    Share2,
    Zap,
    Flame,
    Award,
    Clock,
    ArrowRight,
    Star,
    Users,
    Lock,
    Play,
    BarChart3,
    ChevronRight,
    Copy,
    CheckCircle2,
    TrendingUp,
    Target,
    Calendar,
} from "lucide-react";

type TabType = "enrolled" | "explore" | "achievements" | "referral";

export default function DashboardContent() {
    const [activeTab, setActiveTab] = useState<TabType>("enrolled");
    const { user, getUserProgress, enrollCourse } = useApp();
    const [copied, setCopied] = useState(false);

    const tabs = [
        { id: "enrolled" as TabType, label: "My Courses", icon: BookOpen },
        { id: "explore" as TabType, label: "Explore", icon: Compass },
        { id: "achievements" as TabType, label: "Achievements", icon: Trophy },
        { id: "referral" as TabType, label: "Refer & Earn", icon: Share2 },
    ];

    const enrolledCourses = COURSES.filter((c) =>
        user.enrolledCourses.includes(c.id)
    );
    const exploreCourses = COURSES.filter(
        (c) => !user.enrolledCourses.includes(c.id)
    );

    const totalExercisesCompleted = user.completedExercises.length;
    const weeklyXP = WEEKLY_ACTIVITY.reduce((sum, d) => sum + d.xpEarned, 0);
    const maxActivityXP = Math.max(...WEEKLY_ACTIVITY.map((d) => d.xpEarned));

    const handleCopyReferral = () => {
        navigator.clipboard.writeText(
            `https://pixellearn.com/refer/${user.referralCode}`
        );
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <main className="min-h-screen bg-surface pt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-text-primary mb-2">
                        Welcome back, <span className="gradient-text">{user.name}</span>
                    </h1>
                    <p className="text-text-secondary">
                        Continue your learning journey. You&apos;re on a{" "}
                        <span className="text-warning font-semibold">{user.streak}-day</span> streak!
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {[
                        {
                            icon: Zap,
                            label: "Total XP",
                            value: user.xp.toLocaleString(),
                            color: "text-warning",
                            bgColor: "bg-warning/10",
                        },
                        {
                            icon: Flame,
                            label: "Day Streak",
                            value: user.streak.toString(),
                            color: "text-danger",
                            bgColor: "bg-danger/10",
                        },
                        {
                            icon: Target,
                            label: "Exercises Done",
                            value: totalExercisesCompleted.toString(),
                            color: "text-primary-light",
                            bgColor: "bg-primary/10",
                        },
                        {
                            icon: Award,
                            label: "Badges Earned",
                            value: user.badges.length.toString(),
                            color: "text-accent",
                            bgColor: "bg-accent/10",
                        },
                    ].map((stat) => (
                        <div
                            key={stat.label}
                            className="glass rounded-xl p-4 hover:border-primary/20 transition-all"
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}
                                >
                                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-text-primary">
                                        {stat.value}
                                    </div>
                                    <div className="text-xs text-text-muted">{stat.label}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content Area */}
                    <div className="lg:col-span-2">
                        {/* Tab Navigation */}
                        <div className="flex items-center gap-1 mb-6 p-1 glass rounded-xl">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all flex-1 justify-center ${activeTab === tab.id
                                            ? "gradient-primary text-white shadow-lg shadow-primary/20"
                                            : "text-text-secondary hover:text-text-primary hover:bg-surface-hover"
                                        }`}
                                >
                                    <tab.icon className="w-4 h-4" />
                                    <span className="hidden sm:inline">{tab.label}</span>
                                </button>
                            ))}
                        </div>

                        {/* Tab Content */}
                        <div className="animate-fade-in">
                            {/* Enrolled Courses */}
                            {activeTab === "enrolled" && (
                                <div className="space-y-4">
                                    {enrolledCourses.length === 0 ? (
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
                                    ) : (
                                        enrolledCourses.map((course) => {
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
                                        })
                                    )}
                                </div>
                            )}

                            {/* Explore Courses */}
                            {activeTab === "explore" && (
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
                            )}

                            {/* Achievements */}
                            {activeTab === "achievements" && (
                                <div className="space-y-6">
                                    <div className="glass rounded-xl p-6">
                                        <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                                            <Trophy className="w-5 h-5 text-warning" />
                                            Badges Collection
                                        </h3>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                            {[
                                                ...user.badges.map((b) => ({ ...b, unlocked: true })),
                                                ...[
                                                    {
                                                        id: "xp-5000",
                                                        name: "Elite Coder",
                                                        description: "Earn 5000 XP",
                                                        icon: "💎",
                                                        unlocked: false,
                                                        requirement: { type: "xp" as const, value: 5000 },
                                                    },
                                                    {
                                                        id: "streak-30",
                                                        name: "Monthly Warrior",
                                                        description: "30-day streak",
                                                        icon: "🛡️",
                                                        unlocked: false,
                                                        requirement: {
                                                            type: "streak" as const,
                                                            value: 30,
                                                        },
                                                    },
                                                    {
                                                        id: "exercises-50",
                                                        name: "Problem Solver",
                                                        description: "Complete 50 exercises",
                                                        icon: "🧩",
                                                        unlocked: false,
                                                        requirement: {
                                                            type: "exercises" as const,
                                                            value: 50,
                                                        },
                                                    },
                                                ].filter(
                                                    (b) => !user.badges.some((ub) => ub.id === b.id)
                                                ),
                                            ].map((badge) => (
                                                <div
                                                    key={badge.id}
                                                    className={`p-4 rounded-xl border text-center transition-all ${"unlocked" in badge && badge.unlocked
                                                            ? "border-primary/30 bg-primary/5"
                                                            : "border-border bg-surface-alt/50 opacity-50"
                                                        }`}
                                                >
                                                    <div className="text-3xl mb-2">{badge.icon}</div>
                                                    <div className="text-sm font-semibold text-text-primary">
                                                        {badge.name}
                                                    </div>
                                                    <div className="text-xs text-text-muted mt-1">
                                                        {badge.description}
                                                    </div>
                                                    {"unlocked" in badge && badge.unlocked && (
                                                        <div className="mt-2 text-xs text-success font-medium">
                                                            ✓ Unlocked
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* XP Milestones */}
                                    <div className="glass rounded-xl p-6">
                                        <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                                            <TrendingUp className="w-5 h-5 text-primary-light" />
                                            XP Milestones
                                        </h3>
                                        <div className="space-y-4">
                                            {[
                                                { target: 1000, label: "Beginner" },
                                                { target: 2500, label: "Intermediate" },
                                                { target: 5000, label: "Advanced" },
                                                { target: 10000, label: "Master" },
                                            ].map((milestone) => {
                                                const progress = Math.min(
                                                    (user.xp / milestone.target) * 100,
                                                    100
                                                );
                                                return (
                                                    <div key={milestone.target}>
                                                        <div className="flex items-center justify-between mb-1">
                                                            <span className="text-sm text-text-secondary">
                                                                {milestone.label}
                                                            </span>
                                                            <span className="text-sm font-medium text-text-primary">
                                                                {user.xp}/{milestone.target} XP
                                                            </span>
                                                        </div>
                                                        <div className="w-full bg-surface-hover rounded-full h-2">
                                                            <div
                                                                className={`h-2 rounded-full transition-all duration-500 ${progress >= 100
                                                                        ? "bg-success"
                                                                        : "gradient-primary"
                                                                    }`}
                                                                style={{ width: `${progress}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Referral */}
                            {activeTab === "referral" && (
                                <div className="glass rounded-xl p-6">
                                    <h3 className="text-lg font-semibold text-text-primary mb-2 flex items-center gap-2">
                                        <Share2 className="w-5 h-5 text-primary-light" />
                                        Refer & Earn
                                    </h3>
                                    <p className="text-text-secondary text-sm mb-6">
                                        Share your unique referral link and earn rewards when friends
                                        join PixelLearn!
                                    </p>

                                    {/* Referral Link */}
                                    <div className="flex items-center gap-2 mb-6">
                                        <div className="flex-1 p-3 rounded-lg bg-surface-alt border border-border font-mono text-sm text-text-secondary truncate">
                                            https://pixellearn.com/refer/{user.referralCode}
                                        </div>
                                        <button
                                            onClick={handleCopyReferral}
                                            className={`px-4 py-3 rounded-lg font-medium text-sm transition-all ${copied
                                                    ? "bg-success/10 text-success border border-success/30"
                                                    : "gradient-primary text-white hover:opacity-90"
                                                }`}
                                        >
                                            {copied ? (
                                                <CheckCircle2 className="w-5 h-5" />
                                            ) : (
                                                <Copy className="w-5 h-5" />
                                            )}
                                        </button>
                                    </div>

                                    {/* Stats */}
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="p-4 rounded-xl bg-surface-alt border border-border text-center">
                                            <div className="text-2xl font-bold text-text-primary">
                                                {user.referralCount}
                                            </div>
                                            <div className="text-xs text-text-muted">
                                                Referrals
                                            </div>
                                        </div>
                                        <div className="p-4 rounded-xl bg-surface-alt border border-border text-center">
                                            <div className="text-2xl font-bold text-text-primary">
                                                {user.referralCount * 100}
                                            </div>
                                            <div className="text-xs text-text-muted">
                                                Bonus XP
                                            </div>
                                        </div>
                                        <div className="p-4 rounded-xl bg-surface-alt border border-border text-center">
                                            <div className="text-2xl font-bold text-success">
                                                Active
                                            </div>
                                            <div className="text-xs text-text-muted">Status</div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Panel - Activity */}
                    <div className="space-y-6">
                        {/* Weekly Activity */}
                        <div className="glass rounded-xl p-6">
                            <h3 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
                                <BarChart3 className="w-4 h-4 text-primary-light" />
                                Weekly Activity
                            </h3>
                            <div className="flex items-end justify-between gap-2 h-32 mb-3">
                                {WEEKLY_ACTIVITY.map((day) => (
                                    <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
                                        <div
                                            className="w-full rounded-t-md gradient-primary transition-all duration-300 hover:opacity-80 min-h-[4px]"
                                            style={{
                                                height: `${(day.xpEarned / maxActivityXP) * 100}%`,
                                            }}
                                        />
                                        <span className="text-xs text-text-muted">{day.date}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="flex items-center justify-between text-xs text-text-muted pt-3 border-t border-border">
                                <span>Total: {weeklyXP} XP</span>
                                <span className="text-success flex items-center gap-1">
                                    <TrendingUp className="w-3 h-3" /> +12%
                                </span>
                            </div>
                        </div>

                        {/* Streak Calendar */}
                        <div className="glass rounded-xl p-6">
                            <h3 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-warning" />
                                Current Streak
                            </h3>
                            <div className="text-center">
                                <div className="text-5xl font-bold gradient-text mb-1">
                                    {user.streak}
                                </div>
                                <div className="text-sm text-text-muted mb-4">
                                    days in a row
                                </div>
                                <div className="flex justify-center gap-1">
                                    {Array.from({ length: 7 }).map((_, i) => (
                                        <div
                                            key={i}
                                            className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium ${i < 5
                                                    ? "gradient-primary text-white"
                                                    : "bg-surface-hover text-text-muted"
                                                }`}
                                        >
                                            {i < 5 ? "🔥" : "·"}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div className="glass rounded-xl p-6">
                            <h3 className="text-sm font-semibold text-text-primary mb-4">
                                Quick Actions
                            </h3>
                            <div className="space-y-2">
                                {[
                                    {
                                        href: "/courses",
                                        label: "Browse Courses",
                                        icon: BookOpen,
                                    },
                                    { href: "/ai-tools", label: "AI Career Tools", icon: BarChart3 },
                                    { href: "/pricing", label: "Upgrade to Pro", icon: Zap },
                                ].map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-surface-hover transition-colors group"
                                    >
                                        <link.icon className="w-4 h-4 text-text-muted group-hover:text-primary-light" />
                                        <span className="text-sm text-text-secondary group-hover:text-text-primary">
                                            {link.label}
                                        </span>
                                        <ArrowRight className="w-4 h-4 text-text-muted ml-auto group-hover:text-primary-light" />
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
