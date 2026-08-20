import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { UniversalAdmissionForm } from "@/components/forms/UniversalAdmissionForm";
import { HospitalPartnersMarquee } from "@/components/sections/HospitalPartnersMarquee";
import { FellowshipGuideHub } from "@/components/sections/FellowshipGuideHub";
import { courses, siteSettings } from "@/lib/data";
import { 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles, 
  Clock, 
  Award, 
  Building2, 
  GraduationCap, 
  Stethoscope, 
  Phone, 
  Star,
  Users,
  ArrowRight,
  ChevronRight
} from "lucide-react";
import { Metadata } from "next";

// Pre-defined seed landing pages matching Admin Landing Pages Builder
const LANDING_PAGES_MAP: Record<string, {
  title: string;
  subtitle: string;
  badge: string;
  targetCourse: string;
  clinicalHighlights: string[];
  intakeMonth: string;
  seatsRemaining: number;
  hospitalCenters: string;
  duration: string;
  priceINR: string;
  emiINR: string;
}> = {
  "cardiology-fellowship-2026": {
    title: "Clinical Cardiology Fellowship 2026",
    subtitle: "Hands-on Cath Lab Observerships, 2D Echo Bedside Scanning, TMT & ICU Management across Apollo & Fortis Network Hospitals.",
    badge: "🚀 ADMISSIONS OPEN • SEPTEMBER 2026 BATCH",
    targetCourse: "Fellowship in Clinical Cardiology",
    clinicalHighlights: [
      "Bedside 2D Echocardiography & Doppler training on 100+ live patients",
      "Hands-on ECG, Holter Analysis, TMT, and Coronary Angiography scrubbing",
      "ICCU management of Acute Coronary Syndrome (ACS) & Cardiogenic Shock",
      "CPD Standards Office (UK) Accredited with Verifiable Certificate",
    ],
    intakeMonth: "September 2026",
    seatsRemaining: 6,
    hospitalCenters: "Apollo Hospitals & Fortis Escorts",
    duration: "12 Months (Hybrid + Hospital Rotations)",
    priceINR: "₹1,25,000",
    emiINR: "₹7,800/mo (0% EMI)",
  },
  "critical-care-icu-mastery": {
    title: "Fellowship in Critical Care Medicine",
    subtitle: "Master Mechanical Ventilation Curves, Arterial Lines, Central Venous Cannulation & ARDS Management with Senior Intensivists.",
    badge: "⚡ PRIORITY ADMISSIONS • CRITICAL CARE BATCH",
    targetCourse: "Fellowship in Critical Care Medicine",
    clinicalHighlights: [
      "Advanced Mechanical Ventilator Modes, ARDS Prone Positioning & Weaning",
      "Hands-on Central Line, Arterial Line, and Dialysis Catheter insertion",
      "E-FAST, Critical Care Ultrasound (CCUS) & Hemodynamic Monitoring",
      "Sepsis 3.0 bundles, Inotropes titration & ECMO initiation observation",
    ],
    intakeMonth: "August 2026",
    seatsRemaining: 4,
    hospitalCenters: "Medanta The Medicity & Max Super Speciality",
    duration: "12 Months (Hybrid + Hospital Rotations)",
    priceINR: "₹1,35,000",
    emiINR: "₹8,500/mo (0% EMI)",
  },
  "laparoscopic-surgery-fellowship": {
    title: "Fellowship in Laparoscopic Surgery",
    subtitle: "Hands-on Pelvic Trainer Wet Labs, Endotrainer Suturing & Live OT Scrubbing for Cholecystectomy, Appendectomy & Hernia Repair.",
    badge: "🏆 SURGICAL MASTERCLASS • LIMITED SLOTS",
    targetCourse: "Fellowship in Laparoscopic Surgery",
    clinicalHighlights: [
      "Dry-lab & wet-lab intracorporeal knotting and suturing on 3D simulators",
      "Live OT scrubbing for Lap Cholecystectomy, TEP/TAPP Hernia & Appendectomy",
      "Mastering energy devices: Harmonic Scalpel, Ligasure & Bipolar Cautery",
      "One-on-one mentorship by Senior Laparoscopic General Surgeons",
    ],
    intakeMonth: "October 2026",
    seatsRemaining: 5,
    hospitalCenters: "Apex Surgical Hospitals & Fortis Network",
    duration: "12 Months (Hybrid + OT Wet Labs)",
    priceINR: "₹1,50,000",
    emiINR: "₹9,200/mo (0% EMI)",
  },
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const pageData = LANDING_PAGES_MAP[slug];
  if (!pageData) {
    return {
      title: "Medical Fellowship Admissions 2026 | Indian Medical Course",
    };
  }
  return {
    title: `${pageData.title} | Indian Medical Course`,
    description: pageData.subtitle,
  };
}

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(LANDING_PAGES_MAP).map((slug) => ({ slug }));
}

