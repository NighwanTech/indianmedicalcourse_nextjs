"use client";

import React, { useState, useEffect } from "react";
import { hospitalPartners as fallbackPartners } from "@/lib/data";
import { ShieldCheck, Building2, GraduationCap, Award, Sparkles } from "lucide-react";

export function HospitalPartnersMarquee() {
  const [partners, setPartners] = useState<any[]>(fallbackPartners);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadPartners() {
      try {
        const res = await fetch("/api/partners?category=ALL");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setPartners(data);
          }
        }
      } catch (e) {
        console.warn("Could not fetch live partners, using fallback data:", e);
      } finally {
        setIsLoading(false);
      }
    }
    loadPartners();
  }, []);

  // Duplicate for seamless infinite marquee loop
  const marqueeList = [...partners, ...partners];

  return (
    <section className="py-16 bg-gradient-to-b from-white via-slate-50/50 to-white overflow-hidden border-b border-slate-100 relative">
      
      {/* Background Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-blue-400/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-10 text-center relative z-10">
        <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 text-[11px] font-extrabold px-3.5 py-1.5 rounded-full uppercase tracking-wider mb-3 border border-emerald-200/60 shadow-2xs">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Accredited Clinical & Academic Network</span>
        </div>
        <h3 className="text-2xl sm:text-3xl font-black text-slate-900 font-display tracking-tight">
          Hospital Attachments & University Partners
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 max-w-2xl mx-auto mt-2 leading-relaxed">
          Hands-on patient training, Cath Lab observer-ships, and CPD international certifications across India and the UK&apos;s leading institutions.
        </p>
      </div>

      {/* Infinite Scrolling Track with Big Clear Logos */}
      <div className="relative w-full overflow-hidden mask-fade-edges py-2">
        <div className="flex animate-marquee gap-6 items-center">
          {marqueeList.map((partner, index) => {
            const isUniversity = partner.partnerType === "UNIVERSITY";
            const isAccreditation = partner.partnerType === "ACCREDITATION";

            return (
              <div
                key={`${partner.id}-${index}`}
                className="flex items-center gap-4 px-6 py-4 bg-white border border-slate-200/90 rounded-3xl shrink-0 shadow-sm hover:shadow-xl hover:border-blue-300 hover:scale-[1.02] transition-all duration-300 group min-w-[280px] sm:min-w-[320px]"
              >
                {/* Brand Logo Container (Prominent, High Visibility) */}
                <div className="w-20 h-14 sm:w-24 sm:h-16 rounded-2xl bg-white border border-slate-100 p-2 flex items-center justify-center shadow-2xs group-hover:shadow-md transition-shadow shrink-0">
                  {partner.logoUrl ? (
                    <img
                      src={partner.logoUrl}
                      alt={partner.name}
                      className="max-h-full max-w-full object-contain filter drop-shadow-2xs group-hover:scale-105 transition-transform"
                      onError={(e) => {
                        // Fallback to building icon if image fails
                        (e.target as HTMLElement).style.display = "none";
                        (e.target as HTMLElement).parentElement!.classList.add("bg-blue-50");
                      }}
                    />
                  ) : (
                    <div className="w-full h-full rounded-xl bg-blue-50 flex items-center justify-center text-blue-700 font-black text-xs">
                      {isUniversity ? <GraduationCap className="w-6 h-6" /> : <Building2 className="w-6 h-6" />}
                    </div>
                  )}
                </div>

                {/* Information & Category Badge */}
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-black text-slate-900 group-hover:text-[#0B4F9C] transition-colors truncate">
                    {partner.name}
                  </div>
                  
                  <div className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                    {partner.location || "Pan-India"}
                  </div>

                  {/* Category Pill */}
                  <div className="mt-1.5">
                    <span className={`inline-flex items-center gap-1 text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${
                      isUniversity
                        ? "bg-purple-50 text-purple-700 border border-purple-200/60"
                        : isAccreditation
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                        : "bg-blue-50 text-blue-700 border border-blue-200/60"
                    }`}>
                      {isUniversity && <GraduationCap className="w-2.5 h-2.5" />}
                      {isAccreditation && <Award className="w-2.5 h-2.5" />}
                      {!isUniversity && !isAccreditation && <Building2 className="w-2.5 h-2.5" />}
                      <span>
                        {isUniversity ? "University" : isAccreditation ? "Accreditation" : "Training Hospital"}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </section>
  );
}
