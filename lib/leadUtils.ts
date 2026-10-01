export interface LeadItem {
  id: string;
  uuid: string;
  name: string;
  mobile: string;
  email: string;
  qualification?: string;
  interestedCourse: string;
  city?: string;
  state?: string;
  country?: string;
  formSource?: string;
  leadSource?: string;
  channel?: "GOOGLE_ADS" | "META_ADS" | "ORGANIC";
  channelLabel?: string;
  landingPageUrl?: string;
  leadStatus: string;
  priority: "URGENT" | "HIGH" | "MEDIUM" | "LOW";
  score: number;
  createdAt: string;
  notes?: string;
  deviceType?: string;
  browser?: string;
  operatingSystem?: string;
  utmSource?: string;
  utmCampaign?: string;
  utmMedium?: string;
  utmContent?: string;
  utmTerm?: string;
  gclid?: string;
  fbclid?: string;
  attribution?: {
    gclid?: string;
    fbclid?: string;
    utmSource?: string;
    utm_source?: string;
    utmCampaign?: string;
    utm_campaign?: string;
    utmMedium?: string;
    utm_medium?: string;
    utmTerm?: string;
    utm_term?: string;
    utmContent?: string;
  };
}

// Robust Date & Time Formatting Helper
export function formatLeadDateTime(dateInput: string | Date | undefined): { 
  formattedDate: string; 
  formattedTime: string; 
  fullDisplay: string; 
  relative: string; 
  fullIso: string; 
  rawDate: Date 
} {
  let d: Date;
  if (!dateInput) {
    d = new Date();
  } else if (dateInput instanceof Date) {
    d = dateInput;
  } else {
    d = new Date(dateInput);
    if (isNaN(d.getTime())) {
      if (typeof dateInput === "string" && dateInput.includes("min")) {
        const match = dateInput.match(/\d+/);
        const m = match ? parseInt(match[0], 10) : 10;
        d = new Date(Date.now() - m * 60 * 1000);
      } else if (typeof dateInput === "string" && dateInput.includes("hour")) {
        const match = dateInput.match(/\d+/);
        const h = match ? parseInt(match[0], 10) : 1;
        d = new Date(Date.now() - h * 3600 * 1000);
      } else {
        d = new Date();
      }
    }
  }

  const formattedDate = d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const formattedTime = d.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  const fullDisplay = `${formattedDate}, ${formattedTime}`;

  const now = Date.now();
  const diffMs = now - d.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  let relative = "Just now";
  if (diffMins < 1) relative = "Just now";
  else if (diffMins < 60) relative = `${diffMins}m ago`;
  else if (diffHours < 24) relative = `${diffHours}h ago`;
  else if (diffDays === 1) relative = "Yesterday";
  else if (diffDays < 30) relative = `${diffDays}d ago`;
  else relative = formattedDate;

  return { formattedDate, formattedTime, fullDisplay, relative, fullIso: d.toISOString(), rawDate: d };
}

