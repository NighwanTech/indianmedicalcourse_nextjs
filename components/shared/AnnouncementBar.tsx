"use client";

import React, { useState, useEffect } from "react";
import { siteSettings } from "@/lib/data";
import { Sparkles, Phone, X, ShieldCheck, CheckCircle2, Percent } from "lucide-react";

const ANNOUNCEMENT_STORAGE_KEY = "imc_announcement_text";

export function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true);
  const [announcementText, setAnnouncementText] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(ANNOUNCEMENT_STORAGE_KEY);
      if (saved && saved.trim()) return saved;
    }
    return siteSettings.announcementText;
  });

  useEffect(() => {
    const handleStorage = () => {
      const saved = localStorage.getItem(ANNOUNCEMENT_STORAGE_KEY);
      if (saved) setAnnouncementText(saved);
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  if (!isVisible) return null;

  return (
    <aside 
      aria-label="Urgent Admission Alerts" 
      className="relative w-full overflow-hidden bg-gradient-to-r from-[#041B38] via-[#072F60] to-[#0B4F9C] text-white text-xs font-medium py-1.5 px-3 sm:px-6 shadow-xs border-b border-blue-900/40 z-50"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        
        {/* Left: Live Batch Notice */}
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            2026 Batch
          </span>
          <p className="text-white/90 text-xs truncate">
            {announcementText}
          </p>
        </div>

        {/* Center / Right: Benefits & Single Contact Hotline */}
        <div className="hidden lg:flex items-center gap-4 shrink-0 text-[11px]">
          <div className="flex items-center gap-1 text-blue-200">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>CPD International</span>
          </div>

          <div className="flex items-center gap-1 text-blue-200">
            <Percent className="w-3.5 h-3.5 text-amber-300" />
            <span>0% Interest EMI</span>
          </div>

          <a
            href={`tel:${siteSettings.hotlinePhone.replace(/\s+/g, "")}`}
            className="inline-flex items-center gap-1.5 bg-white/15 hover:bg-white/25 transition-colors border border-white/20 px-2.5 py-0.5 rounded-full text-[11px] font-bold text-white shadow-xs"
          >
            <Phone className="w-3 h-3 text-emerald-300" />
            <span>Helpline: {siteSettings.hotlinePhone}</span>
          </a>

          <button
            onClick={() => setIsVisible(false)}
            className="text-white/60 hover:text-white transition-colors p-0.5 rounded-md hover:bg-white/10 cursor-pointer"
            aria-label="Dismiss banner"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </aside>
  );
}
