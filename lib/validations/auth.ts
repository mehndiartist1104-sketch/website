import { z } from "zod";

export const setupSchema = z.object({
  email: z.string().trim().email("Enter a valid email").max(200),
  password: z
    .string()
    .min(10, "Password must be at least 10 characters")
    .max(100),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email"),
  password: z.string().min(1, "Enter your password"),
});
