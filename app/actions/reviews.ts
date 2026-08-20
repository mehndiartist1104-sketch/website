"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/guard";
import { reviewEditSchema } from "@/lib/validations/admin";
import type { FormState } from "@/lib/validations/lead";

export async function approveReview(id: string): Promise<void> {
  await requireAdmin();
  await prisma.review.update({ where: { id }, data: { isApproved: true } });
  revalidatePath("/");
  revalidatePath("/reviews");
}

export async function rejectReview(id: string): Promise<void> {
  await requireAdmin();
  await prisma.review.delete({ where: { id } });
  revalidatePath("/reviews");
}

export async function updateReview(
  id: string,
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  await requireAdmin();

  const parsed = reviewEditSchema.safeParse({
    name: formData.get("name"),
    rating: formData.get("rating"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please fix the errors below.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  await prisma.review.update({ where: { id }, data: parsed.data });
  revalidatePath("/");
  revalidatePath("/reviews");
  return { status: "success", message: "Review updated." };
}
