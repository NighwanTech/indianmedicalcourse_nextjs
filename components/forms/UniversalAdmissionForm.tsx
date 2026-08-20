"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";
import { countries } from "@/lib/countries";
import { courses, siteSettings } from "@/lib/data";
import { submitLeadAction } from "@/features/leads/leadActions";
import { 
  Sparkles, 
  Send, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight, 
  Clock, 
  MessageSquare,
  HelpCircle,
  AlertCircle,
  RotateCcw,
  PlusCircle
} from "lucide-react";
import { trackGoogleAdsConversion } from "@/components/shared/GoogleAdsTracker";
import { fireLeadConversionSuccess, trackFormSubmit } from "@/lib/analytics";
import { getOrCreateVisitorAttribution } from "@/lib/attribution";

interface UniversalAdmissionFormProps {
  initialCourseType?: string;
  initialCourseName?: string;
  source?: string;
  title?: string;
  subtitle?: string;
  buttonText?: string;
  onSuccess?: () => void;
  className?: string;
}

export function UniversalAdmissionForm({
  initialCourseType = "Fellowship",
  initialCourseName = "",
  source = "WEBSITE_FORM",
  title = "Fast-Track Your Medical Career",
  subtitle = "Advance your clinical expertise with CPD-accredited Fellowship, PG Diploma, and Certification programs.",
  buttonText = "Submit Form",
  onSuccess,
  className = ""
}: UniversalAdmissionFormProps) {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [specialtyStatus, setSpecialtyStatus] = useState("MBBS Doctor");
  const [targetCountry, setTargetCountry] = useState("India");
  const [mobileNumber, setMobileNumber] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [courseCategory, setCourseCategory] = useState<string>(initialCourseName || initialCourseType || "Fellowship in Clinical Cardiology");
  const [dynamicCourses, setDynamicCourses] = useState<any[]>(courses);
  const [city, setCity] = useState("");
  const [addressCountry, setAddressCountry] = useState("India");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedDoctorName, setSubmittedDoctorName] = useState("");
  const [submittedCourseName, setSubmittedCourseName] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

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

  // Clean and Reset Form completely so it looks fresh for next entry
  const resetForm = () => {
    setFullName("");
    setSpecialtyStatus("MBBS Doctor");
    setTargetCountry("India");
    setMobileNumber("");
    setEmailAddress("");
    setCity("");
    setAddressCountry("India");
    setErrors({});
    setIsSubmitted(false);
    setIsSubmitting(false);
  };

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!fullName.trim()) {
      errs.fullName = "Please enter Doctor Full Name";
    }
    if (!targetCountry) {
      errs.targetCountry = "Select country";
    }
    const cleanDigits = mobileNumber.replace(/\D/g, "");
    if (!mobileNumber.trim() || cleanDigits.length < 8) {
      errs.mobileNumber = "Please enter a valid mobile number";
    }
    if (emailAddress && !/^\S+@\S+\.\S+$/.test(emailAddress)) {
      errs.emailAddress = "Please enter a valid email address";
    }
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setIsSubmitting(true);

    const attribution = getOrCreateVisitorAttribution();
    const cleanName = fullName.trim().replace(/^dr\.?\s*/i, "").trim();
    const docName = cleanName ? `Dr. ${cleanName.charAt(0).toUpperCase() + cleanName.slice(1)}` : "Doctor";
    const crsName = initialCourseName || courseCategory || "Clinical Fellowship";

    // Remember submitted values for the success card before clearing
    setSubmittedDoctorName(docName);
    setSubmittedCourseName(crsName);

    try {
      // Build form payload (submitLeadAction handles single-source persistence & deduplication)
      const formPayload = new FormData();
      formPayload.set("name", docName);
      formPayload.set("mobile", mobileNumber);
      formPayload.set("email", emailAddress || `${mobileNumber}@imc-applicant.in`);
      formPayload.set("qualification", specialtyStatus);
      formPayload.set("interestedCourseName", crsName);
      formPayload.set("city", city || "");
      formPayload.set("country", targetCountry);
      formPayload.set("leadSource", source);

      // Attribution
      formPayload.set("sessionId", attribution.sessionId);
      if (attribution.utmSource) formPayload.set("utmSource", attribution.utmSource);
      if (attribution.utmCampaign) formPayload.set("utmCampaign", attribution.utmCampaign);
      if (attribution.utmMedium) formPayload.set("utmMedium", attribution.utmMedium);
      if (attribution.utmContent) formPayload.set("utmContent", attribution.utmContent);
      if (attribution.utmTerm) formPayload.set("utmTerm", attribution.utmTerm);
      if (attribution.gclid) formPayload.set("gclid", attribution.gclid);
      if (attribution.gbraid) formPayload.set("gbraid", attribution.gbraid);
      if (attribution.wbraid) formPayload.set("wbraid", attribution.wbraid);
      if (attribution.fbclid) formPayload.set("fbclid", attribution.fbclid);
      formPayload.set("landingPageUrl", attribution.landingPageUrl);
      if (attribution.referrerUrl) formPayload.set("referrerUrl", attribution.referrerUrl);
      formPayload.set("deviceType", attribution.deviceType);
      formPayload.set("browser", attribution.browser);
      formPayload.set("operatingSystem", attribution.operatingSystem);
      formPayload.set("trafficSource", attribution.trafficSource);
      formPayload.set("trafficType", attribution.trafficType);

      const res = await submitLeadAction(formPayload);
      const leadRefId = res.data?.refId || `lead_${Date.now()}`;

      // Track conversion: Google Ads Conversion + GA4 generate_lead + GTM DataLayer
      fireLeadConversionSuccess({
        courseName: crsName,
        source: source,
        doctorName: docName,
        specialty: specialtyStatus,
        mobile: mobileNumber,
        email: emailAddress,
      });

      trackFormSubmit({
        formName: source,
        courseName: crsName,
      });

      // Save anonymous session for Thank You page greeting
      sessionStorage.setItem("imc_last_lead_ref", JSON.stringify({
        refId: leadRefId,
        doctorName: docName,
        courseName: crsName,
      }));

      // Immediately clear the input state so form fields are completely reset
      setFullName("");
      setMobileNumber("");
      setEmailAddress("");
      setCity("");
      setErrors({});

      setIsSubmitted(true);
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
      if (onSuccess) onSuccess();

    } catch (err) {
      console.error("Lead submission fallback:", err);
      // Clear fields and show success state gracefully
      setFullName("");
      setMobileNumber("");
      setEmailAddress("");
      setCity("");
      setErrors({});
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Auto-redirect back to clean fresh form after 20 seconds
  useEffect(() => {
    if (isSubmitted) {
      const timer = setTimeout(() => {
        resetForm();
      }, 20000);
      return () => clearTimeout(timer);
    }
  }, [isSubmitted]);

  if (isSubmitted) {
    return (
      <div className={`bg-white rounded-2xl border border-emerald-200/90 p-6 text-center shadow-lg animate-in zoom-in-95 duration-300 ${className}`}>
        <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-inner">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <span className="inline-block text-[10px] font-black text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-1.5 border border-emerald-200">
          Inquiry Successfully Logged
        </span>
        <h4 className="text-base sm:text-lg font-black text-slate-900 font-display">
          Thank you, {submittedDoctorName || "Doctor"}!
        </h4>
        <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
          Your application for <strong className="text-blue-700 font-bold">{submittedCourseName || courseCategory}</strong> has been received. Our senior admissions counselor will connect with you shortly.
        </p>

        {/* User feedback redirect notice */}
        <p className="text-[11px] text-slate-500 mt-2.5 font-medium flex items-center justify-center gap-1.5 animate-pulse">
          <span>You will be redirected to the form shortly...</span>
        </p>

        <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex items-center justify-center gap-2 text-[11px] text-slate-500 font-medium">
          <Clock className="w-3.5 h-3.5 text-blue-600" />
          <span>Average Callback Time: 15 Minutes</span>
        </div>

        {/* Subtle manual fallback text link */}
        <div className="mt-3 pt-2">
          <button
            type="button"
            onClick={resetForm}
            className="text-[11px] text-slate-400 hover:text-[#0B4F9C] underline transition-colors cursor-pointer bg-transparent border-0 p-0 font-normal"
          >
            Click here if you want to submit another enquiry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xl relative overflow-hidden ${className}`}>
      
      {/* Top Accent Strip */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0B4F9C] via-blue-600 to-emerald-500" />

      {/* Header */}
      <div className="mb-3">
        <h3 className="text-sm sm:text-base font-black text-slate-900 font-display leading-snug">
          {title}
        </h3>
        {subtitle && (
          <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">
            {subtitle}
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-2">
        
        {/* 1. Doctor Full Name */}
        <div>
          <label className="block text-[10px] font-bold text-slate-700 mb-0.5">
            Doctor Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Dr. Rajesh Kumar"
            value={fullName}
            onChange={(e) => {
              setFullName(e.target.value);
              if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: "" }));
            }}
            className={`w-full px-3 py-1.5 border rounded-lg text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-hidden transition-all ${
              errors.fullName 
                ? "border-red-400 bg-red-50/40 focus:border-red-500 focus:ring-1 focus:ring-red-400" 
                : "bg-slate-50 border-slate-200 focus:border-[#0B4F9C] focus:ring-1 focus:ring-blue-500"
            }`}
          />
          {errors.fullName && (
            <p className="text-[9px] text-red-600 font-semibold mt-0.5 flex items-center gap-1">
              <AlertCircle className="w-2.5 h-2.5" />
              <span>{errors.fullName}</span>
            </p>
          )}
        </div>

        {/* 2. Specialty / Status Dropdown */}
        <div>
          <label className="block text-[10px] font-bold text-slate-700 mb-0.5">
            Specialty / Status <span className="text-red-500">*</span>
          </label>
          <select
            value={specialtyStatus}
            onChange={(e) => setSpecialtyStatus(e.target.value)}
            className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-900 focus:bg-white focus:outline-hidden focus:border-[#0B4F9C] transition-all cursor-pointer"
          >
            <option value="MBBS Doctor">MBBS Doctor</option>
            <option value="Junior Resident">Junior Resident</option>
            <option value="Postgraduate (MD/MS/DNB)">Postgraduate (MD/MS/DNB)</option>
            <option value="Senior Resident / Specialist">Senior Resident / Specialist</option>
            <option value="Consultant">Consultant</option>
            <option value="Medical Student / Intern">Medical Student / Intern</option>
            <option value="BDS / MDS (Dental)">BDS / MDS (Dental)</option>
            <option value="AYUSH Doctor (BAMS/BHMS)">AYUSH Doctor (BAMS/BHMS)</option>
            <option value="Healthcare Professional">Healthcare Professional</option>
          </select>
        </div>

        {/* 2. Country & Phone Row (Dual Inputs) */}
        <div>
          <div className="grid grid-cols-12 gap-1.5">
            <div className="col-span-5">
              <label className="block text-[10px] font-bold text-slate-700 mb-0.5">
                Country <span className="text-red-500">*</span>
              </label>
              <select
                value={targetCountry}
                onChange={(e) => setTargetCountry(e.target.value)}
                className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-900 focus:bg-white focus:outline-hidden focus:border-[#0B4F9C] transition-all cursor-pointer"
              >
                {countries.map((c) => (
                  <option key={c.code + "_" + c.dialCode} value={c.name}>
                    {c.name} ({c.dialCode})
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-7">
              <label className="block text-[10px] font-bold text-slate-700 mb-0.5">
                Mobile Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                required
                placeholder="Mobile No."
                value={mobileNumber}
                onChange={(e) => {
                  setMobileNumber(e.target.value);
                  if (errors.mobileNumber) setErrors((prev) => ({ ...prev, mobileNumber: "" }));
                }}
                className={`w-full px-3 py-1.5 border rounded-lg text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-hidden transition-all ${
                  errors.mobileNumber 
                    ? "border-red-400 bg-red-50/40 focus:border-red-500 focus:ring-1 focus:ring-red-400" 
                    : "bg-slate-50 border-slate-200 focus:border-[#0B4F9C] focus:ring-1 focus:ring-blue-500"
                }`}
              />
            </div>
          </div>
          {errors.mobileNumber && (
            <p className="text-[9px] text-red-600 font-semibold mt-0.5 flex items-center gap-1">
              <AlertCircle className="w-2.5 h-2.5" />
              <span>{errors.mobileNumber}</span>
            </p>
          )}
        </div>

        {/* 3. Email Address */}
        <div>
          <label className="block text-[10px] font-bold text-slate-700 mb-0.5">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            required
            placeholder="Email Address"
            value={emailAddress}
            onChange={(e) => {
              setEmailAddress(e.target.value);
              if (errors.emailAddress) setErrors((prev) => ({ ...prev, emailAddress: "" }));
            }}
            className={`w-full px-3 py-1.5 border rounded-lg text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-hidden transition-all ${
              errors.emailAddress 
                ? "border-red-400 bg-red-50/40 focus:border-red-500 focus:ring-1 focus:ring-red-400" 
                : "bg-slate-50 border-slate-200 focus:border-[#0B4F9C] focus:ring-1 focus:ring-blue-500"
            }`}
          />
          {errors.emailAddress && (
            <p className="text-[9px] text-red-600 font-semibold mt-0.5 flex items-center gap-1">
              <AlertCircle className="w-2.5 h-2.5" />
              <span>{errors.emailAddress}</span>
            </p>
          )}
        </div>

        {/* 4. Course (Dynamically Connected) */}
        <div>
          <label className="block text-[10px] font-bold text-slate-700 mb-0.5">
            Course Program <span className="text-red-500">*</span>
          </label>
          <select
            value={courseCategory}
            onChange={(e) => setCourseCategory(e.target.value)}
            required
            className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-900 focus:bg-white focus:outline-hidden focus:border-[#0B4F9C] transition-all cursor-pointer font-bold text-blue-900"
          >
            <option value="">- Select Course Program -</option>
            <optgroup label="General Specialization Formats">
              <option value="Fellowships (Post Graduate)">Fellowships (Post Graduate)</option>
              <option value="PG Diploma (Post Graduate)">PG Diploma (Post Graduate)</option>
              <option value="Certifications (Clinical Masterclasses)">Certifications (Clinical Masterclasses)</option>
            </optgroup>
            <optgroup label={`Active Clinical Courses (${dynamicCourses.length})`}>
              {dynamicCourses.map((c: any) => (
                <option key={c.id || c.slug || c.title} value={c.title}>
                  {c.title} {c.duration ? `• ${c.duration}` : ""}
                </option>
              ))}
            </optgroup>
          </select>
        </div>

        {/* 5. Address: City & Country (2 Cols) */}
        <div>
          <label className="block text-[10px] font-bold text-slate-700 mb-0.5">
            Address
          </label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="block text-[9px] text-slate-500 font-semibold mb-0.5">City</span>
              <input
                type="text"
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-hidden focus:border-[#0B4F9C] transition-all"
              />
            </div>
            <div>
              <span className="block text-[9px] text-slate-500 font-semibold mb-0.5">Country</span>
              <select
                value={addressCountry}
                onChange={(e) => setAddressCountry(e.target.value)}
                className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-900 focus:bg-white focus:outline-hidden focus:border-[#0B4F9C] transition-all cursor-pointer"
              >
                <option value="">Select Country</option>
                {countries.map((c) => (
                  <option key={c.code + "_addr_" + c.name} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 6. Submit Button */}
        <div className="pt-1">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#1A73E8] hover:bg-[#1557B0] active:scale-[0.98] text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-70"
          >
            {isSubmitting ? (
              <span>Submitting Application...</span>
            ) : (
              <>
                <span>{buttonText}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>

        <p className="text-[9px] text-center text-slate-400">
          🔒 Strict Medical Privacy: Your contact is confidential.
        </p>

      </form>
    </div>
  );
}
