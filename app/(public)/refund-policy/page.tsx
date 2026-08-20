import React from "react";
import { siteSettings } from "@/lib/data";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy | Indian Medical Course",
  description: "Refund and cancellation guidelines for course enrolments at Indian Medical Course.",
};

export default function RefundPolicyPage() {
  return (
    <div className="bg-white py-14 max-w-4xl mx-auto px-4 sm:px-6 space-y-6 text-slate-700 text-xs sm:text-sm leading-relaxed">
      <h1 className="text-2xl sm:text-4xl font-black text-slate-900 font-display">
        Refund & Cancellation Policy
      </h1>
      <p className="text-slate-500 text-xs">Last Updated: August 2026</p>

      <div className="space-y-4 pt-4 border-t border-slate-200">
        <h2 className="text-base font-bold text-slate-900">1. Batch Allocation & Registration Fee</h2>
        <p>
          Seat reservation fees cover administrative credential screening, LMS portal activation, and hospital slot reservations.
        </p>

        <h2 className="text-base font-bold text-slate-900">2. Cancellation Prior to Batch Commencement</h2>
        <p>
          If a cancellation request is submitted in writing at least 7 days prior to the official batch orientation date, a refund of tuition fees (less standard processing fee) will be processed within 10-14 working days.
        </p>

        <h2 className="text-base font-bold text-slate-900">3. Contact Support</h2>
        <p>
          For refund inquiries, contact: {siteSettings.supportEmail} or call {siteSettings.hotlinePhone}.
        </p>
      </div>
    </div>
  );
}
