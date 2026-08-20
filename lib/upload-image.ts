import { compressImageForUpload } from "@/lib/compress-image";

export async function uploadImageToCloudinary(
  file: File,
  folder: "designs" | "hero" | "reviews" = "designs"
) {
  const prepared = await compressImageForUpload(file);
  const body = new FormData();
  body.append("file", prepared);
  body.append("folder", folder);

  const endpoint =
    folder === "reviews" ? "/api/reviews/upload" : "/api/admin/upload";

  const res = await fetch(endpoint, {
    method: "POST",
    body,
  });

  const json = (await res.json().catch(() => ({}))) as {
    imageUrl?: string;
    cloudinaryPublicId?: string;
    error?: string;
  };

  if (!res.ok || !json.imageUrl || !json.cloudinaryPublicId) {
    throw new Error(json.error ?? "Image upload failed. Try another photo.");
  }

  return {
    imageUrl: json.imageUrl,
    cloudinaryPublicId: json.cloudinaryPublicId,
  };
}
