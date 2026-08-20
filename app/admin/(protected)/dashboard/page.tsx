import Link from "next/link";
import { Images, GraduationCap, Star, Inbox, ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default async function AdminDashboardPage() {
  const [newLeads, pendingReviews, designCount, courseCount] = await Promise.all([
    prisma.lead.count({ where: { status: "NEW" } }),
    prisma.review.count({ where: { isApproved: false } }),
    prisma.design.count(),
    prisma.course.count({ where: { isActive: true } }),
  ]);

  const stats = [
    { label: "New leads", value: newLeads, href: "/admin/leads", icon: Inbox },
    { label: "Reviews awaiting moderation", value: pendingReviews, href: "/admin/reviews", icon: Star },
    { label: "Gallery designs", value: designCount, href: "/admin/designs", icon: Images },
    { label: "Active courses", value: courseCount, href: "/admin/courses", icon: GraduationCap },
  ];

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="font-heading text-3xl font-semibold text-primary">Dashboard</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        A quick look at what needs your attention.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href} className="group">
            <Card className="border-border/70 transition-shadow group-hover:shadow-md">
              <CardHeader className="flex-row items-center justify-between pb-2">
                <span className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </span>
                <stat.icon className="h-4 w-4 text-terracotta" aria-hidden />
              </CardHeader>
              <CardContent>
                <p className="font-heading text-4xl font-semibold text-primary">
                  {stat.value}
                </p>
                <p className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-terracotta">
                  Open <ArrowRight className="h-3 w-3" aria-hidden />
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
