"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/guard";
import { leadStatusSchema } from "@/lib/validations/admin";

export async function updateLeadStatus(
  id: string,
  status: string
): Promise<{ ok: boolean }> {
  await requireAdmin();

  const parsed = leadStatusSchema.safeParse(status);
  if (!parsed.success) return { ok: false };

  await prisma.lead.update({ where: { id }, data: { status: parsed.data } });
  return { ok: true };
}

export async function deleteLead(id: string): Promise<{ ok: boolean }> {
  await requireAdmin();
  await prisma.lead.delete({ where: { id } });
  revalidatePath("/admin/leads");
  return { ok: true };
}
