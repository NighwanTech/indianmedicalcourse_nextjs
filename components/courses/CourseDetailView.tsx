"use client";

import React, { useState, useEffect } from "react";
import { courses as defaultCourses } from "@/lib/data";
import { formatINR } from "@/lib/utils";
import { DEFAULT_MEDICAL_BANNER } from "@/lib/imageUtils";
import { UniversalAdmissionForm } from "@/components/forms/UniversalAdmissionForm";
import { HospitalPartnersMarquee } from "@/components/sections/HospitalPartnersMarquee";
import { FinalCtaBanner } from "@/components/sections/FinalCtaBanner";
import { 
  Clock, 
  Award, 
  ShieldCheck, 
  CheckCircle2, 
  GraduationCap, 
  Sparkles, 
  Building2, 
  Download, 
  ArrowRight,
  BookOpen,
  FileText,
  Video,
  HelpCircle
} from "lucide-react";
import { Course } from "@/types";

interface CourseDetailViewProps {
  initialCourse: Course | null;
  slug: string;
}

export function CourseDetailView({ initialCourse, slug }: CourseDetailViewProps) {
  const [isHydrated, setIsHydrated] = useState(false);
  const [course, setCourse] = useState<Course | null>(initialCourse);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("imc_courses_catalog");
      if (saved) {
        try {
          const parsed: Course[] = JSON.parse(saved);
          const found = parsed.find(
            (c) => c.slug?.toLowerCase() === slug.toLowerCase() || String(c.id) === slug
          );
          if (found) {
            setCourse(found);
          }
        } catch (e) {
          console.error(e);
        }
      }
    }
    // Set isHydrated AFTER state update is queued so React batches both
    setIsHydrated(true);
  }, [slug, initialCourse]);

  if (!course) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-blue-50 text-[#0B4F9C] flex items-center justify-center mb-4">
          <BookOpen className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-black text-slate-900 font-display">Medical Course Not Found</h1>
        <p className="text-xs text-slate-500 max-w-md mt-1 mb-6">
          The requested course URL may have been updated or moved. Explore our 150+ accredited fellowship catalog.
        </p>
        <a
          href="/courses"
          className="bg-[#0B4F9C] hover:bg-[#083E7D] text-white text-xs font-bold py-3 px-6 rounded-xl shadow-md transition-all"
        >
          Explore All 150+ Courses
        </a>
      </div>
    );
  }

  const courseJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Course",
        "name": course.title,
        "description": course.tagline || `${course.title} by Indian Medical Course.`,
        "provider": {
          "@type": "Organization",
          "name": "Indian Medical Course",
          "url": "https://indianmedicalcourse.com",
          "logo": "https://indianmedicalcourse.com/images/imc-logo.png",
        },
        "educationalCredentialAwarded": course.courseType === "FELLOWSHIP" 
          ? "Post-Graduate Medical Fellowship Certificate" 
          : course.courseType === "PG_DIPLOMA" 
          ? "Post-Graduate Medical Diploma" 
          : "Advanced Certificate of Clinical Competence",
        "offers": {
          "@type": "Offer",
          "price": course.feeINR,
          "priceCurrency": "INR",
          "category": "Paid",
          "url": `https://indianmedicalcourse.com/courses/${course.slug}`,
          "availability": "https://schema.org/InStock",
        },
        "hasCourseInstance": {
          "@type": "CourseInstance",
          "courseMode": "Blended",
          "duration": course.duration,
          "startDate": course.nextBatchDate || "2026-09-01",
          "location": {
            "@type": "Place",
            "name": "Apollo Hospitals, Fortis Healthcare & Partner Clinical Network",
          },
        },
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://indianmedicalcourse.com",
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Courses",
            "item": "https://indianmedicalcourse.com/courses",
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": course.title,
            "item": `https://indianmedicalcourse.com/courses/${course.slug}`,
          },
        ],
      },
    ],
  };

  return (
    <div className="bg-white">
      {/* Schema.org Google Search Rich Results Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseJsonLd) }}
      />
      
      {/* Course Header Banner */}
      <section className="bg-slate-950 text-white pt-8 pb-14 relative overflow-hidden">
        {isHydrated && course.heroImage && (
          <img
            key={`bg-${course.heroImage}`}
            src={course.heroImage}
            alt={course.title}
            className="absolute inset-0 w-full h-full object-cover opacity-15 filter blur-[2px] scale-105 pointer-events-none transition-opacity duration-300"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/95 to-blue-950/90" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-xs text-slate-400 mb-4">
            <a href="/" className="hover:underline">Home</a> &gt; <a href="/courses" className="hover:underline">Courses</a> &gt; <span className="text-emerald-400 font-bold">{course.title}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Info Column */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-3 py-1 rounded-full text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                Admissions Open for Next Batch • Starting {course.nextBatchDate || "1st of Next Month"}
              </div>

              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight font-display">
                {course.title}
              </h1>

              <p className="text-xs sm:text-base text-slate-300 leading-relaxed">
                {course.tagline || "Comprehensive clinical training program designed for medical practitioners with hands-on hospital attachment."}
              </p>

              {/* Quick Metrics Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="bg-slate-900/90 p-3 rounded-2xl border border-slate-800">
                  <div className="text-[10px] text-slate-400">Duration</div>
                  <div className="text-sm font-bold text-white flex items-center gap-1.5 mt-0.5">
                    <Clock className="w-4 h-4 text-blue-400" />
                    {course.duration}
                  </div>
                </div>

                <div className="bg-slate-900/90 p-3 rounded-2xl border border-slate-800">
                  <div className="text-[10px] text-slate-400">Clinical Hours</div>
                  <div className="text-sm font-bold text-white flex items-center gap-1.5 mt-0.5">
                    <Award className="w-4 h-4 text-emerald-400" />
                    {course.clinicalHours || 120}+ Hours
                  </div>
                </div>

                <div className="bg-slate-900/90 p-3 rounded-2xl border border-slate-800">
                  <div className="text-[10px] text-slate-400">Course Format</div>
                  <div className="text-sm font-bold text-white flex items-center gap-1.5 mt-0.5">
                    <BookOpen className="w-4 h-4 text-purple-400" />
                    {course.courseType ? course.courseType.replace("_", " ") : "FELLOWSHIP"}
                  </div>
                </div>

                <div className="bg-slate-900/90 p-3 rounded-2xl border border-slate-800">
                  <div className="text-[10px] text-slate-400">Starting EMI</div>
                  <div className="text-sm font-bold text-amber-300 flex items-center gap-1.5 mt-0.5">
                    {formatINR(course.emiStartingINR || 7800)}/mo
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Prominent Featured Course Image Showcase */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl overflow-hidden border-2 border-white/20 shadow-2xl shadow-blue-950/80 bg-slate-900 group">
                <div className="aspect-16/10 relative overflow-hidden bg-slate-800">
                  {isHydrated ? (
                    <img
                      key={course.heroImage || String(course.id)}
                      src={course.heroImage || DEFAULT_MEDICAL_BANNER}
                      alt={course.title}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = DEFAULT_MEDICAL_BANNER;
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-slate-800 animate-pulse flex items-center justify-center">
                      <GraduationCap className="w-10 h-10 text-slate-600" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />

                  {/* Badges Over Image */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-[#0B4F9C] text-white shadow-md uppercase tracking-wider">
                      {course.courseType ? course.courseType.replace("_", " ") : "FELLOWSHIP"}
                    </span>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-900/80 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 backdrop-blur-xs">
                      <Sparkles className="w-3 h-3 text-emerald-400" />
                      Accredited
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
                    <span className="font-bold flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-blue-400" />
                      {course.categoryName}
                    </span>
                    <span className="font-semibold text-slate-300 text-[11px] bg-black/50 px-2 py-0.5 rounded-md backdrop-blur-xs">
                      {course.duration}
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Main Content & Sticky Lead Form Grid */}
      <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column (8 cols): Curriculum, Eligibility, Skills, Hospitals */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* Eligibility Block */}
            <div className="bg-blue-50/70 p-6 rounded-3xl border border-blue-100 space-y-2">
              <h3 className="text-sm font-bold text-blue-900 uppercase tracking-wider flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-blue-700" />
                Candidate Eligibility
              </h3>
              <p className="text-xs sm:text-sm text-slate-800 font-medium">
                {course.eligibility || "MBBS / MD / DNB recognized by NMC or equivalent international medical council."}
              </p>
            </div>

            {/* Comprehensive Curriculum */}
            <div className="space-y-4">
              <h2 className="text-xl font-extrabold text-slate-900 font-display">
                Curriculum & Clinical Modules
              </h2>

              <div className="space-y-3">
                {course.curriculum && course.curriculum.length > 0 ? (
                  course.curriculum.map((mod) => (
                    <div key={mod.moduleNumber} className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
                      <div className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-1">
                        Module {mod.moduleNumber}
                      </div>
                      <h4 className="text-sm font-extrabold text-slate-900 mb-2">
                        {mod.title}
                      </h4>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
                        {mod.topics.map((t, idx) => (
                          <li key={idx} className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>{t}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))
                ) : (
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
                    <h4 className="text-sm font-extrabold text-slate-900">
                      Foundational & Advanced Clinical Modules
                    </h4>
                    <p className="text-xs text-slate-600">
                      Case logbook reviews, bedside rounds, diagnostic mastery, and surgical/interventional observer-ships under expert faculty.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Skills & Procedural Competencies */}
            <div className="space-y-4">
              <h2 className="text-xl font-extrabold text-slate-900 font-display">
                Key Clinical Skills Acquired
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {(course.skillsCovered && course.skillsCovered.length > 0 
                  ? course.skillsCovered 
                  : ["Clinical Examination", "Diagnostic Review", "Emergency Protocols", "Bedside Procedures"]
                ).map((skill, idx) => (
                  <div key={idx} className="bg-emerald-50/60 p-3.5 rounded-xl border border-emerald-100 text-xs font-bold text-emerald-900 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{skill}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Career Scope */}
            <div className="space-y-4">
              <h2 className="text-xl font-extrabold text-slate-900 font-display">
                Career Scope & Job Opportunities
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {(course.careerOpportunities && course.careerOpportunities.length > 0
                  ? course.careerOpportunities
                  : ["Consultant Specialist", "Hospital Department Physician", "Clinical Practice Specialist"]
                ).map((opp, idx) => (
                  <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs font-bold text-slate-800">
                    {opp}
                  </div>
                ))}
              </div>
            </div>

            {/* Hospital Rotations */}
            <div className="space-y-4">
              <h2 className="text-xl font-extrabold text-slate-900 font-display">
                Clinical Attachments & Partner Hospitals
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {(course.clinicalHospitals && course.clinicalHospitals.length > 0
                  ? course.clinicalHospitals
                  : ["Apollo Hospitals", "Fortis Healthcare", "Max Healthcare", "Medanta The Medicity"]
                ).map((hosp, idx) => (
                  <div key={idx} className="bg-white p-3.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 flex items-center gap-2 shadow-2xs">
                    <Building2 className="w-4 h-4 text-[#0B4F9C] shrink-0" />
                    <span>{hosp}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column (4 cols): Sticky Lead & Application Card */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              
              {/* Fee & EMI Summary Box */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-bold">Total Program Fee</span>
                  <span className="text-lg font-black text-slate-900">{formatINR(course.feeINR)}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-emerald-700 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 font-bold">
                  <span>0% Interest EMI from</span>
                  <span>{formatINR(course.emiStartingINR || 7800)} / month</span>
                </div>
              </div>

              {/* Universal Admission Form with Course Pre-Selected */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
                <UniversalAdmissionForm
                  initialCourseType={course.courseType ? course.courseType.replace("_", " ") : "Fellowship"}
                  initialCourseName={course.title}
                  source="COURSE_PAGE_MODAL"
                  title="Apply for Next Batch"
                  subtitle={`Enroll in ${course.title} with 40% Doctor Scholarship & 0% EMI.`}
                />
              </div>

            </div>
          </div>

        </div>
      </section>

      <HospitalPartnersMarquee />
      <FinalCtaBanner />

    </div>
  );
}
