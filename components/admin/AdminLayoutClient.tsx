"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { DynamicAdminSidebar, MenuItemData } from "./DynamicAdminSidebar";
import { Menu, ShieldCheck } from "lucide-react";

interface AdminLayoutClientProps {
  sidebarItems: MenuItemData[];
  userRole?: string;
  userName?: string;
  children: React.ReactNode;
}

export function AdminLayoutClient({
  sidebarItems,
  userRole = "SUPER_ADMIN",
  userName = "Admissions Desk",
  children,
}: AdminLayoutClientProps) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // If on auth pages (login, forgot-password, reset-password), render clean full screen without sidebar
  const normalizedPath = pathname?.replace(/\/$/, "") || "";
  const isAuthPage =
    normalizedPath === "/admin/login" ||
    normalizedPath.startsWith("/admin/login") ||
    normalizedPath.startsWith("/admin/forgot-password") ||
    normalizedPath.startsWith("/admin/reset-password");

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col lg:flex-row">
      {/* Dynamic Database Driven Sidebar */}
      <DynamicAdminSidebar
        items={sidebarItems}
        userRole={userRole}
        userName={userName}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        {/* Top Sticky Header */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-8 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-lg"
              aria-label="Open Sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="text-sm font-extrabold text-slate-800 font-display">
              Indian Medical Course CMS & Lead Engine
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 text-[11px] bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>MySQL Live: Connected</span>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content Body */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