export function normalizeLead(raw: any, index: number): LeadItem {
  if (!raw || typeof raw !== "object") {
    const nowIso = new Date().toISOString();
    return {
      id: String(index + 1),
      uuid: `lead_${index + 1}`,
      name: "Doctor Applicant",
      mobile: "Not Provided",
      email: "Not Provided",
      interestedCourse: "Medical Fellowship",
      leadStatus: "NEW",
      priority: "HIGH",
      score: 85,
      createdAt: nowIso,
    };
  }

  const attribution = raw.attribution || {
    gclid: raw.gclid || undefined,
    fbclid: raw.fbclid || undefined,
    utmSource: raw.utmSource || raw.utm_source || undefined,
    utmCampaign: raw.utmCampaign || raw.utm_campaign || undefined,
    utmMedium: raw.utmMedium || raw.utm_medium || undefined,
    utmTerm: raw.utmTerm || raw.utm_term || undefined,
  };

  const utmSourceStr = String(attribution.utmSource || attribution.utm_source || raw.leadSource || "").toLowerCase();
  
  let channel: "GOOGLE_ADS" | "META_ADS" | "ORGANIC" = raw.channel || "ORGANIC";
  let channelLabel = raw.channelLabel || "Organic / Direct";

  if (attribution.gclid || utmSourceStr.includes("google") || utmSourceStr.includes("gads")) {
    channel = "GOOGLE_ADS";
    channelLabel = "Google Ads";
  } else if (attribution.fbclid || utmSourceStr.includes("facebook") || utmSourceStr.includes("instagram") || utmSourceStr.includes("meta")) {
    channel = "META_ADS";
    channelLabel = "Meta / Instagram Ads";
  }

  let createdAt = raw.createdAt;
  if (!createdAt || createdAt === "Just now" || createdAt === "Recently" || typeof createdAt !== "string" || !createdAt.includes("T")) {
    if (typeof createdAt === "string" && createdAt.includes("min")) {
      createdAt = "2026-08-18T12:15:00.000Z";
    } else if (typeof createdAt === "string" && createdAt.includes("hour")) {
      createdAt = "2026-08-18T11:00:00.000Z";
    } else {
      createdAt = "2026-08-18T09:30:00.000Z";
    }
  }

  let rawName = String(raw.name || raw.fullName || "Applicant").trim();
  const cleanedDoctorName = rawName || "Applicant";

  return {
    id: String(raw.id || raw.uuid || index + 1),
    uuid: String(raw.uuid || `lead_${raw.id || index + 1}`),
    name: cleanedDoctorName,
    mobile: String(raw.mobile || raw.mobileNumber || raw.phone || "Not Provided"),
    email: String(raw.email || raw.emailAddress || "Not Provided"),
    qualification: raw.qualification && raw.qualification !== "null" && raw.qualification !== "undefined" ? String(raw.qualification) : "",
    interestedCourse: String(raw.interestedCourse || raw.interestedCourseName || raw.course || "Fellowship Program"),
    city: String(raw.city || "").trim(),
    state: String(raw.state || raw.country || raw.addressCountry || "India"),
    country: String(raw.country || "India"),
    formSource: String(raw.formSource || raw.source || "Hero Main Form"),
    leadSource: raw.leadSource || channelLabel,
    channel: channel,
    channelLabel: channelLabel,
    landingPageUrl: String(raw.landingPageUrl || ""),
    leadStatus: String(raw.leadStatus || raw.status || "NEW"),
    priority: (raw.priority === "URGENT" || raw.priority === "HIGH" || raw.priority === "MEDIUM" || raw.priority === "LOW") ? raw.priority : "HIGH",
    score: typeof raw.score === "number" ? raw.score : 85,
    createdAt: createdAt,
    notes: String(raw.notes || raw.message || ""),
    deviceType: raw.deviceType || "Desktop",
    browser: raw.browser || "Chrome",
    operatingSystem: raw.operatingSystem || "Windows",
    utmSource: raw.utmSource || attribution.utmSource,
    utmCampaign: raw.utmCampaign || attribution.utmCampaign,
    utmMedium: raw.utmMedium || attribution.utmMedium,
    utmContent: raw.utmContent || attribution.utmContent,
    utmTerm: raw.utmTerm || attribution.utmTerm,
    gclid: raw.gclid || attribution.gclid,
    fbclid: raw.fbclid || attribution.fbclid,
    attribution: attribution,
  };
}

export function deduplicateLeadsList(rawLeads: any[]): LeadItem[] {
  const normalized = rawLeads.map((item, idx) => normalizeLead(item, idx));
  const seenIds = new Set<string>();
  const deduplicated: LeadItem[] = [];

  const DUMMY_UUIDS = new Set(["lead_1786971874086_4osw12x", "lead_1786971874086_99a8x1", "lead_1786971874086_bb23x9"]);
  const DUMMY_NAMES = new Set(["Dr. Anirudh Kulkarni", "Dr. Meenakshi Sundaram", "Dr. Rohit Singhal"]);

  for (const lead of normalized) {
    if (seenIds.has(lead.id) || seenIds.has(lead.uuid)) {
      continue;
    }
    if (DUMMY_UUIDS.has(lead.uuid) || DUMMY_NAMES.has(lead.name)) {
      continue;
    }

    const cleanMobile = lead.mobile.replace(/\D/g, "");
    const cleanCourse = lead.interestedCourse.trim().toLowerCase();

    // Check if duplicate of an already kept lead (same mobile digits + same course within 120s)
    const isDuplicate = deduplicated.some((existing) => {
      const existingMobile = existing.mobile.replace(/\D/g, "");
      if (cleanMobile && existingMobile && cleanMobile === existingMobile && cleanMobile.length >= 8) {
        if (existing.interestedCourse.trim().toLowerCase() === cleanCourse) {
          const time1 = new Date(existing.createdAt).getTime();
          const time2 = new Date(lead.createdAt).getTime();
          if (isNaN(time1) || isNaN(time2) || Math.abs(time1 - time2) < 120000) {
            return true;
          }
        }
      }
      return false;
    });

    if (!isDuplicate) {
      seenIds.add(lead.id);
      seenIds.add(lead.uuid);
      deduplicated.push(lead);
    }
  }

  return deduplicated;
}

export interface LeadQualityValidationInput {
  name: string;
  mobile: string;
  email?: string;
  country?: string;
  qualification?: string;
  honeypot?: string;
  formStartTime?: number;
  captchaAnswer?: string;
  expectedCaptcha?: string;
}

