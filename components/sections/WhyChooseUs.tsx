import React from "react";
import Link from "next/link";
import { 
  HeartPulse, 
  Users, 
  Sparkles, 
  GraduationCap, 
  ShieldCheck, 
  ArrowRight,
  Clock,
  Award
} from "lucide-react";

export function WhyChooseUs() {
  const pillars = [
    {
      icon: <HeartPulse className="w-6 h-6 text-blue-600" />,
      title: "Real Bedside Clinical Attachments",
      description: "Unlike purely theoretical online courses, our doctors complete structured clinical rotations and bedside case presentations at top tertiary hospitals.",
      badge: "Hands-on Training",
      bgColor: "bg-blue-50/60",
      borderColor: "border-blue-100",
    },
    {
      icon: <Users className="w-6 h-6 text-emerald-600" />,
      title: "Senior Specialist Mentorship",
      description: "Direct case discussions and clinical decision audits guided by veteran consultants (DM, MCh, FACC, EDIC, and MRCEM certified directors).",
      badge: "Elite Faculty",
      bgColor: "bg-emerald-50/60",
      borderColor: "border-emerald-100",
    },
    {
      icon: <Clock className="w-6 h-6 text-purple-600" />,
      title: "Doctor-Centric Hybrid Schedule",
      description: "Flexible interactive live weekend masterclasses combined with pre-recorded clinical cases, designed specifically around hospital duty shifts.",
      badge: "Zero Disruption",
      bgColor: "bg-purple-50/60",
      borderColor: "border-purple-100",
    },
    {
      icon: <Award className="w-6 h-6 text-amber-600" />,
      title: "0% EMI & Scholarship Grants",
      description: "Affordable medical upskilling with flexible 3-12 month zero-interest EMI financing and merit scholarships of up to 40% for early applicants.",
      badge: "Financial Aid",
      bgColor: "bg-amber-50/60",
      borderColor: "border-amber-100",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div className="max-w-2xl">
            <span className="inline-block bg-emerald-100 text-emerald-800 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2.5">
              The IMC Clinical Advantage
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight font-display">
              Engineered by Doctors, for Doctors
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              Why over 12,000+ medical professionals across India choose Indian Medical Course to accelerate their clinical careers.
            </p>
          </div>

          <Link
            href="/book-counselling"
            className="inline-flex items-center gap-2 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200/80 px-4 py-2.5 rounded-xl transition-all shadow-sm shrink-0"
          >
            <span>Book Free Career Guidance</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((item, idx) => (
            <div
              key={idx}
              className={`p-6 rounded-3xl border ${item.borderColor} ${item.bgColor} flex flex-col justify-between space-y-4 hover:shadow-lg transition-all duration-300`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white rounded-2xl shadow-sm">
                    {item.icon}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider bg-white/90 text-slate-800 px-2.5 py-1 rounded-full shadow-xs border border-slate-200/60">
                    {item.badge}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-snug mb-2">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-200/40 flex items-center gap-1.5 text-[11px] font-bold text-slate-700">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Verified Quality Standard</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
