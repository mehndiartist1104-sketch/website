"use client";

import Image from "next/image";
import { useMemo, useState, useTransition } from "react";
import { Loader2, Upload, X } from "lucide-react";
import { createDesigns } from "@/app/actions/designs";
import { uploadImageToCloudinary } from "@/lib/upload-image";
import { initialFormState, type FormState } from "@/lib/validations/lead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const MAX_PHOTOS = 24;
const DEFAULT_CATEGORY = "GALLERY";

const TITLE_SUGGESTIONS = [
  { label: "Bridal mehndi", category: "BRIDAL" },
  { label: "Party mehndi", category: "PARTY" },
  { label: "Engagement", category: "ENGAGEMENT" },
  { label: "Rakhi", category: "RAKHI" },
  { label: "Casual", category: "CASUAL" },
  { label: "Party", category: "PARTY" },
  { label: "Arabic", category: "ARABIC" },
  { label: "Festive", category: "FESTIVE" },
  { label: "Kids", category: "KIDS" },
  { label: "Glitter", category: "GLITTER" },
  { label: "Minimal", category: "MINIMAL" },
] as const;

type PhotoDraft = {
  file: File;
  preview: string;
  title: string;
};

function randomTitle() {
  return `Mehndi design ${Math.floor(1000 + Math.random() * 9000)}`;
}

function inferCategory(title: string) {
  const value = title.trim().toLowerCase();
  if (!value) return DEFAULT_CATEGORY;

  const exact = TITLE_SUGGESTIONS.find((item) => item.label.toLowerCase() === value);
  if (exact) return exact.category;

  const rules: Array<[RegExp, string]> = [
    [/\bbridal\b/, "BRIDAL"],
    [/\bengag/, "ENGAGEMENT"],
    [/\brakhi\b/, "RAKHI"],
    [/\bcasual\b/, "CASUAL"],
    [/\barabic\b/, "ARABIC"],
    [/\bfestive\b|\bfestival\b/, "FESTIVE"],
    [/\bkids?\b|\bchild/, "KIDS"],
    [/\bglitter\b/, "GLITTER"],
    [/\bminimal\b/, "MINIMAL"],
    [/\bparty\b/, "PARTY"],
  ];

  for (const [pattern, category] of rules) {
    if (pattern.test(value)) return category;
  }

  return DEFAULT_CATEGORY;
}

