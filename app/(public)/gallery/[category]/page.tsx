import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDesigns } from "@/lib/data";
import { GALLERY_PAGE_SIZE } from "@/lib/constants";
import { GalleryGrid } from "@/components/public/gallery-grid";
import { CategoryFilter } from "@/components/public/category-filter";
import { LoadMoreDesigns } from "@/components/public/load-more-designs";
import { SectionHeading } from "@/components/public/section-heading";
import {
  CATEGORY_LABELS,
  DESIGN_CATEGORIES,
  categoryLabel,
  type DesignCategory,
} from "@/lib/types";

export const revalidate = 3600;

function parseCategory(raw: string): DesignCategory | null {
  const upper = raw.toUpperCase() as DesignCategory;
  return DESIGN_CATEGORIES.includes(upper) ? upper : null;
}

export function generateStaticParams() {
  return DESIGN_CATEGORIES.map((category) => ({
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
  return {
    title: `${categoryLabel(category)} Mehndi Designs`,
    description: `Browse our ${CATEGORY_LABELS[category].toLowerCase()} mehndi designs — freehand henna work for every occasion.`,
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

  const { designs, total } = await getDesigns({
    category,
    limit: GALLERY_PAGE_SIZE,
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
      <SectionHeading
        eyebrow="Portfolio"
        title={`${categoryLabel(category)} designs`}
      />
      <div className="mt-10">
        <CategoryFilter current={category} />
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
            No {CATEGORY_LABELS[category].toLowerCase()} designs yet — check back soon.
          </p>
        )}
      </div>
    </div>
  );
}
