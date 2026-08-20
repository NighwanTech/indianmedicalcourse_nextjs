"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  X, 
  Upload, 
  Search, 
  FileText, 
  Video, 
  Image as ImageIcon, 
  Check, 
  FileCheck,
  Folder,
  Sparkles,
  Link as LinkIcon,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

export interface MediaItem {
  id: number;
  fileName: string;
  fileType: "IMAGE" | "VIDEO" | "PDF" | "DOCUMENT" | "ICON";
  url: string;
  mimeType: string;
  fileSize: string;
}

interface MediaPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (media: MediaItem) => void;
  allowedTypes?: Array<"IMAGE" | "VIDEO" | "PDF" | "DOCUMENT" | "ICON">;
  title?: string;
}

const DEFAULT_LIBRARY: MediaItem[] = [
  {
    id: 101,
    fileName: "cardiology-cathlab-fellowship.webp",
    fileType: "IMAGE",
    url: "https://images.unsplash.com/photo-1551076805-e1869033e561?w=800&auto=format&fit=crop&q=80",
    mimeType: "image/webp",
    fileSize: "245 KB",
  },
  {
    id: 102,
    fileName: "icu-critical-care-bedside.webp",
    fileType: "IMAGE",
    url: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&auto=format&fit=crop&q=80",
    mimeType: "image/webp",
    fileSize: "310 KB",
  },
  {
    id: 103,
    fileName: "laparoscopy-ot-training.webp",
    fileType: "IMAGE",
    url: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&auto=format&fit=crop&q=80",
    mimeType: "image/webp",
    fileSize: "280 KB",
  },
  {
    id: 104,
    fileName: "Cardiology_Brochure_2026.pdf",
    fileType: "PDF",
    url: "/media/brochures/cardiology-2026.pdf",
    mimeType: "application/pdf",
    fileSize: "1.4 MB",
  },
  {
    id: 105,
    fileName: "Critical_Care_Curriculum_Syllabus.pdf",
    fileType: "PDF",
    url: "/media/syllabus/critical-care-2026.pdf",
    mimeType: "application/pdf",
    fileSize: "2.1 MB",
  },
  {
    id: 106,
    fileName: "Apollo_Hospitals_Logo.png",
    fileType: "IMAGE",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Apollo_Hospitals_Logo.svg/1200px-Apollo_Hospitals_Logo.svg.png",
    mimeType: "image/png",
    fileSize: "68 KB",
  },
  {
    id: 107,
    fileName: "Fortis_Healthcare_Logo.png",
    fileType: "IMAGE",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Fortis_Healthcare_Logo.svg/1200px-Fortis_Healthcare_Logo.svg.png",
    mimeType: "image/png",
    fileSize: "84 KB",
  },
  {
    id: 108,
    fileName: "Dr_Faculty_Mentor_Portrait.webp",
    fileType: "IMAGE",
    url: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=800&auto=format&fit=crop&q=80",
    mimeType: "image/webp",
    fileSize: "195 KB",
  },
];

