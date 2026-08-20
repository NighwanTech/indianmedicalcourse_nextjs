/**
 * Universal Analytics & Tracking Engine (GA4 + GTM + Google Ads + Meta Pixel + Clarity)
 * Domain: https://indianmedicalcourse.com
 * Dynamic Settings: Loaded from Website Settings (localStorage / Database)
 */

export const DEFAULT_GA4_ID = "G-3L5ZCL0SX4";
export const DEFAULT_GTM_ID = "GTM-PXHWHLL9";
export const GA_MEASUREMENT_ID = DEFAULT_GA4_ID;
export const GTM_CONTAINER_ID = DEFAULT_GTM_ID;
export const DEFAULT_GADS_CONVERSION_ID = "AW-16589177872";
export const DEFAULT_GADS_CONVERSION_LABEL = "ujPlCPC2u7UZEJCIq-Y9";

export interface AnalyticsEventParams {
  [key: string]: any;
}

/**
 * Intelligent Source & Attribution Inspector
 * Determines if the current visitor arrived from Google Ads (gclid, gbraid, wbraid, utm_source=google, etc.)
 */
export function isGoogleAdsVisitor(): boolean {
  if (typeof window === "undefined") return false;

  try {
    // 1. Check URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const gclid = urlParams.get("gclid");
    const gbraid = urlParams.get("gbraid");
    const wbraid = urlParams.get("wbraid");
    const utmSource = (urlParams.get("utm_source") || "").toLowerCase();
    const utmMedium = (urlParams.get("utm_medium") || "").toLowerCase();
    const utmCampaign = (urlParams.get("utm_campaign") || "").toLowerCase();

    if (gclid || gbraid || wbraid) return true;
    if (utmSource.includes("google") || utmSource.includes("gads") || utmSource.includes("adwords")) return true;
    if (utmMedium === "cpc" || utmMedium === "ppc" || utmMedium === "paid_search") return true;

    // 2. Check SessionStorage & LocalStorage attribution
    const raw = sessionStorage.getItem("imc_ad_attribution") || localStorage.getItem("imc_ad_attribution_last");
    if (raw) {
      const attr = JSON.parse(raw);
      if (attr.gclid || attr.gbraid || attr.wbraid) return true;
      const s = (attr.utmSource || attr.utm_source || "").toLowerCase();
      const m = (attr.utmMedium || attr.utm_medium || "").toLowerCase();
      const c = (attr.utmCampaign || attr.utm_campaign || "").toLowerCase();
      if (s.includes("google") || s.includes("gads") || s.includes("adwords")) return true;
      if (m === "cpc" || m === "ppc" || m === "paid_search") return true;
    }
  } catch (e) {
    console.error("Error inspecting ad attribution:", e);
  }
  return false;
}

// Safely push to Google Tag Manager dataLayer
export function pushToDataLayer(event: string, params: AnalyticsEventParams = {}) {
  if (typeof window === "undefined") return;

  (window as any).dataLayer = (window as any).dataLayer || [];
  (window as any).dataLayer.push({
    event,
    ...params,
    timestamp: new Date().toISOString(),
  });
}

// Safely dispatch to GA4 gtag
export function trackGAEvent(eventName: string, params: AnalyticsEventParams = {}) {
  if (typeof window === "undefined") return;

  if (typeof (window as any).gtag === "function") {
    (window as any).gtag("event", eventName, params);
  }

  // Dual-dispatch to GTM dataLayer
  pushToDataLayer(eventName, params);
}

/**
 * MASTER LEAD CONVERSION TRIGGER
 * ONLY called after lead is successfully saved in database, email is dispatched, and AIWCRM sync is complete.
 * 
 * CRITICAL RULE:
 * - If the visitor came from GOOGLE ADS (gclid / utm_source=google / cpc) -> sends conversion (+1) to Google Ads.
 * - If the visitor came from ANY OTHER SOURCE (organic, direct, facebook, whatsapp, referral) -> DOES NOT send +1 to Google Ads!
 */
import { 
  getOrCreateVisitorAttribution, 
  canTriggerGoogleAdsConversion, 
  markGoogleAdsConverted 
} from "./attribution";

