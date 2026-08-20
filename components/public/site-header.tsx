"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { GaneshaMark } from "@/components/brand/ganesha-mark";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/gallery", label: "Gallery" },
  { href: "/courses", label: "Courses" },
  { href: "/reviews", label: "Reviews" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader({ studioName }: { studioName: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/90 pt-[env(safe-area-inset-top)] backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-3 px-4 sm:h-16 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-2 text-primary"
          onClick={() => setOpen(false)}
        >
          <GaneshaMark className="h-6 w-6 shrink-0 text-terracotta" />
          <span className="truncate font-heading text-xl font-semibold tracking-wide sm:text-2xl">
            {studioName}
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Main">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium tracking-wide transition-colors hover:text-terracotta",
                pathname.startsWith(link.href)
                  ? "text-terracotta"
                  : "text-foreground/80"
              )}
            >
              {link.label}
            </Link>
          ))}
          <Button size="sm" className="bg-primary hover:bg-primary/90" render={<Link href="/contact" />}>
            Book Now
          </Button>
        </nav>

        <button
          type="button"
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-foreground md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label="Toggle navigation"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <nav
          className="max-h-[calc(100svh-3.5rem-env(safe-area-inset-top))] overflow-y-auto border-t border-border/60 bg-background px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-2 md:hidden"
          aria-label="Mobile"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={cn(
                "block rounded-md px-3 py-3.5 text-base font-medium",
                pathname.startsWith(link.href)
                  ? "text-terracotta"
                  : "text-foreground/80"
              )}
            >
              {link.label}
            </Link>
          ))}
          <Button
            className="mt-2 h-12 w-full bg-primary text-base hover:bg-primary/90"
            render={<Link href="/contact" onClick={() => setOpen(false)} />}
          >
            Book Now
          </Button>
        </nav>
      )}
    </header>
  );
}
