"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { siteSettings } from "@/lib/data";
import { MegaMenu } from "./MegaMenu";
import { 
  ChevronDown, 
  Menu as MenuIcon, 
  X, 
  ShieldCheck, 
  Sparkles,
  GraduationCap,
  MessageCircle,
  Search,
  ArrowRight,
  Lock
} from "lucide-react";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header 
      className={`sticky top-0 z-50 w-full transition-all duration-200 ${
        isScrolled ? "glass-nav shadow-md py-2.5" : "bg-white/95 backdrop-blur-md border-b border-slate-100 py-3"
      }`}
      onMouseLeave={() => setIsMegaMenuOpen(false)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
        
        {/* Official Brand Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0 group">
          <img
            src="/images/imc-logo.png"
            alt="IMC - Indian Medical Course"
            className="h-14 sm:h-16 w-auto object-contain transition-transform group-hover:scale-105"
          />
        </Link>

        {/* Desktop Single-Line Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-slate-700">
          
          {/* Courses with Mega Menu Trigger */}
          <div 
            className="inline-block"
            onMouseEnter={() => setIsMegaMenuOpen(true)}
          >
            <Link
              href="/courses"
              className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs xl:text-sm font-extrabold rounded-xl transition-all whitespace-nowrap ${
                isMegaMenuOpen ? "text-[#0B4F9C] bg-blue-50/80 shadow-xs" : "text-slate-800 hover:text-blue-700 hover:bg-slate-50"
              }`}
            >
              <span>All Courses</span>
              <span className="bg-blue-100 text-blue-800 text-[10px] font-black px-1.5 py-0.2 rounded-full">
                150+
              </span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isMegaMenuOpen ? "rotate-180 text-blue-600" : ""}`} />
            </Link>
          </div>

          <Link
            href="/admission-process"
            className="px-3 py-2 text-xs xl:text-sm font-bold text-slate-700 hover:text-blue-700 hover:bg-slate-50 rounded-xl transition-colors whitespace-nowrap"
          >
            Admissions
          </Link>

          <Link
            href="/success-stories"
            className="px-3 py-2 text-xs xl:text-sm font-bold text-slate-700 hover:text-blue-700 hover:bg-slate-50 rounded-xl transition-colors whitespace-nowrap"
          >
            Success Stories
          </Link>

          <Link
            href="/scholarship"
            className="inline-flex items-center gap-1 px-3 py-2 text-xs xl:text-sm font-bold text-amber-800 hover:text-amber-900 hover:bg-amber-50/80 rounded-xl transition-colors whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Scholarships</span>
          </Link>

          <Link
            href="/blogs"
            className="px-3 py-2 text-xs xl:text-sm font-bold text-slate-700 hover:text-blue-700 hover:bg-slate-50 rounded-xl transition-colors whitespace-nowrap"
          >
            Blogs
          </Link>

          <Link
            href="/contact"
            className="px-3 py-2 text-xs xl:text-sm font-bold text-slate-700 hover:text-blue-700 hover:bg-slate-50 rounded-xl transition-colors whitespace-nowrap"
          >
            Contact
          </Link>
        </nav>

        {/* Right Action Conversion CTA Button & Admin Login */}
        <div className="hidden sm:flex items-center gap-2.5 shrink-0">
          <Link
            href="/admin/login"
            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
            title="Admin Login"
          >
            <Lock className="w-4 h-4" />
          </Link>
          <Link
            href="/book-counselling"
            className="inline-flex items-center justify-center gap-1.5 bg-gradient-to-r from-[#0B4F9C] via-[#0D5EB9] to-[#0D9468] hover:from-[#083E7D] hover:to-[#0A7854] text-white text-xs sm:text-sm font-black py-2.5 px-4 sm:px-5 rounded-xl shadow-md shadow-blue-900/15 hover:shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap"
          >
            <span>Book Free Counselling</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex items-center gap-2 lg:hidden">
          <Link
            href="/book-counselling"
            className="inline-flex items-center justify-center bg-[#0B4F9C] text-white text-xs font-bold py-2 px-3 rounded-xl sm:hidden whitespace-nowrap"
          >
            Counselling
          </Link>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-slate-700 hover:text-blue-700 hover:bg-slate-100 rounded-xl transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Full-Width Header-Level Mega Menu Dropdown */}
      <MegaMenu isOpen={isMegaMenuOpen} onClose={() => setIsMegaMenuOpen(false)} />

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-3 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 gap-1">
            <Link
              href="/courses"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2.5 text-sm font-bold text-slate-800 hover:bg-slate-50 rounded-xl flex items-center justify-between"
            >
              <span>Explore All Courses</span>
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full font-bold">150+</span>
            </Link>
            <Link
              href="/admission-process"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-xl"
            >
              Admission Process
            </Link>
            <Link
              href="/success-stories"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-xl"
            >
              Success Stories
            </Link>
            <Link
              href="/scholarship"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2 text-sm font-semibold text-amber-700 hover:bg-amber-50 rounded-xl flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Scholarship Test</span>
            </Link>
            <Link
              href="/blogs"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-xl"
            >
              Medical Blogs & Articles
            </Link>
            <Link
              href="/contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-xl"
            >
              Contact Us
            </Link>
            <div className="my-1 border-t border-slate-100"></div>
            <Link
              href="/admin/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50 rounded-xl flex items-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>Admin Login</span>
            </Link>
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <a
              href={`tel:${siteSettings.hotlinePhone.replace(/\s+/g, "")}`}
              className="flex items-center justify-center gap-2 py-2.5 text-xs font-bold text-slate-700 bg-slate-50 rounded-xl"
            >
              <span>Helpline: {siteSettings.hotlinePhone}</span>
            </a>
            <Link
              href="/book-counselling"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-center py-3 text-xs font-bold text-white bg-[#0B4F9C] rounded-xl shadow-md"
            >
              Book Free Expert Counselling
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