function TitleSuggestInput({
  value,
  disabled,
  onChange,
}: {
  value: string;
  disabled?: boolean;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const matches = useMemo(() => {
    const query = value.trim().toLowerCase();
    if (!query) return TITLE_SUGGESTIONS;
    return TITLE_SUGGESTIONS.filter((item) =>
      item.label.toLowerCase().includes(query)
    );
  }, [value]);

  return (
    <div className="min-w-0 flex-1">
      <Input
        value={value}
        disabled={disabled}
        placeholder="Title or description (optional)"
        autoComplete="off"
        onFocus={() => setOpen(true)}
        onBlur={() => {
          window.setTimeout(() => setOpen(false), 120);
        }}
        onChange={(event) => onChange(event.target.value.slice(0, 120))}
      />
      {open && matches.length > 0 && (
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {matches.map((item) => (
            <button
              key={item.label}
              type="button"
              disabled={disabled}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => {
                onChange(item.label);
                setOpen(false);
              }}
              className="rounded-full border border-border bg-background px-2.5 py-1 text-xs text-foreground hover:border-terracotta hover:text-terracotta"
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function BulkPhotoUpload({ onDone }: { onDone: () => void }) {
  const [state, setState] = useState<FormState>(initialFormState);
  const [drafts, setDrafts] = useState<PhotoDraft[]>([]);
  const [progress, setProgress] = useState("");
  const [pending, startTransition] = useTransition();

  function addFiles(list: FileList | null) {
    if (!list?.length) return;
    const incoming = Array.from(list)
      .filter((file) => file.type.startsWith("image/"))
      .map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        title: "",
      }));
    setDrafts((current) => [...current, ...incoming].slice(0, MAX_PHOTOS));
  }

  function removeFile(index: number) {
    setDrafts((current) => {
      const target = current[index];
      if (target) URL.revokeObjectURL(target.preview);
      return current.filter((_, i) => i !== index);
    });
  }

  function setTitle(index: number, title: string) {
    setDrafts((current) =>
      current.map((draft, i) => (i === index ? { ...draft, title } : draft))
    );
  }

  function handleSubmit() {
    if (drafts.length === 0) {
      setState({ status: "error", message: "Choose at least one photo." });
      return;
    }

    startTransition(async () => {
      try {
        const items = [];
        for (let i = 0; i < drafts.length; i += 1) {
          setProgress(`Uploading ${i + 1} of ${drafts.length}…`);
          const draft = drafts[i];
          const uploaded = await uploadImageToCloudinary(draft.file);
          const title = draft.title.trim() || randomTitle();
          items.push({
            title,
            category: inferCategory(title),
            imageUrl: uploaded.imageUrl,
            cloudinaryPublicId: uploaded.cloudinaryPublicId,
          });
        }
        const result = await createDesigns(items);
        setProgress("");
        setState(result);
        if (result.status === "success") onDone();
      } catch (error) {
        setProgress("");
        setState({
          status: "error",
          message:
            error instanceof Error
              ? error.message
              : "Image upload failed. Try another photo.",
        });
      }
    });
  }

  return (
    <div className="flex max-h-[inherit] flex-col gap-4">
      {drafts.length > 0 && (
        <div className="max-h-[45svh] space-y-3 overflow-y-auto overscroll-contain rounded-lg pr-1 [-webkit-overflow-scrolling:touch]">
          {drafts.map((draft, index) => (
            <div
              key={draft.preview}
              className="flex items-start gap-3 rounded-lg border border-border p-2"
            >
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md border border-border sm:h-20 sm:w-20">
                <Image
                  src={draft.preview}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="80px"
                  unoptimized
                />
              </div>
              <TitleSuggestInput
                value={draft.title}
                disabled={pending}
                onChange={(title) => setTitle(index, title)}
              />
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="shrink-0 rounded-full bg-primary/80 p-1 text-primary-foreground"
                aria-label="Remove photo"
                disabled={pending}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {drafts.length < MAX_PHOTOS && (
        <label
          htmlFor="bulk-design-photos"
          className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border px-4 text-center text-sm text-muted-foreground transition-colors hover:border-terracotta hover:text-terracotta ${
            drafts.length > 0 ? "min-h-16 py-3" : "min-h-32 py-6"
          }`}
        >
          <Upload className="h-6 w-6" aria-hidden />
          {drafts.length > 0 ? "Add more photos" : "Choose photos"}
          <span className="text-xs">
            Select several pictures at once. Title is optional.
          </span>
          <input
            id="bulk-design-photos"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/heic,image/heif,image/*"
            multiple
            className="sr-only"
            disabled={pending}
            onChange={(event) => {
              addFiles(event.target.files);
              event.target.value = "";
            }}
          />
        </label>
      )}

      <p className="text-xs text-muted-foreground">
        Up to {MAX_PHOTOS} photos. Leave a title blank and we will use a random
        name. Suggestions appear as you type.
      </p>

      {(state.status === "error" && state.message) || progress ? (
        <p
          className={`rounded-lg px-4 py-3 text-sm ${
            progress
              ? "bg-secondary text-secondary-foreground"
              : "bg-destructive/10 text-destructive"
          }`}
        >
          {progress || state.message}
        </p>
      ) : null}

      <div className="sticky bottom-0 z-10 -mx-4 mt-auto flex justify-end gap-3 border-t border-border bg-popover px-4 pb-1 pt-3">
        <Button type="button" variant="outline" onClick={onDone} disabled={pending}>
          Cancel
        </Button>
        <Button type="button" onClick={handleSubmit} disabled={pending || drafts.length === 0}>
          {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />}
          {pending
            ? "Uploading..."
            : drafts.length > 1
              ? `Upload ${drafts.length} photos`
              : "Upload photo"}
        </Button>
      </div>
    </div>
  );
}
