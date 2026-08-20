"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { SiteConfigData } from "@/lib/types";

export function Hero({ config }: { config: SiteConfigData }) {
  return (
    <section className="relative isolate min-h-[88svh] overflow-hidden">
      <div className="relative z-10 mx-auto flex min-h-[88svh] max-w-7xl flex-col justify-center px-4 pb-16 pt-10 sm:px-6 lg:px-8 lg:py-24">
        <div className="max-w-xl lg:max-w-2xl">
          <p className="mb-3 text-[0.68rem] font-semibold uppercase leading-relaxed tracking-[0.16em] text-gold sm:mb-4 sm:text-sm sm:tracking-[0.3em]">
            {config.tagline}
          </p>
          <h1 className="font-heading text-[2.15rem] font-semibold leading-[1.12] text-primary-foreground sm:text-6xl lg:text-7xl">
            {config.heroHeadline}
          </h1>
          <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:gap-4">
            <Button
              size="lg"
              className="h-12 w-full bg-gold px-6 text-base text-primary hover:bg-gold/90 sm:w-auto"
              render={<Link href="/contact" />}
            >
              Book a Session
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-12 w-full border-primary-foreground/60 bg-transparent px-6 text-base text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground sm:w-auto"
              render={<Link href="/gallery" />}
            >
              View Gallery
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
