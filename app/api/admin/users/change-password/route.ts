import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, newPassword } = body;

    if (!userId || !newPassword) {
      return NextResponse.json(
        { error: "User ID and new password are required" },
        { status: 400 }
      );
    }

    const trimmedPassword = String(newPassword).trim();
    if (trimmedPassword.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    const id = Number(userId);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid user ID" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found in database" },
        { status: 404 }
      );
    }

    const passwordHash = await hashPassword(trimmedPassword);

    await prisma.user.update({
      where: { id },
      data: { passwordHash },
    });

    return NextResponse.json({
      success: true,
      message: `Password for ${user.name || user.email} was successfully changed.`,
    });
  } catch (error: any) {
    console.error("[Change Password API] Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to change user password" },
      { status: 500 }
    );
  }
}
