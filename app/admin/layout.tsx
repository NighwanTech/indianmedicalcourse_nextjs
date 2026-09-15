import React from "react";
import { AdminLayoutClient } from "@/components/admin/AdminLayoutClient";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("imc_auth_token")?.value;
  const payload = token ? verifyToken(token) : null;

  const userRole = payload?.role || "SUPER_ADMIN";
  const userName = payload?.name || "Admissions Desk";

  const allFallbackItems = [
    { id: 1, label: "Dashboard", url: "/admin", icon: "LayoutDashboard", permission: "ALL", displayOrder: 1 },
    { id: 2, label: "Homepage & Hero CMS", url: "/admin/homepage", icon: "Layout", badgeText: "Live", permission: "ADMIN", displayOrder: 2 },
    { id: 3, label: "Lead Management", url: "/admin/leads", icon: "Users", badgeText: "Live", permission: "ALL", displayOrder: 3 },
    { id: 4, label: "Media Library", url: "/admin/media", icon: "Image", permission: "ADMIN", displayOrder: 4 },
    { id: 5, label: "Courses Master", url: "/admin/courses", icon: "GraduationCap", permission: "ADMIN", displayOrder: 5 },
    { id: 6, label: "Categories", url: "/admin/categories", icon: "FolderTree", permission: "ADMIN", displayOrder: 6 },
    { id: 7, label: "Faculty / Mentors", url: "/admin/faculty", icon: "Award", permission: "ADMIN", displayOrder: 7 },
    { id: 8, label: "Landing Page Builder", url: "/admin/landing-pages", icon: "Layers", badgeText: "CRO", permission: "ADMIN", displayOrder: 8 },
    { id: 9, label: "Blogs & Articles", url: "/admin/blogs", icon: "FileText", permission: "ALL", displayOrder: 9 },
    { id: 10, label: "FAQs Manager", url: "/admin/faqs", icon: "HelpCircle", permission: "ALL", displayOrder: 10 },
    { id: 11, label: "Testimonials", url: "/admin/testimonials", icon: "MessageSquare", permission: "ALL", displayOrder: 11 },
    { id: 12, label: "Hospital & University Partners", url: "/admin/partners", icon: "Building2", badgeText: "New", permission: "ADMIN", displayOrder: 12 },
    { id: 13, label: "Gallery & Free Videos", url: "/admin/gallery", icon: "Video", badgeText: "New", permission: "ALL", displayOrder: 13 },
    { id: 14, label: "Menu Builder", url: "/admin/menus", icon: "Menu", permission: "ADMIN", displayOrder: 14 },
    { id: 15, label: "Website Settings", url: "/admin/settings", icon: "Settings", permission: "ADMIN", displayOrder: 15 },
    { id: 16, label: "Admin & Roles", url: "/admin/users", icon: "UserCheck", permission: "SUPER_ADMIN", displayOrder: 16 },
  ];

  // Restrict COUNSELLOR to only their Dashboard and Lead Management
  const sidebarItems = userRole === "COUNSELLOR"
    ? allFallbackItems.filter((item) => item.url === "/admin" || item.url === "/admin/leads")
    : allFallbackItems;

  return (
    <AdminLayoutClient
      sidebarItems={sidebarItems}
      userRole={userRole}
      userName={userName}
    >
      {children}
    </AdminLayoutClient>
  );
}
