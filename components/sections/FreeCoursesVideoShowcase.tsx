"use client";

import React, { useState, useEffect, useRef } from "react";
import { trackVideoEngagement, trackLeadSubmit } from "@/lib/analytics";
import { 
  Play, 
  X, 
  ExternalLink, 
  Lock, 
  Unlock, 
  CheckCircle2, 
  Sparkles, 
  Stethoscope, 
  Clock, 
  GraduationCap,
  ShieldCheck,
  ArrowRight,
  PhoneCall,
  AlertCircle,
  HelpCircle,
  Video
} from "lucide-react";
import { submitLeadAction } from "@/features/leads/leadActions";

export interface FreeCourseVideo {
  id: number;
  title: string;
  specialty: string;
  duration: string;
  youtubeId: string;
  youtubeUrl: string;
  thumbnailUrl: string;
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

const STORAGE_KEY = "imc_free_courses_catalog";
const UNLOCKED_STORAGE_KEY = "imc_free_course_lead_unlocked";
const SECTION_TOGGLE_KEY = "imc_free_courses_section_enabled";

export function FreeCoursesVideoShowcase() {
  const [courses, setCourses] = useState<FreeCourseVideo[]>(DEFAULT_FREE_COURSES);
  const [activeVideo, setActiveVideo] = useState<FreeCourseVideo | null>(null);
  const [isSectionEnabled, setIsSectionEnabled] = useState(true);
  
  // Lead Gate States
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [playbackSeconds, setPlaybackSeconds] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);

  // Form Fields
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [specialty, setSpecialty] = useState("MBBS Doctor");

