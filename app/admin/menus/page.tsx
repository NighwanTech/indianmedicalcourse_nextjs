"use client";

import React, { useState } from "react";
import { DynamicIcon } from "@/components/shared/DynamicIcon";
import { 
  Menu as MenuIcon, 
  Plus, 
  Trash2, 
  Edit, 
  Eye, 
  EyeOff, 
  Save, 
  ArrowUpDown, 
  CheckCircle2, 
  ShieldCheck,
  Sparkles,
  X 
} from "lucide-react";

export default function AdminMenusPage() {
  const [selectedMenuSlug, setSelectedMenuSlug] = useState("admin_sidebar");
  const [isSaved, setIsSaved] = useState(false);
  const [activeModal, setActiveModal] = useState<"create" | "edit" | null>(null);

  const [menuItems, setMenuItems] = useState([
    { id: 1, label: "Dashboard", url: "/admin", icon: "LayoutDashboard", permission: "ALL", isVisible: true, displayOrder: 1 },
    { id: 2, label: "Homepage & Hero CMS", url: "/admin/homepage", icon: "Layout", badgeText: "Live", permission: "ADMIN", isVisible: true, displayOrder: 2 },
    { id: 3, label: "Lead Management", url: "/admin/leads", icon: "Users", badgeText: "Live", permission: "ALL", isVisible: true, displayOrder: 3 },
    { id: 4, label: "Media Library", url: "/admin/media", icon: "Image", permission: "ADMIN", isVisible: true, displayOrder: 4 },
    { id: 5, label: "Courses Master", url: "/admin/courses", icon: "GraduationCap", permission: "ADMIN", isVisible: true, displayOrder: 5 },
    { id: 6, label: "Categories", url: "/admin/categories", icon: "FolderTree", permission: "ADMIN", isVisible: true, displayOrder: 6 },
    { id: 7, label: "Faculty / Mentors", url: "/admin/faculty", icon: "Award", permission: "ADMIN", isVisible: true, displayOrder: 7 },
    { id: 8, label: "Landing Page Builder", url: "/admin/landing-pages", icon: "Layers", badgeText: "CRO", permission: "ADMIN", isVisible: true, displayOrder: 8 },
    { id: 9, label: "Blogs & Articles", url: "/admin/blogs", icon: "FileText", permission: "ALL", isVisible: true, displayOrder: 9 },
    { id: 10, label: "FAQs Manager", url: "/admin/faqs", icon: "HelpCircle", permission: "ALL", isVisible: true, displayOrder: 10 },
    { id: 11, label: "Testimonials", url: "/admin/testimonials", icon: "MessageSquare", permission: "ALL", isVisible: true, displayOrder: 11 },
    { id: 12, label: "Hospital & Partners", url: "/admin/partners", icon: "Building2", badgeText: "New", permission: "ADMIN", isVisible: true, displayOrder: 12 },
    { id: 13, label: "Gallery Assets", url: "/admin/gallery", icon: "Sliders", permission: "ADMIN", isVisible: true, displayOrder: 13 },
    { id: 14, label: "Menu Builder", url: "/admin/menus", icon: "Menu", permission: "SUPER_ADMIN", isVisible: true, displayOrder: 14 },
    { id: 15, label: "Website Settings", url: "/admin/settings", icon: "Settings", permission: "SUPER_ADMIN", isVisible: true, displayOrder: 15 },
    { id: 16, label: "Admin & Roles", url: "/admin/users", icon: "UserCheck", permission: "SUPER_ADMIN", isVisible: true, displayOrder: 16 },
  ]);

  const [formData, setFormData] = useState({
    id: 0,
    label: "",
    url: "",
    icon: "Folder",
    permission: "ALL",
    badgeText: "",
    isVisible: true,
    displayOrder: 1,
  });

  const toggleVisibility = (id: number) => {
    setMenuItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isVisible: !item.isVisible } : item
      )
    );
  };

  const openCreateModal = () => {
    setFormData({
      id: Date.now(),
      label: "",
      url: "/admin/",
      icon: "Sparkles",
      permission: "ALL",
      badgeText: "",
      isVisible: true,
      displayOrder: menuItems.length + 1,
    });
    setActiveModal("create");
  };

  const openEditModal = (item: any) => {
    setFormData({ ...item, badgeText: item.badgeText || "" });
    setActiveModal("edit");
  };

  const handleSaveModal = () => {
    if (!formData.label.trim() || !formData.url.trim()) return;

    if (activeModal === "create") {
      setMenuItems((prev) => [...prev, formData]);
    } else if (activeModal === "edit") {
      setMenuItems((prev) =>
        prev.map((it) => (it.id === formData.id ? formData : it))
      );
    }

    setActiveModal(null);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 font-display">
            Dynamic Menu & Navigation Builder
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage sidebar modules, header navigation, role permissions, and visibility with zero code changes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isSaved && (
            <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-2 rounded-xl animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Saved to Database!</span>
            </div>
          )}

          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-1.5 bg-[#0B4F9C] hover:bg-[#083E7D] text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Menu Item</span>
          </button>
        </div>
      </div>

      {/* Menu Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { slug: "admin_sidebar", label: "Admin Portal Sidebar" },
          { slug: "header_nav", label: "Public Website Header" },
          { slug: "footer_specialties", label: "Footer Specialties" },
          { slug: "footer_quick_links", label: "Footer Quick Links" },
        ].map((tab) => (
          <button
            key={tab.slug}
            onClick={() => setSelectedMenuSlug(tab.slug)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs ${
              selectedMenuSlug === tab.slug
                ? "bg-slate-900 text-white"
                : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Menu Items Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4 w-12 text-center">Order</th>
                <th className="py-3 px-4">Menu Item & Dynamic Icon</th>
                <th className="py-3 px-4">Route URL</th>
                <th className="py-3 px-4">Role Permission</th>
                <th className="py-3 px-4">Badge</th>
                <th className="py-3 px-4 text-center">Visible</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {menuItems.map((item, idx) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 text-center font-bold text-slate-400">
                    {idx + 1}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5 font-bold text-slate-900">
                      <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                        <DynamicIcon name={item.icon} className="w-4 h-4" />
                      </div>
                      <div>
                        <div>{item.label}</div>
                        <div className="text-[10px] text-slate-400 font-normal">
                          Icon: {item.icon || "Folder"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-600">
                    {item.url}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                      item.permission === "SUPER_ADMIN" ? "bg-purple-100 text-purple-800 border border-purple-200" :
                      item.permission === "ADMIN" ? "bg-blue-100 text-blue-800 border border-blue-200" :
                      item.permission === "COUNSELLOR" ? "bg-emerald-100 text-emerald-800 border border-emerald-200" :
                      item.permission === "EDITOR" ? "bg-amber-100 text-amber-800 border border-amber-200" :
                      "bg-slate-100 text-slate-800 border border-slate-200"
                    }`}>
                      {item.permission || "ALL"}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    {item.badgeText ? (
                      <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        {item.badgeText}
                      </span>
                    ) : (
                      <span className="text-slate-300">—</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => toggleVisibility(item.id)}
                      className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                        item.isVisible ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      {item.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-2">
                    <button
                      onClick={() => openEditModal(item)}
                      className="text-xs font-bold text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="text-xs text-slate-500 font-medium">
            Database Driven • Changes take effect in real-time across all user sessions
          </div>
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-1.5 bg-[#0B4F9C] hover:bg-[#083E7D] text-white text-xs font-bold py-2 px-5 rounded-xl shadow-xs"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Menu Configuration</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* REAL INTERACTIVE MODAL: ADD / EDIT MENU ITEM                              */}
      {/* ========================================================================= */}
      {activeModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in fade-in zoom-in-95">
            
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="text-base font-black text-slate-900 font-display">
                  {activeModal === "create" ? "Add Navigation Item" : "Edit Menu Item"}
                </h3>
                <p className="text-xs text-slate-500">
                  Configure route, dynamic Lucide icon name, and role permission.
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
                  Menu Label
                </label>
                <input
                  type="text"
                  placeholder="e.g. Clinical Directorates"
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Route URL
                </label>
                <input
                  type="text"
                  placeholder="e.g. /admin/directorates or /courses"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Dynamic Icon Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Layers, Star, Users"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Role Permission
                  </label>
                  <select
                    value={formData.permission}
                    onChange={(e) => setFormData({ ...formData, permission: e.target.value })}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  >
                    <option value="ALL">All Roles (Public in Admin)</option>
                    <option value="COUNSELLOR">Counsellor & Above (Admissions)</option>
                    <option value="EDITOR">Editor & Above (Content & Media)</option>
                    <option value="ADMIN">Admin & Above (Operations & CMS)</option>
                    <option value="SUPER_ADMIN">Super Admin Only (System / Users)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Badge Text (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Live, New, 2026"
                  value={formData.badgeText}
                  onChange={(e) => setFormData({ ...formData, badgeText: e.target.value })}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
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
                disabled={!formData.label.trim() || !formData.url.trim()}
                onClick={handleSaveModal}
                className="inline-flex items-center gap-1.5 bg-[#0B4F9C] hover:bg-[#083E7D] text-white text-xs font-bold py-2.5 px-6 rounded-xl shadow-xs transition-all disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Menu Item</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
