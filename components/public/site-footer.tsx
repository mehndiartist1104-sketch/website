import Link from "next/link";
import { Camera, MapPin, Phone, MessageCircle } from "lucide-react";
import { GaneshaMark } from "@/components/brand/ganesha-mark";
import type { SiteConfigData } from "@/lib/types";

export function SiteFooter({ config }: { config: SiteConfigData }) {
  return (
    <footer className="border-t border-border/60 bg-secondary/40 pb-24 md:pb-0">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div>
          <div className="flex items-center gap-2 text-primary">
            <GaneshaMark className="h-6 w-6 text-terracotta" />
            <span className="font-heading text-2xl font-semibold">
              {config.studioName}
            </span>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {config.tagline}
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-primary">
            Explore
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-foreground/80">
            <li><Link href="/gallery" className="inline-block py-1.5 hover:text-terracotta">Gallery</Link></li>
            <li><Link href="/courses" className="inline-block py-1.5 hover:text-terracotta">Courses</Link></li>
            <li><Link href="/reviews" className="inline-block py-1.5 hover:text-terracotta">Reviews</Link></li>
            <li><Link href="/contact" className="inline-block py-1.5 hover:text-terracotta">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-primary">
            Contact
          </h3>
          <ul className="mt-4 space-y-3 text-sm text-foreground/80">
            <li className="flex items-start gap-2">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-terracotta" aria-hidden />
              <a href={`tel:${config.phone.replace(/\s/g, "")}`} className="hover:text-terracotta">
                {config.phone}
              </a>
            </li>
            <li className="flex items-start gap-2">
              <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-terracotta" aria-hidden />
              <a
                href={`https://wa.me/${config.whatsappNumber.replace(/[^\d]/g, "")}`}
                target="_blank"
                rel="noreferrer"
                className="hover:text-terracotta"
              >
                WhatsApp
              </a>
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-terracotta" aria-hidden />
              <span>{config.address}</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-primary">
            Follow
          </h3>
          <a
            href={config.instagramUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex items-center gap-2 text-sm text-foreground/80 hover:text-terracotta"
          >
            <Camera className="h-4 w-4 text-terracotta" aria-hidden />
            Instagram
          </a>
        </div>
      </div>

      <div className="border-t border-border/60 py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} {config.studioName}. All rights reserved.
      </div>
    </footer>
  );
}
