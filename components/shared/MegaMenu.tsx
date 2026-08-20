"use client";

import React from "react";
import Link from "next/link";
import { categories } from "@/lib/data";
import { 
  HeartPulse, 
  Activity, 
  Flame, 
  Baby, 
  Sparkles, 
  Stethoscope, 
  Eye, 
  Users, 
  ArrowRight,
  GraduationCap,
  Award,
  BookOpen,
  CheckCircle2,
  FileBadge
} from "lucide-react";

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const iconMap: Record<string, React.ReactNode> = {
  HeartPulse: <HeartPulse className="w-4 h-4 text-blue-600" />,
  Activity: <Activity className="w-4 h-4 text-red-500" />,
  Flame: <Flame className="w-4 h-4 text-amber-500" />,
  Baby: <Baby className="w-4 h-4 text-emerald-600" />,
  Sparkles: <Sparkles className="w-4 h-4 text-purple-600" />,
  Stethoscope: <Stethoscope className="w-4 h-4 text-teal-600" />,
  Eye: <Eye className="w-4 h-4 text-indigo-600" />,
  Users: <Users className="w-4 h-4 text-sky-600" />,
};

export function MegaMenu({ isOpen, onClose }: MegaMenuProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="absolute top-full left-0 w-full bg-white/98 backdrop-blur-xl border-t border-slate-200/90 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150"
      onMouseEnter={() => {}}
      onMouseLeave={onClose}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Column 1: Course Types Directory (PG Diploma, Fellowship, Certificate) (4 cols) */}
          <div className="lg:col-span-4 bg-gradient-to-br from-blue-50/90 via-slate-50 to-emerald-50/50 p-5 rounded-3xl border border-blue-100/80 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-black uppercase tracking-wider bg-blue-600 text-white px-2.5 py-0.5 rounded-full">
                  Browse By Format
                </span>
                <span className="text-[11px] font-bold text-slate-500">
                  Accredited 2026
                </span>
              </div>

              <h4 className="text-base font-black text-slate-900 mb-3 font-display">
                All Medical Programs
              </h4>

              {/* 3 Core Program Types */}
              <div className="space-y-2">
                
                {/* 1. Fellowship */}
                <Link
                  href="/courses?type=FELLOWSHIP"
                  onClick={onClose}
                  className="group flex items-start gap-3 p-2.5 rounded-2xl bg-white hover:bg-[#0B4F9C] border border-blue-100 hover:border-transparent transition-all shadow-xs"
                >
                  <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 group-hover:bg-white/20 group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-900 group-hover:text-white transition-colors">
                        Fellowship Courses
                      </span>
                      <span className="text-[9px] font-extrabold bg-blue-50 group-hover:bg-white/20 text-blue-700 group-hover:text-white px-1.5 py-0.2 rounded">
                        28+ Courses
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 group-hover:text-blue-100 transition-colors line-clamp-1">
                      Hospital bedside clinical attachments & OT observer-ships.
                    </p>
                  </div>
                </Link>

                {/* 2. PG Diploma */}
                <Link
                  href="/courses?type=PG_DIPLOMA"
                  onClick={onClose}
                  className="group flex items-start gap-3 p-2.5 rounded-2xl bg-white hover:bg-emerald-700 border border-emerald-100 hover:border-transparent transition-all shadow-xs"
                >
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 group-hover:bg-white/20 group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
                    <Award className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-900 group-hover:text-white transition-colors">
                        PG Diploma Courses
                      </span>
                      <span className="text-[9px] font-extrabold bg-emerald-50 group-hover:bg-white/20 text-emerald-700 group-hover:text-white px-1.5 py-0.2 rounded">
                        10+ Courses
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 group-hover:text-emerald-100 transition-colors line-clamp-1">
                      1-Year hybrid post-medical diploma qualifications.
                    </p>
                  </div>
                </Link>

                {/* 3. Certificate */}
                <Link
                  href="/courses?type=ADVANCED_CERTIFICATE"
                  onClick={onClose}
                  className="group flex items-start gap-3 p-2.5 rounded-2xl bg-white hover:bg-purple-700 border border-purple-100 hover:border-transparent transition-all shadow-xs"
                >
                  <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 group-hover:bg-white/20 group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
                    <FileBadge className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-900 group-hover:text-white transition-colors">
                        Certificate Courses
                      </span>
                      <span className="text-[9px] font-extrabold bg-purple-50 group-hover:bg-white/20 text-purple-700 group-hover:text-white px-1.5 py-0.2 rounded">
                        8+ Courses
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 group-hover:text-purple-100 transition-colors line-clamp-1">
                      3-Month short procedural & diagnostic masterclasses.
                    </p>
                  </div>
                </Link>

              </div>
            </div>

            <Link
              href="/courses"
              onClick={onClose}
              className="inline-flex items-center justify-between text-xs font-bold text-[#0B4F9C] bg-white hover:bg-blue-50 border border-blue-200 px-3.5 py-2 rounded-xl transition-all shadow-xs group"
            >
              <span>View All 150+ Course Catalog</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Column 2: Specialty Categories Grid (5 cols) */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {categories.slice(0, 6).map((cat) => (
              <Link
                key={cat.id}
                href={`/courses?category=${cat.slug}`}
                onClick={onClose}
                className="group flex items-start gap-3 p-3 rounded-2xl hover:bg-blue-50/60 border border-slate-100 hover:border-blue-200 transition-all bg-white"
              >
                <div className="p-2 rounded-xl bg-slate-50 group-hover:bg-blue-600 group-hover:text-white transition-all shrink-0">
                  {cat.iconName && iconMap[cat.iconName] ? iconMap[cat.iconName] : <Activity className="w-4 h-4 text-blue-600 group-hover:text-white" />}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-extrabold text-slate-900 group-hover:text-blue-700 transition-colors truncate">
                      {cat.name}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                    {cat.subtitle}
                  </p>
                  <span className="text-[10px] text-emerald-700 font-bold mt-1 inline-block">
                    {cat.courseCount} Programs available →
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* Column 3: Quick Counselling Banner (3 cols) */}
          <div className="lg:col-span-3 bg-slate-950 text-white p-6 rounded-3xl flex flex-col justify-between relative overflow-hidden shadow-lg border border-slate-800">
            <div className="relative z-10 space-y-2">
              <span className="text-amber-400 text-[10px] font-black uppercase tracking-wider block">
                Academic Advisory
              </span>
              <h4 className="text-sm font-black text-white leading-snug font-display">
                Talk to a Senior Medical Admissions Counsellor
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Get a customized curriculum roadmap, check clinical batch dates, and evaluate 0% EMI financing.
              </p>
            </div>

            <div className="relative z-10 pt-4">
              <Link
                href="/book-counselling"
                onClick={onClose}
                className="block w-full text-center bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-black py-3 px-4 rounded-xl transition-all shadow-md"
              >
                Book Free 1-on-1 Call
              </Link>
            </div>

            {/* Background Aesthetic Blur */}
            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />
          </div>

        </div>
      </div>
    </div>
  );
}
