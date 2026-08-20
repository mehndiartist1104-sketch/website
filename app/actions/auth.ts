"use server";

import { AuthError } from "next-auth";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { signIn, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import { setupSchema } from "@/lib/validations/auth";
import type { FormState } from "@/lib/validations/lead";

export async function completeSetup(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const alreadyDone = await prisma.systemFlag.findUnique({
    where: { key: "onboarding_complete" },
  });
  if (alreadyDone?.value) {
    redirect("/admin/login");
  }

  const parsed = setupSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please fix the errors below.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);

  try {
    await prisma.$transaction(async (tx) => {
      const adminCount = await tx.admin.count();
      if (adminCount > 0) {
        throw new Error("An admin account already exists");
      }
      await tx.admin.create({
        data: { email: parsed.data.email, passwordHash },
      });
      await tx.systemFlag.upsert({
        where: { key: "onboarding_complete" },
        update: { value: true },
        create: { key: "onboarding_complete", value: true },
      });
    });
  } catch (error) {
    console.error("Setup failed", error);
    return {
      status: "error",
      message: "Setup could not be completed. Please try again.",
    };
  }

  redirect("/admin/login");
}

export async function authenticate(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/admin/dashboard",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        status: "error",
        message:
          "Invalid credentials, or the account is temporarily locked after too many attempts.",
      };
    }
    throw error;
  }
  return { status: "success" };
}

export async function signOutAction() {
  await signOut({ redirectTo: "/admin/login" });
}
