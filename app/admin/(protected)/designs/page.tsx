import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { DesignsManager } from "@/components/admin/designs-manager";

export const metadata: Metadata = { title: "Designs" };

export default async function AdminDesignsPage() {
  const designs = await prisma.design.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="font-heading text-3xl font-semibold text-primary">Designs</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Manage the public gallery — uploads go straight to Cloudinary.
      </p>
      <div className="mt-8">
        <DesignsManager initialDesigns={designs} />
      </div>
    </div>
  );
}
