import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { GaneshaMark } from "@/components/brand/ganesha-mark";
import { prisma } from "@/lib/prisma";
import { SetupForm } from "@/components/admin/setup-form";

export const metadata: Metadata = {
  title: "Admin Setup",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminSetupPage() {
  const flag = await prisma.systemFlag.findUnique({
    where: { key: "onboarding_complete" },
  });
  const adminCount = await prisma.admin.count();

  if (flag?.value || adminCount > 0) {
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-background px-4 py-16">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-sm">
        <div className="mb-8 text-center">
          <GaneshaMark className="mx-auto h-8 w-8 text-terracotta" />
          <h1 className="mt-4 font-heading text-3xl font-semibold text-primary">
            One-time setup
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Create the admin account for this studio. This page locks permanently
            after setup.
          </p>
        </div>
        <SetupForm />
      </div>
    </div>
  );
}
