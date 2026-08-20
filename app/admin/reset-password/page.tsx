"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { resetPasswordAction } from "@/features/auth/authActions";
import { 
  GraduationCap, 
  Lock, 
  ArrowRight, 
  ShieldCheck, 
  AlertCircle,
  CheckCircle2
} from "lucide-react";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    if (!token) {
      setError("Invalid or missing reset token. Please request a new link.");
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("token", token);
    formData.append("password", password);

    const result = await resetPasswordAction(formData);

    setIsLoading(false);

    if (result?.error) {
      setError(result.error);
    } else {
      setSuccess(true);
      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push("/admin/login?error=Password%20reset%20successfully.%20Please%20log%20in.");
      }, 3000);
    }
  };

  if (!token) {
    return (
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6 text-center">
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold px-4 py-4 rounded-xl flex flex-col items-center gap-3">
          <AlertCircle className="w-8 h-8 text-red-500" />
          <span>Missing reset token. The link may be broken or expired.</span>
        </div>
        <Link
          href="/admin/forgot-password"
          className="w-full inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold py-3 px-4 rounded-xl shadow-lg transition-all mt-4"
        >
          Request New Link
        </Link>
      </div>
    );
  }

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
          Set New Password
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Choose a strong password with at least 8 characters.
        </p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold px-4 py-3 rounded-xl flex items-start gap-2 text-left">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {success ? (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold px-4 py-6 rounded-xl flex flex-col items-center gap-3">
          <CheckCircle2 className="w-10 h-10 text-emerald-500" />
          <span className="text-sm">Password Reset Successfully!</span>
          <span className="text-slate-400 font-normal">Redirecting to login...</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              New Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !password || !confirmPassword}
            className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white text-xs font-bold py-3 px-4 rounded-xl shadow-lg transition-all disabled:opacity-75 disabled:cursor-not-allowed mt-2"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <span>Update Password</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      )}

      <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
        <span>Enterprise 2026 • Secure Recovery</span>
      </div>

    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 p-4">
      <Suspense fallback={<div className="text-white text-xs">Loading recovery portal...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
