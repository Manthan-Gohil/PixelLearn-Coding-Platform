"use client";

import Link from "next/link";
import { ChevronDown, ChevronUp, Lock, CheckCircle2, Zap } from "lucide-react";
import { getChapterCompletion, isPremiumLocked } from "@/utils/courses";
import type { Chapter, ExerciseDifficulty, SubscriptionTier } from "@/types/courses";

interface ChapterItemProps {
  chapter: Chapter;
  isExpanded: boolean;
  onToggle: () => void;
  isExerciseCompleted: (id: string) => boolean;
  userSubscription: SubscriptionTier;
  isEnrolled: boolean;
  courseId: string;
}

const EXERCISE_DIFFICULTY_CLASSES: Record<ExerciseDifficulty, string> = {
  easy: "text-success bg-success/10",
  medium: "text-warning bg-warning/10",
  hard: "text-danger bg-danger/10",
};

export default function ChapterItem({
  chapter,
  isExpanded,
  onToggle,
  isExerciseCompleted,
  userSubscription,
  isEnrolled,
  courseId,
}: ChapterItemProps) {
  const { completed: chapterCompleted, total: chapterTotal } = getChapterCompletion(
    chapter,
    isExerciseCompleted
  );
  const isLocked = isPremiumLocked(chapter.isPremium, userSubscription);

  return (
    <div className={`glass rounded-xl overflow-hidden transition-all ${isLocked ? "opacity-60" : ""}`}>
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-4 p-4 hover:bg-surface-hover/50 transition-colors"
      >
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold ${
            chapterCompleted === chapterTotal && chapterTotal > 0
              ? "bg-success/10 text-success"
              : "bg-primary/10 text-primary-light"
          }`}
        >
          {chapterCompleted === chapterTotal && chapterTotal > 0 ? "✓" : chapter.order}
        </div>

        <div className="flex-1 text-left">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-text-primary">{chapter.title}</h3>
            {isLocked && <Lock className="w-4 h-4 text-text-muted" />}
            {chapter.isPremium && (
              <span className="px-1.5 py-0.5 rounded text-xs font-medium gradient-primary text-white">
                PRO
              </span>
            )}
          </div>
          <p className="text-xs text-text-muted mt-0.5">
            {chapter.description} · {chapterCompleted}/{chapterTotal} completed
          </p>
        </div>

        <div className="hidden sm:block w-24">
          <div className="w-full bg-surface-hover rounded-full h-1.5">
            <div
              className="h-1.5 rounded-full gradient-primary"
              style={{ width: `${chapterTotal > 0 ? (chapterCompleted / chapterTotal) * 100 : 0}%` }}
            />
          </div>
        </div>

        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-text-muted" />
        ) : (
          <ChevronDown className="w-5 h-5 text-text-muted" />
        )}
      </button>

      {isExpanded && (
        <div className="border-t border-border">
          {chapter.exercises.map((exercise) => {
            const completed = isExerciseCompleted(exercise.id);
            const canAccess = isEnrolled && !isLocked;

            return (
              <div
                key={exercise.id}
                className="flex items-center gap-4 px-4 py-3 border-b border-border/50 last:border-0 hover:bg-surface-hover/30 transition-colors"
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    completed
                      ? "bg-success text-white"
                      : canAccess
                        ? "border-2 border-primary/40"
                        : "border-2 border-border"
                  }`}
                >
                  {completed && <CheckCircle2 className="w-4 h-4" />}
                </div>

                <div className="flex-1">
                  <div className="text-sm font-medium text-text-primary">{exercise.title}</div>
                  <div className="text-xs text-text-muted">{exercise.description}</div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2 py-0.5 rounded ${EXERCISE_DIFFICULTY_CLASSES[exercise.difficulty]}`}>
                    {exercise.difficulty}
                  </span>
                  <span className="text-xs text-text-muted flex items-center gap-1">
                    <Zap className="w-3 h-3 text-warning" />
                    {exercise.xpReward}
                  </span>

                  {canAccess ? (
                    <Link
                      href={`/playground/${courseId}/${exercise.id}`}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                        completed
                          ? "border border-success/30 text-success hover:bg-success/10"
                          : "gradient-primary text-white hover:opacity-90"
                      }`}
                    >
                      {completed ? "Review" : "Start"}
                    </Link>
                  ) : (
                    <span className="px-3 py-1 rounded-lg text-xs text-text-muted border border-border">
                      <Lock className="w-3 h-3 inline" />
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
