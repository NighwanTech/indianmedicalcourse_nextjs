"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  GraduationCap, 
  CheckCircle2, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles,
  Users,
  Clock,
  Star,
  Award
} from "lucide-react";

export function FellowshipSpotlightBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  const programs = [
    {
      id: 1,
      title: "Fellowship in Clinical Cardiology",
      slug: "fellowship-in-clinical-cardiology",
      image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&auto=format&fit=crop&q=80",
      enrolled: "380+ Doctors Enrolled",
      lessons: "64 Clinical Modules",
      duration: "12 Months (Hybrid)",
      rating: "4.9 / 5.0",
      badge: "Clinical Cardiology",
      certificate: "CPD & Hospital Certificate Included",
      highlights: [
        "120+ Bedside 2D Echo & ECG Interpretations",
        "Cath Lab & TPI Rotation Observer-ship",
        "ICCU Emergency Protocol Training",
        "0% Interest EMI from ₹7,800/mo",
      ],
    },
    {
      id: 2,
      title: "Fellowship in Critical Care Medicine",
      slug: "fellowship-in-critical-care-medicine",
      image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&auto=format&fit=crop&q=80",
      enrolled: "420+ Doctors Enrolled",
      lessons: "58 Intensive Modules",
      duration: "12 Months (Hybrid)",
      rating: "5.0 / 5.0",
      badge: "Critical Care ICU",
      certificate: "CPD & Hospital Certificate Included",
      highlights: [
        "Mechanical Ventilation & Arterial Lines",
        "ARDS Management & Shock Resuscitation",
        "ICU Hands-on Bedside Attachments",
        "0% Interest EMI from ₹8,500/mo",
      ],
    },
    {
      id: 3,
      title: "Fellowship in Laparoscopic Surgery",
      slug: "fellowship-in-laparoscopic-surgery",
      image: "https://images.unsplash.com/photo-1551076805-e1869033e561?w=800&auto=format&fit=crop&q=80",
      enrolled: "290+ Surgeons Enrolled",
      lessons: "48 Surgical Modules",
      duration: "6 Months (Clinical OT)",
      rating: "4.9 / 5.0",
      badge: "Minimal Access Surgery",
      certificate: "Hands-on OT Certification Included",
      highlights: [
        "Endo-trainer Suturing & Knot Tying",
        "Live Lap Chole & Hernia OT Assisting",
        "Energy Sources & Laparoscopic Equipment",
        "0% Interest EMI from ₹11,200/mo",
      ],
    },
    {
      id: 4,
      title: "Fellowship in Fetal Medicine & Ultrasound",
      slug: "fellowship-in-fetal-medicine-ultrasound",
      image: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&auto=format&fit=crop&q=80",
      enrolled: "350+ Gynaecologists Enrolled",
      lessons: "52 Diagnostic Modules",
      duration: "12 Months (Hybrid)",
      rating: "5.0 / 5.0",
      badge: "Perinatology & Radiology",
      certificate: "Clinical Scan Reporting Certified",
      highlights: [
        "1st Trimester NT/NB & 2nd Trimester Anomaly Scans",
        "Fetal Doppler & Growth Restriction Audits",
        "Hands-on Patient Scanning Under Perinatologist",
        "0% Interest EMI from ₹9,200/mo",
      ],
    },
  ];

  // Auto slide every 6 seconds
  useEffect(() => {
    if (!isAutoPlay) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev === 0 ? 1 : 0));
    }, 6000);
    return () => clearInterval(timer);
  }, [isAutoPlay]);

  const displayedPairs = [
    [programs[0], programs[1]],
    [programs[2], programs[3]],
  ];

  const currentPair = displayedPairs[currentIndex];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 my-10">
      
      {/* Dark Navy Container */}
      <div 
        onMouseEnter={() => setIsAutoPlay(false)}
        onMouseLeave={() => setIsAutoPlay(true)}
        className="relative bg-gradient-to-b from-[#09152B] via-[#0B1A36] to-[#081326] text-white rounded-[2.5rem] p-6 sm:p-10 lg:p-12 border border-slate-700/60 shadow-2xl shadow-blue-950/40 overflow-hidden"
      >
        
        {/* Ambient Glows */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Section Header with Animated ECG Pulse Waves */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-8 relative z-10">
          
          <div className="flex items-center justify-center gap-3 sm:gap-4">
            {/* Left ECG Wave */}
            <div className="hidden sm:flex items-center w-24 sm:w-32 h-6 text-emerald-400">
              <svg viewBox="0 0 100 25" className="w-full h-full stroke-current fill-none stroke-[2.5] stroke-linecap-round stroke-linejoin-round animate-pulse">
                <path d="M0,12.5 L30,12.5 L38,2 L44,23 L50,8 L56,16 L62,12.5 L100,12.5" />
              </svg>
            </div>

            {/* Headline */}
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black font-display tracking-tight flex items-center gap-2 flex-wrap justify-center">
              <span className="text-emerald-400">Advanced Medical</span>
              <span className="text-white">Fellowship Programs</span>
            </h2>

            {/* Right ECG Wave */}
            <div className="hidden sm:flex items-center w-24 sm:w-32 h-6 text-emerald-400">
              <svg viewBox="0 0 100 25" className="w-full h-full stroke-current fill-none stroke-[2.5] stroke-linecap-round stroke-linejoin-round animate-pulse">
                <path d="M0,12.5 L30,12.5 L38,2 L44,23 L50,8 L56,16 L62,12.5 L100,12.5" />
              </svg>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 font-medium">
            Industry-focused hands-on clinical training programs designed for doctors and healthcare professionals.
          </p>
        </div>

        {/* 2 Side-by-Side Featured Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 relative z-10 transition-all duration-500">
          {currentPair.map((prog) => (
            <div
              key={prog.id}
              className="bg-slate-900/90 backdrop-blur-md rounded-3xl border border-slate-700/80 p-5 sm:p-6 flex flex-col sm:flex-row gap-5 hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-950/20 transition-all duration-300 group"
            >
              
              {/* Left Image Column with Zoom Effect */}
              <div className="sm:w-5/12 h-52 sm:h-auto rounded-2xl overflow-hidden relative bg-slate-950 shrink-0">
                <img
                  src={prog.image}
                  alt={prog.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                
                <span className="absolute bottom-2.5 left-2.5 text-[10px] font-black uppercase bg-emerald-500 text-slate-950 px-2.5 py-0.5 rounded-md shadow">
                  {prog.badge}
                </span>
              </div>

              {/* Right Content Column */}
              <div className="sm:w-7/12 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                      <GraduationCap className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                      Accredited Fellowship
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-black text-white group-hover:text-emerald-300 transition-colors leading-snug">
                    {prog.title}
                  </h3>
                </div>

                {/* Key Checklist with Green Checkmarks */}
                <div className="space-y-1.5 text-xs text-slate-300 font-medium">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{prog.enrolled}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{prog.lessons}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Duration: {prog.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Rating: {prog.rating} (Verified)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="text-emerald-300 font-semibold">{prog.certificate}</span>
                  </div>
                </div>

                {/* Blue CTA Button */}
                <div className="pt-2">
                  <Link
                    href={`/courses/${prog.slug}`}
                    className="inline-flex items-center justify-center gap-2 w-full sm:w-auto bg-[#1B62BF] hover:bg-[#154fa0] text-white text-xs font-black py-2.5 px-6 rounded-xl shadow-md transition-all group-hover:gap-3"
                  >
                    <span>Explore Program</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

              </div>

            </div>
          ))}
        </div>

        {/* Carousel Navigation Arrows & Pagination Dots */}
        <div className="flex items-center justify-between mt-8 pt-4 border-t border-slate-800/80 relative z-10">
          
          {/* Prev Arrow */}
          <button
            onClick={() => setCurrentIndex((prev) => (prev === 0 ? 1 : 0))}
            className="w-9 h-9 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-all border border-slate-700"
            aria-label="Previous Fellowship Slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Dots Indicator */}
          <div className="flex items-center gap-2">
            {[0, 1].map((idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2.5 rounded-full transition-all ${
                  currentIndex === idx
                    ? "w-8 bg-emerald-400"
                    : "w-2.5 bg-slate-700 hover:bg-slate-600"
                }`}
                aria-label={`Slide to pair ${idx + 1}`}
              />
            ))}
          </div>

          {/* Next Arrow */}
          <button
            onClick={() => setCurrentIndex((prev) => (prev === 0 ? 1 : 0))}
            className="w-9 h-9 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-all border border-slate-700"
            aria-label="Next Fellowship Slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

        </div>

      </div>

    </div>
  );
}
