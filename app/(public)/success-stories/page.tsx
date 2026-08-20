"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { testimonials as defaultTestimonials, courses } from "@/lib/data";
import { FinalCtaBanner } from "@/components/sections/FinalCtaBanner";
import { 
  Star, 
  Quote, 
  ShieldCheck, 
  MapPin, 
  Hospital, 
  CheckCircle2,
  ArrowRight,
  Search,
  X,
  Filter,
  Sparkles,
  Award,
  GraduationCap,
  Users,
  Building2,
  ThumbsUp
} from "lucide-react";

const TESTIMONIALS_STORAGE_KEY = "imc_testimonials_catalog";

export default function SuccessStoriesPage() {
  const [reviewsList, setReviewsList] = useState<any[]>(defaultTestimonials);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("ALL");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(TESTIMONIALS_STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setReviewsList(parsed);
          }
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, []);

  // Specialty options
  const specialtyOptions = [
    "ALL",
    "Cardiology",
    "Critical Care",
    "Fetal Medicine",
    "Emergency Medicine",
    "Diabetology",
    "Dermatology",
  ];

  // Filtered Reviews
  const filteredReviews = useMemo(() => {
    return reviewsList.filter((review) => {
      // Specialty Filter
      if (selectedSpecialty !== "ALL") {
        const courseName = (review.courseName || "").toLowerCase();
        if (!courseName.includes(selectedSpecialty.toLowerCase())) return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchDoctor = (review.doctorName || "").toLowerCase().includes(q);
        const matchCourse = (review.courseName || "").toLowerCase().includes(q);
        const matchQuote = (review.quote || "").toLowerCase().includes(q);
        const matchHospital = (review.hospital || "").toLowerCase().includes(q);
        const matchCity = (review.city || "").toLowerCase().includes(q);
        const matchQual = (review.qualification || "").toLowerCase().includes(q);
        if (!matchDoctor && !matchCourse && !matchQuote && !matchHospital && !matchCity && !matchQual) {
          return false;
        }
      }

      return true;
    });
  }, [reviewsList, selectedSpecialty, searchQuery]);

  return (
    <div className="bg-[#F8FAFC] min-h-screen pt-6">
      
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-6">
        <div className="text-xs font-semibold text-slate-500">
          <Link href="/" className="hover:text-blue-700">Home</Link> &gt;{" "}
          <span className="text-blue-700 font-bold">Doctor Success Stories & Alumni Reviews</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12 pb-20">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 text-xs font-black uppercase px-4 py-1.5 rounded-full border border-emerald-200 shadow-2xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Verified Alumni Outcomes & Clinical Transformation</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight font-display">
            Trusted by <span className="text-[#0B4F9C]">12,000+ Doctors</span> Across India
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Read firsthand clinical experiences from practicing MBBS, MD/MS, DNB, and AYUSH doctors who upgraded their diagnostic accuracy and bedside procedural expertise through our fellowships.
          </p>
        </div>

        {/* 4 Trust Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 text-xl font-black">
              ★
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-slate-900 font-display">4.9 / 5.0</div>
              <div className="text-xs font-bold text-slate-500">Average Rating (2,480+ Reviews)</div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-slate-900 font-display">12,000+</div>
              <div className="text-xs font-bold text-slate-500">Doctors Upskilled</div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-slate-900 font-display">50+</div>
              <div className="text-xs font-bold text-slate-500">Hospital Attachment Networks</div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-slate-900 font-display">98.4%</div>
              <div className="text-xs font-bold text-slate-500">Clinical Skill Mastery Rate</div>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by doctor name, hospital, city, or specialty..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-900 focus:outline-hidden focus:bg-white focus:border-blue-500 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Specialty Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 w-full md:w-auto justify-start">
              {specialtyOptions.map((spec) => {
                const isActive = selectedSpecialty === spec;
                return (
                  <button
                    key={spec}
                    type="button"
                    onClick={() => setSelectedSpecialty(spec)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                      isActive
                        ? "bg-[#0B4F9C] text-white shadow-xs"
                        : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200"
                    }`}
                  >
                    {spec === "ALL" ? "All Specialties" : spec}
                  </button>
                );
              })}
            </div>

          </div>
        </div>

        {/* ========================================================================= */}
        {/* ALL DOCTOR TESTIMONIALS GRID (SHOW ALL)                                   */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReviews.map((t) => (
            <div
              key={t.id}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs flex flex-col justify-between space-y-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="space-y-3.5">
                
                {/* 5-Star Row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(t.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-emerald-200">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    <span>Verified Doctor</span>
                  </span>
                </div>

                {/* Course Name */}
                <div className="text-xs font-black text-blue-700 group-hover:text-[#0B4F9C] transition-colors">
                  {t.courseName}
                </div>

                {/* Review Text */}
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic whitespace-pre-line">
                  &ldquo;{t.quote}&rdquo;
                </p>

              </div>

              {/* Doctor Profile Info & Hospital Location */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-11 h-11 rounded-2xl bg-blue-100 text-blue-800 font-extrabold flex items-center justify-center text-xs shrink-0 border border-blue-200 shadow-2xs">
                    {t.doctorName.replace("Dr. ", "").split(" ").map((n: string) => n[0]).join("").slice(0, 2) || "DR"}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-black text-slate-900 truncate">
                      {t.doctorName}
                    </div>
                    <div className="text-[10px] text-slate-500 truncate font-semibold">
                      {t.qualification}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      <span>{t.hospital ? `${t.hospital}, ${t.city}` : t.city}</span>
                    </div>
                  </div>
                </div>

                <Link
                  href="/courses"
                  className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-slate-50 hover:bg-blue-50 text-blue-700 shrink-0 transition-colors"
                  title="View Fellowship Curriculum"
                >
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

            </div>
          ))}
        </div>

        {filteredReviews.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 space-y-3">
            <ThumbsUp className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-black text-slate-800">No matching alumni reviews found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Try searching with another keyword or reset the specialty category filter.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedSpecialty("ALL");
              }}
              className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs font-bold px-4 py-2 rounded-xl cursor-pointer hover:bg-blue-100"
            >
              <span>Reset Filters</span>
            </button>
          </div>
        )}

      </div>

      <FinalCtaBanner />
    </div>
  );
}
