import { leadRepository } from "./leadRepository";
import { CreateLeadDTO } from "./types";
import { leadValidationSchema } from "./validation";
import { ValidationError } from "@/lib/errors/AppError";
import { crmQueue } from "@/lib/crm/crmQueue";
import { sendEmail } from "@/services/emailService";
import { LeadPriority } from "@prisma/client";

export class LeadService {
  async processLeadSubmission(rawInput: unknown) {
    // =========================================================================
    // STEP 1: VALIDATE USING ZOD
    // =========================================================================
    const parsed = leadValidationSchema.safeParse(rawInput);
    if (!parsed.success) {
      const fieldErrors: Record<string, string[]> = {};
      parsed.error.issues.forEach((issue) => {
        const path = issue.path.join(".") || "form";
        if (!fieldErrors[path]) fieldErrors[path] = [];
        fieldErrors[path].push(issue.message);
      });
      throw new ValidationError("Invalid lead submission data", fieldErrors);
    }

    const data = parsed.data;
    const doctorEmail = data.email && data.email.trim() ? data.email.trim() : `${data.mobile}@imc-applicant.in`;
    const courseTitle = data.interestedCourseName || "Clinical Fellowship";

    // Normalize Qualification
    let mappedQual: any = "MBBS";
    const qUpper = (data.qualification || "").toUpperCase();
    if (qUpper.includes("MD") || qUpper.includes("MS")) mappedQual = "MD_MS";
    else if (qUpper.includes("DNB")) mappedQual = "DNB";
    else if (qUpper.includes("BDS") || qUpper.includes("MDS") || qUpper.includes("DENTAL")) mappedQual = "BDS_MDS";
    else if (qUpper.includes("BAMS") || qUpper.includes("BHMS") || qUpper.includes("AYUSH")) mappedQual = "BAMS_BHMS";
    else if (qUpper.includes("NURS")) mappedQual = "BSc_MSc_NURSING";

    const isGoogleAds = Boolean(
      data.gclid ||
      data.gbraid ||
      data.wbraid ||
      data.trafficSource === "Google Ads" ||
      (data.utmSource || "").toLowerCase().includes("google") ||
      (data.utmMedium || "").toLowerCase().includes("cpc")
    );

    const dto: CreateLeadDTO = {
      name: data.name,
      mobile: data.mobile,
      email: doctorEmail,
      qualification: mappedQual,
      currentProfession: data.currentProfession,
      experienceYears: data.experienceYears,
      interestedCourseId: data.interestedCourseId,
      interestedCourseName: courseTitle,
      state: data.state || "India",
      city: data.city || "India",
      message: data.message,
      preferredCounsellingTime: data.preferredCounsellingTime,
      leadSource: (data.leadSource as any) || "WEBSITE_FORM",
      utmSource: data.utmSource,
      utmCampaign: data.utmCampaign,
      utmMedium: data.utmMedium,
      utmContent: data.utmContent,
      utmTerm: data.utmTerm,
      gclid: data.gclid || data.gbraid || data.wbraid,
      fbclid: data.fbclid,
      landingPageUrl: data.landingPageUrl,
      referrerUrl: data.referrerUrl,
      deviceType: data.deviceType,
      browser: data.browser,
      operatingSystem: data.operatingSystem,
    };

    // Calculate Priority & Score
    let leadScore = 50;
    let priority: LeadPriority = "MEDIUM";

    if (mappedQual === "MBBS" || mappedQual === "MD_MS" || mappedQual === "DNB") {
      leadScore += 30;
      priority = "HIGH";
    }
    if (isGoogleAds) {
      leadScore += 20;
    }

    // =========================================================================
    // STEP 2 & 3: SAVE LEAD INTO MYSQL + CREATE LEAD ACTIVITY (TRANSACTION)
    // =========================================================================
    const savedLead = await leadRepository.createLeadWithTransaction(dto, priority, leadScore);

    // =========================================================================
    // STEP 4: SEND ADMIN EMAIL NOTIFICATION
    // =========================================================================
    try {
      const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || "indianmedicalcourses@gmail.com";
      await sendEmail({
        to: adminEmail,
        subject: `🚨 [New Lead Alert] Dr. ${data.name} - ${courseTitle} (${data.trafficSource || (isGoogleAds ? "Google Ads" : "Website")})`,
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; rounded: 12px;">
            <h2 style="color: #0B4F9C; margin-top: 0;">New Doctor Fellowship Inquiry</h2>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <tr><td style="padding: 8px; font-weight: bold; width: 35%;">Doctor Name:</td><td style="padding: 8px;">Dr. ${data.name}</td></tr>
              <tr style="background: #f8fafc;"><td style="padding: 8px; font-weight: bold;">Mobile Phone:</td><td style="padding: 8px;"><a href="tel:${data.mobile}">${data.mobile}</a></td></tr>
              <tr><td style="padding: 8px; font-weight: bold;">Email:</td><td style="padding: 8px;">${doctorEmail}</td></tr>
              <tr style="background: #f8fafc;"><td style="padding: 8px; font-weight: bold;">Qualification:</td><td style="padding: 8px;">${data.qualification || mappedQual}</td></tr>
              <tr><td style="padding: 8px; font-weight: bold;">Interested Course:</td><td style="padding: 8px; color: #0B4F9C; font-weight: bold;">${courseTitle}</td></tr>
              <tr style="background: #f8fafc;"><td style="padding: 8px; font-weight: bold;">City / State:</td><td style="padding: 8px;">${data.city || "N/A"}, ${data.state || "India"}</td></tr>
            </table>

            <h3 style="color: #334155; font-size: 14px; margin-bottom: 8px;">📊 Attribution & Marketing Metadata</h3>
            <table style="width: 100%; border-collapse: collapse; background: #f1f5f9; font-size: 12px;">
              <tr><td style="padding: 6px; font-weight: bold;">Traffic Source:</td><td style="padding: 6px;">${data.trafficSource || (isGoogleAds ? "Google Ads" : "Direct / Organic")}</td></tr>
              <tr><td style="padding: 6px; font-weight: bold;">UTM Campaign:</td><td style="padding: 6px;">${data.utmCampaign || "None"}</td></tr>
              <tr><td style="padding: 6px; font-weight: bold;">GCLID / Click ID:</td><td style="padding: 6px; font-family: monospace;">${data.gclid || data.gbraid || data.wbraid || "None"}</td></tr>
              <tr><td style="padding: 6px; font-weight: bold;">Device / Browser:</td><td style="padding: 6px;">${data.deviceType || "Desktop"} / ${data.browser || "Browser"}</td></tr>
              <tr><td style="padding: 6px; font-weight: bold;">Landing URL:</td><td style="padding: 6px; word-break: break-all;">${data.landingPageUrl || "https://indianmedicalcourse.com"}</td></tr>
            </table>
          </div>
        `,
      });
    } catch (adminMailErr) {
      console.error("[Lead Service] Admin notification email error:", adminMailErr);
    }

    // =========================================================================
    // STEP 5: SEND USER CONFIRMATION EMAIL
    // =========================================================================
    try {
      if (doctorEmail && !doctorEmail.includes("@imc-applicant.in")) {
        await sendEmail({
          to: doctorEmail,
          subject: `Application Acknowledgment - ${courseTitle} | Indian Medical Course`,
          htmlContent: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; line-height: 1.6;">
              <h2 style="color: #0B4F9C; margin-top: 0;">Dear Dr. ${data.name},</h2>
              <p>Thank you for expressing your interest in the <strong>${courseTitle}</strong> at Indian Medical Course.</p>
              <p>Your application has been received and prioritized. Our Senior Clinical Admissions Advisor will contact you shortly with the complete clinical rotation schedule, university eligibility matrix, and 0% EMI financing options.</p>
              
              <div style="background: #f0fdf4; border: 1px solid #bbf7d0; padding: 14px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 0; color: #166534; font-size: 13px;">
                  <strong>⚡ Immediate Admissions Hotline:</strong> Call or WhatsApp our Medical Helpdesk at <a href="tel:+918295843006" style="color: #166534; font-weight: bold;">+91 8295843006</a> for priority seat booking.
                </p>
              </div>

              <p style="font-size: 12px; color: #64748b; margin-top: 24px;">
                Warm regards,<br/>
                <strong>Admissions & Academic Board</strong><br/>
                Indian Medical Course | <a href="https://indianmedicalcourse.com" style="color: #0B4F9C;">indianmedicalcourse.com</a>
              </p>
            </div>
          `,
        });
      }
    } catch (userMailErr) {
      console.error("[Lead Service] Doctor confirmation email error:", userMailErr);
    }

