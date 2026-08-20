import { NextRequest, NextResponse } from "next/server";
import { authService } from "@/features/auth/authService";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

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

    // Set the cookie
    response.cookies.set({
      name: "imc_auth_token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
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
