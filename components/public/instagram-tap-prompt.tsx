"use client";

export function InstagramTapPrompt({ href }: { href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="absolute inset-0 z-20 flex items-center justify-center bg-primary/55 p-4 backdrop-blur-[2px] animate-in fade-in-0 zoom-in-95 duration-200"
    >
      <span className="max-w-xs rounded-3xl border border-gold/50 bg-[#fffaf3] px-6 py-6 text-center shadow-[0_20px_50px_rgba(92,26,27,0.35)]">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-terracotta text-primary-foreground">
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden>
            <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.8" />
            <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
            <circle cx="17.2" cy="6.8" r="1" fill="currentColor" />
          </svg>
        </span>
        <span className="mt-3 block font-heading text-2xl font-semibold text-primary">
          More of this magic
        </span>
        <span className="mt-1 block text-sm text-muted-foreground">
          Tap to view more on Instagram
        </span>
        <span className="mt-4 inline-flex rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
          Open Instagram
        </span>
      </span>
    </a>
  );
}
