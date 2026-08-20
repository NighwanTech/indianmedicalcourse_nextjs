import React from "react";
import { GraduationCap, Building2, Users, Award, ShieldCheck } from "lucide-react";

export function StatsTicker() {
  const stats = [
    {
      icon: <GraduationCap className="w-6 h-6 text-blue-600" />,
      value: "150+",
      label: "Clinical Specializations",
      subtext: "Fellowships & PG Diplomas",
    },
    {
      icon: <Users className="w-6 h-6 text-emerald-600" />,
      value: "12,000+",
      label: "Doctors Enrolled",
      subtext: "Across India & International",
    },
    {
      icon: <Building2 className="w-6 h-6 text-purple-600" />,
      value: "50+",
      label: "Hospital Tie-ups",
      subtext: "Tertiary Clinical Centers",
    },
    {
      icon: <Award className="w-6 h-6 text-amber-600" />,
      value: "98.4%",
      label: "Course Completion",
      subtext: "High Clinical Satisfaction",
    },
  ];

  return (
    <section className="bg-slate-900 text-white py-10 relative overflow-hidden border-y border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((item, idx) => (
            <div key={idx} className="flex items-center gap-4 p-3 rounded-2xl bg-slate-800/40 border border-slate-700/50">
              <div className="p-3 rounded-xl bg-slate-800 text-white shrink-0 shadow-inner">
                {item.icon}
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-white tracking-tight font-display">
                  {item.value}
                </div>
                <div className="text-xs font-bold text-slate-200">
                  {item.label}
                </div>
                <div className="text-[10px] text-slate-400">
                  {item.subtext}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
