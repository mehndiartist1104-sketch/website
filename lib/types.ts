export type DesignCategory = string;

export const DESIGN_CATEGORIES = [
  "BRIDAL",
  "ARABIC",
  "MINIMAL",
  "GLITTER",
  "KIDS",
  "FESTIVE",
] as const;

export const CATEGORY_LABELS: Record<(typeof DESIGN_CATEGORIES)[number], string> = {
  BRIDAL: "Bridal",
  ARABIC: "Arabic",
  MINIMAL: "Minimal",
  GLITTER: "Glitter",
  KIDS: "Kids",
  FESTIVE: "Festive",
};

export function toCategorySlug(input: string): string {
  return input
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9\s_-]/g, "")
    .replace(/[\s-]+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "");
}

export function mergeDesignCategories(extra: string[] = []): string[] {
  const seen = new Set<string>(DESIGN_CATEGORIES);
  const merged: string[] = [...DESIGN_CATEGORIES];
  for (const item of extra) {
    const slug = toCategorySlug(item);
    if (slug && !seen.has(slug)) {
      seen.add(slug);
      merged.push(slug);
    }
  }
  return merged;
}

export function categoryLabel(category: string): string {
  const key = category as keyof typeof CATEGORY_LABELS;
  if (CATEGORY_LABELS[key]) return CATEGORY_LABELS[key];
  return category
    .toLowerCase()
    .split(/[_-]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export interface DesignItem {
  id: string;
  title: string;
  category: DesignCategory;
  imageUrl: string;
  isFeatured: boolean;
  sortOrder: number;
}

export interface CourseItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  curriculumPoints: string[];
  durationLabel: string;
  price: number;
  offerPrice: number | null;
  isActive: boolean;
}

export interface ReviewItem {
  id: string;
  name: string;
  rating: number;
  message: string;
  createdAt: Date;
}

export interface SiteConfigData {
  studioName: string;
  tagline: string;
  phone: string;
  whatsappNumber: string;
  instagramUrl: string;
  address: string;
  heroImageUrl: string;
  heroImageUrls: string[];
  heroHeadline: string;
}

export function formatPrice(paise: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(paise);
}
