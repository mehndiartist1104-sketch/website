import { prisma } from "@/lib/prisma";
import type {
  CourseItem,
  DesignItem,
  ReviewItem,
  SiteConfigData,
} from "@/lib/types";
import { mergeDesignCategories } from "@/lib/types";
import { GALLERY_PAGE_SIZE } from "@/lib/constants";

export async function getSiteConfig(): Promise<SiteConfigData> {
  const config = await prisma.siteConfig.findUnique({ where: { id: 1 } });
  if (!config) {
    throw new Error("SiteConfig row missing — run the database seed");
  }
  const heroImageUrls =
    config.heroImageUrls.length > 0
      ? config.heroImageUrls
      : config.heroImageUrl
        ? [config.heroImageUrl]
        : [];
  return {
    studioName: config.studioName,
    tagline: config.tagline,
    phone: config.phone,
    whatsappNumber: config.whatsappNumber,
    instagramUrl: config.instagramUrl,
    address: config.address,
    heroImageUrl: heroImageUrls[0] ?? config.heroImageUrl,
    heroImageUrls,
    heroHeadline: config.heroHeadline,
  };
}

export async function getFeaturedDesigns(limit = 6): Promise<DesignItem[]> {
  return prisma.design.findMany({
    where: { isFeatured: true },
    orderBy: { sortOrder: "asc" },
    take: limit,
    select: {
      id: true,
      title: true,
      category: true,
      imageUrl: true,
      instagramUrl: true,
      isFeatured: true,
      sortOrder: true,
    },
  });
}

export async function getDesigns(options: {
  category?: string;
  offset?: number;
  limit?: number;
}): Promise<{ designs: DesignItem[]; total: number }> {
  const where = options.category ? { category: options.category } : {};
  const [designs, total] = await Promise.all([
    prisma.design.findMany({
      where,
      orderBy: { sortOrder: "asc" },
      skip: options.offset ?? 0,
      take: options.limit ?? GALLERY_PAGE_SIZE,
      select: {
        id: true,
        title: true,
        category: true,
        imageUrl: true,
        instagramUrl: true,
        isFeatured: true,
        sortOrder: true,
      },
    }),
    prisma.design.count({ where }),
  ]);
  return { designs, total };
}

export async function getDesignCategories(): Promise<string[]> {
  const rows = await prisma.design.findMany({
    distinct: ["category"],
    select: { category: true },
  });
  return mergeDesignCategories(rows.map((row) => row.category));
}

export async function getActiveCourses(): Promise<CourseItem[]> {
  return prisma.course.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "asc" },
  });
}

export async function getCourseBySlug(slug: string): Promise<CourseItem | null> {
  return prisma.course.findFirst({ where: { slug, isActive: true } });
}

export async function getApprovedReviews(): Promise<ReviewItem[]> {
  return prisma.review.findMany({
    where: { isApproved: true },
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, rating: true, message: true, imageUrls: true, createdAt: true },
  });
}

export async function getActiveOffer(): Promise<CourseItem | null> {
  return prisma.course.findFirst({
    where: { isActive: true, offerPrice: { not: null } },
    orderBy: { createdAt: "desc" },
  });
}
