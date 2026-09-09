import React from "react";
import { courseRepository } from "@/features/courses/courseRepository";
import { courses as fallbackCourses } from "@/lib/data";
import { CourseDetailView } from "@/components/courses/CourseDetailView";
import type { Metadata } from "next";

/**
 * Dynamic course detail page — fetches from DB at request time.
 * Falls back to lib/data.ts if DB is unavailable.
 */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  let course: any = null;
  try {
    course = await courseRepository.getCourseBySlug(slug);
  } catch {
    course = fallbackCourses.find((c) => c.slug === slug);
  }

  if (!course) {
    const formattedTitle = slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
    return {
      title: `${formattedTitle} - 2026 Batch Admissions | Indian Medical Course`,
      description: `Enroll in ${formattedTitle} with accredited hospital training and bedside clinical rotations.`,
    };
  }

  return {
    title: `${course.title} - 2026 Batch Admissions | Indian Medical Course`,
    description: course.tagline,
  };
}

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let course: any = null;
  try {
    const dbCourse = await courseRepository.getCourseBySlug(slug);
    if (dbCourse) {
      const fallback = fallbackCourses.find((c) => c.slug === slug);

      let formattedBatchDate = "1st of Next Month";
      if ((dbCourse as any).nextBatchDate) {
        if ((dbCourse as any).nextBatchDate instanceof Date) {
          formattedBatchDate = (dbCourse as any).nextBatchDate.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          });
        } else {
          formattedBatchDate = String((dbCourse as any).nextBatchDate);
        }
      } else if (fallback?.nextBatchDate) {
        formattedBatchDate = fallback.nextBatchDate;
      }

      // Transform DB course to match frontend expected shape
      course = {
        ...fallback,
        ...dbCourse,
        nextBatchDate: formattedBatchDate,
        heroImage: (dbCourse as any).heroImageMedia?.storagePath || (dbCourse as any).heroImage || fallback?.heroImage || "",
        categoryName: (dbCourse as any).category?.name || fallback?.categoryName || "",
        curriculum: (dbCourse as any).curriculumJson || fallback?.curriculum || [],
        skillsCovered: (dbCourse as any).skillsCoveredJson || fallback?.skillsCovered || [],
        careerOpportunities: (dbCourse as any).careerScopeJson || fallback?.careerOpportunities || [],
        clinicalHospitals: (dbCourse as any).clinicalHospitalsText
          ? (dbCourse as any).clinicalHospitalsText.split(", ").filter(Boolean)
          : (fallback?.clinicalHospitals || []),
        faqs: (dbCourse as any).faqs && (dbCourse as any).faqs.length > 0
          ? (dbCourse as any).faqs.map((f: any) => ({ question: f.question, answer: f.answer }))
          : (fallback?.faqs || []),
        feeINR: Number((dbCourse as any).feeINR) || fallback?.feeINR || 0,
        feeUSD: Number((dbCourse as any).feeUSD) || fallback?.feeUSD || 0,
        emiStartingINR: Number((dbCourse as any).emiStartingINR) || 0,
        ratingVal: Number((dbCourse as any).ratingVal) || fallback?.ratingVal || 4.9,
        createdAt: (dbCourse as any).createdAt instanceof Date ? (dbCourse as any).createdAt.toISOString() : String((dbCourse as any).createdAt || ""),
        updatedAt: (dbCourse as any).updatedAt instanceof Date ? (dbCourse as any).updatedAt.toISOString() : String((dbCourse as any).updatedAt || ""),
      };
    }
  } catch (err) {
    console.error("DB fetch failed, using fallback:", err);
  }

  // Fallback to hardcoded data
  if (!course) {
    course = fallbackCourses.find((c) => c.slug === slug) || null;
  }

  return <CourseDetailView initialCourse={course} slug={slug} />;
}
