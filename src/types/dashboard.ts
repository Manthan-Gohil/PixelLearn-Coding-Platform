export type DashboardTabId =
  | "enrolled"
  | "explore"
  | "achievements"
  | "referral";

export interface CourseProgressSummary {
  completed: number;
  total: number;
  percentage: number;
}

export type DashboardTabIconName = "BookOpen" | "Compass" | "Trophy" | "Share2";

export type DashboardQuickActionIconName = "BookOpen" | "BarChart3" | "Zap";
