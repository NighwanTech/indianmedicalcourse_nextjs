"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Layers, 
  Plus, 
  Sparkles, 
  Eye, 
  ExternalLink, 
  Copy, 
  Check, 
  Trash2, 
  Edit,
  Sliders,
  CheckCircle2,
  X,
  Save
} from "lucide-react";

export default function AdminLandingPagesPage() {
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [activeModal, setActiveModal] = useState<"create" | "edit" | null>(null);
  const [isSuccessNotification, setIsSuccessNotification] = useState(false);

  const [landingPages, setLandingPages] = useState([
    {
      id: 1,
      slug: "cardiology-fellowship-2026",
      title: "Clinical Cardiology Fellowship - 2026 Batch",
      campaign: "Google Ads - Cardiology Inquiries",
      targetCourse: "Fellowship in Clinical Cardiology",
      leadsCount: 142,
      conversionRate: "14.8%",
      isPublished: true,
    },
    {
      id: 2,
      slug: "critical-care-icu-mastery",
      title: "ICU & Critical Care Hands-on Observership",
      campaign: "Meta Pixel - Emergency & ICU Doctors",
      targetCourse: "Fellowship in Critical Care Medicine",
      leadsCount: 98,
      conversionRate: "18.2%",
      isPublished: true,
    },
    {
      id: 3,
      slug: "laparoscopic-surgery-fellowship",
      title: "Minimal Access Surgical Fellowship",
      campaign: "Direct WhatsApp Outreach",
      targetCourse: "Fellowship in Laparoscopic Surgery",
      leadsCount: 64,
      conversionRate: "12.4%",
      isPublished: true,
    },
  ]);

  const [formData, setFormData] = useState({
    id: 0,
    slug: "",
    title: "",
    campaign: "Google Ads - 2026 Campaign",
    targetCourse: "Fellowship in Clinical Cardiology",
    leadsCount: 0,
    conversionRate: "0.0%",
    isPublished: true,
  });

  const copyUrl = (slug: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/lp/${slug}`);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  const openCreateModal = () => {
    setFormData({
      id: Date.now(),
      slug: "",
      title: "",
      campaign: "Google Ads - Medical Campaign",
      targetCourse: "Fellowship in Clinical Cardiology",
      leadsCount: 0,
      conversionRate: "0.0%",
      isPublished: true,
    });
    setActiveModal("create");
  };

  const openEditModal = (lp: any) => {
    setFormData({ ...lp });
    setActiveModal("edit");
  };

  const handleSave = () => {
    if (!formData.title.trim()) return;

    if (activeModal === "create") {
      const slug = formData.slug || formData.title.toLowerCase().replace(/\s+/g, "-");
      setLandingPages((prev) => [{ ...formData, slug }, ...prev]);
    } else if (activeModal === "edit") {
      setLandingPages((prev) =>
        prev.map((l) => (l.id === formData.id ? formData : l))
      );
    }

    setActiveModal(null);
    setIsSuccessNotification(true);
    setTimeout(() => setIsSuccessNotification(false), 2500);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 font-display">
            High-Converting Landing Pages (CRO)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Modular lead generation landing pages optimized for Google Ads & Meta Pixel ad traffic.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isSuccessNotification && (
            <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-2 rounded-xl">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Saved Successfully!</span>
            </div>
          )}

          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 bg-[#0B4F9C] hover:bg-[#083E7D] text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create Landing Page</span>
          </button>
        </div>
      </div>

      {/* Landing Pages Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Landing Page Title & URL</th>
                <th className="py-3 px-4">Campaign Tag</th>
                <th className="py-3 px-4">Mapped Program</th>
                <th className="py-3 px-4">Leads Captured</th>
                <th className="py-3 px-4">Conversion Rate</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {landingPages.map((lp) => (
                <tr key={lp.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-extrabold text-slate-900 leading-snug">
                      {lp.title}
                    </div>
                    <div className="text-[10px] text-blue-700 font-semibold mt-0.5 flex items-center gap-2 font-mono">
                      <span>/landing/{lp.slug}</span>
                      <button
                        onClick={() => copyUrl(lp.slug)}
                        className="text-slate-400 hover:text-slate-700 cursor-pointer"
                        title="Copy Public Link"
                      >
                        {copiedSlug === lp.slug ? (
                          <Check className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 font-medium">
                    {lp.campaign}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-800">
                    {lp.targetCourse}
                  </td>
                  <td className="py-3.5 px-4 font-extrabold text-emerald-700">
                    {lp.leadsCount} Leads
                  </td>
                  <td className="py-3.5 px-4 font-extrabold text-blue-700">
                    {lp.conversionRate}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                      Live
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-2">
                    <Link
                      href={`/landing/${lp.slug}`}
                      target="_blank"
                      className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 hover:text-[#0B4F9C] bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-md transition-colors"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>View Live</span>
                    </Link>
                    <button
                      onClick={() => openEditModal(lp)}
                      className="text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-md transition-colors cursor-pointer"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* REAL INTERACTIVE MODAL: ADD / EDIT LANDING PAGE                           */}
      {/* ========================================================================= */}
      {activeModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in fade-in zoom-in-95">
            
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="text-base font-black text-slate-900 font-display">
                  {activeModal === "create" ? "Create Landing Page" : "Edit Landing Page"}
                </h3>
                <p className="text-xs text-slate-500">
                  Fixed CRO layout. Configure campaign title, URL slug, and target program.
                </p>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Landing Page Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Clinical Cardiology Fellowship - 2026 Batch"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  URL Slug (/lp/...)
                </label>
                <input
                  type="text"
                  placeholder="e.g. cardiology-fellowship-2026"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Ad Campaign Source
                </label>
                <input
                  type="text"
                  placeholder="e.g. Google Ads - High Intent Doctors"
                  value={formData.campaign}
                  onChange={(e) => setFormData({ ...formData, campaign: e.target.value })}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mapped Medical Course
                </label>
                <select
                  value={formData.targetCourse}
                  onChange={(e) => setFormData({ ...formData, targetCourse: e.target.value })}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                >
                  <option>Fellowship in Clinical Cardiology</option>
                  <option>Fellowship in Critical Care Medicine</option>
                  <option>Fellowship in Laparoscopic Surgery</option>
                  <option>Fellowship in Clinical Dermatology</option>
                  <option>PG Diploma in Emergency Medicine</option>
                  <option>Fellowship in Fetal Medicine & Ultrasound</option>
                </select>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="inline-flex items-center text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200/80 py-2.5 px-4 rounded-xl shadow-2xs hover:shadow-xs transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!formData.title.trim()}
                onClick={handleSave}
                className="inline-flex items-center gap-1.5 bg-[#0B4F9C] hover:bg-[#083E7D] text-white text-xs font-bold py-2.5 px-6 rounded-xl shadow-xs transition-all disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Landing Page</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
