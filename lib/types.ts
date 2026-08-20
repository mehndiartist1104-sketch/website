export type DesignCategory =
  | "BRIDAL"
  | "ARABIC"
  | "MINIMAL"
  | "GLITTER"
  | "KIDS"
  | "FESTIVE";

export const DESIGN_CATEGORIES: DesignCategory[] = [
  "BRIDAL",
  "ARABIC",
  "MINIMAL",
  "GLITTER",
  "KIDS",
  "FESTIVE",
];

export const CATEGORY_LABELS: Record<DesignCategory, string> = {
  BRIDAL: "Bridal",
  ARABIC: "Arabic",
  MINIMAL: "Minimal",
  GLITTER: "Glitter",
  KIDS: "Kids",
  FESTIVE: "Festive",
};

export function categoryLabel(category: string): string {
  return CATEGORY_LABELS[category as DesignCategory] ?? category;
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
