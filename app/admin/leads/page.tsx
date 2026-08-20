"use client";

import React, { useState, useEffect, useMemo } from "react";
import { courses } from "@/lib/data";
import { 
  Users, 
  Search, 
  Filter, 
  Download, 
  Phone, 
  Mail, 
  Calendar, 
  Flame, 
  Building2, 
  CheckCircle2, 
  Clock, 
  Send, 
  MessageSquare, 
  Sparkles, 
  X, 
  Save,
  Trash2,
  RotateCcw,
  Globe,
  Tag,
  ExternalLink,
  Target,
  Share2,
  SlidersHorizontal,
  CheckSquare,
  Square,
  FileSpreadsheet,
  Layers,
  ArrowUpDown,
  CalendarRange,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Eye
} from "lucide-react";

// Authentic Brand Logos (Google, Meta, WhatsApp)
function GoogleLogo({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
    </svg>
  );
}

function MetaLogo({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="#0866FF">
      <path d="M12 2.04c-5.5 0-10 4.49-10 10.02 0 5 3.66 9.15 8.44 9.9v-7H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.89 3.78-3.89 1.09 0 2.23.19 2.23.19v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.9h-2.33v7a10 10 0 0 0 8.44-9.9c0-5.53-4.5-10.02-10-10.02z" />
    </svg>
  );
}

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

