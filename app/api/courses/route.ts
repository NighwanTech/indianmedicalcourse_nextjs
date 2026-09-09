import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { courses as fallbackCourses } from "@/lib/data";

export const dynamic = "force-dynamic";

/**
 * GET /api/courses
 * List all active courses with optional filters
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const courseType = searchParams.get("courseType") || "";

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = { isActive: true };

    if (category) {
      where.category = { slug: category };
    }
    if (courseType) {
      where.courseType = courseType;
    }
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { tagline: { contains: search } },
        { slug: { contains: search } },
      ];
    }

    const courses = await prisma.course.findMany({
      where,
      include: {
        category: true,
        heroImageMedia: { select: { id: true, storagePath: true, altText: true } },
        bannerMedia: { select: { id: true, storagePath: true } },
        facultyMembers: { include: { faculty: true } },
        faqs: { where: { isActive: true }, orderBy: { displayOrder: "asc" } },
      },
      orderBy: { totalEnrolled: "desc" },
    });

    if (courses.length > 0) {
      // Transform for frontend consumption
      const transformed = courses.map((c) => ({
        id: c.id,
        slug: c.slug,
        title: c.title,
        tagline: c.tagline,
        courseType: c.courseType,
        categoryName: c.category.name,
        categorySlug: c.category.slug,
        duration: c.duration,
        clinicalHours: c.clinicalHours,
        feeINR: c.feeINR ? Number(c.feeINR) : 0,
        feeUSD: c.feeUSD ? Number(c.feeUSD) : 0,
        emiStartingINR: c.emiStartingINR ? Number(c.emiStartingINR) : 0,
        eligibility: c.eligibility,
        heroImage: c.heroImageMedia?.storagePath || "",
        heroImageMediaId: c.heroImageMediaId,
        curriculum: c.curriculumJson || [],
        skillsCovered: c.skillsCoveredJson || [],
        careerScope: c.careerScopeJson || [],
        clinicalHospitals: c.clinicalHospitalsText || "",
        placementSupport: c.placementSupportText || "",
        overviewHtml: c.overviewHtml || "",
        nextBatchDate: c.nextBatchDate instanceof Date ? c.nextBatchDate.toISOString().split("T")[0] : (c.nextBatchDate ? String(c.nextBatchDate) : "2026-09-15"),
        totalEnrolled: c.totalEnrolled,
        ratingVal: Number(c.ratingVal),
        ratingCount: c.ratingCount,
        isFeatured: c.isFeatured,
        isPopular: c.isPopular,
        isAdmissionOpen: c.isAdmissionOpen,
        deliveryMode: c.deliveryMode,
        faqs: c.faqs.map((f) => ({ question: f.question, answer: f.answer })),
        metaTitle: c.metaTitle,
        metaDescription: c.metaDescription,
        createdAt: c.createdAt ? c.createdAt.toISOString() : undefined,
        updatedAt: c.updatedAt ? c.updatedAt.toISOString() : undefined,
      }));

      return NextResponse.json({ courses: transformed, source: "database" });
    }

    // Fallback to hardcoded data
    return NextResponse.json({ courses: fallbackCourses, source: "fallback" });
  } catch (error) {
    console.error("GET /api/courses error:", error);
    // Return fallback data on DB error
    return NextResponse.json({ courses: fallbackCourses, source: "fallback" });
  }
}

/**
 * POST /api/courses
 * Create a new course
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Resolve or create category
    let categoryId = body.categoryId;
    if (!categoryId && body.categoryName) {
      const categorySlug = body.categoryName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      
      const existing = await prisma.category.findUnique({ where: { slug: categorySlug } });
      if (existing) {
        categoryId = existing.id;
      } else {
        const created = await prisma.category.create({
          data: { slug: categorySlug, name: body.categoryName },
        });
        categoryId = created.id;
      }
    }

    const course = await prisma.course.create({
      data: {
        categoryId,
        slug: body.slug,
        title: body.title,
        tagline: body.tagline || null,
        courseType: body.courseType || "FELLOWSHIP",
        deliveryMode: body.deliveryMode || "HYBRID_CLINICAL",
        duration: body.duration || "12 Months",
        clinicalHours: body.clinicalHours || 0,
        eligibility: body.eligibility || "MBBS / MD / DNB",
        feeINR: body.feeINR || null,
        feeUSD: body.feeUSD || null,
        emiStartingINR: body.emiStartingINR || null,
        heroImageMediaId: body.heroImageMediaId || null,
        curriculumJson: body.curriculum || null,
        skillsCoveredJson: body.skillsCovered || null,
        careerScopeJson: body.careerScope || null,
        clinicalHospitalsText: body.clinicalHospitals || null,
        placementSupportText: body.placementSupport || null,
        overviewHtml: body.overviewHtml || null,
        totalEnrolled: body.totalEnrolled || 0,
        ratingVal: body.ratingVal || 4.9,
        ratingCount: body.ratingCount || 120,
        isFeatured: body.isFeatured || false,
        isPopular: body.isPopular || false,
        isAdmissionOpen: body.isAdmissionOpen !== false,
        metaTitle: body.metaTitle || null,
        metaDescription: body.metaDescription || null,
      },
      include: { category: true },
    });

    return NextResponse.json({ success: true, course }, { status: 201 });
  } catch (error) {
    console.error("POST /api/courses error:", error);
    return NextResponse.json(
      { error: "Failed to create course", details: String(error) },
      { status: 500 }
    );
  }
}
