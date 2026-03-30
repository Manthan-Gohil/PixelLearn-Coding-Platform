"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useApp } from "@/store";
import StandardLayout from "@/components/layout/StandardLayout";
import { DIFFICULTY_COLORS } from "@/constants/ui";
import { useCourseById } from "@/hooks/useCoursesData";
import { getCategoryIcon, getCourseTotals } from "@/utils/courses";
import type { Chapter } from "@/types/courses";
import { BookOpen, Star, Users, Clock, ArrowLeft, Loader2 } from "lucide-react";

import ChapterItem from "@/components/courses/ChapterItem";
import CourseSummaryCard from "@/components/courses/CourseSummaryCard";

function CourseDetailContent({ courseId }: { courseId: string }) {
  const { user, enrollCourse, getUserProgress, isExerciseCompleted } = useApp();
  const { course, loading } = useCourseById(courseId);
  const [expandedChapters, setExpandedChapters] = useState<string[]>([]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-surface">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="h-screen flex items-center justify-center bg-surface">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-text-primary mb-2">Course Not Found</h1>
          <Link href="/courses" className="text-[#E6C212] hover:underline">
            ← Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  const isEnrolled = user.enrolledCourses.includes(course.id);
  const progress = getUserProgress(course.id, course);
  const { totalExercises, totalXPEarnable } = getCourseTotals(course);

  const toggleChapter = (chapterId: string) => {
    setExpandedChapters((prev) =>
      prev.includes(chapterId) ? prev.filter((id) => id !== chapterId) : [...prev, chapterId]
    );
  };

  return (
    <StandardLayout particlesCount={15} flowblockTheme containerClassName="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href="/courses"
        className="inline-flex items-center gap-2 text-text-secondary hover:text-text-primary mb-6 transition-colors text-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Courses
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="fb-card rounded-2xl overflow-hidden">
            <div className="h-48 bg-[#0f0f0f] flex items-center justify-center relative">
              {course.thumbnail ? (
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-7xl group-hover:scale-125 transition-transform">
                  {getCategoryIcon(course.category)}
                </span>
              )}
              <div className="absolute top-4 right-4 flex gap-2">
                {course.isPremium && (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#E6C212] text-black">
                    PRO
                  </span>
                )}
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${DIFFICULTY_COLORS[course.difficulty]}`}
                >
                  {course.difficulty}
                </span>
              </div>
            </div>
            <div className="p-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-text-primary mb-3">{course.title}</h1>
              <p className="text-text-secondary mb-4 leading-relaxed">{course.description}</p>
              <div className="flex flex-wrap items-center gap-4 text-sm text-text-muted">
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-warning fill-warning" />
                  {course.rating} rating
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {course.enrolledCount.toLocaleString()} students
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {course.estimatedHours} hours
                </span>
                <span className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4" />
                  {totalExercises} exercises
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-bold text-text-primary mb-4">Course Curriculum</h2>
            {course.chapters.map((chapter: Chapter) => (
              <ChapterItem
                key={chapter.id}
                chapter={chapter}
                isExpanded={expandedChapters.includes(chapter.id)}
                onToggle={() => toggleChapter(chapter.id)}
                isExerciseCompleted={isExerciseCompleted}
                userSubscription={user.subscription}
                isEnrolled={isEnrolled}
                courseId={course.id}
              />
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <CourseSummaryCard
            course={course}
            progress={progress}
            totalXPEarnable={totalXPEarnable}
            isEnrolled={isEnrolled}
            userSubscription={user.subscription}
            onEnroll={enrollCourse}
          />
        </div>
      </div>
    </StandardLayout>
  );
}

export default function CourseDetailPage({ params }: { params: Promise<{ courseId: string }> }) {
  const resolvedParams = use(params);
  return <CourseDetailContent courseId={resolvedParams.courseId} />;
}
