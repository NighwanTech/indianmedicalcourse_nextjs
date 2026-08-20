import React from "react";
import Link from "next/link";
import { siteSettings } from "@/lib/data";
import { 
  Sparkles, 
  Phone, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  Clock 
} from "lucide-react";

export function FinalCtaBanner() {
  return (
    <section className="py-16 bg-gradient-to-br from-[#083E7D] via-[#0B4F9C] to-[#0D9468] text-white relative overflow-hidden">
      {/* Background Subtle Glows */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10 text-center space-y-6">
        
        {/* Urgent Pill */}
        <div className="inline-flex items-center gap-2 bg-amber-400 text-slate-950 text-[11px] font-black px-3.5 py-1 rounded-full uppercase tracking-wider shadow-md">
          <Sparkles className="w-3.5 h-3.5" />
          Limited Clinical Batch Seats for 2026
        </div>

        {/* Big Headline */}
        <h2 className="text-2xl sm:text-3xl lg:text-5xl font-black text-white tracking-tight font-display max-w-3xl mx-auto leading-tight">
          Ready to Elevate Your Medical Career with a Clinical Fellowship?
        </h2>

        {/* Subhead */}
        <p className="text-xs sm:text-sm text-blue-100 max-w-2xl mx-auto leading-relaxed">
          Speak with our Senior Medical Admissions Advisor today. Get your eligibility verified, receive customized course roadmaps, and explore 0% interest EMI options.
        </p>

        {/* CTA Button Duo */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
          <Link
            href="/book-counselling"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-100 text-[#0B4F9C] text-sm font-extrabold py-3.5 px-8 rounded-2xl shadow-xl shadow-blue-950/20 transition-all hover:scale-105 active:scale-95"
          >
            <span>Book Free 1-on-1 Counselling</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <a
            href={`tel:${siteSettings.hotlinePhone.replace(/\s+/g, "")}`}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-700/80 hover:bg-emerald-600 border border-emerald-400/40 text-white text-sm font-bold py-3.5 px-6 rounded-2xl transition-all"
          >
            <Phone className="w-4 h-4 text-emerald-300" />
            <span>Call Hotline: {siteSettings.hotlinePhone}</span>
          </a>
        </div>

        {/* Trust Badges Row */}
        <div className="pt-6 border-t border-white/10 flex items-center justify-center gap-6 text-[11px] text-white/80 flex-wrap">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
            100% Confidential
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
            CPD Standards Accredited
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-emerald-300" />
            Callback within 30 mins
          </span>
        </div>

      </div>
    </section>
  );
}
