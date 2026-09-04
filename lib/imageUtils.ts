/**
 * Image Utilities for IMC Admin & Public Pages
 * Provides client-side image compression to prevent browser localStorage quota issues
 * and provides curated medical course banner presets.
 */

export interface CompressionResult {
  dataUrl: string;
  sizeFormatted: string;
  width: number;
  height: number;
}

export interface ImageCompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  mimeType?: "image/webp" | "image/jpeg" | "image/png";
}

/**
 * Compresses an image File using HTML5 Canvas in the browser.
 * Reduces raw 2MB-10MB camera/stock images down to ~35KB-75KB.
 */
export async function compressImageFile(
  file: File,
  options: ImageCompressionOptions = {}
): Promise<CompressionResult> {
  const {
    maxWidth = 1200,
    maxHeight = 720,
    quality = 0.8,
    mimeType = "image/webp",
  } = options;

  // Non-images (e.g. PDFs or SVGs) are read directly without canvas processing
  if (!file.type.startsWith("image/") || file.type.includes("svg")) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        const sizeKB = Math.round(file.size / 1024);
        resolve({
          dataUrl,
          sizeFormatted: sizeKB > 1024 ? `${(sizeKB / 1024).toFixed(1)} MB` : `${sizeKB} KB`,
          width: 0,
          height: 0,
        });
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate aspect ratio preserving bounds
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");

        if (ctx) {
          // Improve image smoothing
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";
          ctx.drawImage(img, 0, 0, width, height);

          // Try preferred WebP or fallback to JPEG
          let dataUrl = canvas.toDataURL(mimeType, quality);
          if (!dataUrl.startsWith(`data:${mimeType}`)) {
            dataUrl = canvas.toDataURL("image/jpeg", quality);
          }

          const sizeBytes = Math.round((dataUrl.length * 3) / 4);
          const sizeKB = Math.round(sizeBytes / 1024);
          const sizeFormatted = sizeKB > 1024 ? `${(sizeKB / 1024).toFixed(1)} MB` : `${sizeKB} KB`;

          resolve({
            dataUrl,
            sizeFormatted,
            width,
            height,
          });
        } else {
          // Canvas fallback
          const rawUrl = e.target?.result as string;
          resolve({
            dataUrl: rawUrl,
            sizeFormatted: `${Math.round(file.size / 1024)} KB`,
            width: img.width,
            height: img.height,
          });
        }
      };

      img.onerror = () => {
        const rawUrl = e.target?.result as string;
        resolve({
          dataUrl: rawUrl,
          sizeFormatted: `${Math.round(file.size / 1024)} KB`,
          width: 0,
          height: 0,
        });
      };

      img.src = e.target?.result as string;
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Fallback reliable medical banner image for broken links or placeholders
 */
export const DEFAULT_MEDICAL_BANNER =
  "https://images.unsplash.com/photo-1551076805-e1869033e561?w=800&auto=format&fit=crop&q=80";

/**
 * Curated high-resolution medical course banner presets
 * Grouped by medical specialty for quick 1-click selection in course management.
 */
export const MEDICAL_COURSE_PRESETS = [
  {
    title: "Cardiology & Cath Lab",
    category: "Cardiology",
    url: "https://images.unsplash.com/photo-1551076805-e1869033e561?w=800&auto=format&fit=crop&q=80",
  },
  {
    title: "Critical Care & ICU",
    category: "Critical Care",
    url: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&auto=format&fit=crop&q=80",
  },
  {
    title: "Surgery & Laparoscopy OT",
    category: "Surgery",
    url: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&auto=format&fit=crop&q=80",
  },
  {
    title: "Fetal Medicine & Ultrasound",
    category: "OB-GYN / Fetal",
    url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop&q=80",
  },
  {
    title: "Neonatology & NICU Care",
    category: "Pediatrics",
    url: "https://images.unsplash.com/photo-1579165466741-7f35e4755660?w=800&auto=format&fit=crop&q=80",
  },
  {
    title: "Clinical Dermatology & Pathology",
    category: "Dermatology",
    url: "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=800&auto=format&fit=crop&q=80",
  },
  {
    title: "Radiology & Diagnostic Imaging",
    category: "Radiology",
    url: "https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?w=800&auto=format&fit=crop&q=80",
  },
  {
    title: "Emergency Medicine & Trauma",
    category: "Emergency",
    url: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&auto=format&fit=crop&q=80",
  },
  {
    title: "Pediatrics & Child Health",
    category: "Pediatrics",
    url: "https://images.unsplash.com/photo-1583912267670-6575ad36248b?w=800&auto=format&fit=crop&q=80",
  },
  {
    title: "Orthopedics & Arthroscopy",
    category: "Orthopedics",
    url: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&auto=format&fit=crop&q=80",
  },
  {
    title: "Cosmetology & Aesthetic Medicine",
    category: "Aesthetics",
    url: "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=800&auto=format&fit=crop&q=80",
  },
  {
    title: "Family Medicine & General Practice",
    category: "Family Medicine",
    url: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&auto=format&fit=crop&q=80",
  },
];
