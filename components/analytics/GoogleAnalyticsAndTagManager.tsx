"use client";

import React, { useEffect, useState, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";
import { 
  DEFAULT_GA4_ID, 
  DEFAULT_GTM_ID, 
  DEFAULT_GADS_CONVERSION_ID,
  pushToDataLayer 
} from "@/lib/analytics";

function RouteAndEventObserver() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 1. Automatic Page View & Route Change Tracking
  useEffect(() => {
    if (typeof window === "undefined") return;

    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");

    // Push Page View to GTM dataLayer
    pushToDataLayer("page_view", {
      page_path: url,
      page_location: window.location.href,
      page_title: document.title,
    });

    // GA4 config page view
    const gaId = localStorage.getItem("imc_ga_measurement_id") || DEFAULT_GA4_ID;
    if (typeof (window as any).gtag === "function") {
      (window as any).gtag("config", gaId, {
        page_path: url,
        page_location: window.location.href,
        page_title: document.title,
      });
    }
  }, [pathname, searchParams]);

  // 2. Automated Scroll Depth, Outbound Links, and File Downloads
  useEffect(() => {
    if (typeof window === "undefined") return;

    const trackedMilestones = new Set<number>();
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (docHeight <= 0) return;
      const scrollPercent = Math.round((scrollTop / docHeight) * 100);

      const milestones = [25, 50, 75, 90];
      for (const m of milestones) {
        if (scrollPercent >= m && !trackedMilestones.has(m)) {
          trackedMilestones.add(m);
          pushToDataLayer("scroll_depth", {
            scroll_percentage: m,
            page_path: window.location.pathname,
          });
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest("a");
      if (!target || !target.href) return;

      const href = target.href;
      const url = new URL(href, window.location.href);
      const isInternal = url.hostname === window.location.hostname;

      // File Download Check
      const downloadExtensions = [".pdf", ".docx", ".doc", ".xlsx", ".zip", ".csv"];
      const isFile = downloadExtensions.some((ext) => url.pathname.toLowerCase().endsWith(ext));
      if (isFile) {
        pushToDataLayer("file_download", {
          file_url: href,
          file_name: url.pathname.split("/").pop(),
        });
      }

      // Outbound Link Check
      if (!isInternal && !href.startsWith("javascript:") && !href.startsWith("mailto:") && !href.startsWith("tel:")) {
        pushToDataLayer("outbound_click", {
          outbound_url: href,
          target_hostname: url.hostname,
        });
      }
    };

    document.addEventListener("click", handleClick, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("click", handleClick);
    };
  }, [pathname]);

  return null;
}

export function GoogleAnalyticsAndTagManager() {
  const [gaId, setGaId] = useState(DEFAULT_GA4_ID);
  const [gtmId, setGtmId] = useState(DEFAULT_GTM_ID);
  const [gAdsId, setGAdsId] = useState(DEFAULT_GADS_CONVERSION_ID);

  // Toggles
  const [isAnalyticsEnabled, setIsAnalyticsEnabled] = useState(true);
  const [isGtmEnabled, setIsGtmEnabled] = useState(true);
  const [isGAdsEnabled, setIsGAdsEnabled] = useState(true);
  const [isMetaEnabled, setIsMetaEnabled] = useState(true);
  const [isClarityEnabled, setIsClarityEnabled] = useState(true);
  const [isHotjarEnabled, setIsHotjarEnabled] = useState(false);

  // Other Provider IDs
  const [metaPixelId, setMetaPixelId] = useState("");
  const [linkedInId, setLinkedInId] = useState("");
  const [clarityId, setClarityId] = useState("");
  const [hotjarId, setHotjarId] = useState("");
  const [googleVerification, setGoogleVerification] = useState("");
  const [bingVerification, setBingVerification] = useState("");

  const loadSettings = () => {
    if (typeof window === "undefined") return;

    const savedGa = localStorage.getItem("imc_ga_measurement_id");
    const savedGtm = localStorage.getItem("imc_gtm_container_id");
    const savedGAds = localStorage.getItem("imc_google_ads_id");

    const toggleAnalytics = localStorage.getItem("imc_ga_enabled");
    const toggleGtm = localStorage.getItem("imc_gtm_enabled");
    const toggleGAds = localStorage.getItem("imc_google_ads_enabled");
    const toggleMeta = localStorage.getItem("imc_meta_pixel_enabled");
    const toggleClarity = localStorage.getItem("imc_clarity_enabled");
    const toggleHotjar = localStorage.getItem("imc_hotjar_enabled");

    const savedMeta = localStorage.getItem("imc_meta_pixel_id");
    const savedLinkedIn = localStorage.getItem("imc_linkedin_insight_tag");
    const savedClarity = localStorage.getItem("imc_microsoft_clarity_id");
    const savedHotjar = localStorage.getItem("imc_hotjar_id");
    const savedGSC = localStorage.getItem("imc_gsc_verification");
    const savedBing = localStorage.getItem("imc_bing_verification");

    if (savedGa) setGaId(savedGa);
    if (savedGtm) setGtmId(savedGtm);
    if (savedGAds) setGAdsId(savedGAds);

    if (toggleAnalytics !== null) setIsAnalyticsEnabled(toggleAnalytics === "true");
    if (toggleGtm !== null) setIsGtmEnabled(toggleGtm === "true");
    if (toggleGAds !== null) setIsGAdsEnabled(toggleGAds === "true");
    if (toggleMeta !== null) setIsMetaEnabled(toggleMeta === "true");
    if (toggleClarity !== null) setIsClarityEnabled(toggleClarity === "true");
    if (toggleHotjar !== null) setIsHotjarEnabled(toggleHotjar === "true");

    if (savedMeta) setMetaPixelId(savedMeta);
    if (savedLinkedIn) setLinkedInId(savedLinkedIn);
    if (savedClarity) setClarityId(savedClarity);
    if (savedHotjar) setHotjarId(savedHotjar);
    if (savedGSC) setGoogleVerification(savedGSC);
    if (savedBing) setBingVerification(savedBing);
  };

  useEffect(() => {
    loadSettings();
    window.addEventListener("storage", loadSettings);
    return () => window.removeEventListener("storage", loadSettings);
  }, []);

  return (
    <>
      {/* Search Console & Bing Verification Meta Tags */}
      {googleVerification && (
        <meta name="google-site-verification" content={googleVerification} />
      )}
      {bingVerification && (
        <meta name="msvalidate.01" content={bingVerification} />
      )}

      {/* 1. Google Tag Manager (GTM) Container */}
      {isGtmEnabled && gtmId && (
        <Script
          id="google-tag-manager"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${gtmId}');
            `,
          }}
        />
      )}

      {/* 2. Google Analytics 4 Script (afterInteractive) */}
      {isAnalyticsEnabled && gaId && (
        <>
          <Script
            id="google-analytics-script"
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
          />
          <Script
            id="google-analytics-init"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}', {
                  page_path: window.location.pathname,
                  send_page_view: true,
                  transport_type: 'beacon'
                });
                ${isGAdsEnabled && gAdsId ? `gtag('config', '${gAdsId}');` : ''}
              `,
            }}
          />
        </>
      )}

      {/* 3. Meta Pixel */}
      {isMetaEnabled && metaPixelId && (
        <Script
          id="meta-pixel-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${metaPixelId}');
              fbq('track', 'PageView');
            `,
          }}
        />
      )}

      {/* 4. LinkedIn Insight Tag */}
      {linkedInId && (
        <Script
          id="linkedin-insight-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              _linkedin_partner_id = "${linkedInId}";
              window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
              window._linkedin_data_partner_ids.push(_linkedin_partner_id);
              (function(l) {
                if (!l){window.lintrk = function(a,b){window.lintrk.q.push([a,b])};
                window.lintrk.q=[]}
                var s = document.getElementsByTagName("script")[0];
                var b = document.createElement("script");
                b.type = "text/javascript";b.async = true;
                b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
                s.parentNode.insertBefore(b, s);
              })(window.lintrk);
            `,
          }}
        />
      )}

      {/* 5. Microsoft Clarity */}
      {isClarityEnabled && clarityId && (
        <Script
          id="microsoft-clarity-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "${clarityId}");
            `,
          }}
        />
      )}

      {/* 6. Hotjar */}
      {isHotjarEnabled && hotjarId && (
        <Script
          id="hotjar-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(h,o,t,j,a,r){
                  h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                  h._hjSettings={hjid:${hotjarId},hjsv:6};
                  a=o.getElementsByTagName('head')[0];
                  r=o.createElement('script');r.async=1;
                  r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                  a.appendChild(r);
              })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
            `,
          }}
        />
      )}

      {/* 7. GTM NoScript Fallback */}
      {isGtmEnabled && gtmId && (
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
      )}

      {/* Route & Event Observer */}
      <Suspense fallback={null}>
        <RouteAndEventObserver />
      </Suspense>
    </>
  );
}
