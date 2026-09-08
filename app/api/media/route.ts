import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * GET /api/media
 * List media files from DB for the media library picker
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || ""; // IMAGE, VIDEO, PDF, etc.
    const search = searchParams.get("search") || "";
    const limit = parseInt(searchParams.get("limit") || "100", 10);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};
    if (type) {
      where.fileType = type;
    }
    if (search) {
      where.OR = [
        { originalName: { contains: search } },
        { fileName: { contains: search } },
        { altText: { contains: search } },
      ];
    }

    const mediaFiles = await prisma.mediaFile.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
      select: {
        id: true,
        originalName: true,
        fileName: true,
        fileType: true,
        mimeType: true,
        fileSizeBytes: true,
        storagePath: true,
        altText: true,
        width: true,
        height: true,
        createdAt: true,
      },
    });

    const transformed = mediaFiles.map((m) => ({
      id: m.id,
      fileName: m.originalName || m.fileName,
      fileType: m.fileType,
      url: m.storagePath,
      mimeType: m.mimeType,
      fileSize: formatBytes(Number(m.fileSizeBytes)),
      altText: m.altText,
      width: m.width,
      height: m.height,
      createdAt: m.createdAt,
    }));

    return NextResponse.json({ media: transformed });
  } catch (error) {
    console.error("GET /api/media error:", error);
    return NextResponse.json({ media: [] });
  }
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const kb = bytes / 1024;
  if (kb < 1024) return `${Math.round(kb)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}
