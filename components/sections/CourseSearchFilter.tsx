"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { categories, courses } from "@/lib/data";
import { formatINR } from "@/lib/utils";
import { 
  Search, 
  Star, 
  Sparkles, 
  Clock, 
  Award, 
  ArrowRight, 
  CheckCircle2, 
  GraduationCap,
  FileBadge,
  Filter,
  ChevronDown,
  ChevronUp
} from "lucide-react";

import { Course } from "@/types";

interface CourseSearchFilterProps {
  limit?: number;
  isHomePage?: boolean;
}

function CourseSearchFilterContent({ limit = 6, isHomePage = false }: CourseSearchFilterProps) {
  const searchParams = useSearchParams();
  const typeParam = searchParams.get("type");
  const categoryParam = searchParams.get("category");
  const searchParam = searchParams.get("search");

  const [activeTab, setActiveTab] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [allCoursesList, setAllCoursesList] = useState<Course[]>(courses);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("imc_courses_catalog");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setAllCoursesList(parsed);
          }
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (typeParam === "FELLOWSHIP" || typeParam === "fellowship") {
      setActiveTab("fellowships");
    } else if (typeParam === "PG_DIPLOMA" || typeParam === "pg-diploma") {
      setActiveTab("diplomas");
    } else if (typeParam === "ADVANCED_CERTIFICATE" || typeParam === "certificate") {
      setActiveTab("certificates");
    }

    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }

    if (searchParam) {
      setSearchQuery(searchParam);
    }
  }, [typeParam, categoryParam, searchParam]);

  const filteredCourses = allCoursesList
    .filter((course) => course.isPublished !== false) // Only show active/published
    .sort((a, b) => (a.priority || 2) - (b.priority || 2)) // Sort by Priority (1 -> 2 -> 3)
    .filter((course) => {
    // Tab filter
    if (activeTab === "featured" && !course.isFeatured && !course.isPopular) return false;
    if (activeTab === "fellowships" && course.courseType !== "FELLOWSHIP") return false;
    if (activeTab === "diplomas" && course.courseType !== "PG_DIPLOMA") return false;
    if (activeTab === "certificates" && course.courseType !== "ADVANCED_CERTIFICATE") return false;

    // Category filter
    const matchesCategory =
      selectedCategory === "all" ||
      categories.find((c) => c.slug === selectedCategory)?.id === course.categoryId;

    // Search query filter
    const matchesQuery =
      searchQuery === "" ||
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.categoryName.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesQuery;
  });

  // If limit is set (homepage) and not expanded, show max 6
  const displayedCourses = (limit && !isExpanded) ? filteredCourses.slice(0, limit) : filteredCourses;
  const hasMore = limit ? filteredCourses.length > limit : false;

  return (
    <section className="py-16 bg-slate-50/80 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="inline-block text-[#0D9468] font-extrabold text-xs tracking-wider uppercase mb-1">
            Clinical Catalog • CPD Accredited
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight font-display">
            Medical Courses, <span className="text-[#0B4F9C]">Fellowships & PG Diplomas</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2">
            Hands-on hospital clinical attachments across 50+ tertiary networks for MBBS, MD, and specialist practitioners.
          </p>
        </div>

        {/* Filter Controls: Tabs + Search */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          
          {/* Main Filter Tabs (All, Fellowships, PG Diplomas, Certificates) */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            <button
              onClick={() => { setActiveTab("all"); setSelectedCategory("all"); }}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all shadow-xs cursor-pointer ${
                activeTab === "all"
                  ? "bg-[#0B4F9C] text-white shadow-md shadow-blue-900/20"
                  : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              All Courses ({courses.length})
            </button>
            <button
              onClick={() => { setActiveTab("fellowships"); setSelectedCategory("all"); }}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all shadow-xs cursor-pointer ${
                activeTab === "fellowships"
                  ? "bg-[#0B4F9C] text-white shadow-md shadow-blue-900/20"
                  : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              Fellowship Courses
            </button>
            <button
              onClick={() => { setActiveTab("diplomas"); setSelectedCategory("all"); }}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all shadow-xs cursor-pointer ${
                activeTab === "diplomas"
                  ? "bg-[#0D9468] text-white shadow-md shadow-emerald-900/20"
                  : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              PG Diploma Courses
            </button>
            <button
              onClick={() => { setActiveTab("certificates"); setSelectedCategory("all"); }}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all shadow-xs cursor-pointer ${
                activeTab === "certificates"
                  ? "bg-purple-700 text-white shadow-md shadow-purple-900/20"
                  : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              Certificate Courses
            </button>
          </div>

          {/* Search Input Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by specialty, topic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-full focus:outline-hidden focus:border-[#0B4F9C] shadow-xs"
            />
          </div>

        </div>

        {/* Category Pills Slider */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === "all"
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            All Specialties
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.slug
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Dynamic Courses Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Course Image & Badge */}
                <div className="relative h-48 bg-slate-100 overflow-hidden">
                  <img
                    src={course.heroImage}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className={`text-[10px] font-black px-2.5 py-1 rounded-full text-white shadow ${
                      course.courseType === "FELLOWSHIP" ? "bg-[#0B4F9C]" :
                      course.courseType === "PG_DIPLOMA" ? "bg-[#0D9468]" : "bg-purple-700"
                    }`}>
                      {course.courseType.replace("_", " ")}
                    </span>
                  </div>

                  <span className="absolute bottom-3 right-3 bg-slate-950/80 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-0.5 rounded-lg flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-400" />
                    <span>{course.duration}</span>
                  </span>
                </div>

                {/* Content */}
                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-extrabold text-blue-700">
                      {course.categoryName}
                    </span>
                    <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{course.ratingVal}</span>
                      <span className="text-slate-400 font-normal">({course.totalEnrolled})</span>
                    </div>
                  </div>

                  <h3 className="text-base font-black text-slate-900 group-hover:text-[#0B4F9C] transition-colors leading-snug font-display">
                    {course.title}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {course.tagline}
                  </p>

                  <div className="pt-2 flex flex-wrap gap-1.5">
                    {(course.skillsCovered || []).slice(0, 3).map((skill: string, idx: number) => (
                      <span
                        key={idx}
                        className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded"
                      >
                        ✓ {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer: Fees & View Button */}
              <div className="p-5 pt-3 bg-slate-50/60 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Tuition & EMI</div>
                  <div className="text-sm font-black text-slate-900">
                    {formatINR(course.feeINR)}
                  </div>
                  <div className="text-[10px] text-emerald-700 font-extrabold">
                    0% EMI from {formatINR(course.emiStartingINR)}/mo
                  </div>
                </div>

                <Link
                  href={`/courses/${course.slug}`}
                  className="inline-flex items-center gap-1 bg-[#0B4F9C] hover:bg-[#083E7D] text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-xs transition-all group-hover:scale-105"
                >
                  <span>Syllabus & Apply</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Show More / View Full Catalog Action Bar */}
        {hasMore && (
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 text-xs sm:text-sm font-black py-3 px-6 rounded-2xl shadow-xs transition-all cursor-pointer"
            >
              {isExpanded ? (
                <>
                  <span>Show Less (Show Top 6)</span>
                  <ChevronUp className="w-4 h-4 text-slate-500" />
                </>
              ) : (
                <>
                  <span>Show More Courses (+{filteredCourses.length - limit} Programs)</span>
                  <ChevronDown className="w-4 h-4 text-blue-600" />
                </>
              )}
            </button>

            <Link
              href="/courses"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#0B4F9C] hover:bg-[#083E7D] text-white text-xs sm:text-sm font-black py-3 px-6 rounded-2xl shadow-md shadow-blue-900/20 transition-all hover:scale-105"
            >
              <span>Explore All 150+ Course Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {filteredCourses.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8">
            <Filter className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h4 className="text-base font-bold text-slate-800">No programs found</h4>
            <p className="text-xs text-slate-500 mt-1">
              Try adjusting your specialty or course format filter to see available programs.
            </p>
          </div>
        )}

      </div>
    </section>
  );
}

export function CourseSearchFilter({ limit, isHomePage }: CourseSearchFilterProps) {
  return (
    <Suspense fallback={<div className="py-20 text-center text-xs font-bold text-slate-400">Loading Medical Catalog...</div>}>
      <CourseSearchFilterContent limit={limit} isHomePage={isHomePage} />
    </Suspense>
  );
}
