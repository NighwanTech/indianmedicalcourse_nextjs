import React from "react";
import Link from "next/link";
import { siteSettings, categories, courses } from "@/lib/data";
import { 
  GraduationCap, 
  MapPin, 
  Phone, 
  Mail, 
  ShieldCheck, 
  Award, 
  CheckCircle2, 
  ArrowUpRight,
  Headphones,
  CreditCard
} from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Top Grid: Brand, Links, Contact */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          
          {/* Col 1 & 2: Brand & Accreditation */}
          <div className="lg:col-span-2 space-y-5">
            {/* Brand Official Logo */}
            <Link href="/" className="inline-flex items-center group">
              <div className="bg-white px-3 py-1.5 rounded-xl shadow-md transition-transform group-hover:scale-105">
                <img
                  src="/images/imc-logo.png"
                  alt="IMC - Indian Medical Course"
                  className="h-8 sm:h-9 w-auto object-contain"
                />
              </div>
            </Link>

            <p className="text-xs text-slate-400 leading-relaxed pr-6">
              Indian Medical Course is India&apos;s leading platform providing hybrid post-graduate clinical fellowships, advanced diplomas, and hospital bedside attachments for practicing doctors, surgeons, and healthcare professionals.
            </p>

            {/* Accreditation Badges */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-white">CPD Standards</div>
                  <div className="text-[10px] text-slate-400">International Quality</div>
                </div>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                <Award className="w-5 h-5 text-blue-400 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-white">50+ Hospitals</div>
                  <div className="text-[10px] text-slate-400">Clinical Rotations</div>
                </div>
              </div>
            </div>

            {/* Contact Details */}
            <div className="space-y-2 pt-2 text-xs">
              <div className="flex items-start gap-2.5 text-slate-300">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{siteSettings.registeredAddress}</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-300">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href={`tel:${siteSettings.hotlinePhone.replace(/\s+/g, "")}`} className="hover:text-emerald-300 transition-colors font-semibold">
                  {siteSettings.hotlinePhone}
                </a>
              </div>
              <div className="flex items-center gap-2.5 text-slate-300">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href={`mailto:${siteSettings.supportEmail}`} className="hover:text-emerald-300 transition-colors">
                  {siteSettings.supportEmail}
                </a>
              </div>
            </div>
          </div>

          {/* Col 3: Clinical Specialties */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              Specialties
            </h4>
            <ul className="space-y-2.5 text-xs">
              {categories.slice(0, 6).map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/courses?category=${cat.slug}`}
                    className="text-slate-400 hover:text-white transition-colors flex items-center justify-between group"
                  >
                    <span>{cat.name}</span>
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-emerald-400" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Top Fellowships */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Top Fellowships
            </h4>
            <ul className="space-y-2.5 text-xs">
              {courses.slice(0, 5).map((course) => (
                <li key={course.id}>
                  <Link
                    href={`/courses/${course.slug}`}
                    className="text-slate-400 hover:text-white transition-colors block truncate"
                  >
                    {course.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 5: Quick Links & Admissions */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
              Admissions & Info
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/admission-process" className="text-slate-400 hover:text-white transition-colors">
                  Admission Process 2026
                </Link>
              </li>
              <li>
                <Link href="/placement-partners" className="text-slate-400 hover:text-white transition-colors">
                  Hospital Partners Network
                </Link>
              </li>
              <li>
                <Link href="/scholarship" className="text-amber-400 hover:text-amber-300 font-medium transition-colors">
                  Scholarship & 0% EMI
                </Link>
              </li>
              <li>
                <Link href="/success-stories" className="text-slate-400 hover:text-white transition-colors">
                  Doctor Success Stories
                </Link>
              </li>
              <li>
                <Link href="/faculty" className="text-slate-400 hover:text-white transition-colors">
                  Faculty & Mentors
                </Link>
              </li>
              <li>
                <Link href="/fellowship-guide" className="text-emerald-400 hover:text-emerald-300 font-bold transition-colors">
                  Fellowship & Eligibility Guide
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-slate-400 hover:text-white transition-colors">
                  Contact & Support
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* 4 Bottom Feature Badges (From reference screenshot) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 py-8 border-b border-slate-800">
          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">24/7 Doctor Helpline</div>
              <div className="text-[10px] text-slate-400">Admissions & Support</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Certified Mentors</div>
              <div className="text-[10px] text-slate-400">DM / MCh / FACC Faculty</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">0% Interest EMI</div>
              <div className="text-[10px] text-slate-400">Flexible Installments</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-bold text-white">Connect With Us</div>
              <div className="text-[10px] text-slate-400 font-semibold">@IndianMedicalCourse</div>
            </div>
            <div className="flex items-center gap-2 pt-1">
              {/* Facebook */}
              <a
                href={siteSettings.facebookUrl || "https://facebook.com"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-7 h-7 sm:w-7.5 sm:h-7.5 rounded-full bg-[#1877F2] hover:scale-110 active:scale-95 text-white flex items-center justify-center transition-all shadow-md shadow-blue-900/30 cursor-pointer shrink-0"
                aria-label="Facebook"
              >
                <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>

              {/* Instagram */}
              <a
                href={siteSettings.instagramUrl || "https://instagram.com"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-7 h-7 sm:w-7.5 sm:h-7.5 rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] hover:scale-110 active:scale-95 text-white flex items-center justify-center transition-all shadow-md shadow-pink-900/30 cursor-pointer shrink-0"
                aria-label="Instagram"
              >
                <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>

              {/* WhatsApp */}
              <a
                href={`https://wa.me/${siteSettings.whatsappNumber.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-7 h-7 sm:w-7.5 sm:h-7.5 rounded-full bg-[#25D366] hover:scale-110 active:scale-95 text-white flex items-center justify-center transition-all shadow-md shadow-emerald-900/30 cursor-pointer shrink-0"
                aria-label="WhatsApp"
              >
                <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
              </a>

              {/* LinkedIn */}
              <a
                href={siteSettings.linkedinUrl || "https://linkedin.com"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-7 h-7 sm:w-7.5 sm:h-7.5 rounded-full bg-[#0A66C2] hover:scale-110 active:scale-95 text-white flex items-center justify-center transition-all shadow-md shadow-blue-900/30 cursor-pointer shrink-0"
                aria-label="LinkedIn"
              >
                <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>

              {/* YouTube */}
              <a
                href={siteSettings.youtubeUrl || "https://youtube.com"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-7 h-7 sm:w-7.5 sm:h-7.5 rounded-full bg-[#FF0000] hover:scale-110 active:scale-95 text-white flex items-center justify-center transition-all shadow-md shadow-red-900/30 cursor-pointer shrink-0"
                aria-label="YouTube"
              >
                <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Legal & Medical Practice Disclaimer */}
        <div className="py-6 border-b border-slate-800/80 text-[11px] text-slate-500 leading-relaxed">
          <p>
            <strong className="text-slate-400">Disclaimer:</strong> Indian Medical Course (IMC) is an independent private medical education provider offering skill enhancement, clinical fellowships, and post-graduate diploma programs for qualified medical professionals under international CPD standards. These courses are designed for professional development and skills upgradation. For official government registrations, NMC regulations, or NEET counseling, refer to the National Medical Commission (NMC).
          </p>
        </div>

        {/* Bottom Bar: Copyright & Policies */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-1">
            <span>© {new Date().getFullYear()} Indian Medical Course. All Rights Reserved.</span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/privacy-policy" className="hover:text-slate-300 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-slate-300 transition-colors">
              Terms & Conditions
            </Link>
            <Link href="/refund-policy" className="hover:text-slate-300 transition-colors">
              Refund Policy
            </Link>
            <Link href="/admin/login" className="text-slate-600 hover:text-slate-400 transition-colors">
              Faculty / Admin Login
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
