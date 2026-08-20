import { v2 as cloudinary } from "cloudinary";

export const UPLOAD_FOLDER = "mehndi-studio/designs";
export const HERO_UPLOAD_FOLDER = "mehndi-studio/hero";

function configure() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Cloudinary environment variables are not set");
  }
  cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret });
  return { cloudName, apiKey, apiSecret };
}

export function createUploadSignature(folder = UPLOAD_FOLDER) {
  const { cloudName, apiKey, apiSecret } = configure();
  const timestamp = Math.round(Date.now() / 1000);
  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder },
    apiSecret
  );
  return { timestamp, signature, apiKey, cloudName, folder };
}

export async function deleteCloudinaryAsset(publicId: string) {
  configure();
  const result = await cloudinary.uploader.destroy(publicId);
  if (result.result !== "ok" && result.result !== "not found") {
    throw new Error(`Cloudinary deletion failed: ${result.result}`);
  }
}
