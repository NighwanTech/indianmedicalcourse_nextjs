import nodemailer from "nodemailer";
import { prisma } from "@/lib/db";

export interface EmailDispatchOptions {
  to: string | string[];
  subject: string;
  htmlContent: string;
}

export interface LeadEmailData {
  id?: string;
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

/**
 * Retrieve active SMTP configuration from database with .env fallbacks
 */
async function getActiveSmtpConfig() {
  try {
    const dbSettings = await prisma.siteSetting.findMany({
      where: {
        settingKey: {
          in: [
            "smtp_host",
            "smtp_port",
            "smtp_user",
            "smtp_pass",
            "smtp_secure",
            "smtp_from_name",
            "smtp_from_email",
            "notification_emails",
            "lead_email_alerts_enabled",
          ],
        },
      },
    });

    const map: Record<string, string> = {};
    dbSettings.forEach((s) => (map[s.settingKey] = s.settingValue));

    const host = map["smtp_host"] || process.env.SMTP_HOST || "smtp.gmail.com";
    const port = Number(map["smtp_port"] || process.env.SMTP_PORT || 587);
    const user = map["smtp_user"] || process.env.SMTP_USER || "admissions@indianmedicalcourses.com";
    const pass = map["smtp_pass"] || process.env.SMTP_PASS || "";
    const isSecure = map["smtp_secure"] === "true" || port === 465;
    const fromName = map["smtp_from_name"] || "Indian Medical Course Admissions";
    const fromEmail = map["smtp_from_email"] || user;
    const notificationEmails = map["notification_emails"] || user;
    const isEnabled = map["lead_email_alerts_enabled"] !== "false";

    return {
      host,
      port,
      user,
      pass,
      isSecure,
      fromName,
      fromEmail,
      notificationEmails,
      isEnabled,
    };
  } catch {
    return {
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT) || 587,
      user: process.env.SMTP_USER || "admissions@indianmedicalcourses.com",
      pass: process.env.SMTP_PASS || "",
      isSecure: false,
      fromName: "Indian Medical Course Admissions",
      fromEmail: process.env.SMTP_USER || "admissions@indianmedicalcourses.com",
      notificationEmails: process.env.SMTP_USER || "admissions@indianmedicalcourses.com",
      isEnabled: true,
    };
  }
}

/**
 * Generic email dispatcher using active SMTP credentials
 */
export async function sendEmail({ to, subject, htmlContent }: EmailDispatchOptions): Promise<boolean> {
  try {
    const config = await getActiveSmtpConfig();

    if (!config.pass) {
      console.warn(`[Email Service Warning] SMTP_PASS is not configured. Email to ${to} ("${subject}") simulated.`);
      return false;
    }

    const recipientList = Array.isArray(to) ? to.join(", ") : to;

    const transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.isSecure,
      auth: {
        user: config.user,
        pass: config.pass,
      },
      connectionTimeout: 10000,
      tls: {
        rejectUnauthorized: false,
      },
    });

    await transporter.sendMail({
      from: `"${config.fromName}" <${config.fromEmail}>`,
      to: recipientList,
      subject,
      html: htmlContent,
    });

    return true;
  } catch (error) {
    console.error("[Email Service Error]", error);
    return false;
  }
}

/**
 * Automated Lead Alert Email to Admin / Admissions Team
 */
