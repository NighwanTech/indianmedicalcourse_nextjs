import { getOrCreateVisitorAttribution } from "@/lib/attribution";

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface LeadSubmissionData {
  id?: string;
  uuid?: string;
  name: string;
  mobile: string;
  email?: string;
  qualification?: string;
  specialty?: string;
  interestedCourse?: string;
  interestedCourseName?: string;
  city?: string;
  state?: string;
  country?: string;
  formSource?: string;
  leadSource?: string;
  channel?: "GOOGLE_ADS" | "META_ADS" | "ORGANIC";
  channelLabel?: string;
  landingPageUrl?: string;
  utmSource?: string;
  utmCampaign?: string;
  utmMedium?: string;
  utmContent?: string;
  utmTerm?: string;
  gclid?: string;
  gbraid?: string;
  wbraid?: string;
  fbclid?: string;
  deviceType?: string;
  browser?: string;
  operatingSystem?: string;
  notes?: string;
  priority?: "URGENT" | "HIGH" | "MEDIUM" | "LOW";
  score?: number;
  createdAt?: string;
}

// In-memory debounce cache to strictly prevent rapid double-submissions
const recentSubmissions = new Map<string, { timestamp: number; refId: string }>();

function cleanDoctorName(rawName: string): string {
  if (!rawName) return "Doctor";
  let trimmed = rawName.trim();
  // Strip leading dr. / dr / DR / Dr.
  trimmed = trimmed.replace(/^dr\.?\s*/i, "").trim();
  if (!trimmed) return "Doctor";
  // Capitalize each word nicely
  const formatted = trimmed
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
  return `Dr. ${formatted}`;
}

