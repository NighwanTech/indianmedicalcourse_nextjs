"use server";

import { captureLead, CreateLeadInput } from "@/services/leadService";
import { DoctorQualification, LeadSource } from "@prisma/client";
import { z } from "zod";

const leadSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  mobile: z.string().min(10, "Please enter a valid 10-digit mobile number"),
  email: z.string().email("Please enter a valid email address").or(z.string().optional()),
  qualification: z.string(),
  currentProfession: z.string().optional(),
  experienceYears: z.string().optional(),
  interestedCourseId: z.number().optional(),
  interestedCourseName: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  message: z.string().optional(),
  leadSource: z.string().optional(),
  utmSource: z.string().optional(),
  utmCampaign: z.string().optional(),
  utmMedium: z.string().optional(),
  utmContent: z.string().optional(),
  utmTerm: z.string().optional(),
  gclid: z.string().optional(),
  fbclid: z.string().optional(),
  landingPageUrl: z.string().optional(),
});

export async function submitLeadAction(formData: FormData) {
  try {
    const rawData = {
      name: formData.get("name") as string,
      mobile: formData.get("mobile") as string,
      email: (formData.get("email") as string) || `${formData.get("mobile")}@imc-lead.in`,
      qualification: (formData.get("qualification") as string) || "MBBS",
      currentProfession: formData.get("currentProfession") as string,
      experienceYears: formData.get("experienceYears") as string,
      interestedCourseId: formData.get("interestedCourseId") ? Number(formData.get("interestedCourseId")) : undefined,
      interestedCourseName: formData.get("interestedCourseName") as string,
      city: formData.get("city") as string,
      state: formData.get("state") as string,
      message: formData.get("message") as string,
      leadSource: (formData.get("leadSource") as string) || "WEBSITE_FORM",
      utmSource: formData.get("utmSource") as string,
      utmCampaign: formData.get("utmCampaign") as string,
      utmMedium: formData.get("utmMedium") as string,
      utmContent: formData.get("utmContent") as string,
      utmTerm: formData.get("utmTerm") as string,
      gclid: formData.get("gclid") as string,
      fbclid: formData.get("fbclid") as string,
      landingPageUrl: formData.get("landingPageUrl") as string,
    };

    const validated = leadSchema.parse(rawData);

    const result = await captureLead({
      name: validated.name,
      mobile: validated.mobile,
      email: validated.email || `${validated.mobile}@imc-lead.in`,
      qualification: validated.qualification as DoctorQualification,
      currentProfession: validated.currentProfession,
      experienceYears: validated.experienceYears,
      interestedCourseId: validated.interestedCourseId,
      interestedCourseName: validated.interestedCourseName,
      city: validated.city,
      state: validated.state,
      message: validated.message,
      leadSource: (validated.leadSource as LeadSource) || "WEBSITE_FORM",
      utmSource: validated.utmSource,
      utmCampaign: validated.utmCampaign,
      utmMedium: validated.utmMedium,
      utmContent: validated.utmContent,
      utmTerm: validated.utmTerm,
      gclid: validated.gclid,
      fbclid: validated.fbclid,
      landingPageUrl: validated.landingPageUrl,
    });

    return {
      success: true,
      data: result,
    };
  } catch (error: any) {
    console.error("[Lead Action Error]", error);
    return {
      success: false,
      error: error?.message || "Failed to submit lead inquiry. Please try again.",
    };
  }
}
