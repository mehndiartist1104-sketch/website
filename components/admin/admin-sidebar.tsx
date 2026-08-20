"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  LayoutDashboard,
  Images,
  GraduationCap,
  Star,
  Inbox,
  Settings,
  Award,
  LogOut,
} from "lucide-react";
import { GaneshaMark } from "@/components/brand/ganesha-mark";
import { signOutAction } from "@/app/actions/auth";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/designs", label: "Designs", icon: Images },
  { href: "/admin/courses", label: "Courses", icon: GraduationCap },
  { href: "/admin/certificates", label: "Certificates", icon: Award },
  { href: "/admin/reviews", label: "Reviews", icon: Star },
  { href: "/admin/leads", label: "Leads", icon: Inbox },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminSidebar({ email }: { email: string }) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      for (const item of NAV) {
        router.prefetch(item.href);
      }
    }, 80);
    return () => window.clearTimeout(timer);
  }, [router]);

  return (
    <>
      {/* Mobile top bar */}
      <div className="fixed inset-x-0 top-0 z-40 flex items-center gap-1 overflow-x-auto scrollbar-none border-b border-border bg-card px-2 py-2 pt-[max(0.5rem,env(safe-area-inset-top))] md:hidden">
        <GaneshaMark className="mr-2 h-5 w-5 shrink-0 text-terracotta" />
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            prefetch
            className={cn(
              "flex min-h-11 shrink-0 items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium",
              pathname.startsWith(item.href)
                ? "bg-primary text-primary-foreground"
                : "text-foreground/75 hover:bg-muted"
            )}
          >
            <item.icon className="h-4 w-4" aria-hidden />
            {item.label}
          </Link>
        ))}
        <button
          type="button"
          onClick={() => signOutAction()}
          className="ml-auto flex min-h-11 shrink-0 items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium text-foreground/75 hover:bg-muted"
          aria-label="Sign out"
        >
          <LogOut className="h-4 w-4" aria-hidden />
        </button>
      </div>

      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-svh w-60 shrink-0 flex-col border-r border-border bg-card md:flex">
        <div className="flex items-center gap-2 px-5 py-5 text-primary">
          <GaneshaMark className="h-6 w-6 text-terracotta" />
          <span className="font-heading text-xl font-semibold">Studio Admin</span>
        </div>
        <nav className="flex-1 space-y-1 px-3" aria-label="Admin">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              prefetch
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                pathname.startsWith(item.href)
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground/75 hover:bg-muted"
              )}
            >
              <item.icon className="h-4 w-4" aria-hidden />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-border px-3 py-4">
          <p className="truncate px-3 pb-2 text-xs text-muted-foreground">{email}</p>
          <button
            type="button"
            onClick={() => signOutAction()}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground/75 transition-colors hover:bg-muted"
          >
            <LogOut className="h-4 w-4" aria-hidden />
            Sign out
          </button>
        </div>
      </aside>
    </>
  );
}
