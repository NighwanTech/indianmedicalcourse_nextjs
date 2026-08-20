"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { isGoogleAdsVisitor, DEFAULT_GADS_CONVERSION_ID, DEFAULT_GADS_CONVERSION_LABEL } from "@/lib/analytics";

// Safe helper to extract and persist UTM / Google Click ID / Meta Click ID parameters
export function getSavedAttribution() {
  if (typeof window === "undefined") return {};
  try {
    const data = sessionStorage.getItem("imc_ad_attribution");
    return data ? JSON.parse(data) : {};
  } catch (e) {
    return {};
  }
}

// Global conversion trigger helper called upon lead generation & thank-you page
export function trackGoogleAdsConversion(conversionLabel?: string, value: number = 1.0) {
  if (typeof window === "undefined") return;

  const isGAds = isGoogleAdsVisitor();
  const adsId = localStorage.getItem("imc_google_ads_id") || DEFAULT_GADS_CONVERSION_ID;
  const label = conversionLabel || localStorage.getItem("imc_google_ads_label") || DEFAULT_GADS_CONVERSION_LABEL;
  const isGAdsEnabled = localStorage.getItem("imc_google_ads_enabled") !== "false";
  const metaPixelId = localStorage.getItem("imc_meta_pixel_id") || process.env.NEXT_PUBLIC_META_PIXEL_ID;

  // 1. Trigger Google Ads Conversion Event ONLY if the visitor arrived via Google Ads
  if (isGAds && isGAdsEnabled && (window as any).gtag && adsId) {
    (window as any).gtag("event", "conversion", {
      send_to: `${adsId}/${label}`,
      value: value,
      currency: "INR",
    });
    console.log("🎯 Google Ads Conversion +1 Counted (From Google Ads)");
  } else {
    console.log("ℹ️ Skipped Google Ads Conversion (Visitor did not originate from Google Ads)");
  }

  // 2. Trigger GA4 generate_lead event
  if ((window as any).gtag) {
    (window as any).gtag("event", "generate_lead", {
      currency: "INR",
      value: value,
      traffic_type: isGAds ? "google_ads" : "organic_direct",
    });
  }

  // 3. Trigger Meta Pixel Lead Event
  if ((window as any).fbq) {
    (window as any).fbq("track", "Lead", {
      content_name: "Doctor Fellowship Application",
      currency: "INR",
      value: value,
    });
  }
}

export function GoogleAdsTracker() {
  const [googleAdsId, setGoogleAdsId] = useState<string | null>(null);
  const [metaPixelId, setMetaPixelId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Load dynamic IDs from localStorage
    const savedGAds = localStorage.getItem("imc_google_ads_id") || DEFAULT_GADS_CONVERSION_ID;
    const savedMeta = localStorage.getItem("imc_meta_pixel_id") || process.env.NEXT_PUBLIC_META_PIXEL_ID;
    if (savedGAds) setGoogleAdsId(savedGAds);
    if (savedMeta) setMetaPixelId(savedMeta);

    // Capture URL Search Parameters on landing
    const urlParams = new URLSearchParams(window.location.search);
    const gclid = urlParams.get("gclid");
    const gbraid = urlParams.get("gbraid");
    const wbraid = urlParams.get("wbraid");
    const fbclid = urlParams.get("fbclid");
    const utm_source = urlParams.get("utm_source");
    const utm_medium = urlParams.get("utm_medium");
    const utm_campaign = urlParams.get("utm_campaign");
    const utm_term = urlParams.get("utm_term");
    const utm_content = urlParams.get("utm_content");

    // If ad click or campaign detected, store in sessionStorage & localStorage
    if (gclid || gbraid || wbraid || fbclid || utm_source || utm_campaign) {
      const attribution = {
        gclid: gclid || undefined,
        gbraid: gbraid || undefined,
        wbraid: wbraid || undefined,
        fbclid: fbclid || undefined,
        utmSource: utm_source || undefined,
        utmMedium: utm_medium || undefined,
        utmCampaign: utm_campaign || undefined,
        utmTerm: utm_term || undefined,
        utmContent: utm_content || undefined,
        landingPageUrl: window.location.href,
        firstTouchTimestamp: new Date().toISOString(),
      };

      try {
        sessionStorage.setItem("imc_ad_attribution", JSON.stringify(attribution));
        localStorage.setItem("imc_ad_attribution_last", JSON.stringify(attribution));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  return null;
}
