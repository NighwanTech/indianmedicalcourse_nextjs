import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { SettingGroup } from "@prisma/client";

// Setting key to SettingGroup mapping helper
function resolveSettingGroup(key: string): SettingGroup {
  if (key.startsWith("smtp_") || key === "notification_emails" || key === "lead_email_alerts_enabled") {
    return SettingGroup.SMTP_EMAIL;
  }
  if (key.startsWith("whatsapp_") || key === "notification_whatsapp" || key === "lead_whatsapp_alerts_enabled") {
    return SettingGroup.WHATSAPP_CONFIG;
  }
  if (key.includes("ga_") || key.includes("analytics")) {
    return SettingGroup.GOOGLE_ANALYTICS;
  }
  if (key.includes("gtm_")) {
    return SettingGroup.GOOGLE_TAG_MANAGER;
  }
  if (key.includes("google_ads") || key.includes("gads")) {
    return SettingGroup.GOOGLE_ADS;
  }
  if (key.includes("meta_pixel") || key.includes("facebook")) {
    return SettingGroup.META_PIXEL;
  }
  if (key === "hotline_phone" || key === "support_email" || key === "registered_address") {
    return SettingGroup.CONTACT_INFO;
  }
  if (key === "announcement_text") {
    return SettingGroup.ANNOUNCEMENT_BAR;
  }
  if (key === "brand_name") {
    return SettingGroup.COMPANY_DETAILS;
  }
  return SettingGroup.GENERAL;
}

/**
 * GET /api/settings
 * Fetch all site settings from database merged with default environment values
 */
export async function GET() {
  try {
    const dbSettings = await prisma.siteSetting.findMany();
    const settingsMap: Record<string, string> = {};

    dbSettings.forEach((item) => {
      settingsMap[item.settingKey] = item.settingValue;
    });

    // Merge environment defaults if not set in DB
    const mergedSettings: Record<string, string> = {
      // SMTP & Email Defaults
      smtp_host: settingsMap["smtp_host"] || process.env.SMTP_HOST || "smtp.gmail.com",
      smtp_port: settingsMap["smtp_port"] || process.env.SMTP_PORT || "587",
      smtp_user: settingsMap["smtp_user"] || process.env.SMTP_USER || "admissions@indianmedicalcourses.com",
      smtp_pass: settingsMap["smtp_pass"] || process.env.SMTP_PASS || "",
      smtp_secure: settingsMap["smtp_secure"] || "false",
      smtp_from_name: settingsMap["smtp_from_name"] || "Indian Medical Course Admissions",
      smtp_from_email: settingsMap["smtp_from_email"] || settingsMap["smtp_user"] || process.env.SMTP_USER || "admissions@indianmedicalcourses.com",
      notification_emails: settingsMap["notification_emails"] || settingsMap["support_email"] || "admissions@indianmedicalcourses.com",
      lead_email_alerts_enabled: settingsMap["lead_email_alerts_enabled"] !== undefined ? settingsMap["lead_email_alerts_enabled"] : "true",
      doctor_auto_reply_enabled: settingsMap["doctor_auto_reply_enabled"] || "false",

      // WhatsApp Defaults
      notification_whatsapp: settingsMap["notification_whatsapp"] || settingsMap["whatsapp_number"] || "+918295843006",
      lead_whatsapp_alerts_enabled: settingsMap["lead_whatsapp_alerts_enabled"] !== undefined ? settingsMap["lead_whatsapp_alerts_enabled"] : "true",
      whatsapp_mode: settingsMap["whatsapp_mode"] || "WEBHOOK",
      whatsapp_webhook_url: settingsMap["whatsapp_webhook_url"] || "",
      whatsapp_meta_phone_id: settingsMap["whatsapp_meta_phone_id"] || "",
      whatsapp_meta_token: settingsMap["whatsapp_meta_token"] || "",
      whatsapp_meta_template: settingsMap["whatsapp_meta_template"] || "",

      // General / Company
      brand_name: settingsMap["brand_name"] || "Indian Medical Course",
      hotline_phone: settingsMap["hotline_phone"] || "+91 8295843006",
      whatsapp_number: settingsMap["whatsapp_number"] || "+91 8295843006",
      support_email: settingsMap["support_email"] || "indianmedicalcourses@gmail.com",
      registered_address: settingsMap["registered_address"] || "Narayni Polly clinic dhimshri shamshabad near police chowk and DAV inter College, Agra - UP, 283125, India",
      announcement_text: settingsMap["announcement_text"] || "Admissions Open for 2026 Batches | Limited Clinical Training Seats Available | 0% Interest EMI Options",

      // Retain any other custom keys
      ...settingsMap,
    };

    return NextResponse.json({ success: true, settings: mergedSettings });
  } catch (error: any) {
    console.error("GET /api/settings error:", error);
    return NextResponse.json({ success: false, error: error?.message || "Failed to fetch settings" }, { status: 500 });
  }
}

/**
 * POST /api/settings
 * Upsert one or many site settings into database
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const settings: Record<string, string> = body.settings || body;

    if (!settings || typeof settings !== "object") {
      return NextResponse.json({ success: false, error: "Invalid settings payload" }, { status: 400 });
    }

    const upsertPromises = Object.entries(settings).map(async ([key, val]) => {
      const stringValue = typeof val === "string" ? val : String(val ?? "");
      const group = resolveSettingGroup(key);

      return prisma.siteSetting.upsert({
        where: { settingKey: key },
        update: {
          settingValue: stringValue,
          settingGroup: group,
        },
        create: {
          settingKey: key,
          settingValue: stringValue,
          settingGroup: group,
        },
      });
    });

    await Promise.all(upsertPromises);

    return NextResponse.json({
      success: true,
      message: "Site settings saved successfully to database",
    });
  } catch (error: any) {
    console.error("POST /api/settings error:", error);
    return NextResponse.json({ success: false, error: error?.message || "Failed to save settings" }, { status: 500 });
  }
}
