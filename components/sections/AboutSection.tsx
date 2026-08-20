"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  CheckCircle2, 
  ArrowRight, 
  Home, 
  Users, 
  MapPin, 
  GraduationCap, 
  Award, 
  Sparkles,
  Stethoscope,
  FileCheck,
  BookOpen
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function AboutSection() {
  const [activeCardIndex, setActiveCardIndex] = useState(0);

  const stackCards = [
    {
      id: 1,
      title: "Fellowship Courses",
      badgeIcon: Stethoscope,
      image: "https://images.unsplash.com/photo-1551076805-e1869033e561?w=800&auto=format&fit=crop&q=80",
      description:
        "Our Fellowship Courses help healthcare professionals enhance clinical expertise, specialize in high-demand medical fields, and stay updated with modern healthcare advancements through flexible learning, expert mentorship, and recognized certifications.",
    },
    {
      id: 2,
      title: "Certificates Courses",
      badgeIcon: Award,
      image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&auto=format&fit=crop&q=80",
      description:
        "Our Certification Courses are designed to provide practical knowledge, specialized training, and career-oriented skills in various healthcare and medical domains. These programs help learners stay updated with the latest industry practices while improving professional credibility and career opportunities.",
    },
    {
      id: 3,
      title: "PG Diploma Courses",
      badgeIcon: GraduationCap,
      image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&auto=format&fit=crop&q=80",
      description:
        "Structured comprehensive post-graduate diplomas featuring rigorous clinical curriculum, recognized CME credit hours, hands-on ICU observer-ships, and practical bedside training modules designed around hospital duty shifts.",
    },
  ];

  // Auto-cycle stacked cards every 4.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCardIndex((prev) => (prev + 1) % stackCards.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [stackCards.length]);

  return (
    <section className="py-16 lg:py-24 bg-[#F8FAFC] relative overflow-hidden">
      
      {/* Background Decorative Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-60 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* ========================================================================= */}
          {/* LEFT COLUMN: 3D ANIMATED STACKED CARDS DECK (5 cols)                      */}
          {/* ========================================================================= */}
          <div className="lg:col-span-5 relative flex items-center justify-center min-h-[440px] sm:min-h-[480px]">
            
            <div 
              className="relative w-72 sm:w-84 h-[420px] cursor-pointer"
              onClick={() => setActiveCardIndex((prev) => (prev + 1) % stackCards.length)}
            >
              {stackCards.map((card, index) => {
                // Calculate position relative to active card
                const position = (index - activeCardIndex + stackCards.length) % stackCards.length;
                const isFront = position === 0;
                const isMiddle = position === 1;
                const isBack = position === 2;
                const Icon = card.badgeIcon;

                return (
                  <motion.div
                    key={card.id}
                    animate={{
                      top: isFront ? 0 : isMiddle ? -12 : -24,
                      left: isFront ? 0 : isMiddle ? 16 : 32,
                      scale: isFront ? 1 : isMiddle ? 0.94 : 0.88,
                      rotate: isFront ? 0 : isMiddle ? 3 : 6,
                      zIndex: isFront ? 30 : isMiddle ? 20 : 10,
                      opacity: isFront ? 1 : isMiddle ? 0.75 : 0.45,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 24,
                    }}
                    className={`absolute inset-0 rounded-[1.8rem] overflow-hidden bg-[#0A3D78] text-white shadow-2xl border-2 ${
                      isFront ? "border-blue-400/80 shadow-blue-900/30" : "border-blue-900/40"
                    } flex flex-col justify-between`}
                    style={{
                      transformOrigin: "bottom center",
                    }}
                  >
                    
                    {/* Top Image Banner */}
                    <div className="relative h-44 w-full overflow-hidden bg-slate-950">
                      <img
                        src={card.image}
                        alt={card.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0A3D78] via-transparent to-black/30" />
                      
                      {/* Live Cycling Badge */}
                      {isFront && (
                        <div className="absolute top-3 right-3 bg-emerald-500 text-slate-950 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full shadow-md flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          <span>Tap to flip</span>
                        </div>
                      )}
                    </div>

                    {/* Bottom Card Content */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-2">
                      <div>
                        {/* Icon & Title */}
                        <div className="flex items-center gap-2 mb-1.5">
                          <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                            <Icon className="w-4 h-4" />
                          </div>
                          <h3 className="text-base sm:text-lg font-black text-emerald-400 leading-none">
                            {card.title}
                          </h3>
                        </div>

                        {/* Paragraph Description */}
                        <p className="text-[11px] sm:text-xs text-slate-200 leading-relaxed font-normal">
                          {card.description}
                        </p>
                      </div>

                      {/* Card Footer Indicator */}
                      <div className="pt-2 border-t border-blue-800/80 flex items-center justify-between text-[10px] text-blue-200 font-bold">
                        <span>Card {index + 1} of 3</span>
                        <span className="text-emerald-300">Indian Medical Course</span>
                      </div>
                    </div>

                  </motion.div>
                );
              })}
            </div>

          </div>

          {/* ========================================================================= */}
          {/* RIGHT COLUMN: WELCOME TO ABOUT INDIAN MEDICAL COURSE (7 cols)             */}
          {/* ========================================================================= */}
          <div className="lg:col-span-7 space-y-5 text-left">
            
            {/* Subtitle */}
            <div className="text-xs font-black text-[#0B4F9C] tracking-widest uppercase">
              WELCOME TO
            </div>

            {/* Main Dual-Color Headline */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight font-display">
              <span className="text-[#0D9468]">ABOUT</span>{" "}
              <span className="text-[#0B4F9C]">INDIAN MEDICAL COURSE</span>
            </h2>

            {/* Primary Paragraph */}
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-medium">
              At <strong className="text-slate-900 font-bold">Indian Medical Course</strong>, we empower UG, PG, and healthcare professionals with advanced fellowships, certification programs, and practical learning designed to enhance clinical knowledge, skills, and career growth.
            </p>

            {/* Highlight Callout Box (Light Gray-Blue Box) */}
            <div className="bg-[#E9EEF5] border border-blue-100 p-4 sm:p-5 rounded-2xl text-xs sm:text-sm font-semibold text-slate-800 italic">
              "Skilled Medical Faculty & Academic Mentorship with 10+ Years' Clinical Training Experience"
            </div>

            {/* Secondary Paragraph */}
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              With smart search, real reviews, and easy comparison tools, you can confidently choose the perfect program — all in one place.
            </p>

            {/* Unified 3-Column Stat Box */}
            <div className="bg-[#E9EEF5] border border-slate-200/90 rounded-2xl p-4 sm:p-5 grid grid-cols-3 divide-x divide-slate-300/80 items-center">
              
              {/* Stat 1: Data / Enrolments */}
              <div className="flex items-center gap-3 px-2 sm:px-3">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                  <Home className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-base sm:text-xl font-black text-emerald-600 font-display leading-tight">
                    12,000+
                  </div>
                  <div className="text-[10px] sm:text-xs font-bold text-slate-600">
                    Doctors
                  </div>
                </div>
              </div>

              {/* Stat 2: Students / Mentors */}
              <div className="flex items-center gap-3 px-2 sm:px-3">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-base sm:text-xl font-black text-emerald-600 font-display leading-tight">
                    200+
                  </div>
                  <div className="text-[10px] sm:text-xs font-bold text-slate-600">
                    Mentors
                  </div>
                </div>
              </div>

              {/* Stat 3: Pan India Cities / Hospitals */}
              <div className="flex items-center gap-3 px-2 sm:px-3">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-base sm:text-xl font-black text-emerald-600 font-display leading-tight">
                    50+ Hospitals
                  </div>
                  <div className="text-[10px] sm:text-xs font-bold text-slate-600">
                    Pan India
                  </div>
                </div>
              </div>

            </div>

            {/* Learn More Button */}
            <div className="pt-2">
              <Link
                href="/courses"
                className="inline-flex items-center gap-2 bg-[#1B62BF] hover:bg-[#154fa0] text-white text-xs sm:text-sm font-black py-3 px-6 rounded-xl shadow-md transition-all group"
              >
                <span>Learn More</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
