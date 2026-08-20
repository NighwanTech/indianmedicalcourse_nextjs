import React from "react";
import { AdminLayoutClient } from "@/components/admin/AdminLayoutClient";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userRole = "SUPER_ADMIN";
  const userName = "Admissions Desk";

  const allFallbackItems = [
    { id: 1, label: "Dashboard", url: "/admin", icon: "LayoutDashboard", permission: "ALL", displayOrder: 1 },
    { id: 2, label: "Homepage & Hero CMS", url: "/admin/homepage", icon: "Layout", badgeText: "Live", permission: "ADMIN", displayOrder: 2 },
    { id: 3, label: "Lead Management", url: "/admin/leads", icon: "Users", badgeText: "Live", permission: "COUNSELLOR", displayOrder: 3 },
    { id: 4, label: "Media Library", url: "/admin/media", icon: "Image", permission: "EDITOR", displayOrder: 4 },
    { id: 5, label: "Courses Master", url: "/admin/courses", icon: "GraduationCap", permission: "COUNSELLOR", displayOrder: 5 },
    { id: 6, label: "Categories", url: "/admin/categories", icon: "FolderTree", permission: "COUNSELLOR", displayOrder: 6 },
    { id: 7, label: "Faculty / Mentors", url: "/admin/faculty", icon: "Award", permission: "COUNSELLOR", displayOrder: 7 },
    { id: 8, label: "Landing Page Builder", url: "/admin/landing-pages", icon: "Layers", badgeText: "CRO", permission: "ADMIN", displayOrder: 8 },
    { id: 9, label: "Blogs & Articles", url: "/admin/blogs", icon: "FileText", permission: "ALL", displayOrder: 9 },
    { id: 10, label: "FAQs Manager", url: "/admin/faqs", icon: "HelpCircle", permission: "ALL", displayOrder: 10 },
    { id: 11, label: "Testimonials", url: "/admin/testimonials", icon: "MessageSquare", permission: "ALL", displayOrder: 11 },
    { id: 12, label: "Hospital & University Partners", url: "/admin/partners", icon: "Building2", badgeText: "New", permission: "ADMIN", displayOrder: 12 },
    { id: 13, label: "Gallery & Free Videos", url: "/admin/gallery", icon: "Video", badgeText: "New", permission: "ALL", displayOrder: 13 },
    { id: 14, label: "Menu Builder", url: "/admin/menus", icon: "Menu", permission: "SUPER_ADMIN", displayOrder: 14 },
    { id: 15, label: "Website Settings", url: "/admin/settings", icon: "Settings", permission: "SUPER_ADMIN", displayOrder: 15 },
    { id: 16, label: "Admin & Roles", url: "/admin/users", icon: "UserCheck", permission: "SUPER_ADMIN", displayOrder: 16 },
  ];

  // Role-filtered fallback items
  const fallbackItems = allFallbackItems.filter((item) => {
    if (userRole === "SUPER_ADMIN") return true;
    if (item.permission === "SUPER_ADMIN") return false;
    if (item.permission === "ADMIN" && userRole !== "ADMIN") return false;
    
    if (userRole === "COUNSELLOR") {
      return ["ALL", "COUNSELLOR"].includes(item.permission);
    }
    if (userRole === "EDITOR") {
      return ["ALL", "EDITOR"].includes(item.permission);
    }
    return true;
  });

  let sidebarItems = fallbackItems;

  // Guarantee that "Homepage & Hero CMS" is present right after Dashboard ONLY for Admin and Super Admin
  if (
    (userRole === "SUPER_ADMIN" || userRole === "ADMIN") &&
    !sidebarItems.some((i: any) => i.url === "/admin/homepage")
  ) {
    const heroCmsItem = {
      id: 991,
      label: "Homepage & Hero CMS",
      url: "/admin/homepage",
      icon: "Layout",
      badgeText: "Live",
      permission: "ADMIN",
      displayOrder: 2,
    };
    const dashIdx = sidebarItems.findIndex((i: any) => i.url === "/admin");
    if (dashIdx !== -1) {
      sidebarItems.splice(dashIdx + 1, 0, heroCmsItem);
    } else {
      sidebarItems.unshift(heroCmsItem);
    }
  }

  // Guarantee that "Hospital & Partners" is present for Admin, Super Admin, and Editor
  if (
    (userRole === "SUPER_ADMIN" || userRole === "ADMIN" || userRole === "EDITOR") &&
    !sidebarItems.some((i: any) => i.url === "/admin/partners")
  ) {
    const partnersItem = {
      id: 992,
      label: "Hospital & Partners",
      url: "/admin/partners",
      icon: "Building2",
      badgeText: "New",
      badgeColor: "emerald",
      permission: "ADMIN",
      displayOrder: 12,
    };
    const testIdx = sidebarItems.findIndex((i: any) => i.url === "/admin/testimonials");
    if (testIdx !== -1) {
      sidebarItems.splice(testIdx + 1, 0, partnersItem);
    } else {
      sidebarItems.push(partnersItem);
    }
  }

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
