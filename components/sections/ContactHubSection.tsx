"use client";

import React from "react";
import Link from "next/link";
import { UniversalAdmissionForm } from "@/components/forms/UniversalAdmissionForm";
import { siteSettings } from "@/lib/data";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  MessageSquare, 
  Headphones, 
  ArrowRight, 
  ExternalLink
} from "lucide-react";

export function ContactHubSection() {
  const whatsappUrl = `https://wa.me/${siteSettings.whatsappNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
    "Hello Indian Medical Course Admissions Desk, I would like to inquire about Fellowship eligibility, clinical attachment dates, and 0% EMI enrollment."
  )}`;

  return (
    <section className="py-8 lg:py-12 max-w-7xl mx-auto px-4 sm:px-6">
      
      {/* Top Header Badge */}
      <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-800 text-xs font-black uppercase px-4 py-1.5 rounded-full border border-blue-200">
          <Headphones className="w-3.5 h-3.5 text-blue-600" />
          <span>Doctor Admissions & Academic Support Desk</span>
        </div>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight font-display">
          Connect with Our <span className="text-[#0B4F9C]">Clinical Admissions Board</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Get personalized guidance on clinical fellowship eligibility, hospital attachment schedules, 0% EMI financing, and international accreditation.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ========================================================================= */}
        {/* LEFT COLUMN: UNIVERSAL ADMISSION & INQUIRY FORM                           */}
        {/* ========================================================================= */}
        <div className="lg:col-span-6 sticky top-6">
          <div className="relative rounded-3xl p-1 bg-linear-to-b from-[#0B4F9C]/30 via-blue-500/10 to-transparent shadow-xl">
            <UniversalAdmissionForm
              title="Direct Admissions & Callback Form"
              subtitle="Submit your clinical inquiry for priority counselor evaluation."
              source="Contact Page Main Form"
            />
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: DIRECT REACHOUT CHANNELS & CAMPUS DETAILS                   */}
        {/* ========================================================================= */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* 1. Live Interactive Channels Grid - Two Columns in a Single Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Live WhatsApp Direct Line Card */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-5 rounded-3xl bg-linear-to-br from-emerald-500 to-[#1EBE5D] text-white shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group cursor-pointer relative overflow-hidden"
            >
              <div className="flex items-center justify-between relative z-10">
                <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-xs">
                  <MessageSquare className="w-5 h-5 fill-white" />
                </div>
                <span className="flex items-center gap-1 text-[10px] font-black uppercase bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full text-white border border-white/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-200 animate-ping" />
                  <span>Online Now</span>
                </span>
              </div>

              <div className="space-y-1 mt-4 relative z-10">
                <div className="text-[10px] font-bold text-emerald-100 uppercase tracking-wider">Fastest Response (&lt;5 Mins)</div>
                <h3 className="text-base font-black tracking-tight font-display">
                  Official WhatsApp Desk
                </h3>
                <p className="text-xs text-emerald-50 leading-relaxed font-mono">
                  {siteSettings.whatsappNumber}
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-white/20 flex items-center justify-between text-xs font-black relative z-10">
                <span>Start Direct Chat</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>

              <MessageSquare className="w-32 h-32 text-white/5 absolute -right-6 -bottom-6 pointer-events-none" />
            </a>

            {/* Direct Priority Phone Helpline Card */}
            <a
              href={`tel:${siteSettings.hotlinePhone}`}
              className="p-5 rounded-3xl bg-linear-to-br from-[#0B4F9C] to-[#083E7D] text-white shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group cursor-pointer relative overflow-hidden"
            >
              <div className="flex items-center justify-between relative z-10">
                <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-xs">
                  <Phone className="w-5 h-5 text-amber-300" />
                </div>
                <span className="text-[10px] font-black uppercase bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full text-blue-100 border border-white/30">
                  Toll-Free Helpline
                </span>
              </div>

              <div className="space-y-1 mt-4 relative z-10">
                <div className="text-[10px] font-bold text-blue-200 uppercase tracking-wider">Admissions Hotline</div>
                <h3 className="text-base font-black tracking-tight font-display">
                  Priority Helpline
                </h3>
                <p className="text-xs text-blue-100 font-mono font-bold">
                  {siteSettings.hotlinePhone}
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-white/20 flex items-center justify-between text-xs font-black relative z-10">
                <span>Call Admissions</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>

              <Phone className="w-32 h-32 text-white/5 absolute -right-6 -bottom-6 pointer-events-none" />
            </a>
          </div>

          {/* Registered Campus & Academic Center Card */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 shadow-xs">
                <MapPin className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="text-[11px] font-extrabold text-blue-700 uppercase tracking-wider">
                  Campus & Administrative Headquarters
                </div>
                <h4 className="text-base font-black text-slate-900 font-display">
                  {siteSettings.brandName} Academic Center
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {siteSettings.registeredAddress}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-slate-600 font-medium">
                <Mail className="w-4 h-4 text-blue-600" />
                <span>{siteSettings.supportEmail}</span>
              </div>
              <a
                href="https://maps.google.com/?q=Narayni+Polly+clinic+dhimshri+shamshabad+Agra+UP"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-bold text-blue-700 hover:underline"
              >
                <span>Get Directions</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

        </div>

      </div>

    </section>
  );
}
