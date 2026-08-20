import fs from "fs";
import path from "path";
import { IStorageProvider, UploadResult } from "./IStorageProvider";

export class LocalStorageProvider implements IStorageProvider {
  private uploadDir: string;

  constructor() {
    this.uploadDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async uploadFile(
    fileBuffer: Buffer,
    originalName: string,
    mimeType: string,
    folderSlug?: string
  ): Promise<UploadResult> {
    const targetFolder = folderSlug
      ? path.join(this.uploadDir, folderSlug)
      : this.uploadDir;

    if (!fs.existsSync(targetFolder)) {
      fs.mkdirSync(targetFolder, { recursive: true });
    }

    const timestamp = Date.now();
    const sanitizedName = originalName.replace(/[^a-zA-Z0-9.-]/g, "_");
    const fileName = `${timestamp}_${sanitizedName}`;
    const filePath = path.join(targetFolder, fileName);

    await fs.promises.writeFile(filePath, fileBuffer);

    const relativeStoragePath = folderSlug
      ? `/uploads/${folderSlug}/${fileName}`
      : `/uploads/${fileName}`;

    return {
      fileName,
      storagePath: relativeStoragePath,
      mimeType,
      fileSizeBytes: fileBuffer.length,
    };
  }

  async deleteFile(storagePath: string): Promise<boolean> {
    try {
      const fullPath = path.join(process.cwd(), "public", storagePath);
      if (fs.existsSync(fullPath)) {
        await fs.promises.unlink(fullPath);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  getPublicUrl(storagePath: string): string {
    return storagePath.startsWith("/") ? storagePath : `/${storagePath}`;
  }
}

export const storageProvider: IStorageProvider = new LocalStorageProvider();
