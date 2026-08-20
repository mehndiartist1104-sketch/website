import { getCloudinaryUploadSignature } from "@/app/actions/designs";

export async function uploadImageToCloudinary(
  file: File,
  folder: "designs" | "hero" = "designs"
) {
  const sig = await getCloudinaryUploadSignature(folder);
  const body = new FormData();
  body.append("file", file);
  body.append("api_key", sig.apiKey);
  body.append("timestamp", String(sig.timestamp));
  body.append("signature", sig.signature);
  body.append("folder", sig.folder);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`,
    { method: "POST", body }
  );
  if (!res.ok) throw new Error("Image upload failed");
  const json = (await res.json()) as { secure_url: string; public_id: string };
  return { imageUrl: json.secure_url, cloudinaryPublicId: json.public_id };
}
