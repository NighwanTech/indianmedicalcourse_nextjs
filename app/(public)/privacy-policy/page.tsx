import React from "react";
import { siteSettings } from "@/lib/data";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Indian Medical Course",
  description: "Privacy policy and data protection terms for Indian Medical Course platform.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-white py-14 max-w-4xl mx-auto px-4 sm:px-6 space-y-6 text-slate-700 text-xs sm:text-sm leading-relaxed">
      <h1 className="text-2xl sm:text-4xl font-black text-slate-900 font-display">
        Privacy Policy
      </h1>
      <p className="text-slate-500 text-xs">Last Updated: August 2026</p>

      <div className="space-y-4 pt-4 border-t border-slate-200">
        <h2 className="text-base font-bold text-slate-900">1. Information Collection & Usage</h2>
        <p>
          Indian Medical Course collects information provided voluntarily when you fill out course enquiry forms, register for academic counselling, or download program brochures (including Name, Mobile Number, Email, Medical Qualification, and City).
        </p>

        <h2 className="text-base font-bold text-slate-900">2. Data Security & Confidentiality</h2>
        <p>
          Your personal and academic information is strictly confidential. We do not sell or rent candidate information to third parties. Data is used solely for admission processing, verifying qualification eligibility, and providing academic updates.
        </p>

        <h2 className="text-base font-bold text-slate-900">3. Official Registered Office</h2>
        <p>
          Address: {siteSettings.registeredAddress}<br />
          Email: {siteSettings.supportEmail}<br />
          Helpline: {siteSettings.hotlinePhone}
        </p>
      </div>
    </div>
  );
}
