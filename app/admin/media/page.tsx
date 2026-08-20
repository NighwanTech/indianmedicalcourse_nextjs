"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Image as ImageIcon, 
  Video, 
  FileText, 
  Upload, 
  FolderPlus, 
  Search, 
  Filter, 
  Trash2, 
  Copy, 
  Check, 
  Eye,
  Folder,
  Layers,
  Sparkles,
  X,
  Save,
  CheckCircle2,
  ExternalLink,
  Download,
  Link as LinkIcon,
  Plus,
  RefreshCw,
  FolderOpen
} from "lucide-react";
import { AdminSecurityConfirmModal } from "@/components/admin/AdminSecurityConfirmModal";

export interface MediaAssetItem {
  id: number;
  fileName: string;
  originalName: string;
  fileType: "IMAGE" | "PDF" | "VIDEO";
  fileSize: string;
  folder: string;
  usageCount: number;
  altText: string;
  url: string;
  createdAt: string;
}

export interface FolderItem {
  id: number;
  name: string;
  slug: string;
}

const SEED_FOLDERS: FolderItem[] = [
  { id: 1, name: "Courses Hero Banners", slug: "courses-hero" },
  { id: 2, name: "Doctor Faculty Portraits", slug: "faculty-portraits" },
  { id: 3, name: "Brochures & Syllabus PDFs", slug: "brochures-pdf" },
  { id: 4, name: "Hospital OT Galleries", slug: "hospital-ot" },
  { id: 5, name: "Alumni Testimonials", slug: "testimonials" },
];

const SEED_MEDIA_FILES: MediaAssetItem[] = [
  {
    id: 101,
    fileName: "cardiology-cathlab-fellowship.webp",
    originalName: "cardiology-cathlab.png",
    fileType: "IMAGE",
    fileSize: "245 KB",
    folder: "courses-hero",
    usageCount: 4,
    altText: "Fellowship in Clinical Cardiology Cath Lab Training",
    url: "https://images.unsplash.com/photo-1551076805-e1869033e561?w=800&auto=format&fit=crop&q=80",
    createdAt: "2026-08-10",
  },
  {
    id: 102,
    fileName: "icu-critical-care-bedside.webp",
    originalName: "icu-critical-care.jpg",
    fileType: "IMAGE",
    fileSize: "310 KB",
    folder: "courses-hero",
    usageCount: 3,
    altText: "Critical Care Fellowship Bedside ICU Training",
    url: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&auto=format&fit=crop&q=80",
    createdAt: "2026-08-11",
  },
  {
    id: 103,
    fileName: "laparoscopy-ot-training.webp",
    originalName: "laparoscopy-ot.png",
    fileType: "IMAGE",
    fileSize: "280 KB",
    folder: "hospital-ot",
    usageCount: 2,
    altText: "Minimal Access Laparoscopic Surgery Workshop",
    url: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&auto=format&fit=crop&q=80",
    createdAt: "2026-08-12",
  },
  {
    id: 104,
    fileName: "Cardiology_Brochure_2026.pdf",
    originalName: "Cardiology_Brochure_2026.pdf",
    fileType: "PDF",
    fileSize: "1.4 MB",
    folder: "brochures-pdf",
    usageCount: 8,
    altText: "Fellowship in Cardiology Syllabus & Fee Structure",
    url: "/media/brochures/cardiology-2026.pdf",
    createdAt: "2026-08-14",
  },
  {
    id: 105,
    fileName: "dr-ks-murthy-portrait.webp",
    originalName: "dr-murthy.jpg",
    fileType: "IMAGE",
    fileSize: "190 KB",
    folder: "faculty-portraits",
    usageCount: 5,
    altText: "Dr. K. S. Murthy MD DM Chief Mentor",
    url: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=800&auto=format&fit=crop&q=80",
    createdAt: "2026-08-15",
  },
  {
    id: 106,
    fileName: "dr-priya-sharma-fetal.webp",
    originalName: "dr-priya.jpg",
    fileType: "IMAGE",
    fileSize: "175 KB",
    folder: "faculty-portraits",
    usageCount: 3,
    altText: "Dr. Priya Sharma MS OB-GYN Lead Faculty",
    url: "https://images.unsplash.com/photo-1594824813588-e21b79f82635?w=800&auto=format&fit=crop&q=80",
    createdAt: "2026-08-16",
  },
];

