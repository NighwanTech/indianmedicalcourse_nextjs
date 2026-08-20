"use client";

import React, { useState, useEffect } from "react";
import { siteSettings } from "@/lib/data";
import { Phone, Sparkles, Send, CheckCircle2 } from "lucide-react";
import confetti from "canvas-confetti";
import { submitLeadAction } from "@/features/leads/leadActions";

export function CallbackRibbon() {
  const [mobile, setMobile] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const resetForm = () => {
    setMobile("");
    setErrorMsg("");
    setIsSuccess(false);
    setIsSubmitting(false);
  };

  // Auto-redirect back to clean fresh form after 20 seconds
  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        resetForm();
      }, 20000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = mobile.replace(/\D/g, "");
    if (!clean || clean.length < 8) {
      setErrorMsg("Please enter a valid mobile number");
      return;
    }
    setErrorMsg("");
    setIsSubmitting(true);

    try {
      await submitLeadAction({
        name: "Doctor Applicant",
        mobile: mobile,
        formSource: "Helpline Callback Ribbon",
        leadSource: "Helpline Ribbon",
        interestedCourse: "Clinical Fellowship / Admission Callback",
        priority: "HIGH",
        score: 90,
      });

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ["#0B4F9C", "#0D9468", "#F59E0B"],
      });

      setMobile("");
      setIsSuccess(true);
    } catch (err) {
      setMobile("");
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-gradient-to-r from-[#083E7D] via-[#0B4F9C] to-[#0D9468] text-white py-6 border-b border-blue-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 text-center lg:text-left">
          
          {/* Left Prompt */}
          <div>
            <div className="inline-flex items-center gap-1.5 bg-amber-400 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-1.5">
              <Sparkles className="w-3 h-3" />
              Need Fast Guidance?
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white font-display">
              Get In Touch For Admission Guidance & Eligibility Check
            </h3>
            <p className="text-xs text-blue-100">
              Toll Free Admissions Helpline:{" "}
              <a href={`tel:${siteSettings.hotlinePhone.replace(/\s+/g, "")}`} className="font-bold underline text-amber-300">
                {siteSettings.hotlinePhone}
              </a>
            </p>
          </div>

          {/* Right Mobile Form */}
          <div className="w-full lg:w-auto">
            {isSuccess ? (
              <div className="flex flex-col items-center lg:items-end gap-1.5 text-center lg:text-right">
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl text-xs font-bold text-white shadow-inner">
                  <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
                  <span>Request Received! Calling you within 15 minutes.</span>
                </div>
                <p className="text-[10px] text-blue-100 animate-pulse font-medium">
                  You will be redirected to the form shortly...
                </p>
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-[10px] text-amber-300 hover:text-amber-200 underline cursor-pointer bg-transparent border-0 p-0 font-normal"
                >
                  Click here if you want to submit another enquiry
                </button>
              </div>
            ) : (
              <div className="flex flex-col">
                <form onSubmit={handleSubmit} className="flex items-center gap-2 max-w-md mx-auto lg:mx-0">
                  <input
                    type="tel"
                    required
                    value={mobile}
                    onChange={(e) => {
                      setMobile(e.target.value);
                      if (errorMsg) setErrorMsg("");
                    }}
                    placeholder="Enter Your Mobile Number..."
                    className={`bg-white/95 text-slate-900 text-xs font-medium placeholder:text-slate-400 px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-amber-400 w-60 sm:w-72 shadow-sm ${
                      errorMsg ? "border-red-400 bg-red-50 text-red-900" : "border-white/30"
                    }`}
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="shrink-0 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md hover:scale-105 cursor-pointer disabled:opacity-70"
                  >
                    {isSubmitting ? "Submitting..." : "Get Callback"}
                  </button>
                </form>
                {errorMsg && (
                  <p className="text-[10px] text-amber-200 font-bold mt-1 text-left">
                    ⚠ {errorMsg}
                  </p>
                )}
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