export default async function DynamicLandingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  // Lookup or fallback dynamically
  const landingData = LANDING_PAGES_MAP[slug] || {
    title: slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
    subtitle: "Accredited Clinical Fellowship with Hands-on Hospital Bedside Rotations, Expert Mentorship & 0% EMI Options.",
    badge: "🚀 ADMISSIONS OPEN 2026",
    targetCourse: "Post-Graduate Clinical Fellowship",
    clinicalHighlights: [
      "Hands-on Bedside Clinical Attachments at 50+ Partner Hospitals",
      "CPD Standards Office (UK) Accredited International Credential",
      "Zero NEET PG requirement for practicing MBBS/MD/DNB/AYUSH doctors",
      "Flexible schedule tailored around your hospital clinical duty",
    ],
    intakeMonth: "Upcoming Batch",
    seatsRemaining: 5,
    hospitalCenters: "Pan-India NABH Hospital Networks",
    duration: "6–12 Months",
    priceINR: "₹1,25,000",
    emiINR: "₹7,500/mo",
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      
      {/* ========================================================================= */}
      {/* TOP URGENT ANNOUNCEMENT BAR                                               */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-r from-[#041B38] via-[#072F60] to-[#0B4F9C] text-white py-2 px-4 text-center text-xs font-bold shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>{landingData.badge} • Only {landingData.seatsRemaining} Clinical Training Slots Remaining</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* HERO CONVERSION SECTION (2 COLS)                                          */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Hero Narrative (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="inline-flex items-center gap-2 bg-blue-100 text-[#0B4F9C] text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider">
              <Award className="w-3.5 h-3.5" />
              <span>CPD (UK) Accredited Program</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight font-display leading-tight">
              {landingData.title}
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              {landingData.subtitle}
            </p>

            {/* Value Highlights Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
                <div className="text-[10px] uppercase font-black text-slate-400">Duration</div>
                <div className="text-xs font-extrabold text-slate-900 mt-0.5">{landingData.duration}</div>
              </div>
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
                <div className="text-[10px] uppercase font-black text-slate-400">Hospital Centers</div>
                <div className="text-xs font-extrabold text-blue-700 mt-0.5 truncate">{landingData.hospitalCenters}</div>
              </div>
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs col-span-2 sm:col-span-1">
                <div className="text-[10px] uppercase font-black text-slate-400">Tuition EMI</div>
                <div className="text-xs font-extrabold text-emerald-700 mt-0.5">{landingData.emiINR}</div>
              </div>
            </div>

            {/* Clinical Highlights Checklist */}
            <div className="space-y-3 pt-2">
              <div className="text-xs font-black uppercase text-slate-400 tracking-wider">
                Clinical Mastery & Competencies Gained:
              </div>
              {landingData.clinicalHighlights.map((hl, idx) => (
                <div key={idx} className="flex items-start gap-3 text-xs font-bold text-slate-800 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{hl}</span>
                </div>
              ))}
            </div>

            {/* Doctor Trust Strip */}
            <div className="flex items-center gap-4 pt-2">
              <div className="flex -space-x-2">
                <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center ring-2 ring-white">Dr. A</div>
                <div className="w-9 h-9 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center ring-2 ring-white">Dr. R</div>
                <div className="w-9 h-9 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center ring-2 ring-white">Dr. S</div>
              </div>
              <div>
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
                <div className="text-[11px] text-slate-500 font-medium">Rated 4.9/5 by 12,000+ Doctor Alumni</div>
              </div>
            </div>

          </div>

          {/* Right Lead Capture Form (5 cols) */}
          <div className="lg:col-span-5 w-full">
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-blue-200 shadow-2xl relative">
              
              <div className="absolute -top-3.5 left-6 bg-[#0B4F9C] text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                Fast-Track Doctor Application
              </div>

              <div className="mb-4 pt-1">
                <h3 className="text-lg font-black text-slate-900 font-display">
                  Apply for {landingData.intakeMonth}
                </h3>
                <p className="text-xs text-slate-500">
                  Receive the clinical syllabus, hospital rotation slots, and 0% EMI breakdown on WhatsApp.
                </p>
              </div>

              <UniversalAdmissionForm
                buttonText="Claim Clinical Seat & Prospectus →"
                source={`Landing Page: ${landingData.title}`}
              />
            </div>
          </div>

        </div>
      </section>

      {/* Hospital Partners Marquee */}
      <HospitalPartnersMarquee />

      {/* Interactive FAQ & Fellowship Guide */}
      <div className="py-10">
        <FellowshipGuideHub />
      </div>

    </div>
  );
}
