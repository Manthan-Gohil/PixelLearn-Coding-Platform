"use client";

import Link from "next/link";
import { BookOpen, Zap, Trophy, BarChart3, Lock, Play } from "lucide-react";
import { DIFFICULTY_COLORS } from "@/constants/ui";
import { isPremiumLocked } from "@/utils/courses";
import type { Course, CourseProgressSummary, SubscriptionTier } from "@/types/courses";

interface CourseSummaryCardProps {
  course: Course;
  progress: CourseProgressSummary;
  totalXPEarnable: number;
  isEnrolled: boolean;
  userSubscription: SubscriptionTier;
  onEnroll: (id: string) => void;
}

export default function CourseSummaryCard({
  course,
  progress,
  totalXPEarnable,
  isEnrolled,
  userSubscription,
  onEnroll,
}: CourseSummaryCardProps) {
  const isLocked = isPremiumLocked(course.isPremium, userSubscription);

  return (
    <div className="glass rounded-xl p-6 sticky top-24">
      <h3 className="text-lg font-semibold text-text-primary mb-4">Course Progress</h3>

      <div className="flex justify-center mb-6">
        <div className="relative w-32 h-32">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-surface-hover"
            />
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="url(#progressGradient)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 42}`}
              strokeDashoffset={`${2 * Math.PI * 42 * (1 - progress.percentage / 100)}`}
              className="transition-all duration-1000"
            />
            <defs>
              <linearGradient id="progressGradient">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-text-primary">{progress.percentage}%</div>
              <div className="text-xs text-text-muted">complete</div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between text-sm">
          <span className="text-text-secondary flex items-center gap-2">
            <BookOpen className="w-4 h-4" />Exercises
          </span>
          <span className="font-medium text-text-primary">
            {progress.completed}/{progress.total}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-text-secondary flex items-center gap-2">
            <Zap className="w-4 h-4 text-warning" />XP Available
          </span>
          <span className="font-medium text-text-primary">{totalXPEarnable}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-text-secondary flex items-center gap-2">
            <Trophy className="w-4 h-4 text-accent" />Chapters
          </span>
          <span className="font-medium text-text-primary">{course.chapters.length}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-text-secondary flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-primary-light" />Difficulty
          </span>
          <span className={`px-2 py-0.5 rounded text-xs font-medium ${DIFFICULTY_COLORS[course.difficulty]}`}>
            {course.difficulty}
          </span>
        </div>
      </div>

      {!isEnrolled ? (
        <button
          onClick={() => onEnroll(course.id)}
          disabled={isLocked}
          className={`w-full py-3 rounded-xl font-semibold transition-all ${
            isLocked
              ? "border border-border text-text-muted cursor-not-allowed"
              : "gradient-primary text-white hover:opacity-90 shadow-lg shadow-primary/25"
          }`}
        >
          {isLocked ? (
            <span className="flex items-center justify-center gap-2">
              <Lock className="w-4 h-4" /> Upgrade to Pro
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <Play className="w-4 h-4" /> Enroll Now
            </span>
          )}
        </button>
      ) : (
        <Link
          href={`/playground/${course.id}/${course.chapters[0]?.exercises[0]?.id || ""}`}
          className="block w-full text-center py-3 rounded-xl font-semibold gradient-primary text-white hover:opacity-90 shadow-lg shadow-primary/25 transition-all outline-none"
          style={{ WebkitTapHighlightColor: "transparent" }}
        >
          <span className="flex items-center justify-center gap-2">
            <Play className="w-4 h-4" /> Continue Learning
          </span>
        </Link>
      )}
    </div>
  );
}
