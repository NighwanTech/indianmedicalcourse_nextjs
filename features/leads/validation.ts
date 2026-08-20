import { z } from "zod";

export const leadValidationSchema = z.object({
  name: z.string().min(2, "Full name must be at least 2 characters"),
  mobile: z.string().min(8, "Please enter a valid mobile number").max(20, "Mobile number too long"),
  email: z.string().email("Please enter a valid email address").or(z.string().optional()).or(z.literal("")),
  qualification: z.string().default("MBBS"),
  currentProfession: z.string().optional(),
  experienceYears: z.string().optional(),
  interestedCourseId: z.number().optional(),
  interestedCourseName: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  message: z.string().optional(),
  preferredCounsellingTime: z.string().optional(),
  leadSource: z.string().default("WEBSITE_FORM"),
  
  // Attribution & Session Data
  sessionId: z.string().optional(),
  utmSource: z.string().optional(),
  utmCampaign: z.string().optional(),
  utmMedium: z.string().optional(),
  utmContent: z.string().optional(),
  utmTerm: z.string().optional(),
  gclid: z.string().optional(),
  gbraid: z.string().optional(),
  wbraid: z.string().optional(),
  fbclid: z.string().optional(),
  landingPageUrl: z.string().optional(),
  referrerUrl: z.string().optional(),
  deviceType: z.string().optional(),
  browser: z.string().optional(),
  operatingSystem: z.string().optional(),
  trafficSource: z.string().optional(),
  trafficType: z.string().optional(),
});

export type ValidatedLeadInput = z.infer<typeof leadValidationSchema>;