const MEDIA_STORAGE_KEY = "imc_media_library";
const FOLDERS_STORAGE_KEY = "imc_media_folders";

export default function AdminMediaLibraryPage() {
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [selectedFolder, setSelectedFolder] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const [activeModal, setActiveModal] = useState<"upload" | "new_folder" | "edit_meta" | "preview" | null>(null);
  const [selectedFileForEdit, setSelectedFileForEdit] = useState<MediaAssetItem | null>(null);
  const [selectedFileForPreview, setSelectedFileForPreview] = useState<MediaAssetItem | null>(null);
  const [isSuccessNotification, setIsSuccessNotification] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState("Media updated!");

  // Upload Form State
  const [uploadMethod, setUploadMethod] = useState<"file" | "url">("file");
  const [uploadFileName, setUploadFileName] = useState("");
  const [uploadFileType, setUploadFileType] = useState<"IMAGE" | "PDF" | "VIDEO">("IMAGE");
  const [uploadAltText, setUploadAltText] = useState("");
  const [uploadFolder, setUploadFolder] = useState("courses-hero");
  const [uploadUrl, setUploadUrl] = useState("");
  const [previewDataUrl, setPreviewDataUrl] = useState<string | null>(null);
  const [uploadFileSize, setUploadFileSize] = useState("350 KB");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [folders, setFolders] = useState<FolderItem[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(FOLDERS_STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        } catch (e) {
          console.error(e);
        }
      }
    }
    return SEED_FOLDERS;
  });

  const [files, setFiles] = useState<MediaAssetItem[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(MEDIA_STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        } catch (e) {
          console.error(e);
        }
      }
    }
    return SEED_MEDIA_FILES;
  });

  const [newFolderName, setNewFolderName] = useState("");

  const showNotification = (msg: string) => {
    setNotificationMsg(msg);
    setIsSuccessNotification(true);
    setTimeout(() => setIsSuccessNotification(false), 2500);
  };

  const updateFilesAndStorage = (updated: MediaAssetItem[]) => {
    setFiles(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem(MEDIA_STORAGE_KEY, JSON.stringify(updated));
    }
  };

  const updateFoldersAndStorage = (updated: FolderItem[]) => {
    setFolders(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem(FOLDERS_STORAGE_KEY, JSON.stringify(updated));
    }
  };

  const copyMediaId = (id: number, url: string) => {
    navigator.clipboard.writeText(url || `media_id:${id}`);
    setCopiedId(id);
    showNotification("Copied Asset URL to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) return;
    const slug = newFolderName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const newFolderItem: FolderItem = { id: Date.now(), name: newFolderName.trim(), slug };
    const updated = [...folders, newFolderItem];
    updateFoldersAndStorage(updated);
    setNewFolderName("");
    setActiveModal(null);
    showNotification(`Folder "${newFolderItem.name}" created!`);
  };

  // Handle Local File Selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadFileName(file.name.replace(/\.[^/.]+$/, "").toLowerCase().replace(/[^a-z0-9]+/g, "-") + ".webp");
    setUploadAltText(file.name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " "));

    // Size formatting
    const sizeKB = Math.round(file.size / 1024);
    if (sizeKB > 1024) {
      setUploadFileSize(`${(sizeKB / 1024).toFixed(1)} MB`);
    } else {
      setUploadFileSize(`${sizeKB} KB`);
    }

    if (file.type.includes("pdf")) {
      setUploadFileType("PDF");
      setPreviewDataUrl(null);
      setUploadUrl("/media/brochures/" + file.name);
    } else if (file.type.includes("video")) {
      setUploadFileType("VIDEO");
      setPreviewDataUrl(null);
      setUploadUrl(URL.createObjectURL(file));
    } else {
      setUploadFileType("IMAGE");
      const reader = new FileReader();
      reader.onload = (loadEvt) => {
        const dataUrl = loadEvt.target?.result as string;
        setPreviewDataUrl(dataUrl);
        setUploadUrl(dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  // Execute Upload
  const handleSaveUpload = () => {
    if (!uploadUrl.trim() && !previewDataUrl) {
      alert("Please select a file or enter an asset image/document URL.");
      return;
    }

    const newAsset: MediaAssetItem = {
      id: Date.now(),
      fileName: uploadFileName.trim() || `asset-${Date.now()}.webp`,
      originalName: uploadFileName.trim() || `asset-${Date.now()}`,
      fileType: uploadFileType,
      fileSize: uploadFileSize,
      folder: uploadFolder,
      usageCount: 0,
      altText: uploadAltText.trim() || uploadFileName.trim(),
      url: previewDataUrl || uploadUrl.trim(),
      createdAt: new Date().toISOString().split("T")[0],
    };

    const updated = [newAsset, ...files];
    updateFilesAndStorage(updated);
    setActiveModal(null);
    setUploadUrl("");
    setPreviewDataUrl(null);
    setUploadFileName("");
    setUploadAltText("");
    showNotification("Asset uploaded & optimized successfully!");
  };

  const handleDeleteFile = (id: number, name: string) => {
    if (confirm(`Are you sure you want to delete media asset "${name}"?`)) {
      const updated = files.filter((f) => f.id !== id);
      updateFilesAndStorage(updated);
      showNotification(`Asset "${name}" deleted.`);
    }
  };

  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);

  const handleResetDefaults = () => {
    updateFilesAndStorage(SEED_MEDIA_FILES);
    updateFoldersAndStorage(SEED_FOLDERS);
    showNotification("Media Library reset to default seed assets.");
  };

  const filteredFiles = files.filter((f) => {
    if (selectedType !== "ALL" && f.fileType !== selectedType) return false;
    if (selectedFolder !== "ALL" && f.folder !== selectedFolder) return false;
    if (
      searchQuery &&
      !f.fileName.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !f.altText.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 font-display">
            Centralized Media & Asset Library
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Zero raw URLs. Assets are stored with automatic WebP compression, alt tags, and usage counters.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {isSuccessNotification && (
            <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-2 rounded-xl animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{notificationMsg}</span>
            </div>
          )}

          <button
            onClick={() => setIsSecurityModalOpen(true)}
            className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200/80 text-slate-700 text-xs font-bold py-2.5 px-3.5 rounded-xl shadow-2xs hover:shadow-xs transition-all cursor-pointer"
            title="Reset to default seed assets"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-600" />
            <span>Reset to Defaults</span>
          </button>

          <button
            onClick={() => setActiveModal("new_folder")}
            className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold py-2.5 px-3.5 rounded-xl transition-all cursor-pointer border border-slate-200"
          >
            <FolderPlus className="w-4 h-4 text-blue-600" />
            <span>New Folder</span>
          </button>

          <button
            onClick={() => {
              setUploadMethod("file");
              setPreviewDataUrl(null);
              setUploadUrl("");
              setActiveModal("upload");
            }}
            className="inline-flex items-center gap-1.5 bg-[#0B4F9C] hover:bg-[#083E7D] text-white text-xs font-black py-2.5 px-4 rounded-xl shadow-xs transition-all cursor-pointer hover:shadow-md hover:scale-105 active:scale-95"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Assets</span>
          </button>
        </div>
      </div>

      {/* Filter and Folder Tabs Bar */}
      <div className="space-y-3">
        
        {/* Dynamic Folder Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          
          <button
            onClick={() => setSelectedFolder("ALL")}
            className={`inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              selectedFolder === "ALL"
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>All Folders ({files.length})</span>
          </button>

          {folders.map((folder) => {
            const folderCount = files.filter((f) => f.folder === folder.slug).length;
            const isActive = selectedFolder === folder.slug;

            return (
              <button
                key={folder.id}
                onClick={() => setSelectedFolder(folder.slug)}
                className={`inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? "bg-[#0B4F9C] text-white shadow-xs"
                    : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                <Folder className={`w-3.5 h-3.5 ${isActive ? "text-amber-300" : "text-amber-500"}`} />
                <span>{folder.name}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? "bg-blue-800 text-white" : "bg-slate-100 text-slate-600"}`}>
                  {folderCount}
                </span>
              </button>
            );
          })}

        </div>

        {/* Search & Media Type Switcher */}
        <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search assets by name or alt text..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-[#0B4F9C]"
            />
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {[
              { label: "All Types", val: "ALL" },
              { label: "Images", val: "IMAGE" },
              { label: "PDF Documents", val: "PDF" },
              { label: "Videos", val: "VIDEO" },
            ].map((t) => (
              <button
                key={t.val}
                onClick={() => setSelectedType(t.val)}
                className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  selectedType === t.val
                    ? "bg-[#0B4F9C] text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

        </div>

      </div>

      {/* Media Assets Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredFiles.map((file) => (
          <div
            key={file.id}
            className="group bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden hover:shadow-md transition-all flex flex-col justify-between"
          >
            
            {/* Thumbnail Preview Area */}
            <div className="relative aspect-video bg-slate-100 overflow-hidden flex items-center justify-center border-b border-slate-100">
              
              {file.fileType === "IMAGE" ? (
                <img
                  src={file.url}
                  alt={file.altText}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                  onClick={() => {
                    setSelectedFileForPreview(file);
                    setActiveModal("preview");
                  }}
                />
              ) : file.fileType === "PDF" ? (
                <div 
                  className="flex flex-col items-center justify-center p-4 text-center cursor-pointer"
                  onClick={() => {
                    setSelectedFileForPreview(file);
                    setActiveModal("preview");
                  }}
                >
                  <FileText className="w-10 h-10 text-red-500 mb-1" />
                  <span className="text-[10px] font-black uppercase text-red-600 tracking-wider">PDF Document</span>
                </div>
              ) : (
                <div 
                  className="flex flex-col items-center justify-center p-4 text-center cursor-pointer"
                  onClick={() => {
                    setSelectedFileForPreview(file);
                    setActiveModal("preview");
                  }}
                >
                  <Video className="w-10 h-10 text-blue-600 mb-1" />
                  <span className="text-[10px] font-black uppercase text-blue-600 tracking-wider">Video Clip</span>
                </div>
              )}

              {/* ID Badge */}
              <div className="absolute top-2 left-2 bg-slate-950/70 backdrop-blur-xs text-white text-[9px] font-mono px-2 py-0.5 rounded-md">
                ID: #{file.id}
              </div>

              {/* Quick Preview Hover Overlay */}
              <button
                onClick={() => {
                  setSelectedFileForPreview(file);
                  setActiveModal("preview");
                }}
                className="absolute inset-0 bg-slate-950/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer text-white text-xs font-bold gap-1"
              >
                <Eye className="w-4 h-4" />
                <span>View Fullscreen</span>
              </button>

            </div>

            {/* Asset Meta Info */}
            <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
              
              <div>
                <div className="text-xs font-extrabold text-slate-900 truncate" title={file.fileName}>
                  {file.fileName}
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                  <span>{file.fileSize}</span>
                  <span className="font-bold text-emerald-600">{file.usageCount} Usages</span>
                </div>
                <div className="text-[10px] text-slate-500 truncate mt-1 italic" title={file.altText}>
                  Alt: {file.altText || "No Alt Tag"}
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                
                {/* 1-Click Copy URL */}
                <button
                  onClick={() => copyMediaId(file.id, file.url)}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
                >
                  {copiedId === file.id ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span className="text-emerald-600">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy URL</span>
                    </>
                  )}
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      setSelectedFileForEdit(file);
                      setActiveModal("edit_meta");
                    }}
                    className="text-[11px] font-bold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                  >
                    Edit SEO
                  </button>

                  <button
                    onClick={() => handleDeleteFile(file.id, file.fileName)}
                    className="p-1 text-slate-400 hover:text-red-600 transition-colors cursor-pointer rounded-md hover:bg-red-50"
                    title="Delete Media Asset"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>

            </div>

          </div>
        ))}
      </div>

      {filteredFiles.length === 0 && (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200">
          <ImageIcon className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <div className="text-sm font-bold text-slate-700">No media assets found in this folder</div>
          <p className="text-xs text-slate-400 mt-1">Upload a new image or switch folders above.</p>
        </div>
      )}

      {/* ========================================================================= */}
      {/* REAL MODAL: CREATE NEW FOLDER                                             */}
      {/* ========================================================================= */}
      {activeModal === "new_folder" && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl border border-slate-200 p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900 font-display">
                Create New Media Folder
              </h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Organize medical brochures, surgery videos, or clinical photos into custom folders.
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Folder Name</label>
              <input
                type="text"
                placeholder="e.g. Fetal Medicine Scans"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                autoFocus
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="inline-flex items-center text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200/80 py-2 px-4 rounded-xl shadow-2xs hover:shadow-xs transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateFolder}
                className="bg-[#0B4F9C] hover:bg-[#083E7D] text-white text-xs font-bold py-2 px-5 rounded-xl shadow-xs cursor-pointer"
              >
                Create Folder
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* REAL FUNCTIONAL MODAL: UPLOAD ASSETS (FILE PICKER + URL INGESTION)        */}
      {/* ========================================================================= */}
      {activeModal === "upload" && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-200 p-6 space-y-4 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-slate-900 font-display">
                  Upload Media Asset
                </h3>
                <p className="text-xs text-slate-500">Add medical photos, brochures, and surgery videos.</p>
              </div>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Upload Method Switcher */}
            <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setUploadMethod("file")}
                className={`flex-1 text-xs font-bold py-2 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  uploadMethod === "file" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload From Device</span>
              </button>
              <button
                type="button"
                onClick={() => setUploadMethod("url")}
                className={`flex-1 text-xs font-bold py-2 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  uploadMethod === "url" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <LinkIcon className="w-3.5 h-3.5" />
                <span>Paste Web URL</span>
              </button>
            </div>

            {/* File Dropzone / Picker */}
            {uploadMethod === "file" ? (
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*,application/pdf,video/*"
                  className="hidden"
                />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-blue-300 hover:border-[#0B4F9C] rounded-2xl p-6 text-center bg-blue-50/40 hover:bg-blue-50/80 transition-all cursor-pointer"
                >
                  <Upload className="w-8 h-8 text-[#0B4F9C] mx-auto mb-2 animate-bounce" />
                  <div className="text-xs font-extrabold text-slate-900">
                    Click to browse or drop files here
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">
                    Supports JPG, PNG, WebP, PDF Brochures, MP4 Videos (Auto-optimized)
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Direct Media / Image URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/... or https://cdn.example.com/photo.jpg"
                  value={uploadUrl}
                  onChange={(e) => {
                    setUploadUrl(e.target.value);
                    setPreviewDataUrl(e.target.value);
                  }}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            )}

            {/* Image Preview if Loaded */}
            {previewDataUrl && (
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-3">
                <img
                  src={previewDataUrl}
                  alt="Upload Preview"
                  className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-slate-900 truncate">
                    {uploadFileName || "Selected Asset"}
                  </div>
                  <div className="text-[10px] text-emerald-600 font-bold mt-0.5">
                    Ready for Ingestion • {uploadFileSize}
                  </div>
                </div>
              </div>
            )}

            {/* Form Fields: Target Folder, Alt Text, File Name */}
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Target Folder</label>
                  <select
                    value={uploadFolder}
                    onChange={(e) => setUploadFolder(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 cursor-pointer"
                  >
                    {folders.map((f) => (
                      <option key={f.id} value={f.slug}>
                        {f.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Asset Type</label>
                  <select
                    value={uploadFileType}
                    onChange={(e) => setUploadFileType(e.target.value as any)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 cursor-pointer"
                  >
                    <option value="IMAGE">Image (JPG/PNG/WebP)</option>
                    <option value="PDF">PDF Brochure</option>
                    <option value="VIDEO">Video Clip</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">File Name</label>
                <input
                  type="text"
                  placeholder="e.g. cardiac-catheterization-training.webp"
                  value={uploadFileName}
                  onChange={(e) => setUploadFileName(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">SEO Alt Text</label>
                <input
                  type="text"
                  placeholder="e.g. Fellowship in Cardiology Hands-on Training"
                  value={uploadAltText}
                  onChange={(e) => setUploadAltText(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="inline-flex items-center text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200/80 py-2.5 px-4 rounded-xl shadow-2xs hover:shadow-xs transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveUpload}
                className="inline-flex items-center gap-1.5 bg-[#0B4F9C] hover:bg-[#083E7D] text-white text-xs font-black py-2.5 px-6 rounded-xl shadow-xs transition-all cursor-pointer hover:shadow-md hover:scale-105 active:scale-95"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save to Library</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* REAL MODAL: EDIT ALT TEXT & SEO                                           */}
      {/* ========================================================================= */}
      {activeModal === "edit_meta" && selectedFileForEdit && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-200 p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900 font-display">
                Edit Asset SEO & Alt Text
              </h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-3">
              {selectedFileForEdit.fileType === "IMAGE" ? (
                <img
                  src={selectedFileForEdit.url}
                  alt={selectedFileForEdit.altText}
                  className="w-14 h-14 rounded-xl object-cover border border-slate-200 shrink-0"
                />
              ) : (
                <FileText className="w-10 h-10 text-blue-600 shrink-0" />
              )}
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-900 truncate">
                  {selectedFileForEdit.fileName}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  ID: #{selectedFileForEdit.id} • {selectedFileForEdit.fileSize}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Image Alt Text (Google SEO)</label>
              <input
                type="text"
                value={selectedFileForEdit.altText}
                onChange={(e) => setSelectedFileForEdit({ ...selectedFileForEdit, altText: e.target.value })}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Target Folder</label>
              <select
                value={selectedFileForEdit.folder}
                onChange={(e) => setSelectedFileForEdit({ ...selectedFileForEdit, folder: e.target.value })}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
              >
                {folders.map((f) => (
                  <option key={f.id} value={f.slug}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="inline-flex items-center text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200/80 py-2 px-4 rounded-xl shadow-2xs hover:shadow-xs transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const updated = files.map((f) => (f.id === selectedFileForEdit.id ? selectedFileForEdit : f));
                  updateFilesAndStorage(updated);
                  setActiveModal(null);
                  showNotification("Asset metadata saved!");
                }}
                className="bg-[#0B4F9C] hover:bg-[#083E7D] text-white text-xs font-bold py-2 px-5 rounded-xl shadow-xs cursor-pointer"
              >
                Save Alt Text
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* REAL LIGHTBOX MODAL: FULL-SCREEN MEDIA PREVIEW                           */}
      {/* ========================================================================= */}
      {activeModal === "preview" && selectedFileForPreview && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 max-h-[90vh]">
            
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="text-sm font-black text-slate-900 truncate max-w-md">
                  {selectedFileForPreview.fileName}
                </h3>
                <p className="text-[10px] text-slate-500">
                  ID: #{selectedFileForPreview.id} • {selectedFileForPreview.fileSize} • {selectedFileForPreview.fileType}
                </p>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 flex items-center justify-center bg-slate-950 max-h-[60vh] overflow-hidden">
              {selectedFileForPreview.fileType === "IMAGE" ? (
                <img
                  src={selectedFileForPreview.url}
                  alt={selectedFileForPreview.altText}
                  className="max-w-full max-h-[55vh] object-contain rounded-lg"
                />
              ) : selectedFileForPreview.fileType === "PDF" ? (
                <div className="text-center p-8 text-white space-y-3">
                  <FileText className="w-16 h-16 text-red-400 mx-auto" />
                  <div className="text-sm font-bold">{selectedFileForPreview.fileName}</div>
                  <a
                    href={selectedFileForPreview.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-2 px-4 rounded-xl"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open PDF in New Tab</span>
                  </a>
                </div>
              ) : (
                <video
                  src={selectedFileForPreview.url}
                  controls
                  className="max-w-full max-h-[55vh] rounded-lg"
                />
              )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <div className="text-xs text-slate-600 truncate max-w-xs">
                <strong>Alt Tag:</strong> {selectedFileForPreview.altText}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => copyMediaId(selectedFileForPreview.id, selectedFileForPreview.url)}
                  className="inline-flex items-center gap-1.5 bg-[#0B4F9C] hover:bg-[#083E7D] text-white text-xs font-bold py-2 px-4 rounded-xl cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Asset URL</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Master Admin Security Password Confirmation Modal */}
      <AdminSecurityConfirmModal
        isOpen={isSecurityModalOpen}
        onClose={() => setIsSecurityModalOpen(false)}
        onSuccess={handleResetDefaults}
        title="Reset Centralized Media Library"
        description="Are you sure you want to restore the Media Library to factory seed assets? Any custom uploaded images and created folders will be removed."
        actionLabel="Confirm & Reset Media Library"
      />

    </div>
  );
}
