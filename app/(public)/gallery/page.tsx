import type { Metadata } from "next";
import { getDesignCategories, getDesigns } from "@/lib/data";
import { GALLERY_PAGE_SIZE } from "@/lib/constants";
import { GalleryGrid } from "@/components/public/gallery-grid";
import { CategoryFilter } from "@/components/public/category-filter";
import { LoadMoreDesigns } from "@/components/public/load-more-designs";
import { SectionHeading } from "@/components/public/section-heading";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Browse our full mehndi design gallery — bridal, arabic, minimal, glitter, kids, and festive henna work.",
};

export default async function GalleryPage() {
  const [{ designs, total }, categories] = await Promise.all([
    getDesigns({ limit: GALLERY_PAGE_SIZE }),
    getDesignCategories(),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
      <SectionHeading
        eyebrow="Portfolio"
        title="Design gallery"
        description="Every piece is drawn freehand. Filter by style to find your inspiration."
      />
      <div className="mt-10">
        <CategoryFilter categories={categories} />
      </div>
      <div className="mt-10">
        {designs.length > 0 ? (
          <>
            <GalleryGrid designs={designs} />
            <LoadMoreDesigns initialLoaded={designs.length} total={total} />
          </>
        ) : (
          <p className="py-20 text-center text-muted-foreground">
            Designs coming soon.
          </p>
        )}
      </div>
    </div>
  );
}
