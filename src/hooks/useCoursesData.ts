"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getDifficultyFilters,
  filterCourses,
  getCourseCategories,
} from "@/utils/courses";
import type { Course, CourseDifficultyFilter } from "@/types/courses";

interface UseCoursesDataParams {
  search: string;
  categoryFilter: string;
  difficultyFilter: CourseDifficultyFilter;
}

async function fetchCourses(): Promise<Course[]> {
  const response = await fetch("/api/courses");
  if (!response.ok) {
    throw new Error("Failed to fetch courses");
  }
  const data: unknown = await response.json();
  return Array.isArray(data) ? (data as Course[]) : [];
}

export function useCoursesData({
  search,
  categoryFilter,
  difficultyFilter,
}: UseCoursesDataParams) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    fetchCourses()
      .then((data) => {
        if (!isMounted) return;
        setCourses(data);
        setLoading(false);
      })
      .catch(() => {
        if (!isMounted) return;
        setCourses([]);
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const categories = useMemo(() => getCourseCategories(courses), [courses]);

  const filteredCourses = useMemo(
    () =>
      filterCourses(courses, {
        search,
        categoryFilter,
        difficultyFilter,
      }),
    [courses, search, categoryFilter, difficultyFilter],
  );

  return {
    courses,
    filteredCourses,
    categories,
    difficulties: getDifficultyFilters(),
    loading,
  };
}

export function useCourseById(courseId: string) {
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    fetchCourses()
      .then((data) => {
        if (!isMounted) return;
        setCourse(data.find((item) => item.id === courseId) ?? null);
        setLoading(false);
      })
      .catch(() => {
        if (!isMounted) return;
        setCourse(null);
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [courseId]);

  return { course, loading };
}
