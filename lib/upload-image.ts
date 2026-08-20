import { compressImageForUpload } from "@/lib/compress-image";

export async function uploadImageToCloudinary(
  file: File,
  folder: "designs" | "hero" = "designs"
) {
  const prepared = await compressImageForUpload(file);
  const body = new FormData();
  body.append("file", prepared);
  body.append("folder", folder);

  const res = await fetch("/api/admin/upload", {
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
