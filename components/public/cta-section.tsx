import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/public/reveal";
import type { SiteConfigData } from "@/lib/types";

export function CtaSection({ config }: { config: SiteConfigData }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
      <Reveal>
        <div className="rounded-2xl border border-border/70 bg-card/90 px-5 py-10 text-center shadow-sm backdrop-blur-sm sm:rounded-3xl sm:px-12 sm:py-16">
          <h2 className="mx-auto max-w-2xl font-heading text-3xl font-semibold text-primary sm:text-5xl">
            Your occasion deserves art, not a template
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Tell us the date, the outfit, and the vibe — we will take care of the rest.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
            <Button
              size="lg"
              className="h-12 w-full bg-terracotta text-base text-primary-foreground hover:bg-terracotta/90 sm:w-auto"
              render={<Link href="/contact" />}
            >
              Get in touch
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-12 w-full text-base sm:w-auto"
              render={<a href={`tel:${config.phone.replace(/\s/g, "")}`} />}
            >
              📞 Call
            </Button>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
