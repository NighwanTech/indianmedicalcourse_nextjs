"use client";

import React, { useState, useEffect } from "react";
import { 
  Plus, 
  ShieldCheck, 
  CheckCircle2, 
  X, 
  Save,
  AlertCircle,
  KeyRound,
  Eye,
  EyeOff,
  Edit2,
  Lock,
  RefreshCw,
  UserCheck
} from "lucide-react";
import { Role } from "@prisma/client";
import { 
  createAdminUserAction, 
  updateAdminUserAction, 
  changeUserPasswordAction 
} from "@/features/auth/authActions";

// Fetch function
async function fetchUsers() {
  const res = await fetch('/api/admin/users', { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch users');
  return res.json();
}

export default function AdminUsersPage() {
  const [mounted, setMounted] = useState(false);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeModal, setActiveModal] = useState<"create" | "edit" | null>(null);
  const [isSuccessNotification, setIsSuccessNotification] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState("Saved Successfully!");
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Dedicated Change Password Modal State
  const [passwordModalUser, setPasswordModalUser] = useState<any | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Edit / Create Form Data
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
          try {
            setUsersList(JSON.parse(saved));
          } catch {
            setUsersList([]);
          }
        } else {
          setUsersList([]);
        }
      }
    } catch (err) {
      console.warn("Failed to fetch users from server:", err);
      const saved = typeof window !== "undefined" ? localStorage.getItem("imc_admin_users") : null;
      if (saved) {
        try {
          setUsersList(JSON.parse(saved));
        } catch {
          setUsersList([]);
        }
      } else {
        setUsersList([]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    loadUsers();
  }, []);

  const triggerSuccess = (msg: string) => {
    setNotificationMsg(msg);
    setIsSuccessNotification(true);
    setTimeout(() => setIsSuccessNotification(false), 4000);
  };

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

  const openPasswordModal = (user: any) => {
    setPasswordModalUser(user);
    setNewPassword("");
    setConfirmPassword("");
    setPasswordError(null);
    setShowPassword(false);
  };

  const closePasswordModal = () => {
    setPasswordModalUser(null);
    setNewPassword("");
    setConfirmPassword("");
    setPasswordError(null);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordModalUser) return;

    if (!newPassword || newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match. Please re-enter.");
      return;
    }

    setIsChangingPassword(true);
    setPasswordError(null);

    try {
      const res = await changeUserPasswordAction(passwordModalUser.id, newPassword);
      if (!res.success) {
        setPasswordError(res.error || "Failed to change password");
        return;
      }

      // Also update in localStorage if present
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem("imc_admin_users");
        if (saved) {
          try {
            const list = JSON.parse(saved);
            const updated = list.map((u: any) => 
              u.id === passwordModalUser.id ? { ...u, password: newPassword } : u
            );
            localStorage.setItem("imc_admin_users", JSON.stringify(updated));
          } catch {}
        }
      }

      closePasswordModal();
      triggerSuccess(`Password for ${passwordModalUser.name || passwordModalUser.email} updated successfully!`);
    } catch (err: any) {
      setPasswordError(err.message || "An unexpected error occurred");
    } finally {
      setIsChangingPassword(false);
    }
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
        const res = await createAdminUserAction(data);
        if (!res.success) {
          setError(res.error || "Failed to create user");
          setIsSaving(false);
          return;
        }

        await loadUsers();
        triggerSuccess(`Team member ${formData.name} added successfully!`);
      } else if (activeModal === "edit") {
        data.append("id", formData.id.toString());
        if (formData.password && formData.password.trim().length >= 6) {
          data.append("password", formData.password.trim());
        }

        const res = await updateAdminUserAction(data);
        if (!res.success) {
          setError(res.error || "Failed to update user");
          setIsSaving(false);
          return;
        }

        await loadUsers();
        triggerSuccess(`User ${formData.name} updated successfully!`);
      }

      setActiveModal(null);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 font-display">
            Admin Accounts & Role Permissions
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Role-Based Access Control (Super Admin, Admin, Counsellor, Editor) with password management.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isSuccessNotification && (
            <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-2 rounded-xl animate-in fade-in duration-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{notificationMsg}</span>
            </div>
          )}

          <button
            onClick={() => loadUsers()}
            title="Refresh user list"
            className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-blue-600' : ''}`} />
          </button>

          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 bg-[#0B4F9C] hover:bg-[#083E7D] text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Team Member</span>
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
              <tr>
                <th className="py-3.5 px-4">User Name</th>
                <th className="py-3.5 px-4">Contact</th>
                <th className="py-3.5 px-4">Assigned Role</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Last Activity</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                // Skeleton loading rows while fetching database users
                <>
                  {[1, 2].map((i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-200" />
                          <div className="space-y-1.5">
                            <div className="w-28 h-3.5 bg-slate-200 rounded" />
                            <div className="w-20 h-2.5 bg-slate-100 rounded" />
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="w-36 h-3 bg-slate-200 rounded mb-1" />
                        <div className="w-24 h-2.5 bg-slate-100 rounded" />
                      </td>
                      <td className="py-4 px-4">
                        <div className="w-20 h-5 bg-slate-200 rounded-full" />
                      </td>
                      <td className="py-4 px-4">
                        <div className="w-14 h-4 bg-slate-100 rounded-full" />
                      </td>
                      <td className="py-4 px-4">
                        <div className="w-24 h-3 bg-slate-100 rounded" />
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="w-24 h-7 bg-slate-100 rounded ml-auto" />
                      </td>
                    </tr>
                  ))}
                </>
              ) : usersList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    <UserCheck className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="font-bold text-slate-700">No team members found</p>
                    <p className="text-xs text-slate-400 mt-0.5">Click &quot;Add New Team Member&quot; above to create an account.</p>
                  </td>
                </tr>
              ) : (
                usersList.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#0B4F9C] text-white font-bold text-xs flex items-center justify-center shadow-xs">
                          {u.name ? u.name.substring(0, 2).toUpperCase() : "U"}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{u.name}</div>
                          {u.uuid && (
                            <div className="text-[10px] text-slate-400 font-mono">#{u.id}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      <div className="font-medium text-slate-800">{u.email}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{u.phone || 'No phone'}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                        u.role === "SUPER_ADMIN" ? "bg-purple-100 text-purple-800 border border-purple-200" :
                        u.role === "ADMIN" ? "bg-blue-100 text-blue-800 border border-blue-200" :
                        u.role === "COUNSELLOR" ? "bg-emerald-100 text-emerald-800 border border-emerald-200" :
                        u.role === "EDITOR" ? "bg-amber-100 text-amber-800 border border-amber-200" :
                        "bg-slate-100 text-slate-800 border border-slate-200"
                      }`}>
                        {u.role ? u.role.replace("_", " ") : "USER"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      {u.isActive ? (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                          Active
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 text-[11px]" suppressHydrationWarning>
                      {mounted ? (u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString() : "Never logged in") : (u.lastLoginAt ? "Recently" : "Never logged in")}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-2 justify-end">
                        {/* Change Password Button */}
                        <button
                          onClick={() => openPasswordModal(u)}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                          title="Change password for this user"
                        >
                          <KeyRound className="w-3.5 h-3.5" />
                          <span>Change Password</span>
                        </button>

                        {/* Edit Role Button */}
                        <button
                          onClick={() => openEditModal(u)}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-200/80 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                          title="Edit account details and permissions"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Edit Role</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* CHANGE PASSWORD MODAL (SUPER ADMIN FEATURE)                               */}
      {/* ========================================================================= */}
      {passwordModalUser && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in fade-in zoom-in-95">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-amber-50/50">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-700">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 font-display">
                    Change Password
                  </h3>
                  <p className="text-xs text-slate-500">
                    Super Admin password override
                  </p>
                </div>
              </div>
              <button
                onClick={closePasswordModal}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePasswordSubmit} className="p-6 space-y-4">
              {passwordError && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-600 text-xs font-bold px-3 py-2.5 rounded-xl flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{passwordError}</span>
                </div>
              )}

              {/* Target User Info Banner */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#0B4F9C] text-white font-bold text-xs flex items-center justify-center shrink-0">
                  {passwordModalUser.name ? passwordModalUser.name.substring(0, 2).toUpperCase() : "U"}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900 truncate">{passwordModalUser.name}</div>
                  <div className="text-[11px] text-slate-500 truncate">{passwordModalUser.email}</div>
                </div>
                <div className="ml-auto">
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-purple-100 text-purple-800">
                    {passwordModalUser.role}
                  </span>
                </div>
              </div>

              {/* New Password Field */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password (min 6 characters)"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full text-xs p-2.5 pr-10 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:bg-white focus:border-amber-500 focus:outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Confirm New Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Re-type new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:bg-white focus:border-amber-500 focus:outline-none transition-colors"
                />
              </div>

              <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/60 text-[11px] text-amber-900 flex items-start gap-2">
                <Lock className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                <span>The new password will be hashed and updated immediately in the MySQL database. The user will be able to log in with this new password right away.</span>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={closePasswordModal}
                  className="text-xs font-bold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-200 py-2.5 px-4 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isChangingPassword || !newPassword || newPassword.length < 6}
                  className="inline-flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold py-2.5 px-6 rounded-xl shadow-xs transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isChangingPassword ? (
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <KeyRound className="w-3.5 h-3.5" />
                  )}
                  <span>Update Password</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* INTERACTIVE MODAL: ADD / EDIT TEAM USER                                   */}
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
                  disabled={activeModal === "edit"}
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

              {activeModal === "create" ? (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Initial Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Reset Password (optional)
                  </label>
                  <input
                    type="password"
                    placeholder="Leave blank to keep current password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Enter a new password here or use the &quot;Change Password&quot; button in the table.</p>
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
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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
