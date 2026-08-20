"use client";

import React, { useState } from "react";
import Link from "next/link";
import { blogPosts, courses, siteSettings } from "@/lib/data";
import { UniversalAdmissionForm } from "@/components/forms/UniversalAdmissionForm";
import { 
  User, 
  Mail, 
  Phone, 
  Send, 
  CheckCircle2, 
  Calendar, 
  Clock, 
  ArrowRight, 
  MessageSquare,
  Sparkles,
  BookOpen
} from "lucide-react";
import confetti from "canvas-confetti";

export function ContactAndBlogSection() {
  return (
    <section className="py-20 bg-slate-50 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Universal Admission & Contact Form (5 cols) */}
          <div className="lg:col-span-5">
            <UniversalAdmissionForm
              title="Contact & Admissions Desk"
              subtitle="Have questions about course eligibility or clinical attachments? Submit your details for an immediate callback."
              source="WEBSITE_FORM"
            />
          </div>

          {/* Right Column: Latest Clinical Blogs 2x2 Grid (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <span className="inline-block text-blue-600 font-extrabold text-xs tracking-wider uppercase mb-0.5">
                  Insights & Research
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-display">
                  LATEST MEDICAL BLOGS
                </h3>
              </div>

              <Link
                href="/blogs"
                className="text-xs font-bold text-blue-700 hover:text-blue-800 inline-flex items-center gap-1"
              >
                <span>View All Articles</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* 2x2 Blog Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {blogPosts.slice(0, 4).map((post) => (
                <Link
                  key={post.id}
                  href={`/blogs/${post.slug}`}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between group cursor-pointer block"
                >
                  <div className="relative h-36 w-full overflow-hidden bg-slate-100">
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2.5 left-2.5">
                      <span className="bg-slate-900/80 backdrop-blur-sm text-white text-[9px] font-bold px-2 py-0.5 rounded-md">
                        {post.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2">
                    <div>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 mb-1">
                        <Calendar className="w-3 h-3" />
                        <span>{post.publishedAt}</span>
                        <span>•</span>
                        <Clock className="w-3 h-3" />
                        <span>{post.readTimeMinutes} min read</span>
                      </div>

                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-700 transition-colors leading-snug line-clamp-2">
                        {post.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                        {post.excerpt}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 text-[11px] font-bold text-blue-600 inline-flex items-center gap-1 group-hover:translate-x-1 transition-all">
                      <span>Read Guide</span>
                      <ArrowRight className="w-3 h-3" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
