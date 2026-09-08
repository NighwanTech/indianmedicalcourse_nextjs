import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { LeadStatus, LeadPriority } from "@prisma/client";

export const dynamic = "force-dynamic";

/**
 * GET /api/leads/[id]
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const leadId = BigInt(id);

    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
      include: {
        assignedCounsellor: true,
        activities: { orderBy: { createdAt: "desc" } },
        notes: { orderBy: { createdAt: "desc" } },
      },
    });

    if (!lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    return NextResponse.json({
      lead: {
        ...lead,
        id: lead.id.toString(),
      },
    });
  } catch (error: any) {
    console.error("GET /api/leads/[id] error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

/**
 * PATCH /api/leads/[id]
 * Update status, priority, counsellor, notes
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const leadId = BigInt(id);
    const body = await request.json();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dataToUpdate: any = {};

    if (body.leadStatus) {
      dataToUpdate.leadStatus = body.leadStatus as LeadStatus;
    }
    if (body.priority) {
      dataToUpdate.priority = body.priority as LeadPriority;
    }
    if (body.notes !== undefined) {
      dataToUpdate.message = body.notes;
    }
    if (body.assignedCounsellorId !== undefined) {
      dataToUpdate.assignedCounsellorId = body.assignedCounsellorId ? Number(body.assignedCounsellorId) : null;
    }

    const updated = await prisma.lead.update({
      where: { id: leadId },
      data: dataToUpdate,
    });

    // Optionally log status change activity
    if (body.leadStatus) {
      try {
        await prisma.leadActivity.create({
          data: {
            leadId,
            activityType: "STATUS_CHANGE",
            title: `Status Changed to ${body.leadStatus}`,
            description: `Updated from admin panel`,
          },
        });
      } catch {
        // Non-critical
      }
    }

    return NextResponse.json({
      success: true,
      lead: {
        ...updated,
        id: updated.id.toString(),
      },
    });
  } catch (error: any) {
    console.error("PATCH /api/leads/[id] error:", error);
    return NextResponse.json({ error: error?.message || "Failed to update lead" }, { status: 500 });
  }
}

/**
 * DELETE /api/leads/[id]
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const leadId = BigInt(id);

    await prisma.lead.delete({
      where: { id: leadId },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("DELETE /api/leads/[id] error:", error);
    return NextResponse.json({ error: error?.message || "Failed to delete lead" }, { status: 500 });
  }
}
