import React from "react";
import { AnnouncementBar } from "@/components/shared/AnnouncementBar";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { FloatingConversionLayer } from "@/components/shared/FloatingConversionLayer";
import { MedicalScrollAnimation } from "@/components/shared/MedicalScrollAnimation";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <MedicalScrollAnimation />
      <AnnouncementBar />
      <Header />
      <main className="flex-1 w-full">{children}</main>
      <Footer />
      <FloatingConversionLayer />
    </div>
  );
}
