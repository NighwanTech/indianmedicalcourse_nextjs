import React from "react";
import Link from "next/link";
import { 
  FileText, 
  CheckCircle2, 
  CreditCard, 
  GraduationCap, 
  ArrowRight,
  ShieldCheck
} from "lucide-react";

export function AdmissionProcessFlow() {
  const steps = [
    {
      stepNumber: "01",
      icon: <FileText className="w-6 h-6 text-blue-600" />,
      title: "Select Course & Inquire",
      description: "Choose your target fellowship or diploma program. Submit the simple 2-step counselling form to receive the detailed syllabus and batch timetable.",
    },
    {
      stepNumber: "02",
      icon: <CheckCircle2 className="w-6 h-6 text-emerald-600" />,
      title: "Eligibility Screening",
      description: "Our academic counselling team reviews your medical qualification (MBBS/MD/DNB) and clinical experience to confirm batch eligibility.",
    },
    {
      stepNumber: "03",
      icon: <CreditCard className="w-6 h-6 text-purple-600" />,
      title: "Seat Booking & 0% EMI",
      description: "Reserve your seat with flexible payment milestones or instant 0% interest monthly installments via our verified banking partners.",
    },
    {
      stepNumber: "04",
      icon: <GraduationCap className="w-6 h-6 text-amber-600" />,
      title: "Commence Training",
      description: "Access your clinical LMS portal, attend live specialist masterclasses, and schedule your hands-on hospital attachment rotations.",
    },
  ];

  return (
    <section className="py-20 bg-slate-50 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block bg-blue-100 text-blue-800 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2.5">
            Admissions 2026
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight font-display">
            Fast, Frictionless 4-Step Admission Journey
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2">
            From initial enquiry to your first clinical hospital round, our admissions advisors assist you every step of the way.
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((item, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm relative flex flex-col justify-between hover:shadow-md transition-all group"
            >
              <div>
                {/* Step Number Top Badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 group-hover:scale-105 transition-transform">
                    {item.icon}
                  </div>
                  <span className="text-2xl font-black text-slate-200 font-display">
                    {item.stepNumber}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Standardized Protocol</span>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Bar */}
        <div className="mt-12 text-center">
          <Link
            href="/book-counselling"
            className="inline-flex items-center gap-2 bg-[#0B4F9C] hover:bg-[#083E7D] text-white text-xs font-bold py-3 px-6 rounded-xl shadow-md transition-all hover:scale-105"
          >
            <span>Start Your Admission Evaluation</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}
