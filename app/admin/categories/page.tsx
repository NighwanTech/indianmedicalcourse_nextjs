"use client";

import React, { useState, useEffect } from "react";
import { categories as initialCategories } from "@/lib/data";
import { 
  FolderTree, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  X, 
  Save, 
  CheckCircle2,
  RotateCcw,
  Sparkles
} from "lucide-react";

interface CategoryItem {
  id: number;
  slug: string;
  name: string;
  subtitle?: string;
  courseCount: number;
  iconName?: string;
}

const CATEGORIES_STORAGE_KEY = "imc_categories_catalog";

export default function AdminCategoriesPage() {
  const [categoriesList, setCategoriesList] = useState<CategoryItem[]>(initialCategories);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(CATEGORIES_STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) setCategoriesList(parsed);
        } catch (e) {
          console.error("Failed to parse categories", e);
        }
      }
    }
  }, []);

  const [search, setSearch] = useState("");
  const [activeModal, setActiveModal] = useState<"create" | "edit" | null>(null);
  const [isSuccessNotification, setIsSuccessNotification] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState("Category Saved Successfully!");

  const [formData, setFormData] = useState<CategoryItem>({
    id: 0,
    slug: "",
    name: "",
    subtitle: "",
    courseCount: 0,
    iconName: "Folder",
  });

  const showSuccess = (msg: string) => {
    setNotificationMsg(msg);
    setIsSuccessNotification(true);
    setTimeout(() => setIsSuccessNotification(false), 2500);
  };

  const updateStateAndStorage = (newList: CategoryItem[]) => {
    setCategoriesList(newList);
    if (typeof window !== "undefined") {
      localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(newList));
    }
  };

  const filtered = categoriesList.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.slug.toLowerCase().includes(search.toLowerCase()) ||
    (c.subtitle ? c.subtitle.toLowerCase().includes(search.toLowerCase()) : false)
  );

  const openCreateModal = () => {
    setFormData({
      id: Date.now(),
      slug: "",
      name: "",
      subtitle: "",
      courseCount: 0,
      iconName: "Folder",
    });
    setActiveModal("create");
  };

  const openEditModal = (cat: CategoryItem) => {
    setFormData({ ...cat });
    setActiveModal("edit");
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      alert("Please provide a Category Name.");
      return;
    }

    const slug = formData.slug.trim() 
      ? formData.slug.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")
      : formData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

    const newCategory: CategoryItem = {
      ...formData,
      slug,
      subtitle: formData.subtitle || "Accredited Clinical Training Specialty",
    };

    let updatedList: CategoryItem[];
    if (activeModal === "create") {
      updatedList = [newCategory, ...categoriesList];
      showSuccess(`Created category "${newCategory.name}"`);
    } else {
      updatedList = categoriesList.map((c) => (c.id === formData.id ? newCategory : c));
      showSuccess(`Updated category "${newCategory.name}"`);
    }

    updateStateAndStorage(updatedList);
    setActiveModal(null);
  };

  const handleDelete = (id: number, name: string) => {
    if (confirm(`Are you sure you want to delete the "${name}" specialty category?`)) {
      const updatedList = categoriesList.filter((c) => c.id !== id);
      updateStateAndStorage(updatedList);
      showSuccess(`Deleted category "${name}"`);
    }
  };

  const handleResetDefaults = () => {
    if (confirm("Reset categories back to default seed list?")) {
      updateStateAndStorage(initialCategories);
      showSuccess("Categories reset to default specialties.");
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 font-display">
            Medical Categories & Specialties
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage specialty taxonomies, icon assets, and course grouping tags. All changes persist across the website.
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
            onClick={handleResetDefaults}
            className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-2.5 px-3 rounded-xl transition-all cursor-pointer"
            title="Reset to default categories"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Defaults</span>
          </button>

          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 bg-[#0B4F9C] hover:bg-[#083E7D] text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Category</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search specialty by name or slug..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-[#0B4F9C]"
          />
        </div>
        <span className="text-xs font-bold text-slate-500">
          Showing {filtered.length} of {categoriesList.length} Specialties
        </span>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {filtered.map((cat) => (
          <div
            key={cat.id}
            className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-black uppercase tracking-wider bg-blue-50 text-blue-800 px-2 py-0.5 rounded-md">
                  /{cat.slug}
                </span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                  {cat.courseCount || 0} Courses
                </span>
              </div>

              <h3 className="text-sm font-extrabold text-slate-900 leading-snug group-hover:text-[#0B4F9C] transition-colors">
                {cat.name}
              </h3>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                {cat.subtitle}
              </p>
            </div>

            <div className="pt-3 mt-4 border-t border-slate-100 flex items-center justify-between">
              <a
                href={`/courses?category=${cat.slug}`}
                target="_blank"
                className="text-xs font-bold text-blue-700 hover:underline"
              >
                View Hub ↗
              </a>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => openEditModal(cat)}
                  className="text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg cursor-pointer transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(cat.id, cat.name)}
                  className="text-xs text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded-lg cursor-pointer transition-colors"
                  title="Delete Category"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* REAL INTERACTIVE MODAL: ADD / EDIT CATEGORY                               */}
      {/* ========================================================================= */}
      {activeModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in fade-in zoom-in-95">
            
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="text-base font-black text-slate-900 font-display">
                  {activeModal === "create" ? "Add Specialty Category" : `Edit Category: ${formData.name}`}
                </h3>
                <p className="text-xs text-slate-500">
                  Taxonomy category automatically appears in Course Editor and Filter Bar.
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
                  Category Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Clinical Cardiology"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:bg-white focus:outline-hidden focus:border-[#0B4F9C]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  URL Slug
                </label>
                <input
                  type="text"
                  placeholder="e.g. clinical-cardiology"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-700 focus:bg-white focus:outline-hidden focus:border-[#0B4F9C]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Subtitle Description
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. 2D Echo, TPI & ICCU Protocols"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-[#0B4F9C]"
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
                disabled={!formData.name.trim()}
                onClick={handleSave}
                className="inline-flex items-center gap-1.5 bg-[#0B4F9C] hover:bg-[#083E7D] text-white text-xs font-bold py-2.5 px-6 rounded-xl shadow-xs transition-all disabled:opacity-50 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Category</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
