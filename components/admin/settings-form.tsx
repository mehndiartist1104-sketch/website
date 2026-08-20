"use client";

import { useState, useTransition, type FormEvent } from "react";
import Image from "next/image";
import { CheckCircle2, Loader2, Upload, X } from "lucide-react";
import { updateSiteConfig } from "@/app/actions/site-config";
import { uploadImageToCloudinary } from "@/lib/upload-image";
import { initialFormState, type FormState } from "@/lib/validations/lead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { SiteConfig } from "@prisma/client";

function FieldError({ messages }: { messages?: string[] }) {
  if (!messages?.[0]) return null;
  return <p className="text-sm text-destructive">{messages[0]}</p>;
}

export function SettingsForm({ config }: { config: SiteConfig }) {
  const [state, setState] = useState<FormState>(initialFormState);
  const [pending, startTransition] = useTransition();
  const [uploading, setUploading] = useState(false);
  const [urlDraft, setUrlDraft] = useState("");
  const [heroImages, setHeroImages] = useState<string[]>(() => {
    if (config.heroImageUrls.length > 0) return config.heroImageUrls;
    return config.heroImageUrl ? [config.heroImageUrl] : [];
  });

  const errors = state.fieldErrors ?? {};

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const fd = new FormData(form);
    fd.delete("heroImageUrls");
    heroImages.forEach((url) => fd.append("heroImageUrls", url));

    startTransition(async () => {
      const result = await updateSiteConfig(initialFormState, fd);
      setState(result);
    });
  }

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    setState(initialFormState);
    try {
      const uploaded: string[] = [];
      for (const file of Array.from(files)) {
        const result = await uploadImageToCloudinary(file, "hero");
        uploaded.push(result.imageUrl);
      }
      setHeroImages((current) => [...current, ...uploaded].slice(0, 12));
    } catch (error) {
      console.error(error);
      setState({
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : "Image upload failed. Try another photo.",
        fieldErrors: {
          heroImageUrls: [
            error instanceof Error
              ? error.message
              : "Image upload failed. Try another photo.",
          ],
        },
      });
    } finally {
      setUploading(false);
    }
  }

  function addPastedUrl() {
    const next = urlDraft.trim();
    if (!next) return;
    setHeroImages((current) =>
      current.includes(next) ? current : [...current, next].slice(0, 12)
    );
    setUrlDraft("");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {(
        [
          { id: "studioName", label: "Studio name", value: config.studioName },
          { id: "tagline", label: "Tagline", value: config.tagline },
          { id: "heroHeadline", label: "Hero headline", value: config.heroHeadline },
          { id: "phone", label: "Phone", value: config.phone, type: "tel" },
          { id: "whatsappNumber", label: "WhatsApp number", value: config.whatsappNumber, type: "tel" },
          { id: "instagramUrl", label: "Instagram URL", value: config.instagramUrl, type: "url" },
        ] as const
      ).map((field) => (
        <div key={field.id} className="space-y-2">
          <Label htmlFor={field.id}>{field.label}</Label>
          <Input
            id={field.id}
            name={field.id}
            defaultValue={field.value}
            required
            type={"type" in field ? field.type : "text"}
            aria-invalid={Boolean(errors[field.id])}
          />
          <FieldError messages={errors[field.id]} />
        </div>
      ))}

      <div className="space-y-2">
        <Label htmlFor="address">Studio address</Label>
        <Textarea
          id="address"
          name="address"
          rows={2}
          required
          defaultValue={config.address}
          aria-invalid={Boolean(errors.address)}
        />
        <FieldError messages={errors.address} />
      </div>

      <div className="space-y-3">
        <Label>Hero images</Label>
        <p className="text-sm text-muted-foreground">
          Upload one or more photos. Multiple images play as a slideshow on the homepage.
        </p>
        <div
          className={cn(
            "rounded-xl border border-dashed p-4",
            errors.heroImageUrls
              ? "border-destructive ring-3 ring-destructive/20"
              : "border-border"
          )}
        >
          {heroImages.length > 0 && (
            <ul className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {heroImages.map((url, index) => (
                <li
                  key={`${url}-${index}`}
                  className="group relative aspect-[4/3] overflow-hidden rounded-lg border border-border bg-muted"
                >
                  {url.startsWith("http") ? (
                    <Image src={url} alt="" fill className="object-cover" sizes="180px" />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={url} alt="" className="h-full w-full object-cover" />
                  )}
                  <button
                    type="button"
                    className="absolute right-1.5 top-1.5 rounded-full bg-background/90 p-1 text-foreground shadow-sm opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
                    onClick={() =>
                      setHeroImages((current) => current.filter((_, i) => i !== index))
                    }
                    aria-label={`Remove hero image ${index + 1}`}
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          )}

          <label
            htmlFor="hero-uploads"
            className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 py-3 text-sm text-muted-foreground transition-colors hover:border-terracotta hover:text-terracotta"
          >
            {uploading ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            ) : (
              <Upload className="h-4 w-4" aria-hidden />
            )}
            {uploading ? "Uploading..." : "Upload images"}
            <input
              id="hero-uploads"
              type="file"
              accept="image/*"
              multiple
              className="sr-only"
              disabled={uploading || pending}
              onChange={(event) => {
                void handleFiles(event.target.files);
                event.target.value = "";
              }}
            />
          </label>

          <div className="mt-3 flex gap-2">
            <Input
              id="hero-url-draft"
              type="url"
              value={urlDraft}
              onChange={(event) => setUrlDraft(event.target.value)}
              placeholder="Or paste an image URL"
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  addPastedUrl();
                }
              }}
            />
            <Button type="button" variant="outline" onClick={addPastedUrl} disabled={!urlDraft.trim()}>
              Add
            </Button>
          </div>
        </div>
        <FieldError messages={errors.heroImageUrls} />
      </div>

      {state.status === "error" && state.message && (
        <p className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {state.message}
        </p>
      )}

      <div className="flex items-center justify-end gap-3">
        {state.status === "success" && (
          <p className="flex items-center gap-1.5 text-sm text-terracotta">
            <CheckCircle2 className="h-4 w-4" aria-hidden />
            Saved
          </p>
        )}
        <Button type="submit" disabled={pending || uploading}>
          {(pending || uploading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />}
          {pending ? "Saving..." : "Save settings"}
        </Button>
      </div>
    </form>
  );
}
