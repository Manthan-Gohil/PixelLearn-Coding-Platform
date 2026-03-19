import { Badge, DailyActivity, SubscriptionPlan } from "@/types";

export const BADGES: Badge[] = [
  {
    id: "first-course",
    name: "Pioneer",
    description: "Completed your first course",
    icon: "🏆",
    requirement: { type: "course_complete", value: 1 },
  },
  {
    id: "streak-7",
    name: "Consistent Coder",
    description: "7-day coding streak",
    icon: "🔥",
    requirement: { type: "streak", value: 7 },
  },
  {
    id: "xp-1000",
    name: "XP Master",
    description: "Earned 1000 XP",
    icon: "⚡",
    requirement: { type: "xp", value: 1000 },
  },
  {
    id: "xp-5000",
    name: "Elite Coder",
    description: "Earned 5000 XP",
    icon: "💎",
    requirement: { type: "xp", value: 5000 },
  },
  {
    id: "xp-10000",
    name: "Legendary Architect",
    description: "Earned 10000 XP",
    icon: "🌟",
    requirement: { type: "xp", value: 10000 },
  },
  {
    id: "streak-30",
    name: "Monthly Warrior",
    description: "30-day coding streak",
    icon: "🛡️",
    requirement: { type: "streak", value: 30 },
  },
  {
    id: "streak-100",
    name: "Century Streak",
    description: "100-day coding streak",
    icon: "👑",
    requirement: { type: "streak", value: 100 },
  },
  {
    id: "exercises-50",
    name: "Problem Solver",
    description: "Complete 50 exercises",
    icon: "🧩",
    requirement: { type: "exercises", value: 50 },
  },
  {
    id: "exercises-100",
    name: "Algorithm Athlete",
    description: "Complete 100 exercises",
    icon: "🚀",
    requirement: { type: "exercises", value: 100 },
  },
];

export const WEEKLY_ACTIVITY: DailyActivity[] = [
  { date: "Mon", exercisesCompleted: 3, xpEarned: 180, minutesActive: 45 },
  { date: "Tue", exercisesCompleted: 4, xpEarned: 240, minutesActive: 60 },
  { date: "Wed", exercisesCompleted: 2, xpEarned: 120, minutesActive: 30 },
  { date: "Thu", exercisesCompleted: 5, xpEarned: 300, minutesActive: 75 },
  { date: "Fri", exercisesCompleted: 3, xpEarned: 210, minutesActive: 50 },
  { date: "Sat", exercisesCompleted: 4, xpEarned: 260, minutesActive: 65 },
  { date: "Sun", exercisesCompleted: 2, xpEarned: 140, minutesActive: 35 },
];

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: "free",
    name: "Free",
    price: 0,
    interval: "monthly",
    features: [
      "Access to free courses",
      "Basic coding playground",
      "Progress tracking",
      "Community support",
    ],
    isPopular: false,
  },
  {
    id: "pro-monthly",
    name: "Pro",
    price: 19,
    interval: "monthly",
    features: [
      "Everything in Free",
      "Premium courses",
      "Unlimited daily exercises",
      "AI career tools",
      "Priority support",
    ],
    isPopular: true,
  },
  {
    id: "pro-yearly",
    name: "Pro",
    price: 149,
    interval: "yearly",
    features: [
      "Everything in Free",
      "Premium courses",
      "Unlimited daily exercises",
      "AI career tools",
      "Priority support",
    ],
    isPopular: true,
  },
];
