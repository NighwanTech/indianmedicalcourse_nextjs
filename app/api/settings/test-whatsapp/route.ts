import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendWhatsAppLeadAlert } from "@/services/whatsappService";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const sampleLead = {
      name: "Dr. Rajesh Sharma (Test Probe)",
      mobile: body.mobile || "+919876543210",
      email: "test.doctor@imc.in",
      interestedCourse: "Fellowship in Clinical Cardiology",
      qualification: "MD / MBBS",
      city: "New Delhi",
      state: "Delhi",
      leadSource: "Admin Diagnostics Test",
      createdAt: new Date().toISOString(),
    };

    const result = await sendWhatsAppLeadAlert({
      lead: sampleLead,
      customWebhookUrl: body.webhookUrl,
      customPhoneNumber: body.notificationWhatsApp,
    });

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: result.message || "Test WhatsApp notification sent successfully!",
        data: result,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: result.message || "Failed to dispatch WhatsApp alert",
          details: result,
        },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error("POST /api/settings/test-whatsapp error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Internal error sending WhatsApp test alert",
      },
      { status: 500 }
    );
  }
}
