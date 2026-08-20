"use client";

import React, { useState, useEffect } from "react";
import { facultyMembers as initialFaculty } from "@/lib/data";
import { MediaLibraryPickerModal, MediaItem } from "@/components/admin/MediaLibraryPickerModal";
import { 
  Award, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Building2, 
  GraduationCap, 
  X, 
  Save, 
  CheckCircle2,
  Image as ImageIcon,
  RotateCcw,
  Sparkles
} from "lucide-react";

interface FacultyItem {
  id: number;
  name: string;
  designation: string;
  qualifications: string;
  hospitalAffiliation: string;
  experienceYears: number;
  photoUrl: string;
  bio?: string;
}

const FACULTY_STORAGE_KEY = "imc_faculty_catalog";
const FACULTY_SECTION_TOGGLE_KEY = "imc_faculty_section_enabled";

export default function AdminFacultyPage() {
  const [facultyList, setFacultyList] = useState<FacultyItem[]>(initialFaculty);
  const [isSectionEnabled, setIsSectionEnabled] = useState<boolean>(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== "undefined") {
      const savedToggle = localStorage.getItem(FACULTY_SECTION_TOGGLE_KEY);
      if (savedToggle !== null) {
        setIsSectionEnabled(savedToggle === "true");
      }

      const savedCatalog = localStorage.getItem(FACULTY_STORAGE_KEY);
      if (savedCatalog) {
        try {
          const parsed = JSON.parse(savedCatalog);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setFacultyList(parsed);
          }
        } catch (e) {
          console.error("Failed to parse faculty storage", e);
        }
      }
    }
  }, []);

  const [search, setSearch] = useState("");
  const [activeModal, setActiveModal] = useState<"create" | "edit" | null>(null);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [isSuccessNotification, setIsSuccessNotification] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState("Mentor Saved Successfully!");
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const toggleSectionEnabled = () => {
    const nextVal = !isSectionEnabled;
    setIsSectionEnabled(nextVal);
    if (typeof window !== "undefined") {
      localStorage.setItem(FACULTY_SECTION_TOGGLE_KEY, nextVal ? "true" : "false");
      window.dispatchEvent(new Event("storage"));
    }
    showSuccess(nextVal ? "Faculty Section Enabled on Live Website!" : "Faculty Section Hidden from Live Website!");
  };

  const [formData, setFormData] = useState<FacultyItem>({
    id: 0,
    name: "",
    designation: "",
    qualifications: "",
    hospitalAffiliation: "",
    experienceYears: 10,
    photoUrl: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=500&auto=format&fit=crop&q=80",
    bio: "",
  });

  const handleDeviceFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setFormData((prev) => ({ ...prev, photoUrl: reader.result as string }));
      }
    };
    reader.readAsDataURL(file);
  };

  const showSuccess = (msg: string) => {
    setNotificationMsg(msg);
    setIsSuccessNotification(true);
    setTimeout(() => setIsSuccessNotification(false), 2500);
  };

  const updateStateAndStorage = (newList: FacultyItem[]) => {
    setFacultyList(newList);
    if (typeof window !== "undefined") {
      localStorage.setItem(FACULTY_STORAGE_KEY, JSON.stringify(newList));
    }
  };

  const filtered = facultyList.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    f.designation.toLowerCase().includes(search.toLowerCase()) ||
    f.hospitalAffiliation.toLowerCase().includes(search.toLowerCase())
  );

  const openCreateModal = () => {
    setFormData({
      id: Date.now(),
      name: "",
      designation: "Clinical Director & Senior Consultant",
      qualifications: "MBBS, MD, DNB, FACC",
      hospitalAffiliation: "Apollo Hospitals / Fortis Healthcare",
      experienceYears: 15,
      photoUrl: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=500&auto=format&fit=crop&q=80",
      bio: "Senior medical director guiding fellowship candidates through bedside rotations.",
    });
    setActiveModal("create");
  };

  const openEditModal = (mentor: FacultyItem) => {
    setFormData({ ...mentor });
    setActiveModal("edit");
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      alert("Please provide the Mentor's Full Name.");
      return;
    }

    if (activeModal === "create") {
      const newList = [formData, ...facultyList];
      updateStateAndStorage(newList);
      showSuccess(`Dr. ${formData.name} added to Faculty!`);
    } else if (activeModal === "edit") {
      const newList = facultyList.map((f) => (f.id === formData.id ? formData : f));
      updateStateAndStorage(newList);
      showSuccess(`Dr. ${formData.name} updated successfully!`);
    }

    setActiveModal(null);
  };

  const handleDelete = (id: number, name: string) => {
    if (confirm(`Are you sure you want to remove ${name} from the Faculty Showcase?`)) {
      const newList = facultyList.filter((f) => f.id !== id);
      updateStateAndStorage(newList);
      showSuccess(`${name} removed.`);
    }
  };

  const handleResetDefaults = () => {
    if (confirm("Reset Faculty Showcase to default 4 clinical mentors?")) {
      updateStateAndStorage(initialFaculty);
      showSuccess("Faculty Showcase reset to defaults.");
    }
  };

  const handleMediaSelect = (media: MediaItem) => {
    setFormData({ ...formData, photoUrl: media.url });
    setIsMediaPickerOpen(false);
  };

  return (
    <div className="space-y-6">

      {/* Hidden File Input for Device Upload */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleDeviceFileUpload}
        className="hidden"
      />
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 font-display">
            Faculty & Specialist Mentors CMS
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage clinical directors, credentials, hospital affiliations, and course assignments. Persists on website.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {isSuccessNotification && (
            <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-2 rounded-xl animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{notificationMsg}</span>
            </div>
          )}

          {/* Master Section Toggle Button */}
          <button
            onClick={toggleSectionEnabled}
            className={`inline-flex items-center gap-1.5 text-xs font-bold py-2.5 px-4 rounded-xl border transition-all cursor-pointer shadow-xs ${
              isSectionEnabled
                ? "bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100"
                : "bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100"
            }`}
            title="Click to toggle Faculty section visibility on live website"
          >
            <span className={`w-2 h-2 rounded-full ${isSectionEnabled ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`} />
            <span>Faculty Section: {isSectionEnabled ? "Active on Website" : "Hidden from Website"}</span>
          </button>

          <button
            onClick={handleResetDefaults}
            className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-2.5 px-3 rounded-xl transition-all cursor-pointer"
            title="Reset to default mentors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Defaults</span>
          </button>

          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 bg-[#0B4F9C] hover:bg-[#083E7D] text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Mentor</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search mentor by name, specialty, hospital..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-[#0B4F9C]"
          />
        </div>
        <span className="text-xs font-bold text-slate-500">
          Showing {filtered.length} of {facultyList.length} Mentors
        </span>
      </div>

      {/* Faculty Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.map((mentor) => (
          <div
            key={mentor.id}
            className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div className="relative h-56 bg-gradient-to-b from-slate-100 via-slate-100 to-slate-200 overflow-hidden">
              <img
                src={mentor.photoUrl}
                alt={mentor.name}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-2.5 right-2.5 bg-[#0B4F9C] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
                {mentor.experienceYears}+ Yrs Exp
              </div>
            </div>

            <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 leading-snug group-hover:text-[#0B4F9C] transition-colors">
                  {mentor.name}
                </h3>
                <div className="text-[11px] font-bold text-blue-700 mt-0.5">
                  {mentor.designation}
                </div>
                <div className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                  <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                  <span className="truncate">{mentor.hospitalAffiliation}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                  {mentor.qualifications}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openEditModal(mentor)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-lg cursor-pointer transition-colors"
                  >
                    <Edit className="w-3 h-3" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(mentor.id, mentor.name)}
                    className="text-xs text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded-lg cursor-pointer transition-colors"
                    title="Delete Mentor"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* REAL INTERACTIVE MODAL: ADD / EDIT MENTOR                                 */}
      {/* ========================================================================= */}
      {activeModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 max-h-[90vh]">
            
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="text-base font-black text-slate-900 font-display">
                  {activeModal === "create" ? "Add Clinical Mentor" : `Edit Mentor: ${formData.name}`}
                </h3>
                <p className="text-xs text-slate-500">
                  Manage medical credentials, hospital attachment, and photo.
                </p>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto flex-1">
              
              {/* Doctor Photo Picker */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-2xl bg-white overflow-hidden shrink-0 border border-slate-300 shadow-xs flex items-center justify-center">
                    <img 
                      src={formData.photoUrl} 
                      alt="Doctor Photo Preview" 
                      className="w-full h-full object-cover object-center" 
                      onError={(e) => {
                        (e.target as any).src = "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=500&auto=format&fit=crop&q=80";
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-slate-800">Faculty Portrait Photo</div>
                    <div className="text-[10px] text-slate-400 mb-2">High-res doctor portrait with lab coat</div>
                    
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-[#0B4F9C] hover:bg-[#083E7D] px-3 py-1.5 rounded-xl shadow-2xs cursor-pointer"
                      >
                        <span>Upload from Computer</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setIsMediaPickerOpen(true)}
                        className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 cursor-pointer"
                      >
                        <Sparkles className="w-3 h-3 text-amber-500" />
                        <span>Media Library</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200/80">
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">
                    Or Direct Photo URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={formData.photoUrl}
                    onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                    className="w-full text-xs p-2 bg-white border border-slate-200 rounded-xl font-mono text-[11px]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Doctor Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. K. S. Murthy"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:bg-white focus:outline-hidden focus:border-[#0B4F9C]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Designation / Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Chief Director & Interventional Cardiologist"
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Medical Qualifications
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. MD (Medicine), DM (Cardiology), FACC"
                    value={formData.qualifications}
                    onChange={(e) => setFormData({ ...formData, qualifications: e.target.value })}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Hospital Affiliation
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Apollo Heart Institute / Fortis"
                    value={formData.hospitalAffiliation}
                    onChange={(e) => setFormData({ ...formData, hospitalAffiliation: e.target.value })}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Years of Clinical Experience
                  </label>
                  <input
                    type="number"
                    value={formData.experienceYears}
                    onChange={(e) => setFormData({ ...formData, experienceYears: Number(e.target.value) })}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mentor Bio / Clinical Highlights
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Over 24+ years directing complex coronary interventions and echocardiography masterclasses."
                  value={formData.bio || ""}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
                />
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
                disabled={!formData.name.trim()}
                onClick={handleSave}
                className="inline-flex items-center gap-1.5 bg-[#0B4F9C] hover:bg-[#083E7D] text-white text-xs font-bold py-2.5 px-6 rounded-xl shadow-xs transition-all disabled:opacity-50 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Mentor Profile</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Media Picker Modal */}
      <MediaLibraryPickerModal
        isOpen={isMediaPickerOpen}
        onClose={() => setIsMediaPickerOpen(false)}
        onSelect={handleMediaSelect}
        title="Choose Faculty Mentor Photo"
      />

    </div>
  );
}
