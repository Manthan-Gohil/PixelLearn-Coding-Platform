"use client";

import Link from "next/link";
import { Star, Users, BookOpen, Clock, ArrowRight, Lock, Zap } from "lucide-react";
import { DIFFICULTY_COLORS } from "@/constants/ui";
import { getCategoryIcon, getCourseExerciseCount, isPremiumLocked } from "@/utils/courses";
import type { Course, SubscriptionTier } from "@/types/courses";

interface CourseCardProps {
  course: Course;
  isEnrolled: boolean;
  userSubscription: SubscriptionTier;
  onEnroll: (id: string) => void;
}

export default function CourseCard({
  course,
  isEnrolled,
  userSubscription,
  onEnroll,
}: CourseCardProps) {
  const totalExercises = getCourseExerciseCount(course);
  const isLocked = isPremiumLocked(course.isPremium, userSubscription);

  return (
    <div
      className="course-item group fb-card rounded-2xl overflow-hidden hover:border-border-light transition-all duration-300 card-hover-glow spotlight-card flex flex-col"
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
        e.currentTarget.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
      }}
    >
      <div className="h-44 bg-[#0f0f0f] flex items-center justify-center relative overflow-hidden">
        {course.thumbnail ? (
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          />
        ) : (
          <span className="text-6xl group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 ease-out">
            {getCategoryIcon(course.category)}
          </span>
        )}
        <div className="absolute inset-0 bg-linear-to-t from-surface/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute top-3 right-3 flex gap-2">
          {course.isPremium && (
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#E6C212] text-black shadow-lg animate-shimmer">
              PRO
            </span>
          )}
        </div>
        <div className="absolute bottom-3 left-3">
          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${DIFFICULTY_COLORS[course.difficulty]}`}>
            {course.difficulty}
          </span>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-lg font-semibold text-text-primary mb-2 group-hover:text-[#E6C212] transition-colors duration-300">
          {course.title}
        </h3>
        <p className="text-sm text-text-secondary mb-4 line-clamp-2 flex-1">{course.shortDescription}</p>

        <div className="flex items-center justify-between text-xs text-text-muted mb-4">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Star className="w-3 h-3 text-warning fill-warning" />
              {course.rating.toFixed(1)}
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              {course.enrolledCount.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <BookOpen className="w-3 h-3" />
              {totalExercises} exercises
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {course.estimatedHours}h
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {course.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded-md bg-surface-hover text-xs text-text-muted hover:bg-[#E6C212]/10 hover:text-[#E6C212] transition-colors duration-200"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/courses/${course.id}`}
            className="flex-1 text-center py-2.5 rounded-lg border border-border text-sm font-medium text-text-primary hover:bg-surface-hover hover:border-border-light transition-all flex items-center justify-center gap-1 hover-bounce"
          >
            View Details
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          {!isEnrolled && (
            <button
              onClick={() => onEnroll(course.id)}
              disabled={isLocked}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-1 hover-bounce ${isLocked
                ? "border border-border text-text-muted cursor-not-allowed"
                : "bg-[#E6C212] text-black hover:bg-[#f0d030] shadow-lg shadow-black/30"
                }`}
            >
              {isLocked ? (
                <>
                  <Lock className="w-3.5 h-3.5" /> Pro Only
                </>
              ) : (
                <>
                  <Zap className="w-3.5 h-3.5" /> Enroll
                </>
              )}
            </button>
          )}

          {isEnrolled && (
            <Link
              href={`/courses/${course.id}`}
              className="flex-1 py-2.5 rounded-lg text-sm font-semibold bg-[#E6C212] text-black hover:bg-[#f0d030] transition-all text-center hover-bounce"
            >
              Continue
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
