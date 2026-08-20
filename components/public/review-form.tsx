"use client";

import { useState, useTransition, type FormEvent } from "react";
import { submitReview } from "@/app/actions/leads";
import { initialFormState, type FormState } from "@/lib/validations/lead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function ReviewForm() {
  const [state, setState] = useState<FormState>(initialFormState);
  const [pending, startTransition] = useTransition();
  const [rating, setRating] = useState(0);
  const errors = state.fieldErrors ?? {};

  if (state.status === "success") {
    return (
      <div className="rounded-xl border border-border bg-secondary/50 px-6 py-10 text-center">
        <p className="font-heading text-2xl font-semibold text-primary">Thank you!</p>
        <p className="mt-2 text-sm text-muted-foreground">{state.message}</p>
      </div>
    );
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fd = new FormData(event.currentTarget);
    startTransition(async () => {
      setState(await submitReview(initialFormState, fd));
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <input type="hidden" name="rating" value={rating} />

      <div className="space-y-2">
        <Label htmlFor="review-name">Name *</Label>
        <Input
          id="review-name"
          name="name"
          required
          autoComplete="name"
          aria-invalid={Boolean(errors.name)}
        />
        {errors.name && <p className="text-sm text-destructive">{errors.name[0]}</p>}
      </div>

      <div className="space-y-2">
        <Label>Your rating *</Label>
        <div className="flex gap-1" role="radiogroup" aria-label="Rating">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={rating === value}
              aria-label={`${value} star${value > 1 ? "s" : ""}`}
              onClick={() => setRating(value)}
              className="rounded-md p-1 transition-transform hover:scale-110 focus-visible:outline-2 focus-visible:outline-ring"
            >
              <Star
                className={cn(
                  "h-7 w-7",
                  value <= rating ? "fill-gold text-gold" : "fill-muted text-muted-foreground/40"
                )}
              />
            </button>
          ))}
        </div>
        {errors.rating && <p className="text-sm text-destructive">{errors.rating[0]}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="review-message">Your review *</Label>
        <Textarea
          id="review-message"
          name="message"
          rows={4}
          required
          placeholder="How was your experience?"
          aria-invalid={Boolean(errors.message)}
        />
        {errors.message && <p className="text-sm text-destructive">{errors.message[0]}</p>}
      </div>

      {state.status === "error" && state.message && (
        <p className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {state.message}
        </p>
      )}

      <Button type="submit" disabled={pending} className="h-12 w-full bg-primary text-base hover:bg-primary/90" size="lg">
        {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />}
        {pending ? "Submitting..." : "Submit review"}
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        Reviews are published after a quick moderation check.
      </p>
    </form>
  );
}
