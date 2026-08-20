"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/guard";
import { courseSchema, slugify } from "@/lib/validations/admin";
import type { FormState } from "@/lib/validations/lead";

function revalidateCoursePaths(slug?: string) {
  revalidatePath("/");
  revalidatePath("/courses");
  if (slug) {
    revalidatePath(`/courses/${slug}`);
  }
}

function parseCourseForm(formData: FormData) {
  const curriculumPoints = String(formData.get("curriculumPoints") ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return courseSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    curriculumPoints,
    durationLabel: formData.get("durationLabel"),
    price: formData.get("price"),
    offerPrice: formData.get("offerPrice") ?? "",
    isActive: formData.get("isActive") === "on",
  });
}

async function uniqueSlug(base: string, excludeId?: string): Promise<string> {
  const root = slugify(base) || "course";
  let candidate = root;
  let suffix = 2;
  while (true) {
    const existing = await prisma.course.findUnique({ where: { slug: candidate } });
    if (!existing || existing.id === excludeId) return candidate;
    candidate = `${root}-${suffix}`;
    suffix += 1;
  }
}

export async function createCourse(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  await requireAdmin();

  const parsed = parseCourseForm(formData);
  if (!parsed.success) {
    return {
      status: "error",
      message: "Please fix the errors below.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const slug = await uniqueSlug(parsed.data.title);
  await prisma.course.create({ data: { ...parsed.data, slug } });

  revalidateCoursePaths(slug);
  return { status: "success", message: "Course created." };
}

export async function updateCourse(
  id: string,
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  await requireAdmin();

  const parsed = parseCourseForm(formData);
  if (!parsed.success) {
    return {
      status: "error",
      message: "Please fix the errors below.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const existing = await prisma.course.findUnique({ where: { id } });
  if (!existing) return { status: "error", message: "Course not found." };

  const slug =
    slugify(parsed.data.title) === slugify(existing.title)
      ? existing.slug
      : await uniqueSlug(parsed.data.title, id);

  await prisma.course.update({ where: { id }, data: { ...parsed.data, slug } });

  revalidateCoursePaths(slug);
  if (existing.slug !== slug) revalidateCoursePaths(existing.slug);
  return { status: "success", message: "Course updated." };
}

export async function toggleCourseActive(id: string): Promise<void> {
  await requireAdmin();

  const course = await prisma.course.findUnique({ where: { id } });
  if (!course) return;

  await prisma.course.update({
    where: { id },
    data: { isActive: !course.isActive },
  });

  revalidateCoursePaths(course.slug);
}

export async function deleteCourse(id: string): Promise<FormState> {
  await requireAdmin();

  const course = await prisma.course.findUnique({ where: { id } });
  if (!course) return { status: "error", message: "Course not found." };

  await prisma.course.delete({ where: { id } });

  revalidateCoursePaths(course.slug);
  return { status: "success", message: "Course deleted." };
}
