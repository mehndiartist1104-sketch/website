import { z } from "zod";

export const leadSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100),
  phone: z
    .string()
    .trim()
    .regex(/^[+\d][\d\s-]{7,15}$/, "Please enter a valid phone number"),
  email: z
    .string()
    .trim()
    .email("Please enter a valid email")
    .max(200)
    .optional()
    .or(z.literal("")),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
  courseId: z.string().trim().max(50).optional().or(z.literal("")),
  source: z.enum(["CONTACT_FORM", "COURSE_ENQUIRY"]),
});

export type LeadInput = z.infer<typeof leadSchema>;

export const reviewSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100),
  rating: z.coerce.number().int().min(1, "Please select a rating").max(5),
  message: z
    .string()
    .trim()
    .min(10, "Please write at least a sentence")
    .max(2000),
  imageUrls: z
    .array(z.string().url())
    .max(6, "You can add up to 6 photos")
    .optional()
    .default([]),
});

export type ReviewInput = z.infer<typeof reviewSchema>;

export interface FormState {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Record<string, string[]>;
}

export const initialFormState: FormState = { status: "idle" };
