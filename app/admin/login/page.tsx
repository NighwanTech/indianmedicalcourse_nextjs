"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { loginAction } from "@/features/auth/authActions";
import { 
  GraduationCap, 
  Lock, 
  Mail, 
  ArrowRight, 
  ShieldCheck,
  AlertCircle
} from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin";
  const urlError = searchParams.get("error");
  
  const [email, setEmail] = useState("admissions@indianmedicalcourses.com");
  const [password, setPassword] = useState("admin123");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(urlError);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    const result = await loginAction(formData);

    if (result?.error) {
      setError(result.error);
      setIsLoading(false);
    } else {
      router.push(callbackUrl);
      router.refresh();
    }
  };

  return (
    <div className="w-full max-w-md bg-slate-900/60 backdrop-blur-2xl border border-slate-700/50 rounded-[2rem] p-8 sm:p-10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] space-y-8 text-center relative z-10">
      
      {/* Brand Logo */}
      <Link 
        href="/" 
        className="inline-flex items-center justify-center mx-auto bg-white px-4 py-2 rounded-2xl shadow-lg shadow-black/30 transition-transform duration-300 hover:scale-105"
      >
        <img
          src="/images/imc-logo.png"
          alt="IMC - Indian Medical Course"
          className="h-10 w-auto object-contain"
        />
      </Link>

      <div className="space-y-1.5">
        <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300 tracking-tight font-display">
          Admin Portal
        </h1>
        <p className="text-xs font-medium text-slate-400">
          Sign in to access Admissions CRM & CMS
        </p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold px-4 py-3 rounded-xl flex items-start gap-2 text-left animate-in fade-in slide-in-from-top-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4 text-left">
        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1">
            Email Address
          </label>
          <div className="relative group">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. name@domain.com"
              className="w-full pl-9 pr-3.5 py-3 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/80 focus:border-blue-500/80 transition-all shadow-inner"
            />
            <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5 group-focus-within:text-blue-400 transition-colors" />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-bold text-slate-300">
              Password
            </label>
            <Link 
              href="/admin/forgot-password" 
              className="text-[10px] font-bold text-blue-400 hover:text-blue-300 transition-colors"
            >
              Forgot Password?
            </Link>
          </div>
          <div className="relative group">
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-9 pr-3.5 py-3 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/80 focus:border-blue-500/80 transition-all shadow-inner"
            />
            <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5 group-focus-within:text-blue-400 transition-colors" />
          </div>
        </div>

        <div className="bg-blue-950/40 border border-blue-500/30 rounded-xl p-3 text-left space-y-1">
          <div className="text-[11px] font-bold text-blue-300 uppercase tracking-wider">Super Admin Credentials</div>
          <div className="text-xs text-slate-300 font-mono flex items-center justify-between">
            <span>Email: <strong className="text-white">admissions@indianmedicalcourses.com</strong></span>
          </div>
          <div className="text-xs text-slate-300 font-mono flex items-center justify-between">
            <span>Password: <strong className="text-white">admin123</strong></span>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !email || !password}
          className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white text-sm font-bold py-3.5 px-4 rounded-xl shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(37,99,235,0.5)] transition-all disabled:opacity-75 disabled:cursor-not-allowed mt-4"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            <>
              <span>Sign In to Admin Portal</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <div className="pt-4 mt-2 border-t border-slate-700/50 text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
        <span>Enterprise 2026 • Role Based Access Control</span>
      </div>

    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden p-4 bg-slate-950">
      
      {/* Attractive Mesh/Radial Gradient Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/40 via-slate-950 to-slate-950"></div>
      <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-600/20 blur-[120px] pointer-events-none mix-blend-screen"></div>
      <div className="absolute top-[20%] -right-[10%] w-[40%] h-[60%] rounded-full bg-emerald-600/10 blur-[120px] pointer-events-none mix-blend-screen"></div>
      <div className="absolute -bottom-[20%] left-[20%] w-[60%] h-[50%] rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none mix-blend-screen"></div>
      
      <Suspense fallback={<div className="text-white text-xs">Loading admin portal...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
