"use client";

import React, { useState, useEffect } from "react";
import { 
  HeartPulse, 
  Dna, 
  Stethoscope, 
  GraduationCap, 
  Hospital, 
  Award,
  Sparkles,
  ChevronUp
} from "lucide-react";

export function MedicalScrollAnimation() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const totalScrollHeight = document.documentElement.scrollHeight - window.innerHeight;

      if (totalScrollHeight > 0) {
        const progress = Math.min(100, Math.max(0, (currentScrollY / totalScrollHeight) * 100));
        setScrollProgress(progress);
      }

      setShowScrollTop(currentScrollY > 450);
      setIsScrolling(true);

      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        setIsScrolling(false);
      }, 400);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 5 Vertical Medical Milestones representing the Doctor's Fellowship Journey
  const medicalMilestones = [
    { percent: 12, icon: HeartPulse, label: "Clinical Cardiology", color: "from-rose-500 to-red-600", glow: "rgba(244,63,94,0.4)" },
    { percent: 35, icon: Stethoscope, label: "Bedside ICU Training", color: "from-blue-600 to-cyan-500", glow: "rgba(37,99,235,0.4)" },
    { percent: 58, icon: Hospital, label: "50+ NABH Hospitals", color: "from-emerald-600 to-teal-500", glow: "rgba(16,185,129,0.4)" },
    { percent: 80, icon: Dna, label: "Super Specialty Mastery", color: "from-purple-600 to-indigo-500", glow: "rgba(147,51,234,0.4)" },
    { percent: 98, icon: Award, label: "CPD UK Fellowship Conferred", color: "from-amber-500 to-yellow-500", glow: "rgba(245,158,11,0.4)" },
  ];

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. LEFT WHITESPACE: VERTICAL MEDICAL LIFELINE TRACK (TOP TO BOTTOM)       */}
      {/* ========================================================================= */}
      <div 
        className="hidden 2xl:block fixed left-4 top-24 bottom-12 w-16 z-30 pointer-events-none select-none transition-opacity duration-300"
        aria-hidden="true"
      >
        {/* Background Vertical Guide Line */}
        <div className="absolute left-7 top-0 bottom-0 w-[2px] bg-gradient-to-b from-blue-100 via-slate-200 to-emerald-100 rounded-full" />

        {/* Dynamic Animated Scroll Fill Line (Top to Down Flow) */}
        <div 
          className="absolute left-7 top-0 w-[3px] bg-gradient-to-b from-[#0B4F9C] via-[#0D9468] to-[#00E5A3] rounded-full shadow-[0_0_10px_rgba(11,79,156,0.5)] transition-all duration-75"
          style={{ height: `${scrollProgress}%` }}
        />

        {/* Traveling Medical Pulse Dot / ECG Wave Head at Current Scroll Depth */}
        <div 
          className="absolute left-7 -translate-x-1/2 -translate-y-1/2 transition-all duration-75 flex items-center justify-center pointer-events-auto group cursor-pointer"
          style={{ top: `${scrollProgress}%` }}
        >
          {/* Pulsing Aura */}
          <span className={`absolute w-7 h-7 rounded-full bg-emerald-400 opacity-60 ${isScrolling ? "animate-ping" : "animate-pulse"}`} />
          <span className="relative w-4 h-4 rounded-full bg-gradient-to-tr from-[#0B4F9C] to-[#0D9468] border-2 border-white shadow-lg shadow-blue-900/40 flex items-center justify-center">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          </span>

          {/* Floating Tooltip Label on Hover */}
          <div className="absolute left-9 bg-slate-900/90 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-xl shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity border border-slate-700/60">
            {Math.round(scrollProgress)}% Medical Curriculum Depth
          </div>
        </div>

        {/* 5 Medical Nodes stationed along the whitespace line */}
        {medicalMilestones.map((node, i) => {
          const isReached = scrollProgress >= node.percent - 2;
          const Icon = node.icon;

          return (
            <div 
              key={i}
              className="absolute left-7 -translate-x-1/2 -translate-y-1/2 flex items-center pointer-events-auto group"
              style={{ top: `${node.percent}%` }}
            >
              {/* Node Icon Circle */}
              <div 
                className={`w-7 h-7 rounded-xl flex items-center justify-center border transition-all duration-500 ${
                  isReached
                    ? `bg-white text-slate-900 border-emerald-400 shadow-[0_0_15px_${node.glow}] scale-110`
                    : "bg-slate-50 text-slate-400 border-slate-200 shadow-xs"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isReached ? "text-[#0B4F9C]" : "text-slate-400"}`} />
              </div>

              {/* Hover Specialty Tag */}
              <div className={`absolute left-9 px-2.5 py-1 rounded-xl text-[10px] font-black tracking-tight whitespace-nowrap transition-all duration-300 shadow-md border ${
                isReached
                  ? "bg-white text-slate-800 border-slate-200/80 opacity-90 group-hover:opacity-100 group-hover:scale-105"
                  : "bg-slate-100/80 text-slate-400 border-slate-200 opacity-0 group-hover:opacity-100"
              }`}>
                {node.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* 2. RIGHT WHITESPACE: FLOATING MEDICAL AMBIENT PARTICLES (PARALLAX FLOW)    */}
      {/* ========================================================================= */}
      <div 
        className="hidden xl:block fixed right-6 top-32 bottom-20 w-8 z-10 pointer-events-none select-none"
        aria-hidden="true"
      >
        {/* Ambient Medical Cross 1 */}
        <div 
          className="absolute right-0 text-blue-500/20 font-black text-2xl transition-transform duration-300 ease-out"
          style={{ transform: `translateY(${scrollProgress * 2.5}px) rotate(${scrollProgress * 1.5}deg)` }}
        >
          ✚
        </div>

        {/* Ambient ECG Heartbeat Wave Mini 2 */}
        <div 
          className="absolute right-1 top-[40%] text-emerald-500/25 transition-transform duration-500 ease-out"
          style={{ transform: `translateY(${scrollProgress * -1.8}px)` }}
        >
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M2 12h4l2-6 4 12 3-8 2 4h5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {/* Ambient Medical Cross 3 */}
        <div 
          className="absolute right-2 top-[75%] text-emerald-600/15 font-black text-xl transition-transform duration-300 ease-out"
          style={{ transform: `translateY(${scrollProgress * 1.2}px) rotate(-${scrollProgress * 2}deg)` }}
        >
          ✚
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. ULTRA-MINIMAL TOP ECG PROGRESS STRIP (SUBTLE)                           */}
      {/* ========================================================================= */}
      <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none h-[2px] bg-transparent">
        <div 
          className="h-full bg-gradient-to-r from-[#0B4F9C] via-[#0D9468] to-[#00E5A3] transition-all duration-75 shadow-[0_0_8px_rgba(13,148,104,0.7)]"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* ========================================================================= */}
      {/* 4. SMOOTH SCROLL TO TOP FLOATING BUTTON                                   */}
      {/* ========================================================================= */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className="fixed bottom-6 right-6 z-40 w-11 h-11 rounded-2xl bg-gradient-to-br from-[#0B4F9C] to-[#0D9468] hover:from-[#083E7D] hover:to-[#0A7854] text-white flex items-center justify-center shadow-xl shadow-blue-900/20 hover:shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 border border-white/30 cursor-pointer group"
        >
          <ChevronUp className="w-5 h-5 transition-transform group-hover:-translate-y-0.5" />
          <span className="sr-only">Scroll back to top</span>
        </button>
      )}
    </>
  );
}
