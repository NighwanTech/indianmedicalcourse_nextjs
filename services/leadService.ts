import { prisma } from "@/lib/db";
import { DoctorQualification, LeadSource, LeadPriority, LeadStatus, ActivityType } from "@prisma/client";
import { aiwcrmService } from "./aiwcrm/aiwcrmService";
import { sendEmail } from "./emailService";

export interface CreateLeadInput {
  name: string;
  mobile: string;
  email: string;
  qualification: DoctorQualification;
  currentProfession?: string;
  experienceYears?: string;
  interestedCourseId?: number;
  interestedCourseName?: string;
  state?: string;
  city?: string;
  message?: string;
  preferredCounsellingTime?: string;
  leadSource?: LeadSource;
  utmSource?: string;
  utmCampaign?: string;
  utmMedium?: string;
  utmContent?: string;
  utmTerm?: string;
  gclid?: string;
  fbclid?: string;
  landingPageUrl?: string;
  ipAddress?: string;
  browser?: string;
  operatingSystem?: string;
  deviceType?: string;
}

export async function captureLead(input: CreateLeadInput) {
  const sanitizedMobile = input.mobile.replace(/[^0-9+]/g, "");

  // 1. Duplicate Detection: Check if a lead with same mobile exists in the system
  let existingLead = null;
  try {
    existingLead = await prisma.lead.findFirst({
      where: {
        OR: [
          { mobile: sanitizedMobile },
          { email: input.email },
        ],
      },
      orderBy: { createdAt: "desc" },
    });
  } catch {
    // If DB is not connected in demo mode, proceed gracefully
  }

  // 2. Score Calculation: Doctors with MBBS/MD qualification get higher priority
  let leadScore = 50;
  let priority: LeadPriority = "MEDIUM";

  if (input.qualification === "MBBS" || input.qualification === "MD_MS" || input.qualification === "DNB") {
    leadScore += 30;
    priority = "HIGH";
  }
  if (input.gclid || input.utmCampaign) {
    leadScore += 15;
  }

  // 3. Persist into MySQL via Prisma (or fallback to structured result)
  let savedLead = null;
  const leadUuid = `lead_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

  try {
    savedLead = await prisma.lead.create({
      data: {
        uuid: leadUuid,
        name: input.name,
        mobile: sanitizedMobile,
        email: input.email,
        qualification: input.qualification,
        currentProfession: input.currentProfession,
        experienceYears: input.experienceYears,
        interestedCourseId: input.interestedCourseId,
        interestedCourseName: input.interestedCourseName || "Clinical Fellowship",
        state: input.state,
        city: input.city,
        message: input.message,
        preferredCounsellingTime: input.preferredCounsellingTime,
        leadSource: input.leadSource || "WEBSITE_FORM",
        leadStatus: "NEW",
        priority,
        leadScore,
        utmSource: input.utmSource,
        utmCampaign: input.utmCampaign,
        utmMedium: input.utmMedium,
        utmContent: input.utmContent,
        utmTerm: input.utmTerm,
        gclid: input.gclid,
        fbclid: input.fbclid,
        landingPageUrl: input.landingPageUrl,
        ipAddress: input.ipAddress,
        browser: input.browser,
        operatingSystem: input.operatingSystem,
        deviceType: input.deviceType,
      },
    });

    // Log Activity
    await prisma.leadActivity.create({
      data: {
        leadId: savedLead.id,
        activityType: "SUBMITTED",
        title: "Lead Captured from Website Form",
        description: `Form submitted for course: ${input.interestedCourseName || "General Fellowship"}. Source: ${input.leadSource || "WEBSITE_FORM"}`,
      },
    });
  } catch (dbError) {
    console.warn("[Prisma DB Notice] Database insertion fallback (running with local state):", dbError);
  }

  // 4. Async Dispatch to AIWCRM Provider
  try {
    await aiwcrmService.pushLead({
      leadUuid,
      name: input.name,
      mobile: sanitizedMobile,
      email: input.email,
      qualification: input.qualification,
      courseName: input.interestedCourseName || "Clinical Fellowship",
      city: input.city,
      state: input.state,
      leadSource: input.leadSource,
      utmSource: input.utmSource,
      utmCampaign: input.utmCampaign,
      leadScore,
    });
  } catch (crmError) {
    console.error("[AIWCRM Push Error]", crmError);
  }

  // 5. Async Email Notification
  try {
    await sendEmail({
      to: input.email,
      subject: `Admission Inquiry Confirmation - ${input.interestedCourseName || "Indian Medical Course"}`,
      htmlContent: `
        <h2>Thank you, Dr. ${input.name}</h2>
        <p>We have received your admission enquiry for <strong>${input.interestedCourseName || "Clinical Fellowship"}</strong>.</p>
        <p>A Senior Medical Admissions Counsellor will connect with you within 30 minutes to provide your course syllabus, verify eligibility, and outline the 0% interest EMI options.</p>
        <br/>
        <p>Admissions Desk, Indian Medical Course</p>
      `,
    });
  } catch (emailError) {
    console.error("[Email Notification Error]", emailError);
  }

  return {
    success: true,
    leadUuid,
    isDuplicate: Boolean(existingLead),
    conversionMetadata: {
      sendGoogleAdsConversion: true,
      sendMetaPixelEvent: "Lead",
      leadValueINR: 1500,
    },
  };
}
