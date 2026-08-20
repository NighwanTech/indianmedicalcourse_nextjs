import React from "react";
import { siteSettings } from "@/lib/data";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions | Indian Medical Course",
  description: "Terms and conditions of enrollment for Indian Medical Course platform.",
};

export default function TermsPage() {
  return (
    <div className="bg-white py-14 max-w-4xl mx-auto px-4 sm:px-6 space-y-6 text-slate-700 text-xs sm:text-sm leading-relaxed">
      <h1 className="text-2xl sm:text-4xl font-black text-slate-900 font-display">
        Terms & Conditions
      </h1>
      <p className="text-slate-500 text-xs">Last Updated: August 2026</p>

      <div className="space-y-4 pt-4 border-t border-slate-200">
        <h2 className="text-base font-bold text-slate-900">1. Nature of Programs</h2>
        <p>
          Indian Medical Course offers skill development, clinical fellowships, and post-graduate diploma programs designed for continuing professional development under international CPD guidelines.
        </p>

        <h2 className="text-base font-bold text-slate-900">2. Eligibility Verification</h2>
        <p>
          Enrolment in specialized clinical programs is subject to verification of candidate medical credentials (MBBS / MD / DNB / BDS / recognized state medical council registrations).
        </p>

        <h2 className="text-base font-bold text-slate-900">3. Contact & Support</h2>
        <p>
          Helpline: {siteSettings.hotlinePhone} | Email: {siteSettings.supportEmail}
        </p>
      </div>
    </div>
  );
}