export function fireLeadConversionSuccess(params: {
  courseName?: string;
  source?: string;
  doctorName?: string;
  specialty?: string;
  mobile?: string;
  email?: string;
  value?: number;
}) {
  if (typeof window === "undefined") return;

  const attribution = getOrCreateVisitorAttribution();
  const isGAds = attribution.isGoogleAds;
  const gAdsEnabled = localStorage.getItem("imc_google_ads_enabled") !== "false";
  const gAdsId = localStorage.getItem("imc_google_ads_id") || DEFAULT_GADS_CONVERSION_ID;
  const gAdsLabel = localStorage.getItem("imc_google_ads_label") || DEFAULT_GADS_CONVERSION_LABEL;
  const metaPixelEnabled = localStorage.getItem("imc_meta_pixel_enabled") !== "false";

  const leadVal = params.value || 1.0;

  // 1. Google Ads Conversion Event: Strictly ONE time per verified Google Ads lead/session/Click ID
  if (canTriggerGoogleAdsConversion(attribution) && gAdsEnabled && gAdsId && typeof (window as any).gtag === "function") {
    (window as any).gtag("event", "conversion", {
      send_to: `${gAdsId}/${gAdsLabel}`,
      value: leadVal,
      currency: "INR",
    });
    markGoogleAdsConverted(attribution);
    console.log("🎯 [Verified Single Conversion] Google Ads Conversion (+1) fired for Google Ads visitor.");
  } else if (!isGAds) {
    console.log("ℹ️ [Non-Google Traffic] Organic / Direct / Social lead — Google Ads Conversion skipped (+0 sent).");
  } else {
    console.log("🛡️ [Anti-Duplicate Guard] Google Ads conversion already fired for this Click ID / session. Duplicate prevented.");
  }

  // 2. Google Analytics 4 Event: generate_lead (Always fired so overall lead counts are accurate)
  if (typeof (window as any).gtag === "function") {
    (window as any).gtag("event", "generate_lead", {
      course: params.courseName || "General Fellowship",
      source: params.source || (isGAds ? "Google Ads" : "Website Form"),
      traffic_type: isGAds ? "google_ads" : "organic_direct",
      doctor_specialty: params.specialty || "MBBS Doctor",
      value: leadVal,
      currency: "INR",
    });
  }

  // 3. GTM DataLayer Push
  pushToDataLayer("generate_lead", {
    course: params.courseName || "Medical Course",
    source: params.source || "Website Form",
    traffic_type: isGAds ? "google_ads" : "organic_direct",
    isGoogleAds: isGAds,
    doctorName: params.doctorName || "Doctor",
    specialty: params.specialty || "MBBS",
    value: leadVal,
    currency: "INR",
  });

  // 4. Meta Pixel Lead Event (if enabled)
  if (metaPixelEnabled && typeof (window as any).fbq === "function") {
    (window as any).fbq("track", "Lead", {
      content_name: params.courseName || "Doctor Fellowship Lead",
      content_category: params.specialty || "Medical Post-Graduate",
      value: leadVal,
      currency: "INR",
    });
  }
}

// 1. Page View
export function trackPageView(url: string, title: string) {
  pushToDataLayer("page_view", {
    page_path: url,
    page_title: title,
    page_location: typeof window !== "undefined" ? window.location.href : "",
  });
}

// 2. Lead Submit
export function trackLeadSubmit(params: {
  formSource?: string;
  courseName?: string;
  specialty?: string;
  country?: string;
  leadValue?: number;
}) {
  fireLeadConversionSuccess({
    source: params.formSource,
    courseName: params.courseName,
    specialty: params.specialty,
    value: params.leadValue,
  });
}

// 3. Book Counselling
export function trackBookCounselling(params: {
  source?: string;
  courseName?: string;
  specialty?: string;
}) {
  trackGAEvent("book_counselling", {
    counselling_source: params.source || "Navigation CTA",
    course_name: params.courseName || "Admissions Guidance",
    specialty: params.specialty,
  });
}

// 4. Download Brochure
export function trackDownloadBrochure(params: {
  courseTitle: string;
  fileUrl?: string;
  courseCategory?: string;
}) {
  trackGAEvent("download_brochure", {
    course_title: params.courseTitle,
    course_category: params.courseCategory,
    file_url: params.fileUrl,
  });
}

// 5. Phone Click
export function trackPhoneClick(params: {
  phoneNumber?: string;
  location?: string;
}) {
  trackGAEvent("phone_click", {
    phone_number: params.phoneNumber || "+91 8295843006",
    click_location: params.location || "Header",
  });
}

// 6. WhatsApp Click
export function trackWhatsAppClick(params: {
  whatsappNumber?: string;
  location?: string;
  courseName?: string;
}) {
  trackGAEvent("whatsapp_click", {
    whatsapp_number: params.whatsappNumber || "+91 8295843006",
    click_location: params.location || "Floating Widget",
    course_name: params.courseName,
  });
}

// 7. Course Apply
export function trackCourseApply(params: {
  courseTitle: string;
  courseType?: string;
  feeINR?: number;
}) {
  trackGAEvent("course_apply", {
    course_title: params.courseTitle,
    course_type: params.courseType || "Fellowship",
    value: params.feeINR || 0,
    currency: "INR",
  });
}

// 8. Search Course
export function trackSearchCourse(query: string, resultsCount?: number) {
  trackGAEvent("search_course", {
    search_term: query,
    results_count: resultsCount,
  });
}

// 9. Video Play & Video Engagement
export function trackVideoPlay(params: {
  videoTitle: string;
  youtubeId: string;
  milestoneSeconds?: number;
  action?: "PLAY" | "30S_GATE" | "COMPLETE";
}) {
  trackGAEvent("video_play", {
    video_title: params.videoTitle,
    youtube_id: params.youtubeId,
    milestone_seconds: params.milestoneSeconds,
    action: params.action || "PLAY",
  });
}

export function trackVideoEngagement(params: {
  videoTitle: string;
  youtubeId: string;
  milestoneSeconds?: number;
  action?: "PLAY" | "30S_GATE" | "COMPLETE";
}) {
  trackGAEvent("video_engagement", {
    video_title: params.videoTitle,
    youtube_id: params.youtubeId,
    milestone_seconds: params.milestoneSeconds,
    action: params.action || "PLAY",
  });
}

// 10. Form Start
export function trackFormStart(params: {
  formName: string;
  courseName?: string;
}) {
  trackGAEvent("form_start", {
    form_name: params.formName,
    course_name: params.courseName,
  });
}

// 11. Form Submit
export function trackFormSubmit(params: {
  formName: string;
  courseName?: string;
  status?: string;
}) {
  trackGAEvent("form_submit", {
    form_name: params.formName,
    course_name: params.courseName,
    status: params.status || "SUCCESS",
  });
}

// 12. Exit Popup Submit
export function trackExitPopupSubmit(params: {
  courseName?: string;
  timeOnPageSeconds?: number;
}) {
  trackGAEvent("exit_popup_submit", {
    course_name: params.courseName || "Quick Apply Drawer",
    time_on_page: params.timeOnPageSeconds,
  });
}
