/**
 * Universal Visitor Attribution & Session Engine
 * Captures, normalizes, and persists full visitor attribution, UTM parameters, device info, and Google Click IDs.
 */

export interface VisitorAttribution {
  sessionId: string;
  gclid?: string;
  gbraid?: string;
  wbraid?: string;
  fbclid?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  landingPageUrl: string;
  referrerUrl?: string;
  deviceType: "Mobile" | "Desktop" | "Tablet";
  browser: string;
  operatingSystem: string;
  trafficSource: "Google Ads" | "Facebook Ads" | "Instagram Ads" | "Organic Search" | "Direct" | "WhatsApp" | "Referral";
  trafficType: "paid_search" | "paid_social" | "organic" | "direct" | "referral" | "messaging";
  isGoogleAds: boolean;
  convertedToGoogleAds: boolean;
  googleConversionAt?: string;
  firstTouchTimestamp: string;
}

const SESSION_STORAGE_KEY = "imc_visitor_session";
const LOCAL_STORAGE_KEY = "imc_visitor_attribution_permanent";
const CONVERTED_CLICK_IDS_KEY = "imc_converted_click_ids";

// Helper to detect Device Type
export function detectDeviceType(): "Mobile" | "Desktop" | "Tablet" {
  if (typeof window === "undefined") return "Desktop";
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return "Tablet";
  }
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    return "Mobile";
  }
  return "Desktop";
}

// Helper to detect Browser Name
export function detectBrowser(): string {
  if (typeof window === "undefined") return "Unknown Browser";
  const ua = navigator.userAgent;
  if (ua.includes("Firefox/")) return "Firefox";
  if (ua.includes("Edg/")) return "Edge";
  if (ua.includes("Chrome/") && !ua.includes("Edg/")) return "Chrome";
  if (ua.includes("Safari/") && !ua.includes("Chrome/")) return "Safari";
  if (ua.includes("OPR/") || ua.includes("Opera/")) return "Opera";
  return "Browser";
}

// Helper to detect OS
export function detectOS(): string {
  if (typeof window === "undefined") return "Unknown OS";
  const ua = navigator.userAgent;
  if (ua.includes("Win")) return "Windows";
  if (ua.includes("Mac")) return "macOS";
  if (ua.includes("Android")) return "Android";
  if (ua.includes("iPhone") || ua.includes("iPad")) return "iOS";
  if (ua.includes("Linux")) return "Linux";
  return "OS";
}

