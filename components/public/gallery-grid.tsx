"use client";

import Image from "next/image";
import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { InstagramTapPrompt } from "@/components/public/instagram-tap-prompt";
import { INSTAGRAM_URL } from "@/lib/constants";
import { categoryLabel, type DesignItem } from "@/lib/types";

const BLUR =
  "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8'%3E%3Cfilter id='b'%3E%3CfeGaussianBlur stdDeviation='1'/%3E%3C/filter%3E%3Crect width='8' height='8' fill='%23e5d8c3' filter='url(%23b)'/%3E%3C/svg%3E";

export function GalleryGrid({ designs }: { designs: DesignItem[] }) {
  const [selected, setSelected] = useState<DesignItem | null>(null);
  const [showInstagramPrompt, setShowInstagramPrompt] = useState(false);

  return (
    <>
      <div className="columns-2 gap-2 sm:columns-3 sm:gap-4 lg:columns-4 [&>*]:mb-2 sm:[&>*]:mb-4">
        {designs.map((design, i) => (
          <button
            key={design.id}
            type="button"
          onClick={() => {
            setShowInstagramPrompt(false);
            setSelected(design);
          }}
            className="group relative mb-2 block w-full break-inside-avoid cursor-pointer overflow-hidden rounded-lg bg-muted shadow-sm transition-shadow hover:shadow-lg focus-visible:outline-2 focus-visible:outline-ring sm:mb-4 sm:rounded-xl"
            aria-label={`View ${design.title}`}
          >
            <Image
              src={design.imageUrl}
              alt={design.title}
              width={600}
              height={600 + ((i * 97) % 240)}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              placeholder="blur"
              blurDataURL={BLUR}
              className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent opacity-100 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100" />
            <div className="absolute inset-x-0 bottom-0 p-2 text-left sm:p-3 sm:translate-y-2 sm:opacity-0 sm:transition-all sm:duration-300 [@media(hover:hover)]:group-hover:translate-y-0 [@media(hover:hover)]:group-hover:opacity-100">
              <p className="font-heading text-sm font-semibold text-primary-foreground sm:text-lg">
                {design.title}
              </p>
              <Badge variant="secondary" className="mt-1 bg-gold/90 text-[0.65rem] text-primary sm:text-xs">
                {categoryLabel(design.category)}
              </Badge>
            </div>
          </button>
        ))}
      </div>

      <Dialog
        open={selected !== null}
        onOpenChange={(open) => {
          if (!open) {
            setSelected(null);
            setShowInstagramPrompt(false);
          }
        }}
      >
        <DialogContent
          showCloseButton={false}
          className="max-h-[90svh] w-[calc(100%-1.5rem)] max-w-3xl overflow-y-auto border-none bg-transparent p-0 shadow-none ring-0"
        >
          <DialogTitle className="sr-only">
            {selected?.title ?? "Design preview"}
          </DialogTitle>
          {selected && (
            <div className="relative overflow-hidden rounded-2xl bg-card shadow-2xl">
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="absolute right-3 top-3 z-30 rounded-full bg-primary/70 p-2.5 text-primary-foreground transition-colors hover:bg-primary"
                aria-label="Close preview"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="relative">
                <button
                  type="button"
                  className="block w-full cursor-pointer"
                  onClick={() => setShowInstagramPrompt(true)}
                  aria-label="View more of this design on Instagram"
                >
                  <Image
                    src={selected.imageUrl}
                    alt={selected.title}
                    width={1200}
                    height={900}
                    sizes="(max-width: 768px) 100vw, 768px"
                    className="max-h-[60svh] w-full object-contain sm:max-h-[75vh]"
                  />
                </button>
                {showInstagramPrompt && (
                  <InstagramTapPrompt
                    href={selected.instagramUrl || INSTAGRAM_URL}
                  />
                )}
              </div>
              <div className="flex flex-col items-start gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:px-5 sm:py-4">
                <p className="font-heading text-lg font-semibold text-primary sm:text-2xl">
                  {selected.title}
                </p>
                <Badge className="bg-terracotta text-primary-foreground">
                  {categoryLabel(selected.category)}
                </Badge>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
