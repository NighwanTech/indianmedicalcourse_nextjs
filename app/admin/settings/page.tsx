"use client";

import React, { useState, useEffect } from "react";
import { siteSettings } from "@/lib/data";
import { DEFAULT_301_REDIRECTS, RedirectRule, REDIRECTS_STORAGE_KEY } from "@/lib/redirects";
import { 
  GA_MEASUREMENT_ID, 
  GTM_CONTAINER_ID, 
  DEFAULT_GADS_CONVERSION_ID, 
  DEFAULT_GADS_CONVERSION_LABEL 
} from "@/lib/analytics";
import { 
  CRMConfiguration, 
  CRMFieldMapping, 
  CRMProviderType, 
  CRMQueueJob, 
  DEFAULT_CRM_CONFIG 
} from "@/lib/crm/types";
import { crmService } from "@/lib/crm/crmService";
import { crmQueue } from "@/lib/crm/crmQueue";
import { 
  Settings, 
  Save, 
  ShieldCheck, 
  Phone, 
  Mail, 
  MapPin, 
  Globe, 
  Share2, 
  Code, 
  CheckCircle2, 
  Sliders,
  Sparkles,
  BarChart3,
  Search,
  ArrowRightLeft,
  FileCode,
  Tag,
  Plus,
  Trash2,
  ExternalLink,
  Lock,
  Layers,
  Zap,
  Activity,
  RotateCcw,
  Clock,
  CheckSquare,
  Square,
  Eye,
  EyeOff,
  AlertCircle,
  Play
} from "lucide-react";

