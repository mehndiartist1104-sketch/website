const MAX_EDGE = 1920;
const QUALITY = 0.82;

export async function compressImageForUpload(file: File): Promise<File> {
  const isImage =
    file.type.startsWith("image/") || /\.(heic|heif|jpe?g|png|webp)$/i.test(file.name);
  if (!isImage) {
    throw new Error("Please choose a photo (JPG, PNG, or WebP).");
  }
  if (file.type === "image/gif") return file;

  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", QUALITY)
    );
    if (!blob) return file;

    const compressed = new File([blob], replaceExtension(file.name, "jpg"), {
      type: "image/jpeg",
      lastModified: Date.now(),
    });
    return compressed.size < file.size || !file.type.includes("jpeg")
      ? compressed
      : file;
  } catch {
    if (file.size > 8 * 1024 * 1024) {
      throw new Error("This photo is too large. Try a smaller image.");
    }
    return file;
  }
}

function replaceExtension(name: string, ext: string) {
  return name.replace(/\.[^.]+$/, "") + `.${ext}`;
}
