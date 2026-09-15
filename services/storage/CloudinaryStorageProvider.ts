import { v2 as cloudinary } from "cloudinary";
import { IStorageProvider, UploadResult } from "./IStorageProvider";

// Configure Cloudinary from environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "uvu7gxfi",
  api_key: process.env.CLOUDINARY_API_KEY || "141888358155938",
  api_secret: process.env.CLOUDINARY_API_SECRET || "NO_b0WJxBSqRpHU9J7hLaUq6SRo",
  secure: true,
});

export class CloudinaryStorageProvider implements IStorageProvider {
  async uploadFile(
    fileBuffer: Buffer,
    originalName: string,
    mimeType: string,
    folderSlug?: string
  ): Promise<UploadResult> {
    const folder = folderSlug ? `imc/${folderSlug}` : "imc";
    const sanitizedName = originalName.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9_-]/g, "_");
    const publicId = `${Date.now()}_${sanitizedName}`;

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          public_id: publicId,
          resource_type: "auto",
        },
        (error, result) => {
          if (error || !result) {
            console.error("[Cloudinary Error]", error);
            return reject(error || new Error("Failed to upload image to Cloudinary"));
          }

          resolve({
            fileName: `${result.public_id}.${result.format || "webp"}`,
            storagePath: result.secure_url,
            mimeType: mimeType || `image/${result.format || "webp"}`,
            fileSizeBytes: result.bytes || fileBuffer.length,
            width: result.width,
            height: result.height,
            webpPath: result.secure_url,
            thumbnailPath: result.secure_url,
          });
        }
      );

      uploadStream.end(fileBuffer);
    });
  }

  async deleteFile(storagePath: string): Promise<boolean> {
    try {
      const matches = storagePath.match(/\/v\d+\/(.+)\.[a-zA-Z0-9]+$/);
      const publicId = matches ? matches[1] : storagePath;
      const res = await cloudinary.uploader.destroy(publicId);
      return res.result === "ok";
    } catch (err) {
      console.error("[Cloudinary Delete Error]", err);
      return false;
    }
  }

  getPublicUrl(storagePath: string): string {
    return storagePath;
  }
}

export const cloudinaryStorageProvider = new CloudinaryStorageProvider();
