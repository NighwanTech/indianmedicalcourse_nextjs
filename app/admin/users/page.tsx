"use client";

import React, { useState, useEffect } from "react";
import { 
  Plus, 
  ShieldCheck, 
  CheckCircle2, 
  X, 
  Save,
  AlertCircle
} from "lucide-react";
import { Role } from "@prisma/client";
import { createAdminUserAction, updateAdminUserAction } from "@/features/auth/authActions";

// Fetch function
async function fetchUsers() {
  const res = await fetch('/api/admin/users'); // We need to create this API route
  if (!res.ok) throw new Error('Failed to fetch users');
  return res.json();
}

const fallbackTeamMembers = [
  {
    id: 1,
    name: "IMC Admissions Desk",
    email: "admissions@indianmedicalcourses.com",
    phone: "+91 8295843006",
    role: "SUPER_ADMIN",
    isActive: true,
    lastLoginAt: "2026-08-20T10:00:00.000Z",
  },
  {
    id: 2,
    name: "Senior Admissions Counsellor",
    email: "counsellor@indianmedicalcourses.com",
    phone: "+91 9876543210",
    role: "COUNSELLOR",
    isActive: true,
    lastLoginAt: null,
  },
  {
    id: 3,
    name: "Curriculum & CMS Editor",
    email: "editor@indianmedicalcourses.com",
    phone: "+91 9876543211",
    role: "EDITOR",
    isActive: true,
    lastLoginAt: null,
  },
];