export async function submitLeadAction(
  input: FormData | LeadSubmissionData
): Promise<ApiResponse<any>> {
  try {
    let raw: LeadSubmissionData;

    if (input instanceof FormData) {
      const nameVal = (input.get("name") || input.get("fullName") || "Doctor") as string;
      const mobileVal = (input.get("mobile") || input.get("mobileNumber") || "") as string;
      const emailVal = (input.get("email") || input.get("emailAddress") || "") as string;
      const qualVal = (input.get("qualification") || input.get("specialty") || "MBBS") as string;
      const courseVal = (input.get("interestedCourseName") || input.get("interestedCourse") || input.get("courseName") || "Clinical Fellowship") as string;
      const cityVal = (input.get("city") || "") as string;
      const countryVal = (input.get("country") || "India") as string;
      const sourceVal = (input.get("leadSource") || input.get("formSource") || "WEBSITE_FORM") as string;

      raw = {
        name: nameVal,
        mobile: mobileVal,
        email: emailVal,
        qualification: qualVal,
        specialty: qualVal,
        interestedCourse: courseVal,
        interestedCourseName: courseVal,
        city: cityVal,
        country: countryVal,
        formSource: sourceVal,
        leadSource: (input.get("trafficSource") as string) || undefined,
        channelLabel: (input.get("trafficSource") as string) || undefined,
        landingPageUrl: (input.get("landingPageUrl") as string) || undefined,
        utmSource: (input.get("utmSource") as string) || undefined,
        utmCampaign: (input.get("utmCampaign") as string) || undefined,
        utmMedium: (input.get("utmMedium") as string) || undefined,
        utmContent: (input.get("utmContent") as string) || undefined,
        utmTerm: (input.get("utmTerm") as string) || undefined,
        gclid: (input.get("gclid") as string) || undefined,
        gbraid: (input.get("gbraid") as string) || undefined,
        wbraid: (input.get("wbraid") as string) || undefined,
        fbclid: (input.get("fbclid") as string) || undefined,
        deviceType: (input.get("deviceType") as string) || undefined,
        browser: (input.get("browser") as string) || undefined,
        operatingSystem: (input.get("operatingSystem") as string) || undefined,
      };
    } else {
      raw = { ...input };
    }

    const cleanMobile = (raw.mobile || "").replace(/\D/g, "");
    const cleanEmail = (raw.email || "").trim().toLowerCase();
    const docName = cleanDoctorName(raw.name);
    const crsName = raw.interestedCourse || raw.interestedCourseName || "Clinical Fellowship";

    // 1. Anti-Duplicate Check (Debounce identical submissions within 15 seconds)
    const duplicateKey = `${cleanMobile}_${crsName.toLowerCase()}`;
    const now = Date.now();
    const cached = recentSubmissions.get(duplicateKey);
    if (cached && now - cached.timestamp < 15000) {
      // Duplicate submission detected in short window - return existing refId safely
      return {
        success: true,
        data: {
          refId: cached.refId,
          message: "Application Submitted Successfully",
          isDuplicateSuppressed: true,
        },
      };
    }

    // Get client attribution if not already supplied
    let attribution: any = {};
    if (typeof window !== "undefined") {
      try {
        attribution = getOrCreateVisitorAttribution();
      } catch (e) {}
    }

    const refId = raw.uuid || raw.id || `lead_${now}_${Math.random().toString(36).substring(2, 7)}`;
    recentSubmissions.set(duplicateKey, { timestamp: now, refId });

    // Determine channel
    const gclid = raw.gclid || attribution.gclid;
    const fbclid = raw.fbclid || attribution.fbclid;
    const utmSource = raw.utmSource || attribution.utmSource;
    const utmCampaign = raw.utmCampaign || attribution.utmCampaign;
    const utmMedium = raw.utmMedium || attribution.utmMedium;
    const utmContent = raw.utmContent || attribution.utmContent;
    const utmTerm = raw.utmTerm || attribution.utmTerm;

    let channel: "GOOGLE_ADS" | "META_ADS" | "ORGANIC" = raw.channel || "ORGANIC";
    let channelLabel = raw.channelLabel || raw.leadSource || attribution.trafficSource || "Direct";

    if (gclid || (utmSource && /google|gads|cpc/i.test(utmSource))) {
      channel = "GOOGLE_ADS";
      channelLabel = "Google Ads";
    } else if (fbclid || (utmSource && /facebook|instagram|meta|fb|ig/i.test(utmSource))) {
      channel = "META_ADS";
      channelLabel = /instagram|ig/i.test(utmSource || "") ? "Instagram Ads" : "Facebook Ads";
    } else if (attribution.trafficSource === "WhatsApp" || /whatsapp/i.test(raw.formSource || "")) {
      channelLabel = "WhatsApp Direct";
    }

    // Determine Priority & Score
    const qual = raw.qualification || raw.specialty || "MBBS";
    let priority: "URGENT" | "HIGH" | "MEDIUM" | "LOW" = raw.priority || "HIGH";
    let score = raw.score || 85;
    if (qual.includes("MD") || qual.includes("MS") || qual.includes("Postgraduate") || qual.includes("Specialist")) {
      priority = "URGENT";
      score = 95;
    } else if (qual.includes("MBBS")) {
      priority = "HIGH";
      score = 90;
    }

    const fullLeadItem = {
      id: refId,
      uuid: refId,
      name: docName,
      mobile: raw.mobile,
      email: cleanEmail || `${cleanMobile || "doctor"}@imc-applicant.in`,
      qualification: qual,
      specialty: qual,
      interestedCourse: crsName,
      city: raw.city || "",
      state: raw.state || raw.country || "India",
      country: raw.country || "India",
      formSource: raw.formSource || "Website Main Form",
      leadSource: channelLabel,
      channel,
      channelLabel,
      landingPageUrl: raw.landingPageUrl || attribution.landingPageUrl || "",
      leadStatus: "NEW",
      priority,
      score,
      createdAt: raw.createdAt || new Date().toISOString(),
      notes: raw.notes || `Qualification: ${qual}. Form: ${raw.formSource || "Website Form"}. City: ${raw.city || "Not Specified"}`,
      deviceType: raw.deviceType || attribution.deviceType || "Desktop",
      browser: raw.browser || attribution.browser || "Chrome",
      operatingSystem: raw.operatingSystem || attribution.operatingSystem || "Windows",
      utmSource,
      utmCampaign,
      utmMedium,
      utmContent,
      utmTerm,
      gclid,
      fbclid,
      attribution: {
        gclid,
        fbclid,
        utmSource,
        utmCampaign,
        utmMedium,
        utmContent,
        utmTerm,
      },
    };

    // 2. Save lead EXACTLY ONCE to local CRM storage
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("imc_captured_leads");
        const existing: any[] = stored ? JSON.parse(stored) : [];

        // Check if identical lead already exists in storage (same mobile + same course within 30s)
        const isExistingInStorage = existing.some((item) => {
          const itemMobile = String(item.mobile || "").replace(/\D/g, "");
          const isSamePhone = itemMobile === cleanMobile && cleanMobile.length > 0;
          const isSameCourse = String(item.interestedCourse || "").toLowerCase() === crsName.toLowerCase();
          const itemTime = new Date(item.createdAt).getTime();
          const isRecent = Math.abs(now - itemTime) < 30000;
          return (isSamePhone && isSameCourse && isRecent) || item.uuid === refId || item.id === refId;
        });

        if (!isExistingInStorage) {
          const updated = [fullLeadItem, ...existing];
          localStorage.setItem("imc_captured_leads", JSON.stringify(updated));
          // Dispatch storage event for real-time update in open tabs/windows
          window.dispatchEvent(new Event("storage"));
          window.dispatchEvent(new CustomEvent("imc_lead_captured", { detail: fullLeadItem }));
        }
      } catch (storageErr) {
        console.error("[Lead Storage Error]", storageErr);
      }
    }

    return {
      success: true,
      data: {
        refId,
        message: "Application Submitted Successfully",
      },
    };
  } catch (error: any) {
    console.error("[Lead Action Error]", error);
    return {
      success: false,
      error: error.message || "Failed to submit lead",
    };
  }
}
