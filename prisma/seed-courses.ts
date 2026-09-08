/**
 * Course Data Seed Script
 * Seeds ALL categories and courses from lib/data.ts into the MySQL database.
 * Separate from the main seed.ts to allow running independently.
 *
 * Usage: npx tsx prisma/seed-courses.ts
 */
import { PrismaClient } from "@prisma/client";
import { categories, courses } from "../lib/data";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting course data seed...\n");

  // ── 1. Seed Categories ──
  console.log(`📁 Seeding ${categories.length} categories...`);
  const categoryMap = new Map<string, number>();

  for (const cat of categories) {
    const result = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        subtitle: cat.subtitle || null,
        description: cat.description || null,
        badgeText: cat.badgeText || null,
        isFeatured: cat.isFeatured || false,
        isActive: true,
      },
      create: {
        slug: cat.slug,
        name: cat.name,
        subtitle: cat.subtitle || null,
        description: cat.description || null,
        badgeText: cat.badgeText || null,
        displayOrder: cat.id || 0,
        isFeatured: cat.isFeatured || false,
        isActive: true,
      },
    });
    categoryMap.set(cat.name, result.id);
    categoryMap.set(cat.slug, result.id);
    console.log(`  ✓ Category: ${cat.name} (ID: ${result.id})`);
  }

  // ── 2. Seed Courses ──
  console.log(`\n📚 Seeding ${courses.length} courses...`);
  let seededCount = 0;

  for (const c of courses) {
    // Resolve category
    const categorySlug = (c.categoryName || "general")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    let categoryId = categoryMap.get(c.categoryName) || categoryMap.get(categorySlug);

    if (!categoryId) {
      // Create category on the fly
      const created = await prisma.category.upsert({
        where: { slug: categorySlug },
        update: { name: c.categoryName || "General" },
        create: { slug: categorySlug, name: c.categoryName || "General" },
      });
      categoryId = created.id;
      categoryMap.set(c.categoryName, categoryId);
      console.log(`  📁 Auto-created category: ${c.categoryName} (ID: ${categoryId})`);
    }

    // Create MediaFile for heroImage if it's a URL
    let heroImageMediaId: number | null = null;
    if (c.heroImage) {
      const existingMedia = await prisma.mediaFile.findFirst({
        where: { storagePath: c.heroImage },
      });

      if (existingMedia) {
        heroImageMediaId = existingMedia.id;
      } else {
        const media = await prisma.mediaFile.create({
          data: {
            originalName: `${c.slug}-hero.webp`,
            fileName: `${c.slug}-hero.webp`,
            fileType: "IMAGE",
            mimeType: "image/webp",
            fileSizeBytes: BigInt(0),
            storageProvider: "LOCAL",
            storagePath: c.heroImage,
            altText: c.title,
          },
        });
        heroImageMediaId = media.id;
      }
    }

    // Prepare JSON fields
    const curriculumJson = c.curriculum || null;
    const skillsCoveredJson = c.skillsCovered
      ? (Array.isArray(c.skillsCovered) ? c.skillsCovered : [c.skillsCovered])
      : null;
    const careerScopeJson = c.careerOpportunities
      ? (Array.isArray(c.careerOpportunities) ? c.careerOpportunities : [c.careerOpportunities])
      : null;
    const clinicalHospitalsText = c.clinicalHospitals
      ? (Array.isArray(c.clinicalHospitals) ? c.clinicalHospitals.join(", ") : String(c.clinicalHospitals))
      : null;

    const courseData = {
      categoryId,
      title: c.title,
      tagline: c.tagline || null,
      courseType: (c.courseType as "FELLOWSHIP" | "PG_DIPLOMA" | "ADVANCED_CERTIFICATE" | "MASTERCLASS") || "FELLOWSHIP",
      deliveryMode: (c.deliveryMode as "HYBRID_CLINICAL" | "ONLINE_LIVE" | "HOSPITAL_ATTACHMENT" | "SELF_PACED") || "HYBRID_CLINICAL",
      duration: c.duration || "12 Months",
      clinicalHours: c.clinicalHours || 0,
      eligibility: c.eligibility || "MBBS / MD / DNB",
      feeINR: c.feeINR || null,
      feeUSD: c.feeUSD || null,
      emiStartingINR: c.emiStartingINR || null,
      heroImageMediaId,
      curriculumJson,
      skillsCoveredJson,
      careerScopeJson,
      clinicalHospitalsText,
      totalEnrolled: c.totalEnrolled || 0,
      ratingVal: c.ratingVal || 4.9,
      ratingCount: c.ratingCount || 120,
      isFeatured: c.isFeatured || false,
      isPopular: c.isPopular || false,
      isAdmissionOpen: c.isAdmissionOpen !== false,
      nextBatchDate: c.nextBatchDate ? new Date(c.nextBatchDate) : null,
      isActive: true,
    };

    const course = await prisma.course.upsert({
      where: { slug: c.slug },
      update: courseData as any,
      create: { slug: c.slug, ...(courseData as any) },
    });

    // Seed FAQs
    if (c.faqs && Array.isArray(c.faqs)) {
      for (let i = 0; i < c.faqs.length; i++) {
        const faq = c.faqs[i];
        const existingFaq = await prisma.courseFaq.findFirst({
          where: { courseId: course.id, question: faq.question },
        });
        if (!existingFaq) {
          await prisma.courseFaq.create({
            data: {
              courseId: course.id,
              question: faq.question,
              answer: faq.answer,
              displayOrder: i,
              isActive: true,
            },
          });
        }
      }
    }

    seededCount++;
    console.log(`  ✓ [${seededCount}/${courses.length}] ${c.title}`);
  }

  console.log("\n✅ Course seed completed!");
  console.log(`   Categories: ${categoryMap.size}`);
  console.log(`   Courses: ${seededCount}`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
