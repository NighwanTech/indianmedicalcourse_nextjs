import { prisma } from "@/lib/db";

export interface LeadAlertPayload {
  name: string;
  mobile: string;
  email: string;
  interestedCourse?: string;
  qualification?: string;
  city?: string;
  state?: string;
  leadSource?: string;
  utmSource?: string;
  utmCampaign?: string;
  gclid?: string;
  createdAt?: string;
  notes?: string;
}

export interface WhatsAppSendOptions {
  lead: LeadAlertPayload;
  customWebhookUrl?: string;
  customPhoneNumber?: string;
}

export async function sendWhatsAppLeadAlert({
  lead,
  customWebhookUrl,
  customPhoneNumber,
}: WhatsAppSendOptions): Promise<{ success: boolean; message: string; payload?: any }> {
  try {
    // 1. Fetch settings from DB
    const dbSettings = await prisma.siteSetting.findMany({
      where: {
        settingKey: {
          in: [
            "notification_whatsapp",
            "lead_whatsapp_alerts_enabled",
            "whatsapp_mode",
            "whatsapp_webhook_url",
            "whatsapp_meta_phone_id",
            "whatsapp_meta_token",
          ],
        },
      },
    });

    const settingsMap: Record<string, string> = {};
    dbSettings.forEach((s) => (settingsMap[s.settingKey] = s.settingValue));

    const isEnabled = settingsMap["lead_whatsapp_alerts_enabled"] !== "false";
    if (!isEnabled && !customWebhookUrl) {
      return { success: true, message: "WhatsApp lead alerts are currently disabled in settings." };
    }

    const targetPhone = customPhoneNumber || settingsMap["notification_whatsapp"] || "+918295843006";
    const cleanTargetPhone = targetPhone.replace(/[^0-9+]/g, "");
    const webhookUrl = (customWebhookUrl || settingsMap["whatsapp_webhook_url"] || "").trim();
    const metaPhoneId = (settingsMap["whatsapp_meta_phone_id"] || "").trim();
    const metaToken = (settingsMap["whatsapp_meta_token"] || "").trim();

    const timestamp = lead.createdAt
      ? new Date(lead.createdAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
      : new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

    // Format clean readable alert text
    const alertMessage = 
`🚨 *NEW DOCTOR LEAD CAPTURED* 🚨
━━━━━━━━━━━━━━━━━━━━
👨‍⚕️ *Doctor:* ${lead.name}
📞 *Mobile:* ${lead.mobile}
✉️ *Email:* ${lead.email}
🎓 *Course:* ${lead.interestedCourse || "Clinical Fellowship"}
🩺 *Qualification:* ${lead.qualification || "MBBS"}
📍 *Location:* ${[lead.city, lead.state].filter(Boolean).join(", ") || "India"}
🌐 *Source:* ${lead.gclid ? "Google Ads (GCLID)" : lead.leadSource || "Website Inquiry"}
⏰ *Time:* ${timestamp} IST

👉 *Quick Call:* tel:${lead.mobile.replace(/[^0-9+]/g, "")}
👉 *Direct WhatsApp:* https://wa.me/${lead.mobile.replace(/[^0-9]/g, "")}
━━━━━━━━━━━━━━━━━━━━`;

    // 2. Dispatch via Webhook (Zapier, Make, Wati, AiSensy, Twilio, Pabbly)
    if (webhookUrl) {
      try {
        const response = await fetch(webhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "User-Agent": "IndianMedicalCourse-AlertEngine/1.0",
          },
          body: JSON.stringify({
            event: "NEW_LEAD_ALERT",
            notificationTargetPhone: cleanTargetPhone,
            lead: {
              name: lead.name,
              mobile: lead.mobile,
              email: lead.email,
              course: lead.interestedCourse || "Clinical Fellowship",
              qualification: lead.qualification || "MBBS",
              city: lead.city || "",
              state: lead.state || "",
              source: lead.leadSource || "Website Form",
              gclid: lead.gclid || null,
              utmCampaign: lead.utmCampaign || null,
              createdAt: timestamp,
            },
            messageText: alertMessage,
            actionUrls: {
              callUrl: `tel:${lead.mobile.replace(/[^0-9+]/g, "")}`,
              whatsappUrl: `https://wa.me/${lead.mobile.replace(/[^0-9]/g, "")}`,
            },
          }),
        });

        if (response.ok) {
          return {
            success: true,
            message: `Lead alert dispatched to WhatsApp Webhook (${response.status} OK)`,
          };
        } else {
          return {
            success: false,
            message: `Webhook returned status ${response.status}: ${response.statusText}`,
          };
        }
      } catch (err: any) {
        return {
          success: false,
          message: `Failed to ping WhatsApp webhook: ${err?.message}`,
        };
      }
    }

    // 3. Dispatch via Meta WhatsApp Cloud API (if configured)
    if (metaPhoneId && metaToken) {
      try {
        const response = await fetch(`https://graph.facebook.com/v19.0/${metaPhoneId}/messages`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${metaToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messaging_product: "whatsapp",
            recipient_type: "individual",
            to: cleanTargetPhone.replace(/[^0-9]/g, ""),
            type: "text",
            text: {
              preview_url: false,
              body: alertMessage,
            },
          }),
        });

        const data = await response.json();
        if (response.ok && data.messages?.[0]?.id) {
          return {
            success: true,
            message: `Lead alert sent via Meta WhatsApp Cloud API (ID: ${data.messages[0].id})`,
          };
        } else {
          return {
            success: false,
            message: data?.error?.message || "Meta WhatsApp Cloud API error",
            payload: data,
          };
        }
      } catch (err: any) {
        return {
          success: false,
          message: `Meta Cloud API network failure: ${err?.message}`,
        };
      }
    }

    // 4. Default fallback: No webhook/API configured yet
    // Return structured payload so admin sees it's ready once webhook/API credentials are added
    return {
      success: true,
      message: `WhatsApp ready: Alert formatted for ${cleanTargetPhone}. Configure a WhatsApp Webhook URL or Meta Cloud API in Admin Settings to enable automated sending.`,
    };
  } catch (error: any) {
    console.error("[WhatsApp Service Error]:", error);
    return {
      success: false,
      message: error?.message || "Internal WhatsApp service error",
    };
  }
}
