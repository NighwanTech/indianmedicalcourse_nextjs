"use client";

import React, { useState, useEffect } from "react";
import { testimonials as initialTestimonials } from "@/lib/data";
import { 
  MessageSquare, 
  Plus, 
  Star, 
  Edit, 
  Trash2, 
  CheckCircle2, 
  Video, 
  X, 
  Save,
  RotateCcw,
  Hospital,
  MapPin
} from "lucide-react";
import { AdminSecurityConfirmModal } from "@/components/admin/AdminSecurityConfirmModal";

export interface TestimonialItem {
  id: number;
  doctorName: string;
  qualification: string;
  hospital: string;
  city: string;
  state?: string;
  courseName: string;
  quote: string;
  rating: number;
  avatarUrl?: string;
  isFeatured?: boolean;
}

const TESTIMONIALS_STORAGE_KEY = "imc_testimonials_catalog";

export default function AdminTestimonialsPage() {
  const [reviewsList, setReviewsList] = useState<TestimonialItem[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(TESTIMONIALS_STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        } catch (e) {
          console.error(e);
        }
      }
    }
    return initialTestimonials;
  });

  const [activeModal, setActiveModal] = useState<"create" | "edit" | null>(null);
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);
  const [isSuccessNotification, setIsSuccessNotification] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState("Review saved!");

  const [formData, setFormData] = useState<TestimonialItem>({
    id: 0,
    doctorName: "",
    qualification: "MBBS",
    hospital: "",
    city: "",
    state: "India",
    courseName: "Fellowship in Clinical Cardiology",
    quote: "",
    rating: 5,
    avatarUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&auto=format&fit=crop&q=80",
    isFeatured: true,
  });

  const showNotification = (msg: string) => {
    setNotificationMsg(msg);
    setIsSuccessNotification(true);
    setTimeout(() => setIsSuccessNotification(false), 2500);
  };

  const updateTestimonialsAndStorage = (updated: TestimonialItem[]) => {
    setReviewsList(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem(TESTIMONIALS_STORAGE_KEY, JSON.stringify(updated));
    }
  };

  useEffect(() => {
    const handleStorage = () => {
      const saved = localStorage.getItem(TESTIMONIALS_STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) setReviewsList(parsed);
        } catch (e) {
          console.error(e);
        }
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const openCreateModal = () => {
    setFormData({
      id: Date.now(),
      doctorName: "",
      qualification: "MBBS, DNB Resident",
      hospital: "Apollo Hospitals",
      city: "Hyderabad",
      state: "Telangana",
      courseName: "Fellowship in Clinical Cardiology",
      quote: "",
      rating: 5,
      avatarUrl: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&auto=format&fit=crop&q=80",
      isFeatured: true,
    });
    setActiveModal("create");
  };

  const openEditModal = (t: TestimonialItem) => {
    setFormData({ ...t });
    setActiveModal("edit");
  };

  const handleSave = () => {
    if (!formData.doctorName.trim()) return;

    let updated: TestimonialItem[];
    if (activeModal === "create") {
      updated = [formData, ...reviewsList];
    } else {
      updated = reviewsList.map((r) => (r.id === formData.id ? formData : r));
    }

    updateTestimonialsAndStorage(updated);
    setActiveModal(null);
    showNotification(activeModal === "create" ? "New Doctor review added & live on website!" : "Doctor review updated & live!");
  };

  const handleDelete = (id: number, doctorName: string) => {
    if (confirm(`Are you sure you want to delete review from ${doctorName}?`)) {
      const updated = reviewsList.filter((r) => r.id !== id);
      updateTestimonialsAndStorage(updated);
      showNotification("Review deleted.");
    }
  };

  const handleResetDefaults = () => {
    updateTestimonialsAndStorage(initialTestimonials);
    showNotification("Reviews reset to default seed testimonials.");
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 font-display">
              Doctor Testimonials & Reviews CMS
            </h1>
            <span className="bg-blue-100 text-[#0B4F9C] text-[10px] font-black px-2.5 py-0.5 rounded-full">
              {reviewsList.length} Verified Reviews
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage verified alumni feedback, video testimonials, ratings, and hospital badges. Live on homepage!
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
            title="Reset reviews to default catalog"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-600" />
            <span>Reset to Defaults</span>
          </button>

          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-1.5 bg-[#0B4F9C] hover:bg-[#083E7D] text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-xs transition-all cursor-pointer hover:shadow-md hover:scale-105 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Review</span>
          </button>
        </div>
      </div>

      {/* Testimonials 3-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviewsList.map((t) => (
          <div
            key={t.id}
            className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition-all"
          >
            <div className="space-y-3">
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(t.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                  Verified Alumni
                </span>
              </div>

              <p className="text-xs text-slate-700 italic leading-relaxed whitespace-pre-line">
                "{t.quote}"
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div>
                <div className="text-xs font-black text-slate-900">
                  {t.doctorName}
                </div>
                <div className="text-[11px] font-bold text-blue-700 mt-0.5">
                  {t.courseName}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  <span>{t.hospital ? `${t.hospital}, ${t.city}` : t.city}</span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => openEditModal(t)}
                  className="px-3 py-1.5 rounded-xl bg-blue-50 text-[#0B4F9C] hover:bg-blue-100 text-xs font-bold transition-colors cursor-pointer"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(t.id, t.doctorName)}
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                  title="Delete Review"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* REAL INTERACTIVE MODAL: ADD / EDIT TESTIMONIAL                            */}
      {/* ========================================================================= */}
      {activeModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in fade-in zoom-in-95">
            
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="text-base font-black text-slate-900 font-display">
                  {activeModal === "create" ? "Add Doctor Testimonial" : "Edit Testimonial"}
                </h3>
                <p className="text-xs text-slate-500">
                  Changes save live to the homepage Testimonials showcase.
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
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Doctor Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Dr. Ananya Iyer"
                    value={formData.doctorName}
                    onChange={(e) => setFormData({ ...formData, doctorName: e.target.value })}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Degree / Qualification</label>
                  <input
                    type="text"
                    placeholder="e.g. MBBS, Fellow in Clinical Cardiology"
                    value={formData.qualification}
                    onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Completed Fellowship / Program</label>
                <input
                  type="text"
                  placeholder="e.g. Fellowship in Clinical Cardiology"
                  value={formData.courseName}
                  onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Hospital / Clinic</label>
                  <input
                    type="text"
                    placeholder="e.g. Apex Heart & Vascular Center"
                    value={formData.hospital}
                    onChange={(e) => setFormData({ ...formData, hospital: e.target.value })}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">City & State</label>
                  <input
                    type="text"
                    placeholder="e.g. Bengaluru, Karnataka"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Doctor Review / Quote *</label>
                <textarea
                  rows={4}
                  placeholder="Describe the clinical training experience and career impact..."
                  value={formData.quote}
                  onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Star Rating (1 - 5)</label>
                <select
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                >
                  <option value={5}>⭐⭐⭐⭐⭐ (5 Stars)</option>
                  <option value={4}>⭐⭐⭐⭐ (4 Stars)</option>
                  <option value={3}>⭐⭐⭐ (3 Stars)</option>
                </select>
              </div>

            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="inline-flex items-center text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200/80 py-2.5 px-4 rounded-xl shadow-2xs hover:shadow-xs transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!formData.doctorName.trim()}
                onClick={handleSave}
                className="inline-flex items-center gap-1.5 bg-[#0B4F9C] hover:bg-[#083E7D] text-white text-xs font-bold py-2.5 px-6 rounded-xl shadow-xs transition-all disabled:opacity-50 cursor-pointer hover:shadow-md hover:scale-105 active:scale-95"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Review</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Master Security Password Modal for Reset */}
      <AdminSecurityConfirmModal
        isOpen={isSecurityModalOpen}
        onClose={() => setIsSecurityModalOpen(false)}
        onSuccess={handleResetDefaults}
        title="Reset Doctor Testimonials Catalog"
        description="Are you sure you want to restore the verified doctor testimonials catalog to default? Any custom reviews added will be overwritten."
        actionLabel="Confirm & Reset Reviews"
      />

    </div>
  );
}
