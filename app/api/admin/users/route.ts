import { NextResponse } from "next/server";
import { authRepository } from "@/features/auth/authRepository";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function GET() {
  try {
    // Only allow logged in admins
    const cookieStore = await cookies();
    const token = cookieStore.get("imc_auth_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload || (payload.role !== "SUPER_ADMIN" && payload.role !== "ADMIN")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const users = await authRepository.listAllUsers();
    return NextResponse.json(users, { status: 200 });
  } catch (error: any) {
    console.error("List users API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
