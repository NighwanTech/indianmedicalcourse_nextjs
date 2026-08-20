import React from "react";
import { ContactHubSection } from "@/components/sections/ContactHubSection";
import { FaqAccordion } from "@/components/sections/FaqAccordion";
import { FinalCtaBanner } from "@/components/sections/FinalCtaBanner";
import { siteSettings } from "@/lib/data";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Admissions & Academic Support Desk | Indian Medical Course",
  description: "Get in touch with Indian Medical Course admissions desk. Phone helpline: +91 8295843006, WhatsApp: +91 8295843006, Email: admissions@indianmedicalcourses.com.",
};

export default function ContactPage() {
  return (
    <div className="pt-6 bg-[#F8FAFC]">
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-2">
        <div className="text-xs font-semibold text-slate-500">
          Home &gt; <span className="text-blue-700 font-bold">Contact & Admissions Support</span>
        </div>
      </div>

      {/* Redesigned Attractive Interactive Contact Hub */}
      <ContactHubSection />
      
      {/* FAQ & Final Banner */}
      <FaqAccordion />
      <FinalCtaBanner />
    </div>
  );
}
