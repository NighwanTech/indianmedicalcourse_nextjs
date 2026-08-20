import React from "react";
import { HeroSection } from "@/components/sections/HeroSection";
import { HospitalPartnersMarquee } from "@/components/sections/HospitalPartnersMarquee";
import { FellowshipSpotlightBanner } from "@/components/sections/FellowshipSpotlightBanner";
import { WhyChooseUs } from "@/components/sections/WhyChooseUs";
import { StatsTicker } from "@/components/sections/StatsTicker";
import { CourseSearchFilter } from "@/components/sections/CourseSearchFilter";
import { AdmissionProcessFlow } from "@/components/sections/AdmissionProcessFlow";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { FreeCoursesVideoShowcase } from "@/components/sections/FreeCoursesVideoShowcase";
import { FacultyShowcase } from "@/components/sections/FacultyShowcase";
import { FellowshipGuideHub } from "@/components/sections/FellowshipGuideHub";
import { FinalCtaBanner } from "@/components/sections/FinalCtaBanner";

export default function HomePage() {
  return (
    <div className="flex flex-col w-full bg-white">
      
      {/* ========================================================================= */}
      {/* SCROLL 1: MASTER LANDING HERO WITH EMBEDDED CONVERSION FORM               */}
      {/* ========================================================================= */}
      <HeroSection />

      {/* ========================================================================= */}
      {/* CONTINUOUS TRUST MARQUEE: 50+ NABH HOSPITAL PARTNER NETWORKS              */}
      {/* ========================================================================= */}
      <HospitalPartnersMarquee />

      {/* ========================================================================= */}
      {/* SCROLL 2: HIGH-YIELD CLINICAL SPECIALTY SHOWCASE & VALUE PILLARS          */}
      {/* ========================================================================= */}
      <FellowshipSpotlightBanner />

      {/* 4 Clinical Pillars of Excellence & Bedside Advantages */}
      <WhyChooseUs />

      {/* Live Doctor Enrollment & Outcome Statistics Bar */}
      <StatsTicker />

      {/* Course Catalog Filter (Top 6 High-Yield Programs) */}
      <CourseSearchFilter limit={6} isHomePage={true} />

      {/* ========================================================================= */}
      {/* SCROLL 3: 4-STAGE DOCTOR ROADMAP, FACULTY MENTORS & ALUMNI SUCCESS        */}
      {/* ========================================================================= */}
      <AdmissionProcessFlow />

      {/* Clinical Directors & Specialist Mentors */}
      <FacultyShowcase />

      {/* ========================================================================= */}
      {/* EXPLORE FREE COURSES: COMPLIMENTARY CLINICAL VIDEOS WITH 30s LEAD GATE    */}
      {/* ========================================================================= */}
      <FreeCoursesVideoShowcase />

      {/* Verified Doctor Testimonials & Real Hospital Badges */}
      <TestimonialsSection />

      {/* Comprehensive Doctor Fellowship & Eligibility Guide + FAQ Knowledge Base */}
      <FellowshipGuideHub />

      {/* High-CRO VIP Closing Admissions Banner */}
      <FinalCtaBanner />

    </div>
  );
}
