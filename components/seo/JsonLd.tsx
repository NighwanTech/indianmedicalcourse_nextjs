import React from "react";
import { siteSettings } from "@/lib/data";

const DOMAIN = "https://indianmedicalcourse.com";

/**
 * Master Medical Education Organization Schema (JSON-LD)
 */
export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": ["EducationalOrganization", "MedicalOrganization"],
    name: "Indian Medical Course",
    alternateName: ["IMC", "Indian Medical Courses", "IMC Medical Academy"],
    url: DOMAIN,
    logo: `${DOMAIN}/images/imc-logo.png`,
    image: `${DOMAIN}/images/imc-og-banner.jpg`,
    description:
      "Premier Medical Post-Graduate Education Platform providing CPD-accredited Clinical Fellowships, PG Diplomas, and Hospital Hands-on Rotations for Doctors across India.",
    telephone: siteSettings.hotlinePhone || "+91 8295843006",
    email: siteSettings.supportEmail || "indianmedicalcourses@gmail.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: siteSettings.registeredAddress || "Medical Training Wing, South Extension",
      addressLocality: "New Delhi",
      addressRegion: "Delhi",
      postalCode: "110049",
      addressCountry: "IN",
    },
    sameAs: [
      (siteSettings as any).socialLinks?.facebook || siteSettings.facebookUrl || "https://facebook.com/indianmedicalcourses",
      (siteSettings as any).socialLinks?.instagram || siteSettings.instagramUrl || "https://instagram.com/indianmedicalcourses",
      (siteSettings as any).socialLinks?.youtube || siteSettings.youtubeUrl || "https://youtube.com/@indianmedicalcourses",
      (siteSettings as any).socialLinks?.linkedin || siteSettings.linkedinUrl || "https://linkedin.com/company/indianmedicalcourses",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: siteSettings.hotlinePhone || "+91 8295843006",
      contactType: "Admissions & Clinical Student Support",
      areaServed: ["IN", "AE", "GB", "US", "SG"],
      availableLanguage: ["English", "Hindi"],
    },
    hasCredential: {
      "@type": "EducationalOccupationalCredential",
      name: "CPD UK Accredited Medical Certification",
      credentialCategory: "Postgraduate Clinical Fellowship",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * WebSite Schema with Sitelinks Searchbox
 */
export function WebSiteSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Indian Medical Course",
    url: DOMAIN,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${DOMAIN}/courses?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * Course Schema Component for Course Detail Pages
 */
export function CourseSchema({
  title,
  description,
  courseType = "Fellowship",
  duration = "12 Months",
  feeINR = 125000,
  slug,
  heroImage,
}: {
  title: string;
  description: string;
  courseType?: string;
  duration?: string;
  feeINR?: number;
  slug: string;
  heroImage?: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: title,
    description: description,
    provider: {
      "@type": "EducationalOrganization",
      name: "Indian Medical Course",
      sameAs: DOMAIN,
    },
    url: `${DOMAIN}/courses/${slug}`,
    image: heroImage || `${DOMAIN}/images/course-og.jpg`,
    educationalCredentialAwarded: `${courseType} in ${title} (CPD Accredited)`,
    timeToComplete: duration,
    offers: {
      "@type": "Offer",
      category: "Tuition",
      price: feeINR,
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
      validFrom: "2026-01-01",
      url: `${DOMAIN}/courses/${slug}`,
    },
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: ["Blended Learning", "Hands-on Hospital Observership", "Online Case Discussions"],
      courseWorkload: "100+ Bedside Clinical Hours",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * FAQ Page Schema
 */
export function FAQSchema({
  faqs,
}: {
  faqs: { question: string; answer: string }[];
}) {
  if (!faqs || faqs.length === 0) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * Medical Blog Article Schema
 */
export function ArticleSchema({
  title,
  description,
  publishedAt,
  author = "Dr. IMC Academic Board",
  slug,
  coverImage,
}: {
  title: string;
  description: string;
  publishedAt: string;
  author?: string;
  slug: string;
  coverImage?: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": ["Article", "MedicalWebPage"],
    headline: title,
    description: description,
    image: coverImage || `${DOMAIN}/images/blog-default.jpg`,
    datePublished: publishedAt,
    dateModified: new Date().toISOString(),
    author: {
      "@type": "Person",
      name: author,
      jobTitle: "Clinical Mentor & Medical Specialist",
    },
    publisher: {
      "@type": "EducationalOrganization",
      name: "Indian Medical Course",
      logo: {
        "@type": "ImageObject",
        url: `${DOMAIN}/images/imc-logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${DOMAIN}/blogs/${slug}`,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * Breadcrumb List Schema
 */
export function BreadcrumbSchema({
  items,
}: {
  items: { name: string; url: string }[];
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${DOMAIN}${item.url}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