export default function AdminUsersPage() {
  const [mounted, setMounted] = useState(false);
  const [usersList, setUsersList] = useState<any[]>(fallbackTeamMembers);
  const [isLoading, setIsLoading] = useState(true);
  const [activeModal, setActiveModal] = useState<"create" | "edit" | null>(null);
  const [isSuccessNotification, setIsSuccessNotification] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    id: 0,
    name: "",
    email: "",
    phone: "",
    role: "COUNSELLOR" as Role,
    password: "",
  });

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const data = await fetchUsers();
      
      if (Array.isArray(data) && data.length > 0) {
        setUsersList(data);
      } else {
        const saved = typeof window !== "undefined" ? localStorage.getItem("imc_admin_users") : null;
        if (saved) {
          setUsersList(JSON.parse(saved));
        } else {
          setUsersList(fallbackTeamMembers);
        }
      }
    } catch (err) {
      console.warn("Using fallback team members:", err);
      const saved = typeof window !== "undefined" ? localStorage.getItem("imc_admin_users") : null;
      if (saved) {
        setUsersList(JSON.parse(saved));
      } else {
        setUsersList(fallbackTeamMembers);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    loadUsers();
  }, []);

  const openCreateModal = () => {
    setFormData({
      id: 0,
      name: "",
      email: "",
      phone: "+91 ",
      role: "COUNSELLOR",
      password: "",
    });
    setError(null);
    setActiveModal("create");
  };

  const openEditModal = (user: any) => {
    setFormData({ ...user, password: "" });
    setError(null);
    setActiveModal("edit");
  };

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.email.trim()) return;
    setIsSaving(true);
    setError(null);

    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("phone", formData.phone);
    data.append("role", formData.role);
    
    try {
      if (activeModal === "create") {
        if (!formData.password) {
          setError("Password is required for new users");
          setIsSaving(false);
          return;
        }
        data.append("password", formData.password);
        await createAdminUserAction(data);

        const newMember = {
          id: Date.now(),
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          role: formData.role,
          isActive: true,
          lastLoginAt: null,
        };

        const updated = [...usersList, newMember];
        setUsersList(updated);
        if (typeof window !== "undefined") {
          localStorage.setItem("imc_admin_users", JSON.stringify(updated));
        }
      } else if (activeModal === "edit") {
        data.append("id", formData.id.toString());
        await updateAdminUserAction(data);

        const updated = usersList.map((u) =>
          u.id === formData.id ? { ...u, ...formData } : u
        );
        setUsersList(updated);
        if (typeof window !== "undefined") {
          localStorage.setItem("imc_admin_users", JSON.stringify(updated));
        }
      }

      // Success
      setActiveModal(null);
      setIsSuccessNotification(true);
      setTimeout(() => setIsSuccessNotification(false), 3000);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 font-display">
            Admin Accounts & Role Permissions
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Role-Based Access Control (Super Admin, Admin, Counsellor, Editor) with menu permission bindings.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isSuccessNotification && (
            <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-2 rounded-xl">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Saved Successfully!</span>
            </div>
          )}

          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 bg-[#0B4F9C] hover:bg-[#083E7D] text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Team Member</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">User Name</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Assigned Role</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Last Activity</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {usersList.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                        {u.name.substring(0, 2).toUpperCase()}
                      </div>
                      <span>{u.name}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    <div>{u.email}</div>
                    <div className="text-[10px] text-slate-400">{u.phone || 'No phone'}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                      u.role === "SUPER_ADMIN" ? "bg-purple-100 text-purple-800 border border-purple-200" :
                      u.role === "ADMIN" ? "bg-blue-100 text-blue-800 border border-blue-200" :
                      u.role === "COUNSELLOR" ? "bg-emerald-100 text-emerald-800 border border-emerald-200" :
                      u.role === "EDITOR" ? "bg-amber-100 text-amber-800 border border-amber-200" :
                      "bg-slate-100 text-slate-800 border border-slate-200"
                    }`}>
                      {u.role.replace("_", " ")}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    {u.isActive ? (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                        Active
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500" suppressHydrationWarning>
                    {mounted ? (u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString() : "Never logged in") : (u.lastLoginAt ? "Recently" : "Never logged in")}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => openEditModal(u)}
                      className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
                    >
                      Edit Role
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {isLoading && (
            <div className="p-8 text-center text-slate-500 text-sm">
              Loading users...
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* REAL INTERACTIVE MODAL: ADD / EDIT TEAM USER                              */}
      {/* ========================================================================= */}
      {activeModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in fade-in zoom-in-95">
            
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="text-base font-black text-slate-900 font-display">
                  {activeModal === "create" ? "Add Team Member" : "Edit User Account"}
                </h3>
                <p className="text-xs text-slate-500">
                  Assign RBAC roles for lead assignments and CMS permissions.
                </p>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-600 text-xs font-bold px-3 py-2.5 rounded-xl flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dr. Kavita Rao"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email Address (Login Username)
                </label>
                <input
                  type="email"
                  placeholder="e.g. kavita.rao@indianmedicalcourses.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  disabled={activeModal === "edit"} // Prevent changing email in edit mode for simplicity
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Mobile Phone
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Assigned Role
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as Role })}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  >
                    <option value="COUNSELLOR">Counsellor</option>
                    <option value="EDITOR">Editor</option>
                    <option value="ADMIN">Admin</option>
                    <option value="SUPER_ADMIN">Super Admin</option>
                  </select>
                </div>
              </div>

              {/* Dynamic Role Capability Information Card */}
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 text-[11px] space-y-1">
                <div className="font-bold text-slate-800 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                  <span>
                    {formData.role === "COUNSELLOR" && "Counsellor Scope"}
                    {formData.role === "EDITOR" && "Editor Scope"}
                    {formData.role === "ADMIN" && "Admin Scope"}
                    {formData.role === "SUPER_ADMIN" && "Super Admin Scope"}
                  </span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  {formData.role === "COUNSELLOR" && "Access to Lead Management CRM, student doctor counselling, follow-up calls, and course references. Restricted from CMS & site settings."}
                  {formData.role === "EDITOR" && "Access to Blogs & Articles, Testimonials, FAQs, and Media Library. Restricted from Leads CRM and system settings."}
                  {formData.role === "ADMIN" && "Full management of CMS, Courses, Faculty, Landing Pages, Leads, and Media. Restricted from User Roles & System Settings."}
                  {formData.role === "SUPER_ADMIN" && "Full unrestricted access to all 15 modules, Menu Builder, System Settings, and User Management."}
                </p>
              </div>

              {activeModal === "create" && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Initial Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="inline-flex items-center text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200/80 py-2.5 px-4 rounded-xl shadow-2xs hover:shadow-xs transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!formData.name.trim() || !formData.email.trim() || isSaving}
                onClick={handleSave}
                className="inline-flex items-center gap-1.5 bg-[#0B4F9C] hover:bg-[#083E7D] text-white text-xs font-bold py-2.5 px-6 rounded-xl shadow-xs transition-all disabled:opacity-50 cursor-pointer"
              >
                {isSaving ? (
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <Save className="w-3.5 h-3.5" />
                )}
                <span>Save User Account</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
