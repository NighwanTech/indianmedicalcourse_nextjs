"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { UniversalAdmissionForm } from "@/components/forms/UniversalAdmissionForm";
import { siteSettings } from "@/lib/data";
import { 
  ShieldCheck, 
  Star, 
  Search, 
  CheckCircle2, 
  GraduationCap, 
  Building2, 
  Users, 
  Award,
  ArrowRight,
  Sparkles,
  Stethoscope,
  Clock,
  Percent,
  ChevronRight,
  PhoneCall,
  MessageCircle
} from "lucide-react";

export const DEFAULT_HERO_CONTENT = {
  badgeText: "🚀 ADMISSIONS OPEN FOR 2026 BATCHES • 40% MERIT SCHOLARSHIPS",
  titleStart: "Advance Your Clinical Practice With",
  titleHighlight: "Premier Medical Fellowships",
  titleEnd: "& PG Diplomas",
  subtitle: "Hands-on Cath Lab Observerships, 2D Echo Bedside Scanning, ICU Ventilator Mastery & Laparoscopic Wet Labs across 50+ NABH Accredited Partner Hospitals (Apollo, Fortis, Max, Medanta) — Zero NEET PG Required.",
  card1Title: "No NEET PG",
  card1Subtitle: "Direct CV Eligibility",
  card2Title: "50+ Hospitals",
  card2Subtitle: "Apollo, Fortis, Max",
  card3Title: "CPD (UK)",
  card3Subtitle: "Valid Letterhead",
  card4Title: "0% EMI",
  card4Subtitle: "From ₹6,500/mo",
  searchPlaceholder: "Search Cardiology, ICU, Laparoscopy, Ultrasound...",
  trendingKeywords: "Cardiology, Critical Care ICU, Fetal Ultrasound, Laparoscopy",
  cta1Sub: "Admissions Desk",
  cta1Main: "Call Now",
  cta2Sub: "Instant WhatsApp",
  cta2Main: "Chat on WhatsApp",
  ratingValue: "4.9/5",
  ratingText: "12,000+ Doctor Alumni Across India",
};

