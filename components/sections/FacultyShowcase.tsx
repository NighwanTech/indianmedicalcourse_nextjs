"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { facultyMembers } from "@/lib/data";
import { 
  Building2, 
  Award, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles,
  Stethoscope
} from "lucide-react";

interface FacultyShowcaseProps {
  limit?: number;
  isFullPage?: boolean;
}

export function FacultyShowcase({ limit = 3, isFullPage = false }: FacultyShowcaseProps) {
  const [facultyList, setFacultyList] = useState<any[]>(facultyMembers);
  const [isEnabled, setIsEnabled] = useState(true);

  const loadSettings = () => {
    if (typeof window !== "undefined") {
      const savedToggle = localStorage.getItem("imc_faculty_section_enabled");
      if (savedToggle !== null) {
        setIsEnabled(savedToggle === "true");
      }

      const saved = localStorage.getItem("imc_faculty_catalog");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setFacultyList(parsed);
          }
        } catch (e) {
          console.error(e);
        }
      }
    }
  };

  useEffect(() => {
    loadSettings();
    const handleStorage = () => loadSettings();
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  if (!isEnabled && !isFullPage) {
    return null;
  }

  const displayedFaculty = isFullPage ? facultyList : facultyList.slice(0, limit);

  return (
    <section className={`bg-white border-b border-slate-100 ${isFullPage ? "py-10" : "py-10 sm:py-12"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        <div className={`grid grid-cols-1 ${isFullPage ? "gap-8" : "lg:grid-cols-12 gap-6 lg:gap-8 items-center"}`}>
          
          {/* Left Text Block */}
          {!isFullPage ? (
            <div className="lg:col-span-4 space-y-3.5 text-center lg:text-left">
              <span className="inline-flex items-center gap-1.5 text-emerald-700 bg-emerald-50 border border-emerald-200/80 font-extrabold text-[11px] px-3 py-1 rounded-full uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Faculty & Specialist Mentors</span>
              </span>

              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-display leading-tight">
                OUR TOP <br className="hidden sm:inline" />
                <span className="text-[#0B4F9C]">TRAINERS</span> & EXPERTS
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Learn directly from senior clinical directors, interventional cardiologists, and ICU consultants holding DM, MCh, FACC, EDIC, and MRCEM qualifications.
              </p>

              {/* Prominent High-Converting View All Button */}
              <div className="pt-2">
                <Link
                  href="/faculty"
                  className="inline-flex items-center justify-center gap-2.5 text-xs font-black text-white bg-gradient-to-r from-[#0B4F9C] to-[#083E7D] hover:from-[#083E7D] hover:to-[#052852] px-6 py-3 rounded-2xl transition-all shadow-md shadow-blue-900/20 hover:shadow-xl hover:scale-105 active:scale-95 border border-blue-400/30 group cursor-pointer"
                >
                  <span>Explore All {facultyList.length > 3 ? `${facultyList.length}+ Mentors` : "Mentors"}</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="text-center max-w-3xl mx-auto mb-4">
              <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Full Medical Directorate
              </span>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 font-display mt-2">
                Distinguished Clinical Faculty & Mentors
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Meet our panel of active professors and senior consultants guiding your fellowship training.
              </p>
            </div>
          )}

          {/* Right Faculty Cards Grid */}
          <div className={`${isFullPage ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5" : "lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5"}`}>
            {displayedFaculty.map((trainer) => (
              <div
                key={trainer.id}
                className="bg-white rounded-3xl p-3.5 border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Doctor Photo */}
                  <div className="relative h-48 sm:h-52 rounded-2xl overflow-hidden mb-3 bg-gradient-to-b from-slate-100 via-slate-100 to-slate-200">
                    <img
                      src={trainer.photoUrl}
                      alt={trainer.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2.5 right-2.5 bg-[#0B4F9C] text-white text-[9px] font-black px-2 py-0.5 rounded-md shadow-xs">
                      {trainer.experienceYears}+ Yrs Exp
                    </div>
                  </div>

                  <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-blue-700 transition-colors line-clamp-1">
                    {trainer.name}
                  </h3>
                  <div className="text-[11px] font-bold text-emerald-700 mt-0.5 line-clamp-1">
                    {trainer.designation}
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium mt-1 line-clamp-1">
                    {trainer.qualifications}
                  </div>
                </div>

                <div className="pt-2.5 mt-2.5 border-t border-slate-100 text-[10px] text-slate-500 flex items-center gap-1.5 font-semibold">
                  <Building2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span className="truncate">{trainer.hospitalAffiliation}</span>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
