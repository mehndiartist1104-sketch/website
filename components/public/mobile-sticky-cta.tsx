import type { SiteConfigData } from "@/lib/types";

export function MobileStickyCta({ config }: { config: SiteConfigData }) {
  const tel = config.phone.replace(/\s/g, "");
  const wa = config.whatsappNumber.replace(/[^\d]/g, "");

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border/80 bg-background/95 px-3 pt-2 backdrop-blur-md pb-[max(0.5rem,env(safe-area-inset-bottom))] md:hidden">
      <div className="grid grid-cols-2 gap-2">
        <a
          href={`tel:${tel}`}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-border bg-card text-sm font-medium text-foreground"
          aria-label="Call the studio"
        >
          <span aria-hidden>📞</span>
          Call
        </a>
        <a
          href={`https://wa.me/${wa}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-primary text-sm font-medium text-primary-foreground"
          aria-label="Chat on WhatsApp"
        >
          <span aria-hidden>💬</span>
          WhatsApp
        </a>
      </div>
    </div>
  );
}
