import Link from "next/link";
import { cn } from "@/lib/utils";
import { CATEGORY_LABELS, DESIGN_CATEGORIES, type DesignCategory } from "@/lib/types";

export function CategoryFilter({ current }: { current?: DesignCategory }) {
  return (
    <div
      className="-mx-4 flex flex-nowrap gap-2 overflow-x-auto scrollbar-none px-4 pb-1 sm:mx-0 sm:flex-wrap sm:justify-center sm:overflow-visible sm:px-0"
      role="navigation"
      aria-label="Filter designs by category"
    >
      <Link
        href="/gallery"
        className={cn(
          "shrink-0 rounded-full border px-4 py-2.5 text-sm font-medium transition-colors",
          !current
            ? "border-primary bg-primary text-primary-foreground"
            : "border-border bg-card text-foreground/75 hover:border-terracotta hover:text-terracotta"
        )}
      >
        All
      </Link>
      {DESIGN_CATEGORIES.map((category) => (
        <Link
          key={category}
          href={`/gallery/${category.toLowerCase()}`}
          className={cn(
            "shrink-0 rounded-full border px-4 py-2.5 text-sm font-medium capitalize transition-colors",
            current === category
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-card text-foreground/75 hover:border-terracotta hover:text-terracotta"
          )}
        >
          {CATEGORY_LABELS[category]}
        </Link>
      ))}
    </div>
  );
}