export default function AdminSettingsPage() {
  const [activeGroup, setActiveGroup] = useState("CRM_INTEGRATION");
  const [isSaved, setIsSaved] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState("Settings Saved Successfully!");

  // Company Details
  const [brandName, setBrandName] = useState(siteSettings.brandName);
  const [phone, setPhone] = useState(siteSettings.hotlinePhone);
  const [whatsapp, setWhatsapp] = useState(siteSettings.whatsappNumber);
  const [email, setEmail] = useState(siteSettings.supportEmail);
  const [address, setAddress] = useState(siteSettings.registeredAddress);
  const [announcement, setAnnouncement] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("imc_announcement_text");
      if (saved && saved.trim()) return saved;
    }
    return siteSettings.announcementText;
  });

  // Google Analytics & GTM
  const [gaId, setGaId] = useState(GA_MEASUREMENT_ID);
  const [gtmId, setGtmId] = useState(GTM_CONTAINER_ID);
  const [isGtmEnabled, setIsGtmEnabled] = useState(true);
  const [isGaEnabled, setIsGaEnabled] = useState(true);
  const [isGAdsEnabled, setIsGAdsEnabled] = useState(true);
  const [isMetaEnabled, setIsMetaEnabled] = useState(true);
  const [isClarityEnabled, setIsClarityEnabled] = useState(true);
  const [isHotjarEnabled, setIsHotjarEnabled] = useState(false);

  // Marketing & Ad Tags
  const [gAdsId, setGAdsId] = useState(DEFAULT_GADS_CONVERSION_ID);
  const [gAdsLabel, setGAdsLabel] = useState(DEFAULT_GADS_CONVERSION_LABEL);
  const [metaPixel, setMetaPixel] = useState(siteSettings.metaPixelId || "");
  const [linkedInTag, setLinkedInTag] = useState("");
  const [clarityId, setClarityId] = useState("");
  const [hotjarId, setHotjarId] = useState("");
  const [searchConsoleCode, setSearchConsoleCode] = useState("");
  const [bingVerification, setBingVerification] = useState("");

  // SEO & Meta Defaults
  const [defaultMetaTitle, setDefaultMetaTitle] = useState("Indian Medical Course | Fellowship & PG Diploma Programs for Doctors");
  const [defaultMetaDescription, setDefaultMetaDescription] = useState("Explore 150+ Clinical Fellowships, Post-Graduate Diplomas, and Advanced Certification Courses for Doctors with bedside hospital rotations and CPD accreditation.");
  const [defaultKeywords, setDefaultKeywords] = useState("medical fellowship, PG diploma, clinical cardiology, emergency medicine, fetal medicine, medical courses India");
  const [defaultOgImage, setDefaultOgImage] = useState("https://indianmedicalcourse.com/images/imc-og-banner.jpg");
  const [robotsTxt, setRobotsTxt] = useState(`User-agent: *
Allow: /
Disallow: /admin
Disallow: /admin/*
Disallow: /login
Disallow: /api/private

Sitemap: https://indianmedicalcourse.com/sitemap.xml`);

  // 301 Redirects State
  const [redirects, setRedirects] = useState<RedirectRule[]>(DEFAULT_301_REDIRECTS);
  const [newSource, setNewSource] = useState("");
  const [newTarget, setNewTarget] = useState("");
  const [newStatus, setNewStatus] = useState<301 | 302>(301);

  // Security Master Password
  const [masterPassword, setMasterPassword] = useState("admin@imc2026");
  const [showMasterPassword, setShowMasterPassword] = useState(false);

  // WhatsApp Configuration State
  const [whatsappMode, setWhatsappMode] = useState<"MANUAL" | "META_API">("MANUAL");
  const [waMessageTemplate, setWaMessageTemplate] = useState("Hello IMC Admissions Team, I want to know more about 2026 Medical Fellowships, Clinical Rotations & 0% EMI options.");
  const [waAccessToken, setWaAccessToken] = useState("");
  const [waPhoneNumberId, setWaPhoneNumberId] = useState("");
  const [waBusinessAccountId, setWaBusinessAccountId] = useState("");
  const [waWebhookToken, setWaWebhookToken] = useState("");

  // =========================================================================
  // ENTERPRISE CRM INTEGRATION STATE
  // =========================================================================
  const [crmConfig, setCrmConfig] = useState<CRMConfiguration>(DEFAULT_CRM_CONFIG);
  const [showCrmSecret, setShowCrmSecret] = useState(false);
  const [isTestingCrm, setIsTestingCrm] = useState(false);
  const [crmTestResult, setCrmTestResult] = useState<{
    success: boolean;
    message: string;
    latencyMs: number;
  } | null>(null);

  // Custom Field Mapping Creator State
  const [newWebsiteField, setNewWebsiteField] = useState("");
  const [newCrmField, setNewCrmField] = useState("");
  const [newFieldType, setNewFieldType] = useState<"string" | "number" | "boolean">("string");

  // Queue Jobs State
  const [queueJobs, setQueueJobs] = useState<CRMQueueJob[]>([]);

  // Load from LocalStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedGa = localStorage.getItem("imc_ga_measurement_id");
      const savedGtm = localStorage.getItem("imc_gtm_container_id");
      const savedGAds = localStorage.getItem("imc_google_ads_id");
      const savedGAdsLabel = localStorage.getItem("imc_google_ads_label");

      const savedGtmToggle = localStorage.getItem("imc_gtm_enabled");
      const savedGaToggle = localStorage.getItem("imc_ga_enabled");
      const savedGAdsToggle = localStorage.getItem("imc_google_ads_enabled");
      const savedMetaToggle = localStorage.getItem("imc_meta_pixel_enabled");
      const savedClarityToggle = localStorage.getItem("imc_clarity_enabled");
      const savedHotjarToggle = localStorage.getItem("imc_hotjar_enabled");

      if (savedGa) setGaId(savedGa);
      if (savedGtm) setGtmId(savedGtm);
      if (savedGAds) setGAdsId(savedGAds);
      if (savedGAdsLabel) setGAdsLabel(savedGAdsLabel);

      if (savedGtmToggle !== null) setIsGtmEnabled(savedGtmToggle === "true");
      if (savedGaToggle !== null) setIsGaEnabled(savedGaToggle === "true");
      if (savedGAdsToggle !== null) setIsGAdsEnabled(savedGAdsToggle === "true");
      if (savedMetaToggle !== null) setIsMetaEnabled(savedMetaToggle === "true");
      if (savedClarityToggle !== null) setIsClarityEnabled(savedClarityToggle === "true");
      if (savedHotjarToggle !== null) setIsHotjarEnabled(savedHotjarToggle === "true");

      const savedMeta = localStorage.getItem("imc_meta_pixel_id");
      const savedLinkedIn = localStorage.getItem("imc_linkedin_tag_id");
      const savedClarity = localStorage.getItem("imc_clarity_id");
      const savedHotjar = localStorage.getItem("imc_hotjar_id");
      const savedSearchConsole = localStorage.getItem("imc_search_console_code");
      const savedBing = localStorage.getItem("imc_bing_verification");

      if (savedMeta) setMetaPixel(savedMeta);
      if (savedLinkedIn) setLinkedInTag(savedLinkedIn);
      if (savedClarity) setClarityId(savedClarity);
      if (savedHotjar) setHotjarId(savedHotjar);
      if (savedSearchConsole) setSearchConsoleCode(savedSearchConsole);
      if (savedBing) setBingVerification(savedBing);

      const savedRedirects = localStorage.getItem(REDIRECTS_STORAGE_KEY);
      if (savedRedirects) {
        try {
          setRedirects(JSON.parse(savedRedirects));
        } catch (e) {}
      }

      // Load CRM Config & Queue
      const loadedCrmConfig = crmService.getConfig();
      setCrmConfig(loadedCrmConfig);
      setQueueJobs(crmQueue.getJobs());
    }
  }, []);

  const showToast = (msg: string) => {
    setNotificationMsg(msg);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      localStorage.setItem("imc_brand_name", brandName);
      localStorage.setItem("imc_hotline_phone", phone);
      localStorage.setItem("imc_whatsapp_number", whatsapp);
      localStorage.setItem("imc_support_email", email);
      localStorage.setItem("imc_registered_address", address);
      localStorage.setItem("imc_announcement_text", announcement);

      localStorage.setItem("imc_ga_measurement_id", gaId);
      localStorage.setItem("imc_gtm_container_id", gtmId);
      localStorage.setItem("imc_google_ads_id", gAdsId);
      localStorage.setItem("imc_google_ads_label", gAdsLabel);

      localStorage.setItem("imc_gtm_enabled", String(isGtmEnabled));
      localStorage.setItem("imc_ga_enabled", String(isGaEnabled));
      localStorage.setItem("imc_google_ads_enabled", String(isGAdsEnabled));
      localStorage.setItem("imc_meta_pixel_enabled", String(isMetaEnabled));
      localStorage.setItem("imc_clarity_enabled", String(isClarityEnabled));
      localStorage.setItem("imc_hotjar_enabled", String(isHotjarEnabled));

      localStorage.setItem("imc_meta_pixel_id", metaPixel);
      localStorage.setItem("imc_linkedin_tag_id", linkedInTag);
      localStorage.setItem("imc_clarity_id", clarityId);
      localStorage.setItem("imc_hotjar_id", hotjarId);
      localStorage.setItem("imc_search_console_code", searchConsoleCode);
      localStorage.setItem("imc_bing_verification", bingVerification);

      // Save CRM Config
      crmService.saveConfig(crmConfig);
    }
    showToast("All Website & Enterprise CRM Settings Saved!");
  };

  // CRM Connection Test Action
  const handleTestCrmConnection = async () => {
    setIsTestingCrm(true);
    setCrmTestResult(null);
    try {
      const res = await crmService.testConnection(crmConfig);
      setCrmTestResult(res);
      if (res.success) {
        showToast("CRM Connection Succeeded!");
      } else {
        showToast("CRM Connection Failed — Check URL or Auth");
      }
    } catch (e: any) {
      setCrmTestResult({
        success: false,
        message: e.message || "Connection failed",
        latencyMs: 0,
      });
    } finally {
      setIsTestingCrm(false);
    }
  };

  // CRM Field Mapping Handlers
  const handleToggleFieldMapping = (id: string) => {
    const updatedMappings = crmConfig.fieldMappings.map((m) =>
      m.id === id ? { ...m, isEnabled: !m.isEnabled } : m
    );
    const updated = { ...crmConfig, fieldMappings: updatedMappings };
    setCrmConfig(updated);
    crmService.saveConfig(updated);
  };

  const handleUpdateCrmFieldKey = (id: string, newKey: string) => {
    const updatedMappings = crmConfig.fieldMappings.map((m) =>
      m.id === id ? { ...m, crmField: newKey } : m
    );
    const updated = { ...crmConfig, fieldMappings: updatedMappings };
    setCrmConfig(updated);
    crmService.saveConfig(updated);
  };

  const handleAddCustomFieldMapping = () => {
    if (!newWebsiteField.trim() || !newCrmField.trim()) {
      alert("Please specify both Website Field and Target CRM Field.");
      return;
    }
    const newMapping: CRMFieldMapping = {
      id: `m_custom_${Date.now()}`,
      websiteField: newWebsiteField.trim(),
      crmField: newCrmField.trim(),
      fieldType: newFieldType,
      isRequired: false,
      isEnabled: true,
    };
    const updated = {
      ...crmConfig,
      fieldMappings: [...crmConfig.fieldMappings, newMapping],
    };
    setCrmConfig(updated);
    crmService.saveConfig(updated);
    setNewWebsiteField("");
    setNewCrmField("");
    showToast(`Added Mapping: ${newMapping.websiteField} ➔ ${newMapping.crmField}`);
  };

  const handleDeleteFieldMapping = (id: string) => {
    const updated = {
      ...crmConfig,
      fieldMappings: crmConfig.fieldMappings.filter((m) => m.id !== id),
    };
    setCrmConfig(updated);
    crmService.saveConfig(updated);
    showToast("Field mapping removed.");
  };

  // CRM Event Trigger Toggle
  const handleToggleEvent = (eventType: string) => {
    const updatedEvents = crmConfig.events.map((e) =>
      e.eventType === eventType ? { ...e, isEnabled: !e.isEnabled } : e
    );
    const updated = { ...crmConfig, events: updatedEvents };
    setCrmConfig(updated);
    crmService.saveConfig(updated);
  };

  // Queue Retries
  const handleRetryQueueJob = async (jobId: string) => {
    await crmQueue.retryJob(jobId);
    setQueueJobs(crmQueue.getJobs());
    showToast("Retrying sync job in background...");
  };

  const handleClearCompletedQueue = () => {
    crmQueue.clearCompletedJobs();
    setQueueJobs(crmQueue.getJobs());
    showToast("Synced jobs cleared from history.");
  };

  // 301 Redirect Handlers
  const handleAddRedirect = () => {
    if (!newSource.trim() || !newTarget.trim()) return;
    const rule: RedirectRule = {
      id: `red_${Date.now()}`,
      sourcePath: newSource.trim().startsWith("/") ? newSource.trim() : `/${newSource.trim()}`,
      targetPath: newTarget.trim().startsWith("/") || newTarget.trim().startsWith("http") ? newTarget.trim() : `/${newTarget.trim()}`,
      statusCode: newStatus,
      isActive: true,
      notes: "Custom 301 Redirect added from Admin",
      createdAt: new Date().toISOString().split("T")[0],
    };

    const updated = [rule, ...redirects];
    setRedirects(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem(REDIRECTS_STORAGE_KEY, JSON.stringify(updated));
    }
    setNewSource("");
    setNewTarget("");
    showToast("301 Redirect Rule Added!");
  };

  const handleDeleteRedirect = (id: string) => {
    const updated = redirects.filter((r) => r.id !== id);
    setRedirects(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem(REDIRECTS_STORAGE_KEY, JSON.stringify(updated));
    }
    showToast("Redirect rule deleted.");
  };

  const settingGroups = [
    { key: "CRM_INTEGRATION", label: "⚡ Enterprise CRM & Webhooks", badge: "Live Queue" },
    { key: "ANALYTICS_GTM", label: "📊 Google Analytics & GTM", badge: "Official" },
    { key: "GLOBAL_SEO", label: "🔍 Search Console & SEO", badge: "Live" },
    { key: "REDIRECTS_301", label: "🔀 301 Redirects Manager", badge: "SEO" },
    { key: "COMPANY_DETAILS", label: "🏢 Company & Brand" },
    { key: "CONTACT_INFO", label: "📞 Contact & Phone" },
    { key: "ANNOUNCEMENT_BAR", label: "📢 Top Ribbon Bar" },
    { key: "WHATSAPP_CONFIG", label: "💬 WhatsApp Routing" },
    { key: "SECURITY_PIN", label: "🔒 Master Password" },
  ];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 font-display">
            Website, SEO & Enterprise CRM Settings
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Generic CRM Integration layer, visual field mapping builder, event triggers, and non-blocking background sync queue.
          </p>
        </div>

        {isSaved && (
          <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-2 rounded-xl animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{notificationMsg}</span>
          </div>
        )}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Navigation Sidebar */}
        <div className="space-y-1 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs h-fit">
          {settingGroups.map((group) => {
            const isActive = activeGroup === group.key;
            return (
              <button
                key={group.key}
                type="button"
                onClick={() => setActiveGroup(group.key)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer text-left ${
                  isActive
                    ? "bg-[#0B4F9C] text-white shadow-xs"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <span>{group.label}</span>
                {group.badge && (
                  <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-md ${
                    isActive ? "bg-white/20 text-white" : "bg-blue-100 text-blue-800"
                  }`}>
                    {group.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Content Box */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6">
            <form onSubmit={handleSaveAll} className="space-y-6">

              {/* ========================================================================= */}
              {/* TAB 1: ENTERPRISE CRM INTEGRATION & VISUAL MAPPING BUILDER                 */}
              {/* ========================================================================= */}
              {activeGroup === "CRM_INTEGRATION" && (
                <div className="space-y-6">
                  
                  {/* Top CRM Title & Master Toggle */}
                  <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="text-base font-black text-slate-900 font-display flex items-center gap-2">
                        <Zap className="w-5 h-5 text-amber-500" />
                        <span>Generic Enterprise CRM Integration Layer</span>
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Connect AIWCRM, Webhook (Zapier/Make/Pabbly), or any Custom REST API with non-blocking queue & backoff retries.
                      </p>
                    </div>

                    <div className="flex items-center gap-3 bg-slate-50 px-3 py-1.5 rounded-2xl border border-slate-200">
                      <span className="text-xs font-bold text-slate-700">CRM Sync:</span>
                      <button
                        type="button"
                        onClick={() => setCrmConfig({ ...crmConfig, enabled: !crmConfig.enabled })}
                        className={`text-xs font-extrabold px-3 py-1 rounded-xl transition-all cursor-pointer ${
                          crmConfig.enabled
                            ? "bg-emerald-600 text-white shadow-xs"
                            : "bg-slate-200 text-slate-600"
                        }`}
                      >
                        {crmConfig.enabled ? "ACTIVE (ON)" : "DISABLED (OFF)"}
                      </button>
                    </div>
                  </div>

                  {/* Provider & Credentials Box */}
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                    <h4 className="text-xs font-extrabold uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
                      <Settings className="w-4 h-4 text-blue-600" />
                      <span>1. Provider & Authentication Credentials</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Provider Select */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          CRM Provider
                        </label>
                        <select
                          value={crmConfig.provider}
                          onChange={(e) => setCrmConfig({ ...crmConfig, provider: e.target.value as CRMProviderType })}
                          className="w-full text-xs font-bold p-2.5 bg-white border border-slate-200 rounded-xl cursor-pointer"
                        >
                          <option value="AIWCRM">AIWCRM (Native Enterprise CRM)</option>
                          <option value="WEBHOOK">Generic Webhook (Zapier / Make / Pabbly)</option>
                          <option value="CUSTOM_REST_API">Custom REST API Endpoint</option>
                          <option value="DISABLED">Disabled (Skip CRM Sync)</option>
                        </select>
                      </div>

                      {/* Auth Header Type */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Authentication Method
                        </label>
                        <select
                          value={crmConfig.authHeaderType}
                          onChange={(e: any) => setCrmConfig({ ...crmConfig, authHeaderType: e.target.value })}
                          className="w-full text-xs font-bold p-2.5 bg-white border border-slate-200 rounded-xl cursor-pointer"
                        >
                          <option value="Bearer">Bearer Token (Authorization: Bearer ...)</option>
                          <option value="x-api-key">API Key Header (x-api-key: ...)</option>
                          <option value="Basic">Basic Auth (Username / Password)</option>
                          <option value="None">None (Public / Webhook Secret in URL)</option>
                        </select>
                      </div>
                    </div>

                    {/* API Base URL / Webhook URL */}
                    <div className="grid grid-cols-1 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {crmConfig.provider === "WEBHOOK" ? "Webhook Target URL" : "API Base URL / Endpoint"}
                        </label>
                        <input
                          type="text"
                          value={crmConfig.provider === "WEBHOOK" ? (crmConfig.webhookUrl || "") : crmConfig.apiBaseUrl}
                          onChange={(e) => {
                            if (crmConfig.provider === "WEBHOOK") {
                              setCrmConfig({ ...crmConfig, webhookUrl: e.target.value });
                            } else {
                              setCrmConfig({ ...crmConfig, apiBaseUrl: e.target.value });
                            }
                          }}
                          placeholder={crmConfig.provider === "WEBHOOK" ? "https://hooks.zapier.com/hooks/catch/..." : "https://api.aiwcrm.com/v1/leads"}
                          className="w-full text-xs font-mono p-2.5 bg-white border border-slate-200 rounded-xl focus:border-blue-500"
                        />
                      </div>
                    </div>

                    {/* API Key / Basic Auth Fields */}
                    {crmConfig.authHeaderType !== "Basic" && crmConfig.authHeaderType !== "None" && (
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          API Key / Bearer Secret Token
                        </label>
                        <div className="relative">
                          <input
                            type={showCrmSecret ? "text" : "password"}
                            value={crmConfig.apiKey || ""}
                            onChange={(e) => setCrmConfig({ ...crmConfig, apiKey: e.target.value })}
                            placeholder="Enter API Key or Secret Token..."
                            className="w-full text-xs font-mono p-2.5 pr-10 bg-white border border-slate-200 rounded-xl focus:border-blue-500"
                          />
                          <button
                            type="button"
                            onClick={() => setShowCrmSecret(!showCrmSecret)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                          >
                            {showCrmSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    )}

                    {crmConfig.authHeaderType === "Basic" && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Username</label>
                          <input
                            type="text"
                            value={crmConfig.username || ""}
                            onChange={(e) => setCrmConfig({ ...crmConfig, username: e.target.value })}
                            placeholder="CRM Username"
                            className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                          <input
                            type="password"
                            value={crmConfig.password || ""}
                            onChange={(e) => setCrmConfig({ ...crmConfig, password: e.target.value })}
                            placeholder="CRM Password"
                            className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl"
                          />
                        </div>
                      </div>
                    )}

                    {/* Timeout, Max Retries & Logging */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-200 text-xs">
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                          Request Timeout (ms)
                        </label>
                        <input
                          type="number"
                          value={crmConfig.timeoutMs || 5000}
                          onChange={(e) => setCrmConfig({ ...crmConfig, timeoutMs: Number(e.target.value) || 5000 })}
                          className="w-full text-xs font-bold p-2 bg-white border border-slate-200 rounded-xl"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                          Max Retry Attempts
                        </label>
                        <input
                          type="number"
                          value={crmConfig.maxRetryAttempts || 5}
                          onChange={(e) => setCrmConfig({ ...crmConfig, maxRetryAttempts: Number(e.target.value) || 5 })}
                          className="w-full text-xs font-bold p-2 bg-white border border-slate-200 rounded-xl"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                          Detailed Logging
                        </label>
                        <button
                          type="button"
                          onClick={() => setCrmConfig({ ...crmConfig, enableLogging: !crmConfig.enableLogging })}
                          className={`w-full text-xs font-bold p-2 rounded-xl border transition-all cursor-pointer ${
                            crmConfig.enableLogging
                              ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                              : "bg-slate-100 text-slate-600 border-slate-200"
                          }`}
                        >
                          {crmConfig.enableLogging ? "Enabled (Verbose)" : "Disabled"}
                        </button>
                      </div>
                    </div>

                    {/* Test Connection Button & Result */}
                    <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <button
                        type="button"
                        onClick={handleTestCrmConnection}
                        disabled={isTestingCrm}
                        className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50"
                      >
                        <Play className={`w-3.5 h-3.5 ${isTestingCrm ? 'animate-spin' : ''}`} />
                        <span>{isTestingCrm ? "Pinging Endpoint..." : "Test Connection Probe"}</span>
                      </button>

                      {crmTestResult && (
                        <div className={`text-xs font-bold p-2.5 rounded-xl flex items-center gap-2 ${
                          crmTestResult.success
                            ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
                            : "bg-red-100 text-red-900 border border-red-300"
                        }`}>
                          {crmTestResult.success ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                          )}
                          <span>{crmTestResult.message}</span>
                        </div>
                      )}
                    </div>

                  </div>

                  {/* ========================================================================= */}
                  {/* SECTION 2: VISUAL DYNAMIC FIELD MAPPING BUILDER                           */}
                  {/* ========================================================================= */}
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <h4 className="text-xs font-extrabold uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
                          <ArrowRightLeft className="w-4 h-4 text-blue-600" />
                          <span>2. Visual Field Mapping Builder (No Code Needed)</span>
                        </h4>
                        <p className="text-[11px] text-slate-500">
                          Map website submission fields directly to your target CRM property names.
                        </p>
                      </div>
                      <span className="text-[11px] font-mono font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-xl">
                        {crmConfig.fieldMappings.filter((m) => m.isEnabled).length} Active Mappings
                      </span>
                    </div>

                    <div className="border border-slate-200 rounded-2xl overflow-hidden">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-extrabold uppercase text-slate-400">
                          <tr>
                            <th className="py-2.5 px-3 w-10">Active</th>
                            <th className="py-2.5 px-3">Website Field</th>
                            <th className="py-2.5 px-3 w-6 text-center">➔</th>
                            <th className="py-2.5 px-3">Target CRM Key (Editable)</th>
                            <th className="py-2.5 px-3">Type</th>
                            <th className="py-2.5 px-3 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {crmConfig.fieldMappings.map((m) => (
                            <tr key={m.id} className="hover:bg-slate-50/50">
                              <td className="py-2.5 px-3">
                                <button
                                  type="button"
                                  onClick={() => handleToggleFieldMapping(m.id)}
                                  className="cursor-pointer text-slate-400 hover:text-blue-600"
                                >
                                  {m.isEnabled ? (
                                    <CheckSquare className="w-4 h-4 text-blue-600" />
                                  ) : (
                                    <Square className="w-4 h-4 text-slate-300" />
                                  )}
                                </button>
                              </td>

                              <td className="py-2.5 px-3">
                                <div className="font-mono font-bold text-slate-900">
                                  {m.websiteField}
                                </div>
                                {m.isRequired && (
                                  <span className="text-[9px] font-extrabold text-amber-600 bg-amber-50 px-1 py-0.2 rounded-sm">
                                    Required
                                  </span>
                                )}
                              </td>

                              <td className="py-2.5 px-3 text-center text-slate-400 font-bold">
                                ➔
                              </td>

                              <td className="py-2.5 px-3">
                                <input
                                  type="text"
                                  value={m.crmField}
                                  onChange={(e) => handleUpdateCrmFieldKey(m.id, e.target.value)}
                                  className="w-full text-xs font-mono font-bold text-blue-700 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 focus:bg-white focus:border-blue-500"
                                />
                              </td>

                              <td className="py-2.5 px-3 text-slate-500 font-mono text-[11px]">
                                {m.fieldType}
                              </td>

                              <td className="py-2.5 px-3 text-right">
                                {!m.isRequired && (
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteFieldMapping(m.id)}
                                    className="p-1 text-slate-400 hover:text-red-600 cursor-pointer"
                                    title="Delete Mapping"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Add Custom Field Mapping Dock */}
                    <div className="p-3.5 bg-blue-50/50 border border-blue-200 rounded-2xl flex flex-col sm:flex-row items-center gap-2">
                      <div className="flex-1 w-full">
                        <input
                          type="text"
                          placeholder="Website Field (e.g. customDocId)"
                          value={newWebsiteField}
                          onChange={(e) => setNewWebsiteField(e.target.value)}
                          className="w-full text-xs font-mono p-2 bg-white border border-slate-200 rounded-xl"
                        />
                      </div>
                      <span className="text-slate-400 font-bold">➔</span>
                      <div className="flex-1 w-full">
                        <input
                          type="text"
                          placeholder="CRM Target Field (e.g. external_id)"
                          value={newCrmField}
                          onChange={(e) => setNewCrmField(e.target.value)}
                          className="w-full text-xs font-mono p-2 bg-white border border-slate-200 rounded-xl"
                        />
                      </div>
                      <select
                        value={newFieldType}
                        onChange={(e: any) => setNewFieldType(e.target.value)}
                        className="text-xs p-2 bg-white border border-slate-200 rounded-xl font-bold cursor-pointer"
                      >
                        <option value="string">string</option>
                        <option value="number">number</option>
                        <option value="boolean">boolean</option>
                      </select>
                      <button
                        type="button"
                        onClick={handleAddCustomFieldMapping}
                        className="inline-flex items-center gap-1 bg-[#0B4F9C] hover:bg-[#083E7D] text-white text-xs font-bold py-2 px-3 rounded-xl cursor-pointer shrink-0"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Mapping</span>
                      </button>
                    </div>
                  </div>

                  {/* ========================================================================= */}
                  {/* SECTION 3: EVENT SYSTEM TRIGGERS                                          */}
                  {/* ========================================================================= */}
                  <div className="space-y-3 pt-4 border-t border-slate-100">
                    <h4 className="text-xs font-extrabold uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
                      <Activity className="w-4 h-4 text-blue-600" />
                      <span>3. Supported Event Triggers</span>
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Enable or disable which lifecycle events dispatch automated sync payloads to the CRM.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {crmConfig.events.map((event) => (
                        <div
                          key={event.eventType}
                          onClick={() => handleToggleEvent(event.eventType)}
                          className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                            event.isEnabled
                              ? "bg-blue-50/60 border-blue-200 shadow-2xs"
                              : "bg-slate-50 border-slate-200 opacity-60"
                          }`}
                        >
                          <div className="pt-0.5">
                            {event.isEnabled ? (
                              <CheckSquare className="w-4 h-4 text-blue-600 shrink-0" />
                            ) : (
                              <Square className="w-4 h-4 text-slate-400 shrink-0" />
                            )}
                          </div>
                          <div>
                            <div className="text-xs font-black text-slate-900">{event.label}</div>
                            <div className="text-[10px] text-slate-500 mt-0.5 leading-snug">
                              {event.description}
                            </div>
                            <div className="text-[9px] font-mono text-blue-700 font-bold mt-1">
                              event_type: &quot;{event.eventType}&quot;
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ========================================================================= */}
                  {/* SECTION 4: NON-BLOCKING QUEUE & EXPONENTIAL BACKOFF RETRY AUDIT           */}
                  {/* ========================================================================= */}
                  <div className="space-y-3 pt-4 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-extrabold uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-blue-600" />
                          <span>4. Background Sync Queue & Retry Inspector</span>
                        </h4>
                        <p className="text-[11px] text-slate-500">
                          Non-blocking execution (doctor form resolves in &lt;50ms). Retries failed syncs at 1m, 5m, 15m, 1h, and 24h.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={handleClearCompletedQueue}
                        className="text-[11px] font-bold text-slate-500 hover:text-slate-800 bg-slate-100 px-3 py-1.5 rounded-xl cursor-pointer"
                      >
                        Clear Synced Logs
                      </button>
                    </div>

                    <div className="border border-slate-200 rounded-2xl overflow-hidden max-h-60 overflow-y-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-extrabold uppercase text-slate-400 sticky top-0">
                          <tr>
                            <th className="py-2.5 px-3">Event</th>
                            <th className="py-2.5 px-3">Lead UUID</th>
                            <th className="py-2.5 px-3">Status</th>
                            <th className="py-2.5 px-3">Attempts</th>
                            <th className="py-2.5 px-3">CRM Response / Error</th>
                            <th className="py-2.5 px-3 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {queueJobs.slice(0, 15).map((job) => (
                            <tr key={job.id} className="hover:bg-slate-50/50">
                              <td className="py-2 px-3 font-mono font-bold text-[11px]">
                                {job.eventType}
                              </td>
                              <td className="py-2 px-3 font-mono text-slate-600 text-[11px]">
                                {job.leadUuid}
                              </td>
                              <td className="py-2 px-3">
                                <span className={`text-[9px] font-black px-2 py-0.5 rounded-md uppercase ${
                                  job.status === "SYNCED" ? "bg-emerald-100 text-emerald-800" :
                                  job.status === "PENDING" ? "bg-blue-100 text-blue-800" :
                                  job.status === "FAILED" ? "bg-amber-100 text-amber-800" : "bg-red-100 text-red-800"
                                }`}>
                                  {job.status}
                                </span>
                              </td>
                              <td className="py-2 px-3 font-mono text-[11px]">
                                {job.attempts}/{job.maxAttempts}
                              </td>
                              <td className="py-2 px-3 text-slate-500 font-mono text-[10px] truncate max-w-[200px]">
                                {job.crmLeadId ? `ID: ${job.crmLeadId}` : (job.errorMessage || "Pending dispatch")}
                              </td>
                              <td className="py-2 px-3 text-right">
                                {job.status !== "SYNCED" && (
                                  <button
                                    type="button"
                                    onClick={() => handleRetryQueueJob(job.id)}
                                    className="text-[10px] font-bold text-blue-700 hover:underline bg-blue-50 px-2 py-1 rounded-md cursor-pointer"
                                  >
                                    Retry Now
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {queueJobs.length === 0 && (
                        <div className="py-8 text-center text-xs text-slate-400">
                          Queue is idle. Inquiries will appear here upon submission.
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              )}

              {/* ========================================================================= */}
              {/* TAB 2: GOOGLE ANALYTICS & GTM CONFIGURATION                               */}
              {/* ========================================================================= */}
              {activeGroup === "ANALYTICS_GTM" && (
                <div className="space-y-6">
                  <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-black text-slate-900 font-display flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-emerald-600" />
                        <span>Google Analytics 4, GTM & Google Ads Conversion</span>
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Centralized tag manager, GA4 measurement, and verified Google Ads conversion IDs.
                      </p>
                    </div>
                  </div>

                  {/* Core IDs Form */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        GA4 Measurement ID
                      </label>
                      <input
                        type="text"
                        value={gaId}
                        onChange={(e) => setGaId(e.target.value)}
                        placeholder="G-3L5ZCL0SX4"
                        className="w-full text-xs font-mono p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#0B4F9C]"
                      />
                      <p className="text-[10px] text-slate-400 mt-1">Existing GA4 property: G-3L5ZCL0SX4</p>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Google Tag Manager Container ID
                      </label>
                      <input
                        type="text"
                        value={gtmId}
                        onChange={(e) => setGtmId(e.target.value)}
                        placeholder="GTM-PXHWHLL9"
                        className="w-full text-xs font-mono p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#0B4F9C]"
                      />
                      <p className="text-[10px] text-slate-400 mt-1">Existing GTM container: GTM-PXHWHLL9</p>
                    </div>
                  </div>

                  {/* Google Ads Conversion (Strict Verification) */}
                  <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                      <h4 className="text-xs font-black text-amber-950 uppercase tracking-wider">
                        Google Ads Conversion (Lead Verification ONLY)
                      </h4>
                    </div>
                    <p className="text-[11px] text-amber-900 leading-relaxed">
                      Google Ads Conversion will fire <strong>ONLY after successful lead submission</strong> (when lead is saved in database & email sent & CRM sync completed). Never fires on page load.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-amber-950 mb-1">Google Ads Conversion ID</label>
                        <input
                          type="text"
                          value={gAdsId}
                          onChange={(e) => setGAdsId(e.target.value)}
                          placeholder="AW-16589177872"
                          className="w-full text-xs font-mono p-2.5 bg-white border border-amber-300 rounded-xl font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-amber-950 mb-1">Google Ads Conversion Label</label>
                        <input
                          type="text"
                          value={gAdsLabel}
                          onChange={(e) => setGAdsLabel(e.target.value)}
                          placeholder="ujPlCPC2u7UZEJCIq-Y9"
                          className="w-full text-xs font-mono p-2.5 bg-white border border-amber-300 rounded-xl font-bold"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ========================================================================= */}
              {/* TAB 3: SEARCH CONSOLE & SEO DEFAULTS                                      */}
              {/* ========================================================================= */}
              {activeGroup === "GLOBAL_SEO" && (
                <div className="space-y-5">
                  <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-black text-slate-900 font-display flex items-center gap-2">
                        <Search className="w-5 h-5 text-indigo-600" />
                        <span>Google Search Console & SEO Defaults</span>
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Domain verification, dynamic XML sitemaps, robots.txt, and metadata fallbacks.
                      </p>
                    </div>
                    <a
                      href="https://indianmedicalcourse.com/sitemap.xml"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-blue-600 hover:underline inline-flex items-center gap-1"
                    >
                      <span>View sitemap.xml</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Google Search Console Verification Tag
                      </label>
                      <input
                        type="text"
                        value={searchConsoleCode}
                        onChange={(e) => setSearchConsoleCode(e.target.value)}
                        placeholder="google-site-verification=XYZ..."
                        className="w-full text-xs font-mono p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#0B4F9C]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Bing Webmaster Verification Code
                      </label>
                      <input
                        type="text"
                        value={bingVerification}
                        onChange={(e) => setBingVerification(e.target.value)}
                        placeholder="e.g. 1234567890ABCDEF"
                        className="w-full text-xs font-mono p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#0B4F9C]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Global Default Page Title
                    </label>
                    <input
                      type="text"
                      value={defaultMetaTitle}
                      onChange={(e) => setDefaultMetaTitle(e.target.value)}
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Global Default Meta Description
                    </label>
                    <textarea
                      rows={3}
                      value={defaultMetaDescription}
                      onChange={(e) => setDefaultMetaDescription(e.target.value)}
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
                    />
                  </div>
                </div>
              )}

              {/* ========================================================================= */}
              {/* TAB 4: 301 REDIRECTS MANAGER                                              */}
              {/* ========================================================================= */}
              {activeGroup === "REDIRECTS_301" && (
                <div className="space-y-5">
                  <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-black text-slate-900 font-display flex items-center gap-2">
                        <ArrowRightLeft className="w-5 h-5 text-amber-600" />
                        <span>SEO 301 / 302 URL Redirects Manager</span>
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Seamlessly migrate old WordPress / legacy URLs to the new Next.js routes to protect SEO equity.
                      </p>
                    </div>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl">
                      {redirects.length} Active Rules
                    </span>
                  </div>

                  {/* Add New Rule Dock */}
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                    <h4 className="text-xs font-extrabold text-slate-800">Add New URL Redirect Rule</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Old Source URL / Path</label>
                        <input
                          type="text"
                          placeholder="/fellowship-courses"
                          value={newSource}
                          onChange={(e) => setNewSource(e.target.value)}
                          className="w-full text-xs p-2 bg-white border border-slate-200 rounded-xl font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">New Target URL / Path</label>
                        <input
                          type="text"
                          placeholder="/courses"
                          value={newTarget}
                          onChange={(e) => setNewTarget(e.target.value)}
                          className="w-full text-xs p-2 bg-white border border-slate-200 rounded-xl font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">HTTP Status</label>
                        <select
                          value={newStatus}
                          onChange={(e) => setNewStatus(Number(e.target.value) as 301 | 302)}
                          className="w-full text-xs p-2 bg-white border border-slate-200 rounded-xl font-bold cursor-pointer"
                        >
                          <option value={301}>301 Permanent Redirect (SEO Equity Passed)</option>
                          <option value={302}>302 Temporary Redirect</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={handleAddRedirect}
                        className="inline-flex items-center gap-1.5 bg-[#0B4F9C] hover:bg-[#083E7D] text-white text-xs font-bold py-2 px-4 rounded-xl cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Redirect Rule</span>
                      </button>
                    </div>
                  </div>

                  {/* Redirects Table */}
                  <div className="border border-slate-200 rounded-2xl overflow-hidden">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-extrabold uppercase text-slate-400">
                        <tr>
                          <th className="py-2.5 px-3">Source URL</th>
                          <th className="py-2.5 px-3">Target Destination</th>
                          <th className="py-2.5 px-3">Status</th>
                          <th className="py-2.5 px-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {redirects.map((r) => (
                          <tr key={r.id} className="hover:bg-slate-50/50">
                            <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{r.sourcePath}</td>
                            <td className="py-2.5 px-3 font-mono text-blue-700">{r.targetPath}</td>
                            <td className="py-2.5 px-3 font-bold">{r.statusCode}</td>
                            <td className="py-2.5 px-3 text-right">
                              <button
                                type="button"
                                onClick={() => handleDeleteRedirect(r.id)}
                                className="p-1 text-slate-400 hover:text-red-600 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ========================================================================= */}
              {/* TAB 5: COMPANY DETAILS                                                    */}
              {/* ========================================================================= */}
              {activeGroup === "COMPANY_DETAILS" && (
                <div className="space-y-4">
                  <div className="border-b border-slate-100 pb-3">
                    <h3 className="text-sm font-extrabold text-slate-900">Company & Brand Information</h3>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Brand Name</label>
                    <input
                      type="text"
                      value={brandName}
                      onChange={(e) => setBrandName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Registered Campus Address</label>
                    <textarea
                      rows={3}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white"
                    />
                  </div>
                </div>
              )}

              {/* ========================================================================= */}
              {/* TAB 6: CONTACT & PHONE                                                    */}
              {/* ========================================================================= */}
              {activeGroup === "CONTACT_INFO" && (
                <div className="space-y-4">
                  <div className="border-b border-slate-100 pb-3">
                    <h3 className="text-sm font-extrabold text-slate-900">Hotlines & Support Desk</h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Admissions Phone Hotline</label>
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Official WhatsApp Number</label>
                      <input
                        type="text"
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Official Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white font-mono"
                    />
                  </div>
                </div>
              )}

              {/* ========================================================================= */}
              {/* TAB 7: ANNOUNCEMENT BAR                                                   */}
              {/* ========================================================================= */}
              {activeGroup === "ANNOUNCEMENT_BAR" && (
                <div className="space-y-4">
                  <div className="border-b border-slate-100 pb-3">
                    <h3 className="text-sm font-extrabold text-slate-900">Top Header Announcement Bar</h3>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Announcement Text</label>
                    <input
                      type="text"
                      value={announcement}
                      onChange={(e) => setAnnouncement(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white"
                    />
                  </div>
                </div>
              )}

              {/* ========================================================================= */}
              {/* TAB 8: WHATSAPP ROUTING                                                   */}
              {/* ========================================================================= */}
              {activeGroup === "WHATSAPP_CONFIG" && (
                <div className="space-y-4">
                  <div className="border-b border-slate-100 pb-3">
                    <h3 className="text-sm font-extrabold text-slate-900">WhatsApp Messaging & Cloud API</h3>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Default Pre-filled Message</label>
                    <textarea
                      rows={3}
                      value={waMessageTemplate}
                      onChange={(e) => setWaMessageTemplate(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white"
                    />
                  </div>
                </div>
              )}

              {/* ========================================================================= */}
              {/* TAB 9: SECURITY PIN / MASTER PASSWORD                                     */}
              {/* ========================================================================= */}
              {activeGroup === "SECURITY_PIN" && (
                <div className="space-y-4">
                  <div className="border-b border-slate-100 pb-3">
                    <h3 className="text-sm font-extrabold text-slate-900">Master Reset Security Password</h3>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Master Password</label>
                    <input
                      type={showMasterPassword ? "text" : "password"}
                      value={masterPassword}
                      onChange={(e) => setMasterPassword(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                    />
                  </div>
                </div>
              )}

              {/* Bottom Action */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 bg-[#0B4F9C] hover:bg-[#083E7D] text-white text-xs font-bold py-2.5 px-6 rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save All Changes</span>
                </button>
              </div>

            </form>
          </div>
        </div>

      </div>

    </div>
  );
}