  const loadSettings = () => {
    if (typeof window !== "undefined") {
      const savedToggle = localStorage.getItem(SECTION_TOGGLE_KEY);
      if (savedToggle !== null) {
        setIsSectionEnabled(savedToggle === "true");
      }

      const unlocked = localStorage.getItem(UNLOCKED_STORAGE_KEY) === "true";
      setIsUnlocked(unlocked);

      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setCourses(parsed);
          }
        } catch (e) {
          console.error(e);
        }
      }
    }
  };

  // Load persistence & storage events
  useEffect(() => {
    loadSettings();
    const handleStorage = () => loadSettings();
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // 30-Second & 1-Minute Re-trigger Timer
  useEffect(() => {
    let interval: any = null;

    if (activeVideo && !isUnlocked && !showLeadModal) {
      interval = setInterval(() => {
        setPlaybackSeconds((prev) => {
          const next = prev + 1;
          
          // First trigger at 30 seconds
          if (next === 30) {
            setShowLeadModal(true);
            if (activeVideo) {
              trackVideoEngagement({
                videoTitle: activeVideo.title,
                youtubeId: activeVideo.youtubeId || "",
                milestoneSeconds: 30,
                action: "30S_GATE",
              });
            }
          } 
          // Subsequent triggers every 60 seconds (at 90s, 150s, etc.)
          else if (next > 30 && (next - 30) % 60 === 0) {
            setShowLeadModal(true);
          }

          return next;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeVideo, isUnlocked, showLeadModal]);

  if (!isSectionEnabled) {
    return null;
  }

  const handleOpenVideo = (course: FreeCourseVideo) => {
    setActiveVideo(course);
    setPlaybackSeconds(0);
    trackVideoEngagement({
      videoTitle: course.title,
      youtubeId: course.youtubeId || "",
      milestoneSeconds: 0,
      action: "PLAY",
    });
  };

  const handleCloseVideo = () => {
    setActiveVideo(null);
    setShowLeadModal(false);
    setPlaybackSeconds(0);
  };

  const handleCloseLeadModal = () => {
    // User cut/closed the modal -> Resume video, will re-prompt in 1 min
    setShowLeadModal(false);
  };

  const handleSubmitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobile || !fullName) return;

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.set("fullName", fullName);
      formData.set("mobile", mobile);
      formData.set("email", email || `${mobile}@imc-student.in`);
      formData.set("qualification", specialty);
      formData.set("interestedCourseName", activeVideo?.title || "Free Medical Masterclass");
      formData.set("leadSource", "FREE_COURSE_VIDEO_POPUP");

      await submitLeadAction(formData);

      // GA4 & GTM Event
      trackLeadSubmit({
        formSource: "FREE_COURSE_VIDEO_POPUP",
        courseName: activeVideo?.title || "Free Medical Masterclass",
        specialty: specialty,
      });

      // Mark unlocked permanently
      setIsUnlocked(true);
      if (typeof window !== "undefined") {
        localStorage.setItem(UNLOCKED_STORAGE_KEY, "true");
      }

      setFormSuccess(true);
      setTimeout(() => {
        setShowLeadModal(false);
        setFormSuccess(false);
      }, 1500);
    } catch (err) {
      console.error(err);
      // Fallback unlock
      setIsUnlocked(true);
      if (typeof window !== "undefined") {
        localStorage.setItem(UNLOCKED_STORAGE_KEY, "true");
      }
      setShowLeadModal(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper to extract clean youtube embed URL
  const getEmbedUrl = (course: FreeCourseVideo) => {
    let videoId = course.youtubeId;
    if (course.youtubeUrl.includes("v=")) {
      videoId = course.youtubeUrl.split("v=")[1]?.split("&")[0] || videoId;
    } else if (course.youtubeUrl.includes("youtu.be/")) {
      videoId = course.youtubeUrl.split("youtu.be/")[1]?.split("?")[0] || videoId;
    }
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&enablejsapi=1`;
  };

  return (
    <section className="py-16 sm:py-20 bg-[#07172F] text-white relative overflow-hidden border-b border-slate-800">
      
      {/* Background Radial Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 bg-blue-500/20 text-blue-300 text-xs font-black uppercase px-3.5 py-1 rounded-full border border-blue-400/20 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Complimentary Clinical Education</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight font-display">
            Explore Free Courses
          </h2>
          
          <div className="w-20 h-1 bg-[#0B4F9C] mx-auto rounded-full" />

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl mx-auto">
            Browse through complimentary clinical masterclasses and CME video lectures curated for practicing doctors.
          </p>
        </div>

        {/* Video Grid (6 Cards Matching Screenshot) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {courses.map((course) => (
            <div
              key={course.id}
              onClick={() => handleOpenVideo(course)}
              className="group relative bg-[#0C2346] border border-blue-900/50 hover:border-blue-400 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-blue-900/30 transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              {/* Video Thumbnail Box */}
              <div className="relative h-48 sm:h-52 w-full bg-slate-900 overflow-hidden">
                <img
                  src={course.thumbnailUrl}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                />

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0C2346] via-black/30 to-transparent" />

                {/* External Link Icon in Top Right */}
                <div className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-black/60 backdrop-blur-xs border border-white/20 flex items-center justify-center text-white/80 group-hover:text-white transition-colors">
                  <ExternalLink className="w-4 h-4" />
                </div>

                {/* Central Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-2xl bg-black/80 group-hover:bg-[#0B4F9C] border border-white/20 group-hover:border-blue-400 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300">
                    <Play className="w-6 h-6 fill-white ml-0.5" />
                  </div>
                </div>

                {/* Duration Badge */}
                <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 border border-white/10">
                  <Clock className="w-3 h-3 text-blue-400" />
                  <span>{course.duration}</span>
                </div>
              </div>

              {/* Course Title & Specialty */}
              <div className="p-4 space-y-1.5 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase text-blue-400 tracking-wider">
                    {course.specialty}
                  </span>
                  <h3 className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors line-clamp-2 mt-0.5">
                    {course.title}
                  </h3>
                </div>

                <div className="pt-2 text-[11px] text-slate-400 flex items-center justify-between">
                  <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Free Video Access</span>
                  </span>
                  <span className="text-blue-400 font-bold group-hover:underline">
                    Watch Now →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* ========================================================================= */}
      {/* VIDEO PLAYER MODAL WITH 30-SECOND / 1-MINUTE LEAD GATE POPUP              */}
      {/* ========================================================================= */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          
          <div className="relative w-full max-w-4xl bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col">
            
            {/* Modal Header */}
            <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="bg-blue-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
                  {activeVideo.specialty}
                </span>
                <h4 className="text-sm font-bold text-white truncate max-w-lg">
                  {activeVideo.title}
                </h4>
              </div>

              <button
                onClick={handleCloseVideo}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Embedded YouTube Iframe Container */}
            <div className="relative aspect-video w-full bg-black">
              {!showLeadModal ? (
                <iframe
                  src={getEmbedUrl(activeVideo)}
                  title={activeVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              ) : (
                /* When Modal is Active, Blurred Placeholder Video Background */
                <div className="w-full h-full relative flex items-center justify-center overflow-hidden">
                  <img
                    src={activeVideo.thumbnailUrl}
                    alt={activeVideo.title}
                    className="w-full h-full object-cover filter blur-md opacity-40"
                  />
                  <div className="absolute inset-0 bg-black/60" />
                </div>
              )}

              {/* LEAD GATE POPUP OVERLAY (Triggered at 30s, or 1min after cancel) */}
              {showLeadModal && (
                <div className="absolute inset-0 z-20 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 animate-in zoom-in-95">
                  <div className="bg-[#0C2346] border border-blue-500/40 rounded-3xl p-6 sm:p-8 max-w-md w-full text-center shadow-2xl relative">
                    
                    {/* Close (Cut) Button - Will re-show after 1 min */}
                    <button
                      type="button"
                      onClick={handleCloseLeadModal}
                      className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                      title="Continue preview"
                    >
                      <X className="w-5 h-5" />
                    </button>

                    {!formSuccess ? (
                      <form onSubmit={handleSubmitLead} className="space-y-4">
                        <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center mx-auto mb-2 shadow-inner">
                          <Lock className="w-6 h-6" />
                        </div>

                        <div>
                          <h3 className="text-lg font-black text-white font-display">
                            Unlock Full Free Course Access
                          </h3>
                          <p className="text-xs text-slate-300 mt-1">
                            Enter your details once to unlock this full lecture & all 100+ complimentary clinical masterclasses permanently.
                          </p>
                        </div>

                        <div className="space-y-2.5 text-left">
                          <div>
                            <label className="block text-[11px] font-bold text-slate-300 mb-1">
                              Doctor Full Name <span className="text-red-400">*</span>
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Dr. Rajesh Kumar"
                              value={fullName}
                              onChange={(e) => setFullName(e.target.value)}
                              className="w-full text-xs p-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-white focus:outline-hidden focus:border-blue-400"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-slate-300 mb-1">
                              WhatsApp / Mobile Number <span className="text-red-400">*</span>
                            </label>
                            <input
                              type="tel"
                              required
                              placeholder="+91 98765 43210"
                              value={mobile}
                              onChange={(e) => setMobile(e.target.value)}
                              className="w-full text-xs p-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-white focus:outline-hidden focus:border-blue-400"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[11px] font-bold text-slate-300 mb-1">
                                Email Address
                              </label>
                              <input
                                type="email"
                                placeholder="doctor@hospital.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full text-xs p-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-white focus:outline-hidden focus:border-blue-400"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-bold text-slate-300 mb-1">
                                Specialty / Status
                              </label>
                              <select
                                value={specialty}
                                onChange={(e) => setSpecialty(e.target.value)}
                                className="w-full text-xs p-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-white focus:outline-hidden focus:border-blue-400"
                              >
                                <option value="MBBS Doctor">MBBS Doctor</option>
                                <option value="Junior Resident">Junior Resident</option>
                                <option value="Postgraduate (MD/MS)">MD / MS / DNB</option>
                                <option value="Consultant">Consultant</option>
                                <option value="Medical Student">Medical Student</option>
                              </select>
                            </div>
                          </div>
                        </div>

                        <div className="pt-2">
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-3 bg-[#0B4F9C] hover:bg-[#083E7D] text-white text-xs font-black rounded-xl shadow-lg shadow-blue-900/40 transition-all flex items-center justify-center gap-2 cursor-pointer"
                          >
                            {isSubmitting ? (
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                              <>
                                <Unlock className="w-4 h-4" />
                                <span>Unlock & Continue Watching Free</span>
                              </>
                            )}
                          </button>
                        </div>

                        <p className="text-[10px] text-slate-400">
                          🔒 Zero Spam Guarantee. Form is filled once and will not appear again.
                        </p>
                      </form>
                    ) : (
                      /* Success Confirmation */
                      <div className="py-6 space-y-3">
                        <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                          <CheckCircle2 className="w-8 h-8" />
                        </div>
                        <h3 className="text-base font-black text-white">
                          Access Unlocked Successfully!
                        </h3>
                        <p className="text-xs text-slate-300">
                          Enjoy full uninterrupted viewing across all complimentary lectures.
                        </p>
                      </div>
                    )}

                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer with Counsellor Call Option */}
            <div className="p-4 bg-slate-950 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="text-slate-400 text-[11px] text-center sm:text-left">
                Want certification and bedside hospital training in {activeVideo.specialty}?
              </div>
              <a
                href="/book-counselling"
                className="inline-flex items-center gap-1.5 text-blue-400 hover:text-blue-300 font-bold"
              >
                <span>Speak with Admissions Counsellor</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

          </div>

        </div>
      )}

    </section>
  );
}
