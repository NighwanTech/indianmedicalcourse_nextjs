import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * GET /api/courses/[id]
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const courseId = parseInt(id, 10);
    if (isNaN(courseId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        category: true,
        heroImageMedia: true,
        bannerMedia: true,
        facultyMembers: { include: { faculty: true } },
        faqs: { where: { isActive: true } },
        galleryImages: { include: { media: true } },
        downloads: { include: { media: true } },
      },
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    return NextResponse.json({ course });
  } catch (error) {
    console.error("GET /api/courses/[id] error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

/**
 * PUT /api/courses/[id]
 * Update a course
 */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const courseId = parseInt(id, 10);
    if (isNaN(courseId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const body = await request.json();

    // Resolve category if name changed
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

    // Build update data — only include fields that were sent
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = {};
    if (categoryId) updateData.categoryId = categoryId;
    if (body.slug !== undefined) updateData.slug = body.slug;
    if (body.title !== undefined) updateData.title = body.title;
    if (body.tagline !== undefined) updateData.tagline = body.tagline;
    if (body.courseType !== undefined) updateData.courseType = body.courseType;
    if (body.deliveryMode !== undefined) updateData.deliveryMode = body.deliveryMode;
    if (body.duration !== undefined) updateData.duration = body.duration;
    if (body.clinicalHours !== undefined) updateData.clinicalHours = body.clinicalHours;
    if (body.eligibility !== undefined) updateData.eligibility = body.eligibility;
    if (body.feeINR !== undefined) updateData.feeINR = body.feeINR;
    if (body.feeUSD !== undefined) updateData.feeUSD = body.feeUSD;
    if (body.emiStartingINR !== undefined) updateData.emiStartingINR = body.emiStartingINR;
    if (body.heroImageMediaId !== undefined) updateData.heroImageMediaId = body.heroImageMediaId;
    if (body.curriculum !== undefined) updateData.curriculumJson = body.curriculum;
    if (body.skillsCovered !== undefined) updateData.skillsCoveredJson = body.skillsCovered;
    if (body.careerScope !== undefined) updateData.careerScopeJson = body.careerScope;
    if (body.clinicalHospitals !== undefined) updateData.clinicalHospitalsText = body.clinicalHospitals;
    if (body.placementSupport !== undefined) updateData.placementSupportText = body.placementSupport;
    if (body.overviewHtml !== undefined) updateData.overviewHtml = body.overviewHtml;
    if (body.totalEnrolled !== undefined) updateData.totalEnrolled = body.totalEnrolled;
    if (body.isFeatured !== undefined) updateData.isFeatured = body.isFeatured;
    if (body.isPopular !== undefined) updateData.isPopular = body.isPopular;
    if (body.isAdmissionOpen !== undefined) updateData.isAdmissionOpen = body.isAdmissionOpen;
    if (body.isActive !== undefined) updateData.isActive = body.isActive;
    if (body.metaTitle !== undefined) updateData.metaTitle = body.metaTitle;
    if (body.metaDescription !== undefined) updateData.metaDescription = body.metaDescription;

    const course = await prisma.course.update({
      where: { id: courseId },
      data: updateData,
      include: { category: true, heroImageMedia: true },
    });

    return NextResponse.json({ success: true, course });
  } catch (error) {
    console.error("PUT /api/courses/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update course", details: String(error) },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/courses/[id]
 * Soft-delete a course (set isActive = false)
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const courseId = parseInt(id, 10);
    if (isNaN(courseId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    await prisma.course.update({
      where: { id: courseId },
      data: { isActive: false },
    });

    return NextResponse.json({ success: true, message: "Course deactivated" });
  } catch (error) {
    console.error("DELETE /api/courses/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete course" }, { status: 500 });
  }
}
