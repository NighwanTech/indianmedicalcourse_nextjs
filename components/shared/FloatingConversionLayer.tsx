"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { siteSettings, courses } from "@/lib/data";
import { countries } from "@/lib/countries";
import confetti from "canvas-confetti";
import { submitLeadAction } from "@/features/leads/leadActions";
import { trackWhatsAppClick, trackPhoneClick, trackExitPopupSubmit, fireLeadConversionSuccess } from "@/lib/analytics";
import { 
  MessageCircle, 
  Phone, 
  X, 
  Sparkles, 
  GraduationCap, 
  FileText, 
  ArrowRight,
  Gift,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Award,
  BookOpen,
  Lock,
  Link2,
  Share2
} from "lucide-react";

export function FloatingConversionLayer() {
  const [showExitModal, setShowExitModal] = useState(false);
  const [hasShownExitModal, setHasShownExitModal] = useState(false);
  const [showMobileDrawer, setShowMobileDrawer] = useState(false);

  // Form State
  const [fullName, setFullName] = useState("");
  const [specialtyStatus, setSpecialtyStatus] = useState("MBBS Doctor");
  const [targetCountry, setTargetCountry] = useState("India");
  const [mobileNumber, setMobileNumber] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [courseCategory, setCourseCategory] = useState("Fellowships (Post Graduate)");
  const [dynamicCourses, setDynamicCourses] = useState<any[]>(courses);
  const [city, setCity] = useState("");
  const [addressCountry, setAddressCountry] = useState("India");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Dynamically load real-time courses catalog from Admin CMS
  useEffect(() => {
    if (typeof window !== "undefined") {
      const loadCourses = () => {
        const saved = localStorage.getItem("imc_courses_catalog");
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setDynamicCourses(parsed);
            }
          } catch (e) {
            console.error(e);
          }
        }
      };
      loadCourses();
      window.addEventListener("storage", loadCourses);
      return () => window.removeEventListener("storage", loadCourses);
    }
  }, []);

  // Exit-Intent Detector + 25-Second Timed Trigger
  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 12 && !hasShownExitModal) {
        setShowExitModal(true);
        setHasShownExitModal(true);
      }
    };

    // Auto-prompt after 25s for engaged readers if not shown yet
    const timer = setTimeout(() => {
      if (!hasShownExitModal) {
        setShowExitModal(true);
        setHasShownExitModal(true);
      }
    }, 25000);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowExitModal(false);
    };

    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("keydown", handleKeyDown);
      clearTimeout(timer);
    };
  }, [hasShownExitModal]);

  const [formError, setFormError] = useState("");
  const [submittedName, setSubmittedName] = useState("");
  const [submittedCourse, setSubmittedCourse] = useState("");

  const resetFloatingForm = () => {
    setFullName("");
    setSpecialtyStatus("MBBS Doctor");
    setTargetCountry("India");
    setMobileNumber("");
    setEmailAddress("");
    setCity("");
    setAddressCountry("India");
    setFormError("");
    setIsSubmitted(false);
    setIsSubmitting(false);
  };

  // Auto-redirect modal back to clean fresh form after 20 seconds
  useEffect(() => {
    if (isSubmitted) {
      const timer = setTimeout(() => {
        resetFloatingForm();
      }, 20000);
      return () => clearTimeout(timer);
    }
  }, [isSubmitted]);

  const openExitModal = () => {
    if (isSubmitted) {
      resetFloatingForm();
    }
    setShowExitModal(true);
  };

  const openMobileDrawer = () => {
    if (isSubmitted) {
      resetFloatingForm();
    }
    setShowMobileDrawer(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setFormError("Please enter Doctor Full Name.");
      return;
    }
    const cleanDigits = mobileNumber.replace(/\D/g, "");
    if (!mobileNumber.trim() || cleanDigits.length < 8) {
      setFormError("Please enter a valid mobile number.");
      return;
    }

    setFormError("");
    setIsSubmitting(true);

    const cleanName = fullName.trim().replace(/^dr\.?\s*/i, "").trim();
    const docName = cleanName ? `Dr. ${cleanName.charAt(0).toUpperCase() + cleanName.slice(1)}` : "Doctor";
    const crsName = courseCategory || "Clinical Fellowship";

    setSubmittedName(docName);
    setSubmittedCourse(crsName);

    try {
      // 1. Push to unified lead action (handles single-source persistence & deduplication)
      const formPayload = new FormData();
      formPayload.set("name", docName);
      formPayload.set("mobile", mobileNumber);
      formPayload.set("email", emailAddress || `${mobileNumber}@imc-applicant.in`);
      formPayload.set("qualification", specialtyStatus);
      formPayload.set("interestedCourseName", crsName);
      formPayload.set("country", targetCountry);
      formPayload.set("city", city || "");
      formPayload.set("leadSource", "QUICK_COUNSELLING_DRAWER");

      await submitLeadAction(formPayload);

      // Track in Google Ads Conversion + GA4 generate_lead + GTM DataLayer
      fireLeadConversionSuccess({
        courseName: crsName,
        source: "QUICK_COUNSELLING_DRAWER",
        doctorName: docName,
        specialty: specialtyStatus,
        mobile: mobileNumber,
        email: emailAddress,
      });

      trackExitPopupSubmit({
        courseName: crsName,
      });

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#0B4F9C", "#0D9468", "#F59E0B"],
      });

      // Clear input fields so form is fresh
      setFullName("");
      setMobileNumber("");
      setEmailAddress("");
      setCity("");
      setFormError("");

      setIsSubmitted(true);
    } catch (err) {
      console.error(err);
      setFullName("");
      setMobileNumber("");
      setEmailAddress("");
      setCity("");
      setFormError("");
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* 1. Side Quick Links Dock (Fixed to Right Edge) */}
      <div className="fixed right-0 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-1.5 pointer-events-auto select-none">
        
        {/* Quick Link 1: Brochure / Apply Modal Trigger (Indigo) */}
        <button
          onClick={openExitModal}
          className="group flex items-center bg-[#5B5BD6] hover:bg-[#4A4AC8] text-white shadow-xl shadow-indigo-900/20 py-2.5 pl-3 pr-2.5 rounded-l-2xl transition-all duration-300 translate-x-[calc(100%-46px)] hover:translate-x-0 cursor-pointer"
          aria-label="Download Brochure & Apply"
        >
          <div className="w-6 h-6 flex items-center justify-center shrink-0">
            <Link2 className="w-5 h-5 text-white" />
          </div>
          <span className="text-xs font-bold whitespace-nowrap pl-2 pr-1">
            Download Brochure
          </span>
        </button>

        {/* Quick Link 2: WhatsApp (Green) */}
        <a
          href={`https://wa.me/${siteSettings.whatsappNumber.replace(/[^0-9]/g, "")}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackWhatsAppClick({ whatsappNumber: siteSettings.whatsappNumber, location: "Floating Dock" })}
          className="group flex items-center bg-[#25D366] hover:bg-[#1EBE5D] text-white shadow-xl shadow-emerald-900/20 py-2.5 pl-3 pr-2.5 rounded-l-2xl transition-all duration-300 translate-x-[calc(100%-46px)] hover:translate-x-0 cursor-pointer"
          aria-label="Chat on WhatsApp"
        >
          <div className="w-6 h-6 flex items-center justify-center shrink-0">
            <MessageCircle className="w-5 h-5 fill-white text-[#25D366]" />
          </div>
          <span className="text-xs font-bold whitespace-nowrap pl-2 pr-1">
            WhatsApp Us
          </span>
        </a>

        {/* Quick Link 3: Call Hotline (Blue) */}
        <a
          href={`tel:${siteSettings.hotlinePhone.replace(/\s+/g, "")}`}
          onClick={() => trackPhoneClick({ phoneNumber: siteSettings.hotlinePhone, location: "Floating Dock" })}
          className="group flex items-center bg-[#0084FF] hover:bg-[#0073E6] text-white shadow-xl shadow-blue-900/20 py-2.5 pl-3 pr-2.5 rounded-l-2xl transition-all duration-300 translate-x-[calc(100%-46px)] hover:translate-x-0 cursor-pointer"
          aria-label="Call Hotline"
        >
          <div className="w-6 h-6 flex items-center justify-center shrink-0">
            <Phone className="w-5 h-5 fill-white text-[#0084FF]" />
          </div>
          <span className="text-xs font-bold whitespace-nowrap pl-2 pr-1">
            Call Admissions
          </span>
        </a>

        {/* Quick Link 4: Courses Catalog (Orange) */}
        <Link
          href="/courses"
          className="group flex items-center bg-[#FF7A00] hover:bg-[#E66E00] text-white shadow-xl shadow-orange-900/20 py-2.5 pl-3 pr-2.5 rounded-l-2xl transition-all duration-300 translate-x-[calc(100%-46px)] hover:translate-x-0 cursor-pointer"
          aria-label="Explore All 150+ Courses"
        >
          <div className="w-6 h-6 flex items-center justify-center shrink-0">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <span className="text-xs font-bold whitespace-nowrap pl-2 pr-1">
            150+ Courses
          </span>
        </Link>

      </div>



      {/* 3. Ultra-Premium Dual-Panel Modal Popup */}
      {showExitModal && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200 overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowExitModal(false);
          }}
        >
          <div className="relative w-full max-w-4xl bg-white rounded-3xl sm:rounded-[32px] shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col md:flex-row">
            
            {/* Close Button Top Right */}
            <button
              onClick={() => setShowExitModal(false)}
              className="absolute top-3.5 right-3.5 z-30 w-8 h-8 rounded-full bg-slate-900/10 hover:bg-slate-900/20 text-slate-700 hover:text-slate-900 flex items-center justify-center transition-all cursor-pointer shadow-xs"
              aria-label="Close popup modal"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Left Column: Visual Value & Trust (40% width on desktop) */}
            <div className="hidden md:flex md:w-5/12 bg-gradient-to-br from-[#083E7D] via-[#0B4F9C] to-[#0D9468] p-7 text-white flex-col justify-between relative overflow-hidden">
              
              {/* Background Glows */}
              <div className="absolute -top-12 -left-12 w-48 h-48 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="bg-white p-2 rounded-xl inline-block shadow-xs">
                    <img
                      src="/images/imc-logo.png"
                      alt="IMC Logo"
                      className="h-7 w-auto object-contain"
                    />
                  </div>
                  <div className="inline-flex items-center gap-1 bg-amber-400 text-slate-950 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow-xs">
                    <Gift className="w-3 h-3" />
                    2026 Benefit
                  </div>
                </div>

                <h3 className="text-2xl font-black text-white leading-tight font-display">
                  Download 2026 Curriculum & Check Scholarship
                </h3>

                <p className="text-xs text-blue-100/90 leading-relaxed">
                  Join 12,000+ doctors upskilling in high-yield medical specialties with CPD-accredited clinical rotations.
                </p>

                {/* 4 Feature Value Bullets */}
                <div className="space-y-2.5 pt-2">
                  <div className="flex items-start gap-2.5 text-xs text-white/95">
                    <div className="w-5 h-5 rounded-md bg-white/20 flex items-center justify-center shrink-0 mt-0.5">
                      <BookOpen className="w-3 h-3 text-emerald-300" />
                    </div>
                    <span>Full Curriculum & Hospital Rotation Schedules</span>
                  </div>

                  <div className="flex items-start gap-2.5 text-xs text-white/95">
                    <div className="w-5 h-5 rounded-md bg-white/20 flex items-center justify-center shrink-0 mt-0.5">
                      <Award className="w-3 h-3 text-amber-300" />
                    </div>
                    <span>Up to 40% Merit Scholarship & 0% EMI Eligibility</span>
                  </div>

                  <div className="flex items-start gap-2.5 text-xs text-white/95">
                    <div className="w-5 h-5 rounded-md bg-white/20 flex items-center justify-center shrink-0 mt-0.5">
                      <ShieldCheck className="w-3 h-3 text-blue-200" />
                    </div>
                    <span>No NEET PG Required for Admission</span>
                  </div>
                </div>
              </div>

              {/* Doctor Trust Footer on Left Panel */}
              <div className="relative z-10 pt-6 border-t border-white/15">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    <img
                      src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&auto=format&fit=crop&q=80"
                      alt="Doctor"
                      className="w-8 h-8 rounded-full border-2 border-white/40 object-cover"
                    />
                    <img
                      src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=100&auto=format&fit=crop&q=80"
                      alt="Doctor"
                      className="w-8 h-8 rounded-full border-2 border-white/40 object-cover"
                    />
                  </div>
                  <div className="text-[11px] leading-snug">
                    <span className="font-black text-amber-300">12,000+ Enrolled Doctors</span>
                    <p className="text-white/75 text-[10px]">50+ Hospital Partners across India</p>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: Lead Form (60% width on desktop) */}
            <div className="w-full md:w-7/12 p-6 sm:p-7 overflow-y-auto max-h-[85vh] md:max-h-[90vh]">
              
              {isSubmitted ? (
                <div className="py-10 text-center space-y-3 animate-in zoom-in-95">
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 font-display">
                    Thank You, {submittedName || "Doctor"}!
                  </h3>
                  <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                    Your application for <strong className="text-blue-700 font-bold">{submittedCourse || courseCategory}</strong> has been registered. An Academic Admissions Counsellor will connect with you within 30 minutes.
                  </p>
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 font-semibold max-w-xs mx-auto">
                    ⚡ Priority Callback Confirmed
                  </div>
                  {/* User feedback redirect notice */}
                  <p className="text-[11px] text-slate-500 mt-2 font-medium flex items-center justify-center gap-1.5 animate-pulse">
                    <span>You will be redirected to the form shortly...</span>
                  </p>

                  {/* Subtle manual fallback text link */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={resetFloatingForm}
                      className="text-[11px] text-slate-400 hover:text-[#0B4F9C] underline transition-colors cursor-pointer bg-transparent border-0 p-0 font-normal"
                    >
                      Click here if you want to submit another enquiry
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  {/* Form Header */}
                  <div className="mb-4 pr-8">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-900 text-[10px] font-black px-2.5 py-0.5 rounded-full">
                        <Sparkles className="w-3 h-3 text-emerald-600" />
                        Batch 2026 Admissions
                      </span>
                      <span className="text-[10px] font-bold text-slate-500">
                        CPD Accredited
                      </span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight font-display">
                      Fast-Track Your Medical Career
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Advance your clinical expertise with Fellowship, PG Diploma, and Certification programs.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-3">
                    
                    {/* Doctor Full Name */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Doctor Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Dr. Rajesh Kumar"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-hidden focus:border-[#0B4F9C] focus:ring-1 focus:ring-blue-500 transition-all"
                      />
                    </div>

                    {/* Specialty / Status */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Specialty / Status <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={specialtyStatus}
                        onChange={(e) => setSpecialtyStatus(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-hidden focus:border-[#0B4F9C] focus:ring-1 focus:ring-blue-500 transition-all cursor-pointer"
                      >
                        <option value="MBBS Doctor">MBBS Doctor</option>
                        <option value="Junior Resident">Junior Resident</option>
                        <option value="Postgraduate (MD/MS/DNB)">Postgraduate (MD/MS/DNB)</option>
                        <option value="Senior Resident / Specialist">Senior Resident / Specialist</option>
                        <option value="Consultant">Consultant</option>
                        <option value="Medical Student / Intern">Medical Student / Intern</option>
                        <option value="AYUSH / Dental (BDS/MDS)">AYUSH / Dental (BDS/MDS)</option>
                      </select>
                    </div>

                    {/* Country (Col 1) + Mobile Number (Col 2) in a Single Row */}
                    <div>
                      <div className="grid grid-cols-12 gap-2">
                        <div className="col-span-5">
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            Country <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={targetCountry}
                            onChange={(e) => setTargetCountry(e.target.value)}
                            required
                            className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-hidden focus:border-[#0B4F9C] focus:ring-1 focus:ring-blue-500 transition-all cursor-pointer truncate"
                          >
                            <option value="">Country</option>
                            {countries.map((c) => (
                              <option key={c.code + c.name} value={c.name}>
                                {c.name} ({c.dialCode})
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="col-span-7">
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            Mobile Number <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="tel"
                            required
                            placeholder="Mobile No."
                            value={mobileNumber}
                            onChange={(e) => setMobileNumber(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-hidden focus:border-[#0B4F9C] transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="Email Address"
                        value={emailAddress}
                        onChange={(e) => setEmailAddress(e.target.value)}
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-hidden focus:border-[#0B4F9C] transition-all"
                      />
                    </div>

                    {/* Course Selection Dropdown */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Course <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={courseCategory}
                        onChange={(e) => setCourseCategory(e.target.value)}
                        required
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-blue-900 focus:bg-white focus:outline-hidden focus:border-[#0B4F9C] transition-all cursor-pointer"
                      >
                        <option value="">- Select Course Program -</option>
                        <optgroup label="General Specialization Formats">
                          <option value="Fellowships (Post Graduate)">Fellowships (Post Graduate)</option>
                          <option value="PG Diploma (Post Graduate)">PG Diploma (Post Graduate)</option>
                          <option value="Certifications (Clinical Masterclasses)">Certifications (Clinical Masterclasses)</option>
                        </optgroup>
                        <optgroup label={`All Dynamic Programs (${dynamicCourses.length})`}>
                          {dynamicCourses.map((c: any) => (
                            <option key={c.id || c.slug || c.title} value={c.title}>
                              {c.title} {c.duration ? `• ${c.duration}` : ""}
                            </option>
                          ))}
                        </optgroup>
                      </select>
                    </div>

                    {/* Address: City & Country */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Address
                      </label>
                      <div className="grid grid-cols-2 gap-2.5">
                        <input
                          type="text"
                          placeholder="City"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-hidden focus:border-[#0B4F9C] transition-all"
                        />
                        <select
                          value={addressCountry}
                          onChange={(e) => setAddressCountry(e.target.value)}
                          className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-hidden focus:border-[#0B4F9C] transition-all cursor-pointer"
                        >
                          <option value="">Select Country</option>
                          {countries.map((c) => (
                            <option key={"popup_addr_" + c.code + c.name} value={c.name}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {formError && (
                      <div className="p-2 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-1.5 animate-in fade-in">
                        <span>⚠</span>
                        <span>{formError}</span>
                      </div>
                    )}

                    {/* Submit Button */}
                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-[#1A73E8] hover:bg-[#1557B0] active:scale-[0.99] text-white text-xs sm:text-sm font-extrabold py-3 px-4 rounded-xl shadow-md shadow-blue-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                      >
                        {isSubmitting ? (
                          <span>Submitting...</span>
                        ) : (
                          <>
                            <span>Submit Form</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </div>

                    <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 pt-0.5">
                      <Lock className="w-3 h-3 text-slate-400" />
                      <span>Strict Medical Privacy: Your contact is confidential.</span>
                    </div>

                  </form>
                </div>
              )}

            </div>

          </div>
        </div>
      )}
    </>
  );
}