    // =========================================================================
    // STEP 6: ENQUEUE LEAD INTO NON-BLOCKING ENTERPRISE CRM QUEUE
    // =========================================================================
    try {
      crmQueue.enqueue("LEAD_CREATED", savedLead.uuid, {
        leadUuid: savedLead.uuid,
        name: data.name,
        mobile: data.mobile,
        email: doctorEmail,
        qualification: mappedQual,
        courseName: courseTitle,
        city: data.city || "India",
        state: data.state || "India",
        country: data.country || "India",
        leadSource: data.leadSource || (isGoogleAds ? "GOOGLE_ADS" : "WEBSITE_FORM"),
        utmSource: data.utmSource,
        utmCampaign: data.utmCampaign,
        utmMedium: data.utmMedium,
        utmContent: data.utmContent,
        utmTerm: data.utmTerm,
        gclid: data.gclid || data.gbraid || data.wbraid,
        gbraid: data.gbraid,
        wbraid: data.wbraid,
        fbclid: data.fbclid,
        landingPageUrl: data.landingPageUrl,
        deviceType: data.deviceType,
        browser: data.browser,
        operatingSystem: data.operatingSystem,
        leadScore,
        notes: data.message,
        createdAt: new Date().toISOString(),
      });
    } catch (crmError) {
      console.error("[Lead Service] CRM queue enqueue error:", crmError);
    }

    // =========================================================================
    // STEP 7: RETURN SUCCESS WITH SECURE REF ID & CONVERSION METADATA
    // =========================================================================
    return {
      success: true,
      refId: savedLead.uuid,
      leadToken: Buffer.from(JSON.stringify({ ref: savedLead.uuid, ts: Date.now() })).toString("base64url"),
      isGoogleAds,
      courseName: courseTitle,
      qualification: mappedQual,
      city: data.city || "India",
      state: data.state || "India",
      trafficSource: data.trafficSource || (isGoogleAds ? "Google Ads" : "Direct"),
      trafficType: data.trafficType || (isGoogleAds ? "paid_search" : "direct"),
    };
  }
}

export const leadService = new LeadService();
