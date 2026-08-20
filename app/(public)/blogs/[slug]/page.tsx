import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { blogPosts, courses } from "@/lib/data";
import { BlogPost } from "@/types";
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
  Tag as TagIcon
} from "lucide-react";
import { BlogDetailClientView } from "./BlogDetailClientView";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export const dynamicParams = false;

// Generate Static Params for all known blog posts
export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

// Generate Dynamic SEO Metadata
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    return {
      title: "Article Not Found | Indian Medical Course",
      description: "The requested medical article could not be found.",
    };
  }

  const title = post.metaTitle || `${post.title} | Indian Medical Course`;
  const description = post.metaDescription || post.excerpt;
  const url = `https://indianmedicalcourse.com/blogs/${post.slug}`;
  const ogImage = post.coverImage || "https://indianmedicalcourse.com/images/imc-og-banner.jpg";

  return {
    title,
    description,
    keywords: post.tags?.join(", ") || "medical education, clinical fellowship, doctor guidelines, PG diploma",
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "Indian Medical Course",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt || post.publishedAt,
      authors: [post.authorName],
      section: post.category,
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function SingleBlogDetailPage({ params }: Props) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  // Find related fellowship course if mapped
  const relatedCourse = courses.find(
    (c) => c.slug === post.relatedCourseSlug || c.title.toLowerCase().includes(post.category.toLowerCase())
  ) || courses[0];

  // Find other related articles
  const relatedPosts = blogPosts.filter((p) => p.slug !== post.slug).slice(0, 3);

  // Structured Data Schema (JSON-LD) for Google Rich Snippets
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    "headline": post.title,
    "description": post.excerpt,
    "image": post.coverImage,
    "datePublished": post.publishedAt,
    "dateModified": post.updatedAt || post.publishedAt,
    "author": {
      "@type": "Person",
      "name": post.authorName,
      "jobTitle": post.authorDesignation,
    },
    "publisher": {
      "@type": "Organization",
      "name": "Indian Medical Course",
      "logo": {
        "@type": "ImageObject",
        "url": "https://indianmedicalcourse.com/logo.png",
      },
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://indianmedicalcourse.com/blogs/${post.slug}`,
    },
    "medicalAudience": {
      "@type": "MedicalAudience",
      "audienceType": "Physicians, Surgeons, Specialists and Medical Students",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <BlogDetailClientView
        initialPost={post}
        relatedCourse={relatedCourse}
        relatedPosts={relatedPosts}
      />
    </>
  );
}
