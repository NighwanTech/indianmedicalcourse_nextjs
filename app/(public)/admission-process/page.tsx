import React from "react";
import { AdmissionProcessFlow } from "@/components/sections/AdmissionProcessFlow";
import { FaqAccordion } from "@/components/sections/FaqAccordion";
import { FinalCtaBanner } from "@/components/sections/FinalCtaBanner";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admission Process & Batch Eligibility 2026 | Indian Medical Course",
  description: "Learn about the 4-step streamlined admission process, document screening, hospital rotation allocations, and 0% EMI financing.",
};

export default function AdmissionProcessPage() {
  return (
    <div className="pt-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-6">
        <div className="text-xs font-semibold text-slate-500">
          Home &gt; <span className="text-blue-700 font-bold">Admission Process 2026</span>
        </div>
      </div>
      <AdmissionProcessFlow />
      <FaqAccordion />
      <FinalCtaBanner />
    </div>
  );
}
