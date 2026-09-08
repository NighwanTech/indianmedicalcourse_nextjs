import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { DoctorQualification, LeadSource, LeadPriority, LeadStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

// Map qualification string to Prisma DoctorQualification enum
function mapQualification(raw?: string): DoctorQualification {
  if (!raw) return DoctorQualification.MBBS;
  const upper = raw.toUpperCase();
  if (upper.includes("MD") || upper.includes("MS")) return DoctorQualification.MD_MS;
  if (upper.includes("DNB")) return DoctorQualification.DNB;
  if (upper.includes("BDS") || upper.includes("MDS") || upper.includes("DENTAL")) return DoctorQualification.BDS_MDS;
  if (upper.includes("BAMS") || upper.includes("BHMS") || upper.includes("AYUSH")) return DoctorQualification.BAMS_BHMS;
  if (upper.includes("NURS") || upper.includes("BSC")) return DoctorQualification.BSc_MSc_NURSING;
  if (upper.includes("OTHER")) return DoctorQualification.OTHER_HEALTHCARE;
  return DoctorQualification.MBBS;
}

// Map form/lead source string to Prisma LeadSource enum
function mapLeadSource(raw?: string): LeadSource {
  if (!raw) return LeadSource.WEBSITE_FORM;
  const lower = raw.toLowerCase();
  if (lower.includes("hero")) return LeadSource.HERO_FORM;
  if (lower.includes("exit")) return LeadSource.EXIT_INTENT;
  if (lower.includes("brochure") || lower.includes("download")) return LeadSource.BROCHURE_DOWNLOAD;
  if (lower.includes("modal") || lower.includes("popup")) return LeadSource.COURSE_PAGE_MODAL;
  if (lower.includes("landing")) return LeadSource.LANDING_PAGE;
  if (lower.includes("whatsapp")) return LeadSource.WHATSAPP_CLICK;
  if (lower.includes("phone") || lower.includes("call")) return LeadSource.PHONE_CLICK;
  if (lower.includes("scholarship")) return LeadSource.SCHOLARSHIP_CALC;
  return LeadSource.WEBSITE_FORM;
}

/**
 * GET /api/leads
 * Fetch all leads from MySQL database for the Admin Panel
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const priority = searchParams.get("priority") || "";
    const limit = parseInt(searchParams.get("limit") || "200", 10);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};

    if (status && status !== "ALL") {
      where.leadStatus = status as LeadStatus;
    }
    if (priority && priority !== "ALL") {
      where.priority = priority as LeadPriority;
    }
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { mobile: { contains: search } },
        { email: { contains: search } },
        { interestedCourseName: { contains: search } },
        { city: { contains: search } },
        { utmCampaign: { contains: search } },
      ];
    }

    const leads = await prisma.lead.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: Math.min(limit, 500),
      include: {
        assignedCounsellor: { select: { id: true, name: true, email: true } },
        activities: { take: 5, orderBy: { createdAt: "desc" } },
        notes: { take: 5, orderBy: { createdAt: "desc" } },
      },
    });

    // Transform BigInt and Date fields for JSON response
    const formatted = leads.map((lead) => {
      // Determine channel
      const isGoogleAds = Boolean(
        lead.gclid ||
        (lead.utmSource && /google|gads|cpc/i.test(lead.utmSource))
      );
      const isMetaAds = Boolean(
        lead.fbclid ||
        (lead.utmSource && /facebook|instagram|meta|fb|ig/i.test(lead.utmSource))
      );

      let channel: "GOOGLE_ADS" | "META_ADS" | "ORGANIC" = "ORGANIC";
      let channelLabel = "Organic / Direct";

      if (isGoogleAds) {
        channel = "GOOGLE_ADS";
        channelLabel = "Google Ads";
      } else if (isMetaAds) {
        channel = "META_ADS";
        channelLabel = "Meta Ads";
      } else if (lead.leadSource === "WHATSAPP_CLICK") {
        channelLabel = "WhatsApp Direct";
      }

      return {
        id: lead.id.toString(),
        uuid: lead.uuid,
        name: lead.name,
        mobile: lead.mobile,
        email: lead.email,
        qualification: lead.qualification,
        specialty: lead.qualification,
        interestedCourse: lead.interestedCourseName || "Clinical Fellowship",
        city: lead.city || "",
        state: lead.state || "",
        country: "India",
        formSource: lead.leadSource,
        leadSource: channelLabel,
        channel,
        channelLabel,
        landingPageUrl: lead.landingPageUrl || "",
        leadStatus: lead.leadStatus,
        priority: lead.priority,
        score: lead.leadScore,
        createdAt: lead.createdAt.toISOString(),
        notes: lead.message || "",
        deviceType: lead.deviceType || "Desktop",
        browser: lead.browser || "Chrome",
        operatingSystem: lead.operatingSystem || "Windows",
        utmSource: lead.utmSource || undefined,
        utmCampaign: lead.utmCampaign || undefined,
        utmMedium: lead.utmMedium || undefined,
        utmContent: lead.utmContent || undefined,
        utmTerm: lead.utmTerm || undefined,
        gclid: lead.gclid || undefined,
        fbclid: lead.fbclid || undefined,
        attribution: {
          gclid: lead.gclid || undefined,
          fbclid: lead.fbclid || undefined,
          utmSource: lead.utmSource || undefined,
          utmCampaign: lead.utmCampaign || undefined,
          utmMedium: lead.utmMedium || undefined,
          utmContent: lead.utmContent || undefined,
          utmTerm: lead.utmTerm || undefined,
        },
      };
    });

    return NextResponse.json({ success: true, count: formatted.length, leads: formatted });
  } catch (error: any) {
    console.error("GET /api/leads error:", error);
    return NextResponse.json({ success: false, error: error?.message || "Failed to fetch leads" }, { status: 500 });
  }
}

/**
 * POST /api/leads
 * Save a new lead from website forms into MySQL database
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const rawName = String(body.name || body.fullName || "Doctor Applicant").trim();
    const cleanName = rawName.replace(/^dr\.?\s*/i, "").trim();
    const docName = cleanName
      ? `Dr. ${cleanName.split(/\s+/).map((w: string) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ")}`
      : "Doctor Applicant";

    const rawMobile = String(body.mobile || body.mobileNumber || body.phone || "").trim();
    const cleanMobile = rawMobile.replace(/[^0-9+]/g, "");

    if (!cleanMobile || cleanMobile.replace(/\D/g, "").length < 7) {
      return NextResponse.json({ success: false, error: "Valid mobile number is required" }, { status: 400 });
    }

    const cleanEmail = body.email ? String(body.email).trim().toLowerCase() : `${cleanMobile.replace(/\D/g, "")}@imc-lead.in`;
    const courseName = body.interestedCourseName || body.interestedCourse || body.courseName || "Clinical Fellowship";

    // 1. Check for duplicate within 60 seconds (same phone + same course)
    const existingRecent = await prisma.lead.findFirst({
      where: {
        mobile: cleanMobile,
        interestedCourseName: courseName,
        createdAt: { gte: new Date(Date.now() - 60 * 1000) },
      },
    });

    if (existingRecent) {
      return NextResponse.json({
        success: true,
        data: {
          leadId: existingRecent.id.toString(),
          uuid: existingRecent.uuid,
          isDuplicateSuppressed: true,
          message: "Application already received recently",
        },
      });
    }

    // 2. Score Calculation & Priority Assignment
    const qualificationEnum = mapQualification(body.qualification || body.specialty);
    let leadScore = 50;
    let priority: LeadPriority = LeadPriority.MEDIUM;

    if (
      qualificationEnum === DoctorQualification.MD_MS ||
      qualificationEnum === DoctorQualification.DNB
    ) {
      leadScore = 95;
      priority = LeadPriority.URGENT;
    } else if (qualificationEnum === DoctorQualification.MBBS) {
      leadScore = 85;
      priority = LeadPriority.HIGH;
    }

    const gclid = body.gclid || body.attribution?.gclid || null;
    const fbclid = body.fbclid || body.attribution?.fbclid || null;
    const utmSource = body.utmSource || body.utm_source || body.attribution?.utmSource || null;
    const utmCampaign = body.utmCampaign || body.utm_campaign || body.attribution?.utmCampaign || null;
    const utmMedium = body.utmMedium || body.utm_medium || body.attribution?.utmMedium || null;
    const utmContent = body.utmContent || body.utm_content || body.attribution?.utmContent || null;
    const utmTerm = body.utmTerm || body.utm_term || body.attribution?.utmTerm || null;

    if (gclid || utmCampaign) {
      leadScore = Math.min(100, leadScore + 10);
    }

    const leadSourceEnum = mapLeadSource(body.leadSource || body.formSource);

    // 3. Create Lead in MySQL DB
    const leadUuid = body.uuid || `lead_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const newLead = await prisma.lead.create({
      data: {
        uuid: leadUuid,
        name: docName,
        mobile: cleanMobile,
        email: cleanEmail,
        qualification: qualificationEnum,
        currentProfession: body.currentProfession || null,
        experienceYears: body.experienceYears || null,
        interestedCourseId: body.interestedCourseId ? Number(body.interestedCourseId) : null,
        interestedCourseName: courseName,
        city: body.city || null,
        state: body.state || body.country || "India",
        message: body.notes || body.message || null,
        leadSource: leadSourceEnum,
        leadStatus: LeadStatus.NEW,
        priority,
        leadScore,
        sourceColorHex: gclid ? "#4285F4" : fbclid ? "#0866FF" : "#0B4F9C",
        utmSource,
        utmCampaign,
        utmMedium,
        utmContent,
        utmTerm,
        gclid,
        fbclid,
        landingPageUrl: body.landingPageUrl || null,
        referrerUrl: body.referrerUrl || null,
        deviceType: body.deviceType || null,
        browser: body.browser || null,
        operatingSystem: body.operatingSystem || null,
      },
    });

    // 4. Log Activity
    try {
      await prisma.leadActivity.create({
        data: {
          leadId: newLead.id,
          activityType: "SUBMITTED",
          title: "Form Submitted",
          description: `Captured from ${leadSourceEnum} for ${courseName}. Source: ${gclid ? "Google Ads (GCLID)" : utmSource || "Direct"}`,
        },
      });
    } catch {
      // Non-critical activity log failure
    }

    return NextResponse.json({
      success: true,
      data: {
        leadId: newLead.id.toString(),
        uuid: newLead.uuid,
        message: "Lead saved to database successfully",
      },
    });
  } catch (error: any) {
    console.error("POST /api/leads error:", error);
    return NextResponse.json({ success: false, error: error?.message || "Internal server error" }, { status: 500 });
  }
}
