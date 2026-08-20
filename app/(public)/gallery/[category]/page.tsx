import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDesignCategories, getDesigns } from "@/lib/data";
import { GALLERY_PAGE_SIZE } from "@/lib/constants";
import { GalleryGrid } from "@/components/public/gallery-grid";
import { CategoryFilter } from "@/components/public/category-filter";
import { LoadMoreDesigns } from "@/components/public/load-more-designs";
import { SectionHeading } from "@/components/public/section-heading";
import { categoryLabel, toCategorySlug } from "@/lib/types";

export const revalidate = 3600;
export const dynamicParams = true;

function parseCategory(raw: string): string | null {
  const slug = toCategorySlug(raw);
  return slug.length >= 2 ? slug : null;
}

export async function generateStaticParams() {
  const categories = await getDesignCategories();
  return categories.map((category) => ({
    category: category.toLowerCase(),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category: raw } = await params;
  const category = parseCategory(raw);
  if (!category) return {};
  const label = categoryLabel(category);
  return {
    title: `${label} Mehndi Designs`,
    description: `Browse our ${label.toLowerCase()} mehndi designs — freehand henna work for every occasion.`,
  };
}

export default async function CategoryGalleryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: raw } = await params;
  const category = parseCategory(raw);
  if (!category) notFound();

  const [categories, { designs, total }] = await Promise.all([
    getDesignCategories(),
    getDesigns({ category, limit: GALLERY_PAGE_SIZE }),
  ]);

  if (!categories.includes(category) && designs.length === 0) notFound();

  const label = categoryLabel(category);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
      <SectionHeading eyebrow="Portfolio" title={`${label} designs`} />
      <div className="mt-10">
        <CategoryFilter current={category} categories={categories} />
      </div>
      <div className="mt-10">
        {designs.length > 0 ? (
          <>
            <GalleryGrid designs={designs} />
            <LoadMoreDesigns
              category={category}
              initialLoaded={designs.length}
              total={total}
            />
          </>
        ) : (
          <p className="py-20 text-center text-muted-foreground">
            No {label.toLowerCase()} designs yet — check back soon.
          </p>
        )}
      </div>
    </div>
  );
}
