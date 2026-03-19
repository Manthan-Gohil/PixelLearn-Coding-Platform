"use client";

import { useState } from "react";
import { BookOpen, Compass, Trophy, Share2, Medal } from "lucide-react";
import type { Course, User } from "@/types";
import { DASHBOARD_TABS } from "@/constants/dashboard";
import { CourseProgressSummary, DashboardTabId, DashboardTabIconName } from "@/types/dashboard";
import EnrolledCoursesTab from "./EnrolledCoursesTab";
import ExploreCoursesTab from "./ExploreCoursesTab";
import AchievementsTab from "./AchievementsTab";
import ReferralTab from "./ReferralTab";
import LeaderboardWidget from "./LeaderboardWidget";

interface DashboardTabsProps {
    user: User;
    enrolledCourses: Course[];
    exploreCourses: Course[];
    getUserProgress: (courseId: string, course?: Course) => CourseProgressSummary;
    enrollCourse: (courseId: string) => void;
}

export default function DashboardTabs({ user, enrolledCourses, exploreCourses, getUserProgress, enrollCourse }: DashboardTabsProps) {
    const [activeTab, setActiveTab] = useState<DashboardTabId>("enrolled");

    const tabIcons: Record<DashboardTabIconName, typeof BookOpen> = {
        BookOpen,
        Compass,
        Trophy,
        Share2,
        Medal,
    };

    return (
        <div className="lg:col-span-2">
            {/* Tab Navigation */}
            <div className="flex items-center gap-1 mb-6 p-1 glass rounded-xl">
                {DASHBOARD_TABS.map((tab) => {
                    const Icon = tabIcons[tab.icon];
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all flex-1 justify-center ${activeTab === tab.id
                                ? "gradient-primary text-white shadow-lg shadow-primary/20"
                                : "text-text-secondary hover:text-text-primary hover:bg-surface-hover"
                                }`}
                        >
                            <Icon className="w-4 h-4" />
                            <span className="hidden sm:inline">{tab.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* Tab Content */}
            <div className="animate-fade-in">
                {activeTab === "enrolled" && (
                    <EnrolledCoursesTab
                        enrolledCourses={enrolledCourses}
                        getUserProgress={getUserProgress}
                        setActiveTab={setActiveTab}
                    />
                )}
                {activeTab === "explore" && (
                    <ExploreCoursesTab
                        user={user}
                        courses={exploreCourses}
                        enrollCourse={enrollCourse}
                    />
                )}
                {activeTab === "achievements" && (
                    <AchievementsTab user={user} />
                )}
                {activeTab === "leaderboard" && <LeaderboardWidget />}
                {activeTab === "referral" && (
                    <ReferralTab user={user} />
                )}
            </div>
        </div>
    );
}
