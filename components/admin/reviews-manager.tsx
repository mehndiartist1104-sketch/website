"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Check, Loader2, Pencil, X } from "lucide-react";
import type { Review } from "@prisma/client";
import { approveReview, rejectReview, updateReview } from "@/app/actions/reviews";
import { initialFormState } from "@/lib/validations/lead";
import { StarRating } from "@/components/public/star-rating";
import { ReviewPhotos } from "@/components/public/review-photos";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

function EditReviewForm({
  review,
  onDone,
}: {
  review: Review;
  onDone: () => void;
}) {
  const [state, setState] = useState(initialFormState);
  const [pending, startTransition] = useTransition();
  const errors = state.fieldErrors ?? {};

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fd = new FormData(event.currentTarget);
    startTransition(async () => {
      const result = await updateReview(review.id, initialFormState, fd);
      setState(result);
      if (result.status === "success") onDone();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div className="space-y-2">
        <Label htmlFor="edit-review-name">Name</Label>
        <Input
          id="edit-review-name"
          name="name"
          required
          defaultValue={review.name}
          aria-invalid={Boolean(errors.name)}
        />
        {errors.name && <p className="text-sm text-destructive">{errors.name[0]}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="edit-review-rating">Rating (1–5)</Label>
        <Input
          id="edit-review-rating"
          name="rating"
          type="number"
          min={1}
          max={5}
          required
          defaultValue={review.rating}
          aria-invalid={Boolean(errors.rating)}
        />
        {errors.rating && <p className="text-sm text-destructive">{errors.rating[0]}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="edit-review-message">Message</Label>
        <Textarea
          id="edit-review-message"
          name="message"
          rows={4}
          defaultValue={review.message}
          aria-invalid={Boolean(errors.message)}
        />
        {errors.message && <p className="text-sm text-destructive">{errors.message[0]}</p>}
      </div>

      {state.status === "error" && state.message && (
        <p className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {state.message}
        </p>
      )}

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onDone} disabled={pending}>
          Cancel
        </Button>
        <Button type="submit" disabled={pending}>
          {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />}
          {pending ? "Saving..." : "Save changes"}
        </Button>
      </div>
    </form>
  );
}

function ReviewRow({ review }: { review: Review }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [confirmReject, setConfirmReject] = useState(false);
  const [pending, startTransition] = useTransition();

  return (
    <Card className="border-border/70">
      <CardContent className="flex flex-wrap items-start justify-between gap-4 pt-6">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <p className="font-medium text-foreground">{review.name}</p>
            <StarRating rating={review.rating} />
            <Badge variant={review.isApproved ? "default" : "secondary"}>
              {review.isApproved ? "Published" : "Pending"}
            </Badge>
          </div>
          {review.message ? (
            <p className="mt-2 text-sm leading-relaxed text-foreground/85">
              {review.message}
            </p>
          ) : null}
          <ReviewPhotos urls={review.imageUrls} />
          <p className="mt-2 text-xs text-muted-foreground">
            {review.createdAt.toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {!review.isApproved && (
            <Button
              size="sm"
              disabled={pending}
              onClick={() =>
                startTransition(async () => {
                  await approveReview(review.id);
                  router.refresh();
                })
              }
            >
              <Check className="mr-1.5 h-3.5 w-3.5" aria-hidden />
              Approve
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
            <Pencil className="mr-1.5 h-3.5 w-3.5" aria-hidden />
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive hover:bg-destructive/10"
            onClick={() => setConfirmReject(true)}
          >
            <X className="mr-1.5 h-3.5 w-3.5" aria-hidden />
            Reject
          </Button>
        </div>

        <Dialog open={editing} onOpenChange={setEditing}>
          <DialogContent className="sm:max-w-lg">
            <DialogTitle>Edit review</DialogTitle>
            <DialogDescription className="sr-only">Edit review content</DialogDescription>
            <EditReviewForm
              review={review}
              onDone={() => {
                setEditing(false);
                router.refresh();
              }}
            />
          </DialogContent>
        </Dialog>

        <Dialog open={confirmReject} onOpenChange={setConfirmReject}>
          <DialogContent className="sm:max-w-md">
            <DialogTitle>Reject review</DialogTitle>
            <DialogDescription>
              This permanently deletes the review from {review.name}. It will never
              appear on the site.
            </DialogDescription>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setConfirmReject(false)} disabled={pending}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                disabled={pending}
                onClick={() =>
                  startTransition(async () => {
                    await rejectReview(review.id);
                    setConfirmReject(false);
                    router.refresh();
                  })
                }
              >
                {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />}
                Reject
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

export function ReviewsManager({ reviews }: { reviews: Review[] }) {
  const pendingReviews = reviews.filter((r) => !r.isApproved);
  const approvedReviews = reviews.filter((r) => r.isApproved);

  return (
    <div className="space-y-10">
      <section>
        <h2 className="font-heading text-xl font-semibold text-primary">
          Awaiting moderation ({pendingReviews.length})
        </h2>
        <div className="mt-4 space-y-4">
          {pendingReviews.map((review) => (
            <ReviewRow key={review.id} review={review} />
          ))}
          {pendingReviews.length === 0 && (
            <p className="rounded-xl border border-dashed border-border py-8 text-center text-sm text-muted-foreground">
              Nothing waiting — the queue is clear.
            </p>
          )}
        </div>
      </section>

      <section>
        <h2 className="font-heading text-xl font-semibold text-primary">
          Published ({approvedReviews.length})
        </h2>
        <div className="mt-4 space-y-4">
          {approvedReviews.map((review) => (
            <ReviewRow key={review.id} review={review} />
          ))}
          {approvedReviews.length === 0 && (
            <p className="rounded-xl border border-dashed border-border py-8 text-center text-sm text-muted-foreground">
              No published reviews yet.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
