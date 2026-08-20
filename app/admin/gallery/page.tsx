"use client";

import React, { useState, useEffect, useRef } from "react";
import { MediaLibraryPickerModal, MediaItem } from "@/components/admin/MediaLibraryPickerModal";
import { 
  Sliders, 
  Plus, 
  Image as ImageIcon, 
  Trash2, 
  Edit, 
  X, 
  Save, 
  CheckCircle2, 
  FolderPlus,
  Video,
  Play,
  ExternalLink,
  Sparkles,
  Clock,
  Upload
} from "lucide-react";
import { FreeCourseVideo } from "@/components/sections/FreeCoursesVideoShowcase";

interface GalleryPhotoAsset {
  id: number;
  title: string;
  category: string;
  image: string;
  caption?: string;
}

const DEFAULT_FREE_COURSES: FreeCourseVideo[] = [
  {
    id: 1,
    title: "Airway Management in Emergency Medicine",
    specialty: "Emergency Medicine",
    duration: "24 mins",
    youtubeId: "yX3uS5d6pGk",
    youtubeUrl: "https://www.youtube.com/watch?v=yX3uS5d6pGk",
    thumbnailUrl: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: 2,
    title: "12-Lead ECG Interpretation & Arrhythmias",
    specialty: "Cardiology",
    duration: "32 mins",
    youtubeId: "V5vGzWvOQ6g",
    youtubeUrl: "https://www.youtube.com/watch?v=V5vGzWvOQ6g",
    thumbnailUrl: "https://images.unsplash.com/photo-1551076805-e1869033e561?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: 3,
    title: "Bedside ICU Hemodynamic Monitoring & Shock",
    specialty: "Critical Care",
    duration: "28 mins",
    youtubeId: "e9f78328h9s",
    youtubeUrl: "https://www.youtube.com/watch?v=e9f78328h9s",
    thumbnailUrl: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: 4,
    title: "Advanced Trauma Life Support (ATLS) Protocols",
    specialty: "Trauma & Acute Care",
    duration: "35 mins",
    youtubeId: "9jZ5f284k8a",
    youtubeUrl: "https://www.youtube.com/watch?v=9jZ5f284k8a",
    thumbnailUrl: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: 5,
    title: "Heart Failure Management & Drug Titration",
    specialty: "Clinical Cardiology",
    duration: "40 mins",
    youtubeId: "k3984jdf98a",
    youtubeUrl: "https://www.youtube.com/watch?v=k3984jdf98a",
    thumbnailUrl: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: 6,
    title: "Maxillofacial Trauma & Fracture Management",
    specialty: "Surgical Specialties",
    duration: "22 mins",
    youtubeId: "m3984kd98s",
    youtubeUrl: "https://www.youtube.com/watch?v=m3984kd98s",
    thumbnailUrl: "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=800&auto=format&fit=crop&q=80",
  },
];

