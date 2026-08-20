"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { BlogPost, Course } from "@/types";
import { 
  Calendar, 
  Clock, 
  User, 
  ArrowLeft, 
  Share2, 
  CheckCircle2, 
  Bookmark, 
  Sparkles, 
  ArrowRight, 
  GraduationCap, 
  Award, 
  Building2, 
  Phone, 
  ChevronRight,
  BookOpen,
  MessageSquare,
  Copy,
  Tag as TagIcon,
  Check,
  Stethoscope,
  ShieldCheck,
  Send,
  Eye
} from "lucide-react";

interface Props {
  initialPost: BlogPost;
  relatedCourse?: Course;
  relatedPosts: BlogPost[];
}

export function BlogDetailClientView({
  initialPost,
  relatedCourse,
  relatedPosts,
}: Props) {
  const [post, setPost] = useState<BlogPost>(initialPost);
  const [isCopied, setIsCopied] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeTocId, setActiveTocId] = useState<string>("");

  // Check LocalStorage on mount for any Admin edits
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const savedBlogs = localStorage.getItem("imc_admin_blog_posts");
        if (savedBlogs) {
          const parsed = JSON.parse(savedBlogs);
          if (Array.isArray(parsed)) {
            const found = parsed.find((p: any) => p.slug === initialPost.slug || p.id === initialPost.id);
            if (found) {
              setPost((prev) => ({ ...prev, ...found }));
            }
          }
        }
      } catch (e) {}
    }
  }, [initialPost]);

  // Track Reading Progress Bar
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (windowHeight > 0) {
        const scroll = `${(totalScroll / windowHeight) * 100}`;
        setScrollProgress(Number(scroll));
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Share Handlers
  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    }
  };

  const currentBlogUrl = `https://indianmedicalcourse.com/blogs/${post.slug}`;
  const whatsappShareUrl = `https://wa.me/?text=${encodeURIComponent(
    `Check out this clinical guide on ${post.title} at Indian Medical Course:\n${currentBlogUrl}`
  )}`;

  const linkedinShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
    currentBlogUrl
  )}`;

  const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    post.title
  )}&url=${encodeURIComponent(
    currentBlogUrl
  )}`;

  // Parse Headings for Table of Contents
  const tocItems = useMemo(() => {
    if (!post.contentHtml) return [];
    const matches = post.contentHtml.matchAll(/<h2[^>]*>(.*?)<\/h2>/g);
    const items = [];
    let idx = 1;
    for (const match of matches) {
      const text = match[1].replace(/<[^>]*>/g, "").trim();
      const id = `section-${idx++}`;
      items.push({ id, text });
    }
    return items;
  }, [post.contentHtml]);

  return (
    <div className="bg-[#F8FAFC] min-h-screen">
      
      {/* 1. Top Viewport Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1.5 bg-slate-200/50 z-50">
        <div
          className="h-full bg-linear-to-r from-[#0B4F9C] via-blue-600 to-indigo-600 transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* 2. Main Article Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 lg:py-12 space-y-8">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500 overflow-x-auto whitespace-nowrap pb-1">
          <Link href="/" className="hover:text-blue-700 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <Link href="/blogs" className="hover:text-blue-700 transition-colors">
            Clinical Knowledge Hub
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="text-[#0B4F9C] bg-blue-50 px-2 py-0.5 rounded-md font-bold">
            {post.category}
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="text-slate-900 font-bold truncate max-w-[240px]">
            {post.title}
          </span>
        </nav>

        {/* Article Header Header Section */}
        <header className="space-y-6 max-w-4xl">
          
          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-[#0B4F9C] text-white text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider shadow-xs">
              {post.category}
            </span>
            <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Peer-Reviewed Clinical Protocol</span>
            </div>
            <div className="inline-flex items-center gap-1.5 text-xs text-slate-500 font-medium ml-auto">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{post.readTimeMinutes} min read</span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black text-slate-900 tracking-tight leading-[1.2] font-display">
            {post.title}
          </h1>

          <p className="text-sm sm:text-base lg:text-lg text-slate-600 leading-relaxed font-normal">
            {post.excerpt}
          </p>

          {/* Author Card & Social Share Bar */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            
            <div className="flex items-center gap-3">
              <img
                src={post.authorAvatar || "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&auto=format&fit=crop&q=80"}
                alt={post.authorName}
                className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md ring-2 ring-blue-100"
              />
              <div>
                <div className="flex items-center gap-1.5 text-sm font-black text-slate-900">
                  <span>{post.authorName}</span>
                  <span title="Verified Medical Faculty">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  </span>
                </div>
                <div className="text-xs text-slate-500 font-medium">
                  {post.authorDesignation}
                </div>
                <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                  <span>Published on {post.publishedAt}</span>
                  {post.updatedAt && <span>• Updated {post.updatedAt}</span>}
                </div>
              </div>
            </div>

            {/* Social Share Buttons */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400 hidden md:inline">Share:</span>

              {/* WhatsApp Share */}
              <a
                href={whatsappShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold px-3 py-2 rounded-xl shadow-xs transition-all cursor-pointer hover:scale-105 active:scale-95"
                title="Share with Doctor colleagues on WhatsApp"
              >
                <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                </svg>
                <span>WhatsApp</span>
              </a>

              {/* LinkedIn Share */}
              <a
                href={linkedinShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-[#0077B5] text-white hover:opacity-90 shadow-xs transition-all"
                title="Share on LinkedIn"
              >
                <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>

              {/* Copy Link Button */}
              <button
                type="button"
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold px-3 py-2 rounded-xl border border-slate-200 shadow-xs transition-all cursor-pointer"
                title="Copy Article Link"
              >
                {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                <span>{isCopied ? "Copied!" : "Copy Link"}</span>
              </button>
            </div>

          </div>

        </header>

        {/* 3. Hero Feature Image */}
        <div className="relative rounded-3xl overflow-hidden shadow-xl border border-slate-200/80 aspect-21/9 max-h-[500px] bg-slate-900">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />
          <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:bottom-6 text-white text-xs font-medium flex items-center justify-between">
            <span className="bg-slate-950/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20">
              Clinical Guidelines & Diagnostic Protocols
            </span>
            <span className="bg-slate-950/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 hidden sm:inline">
              Indian Medical Course Academic Review
            </span>
          </div>
        </div>

        {/* 4. Article Body Grid (Main Content + Sticky Sidebar) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Main Content Column */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Article Prose Content */}
            <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
              
              {/* Rich Clinical Article HTML */}
              <div 
                suppressHydrationWarning
                className="prose prose-slate max-w-none prose-headings:font-display prose-headings:font-black prose-headings:text-slate-900 prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-h2:border-b prose-h2:border-slate-100 prose-h2:pb-2 prose-h3:text-lg prose-h3:mt-6 prose-h3:text-blue-900 prose-p:text-slate-700 prose-p:leading-relaxed prose-p:text-sm sm:prose-p:text-base prose-li:text-slate-700 prose-li:text-sm sm:prose-li:text-base prose-strong:text-slate-900 prose-strong:font-black"
                dangerouslySetInnerHTML={{ __html: post.contentHtml || `<p>${post.excerpt}</p>` }}
              />

              {/* Tags Section */}
              {post.tags && post.tags.length > 0 && (
                <div className="pt-6 border-t border-slate-100">
                  <div className="flex items-center gap-2 flex-wrap">
                    <TagIcon className="w-4 h-4 text-blue-600 shrink-0" />
                    <span className="text-xs font-bold text-slate-400 uppercase">Tags:</span>
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 text-xs font-semibold px-3 py-1 rounded-xl transition-colors cursor-pointer"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Author Bio Box */}
              <div className="p-6 rounded-2xl bg-blue-50/70 border border-blue-100 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <img
                  src={post.authorAvatar || "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&auto=format&fit=crop&q=80"}
                  alt={post.authorName}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-md shrink-0"
                />
                <div className="space-y-1">
                  <div className="text-xs font-extrabold text-blue-900 uppercase tracking-wider">
                    Written & Verified By Faculty
                  </div>
                  <h4 className="text-base font-black text-slate-900">
                    {post.authorName}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {post.authorBio || `${post.authorName} is an esteemed medical educator with ${post.authorDesignation}, actively supervising hands-on hospital rotations at Indian Medical Course.`}
                  </p>
                </div>
              </div>

            </div>

            {/* Bottom Call to Action Banner */}
            <div className="bg-linear-to-br from-[#0B4F9C] via-[#083E7D] to-indigo-900 rounded-3xl p-8 text-white space-y-4 shadow-xl relative overflow-hidden">
              <div className="relative z-10 max-w-xl space-y-2">
                <span className="bg-white/20 text-white text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                  Postgraduate Clinical Education
                </span>
                <h3 className="text-2xl sm:text-3xl font-black font-display">
                  Elevate Your Clinical Practice in {post.category}
                </h3>
                <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
                  Join 1,800+ doctors mastering advanced bedside protocols, Cath Lab rotations, and CPD-accredited diagnostic skills with 0% EMI options.
                </p>
                <div className="pt-3 flex items-center gap-3 flex-wrap">
                  <Link
                    href={`/courses/${relatedCourse?.slug || 'fellowship-in-clinical-cardiology'}`}
                    className="inline-flex items-center gap-2 bg-white text-[#0B4F9C] hover:bg-blue-50 text-xs font-black py-3 px-6 rounded-xl shadow-md transition-all hover:scale-105 active:scale-95"
                  >
                    <span>View Fellowship Curriculum</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/book-counselling"
                    className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold py-3 px-5 rounded-xl border border-white/30 transition-all"
                  >
                    <span>Talk to Senior Counselor</span>
                  </Link>
                </div>
              </div>
              <Sparkles className="w-48 h-48 text-white/5 absolute -right-10 -bottom-10 pointer-events-none" />
            </div>

          </div>

          {/* Sticky Sidebar Column */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* 1. Recommended Fellowship Course Card */}
            {relatedCourse && (
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4 sticky top-6">
                
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full">
                    Recommended Program
                  </span>
                  <span className="text-xs font-black text-amber-600 flex items-center gap-1">
                    ★ {relatedCourse.ratingVal || 4.9}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h4 className="text-base font-black text-slate-900 leading-snug font-display hover:text-[#0B4F9C] transition-colors">
                    <Link href={`/courses/${relatedCourse.slug}`}>
                      {relatedCourse.title}
                    </Link>
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-2">
                    {relatedCourse.tagline}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs py-2 border-y border-slate-100">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold uppercase">Duration</span>
                    <strong className="text-slate-800">{relatedCourse.duration}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold uppercase">Clinical Hours</span>
                    <strong className="text-slate-800">{relatedCourse.clinicalHours}+ Hrs Bedside</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold uppercase">Eligibility</span>
                    <strong className="text-slate-800 truncate block">{relatedCourse.eligibility}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold uppercase">0% EMI From</span>
                    <strong className="text-emerald-700 font-bold">₹{relatedCourse.emiStartingINR?.toLocaleString('en-IN')}/mo</strong>
                  </div>
                </div>

                <div className="space-y-2">
                  <Link
                    href={`/courses/${relatedCourse.slug}`}
                    className="w-full inline-flex items-center justify-center gap-2 bg-[#0B4F9C] hover:bg-[#083E7D] text-white text-xs font-bold py-3 rounded-xl shadow-xs transition-all hover:scale-102"
                  >
                    <span>Download Program Brochure</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    href={`/courses/${relatedCourse.slug}`}
                    className="w-full inline-flex items-center justify-center gap-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold py-2.5 rounded-xl border border-slate-200 transition-colors"
                  >
                    <span>Check Batch Seat Availability</span>
                  </Link>
                </div>

                {/* Direct Hotline Box */}
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase">Admissions Desk</div>
                      <a href="tel:+918295843006" className="font-mono font-bold text-slate-900 hover:underline">
                        +91 82958 43006
                      </a>
                    </div>
                  </div>
                  <a
                    href="https://wa.me/918295843006?text=Hello%2C%20I%20am%20interested%20in%20Medical%20Fellowships"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-[#25D366] text-white rounded-xl hover:scale-105 transition-all shadow-xs"
                    title="Chat on WhatsApp"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                  </a>
                </div>

              </div>
            )}

            {/* 2. Table of Contents Widget */}
            {tocItems.length > 0 && (
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3">
                <h4 className="text-xs font-extrabold uppercase text-slate-900 tracking-wider flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-[#0B4F9C]" />
                  <span>Table of Contents</span>
                </h4>
                <nav className="space-y-1.5">
                  {tocItems.map((item, idx) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className="text-xs text-slate-600 hover:text-blue-700 hover:font-bold transition-all block py-1 border-l-2 border-transparent hover:border-blue-600 pl-2.5"
                    >
                      {item.text}
                    </a>
                  ))}
                </nav>
              </div>
            )}

          </div>

        </div>

        {/* 5. Related Articles Grid */}
        <section className="pt-10 border-t border-slate-200 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="text-xs font-black uppercase text-blue-700">Continue Learning</div>
              <h3 className="text-2xl font-black text-slate-900 font-display">
                Related Clinical Articles & Guidelines
              </h3>
            </div>
            <Link
              href="/blogs"
              className="inline-flex items-center gap-1 text-xs font-bold text-[#0B4F9C] hover:underline"
            >
              <span>View All Articles</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.map((rPost) => (
              <Link
                key={rPost.id}
                href={`/blogs/${rPost.slug}`}
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group cursor-pointer block"
              >
                <div className="relative h-44 bg-slate-100 overflow-hidden">
                  <img
                    src={rPost.coverImage}
                    alt={rPost.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-[#0B4F9C] text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-xs">
                    {rPost.category}
                  </span>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium">
                      <span className="text-slate-600 font-bold">{rPost.authorName}</span>
                      <span>•</span>
                      <span>{rPost.readTimeMinutes} min read</span>
                    </div>
                    <h4 className="text-sm font-black text-slate-900 group-hover:text-[#0B4F9C] transition-colors leading-snug line-clamp-2 font-display">
                      {rPost.title}
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {rPost.excerpt}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-400">{rPost.publishedAt}</span>
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-[#0B4F9C] group-hover:translate-x-1 transition-all">
                      <span>Read Guide</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

      </div>

    </div>
  );
}
