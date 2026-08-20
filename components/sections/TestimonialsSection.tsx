"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { testimonials as defaultTestimonials, siteSettings } from "@/lib/data";
import { 
  Star, 
  Quote, 
  ShieldCheck, 
  MapPin, 
  Hospital, 
  CheckCircle2,
  ArrowRight,
  MessageSquareHeart,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from "lucide-react";

const TESTIMONIALS_STORAGE_KEY = "imc_testimonials_catalog";

interface TestimonialsSectionProps {
  showViewMore?: boolean;
  enableSlider?: boolean;
}

export function TestimonialsSection({
  showViewMore = true,
  enableSlider = true,
}: TestimonialsSectionProps) {
  const [reviewsList, setReviewsList] = useState<any[]>(defaultTestimonials);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(3);

  useEffect(() => {
    const handleStorage = () => {
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
    };
    handleStorage();
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // Responsive Items Per Page (1 for mobile, 2 for tablet, 3 for desktop)
  useEffect(() => {
    const updateItemsPerPage = () => {
      if (window.innerWidth < 768) {
        setItemsPerPage(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerPage(2);
      } else {
        setItemsPerPage(3);
      }
    };
    updateItemsPerPage();
    window.addEventListener("resize", updateItemsPerPage);
    return () => window.removeEventListener("resize", updateItemsPerPage);
  }, []);

  const totalSlides = Math.max(1, reviewsList.length - itemsPerPage + 1);

  // Auto-play timer
  useEffect(() => {
    if (!enableSlider || isPaused || totalSlides <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalSlides);
    }, 5500);
    return () => clearInterval(interval);
  }, [enableSlider, isPaused, totalSlides]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  };

  return (
    <section className="py-20 bg-white border-b border-slate-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Header with Slider Navigation Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Alumni Outcomes & Doctor Feedback</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight font-display">
              Trusted by 12,000+ Doctors Across India
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Read firsthand experiences of medical professionals who transformed their clinical practice through our fellowships.
            </p>
          </div>

          {/* Slider Arrow Controls */}
          {enableSlider && reviewsList.length > itemsPerPage && (
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handlePrev}
                className="w-11 h-11 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 flex items-center justify-center shadow-xs transition-all hover:scale-105 active:scale-95 cursor-pointer"
                aria-label="Previous Testimonials"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="w-11 h-11 rounded-2xl bg-[#0B4F9C] hover:bg-[#083E7D] text-white flex items-center justify-center shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
                aria-label="Next Testimonials"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* INTERACTIVE 3-CARD CAROUSEL SLIDER                                        */}
        {/* ========================================================================= */}
        <div 
          className="relative overflow-hidden mb-8"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div
            className="flex transition-transform duration-500 ease-out gap-6"
            style={{
              transform: `translateX(-${currentIndex * (100 / itemsPerPage + (itemsPerPage === 1 ? 0 : 1.33))}%)`,
            }}
          >
            {reviewsList.map((t) => (
              <div
                key={t.id}
                className="shrink-0 bg-slate-50/80 rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-6 hover:shadow-xl hover:bg-white hover:border-blue-200 transition-all group"
                style={{
                  width: itemsPerPage === 1 ? "100%" : itemsPerPage === 2 ? "calc(50% - 12px)" : "calc(33.333% - 16px)",
                }}
              >
                <div className="space-y-3">
                  {/* 5-Star Row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(t.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400" />
                      ))}
                    </div>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      <span>Verified Doctor</span>
                    </span>
                  </div>

                  {/* Course Name */}
                  <div className="text-xs font-black text-blue-700 group-hover:text-[#0B4F9C] transition-colors">
                    {t.courseName}
                  </div>

                  {/* Review Text */}
                  <p 
                    suppressHydrationWarning 
                    className="text-xs text-slate-700 leading-relaxed italic whitespace-pre-line"
                  >
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </div>

                {/* Doctor Profile Info */}
                <div className="flex items-center gap-3 pt-4 border-t border-slate-200/60">
                  <div className="w-11 h-11 rounded-2xl bg-blue-100 text-blue-800 font-extrabold flex items-center justify-center text-xs shrink-0 border border-blue-200 shadow-2xs">
                    {t.doctorName.replace("Dr. ", "").split(" ").map((n: string) => n[0]).join("").slice(0, 2) || "DR"}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-black text-slate-900 truncate">
                      {t.doctorName}
                    </div>
                    <div className="text-[10px] text-slate-500 truncate font-medium">
                      {t.qualification}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      <span>{t.hospital ? `${t.hospital}, ${t.city}` : t.city}</span>
                    </div>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>

        {/* Carousel Slider Dot Indicators */}
        {enableSlider && totalSlides > 1 && (
          <div className="flex items-center justify-center gap-2 mb-10">
            {Array.from({ length: totalSlides }).map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  currentIndex === idx
                    ? "w-8 bg-[#0B4F9C]"
                    : "w-2 bg-slate-300 hover:bg-slate-400"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}

        {/* View More Testimonials Button */}
        {showViewMore && (
          <div className="text-center mb-14">
            <Link
              href="/success-stories"
              className="inline-flex items-center gap-2 bg-slate-50 hover:bg-blue-50 text-[#0B4F9C] hover:text-[#083E7D] border border-slate-200 hover:border-blue-200 text-xs sm:text-sm font-black py-3.5 px-7 rounded-2xl shadow-2xs transition-all hover:scale-102 active:scale-98"
            >
              <MessageSquareHeart className="w-4 h-4 text-[#0B4F9C]" />
              <span>View More Alumni Success Stories & Reviews (2,480+)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {/* Closing Trust Strip */}
        <div className="rounded-3xl bg-linear-to-r from-blue-900 via-blue-800 to-indigo-900 text-white p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
          <div className="space-y-1 text-center sm:text-left">
            <div className="text-xs font-bold text-blue-200 uppercase tracking-wider">
              Clinical Excellence & Career Growth
            </div>
            <div className="text-lg sm:text-xl font-bold font-display">
              Ready to Enhance Your Clinical Skills?
            </div>
            <p className="text-xs text-blue-100 max-w-xl">
              Join upcoming batches in Cardiology, ICU, Laparoscopy, Fetal Ultrasound, and Dermatology across Apollo & Fortis networks.
            </p>
          </div>

          <Link
            href="/courses"
            className="bg-white hover:bg-blue-50 text-blue-900 text-xs font-bold py-3 px-6 rounded-xl shadow-xs transition-colors shrink-0 flex items-center gap-1.5"
          >
            <span>Explore 150+ Programs</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}
