import { NextResponse } from "next/server";
import { REVIEW_UPLOAD_FOLDER, uploadImageBuffer } from "@/lib/cloudinary";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "Choose an image to upload." }, { status: 400 });
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Please upload a photo." }, { status: 400 });
  }

  if (file.size > 8 * 1024 * 1024) {
    return NextResponse.json(
      { error: "This photo is still too large after resize. Try another image." },
      { status: 413 }
    );
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const uploaded = await uploadImageBuffer(buffer, REVIEW_UPLOAD_FOLDER);
    return NextResponse.json(uploaded);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Cloudinary upload failed.";
    console.error("Review image upload failed", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
