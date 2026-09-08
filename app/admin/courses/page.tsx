"use client";

import React, { useState, useEffect, useRef } from "react";
import { courses as initialCourses, categories } from "@/lib/data";
import { MediaLibraryPickerModal, MediaItem } from "@/components/admin/MediaLibraryPickerModal";
import { compressImageFile, MEDICAL_COURSE_PRESETS, DEFAULT_MEDICAL_BANNER } from "@/lib/imageUtils";
import { CourseType } from "@/types";
import { 
  GraduationCap, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  CheckCircle2, 
  FileText, 
  Video, 
  Image as ImageIcon, 
  Download, 
  Save, 
  X,
  Sparkles,
  Layers,
  Filter,
  Eye,
  EyeOff,
  CheckSquare,
  Square,
  Star,
  RotateCcw,
  ExternalLink,
  BookOpen,
  Building2,
  Briefcase,
  Sliders,
  Upload,
  Link as LinkIcon,
  RefreshCw,
  AlertCircle
} from "lucide-react";

interface AdminCourseItem {
  id: number;
  title: string;
  slug: string;
  tagline?: string;
  courseType: CourseType;
  categoryName: string;
  categoryId?: number;
  duration: string;
  clinicalHours: number;
  feeINR: number;
  feeUSD?: number;
  emiStartingINR?: number;
  eligibility?: string;
  skillsCovered?: string[];
  careerOpportunities?: string[];
  clinicalHospitals?: string[];
  curriculum?: {
    moduleNumber: number;
    title: string;
    topics: string[];
  }[];
  heroImage: string;
  brochureName?: string;
  videoUrl?: string;
  isPublished?: boolean;
  priority?: 1 | 2 | 3;
  ratingVal?: number;
  ratingCount?: number;
  totalEnrolled?: number;
  nextBatchDate?: string;
}

const API_BASE = "/api/courses";

