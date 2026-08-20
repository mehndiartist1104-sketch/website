import type { Metadata } from "next";
import { getApprovedReviews } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeading } from "@/components/public/section-heading";
import { StarRating } from "@/components/public/star-rating";
import { ReviewForm } from "@/components/public/review-form";
import { ReviewPhotos } from "@/components/public/review-photos";
import { Reveal } from "@/components/public/reveal";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Reviews",
  description:
    "Read what our clients say about their mehndi experience, and share your own.",
};

export default async function ReviewsPage() {
  const reviews = await getApprovedReviews();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
      <SectionHeading
        eyebrow="Kind Words"
        title="Client reviews"
        description="Real words from brides, students, and party hosts."
      />

      <div className="mt-10 grid gap-10 lg:mt-14 lg:grid-cols-3 lg:gap-12">
        <div className="space-y-6 lg:col-span-2">
          {reviews.length > 0 ? (
            reviews.map((review, i) => (
              <Reveal key={review.id} delay={Math.min(i, 5) * 0.06}>
                <Card className="border-border/70 bg-card shadow-sm">
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
                      <p className="font-heading text-xl font-semibold text-primary">
                        {review.name}
                      </p>
                      <StarRating rating={review.rating} />
                    </div>
                    <p className="mt-3 leading-relaxed text-foreground/85">
                      {review.message}
                    </p>
                    <ReviewPhotos urls={review.imageUrls} />
                    <p className="mt-3 text-xs text-muted-foreground">
                      {review.createdAt.toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "long",
                      })}
                    </p>
                  </CardContent>
                </Card>
              </Reveal>
            ))
          ) : (
            <p className="py-16 text-center text-muted-foreground">
              No reviews yet — be the first to share your experience.
            </p>
          )}
        </div>

        <div>
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8 lg:sticky lg:top-24">
            <h2 className="font-heading text-2xl font-semibold text-primary">
              Share your experience
            </h2>
            <p className="mb-6 mt-2 text-sm text-muted-foreground">
              Had mehndi done by us or taken a course? We would love to hear it.
            </p>
            <ReviewForm />
          </div>
        </div>
      </div>
    </div>
  );
}
