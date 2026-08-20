"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import confetti from "canvas-confetti";
import { siteSettings, courses, facultyMembers } from "@/lib/data";
import { 
  CheckCircle2, 
  Sparkles, 
  MessageSquare, 
  Phone, 
  ArrowRight, 
  ShieldCheck, 
  Clock, 
  Award, 
  Building2, 
  Stethoscope, 
  GraduationCap, 
  FileText, 
  HeartHandshake,
  TrendingUp,
  Download,
  Share2,
  ChevronRight,
  Lock,
  Hash
} from "lucide-react";

import { trackGoogleAdsConversion } from "@/components/shared/GoogleAdsTracker";
import { 
  getOrCreateVisitorAttribution, 
  canTriggerGoogleAdsConversion, 
  markGoogleAdsConverted 
} from "@/lib/attribution";

function ThankYouContent() {
  const searchParams = useSearchParams();
  const refId = searchParams.get("ref") || searchParams.get("lead") || "IMC-2026";
  
  const [doctorName, setDoctorName] = useState("Doctor");
  const [courseInquired, setCourseInquired] = useState("Post-Graduate Clinical Fellowship");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // 1. Recover doctor & course context anonymously from secure session storage (NO URL PII)
    if (typeof window !== "undefined") {
      try {
        const raw = sessionStorage.getItem("imc_last_lead_ref");
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed.doctorName) setDoctorName(parsed.doctorName);
          if (parsed.courseName) setCourseInquired(parsed.courseName);
        }
      } catch (e) {}
    }

    // 2. Strict Anti-Duplicate Google Ads Conversion Trigger
    const attribution = getOrCreateVisitorAttribution();
    if (canTriggerGoogleAdsConversion(attribution)) {
      trackGoogleAdsConversion();
      markGoogleAdsConverted(attribution);
      console.log("🎯 Google Ads Conversion (+1) successfully executed with anti-duplicate validation.");
    } else {
      if (!attribution.isGoogleAds) {
        console.log("ℹ️ Organic / Direct / Social visitor: Google Ads conversion skipped (+0).");
      } else {
        console.log("ℹ️ Google Ads Conversion already recorded for this Click ID / session (duplicate prevented).");
      }
    }

    // 3. Fire celebratory confetti
    const duration = 2.5 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: ["#0B4F9C", "#0D9468", "#F59E0B", "#2563EB"],
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: ["#0B4F9C", "#0D9468", "#F59E0B", "#2563EB"],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, [refId]);

  const whatsappMessage = `Hello IMC Admissions Team, I just submitted my application for ${courseInquired} (Ref: ${refId}). Please share my batch schedule and clinical rotation details.`;
  const whatsappUrl = `https://wa.me/${siteSettings.whatsappNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(whatsappMessage)}`;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Indian Medical Course - Clinical Fellowships",
        text: `I just registered for ${courseInquired} at Indian Medical Course. Explore CPD-accredited medical fellowships!`,
        url: window.location.origin,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.origin);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        
        {/* ========================================================================= */}
        {/* HERO CELEBRATION CARD                                                     */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-3xl border border-emerald-100 shadow-xl overflow-hidden text-center p-6 sm:p-10 relative mb-8">
          
          <div className="absolute top-0 left-0 right-0 h-2.5 bg-gradient-to-r from-[#0B4F9C] via-[#0D9468] to-amber-500" />
          
          {/* Animated Success Badge */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-emerald-100 shadow-inner">
            <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12 animate-bounce" />
          </div>

          <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-900 text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
            <span>Application Confirmed</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 font-display tracking-tight max-w-2xl mx-auto">
            Thank You, <span className="text-[#0B4F9C]">{doctorName}</span>!
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto mt-3 leading-relaxed">
            Your admission consultation for <strong className="text-slate-900 font-bold">{courseInquired}</strong> has been prioritized. Our Senior Academic Counselor is reviewing your profile.
          </p>

          {/* Secure Application Ref ID Badge (NO PII) */}
          <div className="mt-4 inline-flex items-center gap-2 bg-slate-100 border border-slate-200 px-4 py-2 rounded-2xl text-xs font-mono text-slate-700">
            <Hash className="w-4 h-4 text-blue-600 shrink-0" />
            <span>Secure Ref ID: <strong>{refId}</strong></span>
            <Lock className="w-3.5 h-3.5 text-emerald-600 ml-1" />
          </div>

          {/* Instant Action CTA Dock */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-md mx-auto">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-sm px-6 py-3.5 rounded-2xl shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 fill-white" />
              <span>Connect on WhatsApp</span>
            </a>

            <a
              href={`tel:${siteSettings.hotlinePhone.replace(/\s+/g, "")}`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#0B4F9C] hover:bg-[#083E7D] text-white font-bold text-sm px-6 py-3.5 rounded-2xl shadow-lg shadow-blue-900/20 transition-all cursor-pointer"
            >
              <Phone className="w-4 h-4" />
              <span>Call Admissions Desk</span>
            </a>
          </div>

          {/* Average response time badge */}
          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500">
            <Clock className="w-4 h-4 text-emerald-600" />
            <span>Expected Counselor Callback: <strong>Within 15–30 Minutes</strong></span>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* WHAT HAPPENS NEXT: 3-STEP ADMISSIONS ROADMAP                              */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs mb-8">
          <h2 className="text-lg sm:text-xl font-black text-slate-900 font-display mb-6 text-center sm:text-left">
            What Happens Next? Your 3-Step Onboarding Roadmap
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Step 1 */}
            <div className="p-5 rounded-2xl bg-blue-50/60 border border-blue-100 flex flex-col justify-between">
              <div>
                <div className="w-8 h-8 rounded-xl bg-[#0B4F9C] text-white font-black text-sm flex items-center justify-center mb-3 shadow-xs">
                  1
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">
                  Profile & Eligibility Verification
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Our academic registrar evaluates your medical qualification (MBBS/MD/MS/DNB) against university partner criteria.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-blue-200/60 flex items-center gap-1.5 text-[11px] font-bold text-blue-800">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Eligibility Confirmed</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-100 flex flex-col justify-between">
              <div>
                <div className="w-8 h-8 rounded-xl bg-[#0D9468] text-white font-black text-sm flex items-center justify-center mb-3 shadow-xs">
                  2
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">
                  Curriculum & Hospital Rotation Match
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  We assign your preferred hospital partner for bedside training and provide complete module breakdowns.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-emerald-200/60 flex items-center gap-1.5 text-[11px] font-bold text-emerald-800">
                <Building2 className="w-3.5 h-3.5" />
                <span>Hospital Seat Allocated</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-100 flex flex-col justify-between">
              <div>
                <div className="w-8 h-8 rounded-xl bg-amber-500 text-white font-black text-sm flex items-center justify-center mb-3 shadow-xs">
                  3
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">
                  Batch Enrollment & 0% EMI Setup
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Secure your seat with simple installment plans, access LMS study materials, and receive your welcome kit.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-amber-200/60 flex items-center gap-1.5 text-[11px] font-bold text-amber-800">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>LMS Access Granted</span>
              </div>
            </div>

          </div>
        </div>

        {/* ========================================================================= */}
        {/* CURATED POPULAR FELLOWSHIPS FOR EXPLORATION                                */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 font-display">
                Explore Other In-Demand Fellowships for 2026
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Doctors also enrolled in these CPD-accredited clinical programs.
              </p>
            </div>

            <Link
              href="/courses"
              className="inline-flex items-center gap-1 text-xs font-bold text-[#0B4F9C] hover:underline shrink-0"
            >
              <span>View All 150+ Courses</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.slice(0, 3).map((course) => (
              <Link
                key={course.id}
                href={`/courses/${course.slug}`}
                className="group p-4 rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all bg-white flex flex-col justify-between"
              >
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-blue-700 mb-1">
                    {course.categoryName}
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors line-clamp-1">
                    {course.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {course.tagline}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700">{course.duration}</span>
                  <span className="text-blue-700 font-bold group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-0.5">
                    Details <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SOCIAL SHARE & BACK HOME                                                  */}
        {/* ========================================================================= */}
        <div className="text-center space-y-4">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>{copied ? "Link Copied!" : "Share with Doctor Colleagues"}</span>
            </button>

            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all"
            >
              <span>Return to Homepage</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <p className="text-[11px] text-slate-400">
            © 2026 Indian Medical Course. All rights reserved. Confidential Admissions Portal.
          </p>
        </div>

      </div>
    </div>
  );
}

export default function ThankYouPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">Loading...</div>}>
      <ThankYouContent />
    </Suspense>
  );
}
