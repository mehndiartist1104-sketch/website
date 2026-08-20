import { Card, CardContent } from "@/components/ui/card";
import { SectionHeading } from "@/components/public/section-heading";
import { StarRating } from "@/components/public/star-rating";
import { Reveal } from "@/components/public/reveal";
import { getApprovedReviews } from "@/lib/data";

export async function TestimonialCarousel() {
  const reviews = await getApprovedReviews();
  if (reviews.length === 0) return null;

  return (
    <section className="relative bg-transparent py-14 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading eyebrow="Kind Words" title="What clients say" />
        </Reveal>
      </div>
      <div className="mt-10 flex gap-4 overflow-x-auto scrollbar-none px-4 pb-4 snap-x snap-mandatory sm:mt-14 sm:gap-6 sm:px-6 lg:px-8">
        {reviews.map((review) => (
          <Card
            key={review.id}
            className="w-[min(100%,18.5rem)] shrink-0 snap-start border-border/70 bg-card/90 shadow-sm backdrop-blur-sm sm:w-[min(100%,20rem)] snap-center"
          >
            <CardContent className="pt-6">
              <StarRating rating={review.rating} />
              {review.message ? (
                <p className="mt-4 text-sm leading-relaxed text-foreground/85">
                  &ldquo;{review.message}&rdquo;
                </p>
              ) : null}
              <p className="mt-4 font-heading text-lg font-semibold text-primary">
                {review.name}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
