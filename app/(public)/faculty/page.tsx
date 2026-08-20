import React from "react";
import { FacultyShowcase } from "@/components/sections/FacultyShowcase";
import { FinalCtaBanner } from "@/components/sections/FinalCtaBanner";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Clinical Faculty & Specialist Mentors | Indian Medical Course",
  description: "Meet our distinguished faculty directors, senior interventional cardiologists, intensivists, and perinatologists holding DM, MCh, FACC, EDIC, and MRCEM qualifications.",
};

export default function FacultyPage() {
  return (
    <div className="pt-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-6">
        <div className="text-xs font-semibold text-slate-500">
          Home &gt; <span className="text-blue-700 font-bold">Faculty & Clinical Mentors</span>
        </div>
      </div>
      <FacultyShowcase isFullPage={true} />
      <FinalCtaBanner />
    </div>
  );
}
