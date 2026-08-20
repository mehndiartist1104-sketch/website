import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { getDesignCategories } from "@/lib/data";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/gallery",
    "/courses",
    "/reviews",
    "/contact",
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.8,
  }));

  const categories = await getDesignCategories();
  const categoryRoutes: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${baseUrl}/gallery/${category.toLowerCase()}`,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const courses = await prisma.course.findMany({
    where: { isActive: true },
    select: { slug: true, createdAt: true },
  });

  const courseRoutes: MetadataRoute.Sitemap = courses.map((course) => ({
    url: `${baseUrl}/courses/${course.slug}`,
    lastModified: course.createdAt,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...categoryRoutes, ...courseRoutes];
}