export function MediaLibraryPickerModal({
  isOpen,
  onClose,
  onSelect,
  allowedTypes = ["IMAGE", "VIDEO", "PDF", "DOCUMENT", "ICON"],
  title = "Select from Media Library",
}: MediaPickerProps) {
  const [activeTab, setActiveTab] = useState<"library" | "upload" | "url">("library");
  const [library, setLibrary] = useState<MediaItem[]>(DEFAULT_LIBRARY);
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [customUrl, setCustomUrl] = useState("");
  const [uploadPreview, setUploadPreview] = useState<{
    file: File;
    previewUrl: string;
    sizeFormatted: string;
  } | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("imc_user_uploaded_media");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setLibrary([...parsed, ...DEFAULT_LIBRARY]);
          }
        }
      } catch (e) {
        // ignore
      }
    }
  }, []);

  if (!isOpen) return null;

  const filtered = library.filter((item) => {
    if (allowedTypes && !allowedTypes.includes(item.fileType)) return false;
    if (search && !item.fileName.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    processFile(file);
  };

  const processFile = (file: File) => {
    setUploadError(null);

    // Max 10MB
    if (file.size > 10 * 1024 * 1024) {
      setUploadError("File size exceeds 10MB limit. Please choose a smaller file.");
      return;
    }

    const sizeFormatted = file.size > 1024 * 1024 
      ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
      : `${Math.round(file.size / 1024)} KB`;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setUploadPreview({
          file,
          previewUrl: reader.result,
          sizeFormatted,
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleConfirmUpload = () => {
    if (!uploadPreview) return;
    setIsUploading(true);

    let fileType: "IMAGE" | "PDF" | "VIDEO" | "DOCUMENT" = "IMAGE";
    if (uploadPreview.file.type.includes("pdf")) fileType = "PDF";
    else if (uploadPreview.file.type.includes("video")) fileType = "VIDEO";
    else if (!uploadPreview.file.type.includes("image")) fileType = "DOCUMENT";

    const newItem: MediaItem = {
      id: Date.now(),
      fileName: uploadPreview.file.name,
      fileType,
      url: uploadPreview.previewUrl,
      mimeType: uploadPreview.file.type || "image/png",
      fileSize: uploadPreview.sizeFormatted,
    };

    // Save to local storage for persistence across all admin modules
    try {
      const existing = JSON.parse(localStorage.getItem("imc_user_uploaded_media") || "[]");
      localStorage.setItem("imc_user_uploaded_media", JSON.stringify([newItem, ...existing]));
    } catch (e) {
      console.warn("Storage full:", e);
    }

    setLibrary((prev) => [newItem, ...prev]);
    setSelectedId(newItem.id);
    setUploadPreview(null);
    setIsUploading(false);
    setActiveTab("library");
  };

  const handleConfirmSelect = () => {
    if (activeTab === "url" && customUrl.trim()) {
      onSelect({
        id: Date.now(),
        fileName: "External Media Asset",
        fileType: "IMAGE",
        url: customUrl.trim(),
        mimeType: "image/png",
        fileSize: "Web URL",
      });
      onClose();
      return;
    }

    if (uploadPreview) {
      // User is on upload tab with preview ready
      handleConfirmUpload();
      onSelect({
        id: Date.now(),
        fileName: uploadPreview.file.name,
        fileType: "IMAGE",
        url: uploadPreview.previewUrl,
        mimeType: uploadPreview.file.type || "image/png",
        fileSize: uploadPreview.sizeFormatted,
      });
      onClose();
      return;
    }

    const item = library.find((m) => m.id === selectedId);
    if (item) {
      onSelect(item);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 font-display">
              {title}
            </h3>
            <p className="text-xs text-slate-500">
              Select an existing asset or upload a new Image, Photo, PDF, or Doc.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="px-5 pt-3 border-b border-slate-200 flex items-center gap-3">
          <button
            onClick={() => setActiveTab("library")}
            className={`pb-2.5 text-xs font-bold transition-all border-b-2 cursor-pointer ${
              activeTab === "library"
                ? "border-[#0B4F9C] text-[#0B4F9C]"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Media Library ({filtered.length})
          </button>
          <button
            onClick={() => setActiveTab("upload")}
            className={`pb-2.5 text-xs font-bold transition-all border-b-2 cursor-pointer ${
              activeTab === "upload"
                ? "border-[#0B4F9C] text-[#0B4F9C]"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Upload New File from Device
          </button>
          <button
            onClick={() => setActiveTab("url")}
            className={`pb-2.5 text-xs font-bold transition-all border-b-2 cursor-pointer ${
              activeTab === "url"
                ? "border-[#0B4F9C] text-[#0B4F9C]"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            External URL
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 flex-1 overflow-y-auto">
          
          {/* TAB 1: LIBRARY */}
          {activeTab === "library" && (
            <div className="space-y-4">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search media files by name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-[#0B4F9C]"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {filtered.map((item) => {
                  const isSelected = selectedId === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedId(item.id)}
                      className={`group relative rounded-2xl border-2 overflow-hidden cursor-pointer transition-all ${
                        isSelected
                          ? "border-[#0B4F9C] bg-blue-50/50 shadow-md ring-2 ring-blue-500/20"
                          : "border-slate-200 hover:border-slate-300 bg-slate-50"
                      }`}
                    >
                      {item.fileType === "IMAGE" ? (
                        <div className="h-28 w-full bg-slate-100 p-1 flex items-center justify-center overflow-hidden">
                          <img
                            src={item.url}
                            alt={item.fileName}
                            className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform"
                          />
                        </div>
                      ) : item.fileType === "PDF" ? (
                        <div className="h-28 w-full bg-red-50 flex flex-col items-center justify-center text-red-600 p-2">
                          <FileText className="w-8 h-8 mb-1" />
                          <span className="text-[10px] font-bold uppercase">PDF Document</span>
                        </div>
                      ) : (
                        <div className="h-28 w-full bg-blue-50 flex flex-col items-center justify-center text-blue-600 p-2">
                          <Video className="w-8 h-8 mb-1" />
                          <span className="text-[10px] font-bold uppercase">Video File</span>
                        </div>
                      )}

                      <div className="p-2">
                        <div className="text-[11px] font-bold text-slate-800 truncate" title={item.fileName}>
                          {item.fileName}
                        </div>
                        <div className="text-[9px] text-slate-400 font-medium mt-0.5 flex justify-between">
                          <span>{item.fileType}</span>
                          <span>{item.fileSize}</span>
                        </div>
                      </div>

                      {isSelected && (
                        <div className="absolute top-2 right-2 w-5 h-5 bg-[#0B4F9C] text-white rounded-full flex items-center justify-center shadow">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {filtered.length === 0 && (
                <div className="text-center py-12 text-slate-400">
                  <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-xs font-bold text-slate-700">No media assets match your filter.</p>
                  <button
                    onClick={() => setActiveTab("upload")}
                    className="mt-2 text-xs font-bold text-blue-600 hover:underline cursor-pointer"
                  >
                    Upload a new file now
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: REAL FILE UPLOAD */}
          {activeTab === "upload" && (
            <div className="space-y-4">
              {uploadError && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-600 text-xs font-bold p-3 rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{uploadError}</span>
                </div>
              )}

              <input
                type="file"
                ref={fileInputRef}
                accept="image/png, image/jpeg, image/svg+xml, image/webp, application/pdf"
                onChange={handleFileChange}
                className="hidden"
              />

              {!uploadPreview ? (
                <div 
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 hover:border-[#0B4F9C] hover:bg-blue-50/30 rounded-3xl p-10 text-center bg-slate-50/80 transition-all flex flex-col items-center justify-center cursor-pointer group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-blue-100 text-[#0B4F9C] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-xs">
                    <Upload className="w-7 h-7" />
                  </div>
                  <h4 className="text-sm font-black text-slate-900">
                    Click to Select or Drag and Drop File from Device
                  </h4>
                  <p className="text-xs text-slate-500 max-w-sm mt-1 mb-4">
                    Supports PNG, JPG, SVG, WebP, and PDFs up to 10MB.
                  </p>
                  <button
                    type="button"
                    className="bg-[#0B4F9C] group-hover:bg-[#083E7D] text-white text-xs font-bold py-2.5 px-6 rounded-xl shadow-xs pointer-events-none"
                  >
                    Browse Local Files
                  </button>
                </div>
              ) : (
                /* Ready to attach preview */
                <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 text-center space-y-4">
                  <div className="w-32 h-32 mx-auto bg-white rounded-2xl border border-slate-200 p-2 flex items-center justify-center shadow-md overflow-hidden">
                    <img
                      src={uploadPreview.previewUrl}
                      alt="Uploaded File"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>

                  <div>
                    <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full mb-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Ready to Attach</span>
                    </div>
                    <h4 className="text-sm font-black text-slate-900 truncate max-w-md mx-auto">
                      {uploadPreview.file.name}
                    </h4>
                    <p className="text-xs text-slate-400">
                      {uploadPreview.sizeFormatted} • {uploadPreview.file.type}
                    </p>
                  </div>

                  <div className="flex items-center justify-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setUploadPreview(null)}
                      className="text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-4 py-2 rounded-xl cursor-pointer"
                    >
                      Choose Different File
                    </button>
                    <button
                      type="button"
                      onClick={handleConfirmUpload}
                      disabled={isUploading}
                      className="inline-flex items-center gap-1.5 bg-[#0B4F9C] hover:bg-[#083E7D] text-white text-xs font-bold py-2 px-5 rounded-xl shadow-xs cursor-pointer"
                    >
                      <span>Add to Media Library</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: EXTERNAL URL */}
          {activeTab === "url" && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Direct Image or Public Asset URL
                </label>
                <div className="relative">
                  <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    placeholder="https://example.com/logo-or-photo.png"
                    value={customUrl}
                    onChange={(e) => setCustomUrl(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-[#0B4F9C]"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Paste any direct online image URL.
                </p>
              </div>

              {customUrl && (
                <div className="p-3 bg-slate-100 rounded-2xl flex items-center gap-3">
                  <div className="w-16 h-16 bg-white rounded-xl border border-slate-200 p-1 flex items-center justify-center overflow-hidden">
                    <img
                      src={customUrl}
                      alt="URL Preview"
                      className="max-h-full max-w-full object-contain"
                      onError={(e) => {
                        (e.target as any).style.display = "none";
                      }}
                    />
                  </div>
                  <div className="text-xs text-slate-600 truncate flex-1">
                    <span className="font-bold text-slate-800">URL Preview Available</span>
                    <p className="text-[10px] text-slate-400 truncate">{customUrl}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={onClose}
            className="text-xs font-bold text-slate-600 hover:text-slate-900 px-4 py-2 cursor-pointer"
          >
            Cancel
          </button>
          <button
            disabled={!selectedId && (!customUrl || activeTab !== "url") && !uploadPreview}
            onClick={handleConfirmSelect}
            className={`text-xs font-bold py-2.5 px-6 rounded-xl shadow-xs transition-all cursor-pointer ${
              selectedId || (customUrl && activeTab === "url") || uploadPreview
                ? "bg-[#0B4F9C] text-white hover:bg-[#083E7D] shadow-md"
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
            }`}
          >
            Use Selected Asset
          </button>
        </div>

      </div>
    </div>
  );
}
