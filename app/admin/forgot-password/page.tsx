"use client";

import React, { useState } from "react";
import Link from "next/link";
import { forgotPasswordAction } from "@/features/auth/authActions";
import { 
  GraduationCap, 
  Mail, 
  ArrowRight, 
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  ArrowLeft
} from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [devResetUrl, setDevResetUrl] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    const formData = new FormData();
    formData.append("email", email);

    const result = await forgotPasswordAction(formData);

    setIsLoading(false);

    if (result?.error) {
      setError(result.error);
    } else {
      setSuccess(true);
      if (result?.resetUrl) {
        setDevResetUrl(result.resetUrl);
      }
    }
  };

  return (
    <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6 text-center">
      
      {/* Brand Logo */}
      <div className="flex items-center justify-center mx-auto w-32 h-auto mb-2">
        <img
          src="/images/imc-logo.png"
          alt="IMC - Indian Medical Course"
          className="w-full h-auto object-contain"
        />
      </div>

      <div>
        <h1 className="text-xl font-extrabold text-white tracking-tight font-display">
          Forgot Password
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Enter your email to receive a password reset link.
        </p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold px-4 py-3 rounded-xl flex items-start gap-2 text-left">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {success ? (
        <div className="space-y-4">
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold px-4 py-4 rounded-xl flex flex-col items-center gap-3">
            <CheckCircle2 className="w-8 h-8 text-emerald-500" />
            <span>If an account exists for {email}, a password reset link has been sent.</span>
          </div>

          {devResetUrl && (
            <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-xl text-left">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold mb-2">
                <AlertCircle className="w-4 h-4" />
                <span>Development Mode - Direct Link:</span>
              </div>
              <a 
                href={devResetUrl} 
                className="text-blue-400 hover:text-blue-300 text-xs break-all underline"
              >
                {devResetUrl}
              </a>
            </div>
          )}

          <Link
            href="/admin/login"
            className="w-full inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold py-3 px-4 rounded-xl shadow-lg transition-all mt-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Login</span>
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. name@domain.com"
                className="w-full pl-9 pr-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !email}
            className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white text-xs font-bold py-3 px-4 rounded-xl shadow-lg transition-all disabled:opacity-75 disabled:cursor-not-allowed mt-2"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <span>Send Reset Link</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <div className="text-center mt-4">
            <Link 
              href="/admin/login" 
              className="text-xs font-bold text-slate-400 hover:text-white transition-colors flex items-center justify-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Login</span>
            </Link>
          </div>
        </form>
      )}

      <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
        <span>Enterprise 2026 • Secure Recovery</span>
      </div>

    </div>
  );
}
