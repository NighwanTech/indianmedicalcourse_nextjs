import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";

const jakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#0B4F9C",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "Indian Medical Course | India's Premier Medical Education & Fellowships Platform",
  description:
    "Explore 150+ Clinical Fellowships, Post-Graduate Diplomas, and Advanced Certification Courses for Doctors with bedside hospital rotations and recognized certifications.",
  keywords: [
    "Medical Fellowships in India",
    "PG Diploma for Doctors",
    "Clinical Cardiology Fellowship",
    "Critical Care Fellowship",
    "Emergency Medicine Diploma",
    "Fetal Medicine Ultrasound Course",
    "Indian Medical Course",
  ],
  authors: [{ name: "Indian Medical Course" }],
  creator: "Indian Medical Course",
  metadataBase: new URL("https://indianmedicalcourse.com"),
  openGraph: {
    title: "Indian Medical Course - High-Impact Medical Fellowships & PG Diplomas",
    description:
      "Join 12,000+ doctors specializing through hands-on clinical training at top hospital partners across India.",
    url: "https://indianmedicalcourse.com",
    siteName: "Indian Medical Course",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Indian Medical Course | Medical Education Platform",
    description: "Hands-on clinical fellowships and PG diplomas for doctors.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

import { GoogleAdsTracker } from "@/components/shared/GoogleAdsTracker";
import { GeoMedicalSchema } from "@/components/shared/GeoMedicalSchema";
import { AiDoctorCounselorAgent } from "@/components/shared/AiDoctorCounselorAgent";
import { GoogleAnalyticsAndTagManager } from "@/components/analytics/GoogleAnalyticsAndTagManager";
import { OrganizationSchema, WebSiteSchema } from "@/components/seo/JsonLd";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${jakartaSans.variable} ${inter.variable} max-w-full`}>
      <head>
        <GeoMedicalSchema />
        <OrganizationSchema />
        <WebSiteSchema />
      </head>
      <body suppressHydrationWarning className="min-h-screen bg-white font-sans text-slate-900 antialiased selection:bg-blue-600 selection:text-white w-full max-w-full relative">
        <GoogleAnalyticsAndTagManager />
        <GoogleAdsTracker />
        {children}
        <AiDoctorCounselorAgent />
      </body>
    </html>
  );
}
