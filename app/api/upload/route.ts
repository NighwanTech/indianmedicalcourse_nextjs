import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { storageProvider } from "@/services/storage/LocalStorageProvider";

export const dynamic = "force-dynamic";

/**
 * POST /api/upload
 * Accepts base64 data URL (JSON) or raw file (FormData),
 * saves to public/uploads/ via LocalStorageProvider,
 * and creates a MediaFile record in the DB.
 * Returns { url, mediaFileId, fileName, size }
 */
export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") || "";

    let fileBuffer: Buffer;
    let mimeType = "image/webp";
    let originalName = "upload.webp";
    let folderSlug: string | undefined;

    if (contentType.includes("application/json")) {
      const body = await request.json();
      const { dataUrl, fileName, folder } = body as {
        dataUrl: string;
        fileName?: string;
        folder?: string;
      };

      if (!dataUrl || !dataUrl.startsWith("data:")) {
        return NextResponse.json({ error: "Invalid data URL" }, { status: 400 });
      }

      const matches = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
      if (!matches) {
        return NextResponse.json({ error: "Could not parse data URL" }, { status: 400 });
      }

      mimeType = matches[1];
      const base64Data = matches[2];
      fileBuffer = Buffer.from(base64Data, "base64");
      if (fileName) originalName = fileName;
      if (folder) folderSlug = folder;
    } else if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("file") as File | null;
      folderSlug = (formData.get("folder") as string) || undefined;

      if (!file) {
        return NextResponse.json({ error: "No file provided" }, { status: 400 });
      }

      const arrayBuffer = await file.arrayBuffer();
      fileBuffer = Buffer.from(arrayBuffer);
      mimeType = file.type || "image/webp";
      originalName = file.name || "upload.webp";
    } else {
      return NextResponse.json({ error: "Unsupported content type" }, { status: 400 });
    }

    // Save file to disk via LocalStorageProvider
    const uploadResult = await storageProvider.uploadFile(
      fileBuffer,
      originalName,
      mimeType,
      folderSlug
    );

    // Determine MediaType from mimeType
    let fileType: "IMAGE" | "VIDEO" | "PDF" | "DOCUMENT" = "IMAGE";
    if (mimeType.includes("pdf")) fileType = "PDF";
    else if (mimeType.includes("video")) fileType = "VIDEO";
    else if (!mimeType.includes("image")) fileType = "DOCUMENT";

    // Save MediaFile record to DB
    let mediaFileId: number | null = null;
    try {
      const mediaFile = await prisma.mediaFile.create({
        data: {
          originalName,
          fileName: uploadResult.fileName,
          fileType,
          mimeType,
          fileSizeBytes: BigInt(uploadResult.fileSizeBytes),
          storageProvider: "LOCAL",
          storagePath: uploadResult.storagePath,
          width: uploadResult.width || null,
          height: uploadResult.height || null,
        },
      });
      mediaFileId = mediaFile.id;
    } catch (dbError) {
      console.warn("Could not save MediaFile to DB (file is saved on disk):", dbError);
    }

    const sizeKB = Math.round(fileBuffer.length / 1024);
    const sizeFormatted = sizeKB > 1024 ? `${(sizeKB / 1024).toFixed(1)} MB` : `${sizeKB} KB`;

    return NextResponse.json({
      success: true,
      url: uploadResult.storagePath,
      mediaFileId,
      fileName: uploadResult.fileName,
      size: sizeFormatted,
    });
  } catch (error) {
    console.error("Upload API error:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}
