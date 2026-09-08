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
      // Transform DB course to match frontend expected shape
      course = {
        ...dbCourse,
        heroImage: (dbCourse as any).heroImageMedia?.storagePath || (dbCourse as any).heroImage || "",
        categoryName: (dbCourse as any).category?.name || "",
        curriculum: (dbCourse as any).curriculumJson || [],
        skillsCovered: (dbCourse as any).skillsCoveredJson || [],
        careerOpportunities: (dbCourse as any).careerScopeJson || [],
        clinicalHospitals: (dbCourse as any).clinicalHospitalsText
          ? (dbCourse as any).clinicalHospitalsText.split(", ").filter(Boolean)
          : [],
        faqs: (dbCourse as any).faqs?.map((f: any) => ({ question: f.question, answer: f.answer })) || [],
        feeINR: Number((dbCourse as any).feeINR) || 0,
        feeUSD: Number((dbCourse as any).feeUSD) || 0,
        ratingVal: Number((dbCourse as any).ratingVal) || 4.9,
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
