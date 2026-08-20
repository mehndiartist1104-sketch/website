import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { LeadsManager, type AdminLead } from "@/components/admin/leads-manager";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Leads" };

const FILTERS = [
  { value: "all", label: "All" },
  { value: "NEW", label: "New" },
  { value: "CONTACTED", label: "Contacted" },
  { value: "ENROLLED", label: "Enrolled" },
  { value: "CLOSED", label: "Closed" },
] as const;

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const validStatuses = ["NEW", "CONTACTED", "ENROLLED", "CLOSED"] as const;
  const filter = validStatuses.find((s) => s === status);

  const leads = await prisma.lead.findMany({
    where: filter ? { status: filter } : {},
    orderBy: { createdAt: "desc" },
    include: { course: { select: { title: true } } },
  });

  const serialized: AdminLead[] = leads.map((lead) => ({
    id: lead.id,
    name: lead.name,
    phone: lead.phone,
    email: lead.email,
    message: lead.message,
    source: lead.source,
    status: lead.status,
    createdAt: lead.createdAt.toISOString(),
    courseTitle: lead.course?.title ?? null,
  }));

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="font-heading text-3xl font-semibold text-primary">Leads</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Every form submission lands here. Update statuses as you follow up.
      </p>

      <div className="mt-6 flex flex-wrap gap-2" role="navigation" aria-label="Filter leads by status">
        {FILTERS.map((f) => (
          <Link
            key={f.value}
            href={f.value === "all" ? "/admin/leads" : `/admin/leads?status=${f.value}`}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
              (f.value === "all" && !filter) || f.value === filter
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-foreground/75 hover:border-terracotta hover:text-terracotta"
            )}
          >
            {f.label}
          </Link>
        ))}
      </div>

      <div className="mt-6">
        <LeadsManager leads={serialized} />
      </div>
    </div>
  );
}
