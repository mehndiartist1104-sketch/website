import { v2 as cloudinary } from "cloudinary";

export const UPLOAD_FOLDER = "mehndi-studio/designs";
export const HERO_UPLOAD_FOLDER = "mehndi-studio/hero";
export const REVIEW_UPLOAD_FOLDER = "mehndi-studio/reviews";

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

export async function uploadImageBuffer(buffer: Buffer, folder: string) {
  configure();
  return new Promise<{ imageUrl: string; cloudinaryPublicId: string }>(
    (resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder, resource_type: "image" },
        (error, result) => {
          if (error || !result?.secure_url || !result.public_id) {
            reject(new Error(error?.message ?? "Cloudinary upload failed"));
            return;
          }
          resolve({
            imageUrl: result.secure_url,
            cloudinaryPublicId: result.public_id,
          });
        }
      );
      stream.end(buffer);
    }
  );
}
