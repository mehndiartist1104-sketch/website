import { auth } from "@/auth";
import { NextResponse } from "next/server";
import {
  HERO_UPLOAD_FOLDER,
  UPLOAD_FOLDER,
  uploadImageBuffer,
} from "@/lib/cloudinary";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json(
      { error: "Please sign in again, then retry the upload." },
      { status: 401 }
    );
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const folderKey = formData.get("folder");
  const folder = folderKey === "hero" ? HERO_UPLOAD_FOLDER : UPLOAD_FOLDER;

  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "Choose an image to upload." }, { status: 400 });
  }

  if (file.size > 8 * 1024 * 1024) {
    return NextResponse.json(
      { error: "This photo is still too large after resize. Try another image." },
      { status: 413 }
    );
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const uploaded = await uploadImageBuffer(buffer, folder);
    return NextResponse.json(uploaded);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Cloudinary upload failed.";
    console.error("Image upload failed", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
