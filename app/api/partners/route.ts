import { NextResponse } from "next/server";
import { partnerRepository } from "@/features/partners/partnerRepository";
import { hospitalPartners } from "@/lib/data";

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

    return NextResponse.json(partners || hospitalPartners, { status: 200 });
  } catch (error: any) {
    console.error("GET /api/partners fallback to static data:", error);
    return NextResponse.json(hospitalPartners, { status: 200 });
  }
}

