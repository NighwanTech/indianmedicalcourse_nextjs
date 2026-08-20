"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { blogPosts as initialBlogPosts, courses } from "@/lib/data";
import { BlogPost } from "@/types";
import { MediaLibraryPickerModal, MediaItem } from "@/components/admin/MediaLibraryPickerModal";
import { 
  FileText, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  Clock, 
  X, 
  Save, 
  CheckCircle2,
  Image as ImageIcon,
  ExternalLink,
  Tag,
  BookOpen,
  User,
  Sparkles,
  Code
} from "lucide-react";

export const ADMIN_BLOGS_STORAGE_KEY = "imc_admin_blog_posts";

export default function AdminBlogsPage() {
  const [postsList, setPostsList] = useState<BlogPost[]>(initialBlogPosts);
  const [search, setSearch] = useState("");
  const [activeModal, setActiveModal] = useState<"create" | "edit" | null>(null);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [mediaTargetField, setMediaTargetField] = useState<"coverImage" | "authorAvatar">("coverImage");
  const [isSuccessNotification, setIsSuccessNotification] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState("Article Saved Successfully!");

  const [formData, setFormData] = useState<Partial<BlogPost>>({
    id: 0,
    title: "",
    slug: "",
    category: "Clinical Cardiology",
    excerpt: "",
    contentHtml: "",
    coverImage: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=1200&auto=format&fit=crop&q=80",
    authorName: "Dr. K. S. Murthy",
    authorDesignation: "DM (Cardiology), Senior ICCU Consultant",
    authorBio: "Interventional Cardiologist and Academic Director mentoring fellows in acute cardiac emergencies.",
    authorAvatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&auto=format&fit=crop&q=80",
    readTimeMinutes: 7,
    publishedAt: new Date().toISOString().split("T")[0],
    tags: ["Cardiology", "Fellowship", "Clinical Protocols"],
    metaTitle: "",
    metaDescription: "",
    relatedCourseSlug: "fellowship-in-clinical-cardiology",
    relatedCourseTitle: "Fellowship in Clinical Cardiology",
  });

  // Load from LocalStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(ADMIN_BLOGS_STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setPostsList(parsed);
          }
        } catch (e) {}
      }
    }
  }, []);

  const saveToStorage = (updated: BlogPost[]) => {
    setPostsList(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem(ADMIN_BLOGS_STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event("storage"));
    }
  };

  const showNotification = (msg: string) => {
    setNotificationMsg(msg);
    setIsSuccessNotification(true);
    setTimeout(() => setIsSuccessNotification(false), 2500);
  };

  const filtered = postsList.filter((b) =>
    b.title.toLowerCase().includes(search.toLowerCase()) ||
    b.category.toLowerCase().includes(search.toLowerCase()) ||
    b.authorName.toLowerCase().includes(search.toLowerCase())
  );

  const openCreateModal = () => {
    setFormData({
      id: Date.now(),
      title: "",
      slug: "",
      category: "Clinical Cardiology",
      excerpt: "",
      contentHtml: `<h2>1. Clinical Overview</h2>\n<p>Enter your evidence-based medical guide, procedural steps, and diagnostic protocols here...</p>`,
      coverImage: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=1200&auto=format&fit=crop&q=80",
      authorName: "Dr. K. S. Murthy",
      authorDesignation: "DM (Cardiology), Senior ICCU Consultant",
      authorBio: "Interventional Cardiologist and Academic Director mentoring fellows in acute cardiac emergencies.",
      authorAvatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&auto=format&fit=crop&q=80",
      readTimeMinutes: 6,
      publishedAt: new Date().toISOString().split("T")[0],
      tags: ["Clinical Guide", "Medical Fellowship"],
      metaTitle: "",
      metaDescription: "",
      relatedCourseSlug: "fellowship-in-clinical-cardiology",
    });
    setActiveModal("create");
  };

  const openEditModal = (post: BlogPost) => {
    setFormData({ ...post });
    setActiveModal("edit");
  };

  const handleSave = () => {
    if (!formData.title?.trim()) {
      alert("Please enter an article title.");
      return;
    }

    const slug = formData.slug?.trim() || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    
    const postItem: BlogPost = {
      id: formData.id || Date.now(),
      slug,
      title: formData.title,
      category: formData.category || "Clinical Medicine",
      excerpt: formData.excerpt || "",
      contentHtml: formData.contentHtml || `<p>${formData.excerpt}</p>`,
      coverImage: formData.coverImage || "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=1200&auto=format&fit=crop&q=80",
      authorName: formData.authorName || "Faculty Member",
      authorDesignation: formData.authorDesignation || "Senior Specialist",
      authorBio: formData.authorBio || "",
      authorAvatar: formData.authorAvatar || "",
      readTimeMinutes: Number(formData.readTimeMinutes) || 5,
      publishedAt: formData.publishedAt || new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
      tags: typeof formData.tags === "string" ? (formData.tags as string).split(",").map((t) => t.trim()) : formData.tags,
      metaTitle: formData.metaTitle || formData.title,
      metaDescription: formData.metaDescription || formData.excerpt,
      relatedCourseSlug: formData.relatedCourseSlug,
    };

    let updated: BlogPost[];
    if (activeModal === "create") {
      updated = [postItem, ...postsList];
    } else {
      updated = postsList.map((p) => (p.id === postItem.id ? postItem : p));
    }

    saveToStorage(updated);
    setActiveModal(null);
    showNotification("Article Published & Live!");
  };

  const handleDelete = (id: number, title: string) => {
    if (confirm(`Are you sure you want to delete article "${title}"?`)) {
      const updated = postsList.filter((p) => p.id !== id);
      saveToStorage(updated);
      showNotification("Article deleted.");
    }
  };

  const handleMediaSelected = (media: MediaItem) => {
    if (mediaTargetField === "coverImage") {
      setFormData((prev) => ({ ...prev, coverImage: media.url }));
    } else {
      setFormData((prev) => ({ ...prev, authorAvatar: media.url }));
    }
    setIsMediaPickerOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 font-display">
            Medical Blogs & Clinical Articles CMS
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Publish and manage SEO-optimized clinical guides, case protocols, and research insights.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isSuccessNotification && (
            <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-2 rounded-xl animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{notificationMsg}</span>
            </div>
          )}

          <Link
            href="/blogs"
            target="_blank"
            className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-2.5 px-4 rounded-xl transition-all"
          >
            <span>View Public Blog Hub</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 bg-[#0B4F9C] hover:bg-[#083E7D] text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Write New Article</span>
          </button>
        </div>
      </div>

      {/* Search Filter */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400 shrink-0" />
        <input
          type="text"
          placeholder="Search articles by title, specialty category, or author name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full text-xs bg-transparent border-none outline-hidden text-slate-900 placeholder:text-slate-400"
        />
        {search && (
          <button onClick={() => setSearch("")} className="text-xs text-slate-400 hover:text-slate-600">
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((post) => (
          <div
            key={post.id}
            className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div className="relative h-48 bg-slate-900 overflow-hidden">
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 bg-[#0B4F9C] text-white text-[10px] font-black px-3 py-1 rounded-full shadow-xs">
                {post.category}
              </div>
            </div>

            <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                  <span className="text-slate-700 font-bold">{post.authorName}</span>
                  <span>•</span>
                  <span>{post.readTimeMinutes} min read</span>
                </div>

                <h3 className="text-sm font-black text-slate-900 leading-snug line-clamp-2 font-display">
                  {post.title}
                </h3>

                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {post.excerpt}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <Link
                  href={`/blogs/${post.slug}`}
                  target="_blank"
                  className="inline-flex items-center gap-1 text-xs font-extrabold text-[#0B4F9C] hover:underline"
                >
                  <span>View Live ↗</span>
                </Link>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openEditModal(post)}
                    className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl transition-colors cursor-pointer"
                    title="Edit Article"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleDelete(post.id, post.title)}
                    className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-colors cursor-pointer"
                    title="Delete Article"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200">
          <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <div className="text-sm font-bold text-slate-700">No articles found</div>
          <p className="text-xs text-slate-400 mt-1">Try adjusting your search query or write a new article.</p>
        </div>
      )}

      {/* ========================================================================= */}
      {/* RICH ARTICLE EDITOR MODAL                                                 */}
      {/* ========================================================================= */}
      {activeModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 max-h-[92vh]">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#0B4F9C]" />
                <h3 className="text-base font-black text-slate-900 font-display">
                  {activeModal === "create" ? "Write & Publish Medical Article" : "Edit Clinical Article"}
                </h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Scroll Body */}
            <div className="p-6 space-y-5 overflow-y-auto flex-1 text-xs">
              
              {/* Title & Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Article Title (H1)</label>
                  <input
                    type="text"
                    value={formData.title || ""}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. How to Interpret Complex Arrhythmias in the Cardiac ICU"
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">URL Slug</label>
                  <input
                    type="text"
                    value={formData.slug || ""}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="e.g. how-to-interpret-complex-ecg-arrhythmias"
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Specialty Category</label>
                  <select
                    value={formData.category || "Clinical Cardiology"}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold cursor-pointer"
                  >
                    <option value="Clinical Cardiology">Clinical Cardiology</option>
                    <option value="Critical Care">Critical Care & ICU</option>
                    <option value="Emergency Medicine">Emergency Medicine</option>
                    <option value="Fetal Medicine & OB-GYN">Fetal Medicine & Ultrasound</option>
                    <option value="Clinical Dermatology">Clinical Dermatology</option>
                    <option value="Clinical Diabetology">Clinical Diabetology</option>
                    <option value="General Medicine">General Medicine & Family Practice</option>
                  </select>
                </div>
              </div>

              {/* Excerpt */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Article Excerpt (Summary)</label>
                <textarea
                  rows={2}
                  value={formData.excerpt || ""}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="Short engaging overview displayed in listings and SEO snippets..."
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
                />
              </div>

              {/* Cover Image */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Featured Cover Image URL</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={formData.coverImage || ""}
                    onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                    className="w-full text-xs font-mono p-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setMediaTargetField("coverImage");
                      setIsMediaPickerOpen(true);
                    }}
                    className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 hover:bg-blue-100 px-3 py-2 rounded-xl font-bold shrink-0 cursor-pointer"
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Media Library</span>
                  </button>
                </div>
              </div>

              {/* Full Rich Article HTML Content */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-slate-700 flex items-center gap-1.5">
                    <Code className="w-3.5 h-3.5 text-blue-600" />
                    <span>Article Content (HTML / Rich Text)</span>
                  </label>
                  <span className="text-[10px] text-slate-400 font-mono">Supports &lt;h2&gt;, &lt;p&gt;, &lt;table&gt;, &lt;ul&gt;, &lt;ol&gt;</span>
                </div>
                <textarea
                  rows={10}
                  value={formData.contentHtml || ""}
                  onChange={(e) => setFormData({ ...formData, contentHtml: e.target.value })}
                  placeholder="<h2>1. Overview</h2><p>Article body goes here...</p>"
                  className="w-full text-xs font-mono p-3 bg-slate-900 text-slate-100 rounded-2xl focus:outline-hidden"
                />
              </div>

              {/* Author Details Grid */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <h4 className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-blue-600" />
                  <span>Author Credentials & Bio</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Author Name</label>
                    <input
                      type="text"
                      value={formData.authorName || ""}
                      onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                      placeholder="Dr. K. S. Murthy"
                      className="w-full text-xs p-2 bg-white border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Author Qualifications & Role</label>
                    <input
                      type="text"
                      value={formData.authorDesignation || ""}
                      onChange={(e) => setFormData({ ...formData, authorDesignation: e.target.value })}
                      placeholder="DM (Cardiology), Senior ICCU Consultant"
                      className="w-full text-xs p-2 bg-white border border-slate-200 rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Author Short Bio</label>
                  <textarea
                    rows={2}
                    value={formData.authorBio || ""}
                    onChange={(e) => setFormData({ ...formData, authorBio: e.target.value })}
                    placeholder="Brief description of author's clinical background and affiliations..."
                    className="w-full text-xs p-2 bg-white border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              {/* SEO & Related Course Mapping */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Estimated Read Time (Minutes)</label>
                  <input
                    type="number"
                    value={formData.readTimeMinutes || 5}
                    onChange={(e) => setFormData({ ...formData, readTimeMinutes: Number(e.target.value) || 5 })}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Connected Fellowship Program</label>
                  <select
                    value={formData.relatedCourseSlug || "fellowship-in-clinical-cardiology"}
                    onChange={(e) => setFormData({ ...formData, relatedCourseSlug: e.target.value })}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold cursor-pointer"
                  >
                    {courses.map((c) => (
                      <option key={c.id} value={c.slug}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

            </div>

            {/* Modal Bottom Actions */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="text-xs font-bold text-slate-600 hover:text-slate-900 px-4 py-2 cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSave}
                className="inline-flex items-center gap-1.5 bg-[#0B4F9C] hover:bg-[#083E7D] text-white text-xs font-bold py-2.5 px-6 rounded-xl shadow-xs cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Publish Article</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Media Picker Modal */}
      {isMediaPickerOpen && (
        <MediaLibraryPickerModal
          isOpen={isMediaPickerOpen}
          onClose={() => setIsMediaPickerOpen(false)}
          onSelect={handleMediaSelected}
        />
      )}

    </div>
  );
}
