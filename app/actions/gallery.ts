"use server";

import { getDesigns } from "@/lib/data";
import type { DesignItem } from "@/lib/types";

export async function fetchDesignsPage(options: {
  category?: string;
  offset: number;
  limit: number;
}): Promise<{ designs: DesignItem[]; total: number }> {
  return getDesigns(options);
}
