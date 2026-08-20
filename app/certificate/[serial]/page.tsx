import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CourseCertificate } from "@/components/public/course-certificate";
import { PrintCertificateButton } from "@/components/public/print-certificate-button";

export const revalidate = 0;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ serial: string }>;
}): Promise<Metadata> {
  const { serial } = await params;
  const certificate = await prisma.certificate.findUnique({
    where: { serialNumber: serial.toUpperCase() },
    include: { course: { select: { title: true } } },
  });
  if (!certificate) return { title: "Certificate" };
  return {
    title: `Certificate · ${certificate.recipientName}`,
    description: `Official certificate of completion for ${certificate.course.title}.`,
    robots: { index: false, follow: false },
  };
}

export default async function CertificatePage({
  params,
}: {
  params: Promise<{ serial: string }>;
}) {
  const { serial } = await params;
  const [certificate, config] = await Promise.all([
    prisma.certificate.findUnique({
      where: { serialNumber: serial.toUpperCase() },
      include: { course: { select: { title: true, durationLabel: true } } },
    }),
    prisma.siteConfig.findUnique({ where: { id: 1 } }),
  ]);

  if (!certificate || !config) notFound();

  return (
    <div className="min-h-svh bg-[#2b1a12] px-3 py-6 sm:px-6 sm:py-10 print:bg-white print:p-0">
      <div className="mx-auto max-w-5xl print:max-w-none">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <p className="text-sm text-[#faf3e8]/80">
            Verified certificate of completion · {certificate.serialNumber}
          </p>
          <PrintCertificateButton />
        </div>
        <CourseCertificate
          certificate={{
            studioName: config.studioName,
            tagline: config.tagline,
            recipientName: certificate.recipientName,
            courseTitle: certificate.course.title,
            durationLabel: certificate.course.durationLabel,
            completedAt: certificate.completedAt,
            issuedAt: certificate.issuedAt,
            serialNumber: certificate.serialNumber,
          }}
        />
      </div>
    </div>
  );
}
