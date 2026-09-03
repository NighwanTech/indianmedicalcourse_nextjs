import { PrismaClient, Role, CourseType, DeliveryMode, SettingGroup } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Dynamic Indian Medical Course CMS Database...");

  // 1. Create Super Admin User
  const passwordHash = await bcrypt.hash("admin123", 10);
  const adminUser = await prisma.user.upsert({
    where: { email: "admissions@indianmedicalcourses.com" },
    update: { passwordHash, role: Role.SUPER_ADMIN, isActive: true },
    create: {
      name: "IMC Admissions Desk",
      email: "admissions@indianmedicalcourses.com",
      passwordHash,
      phone: "+91 8295843006",
      role: Role.SUPER_ADMIN,
      isActive: true,
    },
  });
  console.log("✅ Admin user created:", adminUser.email);

  // 2. Dynamic Admin Sidebar Menu
  const adminSidebarMenu = await prisma.menu.upsert({
    where: { slug: "admin_sidebar" },
    update: { name: "Admin Portal Navigation", isActive: true },
    create: { slug: "admin_sidebar", name: "Admin Portal Navigation", description: "Dynamic sidebar navigation for CMS & CRM" },
  });

  const sidebarItems = [
    { label: "Dashboard", url: "/admin", icon: "LayoutDashboard", displayOrder: 1, permission: "ALL" },
    { label: "Lead Management", url: "/admin/leads", icon: "Users", badgeText: "Live", displayOrder: 2, permission: "ALL" },
    { label: "Media Library", url: "/admin/media", icon: "Image", displayOrder: 3, permission: "ADMIN" },
    { label: "Courses Master", url: "/admin/courses", icon: "GraduationCap", displayOrder: 4, permission: "ADMIN" },
    { label: "Categories", url: "/admin/categories", icon: "FolderTree", displayOrder: 5, permission: "ADMIN" },
    { label: "Faculty / Mentors", url: "/admin/faculty", icon: "Award", displayOrder: 6, permission: "ADMIN" },
    { label: "Landing Page Builder", url: "/admin/landing-pages", icon: "Layers", badgeText: "CRO", displayOrder: 7, permission: "ADMIN" },
    { label: "Blogs & Articles", url: "/admin/blogs", icon: "FileText", displayOrder: 8, permission: "ALL" },
    { label: "FAQs Manager", url: "/admin/faqs", icon: "HelpCircle", displayOrder: 9, permission: "ALL" },
    { label: "Testimonials", url: "/admin/testimonials", icon: "MessageSquare", displayOrder: 10, permission: "ALL" },
    { label: "Gallery Assets", url: "/admin/gallery", icon: "Sliders", displayOrder: 11, permission: "ADMIN" },
    { label: "Menu Builder", url: "/admin/menus", icon: "Menu", displayOrder: 12, permission: "SUPER_ADMIN" },
    { label: "Website Settings", url: "/admin/settings", icon: "Settings", displayOrder: 13, permission: "SUPER_ADMIN" },
    { label: "Admin & Roles", url: "/admin/users", icon: "UserCheck", displayOrder: 14, permission: "SUPER_ADMIN" },
  ];

  for (const item of sidebarItems) {
    const existing = await prisma.menuItem.findFirst({
      where: { menuId: adminSidebarMenu.id, url: item.url },
    });
    if (existing) {
      await prisma.menuItem.update({
        where: { id: existing.id },
        data: { ...item, isVisible: true, isActive: true },
      });
    } else {
      await prisma.menuItem.create({
        data: {
          menuId: adminSidebarMenu.id,
          ...item,
          isVisible: true,
          isActive: true,
        },
      });
    }
  }
  console.log("✅ Dynamic Admin Sidebar seeded:", sidebarItems.length, "items");

  // 3. Dynamic Header Navigation Menu
  const headerNavMenu = await prisma.menu.upsert({
    where: { slug: "header_nav" },
    update: { name: "Main Website Header", isActive: true },
    create: { slug: "header_nav", name: "Main Website Header", description: "Public top navbar" },
  });

  const headerItems = [
    { label: "Courses", url: "/courses", icon: "GraduationCap", badgeText: "150+", displayOrder: 1 },
    { label: "Admissions", url: "/admission-process", icon: "FileCheck", displayOrder: 2 },
    { label: "Hospital Partners", url: "/placement-partners", icon: "Building2", displayOrder: 3 },
    { label: "Success Stories", url: "/success-stories", icon: "Star", displayOrder: 4 },
    { label: "Scholarships", url: "/scholarship", icon: "Sparkles", displayOrder: 5 },
    { label: "Contact", url: "/contact", icon: "Phone", displayOrder: 6 },
  ];

  for (const item of headerItems) {
    const existing = await prisma.menuItem.findFirst({
      where: { menuId: headerNavMenu.id, url: item.url },
    });
    if (existing) {
      await prisma.menuItem.update({
        where: { id: existing.id },
        data: { ...item, isVisible: true, isActive: true },
      });
    } else {
      await prisma.menuItem.create({
        data: {
          menuId: headerNavMenu.id,
          ...item,
          isVisible: true,
          isActive: true,
        },
      });
    }
  }
  console.log("✅ Dynamic Header Navigation seeded:", headerItems.length, "items");

  // 4. Dynamic Homepage Sections
  const homepageSections = [
    { sectionKey: "hero", name: "Hero Lead Generation Section", displayOrder: 1, isEnabled: true },
    { sectionKey: "fellowship_spotlight", name: "Advanced Medical Fellowship Spotlight Banner", displayOrder: 2, isEnabled: true },
    { sectionKey: "about_us", name: "Welcome to About IMC (3D Cards)", displayOrder: 3, isEnabled: true },
    { sectionKey: "stats", name: "Live Enrolled Doctor Statistics Ticker", displayOrder: 4, isEnabled: true },
    { sectionKey: "courses", name: "Faceted Course Search & Catalog", displayOrder: 5, isEnabled: true },
    { sectionKey: "partners", name: "Hospital Partners Continuous Marquee", displayOrder: 6, isEnabled: true },
    { sectionKey: "why_choose_us", name: "4 Clinical Value Pillars", displayOrder: 7, isEnabled: true },
    { sectionKey: "admission_process", name: "4-Stage Admission Roadmap", displayOrder: 8, isEnabled: true },
    { sectionKey: "testimonials", name: "Verified Doctor Success Stories", displayOrder: 9, isEnabled: true },
    { sectionKey: "faculty", name: "Clinical Mentors & Leadership Showcase", displayOrder: 10, isEnabled: true },
    { sectionKey: "faqs", name: "Frequently Asked Questions Accordion", displayOrder: 11, isEnabled: true },
    { sectionKey: "final_cta", name: "Urgent Batch Closing CTA Banner", displayOrder: 12, isEnabled: true },
  ];

  for (const sec of homepageSections) {
    await prisma.homepageSection.upsert({
      where: { sectionKey: sec.sectionKey },
      update: sec,
      create: sec,
    });
  }
  console.log("✅ Dynamic Homepage Sections seeded:", homepageSections.length);

  // 5. Seed Categories
  const categoryData = [
    { slug: "cardiology", name: "Clinical Cardiology", subtitle: "2D Echo, TPI & ICCU Protocols", badgeText: "High Demand", displayOrder: 1 },
    { slug: "critical-care", name: "Critical Care & ICU", subtitle: "Ventilator & Bedside Hemodynamics", badgeText: "Emergency Priority", displayOrder: 2 },
    { slug: "surgery", name: "Minimal Access Surgery", subtitle: "Hands-on Laparoscopic Wet Lab", badgeText: "Hands-on OT", displayOrder: 3 },
    { slug: "dermatology", name: "Clinical & Aesthetic Dermatology", subtitle: "Lasers, Injectables & Trichology", badgeText: "Aesthetic Practice", displayOrder: 4 },
    { slug: "emergency-medicine", name: "Emergency Medicine", subtitle: "Trauma, Resuscitation & Triage", badgeText: "ACLS/ATLS Protocol", displayOrder: 5 },
    { slug: "fetal-medicine", name: "Fetal Medicine & Ultrasound", subtitle: "1st/2nd Trimester & Fetal Doppler", badgeText: "Perinatology Focus", displayOrder: 6 },
    { slug: "diabetology", name: "Clinical Diabetology & Endocrinology", subtitle: "Insulin Regimens & Complication Reversal", badgeText: "OPD Practice", displayOrder: 7 },
    { slug: "neonatology", name: "Neonatal Intensive Care (NICU)", subtitle: "Preterm Care & CPAP Protocols", badgeText: "Pediatric Critical", displayOrder: 8 },
    { slug: "pathology", name: "Diagnostic & Oncopathology", subtitle: "Dermatopathology, Oncopathology & Hematology", badgeText: "High Yield", displayOrder: 9 },
    { slug: "reproductive-medicine", name: "Reproductive Medicine & IVF", subtitle: "Clinical Embryology, IUI & Infertility Protocols", badgeText: "IVF Speciality", displayOrder: 10 },
  ];

  const categoriesMap = new Map<string, number>();
  for (const cat of categoryData) {
    const savedCat = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
    categoriesMap.set(cat.slug, savedCat.id);
  }
  console.log("✅ Categories seeded:", categoriesMap.size);

  // 6. Seed Courses (Top 10 Fellowship Programs Seeded with 185,000 INR)
  const coursesData = [
    {
      slug: "fellowship-in-dermatopathology",
      categorySlug: "pathology",
      title: "Fellowship in Dermatopathology",
      tagline: "Microscopic Diagnosis of Inflammatory Dermatoses, Cutaneous Neoplasms, Bullous Diseases & Clinicopathological Correlation.",
      courseType: CourseType.FELLOWSHIP,
      deliveryMode: DeliveryMode.HYBRID_CLINICAL,
      duration: "12 Months (Hybrid)",
      clinicalHours: 140,
      eligibility: "MBBS / MD / DNB (Pathology / Dermatology) / DVD / DDVL",
      feeINR: 185000,
      emiStartingINR: 7700,
      isFeatured: true,
      isPopular: true,
      totalEnrolled: 680,
    },
    {
      slug: "fellowship-in-oncopathology",
      categorySlug: "pathology",
      title: "Fellowship in Oncopathology",
      tagline: "Advanced Surgical Cancer Pathology, Tumor Staging, Immunohistochemistry (IHC) & Molecular Diagnostic Profiling.",
      courseType: CourseType.FELLOWSHIP,
      deliveryMode: DeliveryMode.HYBRID_CLINICAL,
      duration: "12 Months (Hybrid)",
      clinicalHours: 160,
      eligibility: "MBBS / MD / DNB (Pathology) / DCP with Histopathology Experience",
      feeINR: 185000,
      emiStartingINR: 7700,
      isFeatured: true,
      isPopular: true,
      totalEnrolled: 740,
    },
    {
      slug: "fellowship-in-hematopathology",
      categorySlug: "pathology",
      title: "Fellowship in Hematopathology",
      tagline: "Bone Marrow Trephine Biopsy Interpretation, Multicolor Flow Cytometry, Coagulation Disorders & Leukemia Diagnostics.",
      courseType: CourseType.FELLOWSHIP,
      deliveryMode: DeliveryMode.HYBRID_CLINICAL,
      duration: "12 Months (Hybrid)",
      clinicalHours: 150,
      eligibility: "MBBS / MD / DNB (Pathology) / DCP",
      feeINR: 185000,
      emiStartingINR: 7700,
      isFeatured: true,
      isPopular: true,
      totalEnrolled: 620,
    },
    {
      slug: "fellowship-in-aesthetic-dermatology-and-cosmetic-surgery",
      categorySlug: "dermatology",
      title: "Fellowship in Aesthetic Dermatology and Cosmetic Surgery",
      tagline: "Hands-on Clinical Training in Facial Injectables, Botox, Dermal Fillers, Medical Lasers, Chemical Peels & Dermatosurgery.",
      courseType: CourseType.FELLOWSHIP,
      deliveryMode: DeliveryMode.HYBRID_CLINICAL,
      duration: "12 Months (Hybrid)",
      clinicalHours: 150,
      eligibility: "MBBS / MD / MS / DVD / DDVL / BDS / MDS",
      feeINR: 185000,
      emiStartingINR: 7700,
      isFeatured: true,
      isPopular: true,
      totalEnrolled: 1290,
    },
    {
      slug: "fellowship-in-interventional-cardiology",
      categorySlug: "cardiology",
      title: "Fellowship in Interventional Cardiology",
      tagline: "Cath Lab Observer-ship, Coronary Angiography, PCI/Stenting Techniques, TPI Insertion, IVUS & Emergency Cardiac Interventions.",
      courseType: CourseType.FELLOWSHIP,
      deliveryMode: DeliveryMode.HYBRID_CLINICAL,
      duration: "12 Months (Hybrid)",
      clinicalHours: 180,
      eligibility: "MBBS / MD / DNB (General Medicine / Cardiology) / PGDCC",
      feeINR: 185000,
      emiStartingINR: 7700,
      isFeatured: true,
      isPopular: true,
      totalEnrolled: 1150,
    },
    {
      slug: "fellowship-in-fetal-medicine",
      categorySlug: "fetal-medicine",
      title: "Fellowship in Fetal Medicine",
      tagline: "Hands-on First Trimester NT/NB Screening, Target Anomaly Scan (TIFFA), Fetal Echo, Doppler & High-Risk Perinatology.",
      courseType: CourseType.FELLOWSHIP,
      deliveryMode: DeliveryMode.HYBRID_CLINICAL,
      duration: "12 Months (Hybrid)",
      clinicalHours: 150,
      eligibility: "MBBS / MS / MD / DGO / DMRD (Obstetrics & Gynecology / Radiology)",
      feeINR: 185000,
      emiStartingINR: 7700,
      isFeatured: true,
      isPopular: true,
      totalEnrolled: 1210,
    },
    {
      slug: "fellowship-in-reproductive-medicine",
      categorySlug: "reproductive-medicine",
      title: "Fellowship in Reproductive Medicine",
      tagline: "Advanced Infertility Assessment, Ovulation Induction Protocols, IUI Hands-on Lab, OPU/ET Procedures & Clinical Embryology.",
      courseType: CourseType.FELLOWSHIP,
      deliveryMode: DeliveryMode.HYBRID_CLINICAL,
      duration: "12 Months (Hybrid)",
      clinicalHours: 140,
      eligibility: "MBBS / MS / MD / DGO / DNB (Obstetrics & Gynecology)",
      feeINR: 185000,
      emiStartingINR: 7700,
      isFeatured: true,
      isPopular: true,
      totalEnrolled: 890,
    },
    {
      slug: "fellowship-in-robotic-laparoscopic-surgery",
      categorySlug: "surgery",
      title: "Fellowship in Robotic & Laparoscopic Surgery",
      tagline: "Da Vinci Robotic Console Simulation, Laparoscopic Knot Tying, Cholecystectomy, Hernia Repair & Live OT Assisting.",
      courseType: CourseType.FELLOWSHIP,
      deliveryMode: DeliveryMode.HYBRID_CLINICAL,
      duration: "12 Months (Hospital Attachment)",
      clinicalHours: 160,
      eligibility: "MBBS / MS (Surgery) / DNB (Surgery) / DGO / MD (Obstetrics & Gynecology)",
      feeINR: 185000,
      emiStartingINR: 7700,
      isFeatured: true,
      isPopular: true,
      totalEnrolled: 950,
    },
    {
      slug: "fellowship-in-pediatric-dermatology",
      categorySlug: "dermatology",
      title: "Fellowship in Pediatric Dermatology",
      tagline: "Diagnosis and Clinical Management of Neonatal Dermatoses, Atopic Eczema, Vascular Birthmarks, Genodermatoses & Pediatric Infections.",
      courseType: CourseType.FELLOWSHIP,
      deliveryMode: DeliveryMode.HYBRID_CLINICAL,
      duration: "12 Months (Hybrid)",
      clinicalHours: 120,
      eligibility: "MBBS / MD / DNB / DCH (Pediatrics / Dermatology) / DVD / DDVL",
      feeINR: 185000,
      emiStartingINR: 7700,
      isFeatured: true,
      isPopular: true,
      totalEnrolled: 580,
    },
    {
      slug: "fellowship-in-pediatric-critical-care",
      categorySlug: "critical-care",
      title: "Fellowship in Pediatric Critical Care",
      tagline: "PICU Mechanical Ventilation, Pediatric Septic Shock Protocols, Bedside POCUS, Arterial Lines, Neuro-Critical Care & ECMO Principles.",
      courseType: CourseType.FELLOWSHIP,
      deliveryMode: DeliveryMode.HYBRID_CLINICAL,
      duration: "12 Months (Hybrid)",
      clinicalHours: 180,
      eligibility: "MBBS / MD / DNB / DCH (Pediatrics) / Anaesthesia / Emergency Medicine",
      feeINR: 185000,
      emiStartingINR: 7700,
      isFeatured: true,
      isPopular: true,
      totalEnrolled: 810,
    },
    {
      slug: "fellowship-in-clinical-cardiology",
      categorySlug: "cardiology",
      title: "Fellowship in Clinical Cardiology",
      tagline: "Hands-on 2D Echocardiography, TPI Insertion, and Bedside Coronary Care Unit Management for Doctors.",
      courseType: CourseType.FELLOWSHIP,
      deliveryMode: DeliveryMode.HYBRID_CLINICAL,
      duration: "12 Months (Hybrid)",
      clinicalHours: 120,
      eligibility: "MBBS / MD / DNB / Equivalent Recognized Medical Degree",
      feeINR: 125000,
      emiStartingINR: 7800,
      isFeatured: false,
      isPopular: true,
      totalEnrolled: 380,
    },
    {
      slug: "fellowship-in-critical-care-medicine",
      categorySlug: "critical-care",
      title: "Fellowship in Critical Care Medicine",
      tagline: "Master Mechanical Ventilation, Arterial Line Placement, Hemodynamic Monitoring & Septic Shock in Tertiary ICUs.",
      courseType: CourseType.FELLOWSHIP,
      deliveryMode: DeliveryMode.HYBRID_CLINICAL,
      duration: "12 Months (Hybrid)",
      clinicalHours: 140,
      eligibility: "MBBS / MD / DA / DNB / DTCD",
      feeINR: 135000,
      emiStartingINR: 8500,
      isFeatured: false,
      isPopular: true,
      totalEnrolled: 420,
    },
    {
      slug: "post-graduate-diploma-in-emergency-medicine",
      categorySlug: "emergency-medicine",
      title: "PG Diploma in Emergency Medicine",
      tagline: "Rapid Triage, Trauma Life Support (ATLS), Point-of-Care Ultrasound (POCUS) & Resuscitation Mastery.",
      courseType: CourseType.PG_DIPLOMA,
      deliveryMode: DeliveryMode.HYBRID_CLINICAL,
      duration: "12 Months (Hybrid)",
      clinicalHours: 110,
      eligibility: "MBBS / Qualified Medical Practitioner",
      feeINR: 115000,
      emiStartingINR: 7200,
      isFeatured: false,
      isPopular: true,
      totalEnrolled: 260,
    },
  ];

  for (const c of coursesData) {
    const categoryId = categoriesMap.get(c.categorySlug);
    if (!categoryId) continue;

    const { categorySlug, ...courseFields } = c;

    await prisma.course.upsert({
      where: { slug: c.slug },
      update: { ...courseFields, categoryId },
      create: { ...courseFields, categoryId },
    });
  }
  console.log("✅ Courses seeded:", coursesData.length);

  // 7. Seed Site Settings
  const defaultSettings = [
    { settingKey: "brand_name", settingGroup: SettingGroup.COMPANY_DETAILS, settingValue: "Indian Medical Course" },
    { settingKey: "hotline_phone", settingGroup: SettingGroup.CONTACT_INFO, settingValue: "+91 8295843006" },
    { settingKey: "whatsapp_number", settingGroup: SettingGroup.WHATSAPP_CONFIG, settingValue: "+91 8295843006" },
    { settingKey: "support_email", settingGroup: SettingGroup.CONTACT_INFO, settingValue: "indianmedicalcourses@gmail.com" },
    { settingKey: "registered_address", settingGroup: SettingGroup.COMPANY_DETAILS, settingValue: "Narayni Polly clinic dhimshri shamshabad near police chowk and DAV inter College, Agra - UP, 283125, India" },
    { settingKey: "announcement_text", settingGroup: SettingGroup.ANNOUNCEMENT_BAR, settingValue: "Admissions Open for 2026 Batches | Limited Clinical Training Seats Available | 0% Interest EMI Options" },
    { settingKey: "google_ads_id", settingGroup: SettingGroup.GOOGLE_ADS, settingValue: "AW-11234567890" },
    { settingKey: "meta_pixel_id", settingGroup: SettingGroup.META_PIXEL, settingValue: "987654321098765" },
    { settingKey: "theme_primary_color", settingGroup: SettingGroup.THEME_COLORS, settingValue: "#0B4F9C" },
    { settingKey: "theme_secondary_color", settingGroup: SettingGroup.THEME_COLORS, settingValue: "#0D9468" },
  ];

  for (const s of defaultSettings) {
    await prisma.siteSetting.upsert({
      where: { settingKey: s.settingKey },
      update: s,
      create: s,
    });
  }
  console.log("✅ Site Settings & Theme Colors seeded successfully.");

  console.log("🎉 Complete Dynamic CMS Seeding Finished!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
