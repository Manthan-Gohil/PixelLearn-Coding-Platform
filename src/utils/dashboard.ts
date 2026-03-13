import { CATEGORY_ICONS } from "@/constants/ui";

export function getCourseCategoryIcon(category?: string, fallback = "📚") {
  if (!category) {
    return fallback;
  }

  return CATEGORY_ICONS[category] || fallback;
}
