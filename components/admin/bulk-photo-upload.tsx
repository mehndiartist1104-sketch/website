"use client";

import Image from "next/image";
import { useState, useTransition } from "react";
import { Loader2, Upload, X } from "lucide-react";
import { createDesigns } from "@/app/actions/designs";
import { uploadImageToCloudinary } from "@/lib/upload-image";
import { initialFormState, type FormState } from "@/lib/validations/lead";
import { Button } from "@/components/ui/button";

const MAX_PHOTOS = 24;
const DEFAULT_CATEGORY = "GALLERY";

function titleFromFile(file: File) {
  const base = file.name.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " ").trim();
  return (base || "Design").slice(0, 120);
}

export function BulkPhotoUpload({ onDone }: { onDone: () => void }) {
  const [state, setState] = useState<FormState>(initialFormState);
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [progress, setProgress] = useState("");
  const [pending, startTransition] = useTransition();

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

  function handleSubmit() {
    if (files.length === 0) {
      setState({ status: "error", message: "Choose at least one photo." });
      return;
    }

    startTransition(async () => {
      try {
        const items = [];
        for (let i = 0; i < files.length; i += 1) {
          setProgress(`Uploading ${i + 1} of ${files.length}…`);
          const uploaded = await uploadImageToCloudinary(files[i]);
          items.push({
            title: titleFromFile(files[i]),
            category: DEFAULT_CATEGORY,
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
      {previews.length > 0 && (
        <div className="max-h-[45svh] overflow-y-auto overscroll-contain rounded-lg pr-1 [-webkit-overflow-scrolling:touch]">
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {previews.map((src, index) => (
              <div
                key={`${src}-${index}`}
                className="relative aspect-square overflow-hidden rounded-lg border border-border"
              >
                <Image src={src} alt="" fill className="object-cover" sizes="120px" unoptimized />
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="absolute right-1 top-1 rounded-full bg-primary/80 p-1 text-primary-foreground"
                  aria-label="Remove photo"
                  disabled={pending}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {files.length < MAX_PHOTOS && (
        <label
          htmlFor="bulk-design-photos"
          className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border px-4 text-center text-sm text-muted-foreground transition-colors hover:border-terracotta hover:text-terracotta ${
            files.length > 0 ? "min-h-16 py-3" : "min-h-32 py-6"
          }`}
        >
          <Upload className="h-6 w-6" aria-hidden />
          {files.length > 0 ? "Add more photos" : "Choose photos"}
          <span className="text-xs">Select several pictures at once. No title needed.</span>
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
        Up to {MAX_PHOTOS} photos. They go straight into the gallery.
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
        <Button type="button" onClick={handleSubmit} disabled={pending || files.length === 0}>
          {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />}
          {pending
            ? "Uploading..."
            : files.length > 1
              ? `Upload ${files.length} photos`
              : "Upload photo"}
        </Button>
      </div>
    </div>
  );
}
