"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MediaLibraryPickerModal, MediaItem } from "@/components/admin/MediaLibraryPickerModal";
import { AdminSecurityConfirmModal } from "@/components/admin/AdminSecurityConfirmModal";
import { 
  Layout, 
  Save, 
  CheckCircle2, 
  Image as ImageIcon, 
  Video, 
  FileText, 
  Eye, 
  EyeOff, 
  Sparkles, 
  Link as LinkIcon,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Building2
} from "lucide-react";

const DEFAULT_HERO = {
  isEnabled: true,
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

export default function AdminHomepageSectionsPage() {
  const [isSaved, setIsSaved] = useState(false);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [activePickerField, setActivePickerField] = useState<string | null>(null);

  // Security confirmation modal state
  const [securityModal, setSecurityModal] = useState<{
    isOpen: boolean;
    type: "all" | "ribbon" | "hero";
    title: string;
    description: string;
  }>({
    isOpen: false,
    type: "all",
    title: "",
    description: "",
  });

  // Structured Section Content State with LocalStorage Persistence
  const [sections, setSections] = useState(() => {
    const base = {
      hero: DEFAULT_HERO,
      fellowshipSpotlight: {
        isEnabled: true,
        headlineStart: "Advanced Medical",
        headlineHighlight: "Fellowship Programs",
        pulseAnimation: true,
        card1Title: "Fellowship in Clinical Cardiology",
        card1FeeINR: "₹1,25,000",
        card1EmiINR: "₹7,800/mo",
        card2Title: "Fellowship in Critical Care Medicine",
        card2FeeINR: "₹1,35,000",
        card2EmiINR: "₹8,500/mo",
      },
      aboutUs: {
        isEnabled: true,
        subtitle: "WELCOME TO",
        titleGreen: "ABOUT",
        titleBlue: "INDIAN MEDICAL COURSE",
        description1: "At Indian Medical Course, we empower UG, PG, and healthcare professionals with advanced fellowships, certification programs, and practical learning designed to enhance clinical knowledge, skills, and career growth.",
        highlightBoxText: "Skilled Medical Faculty & Academic Mentorship with 10+ Years' Clinical Training Experience",
        stat1Number: "12,000+",
        stat1Label: "Doctors",
        stat2Number: "200+",
        stat2Label: "Mentors",
        stat3Number: "50+ Hospitals",
        stat3Label: "Pan India",
        btnText: "Learn More",
        btnUrl: "/courses",
      },
      ctaBanner: {
        isEnabled: true,
        heading: "Ready to Supercharge Your Medical Practice in 2026?",
        subheading: "Speak with a Senior Academic Medical Advisor today. Limited batch capacity per hospital center.",
        btnText: "Request Call Back Now",
        btnUrl: "/book-counselling",
      },
    };

    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("imc_homepage_sections");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          return {
            ...base,
            ...parsed,
            hero: { ...DEFAULT_HERO, ...(parsed.hero || {}) },
          };
        } catch (e) {
          console.error(e);
        }
      }
    }
    return base;
  });

  const [expandedSection, setExpandedSection] = useState<string>("hero");

  const toggleSectionExpand = (secKey: string) => {
    setExpandedSection(expandedSection === secKey ? "" : secKey);
  };

  const handleMediaSelect = (media: MediaItem) => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
    setIsMediaPickerOpen(false);
  };

  // Announcement Ribbon State with LocalStorage Sync
  const [announcementText, setAnnouncementText] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("imc_announcement_text");
      if (saved && saved.trim()) return saved;
    }
    return "Admissions Open for 2026 Batches | Limited Clinical Training Seats Available | 0% Interest EMI Options";
  });

  const DEFAULT_ANNOUNCEMENT = "Admissions Open for 2026 Batches | Limited Clinical Training Seats Available | 0% Interest EMI Options";

  const executeResetRibbon = () => {
    setAnnouncementText(DEFAULT_ANNOUNCEMENT);
    if (typeof window !== "undefined") {
      localStorage.setItem("imc_announcement_text", DEFAULT_ANNOUNCEMENT);
    }
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const executeResetHero = () => {
    const updated = {
      ...sections,
      hero: DEFAULT_HERO,
    };
    setSections(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("imc_homepage_sections", JSON.stringify(updated));
    }
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const executeResetAll = () => {
    const defaultSections = {
      ...sections,
      hero: DEFAULT_HERO,
    };
    setSections(defaultSections);
    setAnnouncementText(DEFAULT_ANNOUNCEMENT);
    if (typeof window !== "undefined") {
      localStorage.setItem("imc_homepage_sections", JSON.stringify(defaultSections));
      localStorage.setItem("imc_announcement_text", DEFAULT_ANNOUNCEMENT);
    }
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleOpenResetAll = () => {
    setSecurityModal({
      isOpen: true,
      type: "all",
      title: "Reset All Homepage Sections",
      description: "Enter Master Admin Password to reset all hero banners, statistics, CTAs, and spotlights to factory defaults.",
    });
  };

  const handleOpenResetRibbon = () => {
    setSecurityModal({
      isOpen: true,
      type: "ribbon",
      title: "Reset Announcement Ribbon",
      description: "Enter Master Admin Password to restore the top header announcement ribbon to default copy.",
    });
  };

  const handleOpenResetHero = () => {
    setSecurityModal({
      isOpen: true,
      type: "hero",
      title: "Reset Hero Section Copy & Cards",
      description: "Enter Master Admin Password to restore all Hero headlines, description, 4 clinical advantage cards, CTAs, and ratings to default.",
    });
  };

  const handleSaveAll = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("imc_homepage_sections", JSON.stringify(sections));
      localStorage.setItem("imc_announcement_text", announcementText);
    }
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 font-display">
            Homepage Content & Structured Sections
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            The layout design is fixed. Edit ribbon text, hero copy, numbers, media assets, and button URLs in real-time.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {isSaved && (
            <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-2 rounded-xl animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Saved Successfully!</span>
            </div>
          )}

          <Link
            href="/admin/partners"
            className="inline-flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-[#0B4F9C] text-xs font-bold py-2.5 px-3.5 rounded-xl shadow-2xs hover:shadow-xs transition-all cursor-pointer"
          >
            <Building2 className="w-3.5 h-3.5 text-[#0B4F9C]" />
            <span>Manage Hospital & University Logos</span>
          </Link>

          <button
            onClick={handleOpenResetAll}
            className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200/80 text-slate-700 text-xs font-bold py-2.5 px-3.5 rounded-xl shadow-2xs hover:shadow-xs transition-all cursor-pointer"
            title="Reset all homepage copy and sections to defaults"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            onClick={handleSaveAll}
            className="inline-flex items-center gap-1.5 bg-[#0B4F9C] hover:bg-[#083E7D] text-white text-xs font-bold py-2.5 px-5 rounded-xl shadow-xs transition-all cursor-pointer hover:shadow-md hover:scale-105 active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>Save All Changes</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 00. TOP HEADER ANNOUNCEMENT & URGENT ADMISSION RIBBON                     */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 bg-gradient-to-r from-blue-50/80 to-indigo-50/50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-black text-xs">
              00
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-black text-slate-900 font-display">
                  Top Header Announcement & Urgent Admission Ribbon
                </h2>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full">
                  Live on All Pages
                </span>
              </div>
              <p className="text-xs text-slate-500">
                The top banner alert bar shown at the very top of the website header.
              </p>
            </div>
          </div>

          <button
            onClick={handleOpenResetRibbon}
            className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold py-1.5 px-3 rounded-xl transition-all cursor-pointer shadow-2xs"
            title="Reset Ribbon to default copy"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Ribbon</span>
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Live Preview */}
          <div>
            <label className="block text-[11px] font-black uppercase tracking-wider text-slate-400 mb-1.5">
              Live Ribbon Preview:
            </label>
            <div className="bg-gradient-to-r from-[#041B38] via-[#072F60] to-[#0B4F9C] text-white text-xs font-medium py-2.5 px-4 rounded-2xl shadow-xs flex items-center justify-between gap-3 border border-blue-900">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  2026 Batch
                </span>
                <p className="text-white/95 text-xs truncate font-medium">
                  {announcementText}
                </p>
              </div>
              <div className="hidden sm:flex items-center gap-2 text-[11px] text-blue-200 shrink-0">
                <span>0% EMI Available</span>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700">
                Announcement Ribbon Copy *
              </label>
              <button
                type="button"
                onClick={() => setAnnouncementText(DEFAULT_ANNOUNCEMENT)}
                className="text-[11px] font-bold text-blue-600 hover:text-blue-800 underline cursor-pointer"
              >
                Set Default Text
              </button>
            </div>
            <textarea
              rows={2}
              value={announcementText}
              onChange={(e) => {
                setAnnouncementText(e.target.value);
                if (typeof window !== "undefined") {
                  localStorage.setItem("imc_announcement_text", e.target.value);
                }
              }}
              placeholder="Admissions Open for 2026 Batches | Limited Clinical Training Seats Available | 0% Interest EMI Options"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600 leading-relaxed font-sans"
            />
            <p className="text-[10px] text-slate-400 mt-1">
              Characters: <span className="font-mono font-bold text-slate-700">{announcementText.length}</span> • Updates immediately on the public website!
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. HERO SECTION ACCORDION                                                 */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div 
          className="p-5 bg-gradient-to-r from-blue-50/70 to-indigo-50/40 border-b border-slate-200 flex items-center justify-between"
        >
          <div 
            onClick={() => toggleSectionExpand("hero")}
            className="flex items-center gap-3 cursor-pointer flex-1"
          >
            <span className="w-8 h-8 rounded-xl bg-blue-100 text-[#0B4F9C] flex items-center justify-center font-black text-xs">
              01
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-extrabold text-slate-900">Hero Section Master Copy & Cards</h3>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full">
                  Live Dynamic
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Main headline, description, 4 clinical advantage chips, search fast-links, 2 CTAs, and doctor rating strip.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleOpenResetHero}
              className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold py-1.5 px-3 rounded-xl transition-all cursor-pointer shadow-2xs"
              title="Reset Hero Section to default copy"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Hero</span>
            </button>

            <button 
              type="button"
              onClick={() => toggleSectionExpand("hero")}
              className="p-1.5 hover:bg-white rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              {expandedSection === "hero" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {expandedSection === "hero" && (
          <div className="p-6 space-y-6">
            
            {/* Live Visual Preview Strip */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50/40 border border-blue-100 space-y-3">
              <div className="flex items-center justify-between text-xs text-blue-900 font-extrabold">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  Hero Live Preview
                </span>
                <span className="text-[10px] text-slate-500 font-normal">Real-time update on homepage</span>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs space-y-2">
                <div className="inline-block bg-blue-50 border border-blue-200 text-[10px] font-bold px-2 py-0.5 rounded-full text-[#0B4F9C]">
                  {sections.hero.badgeText}
                </div>
                <div className="text-sm font-black text-slate-900 font-display">
                  {sections.hero.titleStart}{" "}
                  <span className="text-blue-700">{sections.hero.titleHighlight}</span>{" "}
                  {sections.hero.titleEnd}
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed line-clamp-2">
                  {sections.hero.subtitle}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 pt-1">
                  <div className="p-1.5 bg-slate-50 rounded-lg border text-[10px]">
                    <div className="font-bold text-slate-900">{sections.hero.card1Title}</div>
                    <div className="text-[9px] text-slate-500">{sections.hero.card1Subtitle}</div>
                  </div>
                  <div className="p-1.5 bg-slate-50 rounded-lg border text-[10px]">
                    <div className="font-bold text-slate-900">{sections.hero.card2Title}</div>
                    <div className="text-[9px] text-slate-500">{sections.hero.card2Subtitle}</div>
                  </div>
                  <div className="p-1.5 bg-slate-50 rounded-lg border text-[10px]">
                    <div className="font-bold text-slate-900">{sections.hero.card3Title}</div>
                    <div className="text-[9px] text-slate-500">{sections.hero.card3Subtitle}</div>
                  </div>
                  <div className="p-1.5 bg-slate-50 rounded-lg border text-[10px]">
                    <div className="font-bold text-slate-900">{sections.hero.card4Title}</div>
                    <div className="text-[9px] text-slate-500">{sections.hero.card4Subtitle}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* 1. Top Pill Badge */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                1. Top Luminous Pill Badge *
              </label>
              <input
                type="text"
                value={sections.hero.badgeText}
                onChange={(e) => setSections({
                  ...sections,
                  hero: { ...sections.hero, badgeText: e.target.value }
                })}
                placeholder="🚀 ADMISSIONS OPEN FOR 2026 BATCHES • 40% MERIT SCHOLARSHIPS"
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600"
              />
            </div>

            {/* 2. Main Headline 3-Part Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Headline: Beginning *
                </label>
                <input
                  type="text"
                  value={sections.hero.titleStart}
                  onChange={(e) => setSections({
                    ...sections,
                    hero: { ...sections.hero, titleStart: e.target.value }
                  })}
                  placeholder="Advance Your Clinical Practice With"
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Headline: Highlight (Blue/Green) *
                </label>
                <input
                  type="text"
                  value={sections.hero.titleHighlight}
                  onChange={(e) => setSections({
                    ...sections,
                    hero: { ...sections.hero, titleHighlight: e.target.value }
                  })}
                  placeholder="Premier Medical Fellowships"
                  className="w-full text-xs p-2.5 bg-slate-50 border border-blue-300 text-blue-800 rounded-xl font-black focus:bg-white focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Headline: Ending *
                </label>
                <input
                  type="text"
                  value={sections.hero.titleEnd || "& PG Diplomas"}
                  onChange={(e) => setSections({
                    ...sections,
                    hero: { ...sections.hero, titleEnd: e.target.value }
                  })}
                  placeholder="& PG Diplomas"
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            {/* 3. Subtitle Description */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                3. Hero Narrative Description *
              </label>
              <textarea
                rows={3}
                value={sections.hero.subtitle}
                onChange={(e) => setSections({
                  ...sections,
                  hero: { ...sections.hero, subtitle: e.target.value }
                })}
                placeholder="Hands-on Cath Lab Observerships, 2D Echo Bedside Scanning..."
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-600 leading-relaxed"
              />
            </div>

            {/* 4. 4 Clinical Advantage Cards */}
            <div className="pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between mb-2.5">
                <label className="block text-xs font-black text-slate-900 uppercase tracking-wider">
                  4. The 4 Clinical Advantage Chips
                </label>
                <span className="text-[10px] text-slate-400">Cards shown under the description</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* Card 1 */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                  <div className="text-[10px] font-black text-emerald-800 uppercase">Card 1 (No NEET PG)</div>
                  <input
                    type="text"
                    value={sections.hero.card1Title || "No NEET PG"}
                    onChange={(e) => setSections({
                      ...sections,
                      hero: { ...sections.hero, card1Title: e.target.value }
                    })}
                    placeholder="Title"
                    className="w-full text-xs p-1.5 bg-white border border-slate-200 rounded-lg font-bold"
                  />
                  <input
                    type="text"
                    value={sections.hero.card1Subtitle || "Direct CV Eligibility"}
                    onChange={(e) => setSections({
                      ...sections,
                      hero: { ...sections.hero, card1Subtitle: e.target.value }
                    })}
                    placeholder="Subtitle"
                    className="w-full text-[11px] p-1.5 bg-white border border-slate-200 rounded-lg text-slate-600"
                  />
                </div>

                {/* Card 2 */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                  <div className="text-[10px] font-black text-blue-800 uppercase">Card 2 (50+ Hospitals)</div>
                  <input
                    type="text"
                    value={sections.hero.card2Title || "50+ Hospitals"}
                    onChange={(e) => setSections({
                      ...sections,
                      hero: { ...sections.hero, card2Title: e.target.value }
                    })}
                    placeholder="Title"
                    className="w-full text-xs p-1.5 bg-white border border-slate-200 rounded-lg font-bold"
                  />
                  <input
                    type="text"
                    value={sections.hero.card2Subtitle || "Apollo, Fortis, Max"}
                    onChange={(e) => setSections({
                      ...sections,
                      hero: { ...sections.hero, card2Subtitle: e.target.value }
                    })}
                    placeholder="Subtitle"
                    className="w-full text-[11px] p-1.5 bg-white border border-slate-200 rounded-lg text-slate-600"
                  />
                </div>

                {/* Card 3 */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                  <div className="text-[10px] font-black text-amber-800 uppercase">Card 3 (CPD UK)</div>
                  <input
                    type="text"
                    value={sections.hero.card3Title || "CPD (UK)"}
                    onChange={(e) => setSections({
                      ...sections,
                      hero: { ...sections.hero, card3Title: e.target.value }
                    })}
                    placeholder="Title"
                    className="w-full text-xs p-1.5 bg-white border border-slate-200 rounded-lg font-bold"
                  />
                  <input
                    type="text"
                    value={sections.hero.card3Subtitle || "Valid Letterhead"}
                    onChange={(e) => setSections({
                      ...sections,
                      hero: { ...sections.hero, card3Subtitle: e.target.value }
                    })}
                    placeholder="Subtitle"
                    className="w-full text-[11px] p-1.5 bg-white border border-slate-200 rounded-lg text-slate-600"
                  />
                </div>

                {/* Card 4 */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                  <div className="text-[10px] font-black text-purple-800 uppercase">Card 4 (0% EMI)</div>
                  <input
                    type="text"
                    value={sections.hero.card4Title || "0% EMI"}
                    onChange={(e) => setSections({
                      ...sections,
                      hero: { ...sections.hero, card4Title: e.target.value }
                    })}
                    placeholder="Title"
                    className="w-full text-xs p-1.5 bg-white border border-slate-200 rounded-lg font-bold"
                  />
                  <input
                    type="text"
                    value={sections.hero.card4Subtitle || "From ₹6,500/mo"}
                    onChange={(e) => setSections({
                      ...sections,
                      hero: { ...sections.hero, card4Subtitle: e.target.value }
                    })}
                    placeholder="Subtitle"
                    className="w-full text-[11px] p-1.5 bg-white border border-slate-200 rounded-lg text-slate-600"
                  />
                </div>
              </div>
            </div>

            {/* 5. Search Bar & Trending Fast-Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Search Bar Placeholder
                </label>
                <input
                  type="text"
                  value={sections.hero.searchPlaceholder || "Search Cardiology, ICU, Laparoscopy, Ultrasound..."}
                  onChange={(e) => setSections({
                    ...sections,
                    hero: { ...sections.hero, searchPlaceholder: e.target.value }
                  })}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Trending Keywords (Comma Separated)
                </label>
                <input
                  type="text"
                  value={sections.hero.trendingKeywords || "Cardiology, Critical Care ICU, Fetal Ultrasound, Laparoscopy"}
                  onChange={(e) => setSections({
                    ...sections,
                    hero: { ...sections.hero, trendingKeywords: e.target.value }
                  })}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            {/* 6. Call Now & WhatsApp Desk CTAs */}
            <div className="pt-2 border-t border-slate-100">
              <label className="block text-xs font-black text-slate-900 uppercase tracking-wider mb-2">
                6. Direct Action CTAs (Call Now & WhatsApp Desk)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-blue-50/50 border border-blue-200 rounded-xl space-y-1.5">
                  <div className="text-[10px] font-black text-[#0B4F9C]">CTA 1: Call Helpline Button</div>
                  <input
                    type="text"
                    value={sections.hero.cta1Sub || "Admissions Desk"}
                    onChange={(e) => setSections({
                      ...sections,
                      hero: { ...sections.hero, cta1Sub: e.target.value }
                    })}
                    placeholder="Top Micro Label"
                    className="w-full text-xs p-1.5 bg-white border border-slate-200 rounded-lg"
                  />
                  <input
                    type="text"
                    value={sections.hero.cta1Main || "Call Now"}
                    onChange={(e) => setSections({
                      ...sections,
                      hero: { ...sections.hero, cta1Main: e.target.value }
                    })}
                    placeholder="Main Button Text"
                    className="w-full text-xs p-1.5 bg-white border border-slate-200 rounded-lg font-bold text-blue-900"
                  />
                </div>

                <div className="p-3 bg-emerald-50/50 border border-emerald-200 rounded-xl space-y-1.5">
                  <div className="text-[10px] font-black text-emerald-800">CTA 2: WhatsApp Desk Button</div>
                  <input
                    type="text"
                    value={sections.hero.cta2Sub || "Instant WhatsApp"}
                    onChange={(e) => setSections({
                      ...sections,
                      hero: { ...sections.hero, cta2Sub: e.target.value }
                    })}
                    placeholder="Top Micro Label"
                    className="w-full text-xs p-1.5 bg-white border border-slate-200 rounded-lg"
                  />
                  <input
                    type="text"
                    value={sections.hero.cta2Main || "Chat on WhatsApp"}
                    onChange={(e) => setSections({
                      ...sections,
                      hero: { ...sections.hero, cta2Main: e.target.value }
                    })}
                    placeholder="Main Button Text"
                    className="w-full text-xs p-1.5 bg-white border border-slate-200 rounded-lg font-bold text-emerald-900"
                  />
                </div>
              </div>
            </div>

            {/* 7. Rating & Doctor Alumni Social Proof Strip */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Rating Value (e.g. 4.9/5)
                </label>
                <input
                  type="text"
                  value={sections.hero.ratingValue || "4.9/5"}
                  onChange={(e) => setSections({
                    ...sections,
                    hero: { ...sections.hero, ratingValue: e.target.value }
                  })}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-amber-700 focus:bg-white focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Alumni Proof Text
                </label>
                <input
                  type="text"
                  value={sections.hero.ratingText || "12,000+ Doctor Alumni Across India"}
                  onChange={(e) => setSections({
                    ...sections,
                    hero: { ...sections.hero, ratingText: e.target.value }
                  })}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 2. ABOUT IMC SECTION ACCORDION                                            */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div 
          onClick={() => toggleSectionExpand("aboutUs")}
          className="p-5 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between cursor-pointer hover:bg-slate-100/80 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
              02
            </span>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">Welcome to About IMC (3D Cards & Stats)</h3>
              <p className="text-[11px] text-slate-500">Narrative text, highlighted callout box, and 3-column stats pill card</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              Enabled
            </span>
            {expandedSection === "aboutUs" ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </div>
        </div>

        {expandedSection === "aboutUs" && (
          <div className="p-6 space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Main Narrative Paragraph
              </label>
              <textarea
                rows={3}
                value={sections.aboutUs.description1}
                onChange={(e) => setSections({
                  ...sections,
                  aboutUs: { ...sections.aboutUs, description1: e.target.value }
                })}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Highlight Callout Box Text (Italic)
              </label>
              <input
                type="text"
                value={sections.aboutUs.highlightBoxText}
                onChange={(e) => setSections({
                  ...sections,
                  aboutUs: { ...sections.aboutUs, highlightBoxText: e.target.value }
                })}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            {/* 3 Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-slate-100">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Stat 1 (Count / Label)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={sections.aboutUs.stat1Number}
                    onChange={(e) => setSections({
                      ...sections,
                      aboutUs: { ...sections.aboutUs, stat1Number: e.target.value }
                    })}
                    className="w-1/2 text-xs p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-emerald-700"
                  />
                  <input
                    type="text"
                    value={sections.aboutUs.stat1Label}
                    onChange={(e) => setSections({
                      ...sections,
                      aboutUs: { ...sections.aboutUs, stat1Label: e.target.value }
                    })}
                    className="w-1/2 text-xs p-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Stat 2 (Count / Label)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={sections.aboutUs.stat2Number}
                    onChange={(e) => setSections({
                      ...sections,
                      aboutUs: { ...sections.aboutUs, stat2Number: e.target.value }
                    })}
                    className="w-1/2 text-xs p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-emerald-700"
                  />
                  <input
                    type="text"
                    value={sections.aboutUs.stat2Label}
                    onChange={(e) => setSections({
                      ...sections,
                      aboutUs: { ...sections.aboutUs, stat2Label: e.target.value }
                    })}
                    className="w-1/2 text-xs p-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Stat 3 (Count / Label)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={sections.aboutUs.stat3Number}
                    onChange={(e) => setSections({
                      ...sections,
                      aboutUs: { ...sections.aboutUs, stat3Number: e.target.value }
                    })}
                    className="w-1/2 text-xs p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-emerald-700"
                  />
                  <input
                    type="text"
                    value={sections.aboutUs.stat3Label}
                    onChange={(e) => setSections({
                      ...sections,
                      aboutUs: { ...sections.aboutUs, stat3Label: e.target.value }
                    })}
                    className="w-1/2 text-xs p-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Media Picker Modal */}
      <MediaLibraryPickerModal
        isOpen={isMediaPickerOpen}
        onClose={() => setIsMediaPickerOpen(false)}
        onSelect={handleMediaSelect}
        title="Select Media Asset for Homepage Section"
      />

      {/* Master Admin Security Password Confirmation Modal */}
      <AdminSecurityConfirmModal
        isOpen={securityModal.isOpen}
        onClose={() => setSecurityModal((prev) => ({ ...prev, isOpen: false }))}
        onSuccess={() => {
          if (securityModal.type === "ribbon") {
            executeResetRibbon();
          } else if (securityModal.type === "hero") {
            executeResetHero();
          } else {
            executeResetAll();
          }
        }}
        title={securityModal.title}
        description={securityModal.description}
        actionLabel={
          securityModal.type === "ribbon" 
            ? "Verify & Reset Ribbon" 
            : securityModal.type === "hero"
            ? "Verify & Reset Hero Defaults"
            : "Verify & Reset All Sections"
        }
      />

    </div>
  );
}
