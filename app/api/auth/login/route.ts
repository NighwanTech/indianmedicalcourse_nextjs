import { NextRequest, NextResponse } from "next/server";
import { authService } from "@/features/auth/authService";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, rememberMe } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Get IP address for audit logging
    const ip = request.headers.get("x-forwarded-for") || "unknown";

    const { user, token } = await authService.login(email, password, ip);

    // Create the response
    const response = NextResponse.json(
      { success: true, user: { id: user.id, name: user.name, role: user.role } },
      { status: 200 }
    );

    // Set the cookie (30 days if rememberMe, otherwise 7 days)
    const cookieMaxAge = rememberMe ? 30 * 24 * 60 * 60 : 7 * 24 * 60 * 60;

    response.cookies.set({
      name: "imc_auth_token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: cookieMaxAge,
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Login API Error:", error);
    return NextResponse.json(
      { error: error.message || "Invalid credentials" },
      { status: 401 }
    );
  }
}
