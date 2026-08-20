export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  if (typeof window !== "undefined") {
    sessionStorage.setItem("imc_admin_session", JSON.stringify({ email, role: "SUPER_ADMIN", name: "Super Administrator" }));
  }

  return { success: true, error: "" };
}

export async function logoutAction() {
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

export async function createAdminUserAction(formData: FormData): Promise<{ success: boolean; error?: string }> {
  return { success: true };
}

export async function updateAdminUserAction(idOrFormData?: any, formData?: any): Promise<{ success: boolean; error?: string }> {
  return { success: true };
}
