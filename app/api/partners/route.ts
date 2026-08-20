import { NextResponse } from "next/server";
import { partnerRepository } from "@/features/partners/partnerRepository";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || "ALL";

    let partners = await partnerRepository.getActivePartners(category);

    // If database has no partners yet, auto-seed default partners
    if (!partners || partners.length === 0) {
      partners = await partnerRepository.seedDefaultPartners();
    }

    return NextResponse.json(partners, { status: 200 });
  } catch (error: any) {
    console.error("GET /api/partners error:", error);
    return NextResponse.json(
      { error: "Failed to fetch partners" },
      { status: 500 }
    );
  }
}
