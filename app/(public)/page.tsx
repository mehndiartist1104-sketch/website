import { getSiteConfig } from "@/lib/data";
import { Hero } from "@/components/public/hero";
import { FeaturedDesigns } from "@/components/public/featured-designs";
import { WhyUs } from "@/components/public/why-us";
import { OfferBanner } from "@/components/public/offer-banner";
import { TestimonialCarousel } from "@/components/public/testimonial-carousel";
import { CourseTeaser } from "@/components/public/course-teaser";
import { CtaSection } from "@/components/public/cta-section";
import { LocalBusinessJsonLd } from "@/components/public/local-business-jsonld";
import { BrideBackground } from "@/components/public/bride-background";

export const revalidate = 3600;

export default async function HomePage() {
  const config = await getSiteConfig();

  return (
    <div className="relative">
      <LocalBusinessJsonLd config={config} />
      <BrideBackground />
      <div className="relative z-10">
        <Hero config={config} />
        <FeaturedDesigns />
        <WhyUs />
        <OfferBanner />
        <TestimonialCarousel />
        <CourseTeaser />
        <CtaSection config={config} />
      </div>
    </div>
  );
}
