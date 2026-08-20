"use client";

import { useState, useTransition, type FormEvent } from "react";
import Image from "next/image";
import { submitReview } from "@/app/actions/leads";
import { uploadImageToCloudinary } from "@/lib/upload-image";
import { initialFormState, type FormState } from "@/lib/validations/lead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Star, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";

const MAX_PHOTOS = 6;

export function ReviewForm() {
  const [state, setState] = useState<FormState>(initialFormState);
  const [pending, startTransition] = useTransition();
  const [rating, setRating] = useState(0);
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const errors = state.fieldErrors ?? {};

  if (state.status === "success") {
    return (
      <div className="rounded-xl border border-border bg-secondary/50 px-6 py-10 text-center">
        <p className="font-heading text-2xl font-semibold text-primary">Thank you!</p>
        <p className="mt-2 text-sm text-muted-foreground">{state.message}</p>
      </div>
    );
  }

  function addFiles(list: FileList | null) {
    if (!list?.length) return;
    const incoming = Array.from(list).filter((file) => file.type.startsWith("image/"));
    setFiles((current) => {
      const next = [...current, ...incoming].slice(0, MAX_PHOTOS);
      setPreviews(next.map((file) => URL.createObjectURL(file)));
      return next;
    });
  }

  function removeFile(index: number) {
    setFiles((current) => {
      const next = current.filter((_, i) => i !== index);
      setPreviews(next.map((file) => URL.createObjectURL(file)));
      return next;
    });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    startTransition(async () => {
      try {
        const fd = new FormData(form);
        for (const file of files) {
          const uploaded = await uploadImageToCloudinary(file, "reviews");
          fd.append("imageUrls", uploaded.imageUrl);
        }
        setState(await submitReview(initialFormState, fd));
      } catch (error) {
        setState({
          status: "error",
          message:
            error instanceof Error
              ? error.message
              : "Photo upload failed. You can submit without photos or try again.",
        });
      }
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
        <Label htmlFor="review-message">Your review (optional)</Label>
        <Textarea
          id="review-message"
          name="message"
          rows={4}
          placeholder="How was your experience?"
          aria-invalid={Boolean(errors.message)}
        />
        {errors.message && <p className="text-sm text-destructive">{errors.message[0]}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="review-photos">Photos (optional)</Label>
        {previews.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {previews.map((src, index) => (
              <div
                key={`${src}-${index}`}
                className="relative aspect-square overflow-hidden rounded-lg border border-border"
              >
                <Image src={src} alt="" fill className="object-cover" sizes="100px" unoptimized />
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="absolute right-1 top-1 rounded-full bg-primary/80 p-1 text-primary-foreground"
                  aria-label="Remove photo"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
        {files.length < MAX_PHOTOS && (
          <label
            htmlFor="review-photos"
            className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-border px-4 py-3 text-sm text-muted-foreground transition-colors hover:border-terracotta hover:text-terracotta"
          >
            <Upload className="h-4 w-4" aria-hidden />
            {files.length > 0 ? "Add more photos" : "Add photos"}
            <input
              id="review-photos"
              type="file"
              accept="image/*"
              multiple
              className="sr-only"
              onChange={(event) => {
                addFiles(event.target.files);
                event.target.value = "";
              }}
            />
          </label>
        )}
        <p className="text-xs text-muted-foreground">
          Up to {MAX_PHOTOS} photos. Phone pictures are resized automatically.
        </p>
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
