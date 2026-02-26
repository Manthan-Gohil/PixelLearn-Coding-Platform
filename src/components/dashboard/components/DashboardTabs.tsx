"use client";

import { useState } from "react";
import { BookOpen, Compass, Trophy, Share2 } from "lucide-react";
import { User, Course } from "@/store";
import EnrolledCoursesTab from "./EnrolledCoursesTab";
import ExploreCoursesTab from "./ExploreCoursesTab";
import AchievementsTab from "./AchievementsTab";
import ReferralTab from "./ReferralTab";

type TabType = "enrolled" | "explore" | "achievements" | "referral";

interface DashboardTabsProps {
    user: User;
    enrolledCourses: Course[];
    getUserProgress: (courseId: string) => any;
    enrollCourse: (courseId: string) => void;
}

export default function DashboardTabs({ user, enrolledCourses, getUserProgress, enrollCourse }: DashboardTabsProps) {
    const [activeTab, setActiveTab] = useState<TabType>("enrolled");

    const tabs = [
        { id: "enrolled" as TabType, label: "My Courses", icon: BookOpen },
        { id: "explore" as TabType, label: "Explore", icon: Compass },
        { id: "achievements" as TabType, label: "Achievements", icon: Trophy },
        { id: "referral" as TabType, label: "Refer & Earn", icon: Share2 },
    ];

    return (
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
                        enrollCourse={enrollCourse}
                    />
                )}
                {activeTab === "achievements" && (
                    <AchievementsTab user={user} />
                )}
                {activeTab === "referral" && (
                    <ReferralTab user={user} />
                )}
            </div>
        </div>
    );
}
