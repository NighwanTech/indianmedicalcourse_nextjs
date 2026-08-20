export async function loginAction(formData: FormData) {
  const email = (formData.get("email") as string || "").trim();
  const password = (formData.get("password") as string || "").trim();

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      return { error: data.error || "Invalid credentials" };
    }

    if (typeof window !== "undefined") {
      sessionStorage.setItem(
        "imc_admin_session",
        JSON.stringify(data.user || { email, role: "SUPER_ADMIN", name: "Super Administrator" })
      );
    }

    return { success: true, error: "" };
  } catch (err: any) {
    console.error("[Login Action Error]", err);
    return { error: err.message || "Failed to login. Please try again." };
  }
}

export async function logoutAction() {
  try {
    await fetch("/api/auth/logout", { method: "POST" });
  } catch (e) {
    console.error("[Logout Error]", e);
  }
  if (typeof window !== "undefined") {
    sessionStorage.removeItem("imc_admin_session");
  }
  return { success: true };
}

export async function forgotPasswordAction(formData: FormData) {
  const email = formData.get("email") as string;
  if (!email) {
    return { error: "Email is required" };
  }
  return { success: true, resetUrl: "/admin/reset-password?token=demo_token" };
}

export async function resetPasswordAction(formData: FormData) {
  const password = formData.get("password") as string;
  if (!password || password.length < 8) {
    return { error: "Password must be at least 8 characters" };
  }
  return { success: true };
}

export async function createAdminUserAction(formData: FormData): Promise<{ success: boolean; error?: string; user?: any }> {
  try {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const role = formData.get("role") as string;
    const password = formData.get("password") as string;

    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phone, role, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data.error || "Failed to create user" };
    }
    return { success: true, user: data.user };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to create user" };
  }
}

export async function updateAdminUserAction(formData: FormData): Promise<{ success: boolean; error?: string; user?: any }> {
  try {
    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const role = formData.get("role") as string;

    const res = await fetch("/api/admin/users", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, name, email, phone, role }),
    });

    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data.error || "Failed to update user" };
    }
    return { success: true, user: data.user };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to update user" };
  }
}
