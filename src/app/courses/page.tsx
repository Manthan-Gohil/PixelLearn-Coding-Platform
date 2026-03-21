"use client";

import { useState } from "react";
import { useApp } from "@/store";
import StandardLayout from "@/components/layout/StandardLayout";
import { useScrollReveal, useStaggerReveal } from "@/hooks/useScrollReveal";
import { useCoursesData } from "@/hooks/useCoursesData";
import type { CourseDifficultyFilter } from "@/types/courses";
import { Search, Sparkles, Code2 } from "lucide-react";

import CourseFilters from "@/components/courses/CourseFilters";
import CourseCard from "@/components/courses/CourseCard";

function CoursesContent() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState<CourseDifficultyFilter>("all");
  const { user, enrollCourse } = useApp();

  const { filteredCourses, categories, difficulties } = useCoursesData({
    search,
    categoryFilter,
    difficultyFilter,
  });

  const headerRef = useScrollReveal<HTMLDivElement>({ direction: "up", distance: 30, duration: 0.6 });
  const searchRef = useScrollReveal<HTMLDivElement>({
    direction: "up",
    distance: 20,
    duration: 0.5,
    delay: 0.1,
  });
  const gridRef = useStaggerReveal<HTMLDivElement>(".course-item", {
    direction: "up",
    distance: 40,
    stagger: 0.06,
    duration: 0.5,
  });

  return (
    <StandardLayout
      particlesCount={20}
      flowblockTheme
      containerClassName="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      <div ref={headerRef} className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-card border border-border-light mb-3 animate-shimmer">
          <Code2 className="w-4 h-4 text-[#E6C212] animate-float-subtle" />
          <span className="text-sm font-medium text-[#E6C212]">Learn by Building</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-text-primary mb-2">
          Explore <span className="text-[#E6C212]">Courses</span>
        </h1>
        <p className="text-text-secondary text-lg">
          Master programming with hands-on, practice-first courses
        </p>
      </div>

      <CourseFilters
        search={search}
        setSearch={setSearch}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        difficultyFilter={difficultyFilter}
        setDifficultyFilter={setDifficultyFilter}
        categories={categories}
        difficulties={difficulties}
        searchRef={searchRef}
      />

      <div className="mb-4 text-sm text-text-muted animate-fade-in flex items-center gap-2 fb-mono">
        <Sparkles className="w-3 h-3 text-[#E6C212]" />
        Showing {filteredCourses.length} course{filteredCourses.length !== 1 ? "s" : ""}
      </div>

      <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            isEnrolled={user.enrolledCourses.includes(course.id)}
            userSubscription={user.subscription}
            onEnroll={enrollCourse}
          />
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-20 animate-fade-in">
          <Search className="w-12 h-12 text-text-muted mx-auto mb-4 animate-float-subtle" />
          <h3 className="text-lg font-semibold text-text-primary mb-2">No courses found</h3>
          <p className="text-text-secondary">Try adjusting your search or filters</p>
        </div>
      )}
    </StandardLayout>
  );
}

export default function CoursesPage() {
  return <CoursesContent />;
}
