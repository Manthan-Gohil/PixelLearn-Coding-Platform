import { Badge } from "@/types";
import {
  DashboardTabIconName,
  DashboardTabId,
  DashboardQuickActionIconName,
} from "@/types/dashboard";

export const DASHBOARD_TABS: Array<{
  id: DashboardTabId;
  label: string;
  icon: DashboardTabIconName;
}> = [
  { id: "enrolled", label: "My Courses", icon: "BookOpen" },
  { id: "explore", label: "Explore", icon: "Compass" },
  { id: "achievements", label: "Achievements", icon: "Trophy" },
  { id: "referral", label: "Refer & Earn", icon: "Share2" },
];

export const LOCKED_ACHIEVEMENT_BADGES: Badge[] = [
  {
    id: "xp-5000",
    name: "Elite Coder",
    description: "Earn 5000 XP",
    icon: "💎",
    requirement: { type: "xp", value: 5000 },
  },
  {
    id: "streak-30",
    name: "Monthly Warrior",
    description: "30-day streak",
    icon: "🛡️",
    requirement: { type: "streak", value: 30 },
  },
  {
    id: "exercises-50",
    name: "Problem Solver",
    description: "Complete 50 exercises",
    icon: "🧩",
    requirement: { type: "exercises", value: 50 },
  },
];

export const XP_MILESTONES: Array<{ target: number; label: string }> = [
  { target: 1000, label: "Beginner" },
  { target: 2500, label: "Intermediate" },
  { target: 5000, label: "Advanced" },
  { target: 10000, label: "Master" },
];

export const STREAK_DAYS = 7;
export const ACTIVE_STREAK_DAYS = 5;

export const DASHBOARD_QUICK_ACTIONS: Array<{
  href: string;
  label: string;
  icon: DashboardQuickActionIconName;
}> = [
  { href: "/courses", label: "Browse Courses", icon: "BookOpen" },
  { href: "/ai-tools", label: "AI Career Tools", icon: "BarChart3" },
  { href: "/pricing", label: "Upgrade to Pro", icon: "Zap" },
];
