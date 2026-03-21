"use client";

import type { Dispatch, RefObject, SetStateAction } from "react";
import { Search, Filter } from "lucide-react";
import type { CourseDifficultyFilter } from "@/types/courses";

interface CourseFiltersProps {
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
  categoryFilter: string;
  setCategoryFilter: Dispatch<SetStateAction<string>>;
  difficultyFilter: CourseDifficultyFilter;
  setDifficultyFilter: Dispatch<SetStateAction<CourseDifficultyFilter>>;
  categories: ReadonlyArray<string>;
  difficulties: ReadonlyArray<CourseDifficultyFilter>;
  searchRef: RefObject<HTMLDivElement | null>;
}

export default function CourseFilters({
  search,
  setSearch,
  categoryFilter,
  setCategoryFilter,
  difficultyFilter,
  setDifficultyFilter,
  categories,
  difficulties,
  searchRef,
}: CourseFiltersProps) {
  return (
    <div ref={searchRef} className="fb-card rounded-xl p-4 mb-8 animate-glow-pulse">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-[#E6C212] transition-colors" />
          <input
            type="text"
            placeholder="Search courses, topics, or technologies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-surface-alt border border-border text-text-primary placeholder:text-text-muted focus:outline-none focus:border-[#E6C212]/60 focus:shadow-[0_0_15px_rgba(230,194,18,0.16)] transition-all duration-300"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-text-muted" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2.5 rounded-lg bg-surface-alt border border-border text-text-primary focus:outline-none focus:border-[#E6C212]/60 text-sm transition-all duration-300"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === "all" ? "All Categories" : cat}
              </option>
            ))}
          </select>

          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value as CourseDifficultyFilter)}
            className="px-3 py-2.5 rounded-lg bg-surface-alt border border-border text-text-primary focus:outline-none focus:border-[#E6C212]/60 text-sm transition-all duration-300"
          >
            {difficulties.map((diff) => (
              <option key={diff} value={diff}>
                {diff === "all" ? "All Levels" : diff.charAt(0).toUpperCase() + diff.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
