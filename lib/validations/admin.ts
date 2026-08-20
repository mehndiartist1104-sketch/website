import { z } from "zod";
import { toCategorySlug } from "@/lib/types";

export const designSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(120),
  category: z
    .string()
    .trim()
    .min(2, "Category is required")
    .max(40)
    .transform(toCategorySlug)
    .refine((value) => value.length >= 2, "Category is required"),
  imageUrl: z.string().url("Upload an image first"),
  cloudinaryPublicId: z.string().min(1),
  isFeatured: z.boolean(),
});

export const courseSchema = z.object({
  title: z.string().trim().min(3, "Title is required").max(150),
  description: z.string().trim().min(20, "Description is too short").max(2000),
  curriculumPoints: z
    .array(z.string().trim().min(2).max(200))
    .min(1, "Add at least one curriculum point")
    .max(12),
  durationLabel: z.string().trim().min(3, "e.g. 2 weeks · 8 sessions").max(60),
  price: z.coerce.number().int().min(0, "Price must be 0 or more"),
  offerPrice: z
    .union([z.literal(""), z.coerce.number().int().min(0)])
    .transform((v) => (v === "" ? null : v)),
  isActive: z.boolean(),
});

export const reviewEditSchema = z.object({
  name: z.string().trim().min(2).max(100),
  rating: z.coerce.number().int().min(1).max(5),
  message: z.string().trim().max(2000),
});

const imageSrcSchema = z
  .string()
  .trim()
  .min(1, "Upload an image or enter a URL")
  .max(500)
  .refine(
    (value) => /^https?:\/\//.test(value) || value.startsWith("/"),
    "Upload an image or enter a full URL"
  );

export const siteConfigSchema = z.object({
  studioName: z.string().trim().min(2, "Studio name is required").max(100),
  tagline: z.string().trim().min(5, "Tagline is required").max(200),
  phone: z.string().trim().min(7, "Phone is required").max(25),
  whatsappNumber: z.string().trim().min(7, "WhatsApp number is required").max(25),
  instagramUrl: z.string().trim().url("Enter a full URL").max(300),
  address: z.string().trim().min(5, "Address is required").max(300),
  heroImageUrls: z
    .array(imageSrcSchema)
    .min(1, "Add at least one hero image")
    .max(12, "You can add up to 12 hero images"),
  heroHeadline: z.string().trim().min(5, "Headline is required").max(150),
  showPhone: z
    .union([z.literal("true"), z.literal("false"), z.boolean()])
    .transform((value) => value === true || value === "true"),
  showWhatsApp: z
    .union([z.literal("true"), z.literal("false"), z.boolean()])
    .transform((value) => value === true || value === "true"),
});

export const leadStatusSchema = z.enum(["NEW", "CONTACTED", "ENROLLED", "CLOSED"]);

export const certificateSchema = z.object({
  recipientName: z.string().trim().min(2, "Student name is required").max(120),
  recipientEmail: z
    .string()
    .trim()
    .email("Enter a valid email")
    .max(200)
    .optional()
    .or(z.literal("")),
  courseId: z.string().trim().min(1, "Select a course"),
  completedAt: z.string().trim().min(1, "Completion date is required"),
});

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
