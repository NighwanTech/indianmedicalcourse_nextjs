"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/features/auth/authActions";
import { DynamicIcon } from "@/components/shared/DynamicIcon";
import { 
  GraduationCap, 
  LogOut, 
  X, 
  ChevronRight,
  ShieldCheck
} from "lucide-react";

export interface MenuItemData {
  id: number;
  label: string;
  url: string;
  icon?: string | null;
  permission?: string | null;
  badgeText?: string | null;
  badgeColor?: string | null;
  displayOrder: number;
  openInNewTab?: boolean;
}

interface DynamicAdminSidebarProps {
  items: MenuItemData[];
  userRole?: string;
  userName?: string;
  isOpen: boolean;
  onClose: () => void;
}

export function DynamicAdminSidebar({
  items,
  userRole = "SUPER_ADMIN",
  userName = "Admissions Desk",
  isOpen,
  onClose,
}: DynamicAdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#09101D] text-slate-300 p-4 flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } border-r border-slate-800/80 shadow-2xl`}
    >
      <div>
        {/* Brand Header */}
        <div className="flex items-center justify-between px-2 py-3 mb-4 border-b border-slate-800/80">
          <Link href="/admin" className="flex items-center gap-2 bg-white px-2.5 py-1.5 rounded-xl shadow-xs">
            <img
              src="/images/imc-logo.png"
              alt="IMC Portal"
              className="h-7 w-auto object-contain"
            />
          </Link>

          <button
            onClick={onClose}
            className="lg:hidden text-slate-400 hover:text-white p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dynamic Navigation Items from Database */}
        <nav className="space-y-1 max-h-[72vh] overflow-y-auto no-scrollbar pr-1">
          {items.map((item) => {
            const isActive =
              pathname === item.url ||
              (item.url !== "/admin" && pathname.startsWith(item.url));

            return (
              <Link
                key={item.id}
                href={item.url}
                target={item.openInNewTab ? "_blank" : undefined}
                onClick={onClose}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/30 font-extrabold"
                    : "text-slate-400 hover:text-white hover:bg-slate-900/90"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <DynamicIcon
                    name={item.icon}
                    className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badgeText && (
                  <span
                    className={`text-[9px] font-black px-1.5 py-0.5 rounded ${
                      isActive
                        ? "bg-white/20 text-white"
                        : item.badgeColor === "red"
                        ? "bg-red-500/20 text-red-300"
                        : "bg-emerald-500/20 text-emerald-300"
                    }`}
                  >
                    {item.badgeText}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Profile Footer & Sign Out */}
      <div className="pt-4 border-t border-slate-800/80">
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/90 mb-2 border border-slate-800/60">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
              {userName.substring(0, 2).toUpperCase()}
            </div>
            <div className="text-left">
              <div className="text-xs font-bold text-white leading-none">
                {userName}
              </div>
              <div className="text-[9px] text-emerald-400 font-semibold mt-0.5">
                {userRole.replace("_", " ")}
              </div>
            </div>
          </div>
          <Link
            href="/"
            target="_blank"
            className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded-md font-semibold"
          >
            Live Site ↗
          </Link>
        </div>

        <button
          onClick={async () => {
            await logoutAction();
            window.location.href = "/admin/login";
          }}
          className="flex items-center gap-2 text-xs font-bold text-red-400 hover:text-red-300 px-3 py-1.5 rounded-lg hover:bg-red-500/10 transition-colors w-full cursor-pointer text-left"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
