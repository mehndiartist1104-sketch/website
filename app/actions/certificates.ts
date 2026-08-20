"use server";

import { randomBytes } from "crypto";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/guard";
import { certificateSchema } from "@/lib/validations/admin";
import type { FormState } from "@/lib/validations/lead";
import { sendCertificateEmail } from "@/lib/resend";

async function uniqueSerial(): Promise<string> {
  const year = new Date().getFullYear();
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const serial = `MS-${year}-${randomBytes(3).toString("hex").toUpperCase()}`;
    const exists = await prisma.certificate.findUnique({ where: { serialNumber: serial } });
    if (!exists) return serial;
  }
  throw new Error("Could not generate a unique certificate number");
}

export async function issueCertificate(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  await requireAdmin();

  const parsed = certificateSchema.safeParse({
    recipientName: formData.get("recipientName"),
    recipientEmail: formData.get("recipientEmail") ?? "",
    courseId: formData.get("courseId"),
    completedAt: formData.get("completedAt"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please fix the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const course = await prisma.course.findUnique({
    where: { id: parsed.data.courseId },
  });
  if (!course) return { status: "error", message: "Course not found." };

  const completedAt = new Date(parsed.data.completedAt);
  if (Number.isNaN(completedAt.getTime())) {
    return {
      status: "error",
      message: "Please fix the highlighted fields.",
      fieldErrors: { completedAt: ["Enter a valid date"] },
    };
  }

  const email = parsed.data.recipientEmail || null;
  const serialNumber = await uniqueSerial();

  await prisma.certificate.create({
    data: {
      serialNumber,
      recipientName: parsed.data.recipientName,
      recipientEmail: email,
      courseId: course.id,
      completedAt,
    },
  });

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const certificateUrl = `${siteUrl.replace(/\/$/, "")}/certificate/${serialNumber}`;

  if (email) {
    const config = await prisma.siteConfig.findUnique({ where: { id: 1 } });
    try {
      await sendCertificateEmail({
        to: email,
        recipientName: parsed.data.recipientName,
        courseTitle: course.title,
        studioName: config?.studioName ?? "Mehndi Studio",
        serialNumber,
        certificateUrl,
      });
    } catch (error) {
      console.error("Certificate saved but email failed", error);
    }
  }

  revalidatePath("/admin/certificates");
  return {
    status: "success",
    message: email
      ? `Certificate ${serialNumber} issued and emailed.`
      : `Certificate ${serialNumber} issued.`,
  };
}

export async function deleteCertificate(id: string): Promise<FormState> {
  await requireAdmin();
  await prisma.certificate.delete({ where: { id } });
  revalidatePath("/admin/certificates");
  return { status: "success", message: "Certificate removed." };
}

export async function emailCertificate(id: string): Promise<FormState> {
  await requireAdmin();
  const certificate = await prisma.certificate.findUnique({
    where: { id },
    include: { course: { select: { title: true } } },
  });
  if (!certificate) return { status: "error", message: "Certificate not found." };
  if (!certificate.recipientEmail) {
    return { status: "error", message: "This certificate has no email address." };
  }

  const config = await prisma.siteConfig.findUnique({ where: { id: 1 } });
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  await sendCertificateEmail({
    to: certificate.recipientEmail,
    recipientName: certificate.recipientName,
    courseTitle: certificate.course.title,
    studioName: config?.studioName ?? "Mehndi Studio",
    serialNumber: certificate.serialNumber,
    certificateUrl: `${siteUrl.replace(/\/$/, "")}/certificate/${certificate.serialNumber}`,
  });

  return { status: "success", message: "Certificate emailed." };
}
