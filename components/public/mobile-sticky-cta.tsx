import type { SiteConfigData } from "@/lib/types";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" />
    </svg>
  );
}

const btnBase =
  "inline-flex h-12 items-center justify-center gap-2 rounded-lg text-sm font-medium";
const outlineBtn = `${btnBase} border border-border bg-card text-foreground`;
const primaryBtn = `${btnBase} bg-primary text-primary-foreground`;

export function MobileStickyCta({ config }: { config: SiteConfigData }) {
  const tel = config.phone.replace(/\s/g, "");
  const wa = config.whatsappNumber.replace(/[^\d]/g, "");
  const columns =
    (config.showPhone ? 1 : 0) + (config.showWhatsApp ? 1 : 0) + 1;
  const instagramIsPrimary = !config.showWhatsApp;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border/80 bg-background/95 px-3 pt-2 backdrop-blur-md pb-[max(0.5rem,env(safe-area-inset-bottom))] md:hidden">
      <div
        className={
          columns === 3 ? "grid grid-cols-3 gap-2" : columns === 2 ? "grid grid-cols-2 gap-2" : "grid grid-cols-1"
        }
      >
        {config.showPhone && (
          <a href={`tel:${tel}`} className={outlineBtn} aria-label="Call the studio">
            <span aria-hidden>📞</span>
            Call
          </a>
        )}
        <a
          href={config.instagramUrl}
          target="_blank"
          rel="noreferrer"
          className={instagramIsPrimary ? primaryBtn : outlineBtn}
          aria-label="Open Instagram"
        >
          <InstagramIcon className="h-4 w-4" />
          Instagram
        </a>
        {config.showWhatsApp && (
          <a
            href={`https://wa.me/${wa}`}
            target="_blank"
            rel="noreferrer"
            className={primaryBtn}
            aria-label="Chat on WhatsApp"
          >
            <span aria-hidden>💬</span>
            WhatsApp
          </a>
        )}
      </div>
    </div>
  );
}
