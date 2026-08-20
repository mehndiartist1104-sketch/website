import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { SettingsForm } from "@/components/admin/settings-form";

export const metadata: Metadata = { title: "Settings" };

export default async function AdminSettingsPage() {
  const config = await prisma.siteConfig.findUnique({ where: { id: 1 } });

  if (!config) {
    return (
      <div className="mx-auto max-w-2xl">
        <h1 className="font-heading text-3xl font-semibold text-primary">Settings</h1>
        <p className="mt-4 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
          Site configuration is missing — run the database seed to create it.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-heading text-3xl font-semibold text-primary">Settings</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        These values power the public site — contact details, hero content, and
        social links. Use the Phone and WhatsApp toggles to choose which buttons
        appear publicly. Saving updates the live site immediately.
      </p>
      <div className="mt-8 rounded-2xl border border-border bg-card p-6 sm:p-8">
        <SettingsForm config={config} />
      </div>
    </div>
  );
}
