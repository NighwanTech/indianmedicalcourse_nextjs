"use client";

import React, { useState, useEffect, useRef } from "react";
import { MediaLibraryPickerModal, MediaItem } from "@/components/admin/MediaLibraryPickerModal";
import { 
  Building2, 
  GraduationCap, 
  Award, 
  FlaskConical, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Save, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  X, 
  ExternalLink,
  RotateCcw,
  Upload
} from "lucide-react";
import { 
  createPartnerAction, 
  updatePartnerAction, 
  deletePartnerAction, 
  seedDefaultPartnersAction 
} from "@/features/partners/partnerActions";

const CATEGORIES = [
  { id: "ALL", label: "All Partners", icon: Sparkles },
  { id: "HOSPITAL", label: "Training Hospitals", icon: Building2 },
  { id: "UNIVERSITY", label: "Academic Universities", icon: GraduationCap },
  { id: "ACCREDITATION", label: "Accreditation Bodies", icon: Award },
  { id: "RESEARCH", label: "Research Centers", icon: FlaskConical },
];

export default function AdminPartnersPage() {
  const [partners, setPartners] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [isLoading, setIsLoading] = useState(true);
  const [activeModal, setActiveModal] = useState<"create" | "edit" | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    id: 0,
    name: "",
    logoUrl: "",
    partnerType: "HOSPITAL",
    location: "Pan-India",
    displayOrder: 1,
    isActive: true,
  });

  const handleDeviceFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError("File is too large. Please select an image under 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setFormData((prev) => ({ ...prev, logoUrl: reader.result as string }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleMediaSelect = (media: MediaItem) => {
    setFormData((prev) => ({ ...prev, logoUrl: media.url }));
    setIsMediaPickerOpen(false);
  };

  const loadPartners = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/partners?category=ALL");
      if (res.ok) {
        const data = await res.json();
        setPartners(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Failed to load partners:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPartners();
  }, []);

  const filteredPartners = partners.filter((p) => {
    if (selectedCategory === "ALL") return true;
    return p.partnerType === selectedCategory;
  });

  const openCreateModal = () => {
    setFormData({
      id: 0,
      name: "",
      logoUrl: "",
      partnerType: selectedCategory === "ALL" ? "HOSPITAL" : selectedCategory,
      location: "Pan-India",
      displayOrder: partners.length + 1,
      isActive: true,
    });
    setError(null);
    setActiveModal("create");
  };

  const openEditModal = (partner: any) => {
    setFormData({
      id: partner.id,
      name: partner.name,
      logoUrl: partner.logoUrl || "",
      partnerType: partner.partnerType || "HOSPITAL",
      location: partner.location || "Pan-India",
      displayOrder: partner.displayOrder || 1,
      isActive: partner.isActive ?? true,
    });
    setError(null);
    setActiveModal("edit");
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      setError("Partner name is required.");
      return;
    }

    setIsSaving(true);
    setError(null);

    const fd = new FormData();
    fd.append("name", formData.name);
    fd.append("logoUrl", formData.logoUrl);
    fd.append("partnerType", formData.partnerType);
    fd.append("location", formData.location);
    fd.append("displayOrder", formData.displayOrder.toString());
    fd.append("isActive", formData.isActive ? "true" : "false");

    try {
      if (activeModal === "create") {
        const res = await createPartnerAction(fd);
        if (res?.error) throw new Error(res.error);
        setSuccessMessage("Partner created successfully!");
      } else if (activeModal === "edit") {
        fd.append("id", formData.id.toString());
        const res = await updatePartnerAction(fd);
        if (res?.error) throw new Error(res.error);
        setSuccessMessage("Partner updated successfully!");
      }

      await loadPartners();
      setActiveModal(null);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to save partner.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this partner?")) return;
    try {
      await deletePartnerAction(id);
      await loadPartners();
      setSuccessMessage("Partner deleted successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      alert(err.message || "Failed to delete partner.");
    }
  };

  const handleSeedDefaults = async () => {
    if (!confirm("Seed initial top hospitals and universities into the database?")) return;
    try {
      setIsLoading(true);
      await seedDefaultPartnersAction();
      await loadPartners();
      setSuccessMessage("Default partners seeded successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      alert(err.message || "Failed to seed defaults.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 font-display">
            Hospital & University Partners CMS
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage accredited clinical hospitals, degree universities, and certification partners displayed on the homepage marquee.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {successMessage && (
            <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-2 rounded-xl animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{successMessage}</span>
            </div>
          )}

          <button
            onClick={handleSeedDefaults}
            className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-2.5 px-3.5 rounded-xl border border-slate-200 transition-all cursor-pointer"
            title="Restore Top 8 Default Hospitals & Universities"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-600" />
            <span className="hidden sm:inline">Seed Defaults</span>
          </button>

          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-1.5 bg-[#0B4F9C] hover:bg-[#083E7D] text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Partner</span>
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer ${
                isActive
                  ? "bg-slate-900 text-white shadow-md shadow-slate-900/20"
                  : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? "text-emerald-400" : "text-slate-400"}`} />
              <span>{cat.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
              }`}>
                {cat.id === "ALL" 
                  ? partners.length 
                  : partners.filter((p) => p.partnerType === cat.id).length}
              </span>
            </button>
          );
        })}
      </div>

      {/* Partners Grid / Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4 w-12 text-center">Order</th>
                <th className="py-3 px-4">Brand Logo</th>
                <th className="py-3 px-4">Partner Name</th>
                <th className="py-3 px-4">Category Type</th>
                <th className="py-3 px-4">Location / Network</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPartners.map((p, idx) => (
                <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 text-center font-bold text-slate-400">
                    {p.displayOrder || idx + 1}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="w-20 h-12 rounded-xl bg-white border border-slate-200 p-1.5 flex items-center justify-center shadow-2xs">
                      {p.logoUrl ? (
                        <img
                          src={p.logoUrl}
                          alt={p.name}
                          className="max-h-full max-w-full object-contain"
                        />
                      ) : (
                        <Building2 className="w-6 h-6 text-slate-300" />
                      )}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    <div>{p.name}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border ${
                      p.partnerType === "HOSPITAL"
                        ? "bg-blue-50 text-blue-700 border-blue-200"
                        : p.partnerType === "UNIVERSITY"
                        ? "bg-purple-50 text-purple-700 border-purple-200"
                        : p.partnerType === "ACCREDITATION"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-slate-100 text-slate-700 border-slate-200"
                    }`}>
                      {p.partnerType === "HOSPITAL" && "🏥 Hospital"}
                      {p.partnerType === "UNIVERSITY" && "🎓 University"}
                      {p.partnerType === "ACCREDITATION" && "📜 Accreditation"}
                      {p.partnerType === "RESEARCH" && "🔬 Research"}
                      {!["HOSPITAL", "UNIVERSITY", "ACCREDITATION", "RESEARCH"].includes(p.partnerType) && p.partnerType}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 font-medium">
                    {p.location || "Pan-India"}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      p.isActive ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"
                    }`}>
                      {p.isActive ? "Active" : "Hidden"}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-2">
                    <button
                      onClick={() => openEditModal(p)}
                      className="text-xs font-bold text-blue-600 hover:text-blue-800 cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="text-xs font-bold text-rose-600 hover:text-rose-800 cursor-pointer"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {isLoading && (
            <div className="p-8 text-center text-slate-500 text-sm">
              Loading partners...
            </div>
          )}
          {!isLoading && filteredPartners.length === 0 && (
            <div className="p-12 text-center text-slate-400">
              <Building2 className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm font-bold text-slate-700">No partners found in this category.</p>
              <button
                onClick={openCreateModal}
                className="mt-3 text-xs font-bold text-blue-600 hover:underline cursor-pointer"
              >
                + Add your first partner
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL: ADD / EDIT PARTNER                                                 */}
      {/* ========================================================================= */}
      {activeModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in fade-in zoom-in-95">
            
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="text-base font-black text-slate-900 font-display">
                  {activeModal === "create" ? "Add Partner Organization" : "Edit Partner Details"}
                </h3>
                <p className="text-xs text-slate-500">
                  Configure partner hospital, medical university, brand logo, and clinical attachments.
                </p>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-600 text-xs font-bold px-3 py-2.5 rounded-xl flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Partner Category Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Partner Category Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "HOSPITAL", label: "Training Hospital", icon: Building2, desc: "Apollo, Fortis, Max" },
                    { id: "UNIVERSITY", label: "Academic University", icon: GraduationCap, desc: "Degree & Affiliation" },
                    { id: "ACCREDITATION", label: "Accreditation Body", icon: Award, desc: "CPD UK, Board" },
                    { id: "RESEARCH", label: "Research Network", icon: FlaskConical, desc: "Clinical Wet Labs" },
                  ].map((cat) => {
                    const Icon = cat.icon;
                    const isSelected = formData.partnerType === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, partnerType: cat.id })}
                        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-2.5 ${
                          isSelected
                            ? "bg-blue-50/80 border-blue-600 ring-2 ring-blue-600/20"
                            : "bg-slate-50 border-slate-200 hover:bg-slate-100/80"
                        }`}
                      >
                        <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${isSelected ? "text-blue-700" : "text-slate-400"}`} />
                        <div>
                          <div className={`text-xs font-black ${isSelected ? "text-blue-950" : "text-slate-800"}`}>
                            {cat.label}
                          </div>
                          <div className="text-[10px] text-slate-400 font-medium">
                            {cat.desc}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Partner / Hospital / University Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Medanta - The Medicity or Royal College Academy"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                />
              </div>

              {/* Logo Upload & Picker Section */}
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/png, image/jpeg, image/svg+xml, image/webp"
                  onChange={handleDeviceFileUpload}
                  className="hidden"
                />

                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                  <span>Organization Brand Logo</span>
                  {formData.logoUrl && (
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, logoUrl: "" })}
                      className="text-[10px] text-rose-600 font-bold hover:underline cursor-pointer"
                    >
                      Remove Logo
                    </button>
                  )}
                </label>

                {formData.logoUrl ? (
                  /* Live Logo Preview Box */
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-24 h-16 bg-white rounded-xl border border-slate-200 p-2 flex items-center justify-center shadow-xs">
                        <img
                          src={formData.logoUrl}
                          alt="Logo Preview"
                          className="max-h-full max-w-full object-contain"
                          onError={(e) => {
                            (e.target as any).style.display = "none";
                          }}
                        />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Logo Attached</span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-0.5 max-w-[200px] truncate">
                          {formData.logoUrl.startsWith("data:") ? "Uploaded from device" : formData.logoUrl}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-xs font-bold text-blue-600 bg-white border border-slate-200 px-3 py-1.5 rounded-xl hover:bg-slate-100 shadow-2xs cursor-pointer"
                      >
                        Change File
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsMediaPickerOpen(true)}
                        className="text-xs font-bold text-slate-600 bg-white border border-slate-200 p-1.5 rounded-xl hover:bg-slate-100 shadow-2xs cursor-pointer"
                        title="Pick from Media Library"
                      >
                        <Sparkles className="w-4 h-4 text-amber-500" />
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Upload & Picker Selection Container */
                  <div className="space-y-3">
                    {/* Drag & Drop File Upload Box */}
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-slate-300 hover:border-blue-500 bg-slate-50/80 hover:bg-blue-50/40 rounded-2xl p-5 text-center cursor-pointer transition-all group"
                    >
                      <div className="w-10 h-10 rounded-full bg-blue-100/80 text-blue-600 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                        <Upload className="w-5 h-5" />
                      </div>
                      <p className="text-xs font-bold text-slate-800">
                        Click to Upload Logo File from Computer
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        Supports PNG, SVG, JPG, WebP (Max 5MB)
                      </p>
                    </div>

                    {/* Or choose from Media Library or Paste URL */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setIsMediaPickerOpen(true)}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold py-2.5 px-3 rounded-xl border border-slate-200 shadow-2xs transition-all cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        <span>Media Library</span>
                      </button>

                      <div className="text-[10px] text-slate-400 font-bold uppercase">or</div>

                      <div className="flex-1 relative">
                        <input
                          type="url"
                          placeholder="Paste image URL..."
                          value={formData.logoUrl}
                          onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                          className="w-full text-xs py-2 px-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Location & Order */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Location / City Network
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Delhi-NCR, Mumbai"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value, 10) || 1 })}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
              </div>

              {/* Active Switch */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div>
                  <div className="text-xs font-bold text-slate-800">Show on Website Marquee</div>
                  <div className="text-[10px] text-slate-400">Make this partner immediately visible to doctors.</div>
                </div>
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                />
              </div>

            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="inline-flex items-center text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200/80 py-2.5 px-4 rounded-xl transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!formData.name.trim() || isSaving}
                onClick={handleSave}
                className="inline-flex items-center gap-1.5 bg-[#0B4F9C] hover:bg-[#083E7D] text-white text-xs font-bold py-2.5 px-6 rounded-xl shadow-xs transition-all disabled:opacity-50 cursor-pointer"
              >
                {isSaving ? (
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <Save className="w-3.5 h-3.5" />
                )}
                <span>Save Partner Organization</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MEDIA LIBRARY PICKER MODAL                                                */}
      {/* ========================================================================= */}
      <MediaLibraryPickerModal
        isOpen={isMediaPickerOpen}
        onClose={() => setIsMediaPickerOpen(false)}
        onSelect={handleMediaSelect}
        allowedTypes={["IMAGE", "ICON"]}
        title="Select Hospital or University Brand Logo"
      />

    </div>
  );
}
