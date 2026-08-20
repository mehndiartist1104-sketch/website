import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { CertificatesManager } from "@/components/admin/certificates-manager";

export const metadata: Metadata = { title: "Certificates" };

export default async function AdminCertificatesPage() {
  const [courses, certificates, config] = await Promise.all([
    prisma.course.findMany({
      orderBy: { title: "asc" },
      select: { id: true, title: true, durationLabel: true },
    }),
    prisma.certificate.findMany({
      orderBy: { issuedAt: "desc" },
      include: { course: { select: { title: true, durationLabel: true } } },
    }),
    prisma.siteConfig.findUnique({ where: { id: 1 } }),
  ]);

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="font-heading text-3xl font-semibold text-primary">Certificates</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Issue premium certificates of completion. Students get a printable page they
        can share, and each certificate has a unique verification number.
      </p>
      <div className="mt-8">
        <CertificatesManager
          courses={courses}
          studioName={config?.studioName ?? "Mehndi Studio"}
          tagline={config?.tagline ?? ""}
          certificates={certificates.map((item) => ({
            id: item.id,
            serialNumber: item.serialNumber,
            recipientName: item.recipientName,
            recipientEmail: item.recipientEmail,
            completedAt: item.completedAt.toISOString(),
            issuedAt: item.issuedAt.toISOString(),
            courseTitle: item.course.title,
            durationLabel: item.course.durationLabel,
          }))}
        />
      </div>
    </div>
  );
}
