import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getFeaturedDesigns } from "@/lib/data";
import { GalleryGrid } from "@/components/public/gallery-grid";
import { SectionHeading } from "@/components/public/section-heading";
import { Reveal } from "@/components/public/reveal";

export async function FeaturedDesigns() {
  const designs = await getFeaturedDesigns(8);

  return (
    <section className="relative bg-transparent py-14 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Portfolio"
            title="Featured designs"
            description="A selection of recent bridal, party, and festival work — each one drawn freehand."
          />
        </Reveal>
        <div className="mt-10 sm:mt-14">
          <GalleryGrid designs={designs} />
        </div>
        <Reveal className="mt-10 text-center">
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 font-medium text-terracotta transition-colors hover:text-primary"
          >
            Explore the full gallery
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
