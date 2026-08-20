"use client";

import Image from "next/image";
import { useState, useTransition, type FormEvent } from "react";
import { Loader2, Upload } from "lucide-react";
import { uploadImageToCloudinary } from "@/lib/upload-image";
import { createDesign, updateDesign } from "@/app/actions/designs";
import { initialFormState, type FormState } from "@/lib/validations/lead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { categoryLabel, type DesignCategory } from "@/lib/types";

export interface AdminDesign {
  id: string;
  title: string;
  category: DesignCategory;
  imageUrl: string;
  cloudinaryPublicId: string;
  isFeatured: boolean;
  sortOrder: number;
}

export function DesignForm({
  design,
  categories,
  onDone,
}: {
  design?: AdminDesign;
  categories: string[];
  onDone: () => void;
}) {
  const [state, setState] = useState<FormState>(initialFormState);
  const [category, setCategory] = useState<DesignCategory>(
    design?.category ?? "BRIDAL"
  );
  const [customCategory, setCustomCategory] = useState("");
  const [addingCustom, setAddingCustom] = useState(false);
  const [featured, setFeatured] = useState(design?.isFeatured ?? false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(design?.imageUrl ?? null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    startTransition(async () => {
      try {
        let imageUrl = design?.imageUrl ?? "";
        let cloudinaryPublicId = design?.cloudinaryPublicId ?? "";

        if (file) {
          const uploaded = await uploadImageToCloudinary(file);
          imageUrl = uploaded.imageUrl;
          cloudinaryPublicId = uploaded.cloudinaryPublicId;
        }

        const fd = new FormData();
        fd.set("title", String(new FormData(form).get("title") ?? ""));
        fd.set("category", addingCustom ? customCategory : category);
        fd.set("imageUrl", imageUrl);
        fd.set("cloudinaryPublicId", cloudinaryPublicId);
        if (featured) fd.set("isFeatured", "on");

        const result = design
          ? await updateDesign(design.id, initialFormState, fd)
          : await createDesign(initialFormState, fd);

        setState(result);
        if (result.status === "success") onDone();
      } catch (error) {
        console.error(error);
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
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div className="space-y-2">
        <Label htmlFor="design-title">Title</Label>
        <Input
          id="design-title"
          name="title"
          required
          defaultValue={design?.title}
          placeholder="e.g. Full-hand bridal mandala"
        />
        {state.fieldErrors?.title && (
          <p className="text-sm text-destructive">{state.fieldErrors.title[0]}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Category</Label>
        <Select
          value={category}
          onValueChange={(value) => {
            if (!value) return;
            setAddingCustom(false);
            setCustomCategory("");
            setCategory(value);
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent alignItemWithTrigger={false} align="start">
            {categories.map((c) => (
              <SelectItem key={c} value={c}>
                {categoryLabel(c)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Label htmlFor="custom-category" className="text-muted-foreground">
          Or type a new category
        </Label>
        <Input
          id="custom-category"
          value={customCategory}
          onChange={(event) => {
            setCustomCategory(event.target.value);
            setAddingCustom(event.target.value.trim().length > 0);
          }}
          placeholder="e.g. Engagement, Party, Festival special"
        />
        {state.fieldErrors?.category && (
          <p className="text-sm text-destructive">{state.fieldErrors.category[0]}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="design-image">Image {design && "(leave empty to keep current)"}</Label>
        <div className="flex items-center gap-4">
          {preview && (
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-border">
              <Image src={preview} alt="Preview" fill className="object-cover" sizes="80px" />
            </div>
          )}
          <label
            htmlFor="design-image"
            className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-border px-4 py-3 text-sm text-muted-foreground transition-colors hover:border-terracotta hover:text-terracotta"
          >
            <Upload className="h-4 w-4" aria-hidden />
            {file ? file.name : "Choose image"}
            <input
              id="design-image"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/heic,image/heif,image/*"
              className="sr-only"
              onChange={(e) => {
                const next = e.target.files?.[0] ?? null;
                setFile(next);
                if (next) setPreview(URL.createObjectURL(next));
              }}
            />
          </label>
        </div>
        <p className="text-xs text-muted-foreground">
          Phone photos are resized automatically before upload.
        </p>
        {state.fieldErrors?.imageUrl && (
          <p className="text-sm text-destructive">{state.fieldErrors.imageUrl[0]}</p>
        )}
      </div>

      <div className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
        <Label htmlFor="design-featured" className="cursor-pointer">
          Feature on homepage
        </Label>
        <Switch
          id="design-featured"
          checked={featured}
          onCheckedChange={(checked) => setFeatured(checked)}
        />
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
          {pending ? "Saving..." : design ? "Save changes" : "Add design"}
        </Button>
      </div>
    </form>
  );
}
