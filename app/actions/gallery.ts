"use server";

import { getDesigns } from "@/lib/data";
import type { DesignCategory, DesignItem } from "@/lib/types";

export async function fetchDesignsPage(options: {
  category?: DesignCategory;
  offset: number;
  limit: number;
}): Promise<{ designs: DesignItem[]; total: number }> {
  return getDesigns(options);
}
