import React from "react";
import { UniversalAdmissionForm } from "@/components/forms/UniversalAdmissionForm";
import { FellowshipGuideHub } from "@/components/sections/FellowshipGuideHub";
import { HospitalPartnersMarquee } from "@/components/sections/HospitalPartnersMarquee";
import { ShieldCheck, CheckCircle2, Clock, Sparkles, Stethoscope, GraduationCap, Building2, PhoneCall } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book Free 1-on-1 Medical Academic Counselling | Indian Medical Course",
  description: "Schedule a personalized 1-on-1 consultation with our senior clinical advisors. Discuss course eligibility, hospital attachment schedules, and 0% EMI financing.",
};

export default function BookCounsellingPage() {
  return (
    <div className="bg-slate-50 pt-8 pb-16">
      
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-6">
        <div className="text-xs font-semibold text-slate-500">
          Home &gt; <span className="text-blue-700 font-bold">Book Free 1-on-1 Clinical Counselling</span>
        </div>
      </div>

      {/* Top Consultation Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Narrative (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 text-xs font-bold px-3.5 py-1 rounded-full uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              100% Free 1-on-1 Doctor Consultation
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight font-display leading-tight">
              Book Your 1-on-1 Academic <br />
              <span className="text-[#0B4F9C]">Clinical Counselling</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Speak directly with our Senior Medical Admissions Counsellor. We help you choose the right clinical specialty, evaluate council registration eligibility without NEET PG, and schedule bedside rotations around your duty hours.
            </p>

            {/* Feature Checklist */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 text-xs sm:text-sm font-bold text-slate-800 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Eligibility evaluation for MBBS, MD, MS, DNB, BDS, and AYUSH graduates</span>
              </div>
              <div className="flex items-center gap-3 text-xs sm:text-sm font-bold text-slate-800 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs">
                <Building2 className="w-5 h-5 text-[#0B4F9C] shrink-0" />
                <span>Hospital clinical rotation schedule at 50+ network centers (Apollo, Fortis, Max, Medanta)</span>
              </div>
              <div className="flex items-center gap-3 text-xs sm:text-sm font-bold text-slate-800 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs">
                <GraduationCap className="w-5 h-5 text-amber-600 shrink-0" />
                <span>0% Interest EMI financing & early-bird 40% merit scholarship review</span>
              </div>
            </div>

            {/* Timing Banner */}
            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-between gap-3 text-xs text-blue-900 font-semibold">
              <div className="flex items-center gap-2.5">
                <Clock className="w-5 h-5 text-blue-700 shrink-0" />
                <span>Admissions advisors available daily: 9:00 AM – 8:00 PM IST</span>
              </div>
              <span className="bg-blue-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                Live Today
              </span>
            </div>
          </div>

          {/* Right High-Conversion Universal Admission Form (5 cols) */}
          <div className="lg:col-span-5 w-full">
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-xl">
              <div className="mb-4">
                <span className="text-[10px] font-black uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md">
                  Priority Doctor Slot
                </span>
                <h3 className="text-lg font-black text-slate-900 font-display mt-1">
                  Request Immediate Callback
                </h3>
                <p className="text-xs text-slate-500">
                  Fill in your details below to connect with a senior medical counsellor.
                </p>
              </div>

              <UniversalAdmissionForm
                buttonText="Confirm Free Counselling Call →"
                source="Book Counselling Page"
              />
            </div>
          </div>

        </div>
      </section>

      {/* Hospital Partners Marquee */}
      <div className="mt-16">
        <HospitalPartnersMarquee />
      </div>

      {/* Same Rich Interactive Fellowship Guide & FAQ Hub as Home Page */}
      <div className="mt-10">
        <FellowshipGuideHub />
      </div>

    </div>
  );
}