export default function AdminCoursesPage() {
  const [dynamicCategories, setDynamicCategories] = useState<any[]>(categories);

  const [isHydrated, setIsHydrated] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const formattedDefaults = initialCourses.map((c, idx) => ({
    ...c,
    isPublished: c.isPublished !== undefined ? c.isPublished : true,
    priority: ((c.priority || (idx < 10 ? 1 : idx < 18 ? 2 : 3))) as 1 | 2 | 3,
  }));

  const [coursesList, setCoursesList] = useState<AdminCourseItem[]>(formattedDefaults);

  // Fetch courses from API on mount
  const fetchCourses = async () => {
    try {
      const res = await fetch(API_BASE);
      const data = await res.json();
      if (data.courses && Array.isArray(data.courses) && data.courses.length > 0) {
        const mapped = data.courses.map((c: any, idx: number) => ({
          ...c,
          heroImage: c.heroImage || "",
          isPublished: c.isActive !== false,
          priority: (c.priority || (idx < 10 ? 1 : idx < 18 ? 2 : 3)) as 1 | 2 | 3,
          skillsCovered: Array.isArray(c.skillsCovered) ? c.skillsCovered : [],
          careerOpportunities: Array.isArray(c.careerScope) ? c.careerScope : (Array.isArray(c.careerOpportunities) ? c.careerOpportunities : []),
          clinicalHospitals: typeof c.clinicalHospitals === "string"
            ? c.clinicalHospitals.split(", ").filter(Boolean)
            : (Array.isArray(c.clinicalHospitals) ? c.clinicalHospitals : []),
          curriculum: Array.isArray(c.curriculum) ? c.curriculum : [],
          faqs: Array.isArray(c.faqs) ? c.faqs : [],
        }));
        setCoursesList(mapped);
      }
    } catch (err) {
      console.error("Failed to fetch courses from API:", err);
    } finally {
      setIsHydrated(true);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const [search, setSearch] = useState("");
  const [selectedFormatFilter, setSelectedFormatFilter] = useState<string>("ALL");
  const [selectedPriorityFilter, setSelectedPriorityFilter] = useState<string>("ALL");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>("ALL");
  
  // Multiple Select State
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  
  // Edit Modal State & Modal Tabs
  const [editingCourse, setEditingCourse] = useState<AdminCourseItem | null>(null);
  const [modalTab, setModalTab] = useState<"GENERAL" | "CURRICULUM" | "SKILLS_CAREER" | "MEDIA">("GENERAL");
  const [skillsInput, setSkillsInput] = useState<string>("");
  const [careersInput, setCareersInput] = useState<string>("");
  const [hospitalsInput, setHospitalsInput] = useState<string>("");

  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [pickerTargetField, setPickerTargetField] = useState<string>("");
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);
  const [isCompressingImage, setIsCompressingImage] = useState(false);
  const directImageInputRef = useRef<HTMLInputElement | null>(null);

  // Update local state (API calls are made individually per action)
  const updateCoursesState = (newList: AdminCourseItem[]) => {
    setCoursesList(newList);
  };

  // Reset: re-fetch from API
  const handleResetToDefaults = async () => {
    if (confirm("Refresh courses from database?")) {
      await fetchCourses();
      setSelectedIds([]);
      showNotification("Courses refreshed from database.");
    }
  };

  // Filtered List
  const filtered = coursesList.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.categoryName.toLowerCase().includes(search.toLowerCase()) ||
      c.slug.toLowerCase().includes(search.toLowerCase());

    const matchesFormat =
      selectedFormatFilter === "ALL" || c.courseType === selectedFormatFilter;

    const matchesPriority =
      selectedPriorityFilter === "ALL" || c.priority === Number(selectedPriorityFilter);

    const matchesStatus =
      selectedStatusFilter === "ALL" ||
      (selectedStatusFilter === "PUBLISHED" && c.isPublished) ||
      (selectedStatusFilter === "HIDDEN" && !c.isPublished);

    return matchesSearch && matchesFormat && matchesPriority && matchesStatus;
  });

  const showNotification = (msg: string) => {
    setNotificationMsg(msg);
    setTimeout(() => setNotificationMsg(null), 2500);
  };

  // Toggle single course show/hide
  const toggleCourseStatus = (id: number) => {
    const updated = coursesList.map((c) => {
      if (c.id === id) {
        const nextStatus = !c.isPublished;
        showNotification(`Course ${nextStatus ? "Published (Visible)" : "Hidden (Draft)"}`);
        return { ...c, isPublished: nextStatus };
      }
      return c;
    });
    updateCoursesState(updated);
  };

  // Change single course priority (1 -> 2 -> 3 -> 1)
  const cycleCoursePriority = (id: number) => {
    const updated = coursesList.map((c) => {
      if (c.id === id) {
        const nextPriority = (((c.priority || 1) % 3) + 1) as 1 | 2 | 3;
        showNotification(`Priority updated to Level ${nextPriority}`);
        return { ...c, priority: nextPriority };
      }
      return c;
    });
    updateCoursesState(updated);
  };

  // Multi-Select handlers
  const handleSelectAll = () => {
    if (selectedIds.length === filtered.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filtered.map((c) => c.id));
    }
  };

  const handleToggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Bulk Actions
  const handleBulkSetStatus = (status: boolean) => {
    const updated = coursesList.map((c) =>
      selectedIds.includes(c.id) ? { ...c, isPublished: status } : c
    );
    updateCoursesState(updated);
    showNotification(`${selectedIds.length} Courses marked as ${status ? "Published" : "Hidden"}`);
  };

  const handleBulkSetPriority = (priority: 1 | 2 | 3) => {
    const updated = coursesList.map((c) =>
      selectedIds.includes(c.id) ? { ...c, priority } : c
    );
    updateCoursesState(updated);
    showNotification(`${selectedIds.length} Courses set to Priority ${priority}`);
  };

  const handleBulkDelete = () => {
    if (confirm(`Are you sure you want to delete ${selectedIds.length} selected courses?`)) {
      const updated = coursesList.filter((c) => !selectedIds.includes(c.id));
      updateCoursesState(updated);
      setSelectedIds([]);
      showNotification("Selected courses deleted.");
    }
  };

  const openPicker = (field: string) => {
    setPickerTargetField(field);
    setIsMediaPickerOpen(true);
  };

  const handleMediaSelected = (media: MediaItem) => {
    setEditingCourse((prev) => {
      if (!prev) return null;
      if (pickerTargetField === "heroImage") {
        return { ...prev, heroImage: media.url };
      } else if (pickerTargetField === "brochure") {
        return { ...prev, brochureName: media.fileName };
      } else if (pickerTargetField === "video") {
        return { ...prev, videoUrl: media.url };
      }
      return prev;
    });
  };

  const handleDirectImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsCompressingImage(true);
      // Compress first
      const result = await compressImageFile(file, {
        maxWidth: 800,
        maxHeight: 480,
        quality: 0.7,
        mimeType: "image/webp",
      });
      // Upload to server via API
      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dataUrl: result.dataUrl,
          fileName: file.name.replace(/\.[^.]+$/, ".webp"),
          folder: "courses",
        }),
      });
      const uploadData = await uploadRes.json();
      if (uploadData.success && uploadData.url) {
        setEditingCourse((prev) => (prev ? { ...prev, heroImage: uploadData.url, heroImageMediaId: uploadData.mediaFileId } : null));
        showNotification(`Image uploaded to server (${uploadData.size})!`);
      } else {
        // Fallback to data URL if upload fails
        setEditingCourse((prev) => (prev ? { ...prev, heroImage: result.dataUrl } : null));
        showNotification(`Image compressed (${result.sizeFormatted}) — saved locally`);
      }
    } catch (err) {
      console.error("Failed to upload image:", err);
      alert("Failed to process image. Please try another file.");
    } finally {
      setIsCompressingImage(false);
      if (e.target) e.target.value = "";
    }
  };

  const openCreateModal = () => {
    const newId = Date.now();
    setSkillsInput("Clinical Bedside Examination, Emergency Management, Diagnostic Review, Case Logbooks");
    setCareersInput("Consultant Specialist, Department In-Charge, Senior Resident, Clinical Lead");
    setHospitalsInput("Apollo Hospitals, Fortis Healthcare, Max Super Speciality, Medanta");
    setModalTab("GENERAL");

    setEditingCourse({
      id: newId,
      title: "",
      slug: "",
      tagline: "Comprehensive clinical training program with hands-on hospital attachment.",
      courseType: "FELLOWSHIP" as CourseType,
      categoryName: dynamicCategories[0]?.name || "Cardiology",
      duration: "12 Months (Hybrid)",
      clinicalHours: 120,
      feeINR: 185000,
      feeUSD: 2400,
      emiStartingINR: 7800,
      eligibility: "MBBS / MD / DNB recognized by NMC or equivalent international medical council.",
      curriculum: [
        {
          moduleNumber: 1,
          title: "Foundations & Diagnostic Protocols",
          topics: ["Core Pathophysiology", "Diagnostic Workup", "Initial Stabilization"],
        },
        {
          moduleNumber: 2,
          title: "Advanced Clinical & Procedural Mastery",
          topics: ["Bedside Interventions", "Hands-on Techniques", "Complication Management"],
        },
        {
          moduleNumber: 3,
          title: "Emergency Care & Case Logbook Defense",
          topics: ["Emergency Protocols", "Clinical Audit", "Viva & Final Evaluation"],
        },
      ],
      skillsCovered: ["Clinical Examination", "Bedside Procedures", "Diagnostic Review", "Emergency Protocols"],
      careerOpportunities: ["Consultant Specialist", "Department In-Charge", "Senior Resident"],
      clinicalHospitals: ["Apollo Hospitals", "Fortis Healthcare", "Max Super Speciality", "Medanta"],
      heroImage: "https://images.unsplash.com/photo-1551076805-e1869033e561?w=800&auto=format&fit=crop&q=80",
      brochureName: "Course_Brochure_2026.pdf",
      videoUrl: "",
      isPublished: true,
      priority: 1,
      ratingVal: 4.9,
      ratingCount: 150,
      totalEnrolled: 450,
      nextBatchDate: "1st of Next Month",
    });
  };

  const openEditModal = (course: AdminCourseItem) => {
    setSkillsInput(course.skillsCovered ? course.skillsCovered.join(", ") : "");
    setCareersInput(course.careerOpportunities ? course.careerOpportunities.join(", ") : "");
    setHospitalsInput(course.clinicalHospitals ? course.clinicalHospitals.join(", ") : "");
    setModalTab("GENERAL");

    setEditingCourse({
      ...course,
      curriculum: course.curriculum || [
        {
          moduleNumber: 1,
          title: "Core Clinical Curriculum",
          topics: ["Clinical Assessment", "Diagnostic Mastery", "Bedside Rounds"],
        },
      ],
      brochureName: course.brochureName || "Brochure_2026.pdf",
      videoUrl: course.videoUrl || "",
    });
  };

  const handleSaveCourse = async () => {
    try {
      if (!editingCourse || !editingCourse.title?.trim()) {
        alert("Please provide a Course Title.");
        return;
      }
      setIsSaving(true);

      const rawSlug = (editingCourse.slug || editingCourse.title || "").trim();
      const slug = rawSlug.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

      const skills = skillsInput
        ? skillsInput.split(",").map((s) => s.trim()).filter(Boolean)
        : editingCourse.skillsCovered || ["Clinical Training", "Bedside Procedures"];

      const careers = careersInput
        ? careersInput.split(",").map((s) => s.trim()).filter(Boolean)
        : editingCourse.careerOpportunities || ["Consultant Specialist"];

      const hospitals = hospitalsInput
        ? hospitalsInput.split(",").map((s) => s.trim()).filter(Boolean)
        : editingCourse.clinicalHospitals || ["Apollo Hospitals", "Fortis Healthcare"];

      const payload = {
        title: editingCourse.title,
        slug,
        tagline: editingCourse.tagline,
        courseType: editingCourse.courseType || "FELLOWSHIP",
        categoryName: editingCourse.categoryName,
        duration: editingCourse.duration,
        clinicalHours: editingCourse.clinicalHours || 0,
        feeINR: editingCourse.feeINR || 0,
        feeUSD: editingCourse.feeUSD || 0,
        emiStartingINR: editingCourse.emiStartingINR || 0,
        eligibility: editingCourse.eligibility,
        heroImageMediaId: (editingCourse as any).heroImageMediaId || undefined,
        curriculum: editingCourse.curriculum || [],
        skillsCovered: skills,
        careerScope: careers,
        clinicalHospitals: hospitals.join(", "),
        totalEnrolled: editingCourse.totalEnrolled || 250,
        isFeatured: editingCourse.priority === 1,
        isPopular: editingCourse.priority === 1 || editingCourse.priority === 2,
        isActive: editingCourse.isPublished !== false,
        ratingVal: editingCourse.ratingVal || 4.9,
        ratingCount: editingCourse.ratingCount || 120,
      };

      // Determine if this is an existing DB course (has numeric ID) or new
      const existsInDB = coursesList.some((c) => c.id === editingCourse.id && c.id < 1000000000);

      let res;
      if (existsInDB) {
        // UPDATE existing course
        res = await fetch(`${API_BASE}/${editingCourse.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        // CREATE new course
        res = await fetch(API_BASE, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      const result = await res.json();
      if (result.success || result.course) {
        showNotification("Course saved to database successfully!");
        await fetchCourses(); // Refresh from DB
      } else {
        showNotification(result.error || "Failed to save course to database");
        // Fallback: update local state
        const updated: AdminCourseItem = { ...editingCourse, slug, skillsCovered: skills, careerOpportunities: careers, clinicalHospitals: hospitals };
        const updatedList = coursesList.some((c) => c.id === updated.id)
          ? coursesList.map((c) => (c.id === updated.id ? updated : c))
          : [updated, ...coursesList];
        updateCoursesState(updatedList);
      }
      setEditingCourse(null);
    } catch (err) {
      console.error("Error saving course:", err);
      alert("An unexpected error occurred while saving the course.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteCourse = async (id: number) => {
    if (confirm("Are you sure you want to delete this program?")) {
      try {
        await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
        const updated = coursesList.filter((c) => c.id !== id);
        updateCoursesState(updated);
        setSelectedIds((prev) => prev.filter((item) => item !== id));
        showNotification("Course deleted from database.");
      } catch (err) {
        console.error("Failed to delete course:", err);
        showNotification("Failed to delete course.");
      }
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 font-display">
            Course Management & Structured Content
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Add new medical programs, edit curriculum, skills, fees, priority, and automatically create live course pages.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {notificationMsg && (
            <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-2 rounded-xl animate-in fade-in shadow-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{notificationMsg}</span>
            </div>
          )}

          <button
            type="button"
            onClick={async () => {
              await fetchCourses();
              showNotification("Catalog refreshed from database!");
            }}
            className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold py-2.5 px-3 rounded-xl border border-slate-200 shadow-2xs transition-all cursor-pointer"
            title="Reload catalog state from database"
          >
            <RefreshCw className="w-3.5 h-3.5 text-blue-600" />
            <span>Refresh</span>
          </button>

          <button
            onClick={handleResetToDefaults}
            className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-2.5 px-3 rounded-xl transition-all cursor-pointer"
            title="Reset to default seed catalog"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Defaults</span>
          </button>

          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 bg-[#0B4F9C] hover:bg-[#083E7D] text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Course</span>
          </button>
        </div>
      </div>

      {/* Floating Multi-Select Batch Action Bar */}
      {selectedIds.length > 0 && (
        <div className="bg-slate-900 text-white p-3 sm:p-4 rounded-2xl shadow-xl flex flex-wrap items-center justify-between gap-3 animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2">
            <span className="bg-blue-600 text-white text-xs font-black px-2.5 py-1 rounded-lg">
              {selectedIds.length} Selected
            </span>
            <span className="text-xs text-slate-300 hidden sm:inline">
              Bulk Actions:
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap text-xs">
            <button
              onClick={() => handleBulkSetStatus(true)}
              className="inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Show All</span>
            </button>
            <button
              onClick={() => handleBulkSetStatus(false)}
              className="inline-flex items-center gap-1 bg-slate-700 hover:bg-slate-600 text-white px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer"
            >
              <EyeOff className="w-3.5 h-3.5" />
              <span>Hide All</span>
            </button>

            <div className="flex items-center gap-1 bg-slate-800 p-0.5 rounded-lg border border-slate-700">
              <span className="text-[10px] text-slate-400 px-1 font-bold">Priority:</span>
              <button
                onClick={() => handleBulkSetPriority(1)}
                className="px-2 py-1 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-[10px] cursor-pointer"
                title="Priority 1 (Top Featured)"
              >
                P1
              </button>
              <button
                onClick={() => handleBulkSetPriority(2)}
                className="px-2 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-black text-[10px] cursor-pointer"
                title="Priority 2 (Standard)"
              >
                P2
              </button>
              <button
                onClick={() => handleBulkSetPriority(3)}
                className="px-2 py-1 rounded bg-slate-600 hover:bg-slate-500 text-white font-black text-[10px] cursor-pointer"
                title="Priority 3 (Low)"
              >
                P3
              </button>
            </div>

            <button
              onClick={handleBulkDelete}
              className="inline-flex items-center gap-1 bg-red-600/80 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Delete</span>
            </button>

            <button
              onClick={() => setSelectedIds([])}
              className="text-slate-400 hover:text-white px-2 py-1 text-xs cursor-pointer"
            >
              Deselect
            </button>
          </div>
        </div>
      )}

      {/* Courses Filter Tabs & Controls */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        
        {/* Top Control Bar (Format Tabs, Priority & Status Filters, Search) */}
        <div className="p-4 border-b border-slate-200 flex flex-col lg:flex-row items-center justify-between gap-4">
          
          {/* Format Selector Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full lg:w-auto pb-1 lg:pb-0">
            <button
              onClick={() => setSelectedFormatFilter("ALL")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedFormatFilter === "ALL"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              All Formats ({coursesList.length})
            </button>
            <button
              onClick={() => setSelectedFormatFilter("FELLOWSHIP")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedFormatFilter === "FELLOWSHIP"
                  ? "bg-[#0B4F9C] text-white shadow-xs"
                  : "bg-blue-50 text-blue-800 hover:bg-blue-100"
              }`}
            >
              Fellowships ({coursesList.filter(c => c.courseType === "FELLOWSHIP").length})
            </button>
            <button
              onClick={() => setSelectedFormatFilter("PG_DIPLOMA")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedFormatFilter === "PG_DIPLOMA"
                  ? "bg-[#0D9468] text-white shadow-xs"
                  : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
              }`}
            >
              PG Diplomas ({coursesList.filter(c => c.courseType === "PG_DIPLOMA").length})
            </button>
            <button
              onClick={() => setSelectedFormatFilter("ADVANCED_CERTIFICATE")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedFormatFilter === "ADVANCED_CERTIFICATE"
                  ? "bg-purple-700 text-white shadow-xs"
                  : "bg-purple-50 text-purple-800 hover:bg-purple-100"
              }`}
            >
              Certificates ({coursesList.filter(c => c.courseType === "ADVANCED_CERTIFICATE").length})
            </button>
          </div>

          {/* Quick Dropdown Filters + Search */}
          <div className="flex items-center gap-2.5 w-full lg:w-auto flex-wrap sm:flex-nowrap">
            
            {/* Priority Filter */}
            <select
              value={selectedPriorityFilter}
              onChange={(e) => setSelectedPriorityFilter(e.target.value)}
              className="text-xs px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:bg-white focus:outline-hidden cursor-pointer"
            >
              <option value="ALL">All Priorities</option>
              <option value="1">🥇 Priority 1 (Top)</option>
              <option value="2">🥈 Priority 2 (Medium)</option>
              <option value="3">🥉 Priority 3 (Low)</option>
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="text-xs px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:bg-white focus:outline-hidden cursor-pointer"
            >
              <option value="ALL">All Status</option>
              <option value="PUBLISHED">🟢 Published Only</option>
              <option value="HIDDEN">⚪ Hidden / Draft</option>
            </select>

            {/* Search Box */}
            <div className="relative flex-1 sm:w-60">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search program, specialty..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-[#0B4F9C]"
              />
            </div>

          </div>

        </div>

        {/* Responsive Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[850px]">
            <thead className="bg-slate-50/90 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] select-none">
              <tr>
                <th className="py-3 px-4 w-10">
                  <button
                    onClick={handleSelectAll}
                    className="p-1 rounded text-slate-500 hover:text-slate-900 cursor-pointer"
                    title={selectedIds.length === filtered.length ? "Deselect All" : "Select All"}
                  >
                    {selectedIds.length > 0 && selectedIds.length === filtered.length ? (
                      <CheckSquare className="w-4 h-4 text-blue-600" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400" />
                    )}
                  </button>
                </th>
                <th className="py-3 px-4">Program & Specialty</th>
                <th className="py-3 px-4">Format</th>
                <th className="py-3 px-4">Priority Level</th>
                <th className="py-3 px-4">Visibility / Status</th>
                <th className="py-3 px-4">Tuition & EMI</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((course) => {
                const isSelected = selectedIds.includes(course.id);
                return (
                  <tr 
                    key={course.id} 
                    className={`transition-colors ${
                      isSelected ? "bg-blue-50/60" : "hover:bg-slate-50/80"
                    } ${!course.isPublished ? "opacity-60 bg-slate-50/40" : ""}`}
                  >
                    {/* Row Checkbox */}
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleToggleSelect(course.id)}
                        className="p-1 rounded text-slate-400 hover:text-blue-600 cursor-pointer"
                      >
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4 text-blue-600" />
                        ) : (
                          <Square className="w-4 h-4" />
                        )}
                      </button>
                    </td>

                    {/* Title & Specialty with Image Thumbnail */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-9 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden shrink-0 shadow-2xs relative">
                          {isHydrated ? (
                            <img
                              key={course.heroImage || String(course.id)}
                              src={course.heroImage || DEFAULT_MEDICAL_BANNER}
                              alt={course.title}
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = DEFAULT_MEDICAL_BANNER;
                              }}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="absolute inset-0 bg-slate-200 animate-pulse" />
                          )}
                        </div>
                        <div>
                          <div className="font-extrabold text-slate-900 leading-snug">
                            {course.title}
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-blue-700 font-semibold mt-0.5">
                            <span>/{course.slug}</span>
                            <span>•</span>
                            <span className="text-slate-600 font-bold">{course.categoryName}</span>
                            <a
                              href={`/courses/${course.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-0.5 text-blue-600 hover:underline font-bold"
                              title="View Live Course Page"
                            >
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Format Badge */}
                    <td className="py-3.5 px-4">
                      <span className={`inline-block text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                        course.courseType === "FELLOWSHIP"
                          ? "bg-blue-100 text-blue-800 border border-blue-200"
                          : course.courseType === "PG_DIPLOMA"
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                          : "bg-purple-100 text-purple-800 border border-purple-200"
                      }`}>
                        {course.courseType.replace("_", " ")}
                      </span>
                    </td>

                    {/* Interactive Priority Badge (1, 2, 3) */}
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => cycleCoursePriority(course.id)}
                        className={`inline-flex items-center gap-1.5 text-[10px] font-black px-2.5 py-1 rounded-xl shadow-2xs transition-all cursor-pointer hover:scale-105 active:scale-95 ${
                          course.priority === 1
                            ? "bg-amber-100 text-amber-900 border border-amber-300"
                            : course.priority === 2
                            ? "bg-blue-100 text-blue-900 border border-blue-300"
                            : "bg-slate-100 text-slate-700 border border-slate-300"
                        }`}
                        title="Click to toggle Priority: Level 1 (Top) -> Level 2 -> Level 3"
                      >
                        <Star className={`w-3 h-3 ${course.priority === 1 ? "fill-amber-500 text-amber-600" : "text-slate-400"}`} />
                        <span>Priority {course.priority || 1}</span>
                      </button>
                    </td>

                    {/* Toggle Button for Show / Hide Status */}
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => toggleCourseStatus(course.id)}
                        className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-3 py-1 rounded-full transition-all cursor-pointer ${
                          course.isPublished
                            ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-200"
                            : "bg-slate-200 text-slate-600 hover:bg-slate-300 border border-slate-300"
                        }`}
                        title={course.isPublished ? "Click to Hide on Website" : "Click to Show / Publish on Website"}
                      >
                        {course.isPublished ? (
                          <>
                            <Eye className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Published</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3.5 h-3.5 text-slate-500" />
                            <span>Hidden</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Tuition & Duration */}
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      <div>₹{course.feeINR.toLocaleString("en-IN")}</div>
                      <div className="text-[10px] text-slate-500 font-medium">
                        {course.duration}
                      </div>
                    </td>

                    {/* Actions: Clean horizontal row alignment */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(course)}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-xl cursor-pointer transition-all border border-blue-200/60 shadow-2xs"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteCourse(course.id)}
                          className="inline-flex items-center justify-center text-xs font-bold text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200/60 w-7.5 h-7.5 rounded-xl cursor-pointer transition-all shadow-2xs"
                          title="Delete Course"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 bg-white">
            <Filter className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <div className="text-sm font-bold text-slate-700">No courses match your filter</div>
            <p className="text-xs text-slate-400 mt-0.5">Try resetting search or filter criteria</p>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* ADVANCED MULTI-TAB COURSE CONTENT CREATE / EDIT MODAL                     */}
      {/* ========================================================================= */}
      {editingCourse && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
            
            {/* Modal Top Header */}
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="text-base font-black text-slate-900 font-display">
                  {editingCourse.title ? `Edit Course: ${editingCourse.title}` : "Add New Medical Course"}
                </h3>
                <p className="text-xs text-slate-500">
                  Manage syllabus, clinical modules, skills, eligibility, fees, and attachments.
                </p>
              </div>
              <button
                onClick={() => setEditingCourse(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Navigation Tabs (High Contrast Premium Segmented Controls) */}
            <div className="bg-slate-100/90 p-1.5 rounded-2xl mx-6 mt-4 border border-slate-200 flex items-center gap-1.5 overflow-x-auto shadow-inner">
              <button
                type="button"
                onClick={() => setModalTab("GENERAL")}
                className={`flex-1 min-w-[140px] py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  modalTab === "GENERAL"
                    ? "bg-[#0B4F9C] text-white shadow-md shadow-blue-900/20"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/80"
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>1. General & Fees</span>
              </button>

              <button
                type="button"
                onClick={() => setModalTab("CURRICULUM")}
                className={`flex-1 min-w-[160px] py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  modalTab === "CURRICULUM"
                    ? "bg-[#0B4F9C] text-white shadow-md shadow-blue-900/20"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/80"
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>2. Syllabus & Modules</span>
              </button>

              <button
                type="button"
                onClick={() => setModalTab("SKILLS_CAREER")}
                className={`flex-1 min-w-[150px] py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  modalTab === "SKILLS_CAREER"
                    ? "bg-[#0B4F9C] text-white shadow-md shadow-blue-900/20"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/80"
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>3. Skills & Hospitals</span>
              </button>

              <button
                type="button"
                onClick={() => setModalTab("MEDIA")}
                className={`flex-1 min-w-[140px] py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  modalTab === "MEDIA"
                    ? "bg-[#0B4F9C] text-white shadow-md shadow-blue-900/20"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/80"
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>4. Media Attachments</span>
              </button>
            </div>

            {/* Modal Body Tabs */}
            <div className="p-6 space-y-4 overflow-y-auto flex-1">
              
              {/* TAB 1: GENERAL & FEES */}
              {modalTab === "GENERAL" && (
                <div className="space-y-4">
                  
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Course Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Fellowship in Clinical Cardiology"
                      value={editingCourse.title}
                      onChange={(e) => setEditingCourse({ ...editingCourse, title: e.target.value })}
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:bg-white focus:outline-hidden focus:border-[#0B4F9C]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        URL Slug (e.g. fellowship-in-clinical-cardiology)
                      </label>
                      <input
                        type="text"
                        placeholder="fellowship-in-clinical-cardiology"
                        value={editingCourse.slug}
                        onChange={(e) => setEditingCourse({ ...editingCourse, slug: e.target.value })}
                        className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-700 focus:bg-white focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Next Batch Date
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 2026-09-01 or 1st of Next Month"
                        value={editingCourse.nextBatchDate || "1st of Next Month"}
                        onChange={(e) => setEditingCourse({ ...editingCourse, nextBatchDate: e.target.value })}
                        className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Tagline / Program Summary
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Comprehensive 12-Month Clinical Training in Echo, ECG, Cath Lab Observation & ICCU Protocols"
                      value={editingCourse.tagline || ""}
                      onChange={(e) => setEditingCourse({ ...editingCourse, tagline: e.target.value })}
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:bg-white focus:outline-hidden"
                    />
                  </div>

                  {/* Priority & Status Controls */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        Display Priority Level <span className="text-amber-600">★</span>
                      </label>
                      <select
                        value={editingCourse.priority || 1}
                        onChange={(e) => setEditingCourse({ ...editingCourse, priority: Number(e.target.value) as 1 | 2 | 3 })}
                        className="w-full text-xs p-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-900 cursor-pointer"
                      >
                        <option value={1}>🥇 Priority 1 (Top Featured on Homepage)</option>
                        <option value={2}>🥈 Priority 2 (Standard Catalog Display)</option>
                        <option value={3}>🥉 Priority 3 (Lower Priority / Archive)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        Visibility Status
                      </label>
                      <div className="flex items-center justify-between p-2 bg-white rounded-xl border border-slate-200">
                        <div className="flex items-center gap-2">
                          <span className={`w-2.5 h-2.5 rounded-full ${editingCourse.isPublished ? "bg-emerald-500 animate-pulse" : "bg-slate-400"}`} />
                          <span className="text-xs font-extrabold text-slate-800">
                            {editingCourse.isPublished ? "Published (Visible)" : "Hidden (Draft)"}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setEditingCourse({ ...editingCourse, isPublished: !editingCourse.isPublished })}
                          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                            editingCourse.isPublished ? "bg-emerald-600" : "bg-slate-300"
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                              editingCourse.isPublished ? "translate-x-5" : "translate-x-0"
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Course Format & Specialty Category */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Course Format (3 Core Types) <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={editingCourse.courseType || "FELLOWSHIP"}
                        onChange={(e) => setEditingCourse({ ...editingCourse, courseType: e.target.value as CourseType })}
                        className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-black text-blue-900 focus:bg-white cursor-pointer"
                      >
                        <option value="FELLOWSHIP">Fellowship (Post Graduate - 12 Mos)</option>
                        <option value="PG_DIPLOMA">PG Diploma (Post Graduate - 12 Mos)</option>
                        <option value="ADVANCED_CERTIFICATE">Advanced Certificate (6 Mos)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Specialty Category <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={editingCourse.categoryName}
                        onChange={(e) => setEditingCourse({ ...editingCourse, categoryName: e.target.value })}
                        className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:bg-white cursor-pointer"
                      >
                        {dynamicCategories.map((cat) => (
                          <option key={cat.id} value={cat.name}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Duration & Clinical Bedside Hours */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Duration & Delivery Mode
                      </label>
                      <input
                        type="text"
                        value={editingCourse.duration}
                        onChange={(e) => setEditingCourse({ ...editingCourse, duration: e.target.value })}
                        className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Clinical Bedside Hours
                      </label>
                      <input
                        type="number"
                        value={editingCourse.clinicalHours || 120}
                        onChange={(e) => setEditingCourse({ ...editingCourse, clinicalHours: Number(e.target.value) })}
                        className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:bg-white"
                      />
                    </div>
                  </div>

                  {/* Fees & EMI */}
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Fee (INR)
                      </label>
                      <input
                        type="number"
                        value={editingCourse.feeINR}
                        onChange={(e) => setEditingCourse({ ...editingCourse, feeINR: Number(e.target.value) })}
                        className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Fee (USD - NRI/Intl)
                      </label>
                      <input
                        type="number"
                        value={editingCourse.feeUSD || 2400}
                        onChange={(e) => setEditingCourse({ ...editingCourse, feeUSD: Number(e.target.value) })}
                        className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        0% EMI (INR/mo)
                      </label>
                      <input
                        type="number"
                        value={editingCourse.emiStartingINR}
                        onChange={(e) => setEditingCourse({ ...editingCourse, emiStartingINR: Number(e.target.value) })}
                        className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-emerald-700 focus:bg-white"
                      />
                    </div>
                  </div>

                  {/* Eligibility */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Candidate Eligibility
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. MBBS / MD / DNB recognized by NMC or equivalent"
                      value={editingCourse.eligibility || ""}
                      onChange={(e) => setEditingCourse({ ...editingCourse, eligibility: e.target.value })}
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white"
                    />
                  </div>

                </div>
              )}

              {/* TAB 2: CURRICULUM MODULES */}
              {modalTab === "CURRICULUM" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                        Clinical Curriculum & Modules
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Add modules and key topics covered in each section.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const current = editingCourse.curriculum || [];
                        const nextMod = {
                          moduleNumber: current.length + 1,
                          title: `Module ${current.length + 1}: Clinical Mastery`,
                          topics: ["Diagnostic Workup", "Clinical Case Review", "Bedside Rounds"],
                        };
                        setEditingCourse({ ...editingCourse, curriculum: [...current, nextMod] });
                      }}
                      className="inline-flex items-center gap-1 text-xs font-bold bg-blue-50 text-blue-700 hover:bg-blue-100 px-3 py-1.5 rounded-lg cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Module</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {(editingCourse.curriculum || []).map((mod, idx) => (
                      <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-blue-700 uppercase">
                            Module {mod.moduleNumber || idx + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = editingCourse.curriculum?.filter((_, i) => i !== idx);
                              setEditingCourse({ ...editingCourse, curriculum: updated });
                            }}
                            className="text-xs text-red-500 hover:underline cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Module Title</label>
                          <input
                            type="text"
                            value={mod.title}
                            onChange={(e) => {
                              const nextCurriculum = [...(editingCourse.curriculum || [])];
                              nextCurriculum[idx].title = e.target.value;
                              setEditingCourse({ ...editingCourse, curriculum: nextCurriculum });
                            }}
                            className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg font-bold"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Topics (Comma separated)</label>
                          <input
                            type="text"
                            value={mod.topics.join(", ")}
                            onChange={(e) => {
                              const nextCurriculum = [...(editingCourse.curriculum || [])];
                              nextCurriculum[idx].topics = e.target.value.split(",").map(t => t.trim()).filter(Boolean);
                              setEditingCourse({ ...editingCourse, curriculum: nextCurriculum });
                            }}
                            className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg text-slate-700"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: SKILLS, CAREER & HOSPITALS */}
              {modalTab === "SKILLS_CAREER" && (
                <div className="space-y-4">
                  
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Key Clinical Skills Acquired (Comma separated)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 2D Echocardiography, Emergency TPI Assistance, Holter Analysis"
                      value={skillsInput}
                      onChange={(e) => setSkillsInput(e.target.value)}
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Career Scope & Job Opportunities (Comma separated)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Consultant Clinical Cardiologist, ICCU In-Charge Physician, Echocardiography Specialist"
                      value={careersInput}
                      onChange={(e) => setCareersInput(e.target.value)}
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Partner Hospital Attachments (Comma separated)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Apollo Hospitals, Fortis Healthcare, Max Super Speciality, Medanta The Medicity"
                      value={hospitalsInput}
                      onChange={(e) => setHospitalsInput(e.target.value)}
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
                    />
                  </div>

                </div>
              )}

              {/* TAB 4: MEDIA ATTACHMENTS */}
              {modalTab === "MEDIA" && (
                <div className="space-y-6">
                  
                  {/* Hidden Direct File Input */}
                  <input
                    type="file"
                    ref={directImageInputRef}
                    accept="image/png, image/jpeg, image/webp, image/svg+xml"
                    onChange={handleDirectImageUpload}
                    className="hidden"
                  />

                  {/* Course Hero Banner Image Panel */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                          <ImageIcon className="w-4 h-4 text-[#0B4F9C]" />
                          <span>Course Hero Banner Image</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Featured in course cards on the catalog, search filters, and page banners.
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => directImageInputRef.current?.click()}
                          disabled={isCompressingImage}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-800 bg-white hover:bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs cursor-pointer transition-all disabled:opacity-50"
                        >
                          {isCompressingImage ? (
                            <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-600" />
                          ) : (
                            <Upload className="w-3.5 h-3.5 text-blue-600" />
                          )}
                          <span>{isCompressingImage ? "Compressing..." : "Upload from Device"}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => openPicker("heroImage")}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0B4F9C] hover:bg-blue-100/60 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-200 cursor-pointer transition-all"
                        >
                          <Layers className="w-3.5 h-3.5" />
                          <span>Media Library</span>
                        </button>
                      </div>
                    </div>

                    {/* Banner Live Preview Box */}
                    <div className="relative rounded-2xl border border-slate-200 overflow-hidden bg-slate-950 aspect-[16/7] max-h-52 w-full group flex items-center justify-center">
                      <img
                        src={editingCourse.heroImage || DEFAULT_MEDICAL_BANNER}
                        alt="Course Hero Preview"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = DEFAULT_MEDICAL_BANNER;
                        }}
                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500 opacity-90"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20 pointer-events-none" />
                      
                      <div className="absolute top-3 left-3 flex items-center gap-2">
                        <span className="bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-full border border-white/20">
                          {editingCourse.heroImage?.startsWith("data:") ? "Uploaded Image (Optimized)" : "Online Image URL"}
                        </span>
                      </div>

                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                        <div className="truncate text-xs font-black drop-shadow-md">
                          {editingCourse.title || "Course Title Preview"}
                        </div>
                        <span className="text-[10px] bg-emerald-500/80 text-white px-2 py-0.5 rounded-full font-black">
                          {editingCourse.courseType || "FELLOWSHIP"}
                        </span>
                      </div>
                    </div>

                    {/* Direct Image URL Input */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Direct Image URL (or paste external image link):
                      </label>
                      <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                          <LinkIcon className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="url"
                            placeholder="https://images.unsplash.com/... or https://..."
                            value={editingCourse.heroImage || ""}
                            onChange={(e) => setEditingCourse({ ...editingCourse, heroImage: e.target.value })}
                            className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:border-[#0B4F9C]"
                          />
                        </div>
                        {editingCourse.heroImage && (
                          <button
                            type="button"
                            onClick={() => setEditingCourse({ ...editingCourse, heroImage: DEFAULT_MEDICAL_BANNER })}
                            className="text-xs font-bold text-slate-500 hover:text-slate-800 bg-white border border-slate-200 px-3 py-2 rounded-xl"
                            title="Reset to default medical banner"
                          >
                            Reset
                          </button>
                        )}
                      </div>
                    </div>

                    {/* 1-Click Medical Banner Presets */}
                    <div>
                      <div className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider mb-2">
                        Quick Medical Presets (1-Click Apply):
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {MEDICAL_COURSE_PRESETS.map((preset, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              setEditingCourse({ ...editingCourse, heroImage: preset.url });
                              showNotification(`Applied ${preset.title} banner!`);
                            }}
                            className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                              editingCourse.heroImage === preset.url
                                ? "bg-[#0B4F9C] text-white border-[#0B4F9C] shadow-xs"
                                : "bg-white text-slate-700 border-slate-200 hover:border-slate-400 hover:bg-slate-100"
                            }`}
                          >
                            {preset.title}
                          </button>
                        ))}
                      </div>
                    </div>

                  </div>

                  {/* Brochure PDF Download */}
                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-800">Brochure PDF Download</div>
                        <div className="text-[10px] text-slate-400">{editingCourse.brochureName || "Course_Brochure_2026.pdf"}</div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => openPicker("brochure")}
                      className="text-xs font-bold text-red-600 hover:bg-red-100/60 px-3 py-1.5 rounded-lg border border-red-200 cursor-pointer"
                    >
                      Select PDF
                    </button>
                  </div>

                  {/* Video Attachment */}
                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                        <Video className="w-6 h-6" />
                      </div>
                      <div className="flex-1 max-w-sm">
                        <div className="text-xs font-bold text-slate-800">Introduction Video / YouTube Embed</div>
                        <input
                          type="text"
                          placeholder="Paste YouTube or MP4 video URL"
                          value={editingCourse.videoUrl || ""}
                          onChange={(e) => setEditingCourse({ ...editingCourse, videoUrl: e.target.value })}
                          className="w-full mt-1 text-xs px-2 py-1 bg-white border border-slate-200 rounded-lg focus:outline-hidden"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => openPicker("video")}
                      className="text-xs font-bold text-[#0B4F9C] hover:bg-blue-100/60 px-3 py-1.5 rounded-lg border border-blue-200 cursor-pointer ml-3"
                    >
                      Attach Video
                    </button>
                  </div>

                </div>
              )}

            </div>

            {/* Modal Footer Controls with Next / Back Wizard & Final Publish */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
              
              {/* Left Back / Cancel Button */}
              {modalTab === "GENERAL" ? (
                <button
                  type="button"
                  onClick={() => setEditingCourse(null)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200/80 py-2.5 px-4 rounded-xl shadow-2xs hover:shadow-xs transition-all cursor-pointer"
                >
                  Cancel
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    if (modalTab === "CURRICULUM") setModalTab("GENERAL");
                    else if (modalTab === "SKILLS_CAREER") setModalTab("CURRICULUM");
                    else if (modalTab === "MEDIA") setModalTab("SKILLS_CAREER");
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 py-2.5 px-4 rounded-xl shadow-2xs transition-all cursor-pointer"
                >
                  <span>← Back</span>
                </button>
              )}

              {/* Right Next / Publish Buttons */}
              <div className="flex items-center gap-2">
                {modalTab !== "MEDIA" ? (
                  <>
                    <button
                      type="button"
                      onClick={handleSaveCourse}
                      className="text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-200/80 hover:bg-slate-200 py-2.5 px-4 rounded-xl transition-all cursor-pointer hidden sm:inline-flex"
                    >
                      Save Draft
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (modalTab === "GENERAL") setModalTab("CURRICULUM");
                        else if (modalTab === "CURRICULUM") setModalTab("SKILLS_CAREER");
                        else if (modalTab === "SKILLS_CAREER") setModalTab("MEDIA");
                      }}
                      className="inline-flex items-center gap-1.5 bg-[#0B4F9C] hover:bg-[#083E7D] text-white text-xs font-bold py-2.5 px-5 rounded-xl shadow-sm transition-all cursor-pointer"
                    >
                      <span>
                        {modalTab === "GENERAL" && "Next: Syllabus & Modules →"}
                        {modalTab === "CURRICULUM" && "Next: Skills & Hospitals →"}
                        {modalTab === "SKILLS_CAREER" && "Next: Media Attachments →"}
                      </span>
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={handleSaveCourse}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-[#0B4F9C] hover:opacity-95 text-white text-xs font-black py-2.5 px-7 rounded-xl shadow-md transition-all cursor-pointer scale-105 active:scale-100"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save & Publish Course</span>
                  </button>
                )}
              </div>

            </div>

          </div>
        </div>
      )}

      {/* Media Picker Modal */}
      <MediaLibraryPickerModal
        isOpen={isMediaPickerOpen}
        onClose={() => setIsMediaPickerOpen(false)}
        onSelect={handleMediaSelected}
        allowedTypes={
          pickerTargetField === "heroImage"
            ? ["IMAGE"]
            : pickerTargetField === "video"
            ? ["VIDEO"]
            : ["PDF", "DOCUMENT"]
        }
        title={
          pickerTargetField === "heroImage"
            ? "Select Course Hero Banner Image"
            : pickerTargetField === "brochure"
            ? "Select Brochure PDF Document"
            : "Select Course Introduction Video"
        }
      />

    </div>
  );
}
