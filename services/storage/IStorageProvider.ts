export interface UploadResult {
  fileName: string;
  storagePath: string;
  mimeType: string;
  fileSizeBytes: number;
  webpPath?: string;
  thumbnailPath?: string;
  width?: number;
  height?: number;
}

export interface IStorageProvider {
  uploadFile(
    fileBuffer: Buffer,
    originalName: string,
    mimeType: string,
    folderSlug?: string
  ): Promise<UploadResult>;
  deleteFile(storagePath: string): Promise<boolean>;
  getPublicUrl(storagePath: string): string;
}