/**
 * Universal Fake Lead & Bot Gatekeeper Filter
 * Validates doctor qualification, filters bots, rejects fake phone numbers/names, and verifies security challenge.
 */
export function validateLeadQuality(input: LeadQualityValidationInput): {
  isValid: boolean;
  error?: string;
} {
  // 1. Honeypot check (bots automatically fill hidden inputs)
  if (input.honeypot && input.honeypot.trim().length > 0) {
    return { isValid: false, error: "Automated submission rejected by security filter." };
  }

  // 2. Minimum form interaction time (scripts submit within < 1.5 seconds)
  if (input.formStartTime && Date.now() - input.formStartTime < 1500) {
    return { isValid: false, error: "Form submitted too quickly. Please review your details." };
  }

  // 3. Doctor Qualification Gatekeeper
  const qual = (input.qualification || "").trim().toLowerCase();
  if (
    qual.includes("not a doctor") || 
    qual.includes("not_doctor") || 
    qual.includes("student / general") || 
    qual.includes("non-medical")
  ) {
    return {
      isValid: false,
      error: "Admission is strictly restricted to licensed medical practitioners (MBBS/MD/MS/AYUSH/Dental). Non-medical applicants are not eligible.",
    };
  }

  // 4. Name Quality & Fake Check
  const name = (input.name || "").trim();
  if (name.length < 2) {
    return { isValid: false, error: "Please enter your doctor full name." };
  }
  const cleanName = name.toLowerCase().replace(/[^a-z]/g, "");
  const FAKE_NAME_PATTERNS = ["test", "testing", "asdf", "qwerty", "fake", "dummy", "spam", "xxxx", "abcd", "sample"];
  if (FAKE_NAME_PATTERNS.some((p) => cleanName === p || cleanName.startsWith(p + "test"))) {
    return { isValid: false, error: "Please enter a valid doctor name." };
  }

  // 5. Phone Number Quality & Fake Number Check
  const rawDigits = (input.mobile || "").replace(/\D/g, "");
  if (!rawDigits || rawDigits.length < 8) {
    return { isValid: false, error: "Please enter a valid mobile number with at least 8 digits." };
  }

  // Check repeating digits e.g. 9999999999, 0000000000, 1111111111
  const allSameDigits = /^(\d)\1+$/.test(rawDigits);
  if (allSameDigits) {
    return { isValid: false, error: "Please enter a valid phone number. Repeating digits are not accepted." };
  }

  // Check obvious sequence patterns
  const SEQUENTIAL_PATTERNS = ["1234567890", "0123456789", "9876543210", "12345678", "87654321"];
  if (SEQUENTIAL_PATTERNS.some((seq) => rawDigits.includes(seq))) {
    return { isValid: false, error: "Please enter a genuine personal mobile number." };
  }

  // India Specific Validation
  const isIndia = !input.country || input.country.toLowerCase() === "india" || (rawDigits.startsWith("91") && rawDigits.length === 12);
  let indianTenDigits = rawDigits;
  if (indianTenDigits.startsWith("91") && indianTenDigits.length === 12) {
    indianTenDigits = indianTenDigits.substring(2);
  } else if (indianTenDigits.startsWith("0") && indianTenDigits.length === 11) {
    indianTenDigits = indianTenDigits.substring(1);
  }

  if (isIndia && (input.country?.toLowerCase() === "india" || indianTenDigits.length === 10)) {
    if (indianTenDigits.length !== 10) {
      return { isValid: false, error: "Indian mobile numbers must be exactly 10 digits." };
    }
    const firstDigit = indianTenDigits[0];
    if (!["6", "7", "8", "9"].includes(firstDigit)) {
      return { isValid: false, error: "Indian mobile numbers must begin with 6, 7, 8, or 9." };
    }
  }

  // 6. Email validation
  if (input.email && input.email.trim()) {
    const email = input.email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { isValid: false, error: "Please enter a valid email address." };
    }
    const DISPOSABLE_DOMAINS = [
      "test.com", "example.com", "fake.com", "mailinator.com", "tempmail.com", "guerrillamail.com", "10minutemail.com", "throwaway.com"
    ];
    const domain = email.split("@")[1];
    if (DISPOSABLE_DOMAINS.includes(domain)) {
      return { isValid: false, error: "Temporary and disposable email addresses are not accepted." };
    }
  }

  // 7. Security CAPTCHA / Math Challenge Check (if present)
  if (input.expectedCaptcha !== undefined && input.captchaAnswer !== undefined) {
    if (input.captchaAnswer.trim() !== input.expectedCaptcha.trim()) {
      return { isValid: false, error: "Security verification code does not match. Please try again." };
    }
  }

  return { isValid: true };
}

