import React from "react";
import { courses } from "@/lib/data";
import { CourseDetailView } from "@/components/courses/CourseDetailView";
import type { Metadata } from "next";

export const dynamicParams = false;

export async function generateStaticParams() {
  return courses.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const course = courses.find((c) => c.slug === slug);
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
  const course = courses.find((c) => c.slug === slug) || null;

  return <CourseDetailView initialCourse={course} slug={slug} />;
}
