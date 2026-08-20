"use client";

import React, { useState } from "react";
import { courses } from "@/lib/data";
import { formatINR } from "@/lib/utils";
import { HeroLeadForm } from "@/components/forms/HeroLeadForm";
import { FinalCtaBanner } from "@/components/sections/FinalCtaBanner";
import { 
  Sparkles, 
  Calculator, 
  CreditCard, 
  Award, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight 
} from "lucide-react";

export default function ScholarshipPage() {
  const [selectedCourseId, setSelectedCourseId] = useState(courses[0].id);
  const [emiTenure, setEmiTenure] = useState(6);

  const selectedCourse = courses.find((c) => c.id === selectedCourseId) || courses[0];
  const calculatedEmi = Math.round(selectedCourse.feeINR / emiTenure);

  return (
    <div className="bg-white pt-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-6">
        <div className="text-xs font-semibold text-slate-500">
          Home &gt; <span className="text-amber-700 font-bold">Scholarships & 0% Interest EMI</span>
        </div>
      </div>

      <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-block bg-amber-100 text-amber-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2.5">
            Financial Aid & Grants
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 font-display">
            Scholarships & 0% Interest EMI Assistance
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-2">
            We believe financial constraints should never stand between a dedicated doctor and clinical excellence. Apply for merit scholarships of up to 40% fee assistance.
          </p>
        </div>

        {/* 2-Column Grid: Calculator on Left, Lead Form on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Interactive EMI & Scholarship Estimator (7 cols) */}
          <div className="lg:col-span-7 bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                <Calculator className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 font-display">
                  Interactive 0% EMI & Fee Calculator
                </h3>
                <p className="text-xs text-slate-500">Select course and installment tenure</p>
              </div>
            </div>

            {/* Select Course */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Select Your Desired Fellowship / Diploma
              </label>
              <select
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(Number(e.target.value))}
                className="w-full px-3.5 py-3 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-blue-600"
              >
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title} — {formatINR(c.feeINR)} ({c.duration})
                  </option>
                ))}
              </select>
            </div>

            {/* Select Tenure */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Choose No-Cost EMI Tenure
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[3, 6, 9, 12].map((tenure) => (
                  <button
                    key={tenure}
                    type="button"
                    onClick={() => setEmiTenure(tenure)}
                    className={`py-2.5 rounded-xl text-xs font-bold transition-all ${
                      emiTenure === tenure
                        ? "bg-[#0B4F9C] text-white shadow-sm"
                        : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                    }`}
                  >
                    {tenure} Months
                  </button>
                ))}
              </div>
            </div>

            {/* Calculated Result Card */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-6 rounded-2xl shadow-lg space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-blue-100 font-semibold">Estimated Monthly Installment:</span>
                <span className="text-[10px] bg-amber-400 text-slate-950 px-2 py-0.5 rounded-md font-black uppercase">
                  0% Interest
                </span>
              </div>
              <div className="text-3xl font-black font-display tracking-tight text-white">
                {formatINR(calculatedEmi)} <span className="text-xs font-normal text-blue-200">/ month</span>
              </div>
              <p className="text-[11px] text-blue-100 leading-relaxed pt-2 border-t border-blue-400/30">
                Total Course Fee: {formatINR(selectedCourse.feeINR)}. Zero processing fee, instant approval via partner banks.
              </p>
            </div>

            {/* Scholarship Merit Tiers */}
            <div className="space-y-2 pt-2">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Available Scholarship Categories
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <div className="font-bold text-emerald-700">Early-Bird Batch Grant</div>
                  <div className="text-[11px] text-slate-500">Up to 25% fee waiver for early applicants</div>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <div className="font-bold text-purple-700">Academic Merit Waiver</div>
                  <div className="text-[11px] text-slate-500">Up to 40% fee waiver for distinction holders</div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Fast Scholarship Lead Form (5 cols) */}
          <div className="lg:col-span-5">
            <HeroLeadForm initialCourseId={selectedCourseId} source="SCHOLARSHIP_CALC" />
          </div>

        </div>

      </section>

      <FinalCtaBanner />
    </div>
  );
}
