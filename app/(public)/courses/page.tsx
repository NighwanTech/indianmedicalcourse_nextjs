import React from "react";
import { CourseSearchFilter } from "@/components/sections/CourseSearchFilter";
import { HospitalPartnersMarquee } from "@/components/sections/HospitalPartnersMarquee";
import { FinalCtaBanner } from "@/components/sections/FinalCtaBanner";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Clinical Fellowships & PG Diplomas | Indian Medical Course",
  description: "Browse over 150+ hands-on medical fellowships, diplomas, and clinical observer-ships across Cardiology, Critical Care, ICU, Fetal Ultrasound, Surgery, and Dermatology.",
};

export default function CoursesPage() {
  return (
    <div className="pt-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-6">
        <div className="text-xs font-semibold text-slate-500">
          Home &gt; <span className="text-blue-700 font-bold">Medical Courses & Fellowships</span>
        </div>
      </div>
      <CourseSearchFilter limit={0} isHomePage={false} />
      <HospitalPartnersMarquee />
      <FinalCtaBanner />
    </div>
  );
}
