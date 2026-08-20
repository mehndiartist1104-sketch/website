"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { notifyAdminOfLead } from "@/lib/resend";
import {
  leadSchema,
  reviewSchema,
  type FormState,
} from "@/lib/validations/lead";

export async function submitLead(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const parsed = leadSchema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone"),
    email: formData.get("email") ?? "",
    message: formData.get("message") ?? "",
    courseId: formData.get("courseId") ?? "",
    source: formData.get("source") ?? "CONTACT_FORM",
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please fix the errors below.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const { name, phone, email, message, courseId, source } = parsed.data;

  let courseTitle: string | null = null;
  try {
    if (courseId) {
      const course = await prisma.course.findUnique({
        where: { id: courseId },
        select: { id: true, title: true },
      });
      if (!course) {
        return { status: "error", message: "That course is no longer available." };
      }
      courseTitle = course.title;
    }

    await prisma.lead.create({
      data: {
        name,
        phone,
        email: email || null,
        message: message || null,
        courseId: courseId || null,
        source,
      },
    });
  } catch (error) {
    console.error("Failed to create lead", error);
    return {
      status: "error",
      message: "Something went wrong on our side. Please try again or call us directly.",
    };
  }

  try {
    await notifyAdminOfLead({ name, phone, email: email || null, message: message || null, source, courseTitle });
  } catch (error) {
    console.error("Lead created but notification email failed", error);
  }

  redirect("/thank-you");
}

export async function submitReview(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const parsed = reviewSchema.safeParse({
    name: formData.get("name"),
    rating: formData.get("rating"),
    message: String(formData.get("message") ?? ""),
    imageUrls: formData.getAll("imageUrls").filter(Boolean),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please fix the errors below.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  try {
    await prisma.review.create({ data: parsed.data });
  } catch (error) {
    console.error("Failed to create review", error);
    return {
      status: "error",
      message: "Something went wrong on our side. Please try again later.",
    };
  }

  return {
    status: "success",
    message: "Thank you! Your review has been submitted and will appear after moderation.",
  };
}
