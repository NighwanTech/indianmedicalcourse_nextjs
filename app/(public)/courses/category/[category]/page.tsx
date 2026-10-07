import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { courses as defaultCourses, categories, siteSettings } from "@/lib/data";
import { CourseSearchFilter } from "@/components/sections/CourseSearchFilter";
import { HospitalPartnersMarquee } from "@/components/sections/HospitalPartnersMarquee";
import { FinalCtaBanner } from "@/components/sections/FinalCtaBanner";
import { UniversalAdmissionForm } from "@/components/forms/UniversalAdmissionForm";
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  GraduationCap, 
  Clock, 
  Award, 
  Building2,
  ChevronRight,
  ShieldCheck,
  Star
} from "lucide-react";
import type { Metadata } from "next";
import type { Category } from "@/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const catObj = (categories as Category[]).find(
    (c: Category) => c.slug.toLowerCase() === category.toLowerCase()
  );

  const titleName = catObj ? catObj.name : category.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

  return {
    title: `${titleName} Fellowships & PG Diplomas (2026 Batch) | Indian Medical Course`,
    description: catObj?.description || `Explore accredited medical fellowships and certification programs in ${titleName}. Hospital rotations and expert faculty.`,
  };
}

export default async function CategoryCoursesPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;

  const catObj = (categories as Category[]).find(
    (c: Category) => c.slug.toLowerCase() === category.toLowerCase()
  );

  const categoryName = catObj?.name || category.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

  // Filter courses by category slug or category name match
  const filteredCourses = defaultCourses.filter((course) => {
    if (catObj && course.categoryId === catObj.id) return true;
    const catLower = category.toLowerCase();
    const courseCatLower = (course.categoryName || "").toLowerCase();
    const courseSlugLower = (course.slug || "").toLowerCase();
    return courseCatLower.includes(catLower) || courseSlugLower.includes(catLower);
  });

  const displayCourses = filteredCourses.length > 0 ? filteredCourses : defaultCourses.slice(0, 4);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Breadcrumb Header */}
      <div className="bg-white border-b border-slate-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center text-xs font-semibold text-slate-500 gap-2">
          <Link href="/" className="hover:text-blue-700">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link href="/courses" className="hover:text-blue-700">Courses</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-[#0B4F9C] font-bold">{categoryName}</span>
        </div>
      </div>

      {/* Category Hero Banner */}
      <section className="bg-gradient-to-br from-[#041B38] via-[#072F60] to-[#0B4F9C] text-white py-12 sm:py-16 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                <span>ADMISSIONS OPEN • 2026 BATCH</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-display tracking-tight leading-tight mb-4">
                {categoryName} Programs
              </h1>
              <p className="text-blue-100 text-sm sm:text-base leading-relaxed max-w-2xl mb-6">
                {catObj?.description || `Master high-yield clinical skills, procedural training, and bedside patient management across leading corporate hospital networks.`}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3 border border-white/10">
                  <div className="text-lg font-black text-amber-400 font-display">100% Hospital</div>
                  <div className="text-[11px] text-blue-200">Bedside Training</div>
                </div>
                <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3 border border-white/10">
                  <div className="text-lg font-black text-emerald-400 font-display">CPD UK</div>
                  <div className="text-[11px] text-blue-200">Accredited Diploma</div>
                </div>
                <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3 border border-white/10 col-span-2 sm:col-span-1">
                  <div className="text-lg font-black text-blue-300 font-display">Zero NEET PG</div>
                  <div className="text-[11px] text-blue-200">Direct Doctor Admission</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="bg-white text-slate-900 rounded-2xl p-6 shadow-2xl border border-blue-100">
                <h3 className="text-lg font-black font-display text-slate-900 mb-1">
                  Express Batch Enquiry
                </h3>
                <p className="text-xs text-slate-500 mb-4">
                  Check eligibility & seat availability for upcoming {categoryName} batches.
                </p>
                <UniversalAdmissionForm 
                  initialCourseName={displayCourses[0]?.title || categoryName}
                  title=""
                  subtitle=""
                  buttonText="Check Eligibility & Fees"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Courses List Section */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black font-display text-slate-900">
                Available {categoryName} Fellowships & Diplomas
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Select your preferred sub-specialty to view full clinical curriculum, fees, and hospital rotations.
              </p>
            </div>
            <Link
              href="/courses"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0B4F9C] hover:underline"
            >
              Browse all medical specialties <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayCourses.map((c) => (
              <div
                key={c.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden group"
              >
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-black uppercase tracking-wider bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full border border-blue-100">
                      {c.courseType || "FELLOWSHIP"}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      {c.ratingVal || 4.9}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold font-display text-slate-900 group-hover:text-[#0B4F9C] transition-colors leading-snug mb-2">
                    {c.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed">
                    {c.tagline}
                  </p>

                  <div className="mt-auto space-y-2 border-t border-slate-100 pt-4 text-xs text-slate-600">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 text-slate-500">
                        <Clock className="w-3.5 h-3.5 text-slate-400" /> Duration
                      </span>
                      <span className="font-semibold text-slate-800">{c.duration}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 text-slate-500">
                        <Award className="w-3.5 h-3.5 text-slate-400" /> Eligibility
                      </span>
                      <span className="font-semibold text-slate-800 truncate max-w-[170px]" title={c.eligibility}>
                        {c.eligibility}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Tuition Fee</span>
                    <span className="text-base font-black text-slate-900 font-display">
                      ₹{c.feeINR?.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <Link
                    href={`/courses/${c.slug}`}
                    className="inline-flex items-center gap-1 bg-[#0B4F9C] hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors shadow-xs"
                  >
                    View Course <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <HospitalPartnersMarquee />
      <FinalCtaBanner />
    </div>
  );
}
