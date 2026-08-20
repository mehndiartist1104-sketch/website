import Link from "next/link";
import { BadgePercent } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getActiveOffer } from "@/lib/data";
import { formatPrice } from "@/lib/types";
import { Reveal } from "@/components/public/reveal";

export async function OfferBanner() {
  const offer = await getActiveOffer();
  if (!offer || offer.offerPrice === null) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
      <Reveal>
        <div className="relative overflow-hidden rounded-2xl bg-primary px-5 py-10 text-center shadow-lg sm:rounded-3xl sm:px-12 sm:py-12">
          <div
            className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full border-[24px] border-gold/15"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full border-[28px] border-terracotta/20"
            aria-hidden
          />
          <div className="relative">
            <BadgePercent className="mx-auto h-10 w-10 text-gold" aria-hidden />
            <h2 className="mt-4 font-heading text-2xl font-semibold text-primary-foreground sm:text-4xl">
              Limited offer on {offer.title}
            </h2>
            <p className="mt-3 text-base leading-relaxed text-primary-foreground/85 sm:text-lg">
              Enroll now at{" "}
              <span className="font-semibold text-gold">
                {formatPrice(offer.offerPrice)}
              </span>{" "}
              <span className="line-through opacity-70">
                {formatPrice(offer.price)}
              </span>{" "}
              · {offer.durationLabel}
            </p>
            <Button
              size="lg"
              className="mt-6 h-12 w-full bg-gold text-base text-primary hover:bg-gold/90 sm:w-auto"
              render={<Link href={`/courses/${offer.slug}`} />}
            >
              Claim the offer
            </Button>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
