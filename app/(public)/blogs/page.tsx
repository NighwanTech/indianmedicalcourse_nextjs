"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { blogPosts as defaultBlogPosts } from "@/lib/data";
import { BlogPost } from "@/types";
import { 
  FileText, 
  Clock, 
  User, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  BookOpen,
  Search,
  X,
  Filter,
  ShieldCheck
} from "lucide-react";

export default function PublicBlogsPage() {
  const [posts, setPosts] = useState<BlogPost[]>(defaultBlogPosts);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");

  // Sync with Admin CMS LocalStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("imc_admin_blog_posts");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setPosts(parsed);
          }
        }
      } catch (e) {}
    }
  }, []);

  // Categories list
  const categories = useMemo(() => {
    const set = new Set<string>();
    posts.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return ["ALL", ...Array.from(set)];
  }, [posts]);

  // Filtered Posts
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      if (selectedCategory !== "ALL" && post.category !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = post.title.toLowerCase().includes(q);
        const matchExcerpt = (post.excerpt || "").toLowerCase().includes(q);
        const matchAuthor = (post.authorName || "").toLowerCase().includes(q);
        const matchCategory = (post.category || "").toLowerCase().includes(q);
        if (!matchTitle && !matchExcerpt && !matchAuthor && !matchCategory) return false;
      }
      return true;
    });
  }, [posts, selectedCategory, searchQuery]);

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-800 text-xs font-black uppercase px-4 py-1.5 rounded-full border border-blue-200 shadow-2xs">
            <BookOpen className="w-3.5 h-3.5 text-blue-600" />
            <span>Clinical Knowledge & Research Hub</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight font-display">
            Medical Insights & <span className="text-[#0B4F9C]">Clinical Guidelines</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Evidence-based clinical reviews, procedural updates, ECG algorithms, ICU management protocols, and career guides for medical doctors.
          </p>
        </div>

        {/* Search & Category Filter Dock */}
        <div className="max-w-4xl mx-auto space-y-4">
          
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search clinical guides by disease, ECG, ventilator, ultrasound, or specialty..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-10 py-3.5 bg-white border border-slate-200 rounded-2xl text-xs sm:text-sm font-medium shadow-xs focus:outline-hidden focus:border-blue-500 text-slate-900 placeholder:text-slate-400 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 justify-start sm:justify-center">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? "bg-[#0B4F9C] text-white shadow-xs scale-105"
                      : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {cat === "ALL" ? "All Specialties" : cat}
                </button>
              );
            })}
          </div>

        </div>

        {/* ========================================================================= */}
        {/* ARTICLES GRID - 100% CLICKABLE CARDS EVERYWHERE                           */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <Link
              key={post.id}
              href={`/blogs/${post.slug}`}
              className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group cursor-pointer block"
            >
              {/* Cover Image & Category Pill */}
              <div className="relative h-56 bg-slate-900 overflow-hidden">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="bg-[#0B4F9C] text-white text-[11px] font-black px-3 py-1 rounded-full shadow-md uppercase tracking-wider">
                    {post.category}
                  </span>
                </div>
                <div className="absolute bottom-3 right-3">
                  <span className="bg-slate-950/70 backdrop-blur-md text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-lg border border-white/20 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    <span>Peer-Reviewed</span>
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2.5">
                  
                  {/* Author & Read Time */}
                  <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
                    <span className="flex items-center gap-1.5 text-slate-700 font-bold">
                      <User className="w-3.5 h-3.5 text-blue-600" />
                      {post.authorName}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {post.readTimeMinutes} min read
                    </span>
                  </div>

                  {/* Headline Title */}
                  <h2 className="text-lg font-black text-slate-900 group-hover:text-[#0B4F9C] transition-colors leading-snug font-display">
                    {post.title}
                  </h2>

                  {/* Excerpt */}
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>

                </div>

                {/* Card Footer */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400">
                    {post.publishedAt}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-black text-[#0B4F9C] group-hover:text-[#083E7D] group-hover:translate-x-1.5 transition-all">
                    <span>Read Full Guide</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>

              </div>
            </Link>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 space-y-3">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-black text-slate-800">No matching articles found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try searching with different keywords or reset the specialty category filter.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("ALL");
              }}
              className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs font-bold px-4 py-2 rounded-xl cursor-pointer hover:bg-blue-100 transition-colors"
            >
              <span>Reset Filters</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
