import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Flower2 } from "lucide-react";
import { auth } from "@/auth";
import { LoginForm } from "@/components/admin/login-form";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  const session = await auth();
  if (session?.user) {
    redirect("/admin/dashboard");
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-background px-4 py-16">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-sm">
        <div className="mb-8 text-center">
          <Flower2 className="mx-auto h-8 w-8 text-terracotta" aria-hidden />
          <h1 className="mt-4 font-heading text-3xl font-semibold text-primary">
            Studio admin
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to manage content and leads.
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