// Initialize or Retrieve Visitor Attribution
export function getOrCreateVisitorAttribution(): VisitorAttribution {
  if (typeof window === "undefined") {
    return {
      sessionId: `sess_${Date.now()}`,
      landingPageUrl: "https://indianmedicalcourse.com",
      deviceType: "Desktop",
      browser: "Chrome",
      operatingSystem: "Windows",
      trafficSource: "Direct",
      trafficType: "direct",
      isGoogleAds: false,
      convertedToGoogleAds: false,
      firstTouchTimestamp: new Date().toISOString(),
    };
  }

  // 1. Check existing session
  try {
    const existing = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (existing) {
      return JSON.parse(existing);
    }
  } catch (e) {}

  // 2. Parse current URL Parameters
  const urlParams = new URLSearchParams(window.location.search);
  const gclid = urlParams.get("gclid") || undefined;
  const gbraid = urlParams.get("gbraid") || undefined;
  const wbraid = urlParams.get("wbraid") || undefined;
  const fbclid = urlParams.get("fbclid") || undefined;
  const utmSource = urlParams.get("utm_source") || undefined;
  const utmMedium = urlParams.get("utm_medium") || undefined;
  const utmCampaign = urlParams.get("utm_campaign") || undefined;
  const utmContent = urlParams.get("utm_content") || undefined;
  const utmTerm = urlParams.get("utm_term") || undefined;

  const referrer = typeof document !== "undefined" ? document.referrer : "";
  const landingPage = window.location.href;

  // Determine Traffic Source & Type
  let trafficSource: VisitorAttribution["trafficSource"] = "Direct";
  let trafficType: VisitorAttribution["trafficType"] = "direct";
  let isGoogleAds = false;

  const srcLower = (utmSource || "").toLowerCase();
  const medLower = (utmMedium || "").toLowerCase();
  const refLower = referrer.toLowerCase();

  // A. Google Ads Check (Highest Priority)
  if (
    gclid ||
    gbraid ||
    wbraid ||
    srcLower.includes("google") && (medLower.includes("cpc") || medLower.includes("ppc") || medLower.includes("adwords") || medLower.includes("paid")) ||
    srcLower.includes("gads")
  ) {
    trafficSource = "Google Ads";
    trafficType = "paid_search";
    isGoogleAds = true;
  }
  // B. Facebook / Instagram Paid Ads
  else if (fbclid || srcLower.includes("fb") || srcLower.includes("facebook") || srcLower.includes("instagram") || srcLower.includes("ig")) {
    if (srcLower.includes("instagram") || srcLower.includes("ig")) {
      trafficSource = "Instagram Ads";
    } else {
      trafficSource = "Facebook Ads";
    }
    trafficType = "paid_social";
  }
  // C. WhatsApp
  else if (srcLower.includes("whatsapp") || srcLower.includes("wa") || refLower.includes("whatsapp")) {
    trafficSource = "WhatsApp";
    trafficType = "messaging";
  }
  // D. Organic Search
  else if (refLower.includes("google.com") || refLower.includes("bing.com") || refLower.includes("yahoo.com") || refLower.includes("duckduckgo.com")) {
    trafficSource = "Organic Search";
    trafficType = "organic";
  }
  // E. Referral
  else if (referrer && !refLower.includes(window.location.hostname)) {
    trafficSource = "Referral";
    trafficType = "referral";
  }

  const sessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

  const attribution: VisitorAttribution = {
    sessionId,
    gclid,
    gbraid,
    wbraid,
    utmSource,
    utmMedium,
    utmCampaign,
    utmContent,
    utmTerm,
    landingPageUrl: landingPage,
    referrerUrl: referrer || undefined,
    deviceType: detectDeviceType(),
    browser: detectBrowser(),
    operatingSystem: detectOS(),
    trafficSource,
    trafficType,
    isGoogleAds,
    convertedToGoogleAds: false,
    firstTouchTimestamp: new Date().toISOString(),
  };

  try {
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(attribution));
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(attribution));
  } catch (e) {}

  return attribution;
}

// Anti-duplicate protection checks
export function canTriggerGoogleAdsConversion(attribution: VisitorAttribution): boolean {
  if (typeof window === "undefined") return false;
  if (!attribution.isGoogleAds) return false;
  if (attribution.convertedToGoogleAds) return false;

  // Check converted click IDs to prevent duplicate conversion across separate tabs/reloads
  const clickId = attribution.gclid || attribution.gbraid || attribution.wbraid;
  if (clickId) {
    try {
      const convertedIds: string[] = JSON.parse(localStorage.getItem(CONVERTED_CLICK_IDS_KEY) || "[]");
      if (convertedIds.includes(clickId)) {
        return false;
      }
    } catch (e) {}
  }

  return true;
}

// Mark Google Ads conversion as fired permanently
export function markGoogleAdsConverted(attribution: VisitorAttribution) {
  if (typeof window === "undefined") return;

  attribution.convertedToGoogleAds = true;
  attribution.googleConversionAt = new Date().toISOString();

  try {
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(attribution));
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(attribution));

    const clickId = attribution.gclid || attribution.gbraid || attribution.wbraid;
    if (clickId) {
      const convertedIds: string[] = JSON.parse(localStorage.getItem(CONVERTED_CLICK_IDS_KEY) || "[]");
      if (!convertedIds.includes(clickId)) {
        convertedIds.push(clickId);
        localStorage.setItem(CONVERTED_CLICK_IDS_KEY, JSON.stringify(convertedIds));
      }
    }
  } catch (e) {}
}