export function HeroSection() {
  const [searchKey, setSearchKey] = useState("");
  const [heroContent, setHeroContent] = useState(DEFAULT_HERO_CONTENT);

  const loadHeroFromStorage = () => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("imc_homepage_sections");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.hero) {
            setHeroContent({
              ...DEFAULT_HERO_CONTENT,
              ...parsed.hero,
            });
          }
        } catch (e) {
          console.error(e);
        }
      }
    }
  };

  useEffect(() => {
    loadHeroFromStorage();
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "imc_homepage_sections") {
        loadHeroFromStorage();
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const phoneHref = `tel:${siteSettings.hotlinePhone.replace(/[^0-9+]/g, "") || "+918295843006"}`;
  const whatsappHref = `https://wa.me/${siteSettings.whatsappNumber.replace(/[^0-9]/g, "") || "918295843006"}?text=${encodeURIComponent(
    "Hello IMC Admissions Team, I want to know more about 2026 Medical Fellowships, Clinical Rotations & 0% EMI options."
  )}`;

  const trendingList = heroContent.trendingKeywords
    ? heroContent.trendingKeywords.split(",").map((k) => k.trim()).filter(Boolean)
    : ["Cardiology", "Critical Care ICU", "Fetal Ultrasound", "Laparoscopy"];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#F0F6FD] via-[#F8FAFC] to-white pt-4 pb-8 lg:pt-6 lg:pb-8 border-b border-slate-200/80">
      
      {/* Background Subtle Gradient Blobs & Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-80 hero-radial-glow pointer-events-none opacity-60" />
      <div className="absolute top-6 right-0 w-[380px] h-[380px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-20 left-0 w-[320px] h-[320px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          
          {/* ========================================================================= */}
          {/* LEFT COLUMN: 100% DYNAMIC MEDICAL HERO NARRATIVE (7 COLS)                 */}
          {/* ========================================================================= */}
          <div className="lg:col-span-7 space-y-4 text-center lg:text-left">
            
            {/* 1. Top Luminous Pill Badge */}
            {heroContent.badgeText && (
              <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-blue-100 via-indigo-100 to-emerald-100 border border-blue-300/80 shadow-2xs px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-black text-slate-900 backdrop-blur-md">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                <Sparkles className="w-3 h-3 text-[#0B4F9C]" />
                <span>{heroContent.badgeText}</span>
              </div>
            )}

            {/* 2. Main Headline (Start + Highlight + End) */}
            <h1 className="text-2xl sm:text-4xl lg:text-[40px] font-black text-slate-900 tracking-tight leading-[1.14] font-display">
              {heroContent.titleStart} <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-[#0B4F9C] via-[#1E40AF] to-[#0D9468] bg-clip-text text-transparent">
                {heroContent.titleHighlight}
              </span>{" "}
              <span className="text-slate-900">{heroContent.titleEnd}</span>
            </h1>

            {/* 3. Sub-headline Narrative Description */}
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-medium">
              {heroContent.subtitle}
            </p>

            {/* 4. 4 Dynamic Clinical Advantage Chips (Card 1, 2, 3, 4) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-w-2xl mx-auto lg:mx-0 text-left">
              <div className="bg-white/95 p-2 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-center">
                <div className="flex items-center gap-1 text-[11px] font-black text-slate-900">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{heroContent.card1Title}</span>
                </div>
                <span className="text-[9px] text-slate-500 mt-0.5">{heroContent.card1Subtitle}</span>
              </div>

              <div className="bg-white/95 p-2 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-center">
                <div className="flex items-center gap-1 text-[11px] font-black text-slate-900">
                  <Building2 className="w-3.5 h-3.5 text-[#0B4F9C] shrink-0" />
                  <span>{heroContent.card2Title}</span>
                </div>
                <span className="text-[9px] text-slate-500 mt-0.5">{heroContent.card2Subtitle}</span>
              </div>

              <div className="bg-white/95 p-2 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-center">
                <div className="flex items-center gap-1 text-[11px] font-black text-slate-900">
                  <Award className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>{heroContent.card3Title}</span>
                </div>
                <span className="text-[9px] text-slate-500 mt-0.5">{heroContent.card3Subtitle}</span>
              </div>

              <div className="bg-white/95 p-2 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-center">
                <div className="flex items-center gap-1 text-[11px] font-black text-slate-900">
                  <Percent className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                  <span>{heroContent.card4Title}</span>
                </div>
                <span className="text-[9px] text-slate-500 mt-0.5">{heroContent.card4Subtitle}</span>
              </div>
            </div>

            {/* 5. Dynamic Interactive Search Bar & Trending Tags */}
            <div className="max-w-xl mx-auto lg:mx-0">
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (searchKey.trim()) {
                    window.location.href = `/courses?search=${encodeURIComponent(searchKey)}`;
                  }
                }}
                className="relative flex items-center shadow-xs rounded-xl border border-slate-300 bg-white p-1 focus-within:ring-2 focus-within:ring-[#0B4F9C] transition-all"
              >
                <div className="pl-2.5 pr-1.5 text-slate-400">
                  <Search className="w-3.5 h-3.5 text-[#0B4F9C]" />
                </div>
                <input
                  type="text"
                  value={searchKey}
                  onChange={(e) => setSearchKey(e.target.value)}
                  placeholder={heroContent.searchPlaceholder}
                  className="w-full text-xs font-semibold text-slate-900 placeholder:text-slate-400 bg-transparent focus:outline-hidden py-1"
                />
                <button
                  type="submit"
                  className="shrink-0 bg-[#0B4F9C] hover:bg-[#083E7D] text-white text-[11px] font-bold py-1.5 px-3.5 rounded-lg transition-all shadow-xs cursor-pointer active:scale-95"
                >
                  Search
                </button>
              </form>

              {/* Popular Specialty Fast-Links */}
              <div className="flex items-center gap-1.5 flex-wrap mt-1 text-[10px] text-slate-500 justify-center lg:justify-start">
                <span className="font-extrabold text-slate-700">Top:</span>
                {trendingList.map((tag, idx) => (
                  <React.Fragment key={tag}>
                    <Link
                      href={`/courses?search=${encodeURIComponent(tag)}`}
                      className="hover:text-blue-700 font-bold underline decoration-blue-300"
                    >
                      {tag}
                    </Link>
                    {idx < trendingList.length - 1 && <span>•</span>}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* 6. Dynamic 2 Direct CTAs: Call Now & WhatsApp Desk */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 pt-0.5">
              <a
                href={phoneHref}
                className="group relative inline-flex items-center gap-2 bg-gradient-to-r from-[#0B4F9C] via-[#0D5BB5] to-[#1E40AF] hover:from-[#083E7D] hover:to-[#0B4F9C] text-white px-3.5 py-2 rounded-xl text-xs font-black shadow-md shadow-blue-900/15 hover:shadow-lg hover:shadow-blue-900/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer border border-blue-400/30"
              >
                <div className="w-5 h-5 rounded-lg bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors shrink-0">
                  <PhoneCall className="w-3 h-3 text-white animate-bounce" />
                </div>
                <div className="text-left">
                  <div className="text-[9px] uppercase tracking-wider font-extrabold text-blue-200 leading-none">
                    {heroContent.cta1Sub}
                  </div>
                  <div className="text-xs font-black text-white leading-tight">
                    {heroContent.cta1Main}
                  </div>
                </div>
              </a>

              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center gap-2 bg-gradient-to-r from-[#25D366] via-[#20BA5C] to-[#128C7E] hover:from-[#1EBE5D] hover:to-[#0E7065] text-white px-3.5 py-2 rounded-xl text-xs font-black shadow-md shadow-emerald-600/15 hover:shadow-lg hover:shadow-emerald-600/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer border border-emerald-300/30"
              >
                <div className="w-5 h-5 rounded-lg bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors shrink-0">
                  <MessageCircle className="w-3.5 h-3.5 text-white fill-white" />
                </div>
                <div className="text-left">
                  <div className="text-[9px] uppercase tracking-wider font-extrabold text-emerald-100 leading-none">
                    {heroContent.cta2Sub}
                  </div>
                  <div className="text-xs font-black text-white leading-tight">
                    {heroContent.cta2Main}
                  </div>
                </div>
              </a>
            </div>

            {/* 7. Dynamic Doctor Alumni Social Proof Strip */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 pt-1 border-t border-slate-200/60">
              <div className="flex -space-x-1.5">
                <div className="w-6 h-6 rounded-full bg-[#0B4F9C] text-white font-black text-[8px] flex items-center justify-center ring-2 ring-white shadow-2xs">Dr.A</div>
                <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-black text-[8px] flex items-center justify-center ring-2 ring-white shadow-2xs">Dr.V</div>
                <div className="w-6 h-6 rounded-full bg-indigo-600 text-white font-black text-[8px] flex items-center justify-center ring-2 ring-white shadow-2xs">Dr.S</div>
              </div>
              
              <div className="text-left flex items-center gap-1.5">
                <div className="flex items-center text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-amber-400" />
                  ))}
                  <span className="text-[11px] font-black text-slate-800 ml-1">
                    {heroContent.ratingValue}
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 font-medium">
                  • {heroContent.ratingText}
                </span>
              </div>
            </div>

          </div>

          {/* ========================================================================= */}
          {/* RIGHT COLUMN: ORIGINAL COMPLETE FORM (WITH ~1 CM TRIMMED HEIGHT)           */}
          {/* ========================================================================= */}
          <div className="lg:col-span-5 w-full max-w-md mx-auto">
            <div className="bg-white rounded-3xl border border-blue-200 shadow-2xl overflow-hidden relative">
              
              {/* Top Navy Banner */}
              <div className="bg-[#0B4F9C] py-2.5 px-4 text-white text-center relative">
                <div className="inline-flex items-center gap-1 bg-amber-400 text-slate-950 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider mb-0.5 shadow-xs">
                  <Sparkles className="w-2.5 h-2.5 text-slate-950 fill-slate-950" />
                  Priority 2026 Batch Application
                </div>
                <h3 className="text-sm font-black text-white font-display">
                  Apply for Clinical Fellowship
                </h3>
                <p className="text-[10px] text-blue-100">
                  Get full clinical curriculum, hospital slots & 0% EMI quote on WhatsApp
                </p>
              </div>

              {/* Form Body */}
              <div className="p-3.5 sm:p-4">
                <UniversalAdmissionForm
                  source="Homepage Master Hero Form"
                />
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
