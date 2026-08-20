"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Reorder, useDragControls } from "framer-motion";
import { GripVertical, Pencil, Plus, Star, Trash2, Loader2 } from "lucide-react";
import {
  deleteDesign,
  reorderDesigns,
  toggleDesignFeatured,
} from "@/app/actions/designs";
import { BulkPhotoUpload } from "@/components/admin/bulk-photo-upload";
import { DesignForm, type AdminDesign } from "@/components/admin/design-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { categoryLabel } from "@/lib/types";
import { cn } from "@/lib/utils";

function DesignRow({
  design,
  onEdit,
  onDelete,
}: {
  design: AdminDesign;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const controls = useDragControls();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <Reorder.Item
      value={design}
      dragListener={false}
      dragControls={controls}
      className="flex items-center gap-3 rounded-xl border border-border bg-card px-3 py-3"
    >
      <button
        type="button"
        onPointerDown={(e) => controls.start(e)}
        className="cursor-grab touch-none rounded p-1 text-muted-foreground hover:text-foreground active:cursor-grabbing"
        aria-label={`Drag to reorder ${design.title}`}
      >
        <GripVertical className="h-5 w-5" />
      </button>

      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-border">
        <Image
          src={design.imageUrl}
          alt={design.title}
          fill
          sizes="56px"
          className="object-cover"
        />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-foreground">{design.title}</p>
        <Badge variant="secondary" className="mt-1">
          {categoryLabel(design.category)}
        </Badge>
      </div>

      <button
        type="button"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            await toggleDesignFeatured(design.id);
            router.refresh();
          })
        }
        className={cn(
          "rounded-full p-2 transition-colors",
          design.isFeatured
            ? "text-gold hover:text-gold/70"
            : "text-muted-foreground/40 hover:text-gold"
        )}
        aria-label={design.isFeatured ? "Remove from featured" : "Mark as featured"}
        aria-pressed={design.isFeatured}
      >
        <Star className={cn("h-5 w-5", design.isFeatured && "fill-gold")} />
      </button>

      <Button variant="ghost" size="icon-sm" onClick={onEdit} aria-label={`Edit ${design.title}`}>
        <Pencil className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={onDelete}
        className="text-destructive hover:bg-destructive/10"
        aria-label={`Delete ${design.title}`}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </Reorder.Item>
  );
}

export function DesignsManager({
  initialDesigns,
  categories,
}: {
  initialDesigns: AdminDesign[];
  categories: string[];
}) {
  const router = useRouter();
  const [designs, setDesigns] = useState(initialDesigns);
  const [savedOrder, setSavedOrder] = useState(initialDesigns.map((d) => d.id));
  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<AdminDesign | null>(null);
  const [deleting, setDeleting] = useState<AdminDesign | null>(null);
  const [pending, startTransition] = useTransition();

  const dirty = designs.some((d, i) => d.id !== savedOrder[i]);

  function refreshAndClose() {
    setCreateOpen(false);
    setEditing(null);
    router.refresh();
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          Drag to reorder — the order shown here is the order on the public gallery.
        </p>
        <div className="flex gap-2">
          {dirty && (
            <Button
              variant="outline"
              disabled={pending}
              onClick={() =>
                startTransition(async () => {
                  await reorderDesigns(designs.map((d) => d.id));
                  setSavedOrder(designs.map((d) => d.id));
                  router.refresh();
                })
              }
            >
              {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />}
              Save order
            </Button>
          )}
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="mr-2 h-4 w-4" aria-hidden />
            Add photos
          </Button>
        </div>
      </div>

      <Reorder.Group
        axis="y"
        values={designs}
        onReorder={setDesigns}
        className="mt-6 space-y-3"
      >
        {designs.map((design) => (
          <DesignRow
            key={design.id}
            design={design}
            onEdit={() => setEditing(design)}
            onDelete={() => setDeleting(design)}
          />
        ))}
      </Reorder.Group>

      {designs.length === 0 && (
        <p className="mt-10 text-center text-sm text-muted-foreground">
          No designs yet — add your first one.
        </p>
      )}

      {/* Create */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogTitle>Add photos</DialogTitle>
          <DialogDescription>
            Upload one or many pictures. Titles and categories are not needed.
          </DialogDescription>
          <BulkPhotoUpload onDone={refreshAndClose} />
        </DialogContent>
      </Dialog>

      {/* Edit */}
      <Dialog open={editing !== null} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogTitle>Edit design</DialogTitle>
          <DialogDescription className="sr-only">Edit gallery design</DialogDescription>
          {editing && (
            <DesignForm
              design={editing}
              categories={categories}
              onDone={refreshAndClose}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <Dialog open={deleting !== null} onOpenChange={(open) => !open && setDeleting(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogTitle>Delete design</DialogTitle>
          <DialogDescription>
            This removes &ldquo;{deleting?.title}&rdquo; from the gallery and deletes
            its image from Cloudinary. This cannot be undone.
          </DialogDescription>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setDeleting(null)} disabled={pending}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={pending}
              onClick={() =>
                startTransition(async () => {
                  if (!deleting) return;
                  await deleteDesign(deleting.id);
                  setDeleting(null);
                  setDesigns((prev) => prev.filter((d) => d.id !== deleting.id));
                  router.refresh();
                })
              }
            >
              {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />}
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
