import nodemailer from "nodemailer";

export interface EmailDispatchOptions {
  to: string;
  subject: string;
  htmlContent: string;
}

export async function sendEmail({ to, subject, htmlContent }: EmailDispatchOptions): Promise<boolean> {
  try {
    const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
    const smtpUser = process.env.SMTP_USER || "admissions@indianmedicalcourses.com";
    const smtpPass = process.env.SMTP_PASS || "";

    if (!smtpPass) {
      console.log(`[Email Service Mock] Email to ${to} with subject "${subject}" logged.`);
      return true;
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    await transporter.sendMail({
      from: `"Indian Medical Course Admissions" <${smtpUser}>`,
      to,
      subject,
      html: htmlContent,
    });

    return true;
  } catch (error) {
    console.error("[Email Service Error]", error);
    return false;
  }
}
