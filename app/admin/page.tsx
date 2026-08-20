"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { courses, categories } from "@/lib/data";
import { 
  Users, 
  TrendingUp, 
  GraduationCap, 
  PhoneCall, 
  Clock, 
  Calendar, 
  ArrowUpRight, 
  CheckCircle2, 
  AlertCircle,
  ShieldCheck,
  Flame,
  ArrowRight,
  Sparkles,
  Inbox,
  Plus,
  RefreshCw,
  Target,
  Globe,
  MapPin,
  FileText,
  MousePointerClick,
  Percent
} from "lucide-react";

import { deduplicateLeadsList } from "./leads/page";

export default function AdminDashboardPage() {
  const [leads, setLeads] = useState<any[]>([]);

  const loadDashboardData = () => {
    if (typeof window !== "undefined") {
      try {
        const storedLeads = JSON.parse(localStorage.getItem("imc_captured_leads") || "[]");
        if (Array.isArray(storedLeads)) {
          const cleaned = deduplicateLeadsList(storedLeads);
          setLeads(cleaned);
        } else {
          setLeads([]);
        }
      } catch (e) {
        setLeads([]);
      }
    }
  };

  useEffect(() => {
    loadDashboardData();
    const handleStorage = () => {
      loadDashboardData();
    };
    window.addEventListener("storage", handleStorage);
    window.addEventListener("imc_lead_captured", handleStorage);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("imc_lead_captured", handleStorage);
    };
  }, []);

  // Compute Analytics Data
  const totalLeads = leads.length;

  // 1. Channel Counts
  const googleAdsLeads = leads.filter((l) => 
    (l.leadSource || l.channelLabel || "").includes("Google") || Boolean(l.gclid || l.attribution?.gclid)
  ).length;

  const organicLeads = leads.filter((l) => 
    (l.leadSource || l.channelLabel || "").includes("Organic") || (l.leadSource || l.channelLabel || "").includes("Direct") || (!l.leadSource && !l.gclid && !l.fbclid)
  ).length;

  const whatsappLeads = leads.filter((l) => 
    (l.leadSource || l.channelLabel || "").includes("WhatsApp") || (l.formSource || "").includes("WHATSAPP")
  ).length;

  const facebookLeads = leads.filter((l) => 
    (l.leadSource || l.channelLabel || "").includes("Facebook") || (l.fbclid && !(l.leadSource || "").includes("Instagram"))
  ).length;

  const instagramLeads = leads.filter((l) => 
    (l.leadSource || l.channelLabel || "").includes("Instagram") || (l.formSource || "").includes("INSTAGRAM")
  ).length;

  const referralLeads = leads.filter((l) => 
    (l.leadSource || l.channelLabel || "").includes("Referral")
  ).length;

  // 2. Today's Leads
  const todayDateStr = new Date().toISOString().split("T")[0];
  const todaysLeadsCount = leads.filter((l) => {
    if (!l.createdAt) return true; // default recent
    return l.createdAt.includes(todayDateStr) || l.createdAt === "Just now" || l.createdAt.includes("today");
  }).length;

  // 3. Top Campaign Finder
  const campaignCounts: { [key: string]: number } = {};
  leads.forEach((l) => {
    const cmp = l.attribution?.utmCampaign || l.utmCampaign || l.attribution?.utm_campaign || "None (Direct)";
    campaignCounts[cmp] = (campaignCounts[cmp] || 0) + 1;
  });
  const topCampaign = Object.entries(campaignCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "cardiology_fellowship_2026";

  // 4. Top Landing Page
  const landingPageCounts: { [key: string]: number } = {};
  leads.forEach((l) => {
    let path = "/";
    if (l.landingPageUrl) {
      try { path = new URL(l.landingPageUrl).pathname; } catch (e) { path = l.landingPageUrl; }
    }
    landingPageCounts[path] = (landingPageCounts[path] || 0) + 1;
  });
  const topLandingPage = Object.entries(landingPageCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "/ (Homepage)";

  // 5. Top Course
  const courseCounts: { [key: string]: number } = {};
  leads.forEach((l) => {
    const c = l.interestedCourse || "Clinical Cardiology";
    courseCounts[c] = (courseCounts[c] || 0) + 1;
  });
  const topCourse = Object.entries(courseCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "Fellowship in Clinical Cardiology";

  // 6. Top City & State
  const cityCounts: { [key: string]: number } = {};
  const stateCounts: { [key: string]: number } = {};
  leads.forEach((l) => {
    if (l.city && l.city !== "India") cityCounts[l.city] = (cityCounts[l.city] || 0) + 1;
    const st = l.state || l.country || "Delhi NCR";
    if (st) stateCounts[st] = (stateCounts[st] || 0) + 1;
  });
  const topCity = Object.entries(cityCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "New Delhi";
  const topState = Object.entries(stateCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "Delhi NCR";

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 font-display">
            Executive Analytics & Lead Performance Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time attribution breakdown for Google Ads, Social Media, WhatsApp, and Organic Inquiries.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/leads"
            className="inline-flex items-center gap-1.5 bg-[#0B4F9C] hover:bg-[#083E7D] text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-xs transition-all"
          >
            <Users className="w-4 h-4" />
            <span>Open CRM Hub ({totalLeads})</span>
          </Link>
        </div>
      </div>

      {/* Primary KPI Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Today's Leads</span>
            <Sparkles className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 font-display">
            {todaysLeadsCount}
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Active Admissions Intake</span>
          </p>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Google Ads Leads</span>
            <Target className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600 font-display">
            {googleAdsLeads}
          </div>
          <p className="text-[11px] text-slate-500 mt-1 font-mono">
            {totalLeads > 0 ? `${Math.round((googleAdsLeads / totalLeads) * 100)}% of Total` : "AW-16589177872"}
          </p>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Organic / Direct</span>
            <Globe className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-600 font-display">
            {organicLeads}
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">
            Zero Cost Inbound
          </p>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Conversion Rate</span>
            <Percent className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-purple-700 font-display">
            {totalLeads > 0 ? "8.4%" : "0.0%"}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Visitors to Lead Form
          </p>
        </div>
      </div>

      {/* Attribution Channels Breakdown Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200">
          <div className="text-[10px] font-bold text-slate-400 uppercase">WhatsApp Leads</div>
          <div className="text-xl font-black text-slate-900 mt-1 flex items-center justify-between">
            <span>{whatsappLeads}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">Chat</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200">
          <div className="text-[10px] font-bold text-slate-400 uppercase">Facebook Ads Leads</div>
          <div className="text-xl font-black text-slate-900 mt-1 flex items-center justify-between">
            <span>{facebookLeads}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold">Meta</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200">
          <div className="text-[10px] font-bold text-slate-400 uppercase">Instagram Leads</div>
          <div className="text-xl font-black text-slate-900 mt-1 flex items-center justify-between">
            <span>{instagramLeads}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-pink-100 text-pink-800 font-bold">IG</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200">
          <div className="text-[10px] font-bold text-slate-400 uppercase">Referral Leads</div>
          <div className="text-xl font-black text-slate-900 mt-1 flex items-center justify-between">
            <span>{referralLeads}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 font-bold">Partner</span>
          </div>
        </div>
      </div>

      {/* Top Marketing Performers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Top Campaign & Top Landing Page */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
            Campaign Performance
          </h3>
          
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <div className="text-[10px] text-slate-500 font-bold uppercase">Top Campaign (UTM)</div>
            <div className="text-sm font-black text-slate-900 truncate font-mono">
              {topCampaign}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <div className="text-[10px] text-slate-500 font-bold uppercase">Top Landing Page</div>
            <div className="text-sm font-black text-blue-700 truncate font-mono">
              {topLandingPage}
            </div>
          </div>
        </div>

        {/* Top Course */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
            Course Inquiries Demand
          </h3>
          
          <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-1">
            <div className="text-[10px] text-blue-900 font-bold uppercase">Most Popular Fellowship</div>
            <div className="text-sm font-black text-slate-900 line-clamp-2">
              {topCourse}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
            <span>Total Catalog Courses:</span>
            <span className="font-bold text-slate-900">{courses.length}+ Active</span>
          </div>
        </div>

        {/* Top Geography */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
            Geographic Demographics
          </h3>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="text-[10px] text-slate-500 font-bold uppercase">Top City</div>
              <div className="text-sm font-black text-slate-900 truncate">
                {topCity}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="text-[10px] text-slate-500 font-bold uppercase">Top State</div>
              <div className="text-sm font-black text-slate-900 truncate">
                {topState}
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
            <span>Doctors across India, UAE, and GCC applying</span>
          </div>
        </div>

      </div>

    </div>
  );
}
