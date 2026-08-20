import { DoctorQualification, LeadPriority, LeadSource, LeadStatus } from "@prisma/client";

export interface CreateLeadDTO {
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
  referrerUrl?: string;
  ipAddress?: string;
  browser?: string;
  operatingSystem?: string;
  deviceType?: string;
}

export interface LeadFilterDTO {
  status?: LeadStatus;
  priority?: LeadPriority;
  source?: LeadSource;
  counsellorId?: number;
  search?: string;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  limit?: number;
}
