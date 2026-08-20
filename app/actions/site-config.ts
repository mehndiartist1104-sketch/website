"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/guard";
import { siteConfigSchema } from "@/lib/validations/admin";
import type { FormState } from "@/lib/validations/lead";

export async function updateSiteConfig(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  await requireAdmin();

  const parsed = siteConfigSchema.safeParse({
    studioName: formData.get("studioName"),
    tagline: formData.get("tagline"),
    phone: formData.get("phone"),
    whatsappNumber: formData.get("whatsappNumber"),
    instagramUrl: formData.get("instagramUrl"),
    address: formData.get("address"),
    heroHeadline: formData.get("heroHeadline"),
    showPhone: formData.get("showPhone"),
    showWhatsApp: formData.get("showWhatsApp"),
    heroImageUrls: formData
      .getAll("heroImageUrls")
      .map((value) => String(value).trim())
      .filter(Boolean),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please fix the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const heroImageUrls = parsed.data.heroImageUrls;
  const rest = {
    studioName: parsed.data.studioName,
    tagline: parsed.data.tagline,
    phone: parsed.data.phone,
    whatsappNumber: parsed.data.whatsappNumber,
    instagramUrl: parsed.data.instagramUrl,
    address: parsed.data.address,
    heroHeadline: parsed.data.heroHeadline,
    showPhone: parsed.data.showPhone,
    showWhatsApp: parsed.data.showWhatsApp,
  };

  await prisma.siteConfig.upsert({
    where: { id: 1 },
    update: {
      ...rest,
      heroImageUrl: heroImageUrls[0],
      heroImageUrls,
    },
    create: {
      id: 1,
      ...rest,
      heroImageUrl: heroImageUrls[0],
      heroImageUrls,
    },
  });

  revalidatePath("/", "layout");
  revalidatePath("/admin/settings");
  return { status: "success", message: "Settings saved." };
}
