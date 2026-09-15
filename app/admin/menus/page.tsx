"use client";

import React, { useState, useEffect } from "react";
import { DynamicIcon } from "@/components/shared/DynamicIcon";
import { 
  Menu as MenuIcon, 
  Plus, 
  Trash2, 
  Edit, 
  Eye, 
  EyeOff, 
  Save, 
  ArrowUp, 
  ArrowDown, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  X,
  RefreshCw,
  AlertCircle,
  ExternalLink
} from "lucide-react";

export default function AdminMenusPage() {
  const [selectedMenuSlug, setSelectedMenuSlug] = useState("admin_sidebar");
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSavedNotification, setIsSavedNotification] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeModal, setActiveModal] = useState<"create" | "edit" | null>(null);

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

  const loadMenu = async (slug: string) => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      const res = await fetch(`/api/admin/menus?slug=${slug}`);
      const data = await res.json();
      if (res.ok && Array.isArray(data.items)) {
        setMenuItems(data.items);
      } else {
        setMenuItems([]);
      }
    } catch (err: any) {
      setErrorMessage("Failed to load menu items from database.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMenu(selectedMenuSlug);
  }, [selectedMenuSlug]);

  const toggleVisibility = (id: number) => {
    setMenuItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isVisible: !item.isVisible } : item
      )
    );
  };

  const moveItem = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= menuItems.length) return;

    const updated = [...menuItems];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    // Recalculate displayOrder
    const reordered = updated.map((it, idx) => ({ ...it, displayOrder: idx + 1 }));
    setMenuItems(reordered);
  };

  const openCreateModal = () => {
    setFormData({
      id: Date.now(),
      label: "",
      url: selectedMenuSlug.startsWith("admin") ? "/admin/" : "/",
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

  const deleteItem = async (id: number) => {
    if (!confirm("Are you sure you want to remove this menu item?")) return;
    setMenuItems((prev) => prev.filter((it) => it.id !== id));
    if (id < 1000000000) {
      try {
        await fetch(`/api/admin/menus?id=${id}`, { method: "DELETE" });
      } catch {}
    }
  };

  const handleSaveModal = () => {
    if (!formData.label.trim() || !formData.url.trim()) return;

    if (activeModal === "create") {
      setMenuItems((prev) => [...prev, { ...formData, displayOrder: prev.length + 1 }]);
    } else if (activeModal === "edit") {
      setMenuItems((prev) =>
        prev.map((it) => (it.id === formData.id ? formData : it))
      );
    }

    setActiveModal(null);
  };

  const handleSaveToDatabase = async () => {
    try {
      setIsSaving(true);
      setErrorMessage(null);

      const res = await fetch("/api/admin/menus", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          menuSlug: selectedMenuSlug,
          items: menuItems,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save menu");
      }

      if (data.items) {
        setMenuItems(data.items);
      }

      setIsSavedNotification(true);
      setTimeout(() => setIsSavedNotification(false), 3500);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to save menu configuration");
    } finally {
      setIsSaving(false);
    }
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
            Manage sidebar modules, header navigation, role permissions, and visibility with real MySQL persistence.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isSavedNotification && (
            <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-2 rounded-xl animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Saved to Database!</span>
            </div>
          )}

          <button
            onClick={() => loadMenu(selectedMenuSlug)}
            title="Reload from database"
            className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-blue-600" : ""}`} />
          </button>

          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-1.5 bg-[#0B4F9C] hover:bg-[#083E7D] text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Menu Item</span>
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-600 text-xs font-bold px-4 py-3 rounded-2xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

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
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer ${
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
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <div className="inline-flex items-center gap-2 text-xs font-bold">
                      <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
                      <span>Loading menu items from MySQL database...</span>
                    </div>
                  </td>
                </tr>
              ) : menuItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    <p className="font-bold">No menu items found in this menu.</p>
                    <p className="text-xs text-slate-400 mt-1">Click &quot;Add Menu Item&quot; above to create one.</p>
                  </td>
                </tr>
              ) : (
                menuItems.map((item, idx) => (
                  <tr key={item.id || idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 text-center font-bold text-slate-400">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => moveItem(idx, "up")}
                          disabled={idx === 0}
                          title="Move up"
                          className="p-1 hover:bg-slate-200 rounded disabled:opacity-20 cursor-pointer"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </button>
                        <span>{idx + 1}</span>
                        <button
                          onClick={() => moveItem(idx, "down")}
                          disabled={idx === menuItems.length - 1}
                          title="Move down"
                          className="p-1 hover:bg-slate-200 rounded disabled:opacity-20 cursor-pointer"
                        >
                          <ArrowDown className="w-3 h-3" />
                        </button>
                      </div>
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
                      <span className="bg-slate-50 border border-slate-200 px-2 py-1 rounded text-[11px]">
                        {item.url}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
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
                        <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                          {item.badgeText}
                        </span>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => toggleVisibility(item.id)}
                        title={item.isVisible ? "Visible (click to hide)" : "Hidden (click to show)"}
                        className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          item.isVisible ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100" : "bg-slate-100 text-slate-400 hover:bg-slate-200"
                        }`}
                      >
                        {item.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(item)}
                        className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteItem(item.id)}
                        className="text-xs font-bold text-red-500 hover:underline cursor-pointer ml-2"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="text-xs text-slate-500 font-medium">
            Database Driven • Changes take effect in real-time across all user sessions
          </div>
          <button
            onClick={handleSaveToDatabase}
            disabled={isSaving || isLoading}
            className="inline-flex items-center gap-1.5 bg-[#0B4F9C] hover:bg-[#083E7D] text-white text-xs font-bold py-2.5 px-6 rounded-xl shadow-xs transition-all disabled:opacity-50 cursor-pointer"
          >
            {isSaving ? (
              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
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
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 cursor-pointer"
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
                className="inline-flex items-center gap-1.5 bg-[#0B4F9C] hover:bg-[#083E7D] text-white text-xs font-bold py-2.5 px-6 rounded-xl shadow-xs transition-all disabled:opacity-50 cursor-pointer"
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