function normalizeLead(raw: any, index: number): LeadItem {
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

  let rawName = String(raw.name || raw.fullName || "Doctor Applicant").trim();
  // Strip duplicate 'dr.' or 'dr' prefixes
  rawName = rawName.replace(/^dr\.?\s*/i, "").replace(/^dr\.?\s*/i, "").trim();
  const cleanedDoctorName = rawName ? `Dr. ${rawName.split(/\s+/).map((w: string) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ")}` : "Doctor Applicant";

  return {
    id: String(raw.id || raw.uuid || index + 1),
    uuid: String(raw.uuid || `lead_${raw.id || index + 1}`),
    name: cleanedDoctorName,
    mobile: String(raw.mobile || raw.mobileNumber || raw.phone || "Not Provided"),
    email: String(raw.email || raw.emailAddress || "Not Provided"),
    qualification: String(raw.qualification || "MBBS"),
    interestedCourse: String(raw.interestedCourse || raw.interestedCourseName || raw.course || "Fellowship Program"),
    city: String(raw.city || ""),
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
    notes: String(raw.notes || ""),
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

  for (const lead of normalized) {
    if (seenIds.has(lead.id) || seenIds.has(lead.uuid)) {
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

const SEED_LEADS: LeadItem[] = [
  {
    id: "1",
    uuid: "lead_1786971874086_4osw12x",
    name: "Dr. Anirudh Kulkarni",
    mobile: "+91 98765 00001",
    email: "anirudh.k@gmail.com",
    qualification: "MBBS",
    interestedCourse: "Fellowship in Clinical Cardiology",
    city: "Bengaluru",
    state: "Karnataka",
    country: "India",
    formSource: "Homepage Hero Form",
    leadSource: "Google Ads",
    channel: "GOOGLE_ADS",
    channelLabel: "Google Ads",
    landingPageUrl: "https://indianmedicalcourse.com",
    leadStatus: "NEW",
    priority: "HIGH",
    score: 90,
    createdAt: "2026-08-18T12:15:00.000Z",
    notes: "Doctor is interested in weekend ICU & Echo hands-on training.",
    attribution: {
      gclid: "Cj0KCQjwi46oBhC1ARIsA",
      utmCampaign: "cardiology_fellowship_search_in",
      utmTerm: "fellowship in cardiology for mbbs",
    }
  },
  {
    id: "2",
    uuid: "lead_1786971874086_99a8x1",
    name: "Dr. Meenakshi Sundaram",
    mobile: "+91 98450 44332",
    email: "dr.meenakshi@apollo.org",
    qualification: "MD_MS",
    interestedCourse: "Fellowship in Critical Care Medicine",
    city: "Chennai",
    state: "Tamil Nadu",
    country: "India",
    formSource: "Course Page Form",
    leadSource: "Meta / Instagram Ads",
    channel: "META_ADS",
    channelLabel: "Meta / Instagram Ads",
    landingPageUrl: "https://indianmedicalcourse.com/courses/fellowship-in-critical-care-medicine",
    leadStatus: "IN_COUNSELLING",
    priority: "URGENT",
    score: 95,
    createdAt: "2026-08-18T11:00:00.000Z",
    notes: "Senior Resident aiming for ECMO and ventilator training.",
    attribution: {
      fbclid: "fb.1.17869718.XYZ99",
      utmCampaign: "icu_fellowship_instagram_feed",
    }
  },
  {
    id: "3",
    uuid: "lead_1786971874086_bb23x9",
    name: "Dr. Rohit Singhal",
    mobile: "+91 98112 33445",
    email: "singhal.rohit@gmail.com",
    qualification: "MBBS",
    interestedCourse: "Fellowship in Laparoscopic Surgery",
    city: "Agra",
    state: "Uttar Pradesh",
    country: "India",
    formSource: "Quick Apply Floating Dock",
    leadSource: "Organic / Direct",
    channel: "ORGANIC",
    channelLabel: "Organic / Direct",
    landingPageUrl: "https://indianmedicalcourse.com/courses/fellowship-in-laparoscopic-surgery",
    leadStatus: "NEW",
    priority: "HIGH",
    score: 85,
    createdAt: "2026-08-18T09:30:00.000Z",
    notes: "Looking for minimal access wet lab surgery observer-ship.",
  },
];

const LEADS_STORAGE_KEY = "imc_captured_leads";

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<LeadItem[]>(SEED_LEADS);
  const [isMounted, setIsMounted] = useState(false);
  const [selectedLeadIds, setSelectedLeadIds] = useState<string[]>([]);
  
  // Comprehensive Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRangeFilter, setDateRangeFilter] = useState<"ALL_TIME" | "TODAY" | "YESTERDAY" | "LAST_7_DAYS" | "THIS_MONTH" | "CUSTOM">("ALL_TIME");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [selectedChannel, setSelectedChannel] = useState("ALL");
  const [selectedSpecialty, setSelectedSpecialty] = useState("ALL");
  const [selectedCourseType, setSelectedCourseType] = useState("ALL");
  const [selectedCourse, setSelectedCourse] = useState("ALL");
  const [selectedPriority, setSelectedPriority] = useState("ALL");
  const [sortBy, setSortBy] = useState<"NEWEST_FIRST" | "OLDEST_FIRST" | "SCORE_DESC" | "NAME_ASC">("NEWEST_FIRST");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [selectedLead, setSelectedLead] = useState<LeadItem | null>(null);
  const [isSuccessNotification, setIsSuccessNotification] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState("Lead Updated!");

  const showNotification = (msg: string) => {
    setNotificationMsg(msg);
    setIsSuccessNotification(true);
    setTimeout(() => setIsSuccessNotification(false), 2500);
  };

  const updateLeadsAndStorage = (updated: LeadItem[]) => {
    const deduplicated = deduplicateLeadsList(updated);
    setLeads(deduplicated);
    if (typeof window !== "undefined") {
      localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(deduplicated));
    }
  };

  useEffect(() => {
    setIsMounted(true);
    const loadFromStorage = () => {
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem(LEADS_STORAGE_KEY);
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed)) {
              const cleaned = deduplicateLeadsList(parsed);
              setLeads(cleaned);
              // Clean duplicate entries in localStorage permanently
              if (cleaned.length !== parsed.length) {
                localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(cleaned));
              }
            }
          } catch (e) {
            console.error(e);
          }
        }
      }
    };
    loadFromStorage();
    window.addEventListener("storage", loadFromStorage);
    window.addEventListener("imc_lead_captured", loadFromStorage);
    return () => {
      window.removeEventListener("storage", loadFromStorage);
      window.removeEventListener("imc_lead_captured", loadFromStorage);
    };
  }, []);

  // Categorized Catalog Courses
  const categorizedCourses = useMemo(() => {
    const fellowships = courses.filter((c) => c.courseType === "FELLOWSHIP");
    const pgDiplomas = courses.filter((c) => c.courseType === "PG_DIPLOMA");
    const certificates = courses.filter((c) => c.courseType === "ADVANCED_CERTIFICATE" || (c as any).courseType === "CERTIFICATE");
    const masterclasses = courses.filter((c) => (c as any).courseType === "MASTERCLASS");

    const catalogTitles = new Set(courses.map((c) => c.title.toLowerCase()));
    const otherCaptured: string[] = [];
    leads.forEach((l) => {
      if (l.interestedCourse && !catalogTitles.has(l.interestedCourse.toLowerCase())) {
        if (!otherCaptured.includes(l.interestedCourse)) {
          otherCaptured.push(l.interestedCourse);
        }
      }
    });

    return {
      fellowships,
      pgDiplomas,
      certificates,
      masterclasses,
      otherCaptured,
    };
  }, [leads]);

  // Reset All Filters
  const handleResetFilters = () => {
    setSearchQuery("");
    setDateRangeFilter("ALL_TIME");
    setCustomStartDate("");
    setCustomEndDate("");
    setSelectedStatus("ALL");
    setSelectedChannel("ALL");
    setSelectedSpecialty("ALL");
    setSelectedCourseType("ALL");
    setSelectedCourse("ALL");
    setSelectedPriority("ALL");
    setSortBy("NEWEST_FIRST");
    setCurrentPage(1);
    showNotification("Filters Reset to Default");
  };

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (searchQuery.trim()) count++;
    if (dateRangeFilter !== "ALL_TIME" || customStartDate || customEndDate) count++;
    if (selectedStatus !== "ALL") count++;
    if (selectedChannel !== "ALL") count++;
    if (selectedSpecialty !== "ALL") count++;
    if (selectedCourseType !== "ALL") count++;
    if (selectedCourse !== "ALL") count++;
    if (selectedPriority !== "ALL") count++;
    return count;
  }, [searchQuery, dateRangeFilter, customStartDate, customEndDate, selectedStatus, selectedChannel, selectedSpecialty, selectedCourseType, selectedCourse, selectedPriority]);

  // Main Filtered & Sorted Leads
  const filteredLeads = useMemo(() => {
    return leads
      .filter((lead) => {
        // 1. Date Range Filter
        const leadDate = new Date(lead.createdAt);
        const now = new Date();

        // Custom Date Range Pickers (From Date to To Date)
        if (customStartDate || customEndDate) {
          if (customStartDate) {
            const start = new Date(customStartDate);
            start.setHours(0, 0, 0, 0);
            if (leadDate < start) return false;
          }
          if (customEndDate) {
            const end = new Date(customEndDate);
            end.setHours(23, 59, 59, 999);
            if (leadDate > end) return false;
          }
        } else if (dateRangeFilter === "TODAY") {
          const isToday = leadDate.toDateString() === now.toDateString();
          if (!isToday) return false;
        } else if (dateRangeFilter === "YESTERDAY") {
          const yest = new Date(now);
          yest.setDate(yest.getDate() - 1);
          if (leadDate.toDateString() !== yest.toDateString()) return false;
        } else if (dateRangeFilter === "LAST_7_DAYS") {
          const diffDays = (now.getTime() - leadDate.getTime()) / (1000 * 3600 * 24);
          if (diffDays > 7) return false;
        } else if (dateRangeFilter === "THIS_MONTH") {
          if (leadDate.getMonth() !== now.getMonth() || leadDate.getFullYear() !== now.getFullYear()) return false;
        }

        // 2. Status Filter
        const status = lead.leadStatus || "NEW";
        if (selectedStatus !== "ALL" && status !== selectedStatus) return false;
        
        // 3. Channel Filter (Google Ads / Meta Ads / WhatsApp / Organic)
        const channelLabel = (lead.channelLabel || lead.leadSource || "").toLowerCase();
        if (selectedChannel === "GOOGLE_ADS") {
          if (!channelLabel.includes("google") && !lead.gclid && !lead.attribution?.gclid) return false;
        } else if (selectedChannel === "META_ADS") {
          if (!channelLabel.includes("meta") && !channelLabel.includes("facebook") && !channelLabel.includes("instagram") && !lead.fbclid) return false;
        } else if (selectedChannel === "INSTAGRAM") {
          if (!channelLabel.includes("instagram") && !(lead.formSource || "").toLowerCase().includes("instagram")) return false;
        } else if (selectedChannel === "WHATSAPP") {
          if (!channelLabel.includes("whatsapp") && !(lead.formSource || "").toLowerCase().includes("whatsapp")) return false;
        } else if (selectedChannel === "ORGANIC") {
          if (!channelLabel.includes("organic") && !channelLabel.includes("direct")) return false;
        } else if (selectedChannel === "REFERRAL") {
          if (!channelLabel.includes("referral")) return false;
        }

        // 4. Priority Filter
        if (selectedPriority !== "ALL" && lead.priority !== selectedPriority) return false;

        // 5. Specialty / Status Filter
        if (selectedSpecialty !== "ALL") {
          const leadQual = (lead.qualification || "").toLowerCase();
          if (!leadQual.includes(selectedSpecialty.toLowerCase())) return false;
        }

        // 6. Course Program Level / Type Filter
        if (selectedCourseType !== "ALL") {
          const courseTitle = (lead.interestedCourse || "").toLowerCase();
          if (selectedCourseType === "FELLOWSHIP" && !courseTitle.includes("fellowship")) return false;
          if (selectedCourseType === "PG_DIPLOMA" && !courseTitle.includes("diploma") && !courseTitle.includes("pg")) return false;
          if (selectedCourseType === "CERTIFICATE" && !courseTitle.includes("certificate") && !courseTitle.includes("certification")) return false;
        }

        // 7. Specific Course Filter
        if (selectedCourse !== "ALL") {
          if (lead.interestedCourse.toLowerCase() !== selectedCourse.toLowerCase()) return false;
        }

        // 8. Search Filter
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          const matchName = (lead.name || "").toLowerCase().includes(q);
          const matchSpecialty = (lead.qualification || "").toLowerCase().includes(q);
          const matchMobile = (lead.mobile || "").includes(q);
          const matchEmail = (lead.email || "").toLowerCase().includes(q);
          const matchCourse = (lead.interestedCourse || "").toLowerCase().includes(q);
          const matchCity = (lead.city || "").toLowerCase().includes(q);
          const matchSource = (lead.formSource || "").toLowerCase().includes(q);
          const matchGclid = (lead.attribution?.gclid || lead.gclid || "").toLowerCase().includes(q);
          const matchCampaign = (lead.attribution?.utmCampaign || lead.utmCampaign || lead.attribution?.utm_campaign || "").toLowerCase().includes(q);
          
          if (!matchName && !matchSpecialty && !matchMobile && !matchEmail && !matchCourse && !matchCity && !matchSource && !matchGclid && !matchCampaign) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "NEWEST_FIRST") {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        } else if (sortBy === "OLDEST_FIRST") {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        } else if (sortBy === "SCORE_DESC") {
          return (b.score || 0) - (a.score || 0);
        } else if (sortBy === "NAME_ASC") {
          return a.name.localeCompare(b.name);
        }
        return 0;
      });
  }, [leads, customStartDate, customEndDate, dateRangeFilter, selectedStatus, selectedChannel, selectedPriority, selectedSpecialty, selectedCourseType, selectedCourse, searchQuery, sortBy]);

  // Reset page to 1 whenever filters or search query change
  useEffect(() => {
    setCurrentPage(1);
  }, [customStartDate, customEndDate, dateRangeFilter, selectedStatus, selectedChannel, selectedPriority, selectedSpecialty, selectedCourseType, selectedCourse, searchQuery, sortBy]);

  // Pagination Calculations
  const totalPages = Math.max(1, Math.ceil(filteredLeads.length / pageSize));
  const validCurrentPage = Math.min(currentPage, totalPages);
  const paginatedLeads = useMemo(() => {
    const start = (validCurrentPage - 1) * pageSize;
    return filteredLeads.slice(start, start + pageSize);
  }, [filteredLeads, validCurrentPage, pageSize]);

  const startIndex = filteredLeads.length > 0 ? (validCurrentPage - 1) * pageSize + 1 : 0;
  const endIndex = Math.min(validCurrentPage * pageSize, filteredLeads.length);

  // Multiple Select Handlers
  const handleToggleSelect = (id: string) => {
    setSelectedLeadIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    const filteredIds = filteredLeads.map((l) => l.id);
    const allSelected = filteredIds.length > 0 && filteredIds.every((id) => selectedLeadIds.includes(id));
    if (allSelected) {
      setSelectedLeadIds((prev) => prev.filter((id) => !filteredIds.includes(id)));
    } else {
      setSelectedLeadIds((prev) => Array.from(new Set([...prev, ...filteredIds])));
    }
  };

  // Bulk Status Change
  const handleBulkSetStatus = (newStatus: string) => {
    if (selectedLeadIds.length === 0) return;
    const updated = leads.map((l) =>
      selectedLeadIds.includes(l.id) ? { ...l, leadStatus: newStatus } : l
    );
    updateLeadsAndStorage(updated);
    showNotification(`Updated ${selectedLeadIds.length} leads to ${newStatus.replace("_", " ")}`);
  };

  // Bulk Delete
  const handleBulkDelete = () => {
    if (selectedLeadIds.length === 0) return;
    if (confirm(`Are you sure you want to delete ${selectedLeadIds.length} selected leads?`)) {
      const updated = leads.filter((l) => !selectedLeadIds.includes(l.id));
      updateLeadsAndStorage(updated);
      setSelectedLeadIds([]);
      showNotification(`Deleted ${selectedLeadIds.length} leads.`);
    }
  };

  const handleUpdateStatus = (newStatus: string) => {
    if (!selectedLead) return;
    const updated = leads.map((l) =>
      l.id === selectedLead.id ? { ...l, leadStatus: newStatus } : l
    );
    updateLeadsAndStorage(updated);
    setSelectedLead({ ...selectedLead, leadStatus: newStatus });
    showNotification(`Status updated to ${newStatus.replace("_", " ")}`);
  };

  const handleDeleteLead = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete lead "${name}"?`)) {
      const updated = leads.filter((l) => l.id !== id);
      updateLeadsAndStorage(updated);
      setSelectedLeadIds((prev) => prev.filter((item) => item !== id));
      if (selectedLead?.id === id) setSelectedLead(null);
      showNotification(`Lead "${name}" deleted.`);
    }
  };

  // Real Excel / CSV Export Generator for Selected or All Leads
  const handleExportCSV = (onlySelected: boolean = false) => {
    const exportData = onlySelected
      ? leads.filter((l) => selectedLeadIds.includes(l.id))
      : filteredLeads;

    if (exportData.length === 0) {
      alert("No leads selected to export.");
      return;
    }

    const headers = [
      "UUID",
      "Created Date",
      "Created Time (IST)",
      "Doctor Full Name",
      "Specialty / Qualification",
      "Mobile Phone",
      "Email Address",
      "Interested Course",
      "Form Origin",
      "Marketing Channel",
      "Landing Page URL",
      "Google Click ID (GCLID)",
      "Meta Click ID (FBCLID)",
      "UTM Campaign",
      "UTM Term / Keyword",
      "City",
      "State / Country",
      "Pipeline Status",
      "Lead Score",
      "Priority Level",
      "Counsellor Notes",
    ];

    const rows = exportData.map((l) => {
      const timeInfo = formatLeadDateTime(l.createdAt);
      return [
        l.uuid || l.id,
        `"${timeInfo.formattedDate}"`,
        `"${timeInfo.formattedTime}"`,
        `"${(l.name || '').replace(/"/g, '""')}"`,
        `"${(l.qualification || 'MBBS Doctor').replace(/"/g, '""')}"`,
        `"${l.mobile || ''}"`,
        `"${l.email || ''}"`,
        `"${(l.interestedCourse || '').replace(/"/g, '""')}"`,
        `"${(l.formSource || 'Website Form').replace(/"/g, '""')}"`,
        `"${l.channelLabel || l.leadSource || 'Organic'}"`,
        `"${l.landingPageUrl || ''}"`,
        `"${l.attribution?.gclid || l.gclid || ''}"`,
        `"${l.attribution?.fbclid || l.fbclid || ''}"`,
        `"${l.attribution?.utmCampaign || l.utmCampaign || l.attribution?.utm_campaign || ''}"`,
        `"${l.attribution?.utmTerm || l.utmTerm || l.attribution?.utm_term || ''}"`,
        `"${(l.city || '').replace(/"/g, '""')}"`,
        `"${(l.state || l.country || '').replace(/"/g, '""')}"`,
        `"${l.leadStatus || 'NEW'}"`,
        l.score || 80,
        `"${l.priority || 'HIGH'}"`,
        `"${(l.notes || '').replace(/"/g, '""')}"`,
      ];
    });

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((e) => e.join(","))].join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `IMC_Doctor_Leads_${onlySelected ? 'Selected_' : 'All_'}${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showNotification(`Exported ${exportData.length} leads to Excel (CSV)!`);
  };

  const isAllFilteredSelected = filteredLeads.length > 0 && filteredLeads.every((l) => selectedLeadIds.includes(l.id));

  return (
    <div className="space-y-6">
      
      {/* Page Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 font-display">
            Live Doctor Lead Management & CRM
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time doctor inquiries captured with exact timestamps (Date & Time), Google Ads attribution, and From-To date filters.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {isSuccessNotification && (
            <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-2 rounded-xl animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{notificationMsg}</span>
            </div>
          )}

          <button
            onClick={() => handleExportCSV(false)}
            className="inline-flex items-center gap-1.5 bg-[#0B4F9C] hover:bg-[#083E7D] text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export Filtered ({filteredLeads.length})</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[10px] font-bold text-slate-400 uppercase">Total Captured Leads</div>
          <div className="text-2xl font-black text-slate-900 font-display mt-0.5">
            {leads.length}
          </div>
          <div className="text-[10px] text-emerald-600 font-semibold mt-1">100% Persisted with Timestamps</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[10px] font-bold text-slate-400 uppercase">Filtered Results</div>
          <div className="text-2xl font-black text-blue-700 font-display mt-0.5">
            {filteredLeads.length}
          </div>
          <div className="text-[10px] text-slate-500 font-semibold mt-1">
            {activeFiltersCount > 0 ? `${activeFiltersCount} Filters Applied` : "All Time Range"}
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[10px] font-bold text-slate-400 uppercase">Google Ads Leads</div>
          <div className="text-2xl font-black text-amber-600 font-display mt-0.5">
            {leads.filter((l) => (l.channelLabel || l.leadSource || "").includes("Google") || Boolean(l.gclid || l.attribution?.gclid)).length}
          </div>
          <div className="text-[10px] text-amber-600 font-semibold mt-1">AW-16589177872 Tracked</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[10px] font-bold text-slate-400 uppercase">New Inquiries Today</div>
          <div className="text-2xl font-black text-emerald-600 font-display mt-0.5">
            {leads.filter((l) => {
              const d = new Date(l.createdAt);
              return d.toDateString() === new Date().toDateString();
            }).length}
          </div>
          <div className="text-[10px] text-emerald-600 font-semibold mt-1">Immediate Callback Required</div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* COMPREHENSIVE FILTER DOCK: SEARCH, DATE RANGE & ATTRIBUTION CONTROLS      */}
      {/* ========================================================================= */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        
        {/* Search and Sort Row */}
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Doctor Name, Mobile, Email, Course, City, Campaign, GCLID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:outline-hidden transition-all text-slate-900 placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 w-full md:w-auto">
              <ArrowUpDown className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span className="text-slate-400 font-normal">Sort:</span>
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="bg-transparent font-bold text-slate-900 border-none outline-hidden cursor-pointer"
              >
                <option value="NEWEST_FIRST">Newest Created (Latest First)</option>
                <option value="OLDEST_FIRST">Oldest Created</option>
                <option value="SCORE_DESC">Highest Score (Priority)</option>
                <option value="NAME_ASC">Doctor Name (A to Z)</option>
              </select>
            </div>

            {/* Reset Filters Button */}
            {activeFiltersCount > 0 && (
              <button
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold px-3 py-2.5 rounded-xl border border-red-200 transition-colors cursor-pointer shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset ({activeFiltersCount})</span>
              </button>
            )}
          </div>
        </div>

        {/* Dedicated Interactive "From Date to Date" Filter Bar */}
        <div className="p-3 bg-blue-50/60 border border-blue-100 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1 text-xs font-bold text-blue-900">
              <Calendar className="w-4 h-4 text-blue-700 shrink-0" />
              <span>Date Filter:</span>
            </div>

            {/* Presets */}
            {(["ALL_TIME", "TODAY", "YESTERDAY", "LAST_7_DAYS", "THIS_MONTH"] as const).map((preset) => {
              const isActive = dateRangeFilter === preset && !customStartDate && !customEndDate;
              const label = preset === "ALL_TIME" ? "All Time" : preset === "TODAY" ? "Today" : preset === "YESTERDAY" ? "Yesterday" : preset === "LAST_7_DAYS" ? "Last 7 Days" : "This Month";
              return (
                <button
                  key={preset}
                  type="button"
                  onClick={() => {
                    setDateRangeFilter(preset);
                    setCustomStartDate("");
                    setCustomEndDate("");
                  }}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    isActive
                      ? "bg-[#0B4F9C] text-white shadow-xs"
                      : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Direct "From Date" and "To Date" Pickers */}
          <div className="flex items-center gap-2 flex-wrap w-full md:w-auto">
            <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-xl border border-slate-200 text-xs">
              <span className="text-[10px] font-extrabold text-slate-500 uppercase">From:</span>
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => {
                  setCustomStartDate(e.target.value);
                  setDateRangeFilter("CUSTOM");
                }}
                className="bg-transparent text-xs font-bold text-slate-900 focus:outline-hidden cursor-pointer"
              />
            </div>

            <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-xl border border-slate-200 text-xs">
              <span className="text-[10px] font-extrabold text-slate-500 uppercase">To:</span>
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => {
                  setCustomEndDate(e.target.value);
                  setDateRangeFilter("CUSTOM");
                }}
                className="bg-transparent text-xs font-bold text-slate-900 focus:outline-hidden cursor-pointer"
              />
            </div>

            {(customStartDate || customEndDate) && (
              <button
                type="button"
                onClick={() => {
                  setCustomStartDate("");
                  setCustomEndDate("");
                  setDateRangeFilter("ALL_TIME");
                }}
                className="p-1.5 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg text-xs font-bold cursor-pointer"
                title="Clear Date Filter"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

        </div>

        {/* Filter Dropdowns Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 pt-2 border-t border-slate-100">
          
          {/* 1. Channel / Traffic Source Filter */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
              Traffic Source
            </label>
            <select
              value={selectedChannel}
              onChange={(e) => setSelectedChannel(e.target.value)}
              className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 cursor-pointer"
            >
              <option value="ALL">All Sources</option>
              <option value="GOOGLE_ADS">Google Ads (Verified)</option>
              <option value="META_ADS">Meta / Facebook Ads</option>
              <option value="INSTAGRAM">Instagram Feed/Story</option>
              <option value="WHATSAPP">WhatsApp Inbound</option>
              <option value="ORGANIC">Organic & Direct</option>
              <option value="REFERRAL">Referral / Partner</option>
            </select>
          </div>

          {/* 2. Pipeline Status */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
              Pipeline Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="NEW">NEW</option>
              <option value="IN_COUNSELLING">IN COUNSELLING</option>
              <option value="APPLICATION_SUBMITTED">APPLICATION SUBMITTED</option>
              <option value="ADMITTED">ADMITTED</option>
              <option value="NOT_ELIGIBLE">NOT ELIGIBLE</option>
              <option value="LOST">LOST</option>
            </select>
          </div>

          {/* 3. Priority Level */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
              Priority
            </label>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 cursor-pointer"
            >
              <option value="ALL">All Priorities</option>
              <option value="URGENT">Urgent (Hot)</option>
              <option value="HIGH">High Priority</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>

          {/* 4. Doctor Specialty / Qualification */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
              Doctor Specialty
            </label>
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 cursor-pointer"
            >
              <option value="ALL">All Specialties</option>
              <option value="MBBS">MBBS Doctor</option>
              <option value="MD">MD / MS Post-Graduate</option>
              <option value="DNB">DNB Specialist</option>
              <option value="BDS">BDS / MDS Dental</option>
              <option value="BAMS">BAMS / BHMS AYUSH</option>
              <option value="NURS">Nursing / Paramedical</option>
            </select>
          </div>

          {/* 5. Course Program (Fellowships, Diplomas, Certificate Courses) */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
              Inquired Program / Course
            </label>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 cursor-pointer truncate"
            >
              <option value="ALL">All Programs (150+ Courses)</option>
              
              {/* Category 1: Clinical Fellowships */}
              <optgroup label="🎓 Clinical Fellowships (12-24 Months)">
                {categorizedCourses.fellowships.map((c) => (
                  <option key={c.id} value={c.title}>
                    {c.title}
                  </option>
                ))}
              </optgroup>

              {/* Category 2: Post-Graduate Diplomas */}
              <optgroup label="📜 Post-Graduate Diplomas (6-12 Months)">
                {categorizedCourses.pgDiplomas.map((c) => (
                  <option key={c.id} value={c.title}>
                    {c.title}
                  </option>
                ))}
              </optgroup>

              {/* Category 3: Certificate Courses & Advanced Certifications */}
              <optgroup label="⭐ Certificate Courses & Advanced Certifications">
                {categorizedCourses.certificates.map((c) => (
                  <option key={c.id} value={c.title}>
                    {c.title}
                  </option>
                ))}
              </optgroup>

              {/* Category 4: Other Inquiries */}
              {categorizedCourses.otherCaptured.length > 0 && (
                <optgroup label="🔬 Other Inquired Specializations">
                  {categorizedCourses.otherCaptured.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </optgroup>
              )}
            </select>
          </div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* BULK ACTION TOOLBAR (When rows are selected)                              */}
      {/* ========================================================================= */}
      {selectedLeadIds.length > 0 && (
        <div className="bg-slate-900 text-white p-3 sm:p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in shadow-xl">
          <div className="flex items-center gap-2 text-xs font-bold">
            <CheckSquare className="w-4 h-4 text-emerald-400" />
            <span>{selectedLeadIds.length} leads selected</span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => handleBulkSetStatus("IN_COUNSELLING")}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer"
            >
              Mark In Counselling
            </button>
            <button
              onClick={() => handleBulkSetStatus("APPLICATION_SUBMITTED")}
              className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold cursor-pointer"
            >
              Mark Application Submitted
            </button>
            <button
              onClick={() => handleExportCSV(true)}
              className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold cursor-pointer"
            >
              Export Selected ({selectedLeadIds.length})
            </button>
            <button
              onClick={handleBulkDelete}
              className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold cursor-pointer"
            >
              Delete Selected
            </button>
            <button
              onClick={() => setSelectedLeadIds([])}
              className="px-2.5 py-1.5 text-xs text-slate-300 hover:text-white cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MASTER LEADS TABLE WITH EXACT DATE & TIME TIMESTAMP COLUMN                */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="w-full">
          <table className="w-full text-left border-collapse table-auto">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[10px] sm:text-[11px] font-extrabold uppercase text-slate-500 tracking-wider">
                <th className="py-3 px-2 w-8 text-center">
                  <button
                    onClick={handleSelectAll}
                    className="cursor-pointer text-slate-400 hover:text-slate-700 inline-flex items-center justify-center"
                    title={isAllFilteredSelected ? "Deselect All" : "Select All"}
                  >
                    {isAllFilteredSelected ? (
                      <CheckSquare className="w-4 h-4 text-blue-600" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-300" />
                    )}
                  </button>
                </th>
                <th className="py-3 px-2.5 whitespace-nowrap">Created Date & Time</th>
                <th className="py-3 px-2.5">Doctor & Specialty</th>
                <th className="py-3 px-2.5">Inquired Course</th>
                <th className="py-3 px-2 whitespace-nowrap">Traffic Source</th>
                <th className="py-3 px-2 whitespace-nowrap text-center">Priority</th>
                <th className="py-3 px-2 whitespace-nowrap text-center">Status</th>
                <th className="py-3 px-2.5 text-right whitespace-nowrap">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-xs">
              {paginatedLeads.map((lead) => {
                const isSelected = selectedLeadIds.includes(lead.id);
                const timeInfo = formatLeadDateTime(lead.createdAt);
                const whatsappLink = `https://wa.me/${lead.mobile.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                  `Hello ${lead.name}, regarding your application for ${lead.interestedCourse} at Indian Medical Course:`
                )}`;

                return (
                  <tr
                    key={lead.id}
                    className={`hover:bg-blue-50/40 transition-colors ${
                      isSelected ? "bg-blue-50/60" : ""
                    }`}
                  >
                    {/* Select Checkbox */}
                    <td className="py-2.5 px-2 text-center">
                      <button
                        onClick={() => handleToggleSelect(lead.id)}
                        className="cursor-pointer inline-flex items-center justify-center"
                      >
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4 text-blue-600" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-300 hover:text-slate-500" />
                        )}
                      </button>
                    </td>

                    {/* Creation Timestamp Column (Date & Exact Time) */}
                    <td className="py-2.5 px-2.5 whitespace-nowrap" suppressHydrationWarning>
                      <div className="flex flex-col" suppressHydrationWarning>
                        <div className="flex items-center gap-1 font-black text-slate-900 text-xs" suppressHydrationWarning>
                          <Calendar className="w-3 h-3 text-blue-600 shrink-0" />
                          <span suppressHydrationWarning>{timeInfo.formattedDate}</span>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-slate-500 font-mono mt-0.5" suppressHydrationWarning>
                          <Clock className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                          <span suppressHydrationWarning>{timeInfo.formattedTime}</span>
                          <span className="px-1 py-0.2 bg-slate-100 text-slate-600 text-[9px] font-bold rounded-xs ml-0.5" suppressHydrationWarning>
                            {timeInfo.relative}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Doctor Details */}
                    <td className="py-2.5 px-2.5">
                      <div className="font-black text-slate-900 text-xs truncate max-w-[150px] lg:max-w-[180px]">
                        {lead.name}
                      </div>
                      <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <span className="font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded-xs">
                          {lead.qualification || "MBBS"}
                        </span>
                        {lead.city && <span className="truncate max-w-[80px]">· {lead.city}</span>}
                      </div>
                    </td>

                    {/* Course */}
                    <td className="py-2.5 px-2.5">
                      <div className="font-bold text-slate-900 truncate max-w-[140px] md:max-w-[170px] lg:max-w-[210px]" title={lead.interestedCourse}>
                        {lead.interestedCourse}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5 truncate max-w-[140px] md:max-w-[170px]">
                        {lead.formSource || "Website"}
                      </div>
                    </td>

                    {/* Traffic Source / Ad Badge */}
                    <td className="py-2.5 px-2 whitespace-nowrap">
                      <div className="flex flex-col gap-0.5">
                        <span className={`inline-flex items-center gap-1 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          (lead.channelLabel || lead.leadSource || "").includes("Google") ? "bg-amber-100 text-amber-900 border border-amber-300" :
                          (lead.channelLabel || lead.leadSource || "").includes("Facebook") || (lead.channelLabel || lead.leadSource || "").includes("Meta") ? "bg-blue-100 text-blue-900 border border-blue-300" :
                          (lead.channelLabel || lead.leadSource || "").includes("Instagram") ? "bg-pink-100 text-pink-900 border border-pink-300" :
                          (lead.channelLabel || lead.leadSource || "").includes("WhatsApp") ? "bg-emerald-100 text-emerald-900 border border-emerald-300" : "bg-slate-100 text-slate-700"
                        }`}>
                          {(lead.channelLabel || lead.leadSource || "").includes("Google") && <GoogleLogo className="w-2.5 h-2.5 shrink-0" />}
                          {((lead.channelLabel || lead.leadSource || "").includes("Facebook") || (lead.channelLabel || lead.leadSource || "").includes("Meta")) && <MetaLogo className="w-2.5 h-2.5 shrink-0" />}
                          <span>{lead.channelLabel || lead.leadSource || "Organic"}</span>
                        </span>

                        {(lead.attribution?.utmCampaign || lead.utmCampaign) && (
                          <span className="text-[9px] text-slate-400 font-mono truncate max-w-[110px]">
                            {lead.attribution?.utmCampaign || lead.utmCampaign}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Priority & Score */}
                    <td className="py-2.5 px-2 whitespace-nowrap text-center">
                      <div className="inline-flex items-center gap-1">
                        <span className={`px-1.5 py-0.5 rounded-md text-[9px] font-black uppercase ${
                          lead.priority === "URGENT" ? "bg-red-100 text-red-800" :
                          lead.priority === "HIGH" ? "bg-amber-100 text-amber-800" :
                          "bg-slate-100 text-slate-700"
                        }`}>
                          {lead.priority}
                        </span>
                        <span className="text-[10px] font-mono font-bold text-slate-500">
                          {lead.score || 85}
                        </span>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-2.5 px-2 whitespace-nowrap text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${
                        (lead.leadStatus || "NEW") === "NEW" ? "bg-blue-100 text-blue-800" :
                        (lead.leadStatus || "NEW") === "IN_COUNSELLING" ? "bg-emerald-100 text-emerald-800" :
                        (lead.leadStatus || "NEW") === "APPLICATION_SUBMITTED" ? "bg-purple-100 text-purple-800" :
                        (lead.leadStatus || "NEW") === "ADMITTED" ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-700"
                      }`}>
                        {(lead.leadStatus || "NEW").replace("_", " ")}
                      </span>
                    </td>

                    {/* Direct Actions (Compact WhatsApp, Call, Eye Profile Logo, Trash) */}
                    <td className="py-2.5 px-2.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        {/* 1-Click WhatsApp */}
                        <a
                          href={whatsappLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-[#25D366] hover:bg-[#1EBE5D] text-white shadow-2xs transition-all cursor-pointer hover:scale-105 active:scale-95"
                          title="Chat on WhatsApp"
                        >
                          <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24">
                            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                          </svg>
                        </a>

                        {/* Direct Phone Call */}
                        <a
                          href={`tel:${lead.mobile}`}
                          className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-slate-900 hover:bg-slate-800 text-white shadow-2xs transition-all cursor-pointer hover:scale-105 active:scale-95"
                          title="Call Doctor"
                        >
                          <Phone className="w-3 h-3 text-amber-300" />
                        </a>

                        {/* View Details Eye Icon Button */}
                        <button
                          onClick={() => setSelectedLead(lead)}
                          className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-blue-50 hover:bg-blue-100 text-[#0B4F9C] shadow-2xs transition-all cursor-pointer hover:scale-105 active:scale-95"
                          title="View Full Lead Profile & History"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete Lead */}
                        <button
                          onClick={() => handleDeleteLead(lead.id, lead.name)}
                          className="inline-flex items-center justify-center w-7 h-7 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 cursor-pointer transition-colors"
                          title="Delete Lead"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* ========================================================================= */}
        {/* INTERACTIVE PAGINATION CONTROLS                                           */}
        {/* ========================================================================= */}
        {filteredLeads.length > 0 && (
          <div className="px-4 py-3 bg-slate-50/90 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            
            {/* Showing count and page size selector */}
            <div className="flex items-center gap-3 text-slate-500 font-medium flex-wrap">
              <span>
                Showing <strong className="text-slate-900 font-bold">{startIndex}</strong> to{" "}
                <strong className="text-slate-900 font-bold">{endIndex}</strong> of{" "}
                <strong className="text-slate-900 font-bold">{filteredLeads.length}</strong> leads
              </span>

              <div className="flex items-center gap-1.5 pl-3 border-l border-slate-200">
                <span className="text-[11px] text-slate-400 font-semibold uppercase">Rows:</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold text-slate-700 cursor-pointer focus:outline-hidden"
                >
                  <option value={10}>10 / page</option>
                  <option value={25}>25 / page</option>
                  <option value={50}>50 / page</option>
                  <option value={100}>100 / page</option>
                </select>
              </div>
            </div>

            {/* Pagination Button Controls */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={validCurrentPage <= 1}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold text-slate-700 transition-all cursor-pointer shadow-2xs"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Prev</span>
              </button>

              {/* Numbered Page Buttons */}
              <div className="flex items-center gap-1 mx-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => {
                    if (totalPages <= 5) return true;
                    if (p === 1 || p === totalPages) return true;
                    return Math.abs(p - validCurrentPage) <= 1;
                  })
                  .map((p, idx, arr) => {
                    const prev = arr[idx - 1];
                    const showEllipsis = prev && p - prev > 1;
                    return (
                      <React.Fragment key={p}>
                        {showEllipsis && <span className="px-1 text-slate-400 text-xs">…</span>}
                        <button
                          type="button"
                          onClick={() => setCurrentPage(p)}
                          className={`w-7 h-7 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            validCurrentPage === p
                              ? "bg-[#0B4F9C] text-white shadow-xs font-black"
                              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                          }`}
                        >
                          {p}
                        </button>
                      </React.Fragment>
                    );
                  })}
              </div>

              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={validCurrentPage >= totalPages}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold text-slate-700 transition-all cursor-pointer shadow-2xs"
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        )}

        {filteredLeads.length === 0 && (
          <div className="text-center py-16 bg-white">
            <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <div className="text-sm font-bold text-slate-700">No leads match your selected filters</div>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Try adjusting the date range (From/To), traffic channel, status, or search query.
            </p>
            <button
              onClick={handleResetFilters}
              className="mt-4 inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-bold px-4 py-2 rounded-xl transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear All Filters</span>
            </button>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* REAL INTERACTIVE MODAL: LEAD TIMELINE & DETAIL DRAWER                     */}
      {/* ========================================================================= */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 max-h-[90vh]">
            
            {/* Header */}
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="text-base font-black text-slate-900 font-display">
                  Lead Profile: {selectedLead.name}
                </h3>
                <p className="text-[11px] text-slate-500 font-mono">
                  UUID: {selectedLead.uuid || selectedLead.id}
                </p>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto flex-1">
              
              {/* Dedicated Lead Timestamp Box (Date + Exact Time) */}
              <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 flex items-center justify-between text-xs" suppressHydrationWarning>
                <div className="flex items-center gap-3" suppressHydrationWarning>
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div suppressHydrationWarning>
                    <div className="text-[10px] text-emerald-900 font-black uppercase tracking-wider">
                      Exact Lead Creation Timestamp
                    </div>
                    <div className="text-sm font-black text-slate-900 font-mono mt-0.5" suppressHydrationWarning>
                      {formatLeadDateTime(selectedLead.createdAt).fullDisplay} (IST)
                    </div>
                    <div className="text-[11px] text-slate-600 mt-0.5" suppressHydrationWarning>
                      Date: <strong className="text-slate-800" suppressHydrationWarning>{formatLeadDateTime(selectedLead.createdAt).formattedDate}</strong> • Time: <strong className="text-slate-800" suppressHydrationWarning>{formatLeadDateTime(selectedLead.createdAt).formattedTime}</strong>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end" suppressHydrationWarning>
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-900 text-xs font-black font-mono shadow-2xs" suppressHydrationWarning>
                    {formatLeadDateTime(selectedLead.createdAt).relative}
                  </span>
                </div>
              </div>

              {/* Doctor Details Card */}
              <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-blue-900">Doctor Full Name:</span>
                  <span className="text-xs font-black text-slate-900">{selectedLead.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-blue-900">Specialty / Qualification:</span>
                  <span className="text-xs font-bold px-2 py-0.5 bg-blue-100 text-blue-800 rounded-md">
                    {selectedLead.qualification || "MBBS Doctor"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-blue-900">Inquired Program:</span>
                  <span className="text-xs font-bold text-slate-900">{selectedLead.interestedCourse}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Mobile Phone:</span>
                  <div className="flex items-center gap-2">
                    <a href={`tel:${selectedLead.mobile}`} className="font-mono font-bold text-blue-700 hover:underline">
                      {selectedLead.mobile}
                    </a>
                    <a
                      href={`https://wa.me/${selectedLead.mobile.replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-[11px] font-black px-2 py-0.5 rounded-lg shadow-xs"
                    >
                      <MessageSquare className="w-3 h-3" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Email Address:</span>
                  <a href={`mailto:${selectedLead.email}`} className="font-bold text-slate-800 hover:underline">
                    {selectedLead.email}
                  </a>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Location:</span>
                  <span className="font-medium text-slate-700">{selectedLead.city || "Not Specified"}, {selectedLead.state || selectedLead.country || "India"}</span>
                </div>
              </div>

              {/* Complete Attribution Breakdown */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="text-xs font-extrabold text-slate-900 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Target className="w-4 h-4 text-[#0B4F9C]" />
                    <span>Complete Marketing & Attribution Breakdown</span>
                  </div>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${
                    (selectedLead.channelLabel || selectedLead.leadSource || "").includes("Google") ? "bg-amber-100 text-amber-900 border border-amber-300" :
                    (selectedLead.channelLabel || selectedLead.leadSource || "").includes("Facebook") || (selectedLead.channelLabel || selectedLead.leadSource || "").includes("Meta") ? "bg-blue-100 text-blue-900 border border-blue-300" :
                    (selectedLead.channelLabel || selectedLead.leadSource || "").includes("Instagram") ? "bg-pink-100 text-pink-900 border border-pink-300" :
                    (selectedLead.channelLabel || selectedLead.leadSource || "").includes("WhatsApp") ? "bg-emerald-100 text-emerald-900 border border-emerald-300" : "bg-slate-200 text-slate-700"
                  }`}>
                    {selectedLead.channelLabel || selectedLead.leadSource || "Organic"}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                    <div className="text-[10px] text-slate-400">Traffic Source / Channel</div>
                    <div className="font-bold text-slate-900 mt-0.5">{selectedLead.channelLabel || selectedLead.leadSource || "Organic"}</div>
                  </div>

                  <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                    <div className="text-[10px] text-slate-400">Form Origin</div>
                    <div className="font-bold text-blue-700 mt-0.5">{selectedLead.formSource || "Website Form"}</div>
                  </div>
                </div>

                {/* Detailed UTM Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <div className="text-[9px] text-slate-400 font-bold uppercase">UTM Source</div>
                    <div className="font-mono text-[11px] text-slate-800 font-semibold truncate mt-0.5">
                      {selectedLead.attribution?.utmSource || selectedLead.utmSource || "direct"}
                    </div>
                  </div>

                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <div className="text-[9px] text-slate-400 font-bold uppercase">UTM Medium</div>
                    <div className="font-mono text-[11px] text-slate-800 font-semibold truncate mt-0.5">
                      {selectedLead.attribution?.utmMedium || selectedLead.utmMedium || "none"}
                    </div>
                  </div>

                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <div className="text-[9px] text-slate-400 font-bold uppercase">UTM Campaign</div>
                    <div className="font-mono text-[11px] text-slate-800 font-semibold truncate mt-0.5">
                      {selectedLead.attribution?.utmCampaign || selectedLead.utmCampaign || "general_2026"}
                    </div>
                  </div>

                  {selectedLead.attribution?.utmContent && (
                    <div className="bg-white p-2 rounded-xl border border-slate-200">
                      <div className="text-[9px] text-slate-400 font-bold uppercase">UTM Content</div>
                      <div className="font-mono text-[11px] text-slate-800 truncate mt-0.5">
                        {selectedLead.attribution.utmContent}
                      </div>
                    </div>
                  )}

                  {selectedLead.attribution?.utmTerm && (
                    <div className="bg-white p-2 rounded-xl border border-slate-200">
                      <div className="text-[9px] text-slate-400 font-bold uppercase">UTM Term / Keyword</div>
                      <div className="font-mono text-[11px] text-slate-800 truncate mt-0.5">
                        {selectedLead.attribution.utmTerm}
                      </div>
                    </div>
                  )}

                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <div className="text-[9px] text-slate-400 font-bold uppercase">Device & Browser</div>
                    <div className="font-mono text-[11px] text-slate-800 truncate mt-0.5">
                      {selectedLead.deviceType || "Desktop"} • {selectedLead.browser || "Chrome"}
                    </div>
                  </div>
                </div>

                {/* Click IDs */}
                {(selectedLead.attribution?.gclid || selectedLead.gclid) && (
                  <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-200 text-xs">
                    <div className="text-[10px] text-amber-900 font-bold flex items-center gap-1">
                      <GoogleLogo className="w-3 h-3" />
                      <span>Google Click ID (GCLID)</span>
                    </div>
                    <div className="font-mono text-[11px] text-amber-950 font-bold break-all mt-0.5">
                      {selectedLead.attribution?.gclid || selectedLead.gclid}
                    </div>
                  </div>
                )}

                {(selectedLead.attribution?.fbclid || selectedLead.fbclid) && (
                  <div className="bg-blue-50 p-2.5 rounded-xl border border-blue-200 text-xs">
                    <div className="text-[10px] text-blue-900 font-bold flex items-center gap-1">
                      <MetaLogo className="w-3 h-3" />
                      <span>Meta Click ID (FBCLID)</span>
                    </div>
                    <div className="font-mono text-[11px] text-blue-950 font-bold break-all mt-0.5">
                      {selectedLead.attribution?.fbclid || selectedLead.fbclid}
                    </div>
                  </div>
                )}

                {selectedLead.landingPageUrl && (
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200 text-xs">
                    <div className="text-[10px] text-slate-400">Landing Page URL</div>
                    <a
                      href={selectedLead.landingPageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-[11px] text-blue-600 hover:underline flex items-center gap-1 mt-0.5 break-all"
                    >
                      <span>{selectedLead.landingPageUrl}</span>
                      <ExternalLink className="w-3 h-3 shrink-0" />
                    </a>
                  </div>
                )}
              </div>

              {/* Status Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Update Lead Pipeline Status
                </label>
                <select
                  value={selectedLead.leadStatus || "NEW"}
                  onChange={(e) => handleUpdateStatus(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 cursor-pointer"
                >
                  <option value="NEW">NEW</option>
                  <option value="IN_COUNSELLING">IN COUNSELLING</option>
                  <option value="APPLICATION_SUBMITTED">APPLICATION SUBMITTED</option>
                  <option value="ADMITTED">ADMITTED</option>
                  <option value="NOT_ELIGIBLE">NOT ELIGIBLE</option>
                  <option value="LOST">LOST</option>
                </select>
              </div>

              {/* Doctor Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Counsellor Notes
                </label>
                <textarea
                  rows={3}
                  value={selectedLead.notes || ""}
                  onChange={(e) => {
                    const newNotes = e.target.value;
                    setSelectedLead({ ...selectedLead, notes: newNotes });
                    const updated = leads.map((l) => (l.id === selectedLead.id ? { ...l, notes: newNotes } : l));
                    updateLeadsAndStorage(updated);
                  }}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setSelectedLead(null)}
                className="text-xs font-bold text-slate-600 hover:text-slate-900 px-4 py-2 cursor-pointer"
              >
                Close Drawer
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedLead(null);
                  showNotification("Notes and status saved!");
                }}
                className="inline-flex items-center gap-1.5 bg-[#0B4F9C] hover:bg-[#083E7D] text-white text-xs font-bold py-2.5 px-6 rounded-xl shadow-xs cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Notes</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
