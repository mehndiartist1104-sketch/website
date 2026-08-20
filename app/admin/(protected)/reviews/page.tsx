import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ReviewsManager } from "@/components/admin/reviews-manager";

export const metadata: Metadata = { title: "Reviews" };

export default async function AdminReviewsPage() {
  const reviews = await prisma.review.findMany({
    orderBy: [{ isApproved: "asc" }, { createdAt: "desc" }],
  });

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="font-heading text-3xl font-semibold text-primary">Reviews</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Approve submissions to publish them, or reject spam. Edits fix typos before
        publishing.
      </p>
      <div className="mt-8">
        <ReviewsManager reviews={reviews} />
      </div>
    </div>
  );
}