const DEFAULT_GALLERY_PHOTOS: GalleryPhotoAsset[] = [
  { id: 1, title: "Cardiology Echo Hands-on Training", category: "Clinical Training", image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=500&auto=format&fit=crop&q=80", caption: "Doctors performing bedside 2D Echocardiography." },
  { id: 2, title: "Laparoscopic OT Assisting", category: "Hands-on Surgery", image: "https://images.unsplash.com/photo-1551076805-e1869033e561?w=500&auto=format&fit=crop&q=80", caption: "Endo-trainer pelvic box suturing drills." },
  { id: 3, title: "ICU Mechanical Ventilation Round", category: "Critical Care", image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=500&auto=format&fit=crop&q=80", caption: "Tertiary ICU bedside hemodynamics discussion." },
  { id: 4, title: "Fetal Doppler Scan Demonstration", category: "Fetal Medicine", image: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=500&auto=format&fit=crop&q=80", caption: "First trimester screening and Doppler analysis." },
];

const FREE_COURSES_KEY = "imc_free_courses_catalog";
const PHOTOS_KEY = "imc_gallery_photos_catalog";

export default function AdminGalleryPage() {
  const [activeTab, setActiveTab] = useState<"courses" | "photos">("courses");
  const [freeCourses, setFreeCourses] = useState<FreeCourseVideo[]>(DEFAULT_FREE_COURSES);
  const [galleryPhotos, setGalleryPhotos] = useState<GalleryPhotoAsset[]>(DEFAULT_GALLERY_PHOTOS);

  const [activeModal, setActiveModal] = useState<"create_course" | "edit_course" | "create_photo" | "edit_photo" | null>(null);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [isSuccessNotification, setIsSuccessNotification] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState("Saved Successfully!");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State for Free Courses
  const [courseFormData, setCourseFormData] = useState<FreeCourseVideo>({
    id: 0,
    title: "",
    specialty: "Clinical Cardiology",
    duration: "25 mins",
    youtubeId: "",
    youtubeUrl: "",
    thumbnailUrl: "https://images.unsplash.com/photo-1551076805-e1869033e561?w=800&auto=format&fit=crop&q=80",
  });

  // Form State for Photos
  const [photoFormData, setPhotoFormData] = useState<GalleryPhotoAsset>({
    id: 0,
    title: "",
    category: "Clinical Training",
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=500&auto=format&fit=crop&q=80",
    caption: "",
  });

  const [isSectionVisible, setIsSectionVisible] = useState<boolean>(true);

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedSectionVisible = localStorage.getItem("imc_free_courses_section_enabled");
      if (savedSectionVisible !== null) setIsSectionVisible(savedSectionVisible === "true");

      const savedCourses = localStorage.getItem(FREE_COURSES_KEY);
      if (savedCourses) {
        try {
          const parsed = JSON.parse(savedCourses);
          if (Array.isArray(parsed) && parsed.length > 0) setFreeCourses(parsed);
        } catch (e) {
          console.error(e);
        }
      }

      const savedPhotos = localStorage.getItem(PHOTOS_KEY);
      if (savedPhotos) {
        try {
          const parsed = JSON.parse(savedPhotos);
          if (Array.isArray(parsed) && parsed.length > 0) setGalleryPhotos(parsed);
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, []);

  const toggleSectionVisibility = () => {
    const nextVal = !isSectionVisible;
    setIsSectionVisible(nextVal);
    if (typeof window !== "undefined") {
      localStorage.setItem("imc_free_courses_section_enabled", nextVal ? "true" : "false");
      window.dispatchEvent(new Event("storage"));
    }
    showToast(nextVal ? "Free Courses Section Enabled on Live Website!" : "Free Courses Section Hidden from Website!");
  };

  const showToast = (msg: string) => {
    setNotificationMsg(msg);
    setIsSuccessNotification(true);
    setTimeout(() => setIsSuccessNotification(false), 2500);
  };

  const handleDeviceFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        if (activeModal?.includes("course")) {
          setCourseFormData((prev) => ({ ...prev, thumbnailUrl: reader.result as string }));
        } else {
          setPhotoFormData((prev) => ({ ...prev, image: reader.result as string }));
        }
      }
    };
    reader.readAsDataURL(file);
  };

  // Helper to extract clean youtube ID
  const extractYoutubeId = (url: string) => {
    let id = url.trim();
    if (url.includes("v=")) {
      id = url.split("v=")[1]?.split("&")[0] || id;
    } else if (url.includes("youtu.be/")) {
      id = url.split("youtu.be/")[1]?.split("?")[0] || id;
    } else if (url.includes("embed/")) {
      id = url.split("embed/")[1]?.split("?")[0] || id;
    }
    return id;
  };

  const handleYoutubeUrlChange = (url: string) => {
    const extractedId = extractYoutubeId(url);
    setCourseFormData((prev) => ({
      ...prev,
      youtubeUrl: url,
      youtubeId: extractedId,
      // Auto-set high-res YouTube thumbnail if not custom
      thumbnailUrl: extractedId && !prev.thumbnailUrl.startsWith("data:") 
        ? `https://img.youtube.com/vi/${extractedId}/hqdefault.jpg` 
        : prev.thumbnailUrl
    }));
  };

  // Save Free Course
  const handleSaveCourse = () => {
    if (!courseFormData.title.trim()) return;

    let updated: FreeCourseVideo[];
    if (activeModal === "create_course") {
      updated = [courseFormData, ...freeCourses];
    } else {
      updated = freeCourses.map((c) => (c.id === courseFormData.id ? courseFormData : c));
    }

    setFreeCourses(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem(FREE_COURSES_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event("storage"));
    }

    setActiveModal(null);
    showToast("Free Course Video Saved & Updated on Website!");
  };

  const handleDeleteCourse = (id: number, title: string) => {
    if (confirm(`Remove free course video: "${title}"?`)) {
      const updated = freeCourses.filter((c) => c.id !== id);
      setFreeCourses(updated);
      if (typeof window !== "undefined") {
        localStorage.setItem(FREE_COURSES_KEY, JSON.stringify(updated));
        window.dispatchEvent(new Event("storage"));
      }
      showToast("Course removed.");
    }
  };

  const handleMediaSelect = (media: MediaItem) => {
    if (activeModal?.includes("course")) {
      setCourseFormData((prev) => ({ ...prev, thumbnailUrl: media.url }));
    } else {
      setPhotoFormData((prev) => ({ ...prev, image: media.url }));
    }
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

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 font-display">
            Gallery & Free Courses CMS
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage YouTube video masterclasses (with 30s lead gate) and hospital photo galleries.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {isSuccessNotification && (
            <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-2 rounded-xl animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{notificationMsg}</span>
            </div>
          )}

          {/* Master Section Toggle on Live Website */}
          <button
            onClick={toggleSectionVisibility}
            className={`inline-flex items-center gap-1.5 text-xs font-bold py-2.5 px-4 rounded-xl border transition-all cursor-pointer shadow-xs ${
              isSectionVisible
                ? "bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100"
                : "bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100"
            }`}
            title="Click to toggle Free Courses section visibility on live website"
          >
            <span className={`w-2 h-2 rounded-full ${isSectionVisible ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`} />
            <span>Free Courses Section: {isSectionVisible ? "Visible on Website" : "Hidden from Website"}</span>
          </button>

          {activeTab === "courses" ? (
            <button
              onClick={() => {
                setCourseFormData({
                  id: Date.now(),
                  title: "",
                  specialty: "Clinical Cardiology",
                  duration: "30 mins",
                  youtubeId: "",
                  youtubeUrl: "",
                  thumbnailUrl: "https://images.unsplash.com/photo-1551076805-e1869033e561?w=800&auto=format&fit=crop&q=80",
                });
                setActiveModal("create_course");
              }}
              className="inline-flex items-center gap-2 bg-[#0B4F9C] hover:bg-[#083E7D] text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Free Video Course</span>
            </button>
          ) : (
            <button
              onClick={() => {
                setPhotoFormData({
                  id: Date.now(),
                  title: "",
                  category: "Clinical Training",
                  image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=500&auto=format&fit=crop&q=80",
                  caption: "",
                });
                setActiveModal("create_photo");
              }}
              className="inline-flex items-center gap-2 bg-[#0B4F9C] hover:bg-[#083E7D] text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Gallery Photo</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab("courses")}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer ${
            activeTab === "courses"
              ? "bg-[#07172F] text-white shadow-md shadow-slate-900/20"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          <Video className={`w-4 h-4 ${activeTab === "courses" ? "text-blue-400" : "text-slate-500"}`} />
          <span>Explore Free Courses ({freeCourses.length} Videos)</span>
          <span className="text-[10px] bg-blue-500 text-white px-2 py-0.5 rounded-full uppercase">
            30s Lead Gate Active
          </span>
        </button>

        <button
          onClick={() => setActiveTab("photos")}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer ${
            activeTab === "photos"
              ? "bg-[#07172F] text-white shadow-md shadow-slate-900/20"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>Clinical Photo Gallery ({galleryPhotos.length})</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: FREE COURSES / YOUTUBE VIDEOS LIST                                 */}
      {/* ========================================================================= */}
      {activeTab === "courses" && (
        <div className="space-y-4">
          <div className="bg-blue-50/80 border border-blue-200 text-[#0B4F9C] p-4 rounded-2xl text-xs flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-blue-600 shrink-0" />
              <div>
                <span className="font-black">Live Website Lead Gate Active:</span> When a doctor clicks to watch any of these free courses, the video plays on your website. After <strong>30 seconds</strong>, the Lead Generation form pops up. Once filled, the lead is stored in your CRM and the popup never shows again!
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {freeCourses.map((course) => (
              <div
                key={course.id}
                className="bg-[#0C2346] text-white rounded-3xl border border-blue-900/60 overflow-hidden shadow-lg hover:shadow-xl hover:border-blue-400 transition-all flex flex-col justify-between"
              >
                <div className="relative h-44 bg-slate-900 overflow-hidden">
                  <img
                    src={course.thumbnailUrl}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-xl bg-black/70 border border-white/20 flex items-center justify-center">
                      <Play className="w-5 h-5 fill-white text-white ml-0.5" />
                    </div>
                  </div>
                  <span className="absolute top-2.5 left-2.5 bg-blue-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                    {course.specialty}
                  </span>
                  <span className="absolute bottom-2.5 right-2.5 bg-black/80 text-slate-200 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                    <Clock className="w-3 h-3 text-blue-400" />
                    <span>{course.duration}</span>
                  </span>
                </div>

                <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-white line-clamp-2">
                      {course.title}
                    </h3>
                    <div className="text-[10px] text-blue-300 font-mono mt-1 truncate">
                      YouTube: {course.youtubeUrl || `ID: ${course.youtubeId}`}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-blue-900/60 flex items-center justify-between text-xs">
                    <button
                      onClick={() => {
                        setCourseFormData(course);
                        setActiveModal("edit_course");
                      }}
                      className="inline-flex items-center gap-1 text-blue-300 hover:text-white font-bold cursor-pointer"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit Course</span>
                    </button>
                    <button
                      onClick={() => handleDeleteCourse(course.id, course.title)}
                      className="inline-flex items-center gap-1 text-rose-400 hover:text-rose-300 font-bold cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: CLINICAL PHOTO GALLERY                                             */}
      {/* ========================================================================= */}
      {activeTab === "photos" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
          {galleryPhotos.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="relative h-48 bg-slate-100 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2.5 left-2.5 bg-slate-900/85 text-white text-[9px] font-bold px-2 py-0.5 rounded shadow">
                  {item.category}
                </span>
              </div>

              <div className="p-4 space-y-2">
                <h3 className="text-xs font-extrabold text-slate-900 line-clamp-1">
                  {item.title}
                </h3>
                {item.caption && (
                  <p className="text-[11px] text-slate-500 line-clamp-2">
                    {item.caption}
                  </p>
                )}

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => {
                      setPhotoFormData(item);
                      setActiveModal("edit_photo");
                    }}
                    className="text-xs font-bold text-blue-600 hover:text-blue-800 cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      const updated = galleryPhotos.filter((p) => p.id !== item.id);
                      setGalleryPhotos(updated);
                      localStorage.setItem(PHOTOS_KEY, JSON.stringify(updated));
                      showToast("Photo removed.");
                    }}
                    className="text-xs font-bold text-red-500 hover:text-red-700 cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD / EDIT FREE VIDEO COURSE (YOUTUBE)                             */}
      {/* ========================================================================= */}
      {(activeModal === "create_course" || activeModal === "edit_course") && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 max-h-[90vh]">
            
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="text-base font-black text-slate-900 font-display">
                  {activeModal === "create_course" ? "Add Free Video Course" : "Edit Free Course Video"}
                </h3>
                <p className="text-xs text-slate-500">
                  Embeds YouTube video on website with 30s lead capture popup gate.
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
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Course / Lecture Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Airway Management in Emergency Medicine"
                  value={courseFormData.title}
                  onChange={(e) => setCourseFormData({ ...courseFormData, title: e.target.value })}
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Specialty / Department
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Clinical Cardiology"
                    value={courseFormData.specialty}
                    onChange={(e) => setCourseFormData({ ...courseFormData, specialty: e.target.value })}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Video Duration
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 28 mins"
                    value={courseFormData.duration}
                    onChange={(e) => setCourseFormData({ ...courseFormData, duration: e.target.value })}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              {/* YouTube URL Field */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  YouTube Video URL or Video ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="https://www.youtube.com/watch?v=... or ID"
                  value={courseFormData.youtubeUrl || courseFormData.youtubeId}
                  onChange={(e) => handleYoutubeUrlChange(e.target.value)}
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Paste any public or unlisted YouTube video link.
                </p>
              </div>

              {/* Enhanced Video Card Thumbnail Section */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>Video Card Thumbnail Image</span>
                  {courseFormData.youtubeId && (
                    <button
                      type="button"
                      onClick={() => {
                        const id = courseFormData.youtubeId;
                        if (id) {
                          setCourseFormData((prev) => ({
                            ...prev,
                            thumbnailUrl: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
                          }));
                        }
                      }}
                      className="text-[11px] text-blue-600 font-bold hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      <span>Fetch YouTube HD Thumbnail</span>
                    </button>
                  )}
                </label>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center gap-4">
                    {/* Live Preview Box with Play Overlay */}
                    <div className="relative w-28 h-20 rounded-xl bg-slate-900 overflow-hidden shrink-0 border border-slate-300 shadow-xs flex items-center justify-center">
                      <img
                        src={courseFormData.thumbnailUrl}
                        alt="Thumbnail Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as any).src = "https://images.unsplash.com/photo-1551076805-e1869033e561?w=800&auto=format&fit=crop&q=80";
                        }}
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <div className="w-8 h-8 rounded-lg bg-black/80 text-white flex items-center justify-center">
                          <Play className="w-4 h-4 fill-white ml-0.5" />
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-slate-800">Thumbnail Active</div>
                      <p className="text-[10px] text-slate-400 truncate max-w-[200px] mb-2 font-mono">
                        {courseFormData.thumbnailUrl.startsWith("data:") ? "Uploaded from computer" : courseFormData.thumbnailUrl}
                      </p>

                      <div className="flex items-center gap-2 flex-wrap">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="inline-flex items-center gap-1 text-xs font-bold text-white bg-[#0B4F9C] hover:bg-[#083E7D] px-3 py-1.5 rounded-xl shadow-2xs cursor-pointer"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Upload File</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsMediaPickerOpen(true)}
                          className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-xl cursor-pointer"
                        >
                          <Sparkles className="w-3 h-3 text-amber-500" />
                          <span>Media Library</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200/80">
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">
                      Or Custom Thumbnail URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={courseFormData.thumbnailUrl}
                      onChange={(e) => setCourseFormData({ ...courseFormData, thumbnailUrl: e.target.value })}
                      className="w-full text-xs p-2 bg-white border border-slate-200 rounded-xl font-mono text-[11px]"
                    />
                  </div>
                </div>
              </div>

            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="text-xs font-bold text-slate-600 hover:text-slate-900 px-4 py-2"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!courseFormData.title.trim() || (!courseFormData.youtubeUrl && !courseFormData.youtubeId)}
                onClick={handleSaveCourse}
                className="inline-flex items-center gap-1.5 bg-[#0B4F9C] hover:bg-[#083E7D] text-white text-xs font-bold py-2.5 px-6 rounded-xl shadow-xs disabled:opacity-50 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Free Video Course</span>
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
        allowedTypes={["IMAGE"]}
        title="Select Video Thumbnail Image"
      />

    </div>
  );
}