export async function sendLeadAlertEmail({
  lead,
  toEmails,
}: {
  lead: LeadEmailData;
  toEmails?: string[];
}): Promise<boolean> {
  try {
    const config = await getActiveSmtpConfig();
    if (!config.isEnabled) {
      return true;
    }

    let recipients: string[] = [];
    if (toEmails && toEmails.length > 0) {
      recipients = toEmails;
    } else if (config.notificationEmails) {
      recipients = config.notificationEmails.split(",").map((e) => e.trim()).filter(Boolean);
    }

    if (recipients.length === 0) {
      recipients = [config.user];
    }

    const timestamp = lead.createdAt
      ? new Date(lead.createdAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
      : new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

    const cleanMobileDigits = lead.mobile.replace(/[^0-9]/g, "");
    const cleanMobileTel = lead.mobile.replace(/[^0-9+]/g, "");

    const subject = `🚨 [NEW LEAD] ${lead.name} - ${lead.interestedCourse || "Clinical Fellowship"}`;

    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${subject}</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; margin: 0; padding: 20px; color: #1e293b; }
        .card { max-width: 620px; margin: 0 auto; background: #ffffff; border-radius: 18px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04); border: 1px solid #e2e8f0; }
        .header { background: linear-gradient(135deg, #0B4F9C 0%, #063164 100%); padding: 28px 24px; text-align: center; color: #ffffff; }
        .header h1 { margin: 0; font-size: 20px; font-weight: 800; letter-spacing: -0.02em; }
        .header p { margin: 6px 0 0; font-size: 13px; color: #cbd5e1; }
        .badge-bar { background-color: #f8fafc; border-bottom: 1px solid #e2e8f0; padding: 12px 24px; display: flex; justify-content: space-between; font-size: 12px; color: #64748b; }
        .content { padding: 24px; }
        .lead-name { font-size: 22px; font-weight: 800; color: #0f172a; margin-bottom: 4px; }
        .lead-course { font-size: 15px; font-weight: 700; color: #0B4F9C; margin-bottom: 20px; }
        .info-grid { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
        .info-grid td { padding: 10px 12px; font-size: 13px; border-bottom: 1px solid #f1f5f9; }
        .info-grid td.label { font-weight: 700; color: #64748b; width: 35%; background-color: #f8fafc; border-radius: 6px 0 0 6px; }
        .info-grid td.value { font-weight: 600; color: #1e293b; }
        .btn-group { display: flex; gap: 12px; margin: 24px 0 16px; }
        .btn { flex: 1; text-align: center; padding: 13px 16px; border-radius: 12px; font-size: 13px; font-weight: 700; text-decoration: none; display: inline-block; }
        .btn-wa { background-color: #25D366; color: #ffffff; }
        .btn-call { background-color: #0f172a; color: #ffffff; }
        .footer { background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 18px 24px; text-align: center; font-size: 12px; color: #94a3b8; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <h1>🚨 New Doctor Lead Captured</h1>
          <p>Indian Medical Course Admissions CRM Engine</p>
        </div>

        <div class="content">
          <div class="lead-name">${lead.name}</div>
          <div class="lead-course">Program: ${lead.interestedCourse || "Clinical Fellowship"}</div>

          <table class="info-grid">
            <tr>
              <td class="label">Mobile Phone</td>
              <td class="value"><a href="tel:${cleanMobileTel}" style="color: #0B4F9C; text-decoration: none; font-weight: 800;">${lead.mobile}</a></td>
            </tr>
            <tr>
              <td class="label">Email Address</td>
              <td class="value"><a href="mailto:${lead.email}" style="color: #0B4F9C; text-decoration: none;">${lead.email}</a></td>
            </tr>
            <tr>
              <td class="label">Qualification</td>
              <td class="value">${lead.qualification || "MBBS / Post Graduate"}</td>
            </tr>
            <tr>
              <td class="label">Location</td>
              <td class="value">${[lead.city, lead.state].filter(Boolean).join(", ") || "India"}</td>
            </tr>
            <tr>
              <td class="label">Inquiry Source</td>
              <td class="value">${lead.gclid ? "🎯 Google Ads (Verified GCLID)" : (lead.leadSource || "Website Form")}</td>
            </tr>
            ${lead.utmCampaign ? `<tr><td class="label">Campaign</td><td class="value">${lead.utmCampaign}</td></tr>` : ""}
            ${lead.notes ? `<tr><td class="label">Applicant Notes</td><td class="value">${lead.notes}</td></tr>` : ""}
            <tr>
              <td class="label">Captured At</td>
              <td class="value">${timestamp} IST</td>
            </tr>
          </table>

          <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
            <tr>
              <td style="padding-right: 6px; width: 50%;">
                <a href="https://wa.me/${cleanMobileDigits}" style="display: block; text-align: center; background-color: #25D366; color: #ffffff; padding: 12px; border-radius: 10px; font-weight: 700; text-decoration: none; font-size: 13px;">
                  💬 WhatsApp Doctor
                </a>
              </td>
              <td style="padding-left: 6px; width: 50%;">
                <a href="tel:${cleanMobileTel}" style="display: block; text-align: center; background-color: #0f172a; color: #ffffff; padding: 12px; border-radius: 10px; font-weight: 700; text-decoration: none; font-size: 13px;">
                  📞 Call Hotline
                </a>
              </td>
            </tr>
          </table>

        </div>

        <div class="footer">
          Received in real-time by Indian Medical Course Notification Dispatcher.<br/>
          Manage this lead in the <a href="https://indianmedicalcourse.com/admin/leads" style="color: #0B4F9C; font-weight: 700;">Admin CRM Panel</a>.
        </div>
      </div>
    </body>
    </html>
    `;

    return await sendEmail({
      to: recipients,
      subject,
      htmlContent,
    });
  } catch (error) {
    console.error("[sendLeadAlertEmail Error]", error);
    return false;
  }
}

/**
 * Send automated confirmation email to the doctor who submitted the form
 */
export async function sendDoctorAcknowledgmentEmail({
  lead,
}: {
  lead: LeadEmailData;
}): Promise<boolean> {
  try {
    if (!lead.email || lead.email.includes("@imc-lead.in") || lead.email.includes("example.com")) {
      return false; // Skip placeholder generated emails
    }

    const subject = `Application Received: ${lead.interestedCourse || "Clinical Fellowship"} | Indian Medical Course`;

    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b; }
        .card { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; padding: 32px 24px; }
        .logo { font-size: 20px; font-weight: 900; color: #0B4F9C; margin-bottom: 16px; }
        h2 { font-size: 18px; color: #0f172a; margin-top: 0; }
        p { font-size: 14px; line-height: 1.6; color: #475569; }
        .highlight { background-color: #eff6ff; border-left: 4px solid #0B4F9C; padding: 14px; border-radius: 0 8px 8px 0; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="logo">Indian Medical Course</div>
        <h2>Dear ${lead.name},</h2>
        <p>Thank you for submitting your application for <strong>${lead.interestedCourse || "Clinical Fellowship Programs"}</strong>.</p>
        
        <div class="highlight">
          <p style="margin: 0; font-weight: 700; color: #0B4F9C;">What happens next?</p>
          <p style="margin: 6px 0 0; font-size: 13px; color: #334155;">
            Our Academic Admissions Committee will review your qualification (${lead.qualification || "MBBS/MD"}). A Senior Medical Counselor will contact you via phone or WhatsApp shortly to discuss hospital rotation slots, eligibility, and scholarship options.
          </p>
        </div>

        <p>If you need urgent assistance, you can reach our Admissions Helpdesk directly:</p>
        <p>
          📞 <strong>Hotline:</strong> +91 8295843006<br/>
          💬 <strong>WhatsApp:</strong> <a href="https://wa.me/918295843006" style="color: #25D366; font-weight: 700;">Chat with Admissions Desk</a><br/>
          🌐 <strong>Website:</strong> <a href="https://indianmedicalcourse.com" style="color: #0B4F9C;">indianmedicalcourse.com</a>
        </p>

        <p style="font-size: 12px; color: #94a3b8; margin-top: 28px; border-top: 1px solid #f1f5f9; padding-top: 14px;">
          Indian Medical Course Admissions Office • Accredited Clinical Training Wing
        </p>
      </div>
    </body>
    </html>
    `;

    return await sendEmail({
      to: lead.email,
      subject,
      htmlContent,
    });
  } catch (error) {
    console.error("[sendDoctorAcknowledgmentEmail Error]", error);
    return false;
  }
}
