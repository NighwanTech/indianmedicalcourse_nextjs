import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Pull from request body or fall back to database / environment
    let host = body.host;
    let port = body.port;
    let user = body.user;
    let pass = body.pass;
    let secure = body.secure;
    let fromName = body.fromName;
    let fromEmail = body.fromEmail;
    let testEmail = body.testEmail;

    if (!host || !user || !pass) {
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
            ],
          },
        },
      });
      const map: Record<string, string> = {};
      dbSettings.forEach((s) => (map[s.settingKey] = s.settingValue));

      host = host || map["smtp_host"] || process.env.SMTP_HOST || "smtp.gmail.com";
      port = port || map["smtp_port"] || process.env.SMTP_PORT || "587";
      user = user || map["smtp_user"] || process.env.SMTP_USER || "";
      pass = pass || map["smtp_pass"] || process.env.SMTP_PASS || "";
      secure = secure !== undefined ? secure : map["smtp_secure"] === "true";
      fromName = fromName || map["smtp_from_name"] || "Indian Medical Course Admissions";
      fromEmail = fromEmail || map["smtp_from_email"] || user;
      testEmail = testEmail || map["notification_emails"] || user;
    }

    if (!pass) {
      return NextResponse.json(
        {
          success: false,
          error: "SMTP Password is missing. For Gmail/Google Workspace, please enter a 16-character Google App Password.",
        },
        { status: 400 }
      );
    }

    const isPort465 = Number(port) === 465 || String(secure) === "true";

    const transporter = nodemailer.createTransport({
      host,
      port: Number(port) || 587,
      secure: isPort465,
      auth: {
        user,
        pass,
      },
      connectionTimeout: 10000,
      tls: {
        rejectUnauthorized: false,
      },
    });

    // 1. Verify connection
    try {
      await transporter.verify();
    } catch (verifyError: any) {
      let friendlyMessage = verifyError.message || "Failed to connect to SMTP server";
      if (friendlyMessage.includes("Invalid login") || friendlyMessage.includes("535") || friendlyMessage.includes("Username and Password not accepted")) {
        friendlyMessage = "Authentication failed: Username or Password incorrect. For Gmail, make sure you are using a 16-character Google App Password with 2-Step Verification enabled.";
      } else if (friendlyMessage.includes("ECONNREFUSED") || friendlyMessage.includes("ETIMEDOUT")) {
        friendlyMessage = `Connection timed out or refused by ${host}:${port}. Verify port number (587 or 465) and host.`;
      }

      return NextResponse.json({
        success: false,
        step: "VERIFICATION",
        error: friendlyMessage,
        raw: verifyError.message,
      }, { status: 400 });
    }

    // 2. If test email provided, attempt to send a real test email
    if (testEmail) {
      const info = await transporter.sendMail({
        from: `"${fromName || "IMC Admissions"}" <${fromEmail || user}>`,
        to: testEmail,
        subject: "✅ Test Email: Indian Medical Course SMTP Configuration Verified",
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
            <div style="text-align: center; margin-bottom: 24px;">
              <h2 style="color: #0B4F9C; margin: 0; font-size: 22px; font-weight: 800;">Indian Medical Course</h2>
              <p style="color: #64748b; font-size: 13px; margin: 4px 0 0;">Lead Notification System Diagnostic</p>
            </div>
            <div style="background-color: #ecfdf5; border: 1px solid #a7f3d0; padding: 16px; border-radius: 12px; margin-bottom: 20px;">
              <p style="margin: 0; color: #065f46; font-size: 14px; font-weight: 700;">
                🎉 SMTP Setup Verified Successfully!
              </p>
              <p style="margin: 8px 0 0; color: #047857; font-size: 13px;">
                Your email server is connected and ready to send instant doctor lead notifications.
              </p>
            </div>
            <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; font-size: 13px; color: #334155;">
              <div style="margin-bottom: 8px;"><strong>SMTP Host:</strong> ${host}</div>
              <div style="margin-bottom: 8px;"><strong>SMTP Port:</strong> ${port}</div>
              <div style="margin-bottom: 8px;"><strong>SMTP User:</strong> ${user}</div>
              <div style="margin-bottom: 8px;"><strong>Recipient:</strong> ${testEmail}</div>
              <div><strong>Timestamp:</strong> ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST</div>
            </div>
            <div style="margin-top: 24px; text-align: center; color: #94a3b8; font-size: 12px;">
              Indian Medical Course CMS & Lead Engine
            </div>
          </div>
        `,
      });

      return NextResponse.json({
        success: true,
        message: `SMTP verified! Test email successfully delivered to ${testEmail}`,
        messageId: info.messageId,
      });
    }

    return NextResponse.json({
      success: true,
      message: "SMTP server verified and connection established successfully!",
    });
  } catch (error: any) {
    console.error("POST /api/settings/test-smtp error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Failed to send test email",
      },
      { status: 500 }
    );
  }
}
