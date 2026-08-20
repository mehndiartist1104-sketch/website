"use client";

import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GalleryGrid } from "@/components/public/gallery-grid";
import { fetchDesignsPage } from "@/app/actions/gallery";
import { GALLERY_PAGE_SIZE } from "@/lib/constants";
import type { DesignItem } from "@/lib/types";

export function LoadMoreDesigns({
  category,
  initialLoaded,
  total,
}: {
  category?: string;
  initialLoaded: number;
  total: number;
}) {
  const [extra, setExtra] = useState<DesignItem[]>([]);
  const [pending, startTransition] = useTransition();

  const loaded = initialLoaded + extra.length;
  const hasMore = loaded < total;

  if (!hasMore && extra.length === 0) return null;

  function loadMore() {
    startTransition(async () => {
      const { designs } = await fetchDesignsPage({
        category,
        offset: loaded,
        limit: GALLERY_PAGE_SIZE,
      });
      setExtra((prev) => [...prev, ...designs]);
    });
  }

  return (
    <>
      {extra.length > 0 && (
        <div className="mt-4">
          <GalleryGrid designs={extra} />
        </div>
      )}
      {hasMore && (
        <div className="mt-10 text-center">
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="h-12 w-full sm:w-auto"
            onClick={loadMore}
            disabled={pending}
          >
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />}
            {pending ? "Loading..." : `Load more (${total - loaded} remaining)`}
          </Button>
        </div>
      )}
    </>
  );
}
