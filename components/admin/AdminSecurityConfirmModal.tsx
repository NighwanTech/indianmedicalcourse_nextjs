"use client";

import React, { useState, useEffect, useRef } from "react";
import { ShieldAlert, Lock, Eye, EyeOff, X, AlertTriangle, KeyRound } from "lucide-react";

export const DEFAULT_MASTER_SECURITY_PASSWORD = "admin@imc2026";
export const SECURITY_PASSWORD_STORAGE_KEY = "imc_master_security_password";

interface AdminSecurityConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  title?: string;
  description?: string;
  actionLabel?: string;
}

export function AdminSecurityConfirmModal({
  isOpen,
  onClose,
  onSuccess,
  title = "Security Verification Required",
  description = "This action will reset content to factory defaults. Please enter the Master Admin Security Password to proceed.",
  actionLabel = "Verify & Execute Reset",
}: AdminSecurityConfirmModalProps) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isShaking, setIsShaking] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setPassword("");
      setErrorMessage("");
      setShowPassword(false);
      setIsShaking(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const storedMaster =
      typeof window !== "undefined"
        ? localStorage.getItem(SECURITY_PASSWORD_STORAGE_KEY) || DEFAULT_MASTER_SECURITY_PASSWORD
        : DEFAULT_MASTER_SECURITY_PASSWORD;

    if (password.trim() === storedMaster.trim()) {
      setPassword("");
      setErrorMessage("");
      onSuccess();
      onClose();
    } else {
      setErrorMessage("Access Denied: Incorrect Master Admin Password.");
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      inputRef.current?.focus();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div
        className={`bg-white rounded-3xl w-full max-w-md shadow-2xl border border-red-200 overflow-hidden flex flex-col transition-transform ${
          isShaking ? "animate-shake ring-4 ring-red-500/30" : "animate-in zoom-in-95 duration-200"
        }`}
      >
        {/* Header with Security Alert Styling */}
        <div className="p-5 bg-gradient-to-r from-red-950 via-red-900 to-rose-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-500/20 border border-red-400/30 flex items-center justify-center text-amber-300 shadow-inner">
              <ShieldAlert className="w-5 h-5 text-red-300" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white font-display flex items-center gap-1.5">
                <span>Security Check</span>
                <span className="text-[10px] bg-red-800/80 text-red-200 border border-red-700 px-2 py-0.5 rounded-full uppercase font-bold">
                  Super Admin
                </span>
              </h3>
              <p className="text-[11px] text-red-200/90 font-medium">Master Password Required</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-red-300 hover:text-white hover:bg-red-800/60 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          <div className="space-y-1.5">
            <div className="text-sm font-black text-slate-900 font-display flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
              <span>{title}</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {description}
            </p>
          </div>

          <div className="pt-2">
            <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-slate-500" />
                <span>Enter Master Admin Password</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">(Default: admin@imc2026)</span>
            </label>

            <div className="relative">
              <input
                ref={inputRef}
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errorMessage) setErrorMessage("");
                }}
                placeholder="Enter password..."
                className="w-full pl-3.5 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer p-0.5"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {errorMessage && (
              <p className="text-[11px] font-bold text-red-600 mt-1.5 flex items-center gap-1">
                <span>⚠️</span>
                <span>{errorMessage}</span>
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200/80 py-2.5 px-4 rounded-xl shadow-2xs hover:shadow-xs transition-all cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={!password.trim()}
              className="inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white text-xs font-bold py-2.5 px-5 rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-50 cursor-pointer hover:scale-105 active:scale-95"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{actionLabel}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
