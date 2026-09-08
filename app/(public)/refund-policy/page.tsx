import React from "react";
import { siteSettings } from "@/lib/data";
import { Metadata } from "next";
import { ShieldAlert } from "lucide-react";

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy | Indian Medical Course",
  description: "Strict non-refundable and cancellation terms for clinical fellowships, PG diplomas, and certification enrolments at Indian Medical Course.",
};

export default function RefundPolicyPage() {
  return (
    <div className="bg-white py-14 max-w-4xl mx-auto px-4 sm:px-6 space-y-6 text-slate-700 text-xs sm:text-sm leading-relaxed">
      <div>
        <span className="inline-block text-[#0B4F9C] font-extrabold text-xs tracking-wider uppercase mb-1">
          Academic Regulations & Institutional Terms
        </span>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 font-display">
          Refund & Cancellation Policy
        </h1>
        <p className="text-slate-500 text-xs mt-1">Last Updated: September 2026</p>
      </div>

      {/* Important Notice Alert Box */}
      <div className="rounded-2xl bg-amber-50 border border-amber-200/80 p-5 flex items-start gap-3.5">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm text-amber-950 space-y-1">
          <div className="font-extrabold text-amber-900">
            Strict Non-Refundable Policy Notice
          </div>
          <p className="text-amber-800 leading-relaxed">
            All registration charges, seat reservation fees, batch enrollment fees, and program tuition fees paid to <strong>Indian Medical Course (IMC)</strong> are <strong>strictly non-refundable and non-transferable</strong> under any circumstances.
          </p>
        </div>
      </div>

      <div className="space-y-6 pt-4 border-t border-slate-200">
        
        {/* Section 1 */}
        <section className="space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 text-xs font-black flex items-center justify-center">1</span>
            Strict Non-Refundable Fee Policy
          </h2>
          <p>
            Due to the specialized clinical nature of our Post-Graduate Fellowships and PG Diplomas, admissions are governed by strictly limited batch quotas per hospital and academic term. Once a candidate completes registration or fee payment (full payment or installment):
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-600">
            <li>No refund requests will be entertained under any circumstances.</li>
            <li>Fees once remitted cannot be adjusted against other prospective candidates or transferred to third parties.</li>
            <li>Seat confirmation involves irrevocable resource allocation including tertiary hospital bedside rotation slots, faculty scheduling, digital LMS licensing, and CPD UK accreditation credentials.</li>
          </ul>
        </section>

        {/* Section 2: Mid-Course Discontinuation */}
        <section className="space-y-2 rounded-2xl bg-slate-50 p-5 border border-slate-200">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-red-100 text-red-800 text-xs font-black flex items-center justify-center">2</span>
            Mid-Course Discontinuation & Dropouts
          </h2>
          <div className="p-3.5 bg-red-50/80 border border-red-200 rounded-xl text-xs sm:text-sm text-red-900 font-semibold leading-relaxed">
            If a student or enrolled doctor leaves, drops out, discontinues, or abandons the program in-between (at any stage during the online didactic modules, clinical masterclasses, or hospital bedside attachments) for ANY reason whatsoever, no fees will be refunded under any circumstances.
          </div>
          <p className="text-slate-600 mt-2">
            This applies universally to all reasons including, but not limited to:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-600 text-xs sm:text-sm">
            <li>Personal circumstances, family obligations, or relocation/transfer.</li>
            <li>Professional work commitments, hospital duties, or clinical shift conflicts.</li>
            <li>Securing admission in other government, private, or NEET PG programs.</li>
            <li>Medical illness, absenteeism, or failure to attend mandatory clinical training rotations.</li>
          </ul>
          <p className="text-slate-600 text-xs">
            Any outstanding balance fees or scheduled installments remain legally payable, and previous payments will be forfeited in their entirety.
          </p>
        </section>

        {/* Section 3 */}
        <section className="space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 text-xs font-black flex items-center justify-center">3</span>
            Batch Postponement & Emergency Deferral
          </h2>
          <p>
            While fees remain strictly non-refundable, Indian Medical Course understands the unpredictable nature of clinical medical practice. In genuine medical or unavoidable professional emergencies:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-600">
            <li>A candidate may apply in writing for a <strong>one-time batch postponement</strong> to the immediate subsequent batch, subject to approval by the Academic Director.</li>
            <li>Such requests must be submitted at least 15 days prior to the commencement of hospital rotations.</li>
            <li>Approval is subject to slot availability at our partner hospital centers (Apollo, Fortis, Max, etc.) and an administrative batch transfer fee may apply.</li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className="space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 text-xs font-black flex items-center justify-center">4</span>
            Disciplinary Termination
          </h2>
          <p>
            IMC reserves the right to terminate enrollment without notice or refund if a candidate breaches hospital patient confidentiality, exhibits unethical clinical conduct, violates hospital safety bylaws during bedside training, or provides falsified medical qualification credentials.
          </p>
        </section>

        {/* Section 5 */}
        <section className="space-y-2 pt-4 border-t border-slate-200">
          <h2 className="text-base font-bold text-slate-900">5. Contact Support & Academic Office</h2>
          <p>
            For any clarifications regarding our academic regulations or enrolment policies, please write to our academic administration:
          </p>
          <div className="mt-2 p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1 font-mono text-xs">
            <div><strong>Email:</strong> {siteSettings.supportEmail}</div>
            <div><strong>Helpline:</strong> {siteSettings.hotlinePhone}</div>
            <div><strong>Office Hours:</strong> Monday – Saturday (10:00 AM – 7:00 PM IST)</div>
          </div>
        </section>

      </div>
    </div>
  );
}
