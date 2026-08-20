import React from "react";
import { Metadata } from "next";
import { FellowshipGuideHub } from "@/components/sections/FellowshipGuideHub";
import { HospitalPartnersMarquee } from "@/components/sections/HospitalPartnersMarquee";
import { FinalCtaBanner } from "@/components/sections/FinalCtaBanner";

export const metadata: Metadata = {
  title: "Medical Fellowship & Eligibility Guide 2026 | Indian Medical Course",
  description: "Comprehensive guide to post-graduate medical fellowships in India without NEET PG, MCI/NMC standards, CPD UK accreditation, and tertiary hospital attachments.",
};

export default function FellowshipGuidePage() {
  return (
    <div className="pt-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-4">
        <div className="text-xs font-semibold text-slate-500">
          Home &gt; <span className="text-[#0B4F9C] font-bold">Medical Fellowship & Eligibility Guide</span>
        </div>
      </div>
      <FellowshipGuideHub />
      <HospitalPartnersMarquee />
      <FinalCtaBanner />
    </div>
  );
}
