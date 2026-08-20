import React from "react";
import { hospitalPartners } from "@/lib/data";
import { HospitalPartnersMarquee } from "@/components/sections/HospitalPartnersMarquee";
import { FinalCtaBanner } from "@/components/sections/FinalCtaBanner";
import { Building2, ShieldCheck, MapPin, CheckCircle2 } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Clinical Hospital Partners & Rotations | Indian Medical Course",
  description: "Explore our accredited network of 50+ tertiary hospitals including Apollo, Fortis, Max, Medanta, and Manipal for bedside clinical rotations.",
};

export default function PlacementPartnersPage() {
  return (
    <div className="pt-6 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-6">
        <div className="text-xs font-semibold text-slate-500">
          Home &gt; <span className="text-blue-700 font-bold">Hospital Network & Clinical Attachments</span>
        </div>
      </div>

      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 text-center">
        <span className="inline-block text-emerald-600 font-extrabold text-xs tracking-wider uppercase mb-1">
          Clinical Attachments
        </span>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 font-display">
          Our Accredited Hospital Partners
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto mt-2">
          Doctors enrolled in our fellowships rotate across top corporate healthcare networks, ICU units, and advanced Cath Labs.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12 text-left">
          {hospitalPartners.map((partner) => (
            <div key={partner.id} className="bg-slate-50 p-6 rounded-3xl border border-slate-200 shadow-xs flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-700 font-bold shrink-0">
                <Building2 className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-extrabold text-slate-900">{partner.name}</h3>
                <div className="text-xs font-bold text-emerald-700">{partner.partnerType}</div>
                <div className="text-[11px] text-slate-500 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  <span>{partner.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <HospitalPartnersMarquee />
      <FinalCtaBanner />
    </div>
  );
}
