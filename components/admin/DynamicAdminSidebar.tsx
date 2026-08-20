"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DynamicIcon } from "@/components/shared/DynamicIcon";
import { 
  GraduationCap, 
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
  isOpen,
  onClose,
}: DynamicAdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#09101D] text-slate-300 p-4 flex flex-col transition-transform duration-300 lg:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } border-r border-slate-800/80 shadow-2xl`}
    >
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
      <nav className="flex-1 space-y-1 overflow-y-auto no-scrollbar pr-1 pb-4">
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
              title={item.label}
              className={`flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap min-w-0 ${
                isActive
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/30 font-extrabold"
                  : "text-slate-400 hover:text-white hover:bg-slate-900/90"
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <DynamicIcon
                  name={item.icon}
                  className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-slate-400"}`}
                />
                <span className="truncate">{item.label}</span>
              </div>

              {item.badgeText && (
                <span
                  className={`text-[9px] font-black px-1.5 py-0.5 rounded shrink-0 whitespace-nowrap ${
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
    </aside>
  );
}
