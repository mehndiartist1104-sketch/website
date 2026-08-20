"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/guard";
import { createUploadSignature, deleteCloudinaryAsset } from "@/lib/cloudinary";
import { designSchema } from "@/lib/validations/admin";
import type { FormState } from "@/lib/validations/lead";
import type { DesignCategory } from "@/lib/types";

function revalidateDesignPaths(category?: DesignCategory) {
  revalidatePath("/");
  revalidatePath("/gallery");
  if (category) {
    revalidatePath(`/gallery/${category.toLowerCase()}`);
  }
}

export async function getCloudinaryUploadSignature(
  folder: "designs" | "hero" = "designs"
) {
  await requireAdmin();
  return createUploadSignature(
    folder === "hero" ? "mehndi-studio/hero" : "mehndi-studio/designs"
  );
}

export async function createDesign(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  await requireAdmin();

  const parsed = designSchema.safeParse({
    title: formData.get("title"),
    category: formData.get("category"),
    imageUrl: formData.get("imageUrl"),
    cloudinaryPublicId: formData.get("cloudinaryPublicId"),
    isFeatured: formData.get("isFeatured") === "on",
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please fix the errors below.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const maxOrder = await prisma.design.aggregate({ _max: { sortOrder: true } });
  await prisma.design.create({
    data: { ...parsed.data, sortOrder: (maxOrder._max.sortOrder ?? 0) + 1 },
  });

  revalidateDesignPaths(parsed.data.category);
  return { status: "success", message: "Design added." };
}

export async function createDesigns(
  items: Array<{
    title: string;
    category: string;
    imageUrl: string;
    cloudinaryPublicId: string;
  }>
): Promise<FormState> {
  await requireAdmin();

  const parsed = z
    .array(designSchema)
    .min(1, "Choose at least one photo")
    .max(24, "Upload up to 24 photos at a time")
    .safeParse(items.map((item) => ({ ...item, isFeatured: false })));

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Please fix the errors below.",
    };
  }

  const maxOrder = await prisma.design.aggregate({ _max: { sortOrder: true } });
  const start = maxOrder._max.sortOrder ?? 0;

  await prisma.design.createMany({
    data: parsed.data.map((item, index) => ({
      ...item,
      sortOrder: start + index + 1,
    })),
  });

  const categories = [...new Set(parsed.data.map((item) => item.category))];
  for (const category of categories) {
    revalidateDesignPaths(category);
  }

  return {
    status: "success",
    message:
      parsed.data.length === 1
        ? "Photo added."
        : `${parsed.data.length} photos added.`,
  };
}

export async function updateDesign(
  id: string,
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  await requireAdmin();

  const parsed = designSchema.safeParse({
    title: formData.get("title"),
    category: formData.get("category"),
    imageUrl: formData.get("imageUrl"),
    cloudinaryPublicId: formData.get("cloudinaryPublicId"),
    isFeatured: formData.get("isFeatured") === "on",
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please fix the errors below.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const existing = await prisma.design.findUnique({ where: { id } });
  if (!existing) return { status: "error", message: "Design not found." };

  await prisma.design.update({ where: { id }, data: parsed.data });

  if (existing.cloudinaryPublicId !== parsed.data.cloudinaryPublicId) {
    try {
      await deleteCloudinaryAsset(existing.cloudinaryPublicId);
    } catch (error) {
      console.error("Failed to delete replaced Cloudinary asset", error);
    }
  }

  revalidateDesignPaths(existing.category);
  if (parsed.data.category !== existing.category) {
    revalidateDesignPaths(parsed.data.category);
  }
  return { status: "success", message: "Design updated." };
}

export async function deleteDesign(id: string): Promise<FormState> {
  await requireAdmin();

  const design = await prisma.design.findUnique({ where: { id } });
  if (!design) return { status: "error", message: "Design not found." };

  await prisma.design.delete({ where: { id } });

  try {
    await deleteCloudinaryAsset(design.cloudinaryPublicId);
  } catch (error) {
    console.error("Design row deleted but Cloudinary asset removal failed", error);
  }

  revalidateDesignPaths(design.category);
  return { status: "success", message: "Design deleted." };
}

export async function toggleDesignFeatured(id: string): Promise<void> {
  await requireAdmin();

  const design = await prisma.design.findUnique({ where: { id } });
  if (!design) return;

  await prisma.design.update({
    where: { id },
    data: { isFeatured: !design.isFeatured },
  });

  revalidateDesignPaths(design.category);
}

export async function reorderDesigns(orderedIds: string[]): Promise<void> {
  await requireAdmin();

  await prisma.$transaction(
    orderedIds.map((id, index) =>
      prisma.design.update({ where: { id }, data: { sortOrder: index + 1 } })
    )
  );

  revalidateDesignPaths();
}
