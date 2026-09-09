import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { courses as fallbackCourses } from "@/lib/data";

export const dynamic = "force-dynamic";

/**
 * GET /api/courses/by-slug/[slug]
 * Get a single course by its URL slug — used by public course detail pages
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const course = await prisma.course.findUnique({
      where: { slug },
      include: {
        category: true,
        heroImageMedia: { select: { id: true, storagePath: true, altText: true } },
        bannerMedia: { select: { id: true, storagePath: true } },
        brochureMedia: { select: { id: true, storagePath: true, originalName: true } },
        facultyMembers: {
          include: {
            faculty: {
              include: {
                photoMedia: { select: { storagePath: true } },
              },
            },
          },
        },
        faqs: { where: { isActive: true }, orderBy: { displayOrder: "asc" } },
        galleryImages: { include: { media: true }, orderBy: { displayOrder: "asc" } },
        downloads: { include: { media: true }, orderBy: { displayOrder: "asc" } },
      },
    });

    if (course) {
      const transformed = {
        id: course.id,
        slug: course.slug,
        title: course.title,
        tagline: course.tagline,
        courseType: course.courseType,
        categoryName: course.category.name,
        categorySlug: course.category.slug,
        duration: course.duration,
        clinicalHours: course.clinicalHours,
        deliveryMode: course.deliveryMode,
        feeINR: course.feeINR ? Number(course.feeINR) : 0,
        feeUSD: course.feeUSD ? Number(course.feeUSD) : 0,
        emiStartingINR: course.emiStartingINR ? Number(course.emiStartingINR) : 0,
        eligibility: course.eligibility,
        heroImage: course.heroImageMedia?.storagePath || "",
        overviewHtml: course.overviewHtml || "",
        curriculum: course.curriculumJson || [],
        skillsCovered: course.skillsCoveredJson || [],
        careerScope: course.careerScopeJson || [],
        clinicalHospitals: course.clinicalHospitalsText || "",
        placementSupport: course.placementSupportText || "",
        nextBatchDate: course.nextBatchDate instanceof Date ? course.nextBatchDate.toISOString().split("T")[0] : (course.nextBatchDate ? String(course.nextBatchDate) : "2026-09-15"),
        totalEnrolled: course.totalEnrolled,
        ratingVal: Number(course.ratingVal),
        ratingCount: course.ratingCount,
        isFeatured: course.isFeatured,
        isPopular: course.isPopular,
        isAdmissionOpen: course.isAdmissionOpen,
        faqs: course.faqs.map((f) => ({ question: f.question, answer: f.answer })),
        faculty: course.facultyMembers.map((cf) => ({
          name: cf.faculty.name,
          designation: cf.faculty.designation,
          qualifications: cf.faculty.qualifications,
          hospital: cf.faculty.hospitalAffiliation,
          photo: cf.faculty.photoMedia?.storagePath || "",
          roleInCourse: cf.roleInCourse,
        })),
        gallery: course.galleryImages.map((gi) => ({
          url: gi.media.storagePath,
          caption: gi.caption,
        })),
        downloads: course.downloads.map((d) => ({
          title: d.title,
          url: d.media.storagePath,
          description: d.description,
        })),
        metaTitle: course.metaTitle,
        metaDescription: course.metaDescription,
        createdAt: course.createdAt ? course.createdAt.toISOString() : undefined,
        updatedAt: course.updatedAt ? course.updatedAt.toISOString() : undefined,
      };

      return NextResponse.json({ course: transformed, source: "database" });
    }

    // Fallback
    const fallback = fallbackCourses.find((c) => c.slug === slug);
    if (fallback) {
      return NextResponse.json({ course: fallback, source: "fallback" });
    }

    return NextResponse.json({ error: "Course not found" }, { status: 404 });
  } catch (error) {
    console.error("GET /api/courses/by-slug error:", error);
    try {
      const resolvedParams = await params;
      const fallback = fallbackCourses.find((c) => c.slug === resolvedParams.slug);
      if (fallback) {
        return NextResponse.json({ course: fallback, source: "fallback" });
      }
    } catch {
      // Ignore param resolve error
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
