import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
const resendFromEmail = process.env.RESEND_FROM_EMAIL;
const resendFromName = process.env.RESEND_FROM_NAME || "FitTrack App";

if (!resendApiKey) {
  throw new Error("RESEND_API_KEY is not defined in environment variables");
}

if (!resendFromEmail) {
  throw new Error("RESEND_FROM_EMAIL is not defined in environment variables");
}

const resend = new Resend(resendApiKey);

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => {
    switch (char) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      case "'":
        return "&#39;";
      default:
        return char;
    }
  });
}

function buildEmailLayout({ eyebrow, title, intro, body, ctaLabel, ctaUrl, note }) {
  const safeEyebrow = escapeHtml(eyebrow);
  const safeTitle = escapeHtml(title);
  const safeIntro = escapeHtml(intro);
  const safeNote = note ? escapeHtml(note) : "";

  return `
    <div style="margin:0;padding:32px 16px;background:#020617;font-family:Arial,sans-serif;color:#e2e8f0;">
      <div style="max-width:600px;margin:0 auto;border:1px solid rgba(148,163,184,0.18);border-radius:28px;overflow:hidden;background:#0f172a;box-shadow:0 24px 60px rgba(15,23,42,0.45);">
        <div style="padding:28px 32px;background:linear-gradient(135deg,#7c3aed,#2563eb);">
          <div style="display:inline-block;padding:6px 10px;border-radius:999px;background:rgba(255,255,255,0.16);font-size:11px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:#f8fafc;">
            ${safeEyebrow}
          </div>
          <h1 style="margin:18px 0 10px;font-size:28px;line-height:1.2;font-weight:700;color:#ffffff;">
            ${safeTitle}
          </h1>
          <p style="margin:0;font-size:15px;line-height:1.7;color:rgba(255,255,255,0.84);">
            ${safeIntro}
          </p>
        </div>
        <div style="padding:32px;">
          ${body}
          ${
            ctaLabel && ctaUrl
              ? `<div style="margin-top:28px;">
                  <a href="${ctaUrl}" style="display:inline-block;padding:14px 22px;border-radius:16px;background:linear-gradient(135deg,#8b5cf6,#38bdf8);color:#ffffff;text-decoration:none;font-size:14px;font-weight:700;">
                    ${escapeHtml(ctaLabel)}
                  </a>
                </div>`
              : ""
          }
          ${
            safeNote
              ? `<div style="margin-top:28px;padding:16px 18px;border-radius:18px;border:1px solid rgba(148,163,184,0.16);background:rgba(15,23,42,0.72);font-size:13px;line-height:1.7;color:#cbd5e1;">
                  ${safeNote}
                </div>`
              : ""
          }
        </div>
      </div>
    </div>
  `;
}

export function buildPasswordResetOtpEmail(otp) {
  const safeOtp = escapeHtml(otp);

  return {
    html: buildEmailLayout({
      eyebrow: "Password Reset",
      title: "Use this OTP to reset your password",
      intro:
        "A password reset was requested for your FitTrack account. Use the code below to continue securely.",
      body: `
        <div style="padding:22px;border-radius:22px;border:1px solid rgba(148,163,184,0.18);background:linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02));text-align:center;">
          <div style="font-size:12px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:#94a3b8;">One-time password</div>
          <div style="margin-top:14px;font-size:34px;letter-spacing:0.32em;font-weight:800;color:#ffffff;">${safeOtp}</div>
        </div>
        <p style="margin:22px 0 0;font-size:14px;line-height:1.8;color:#cbd5e1;">
          Enter this code in the app to finish resetting your password.
        </p>
      `,
      note: "If you did not request this, you can ignore this email. Your password will remain unchanged.",
    }),
    text: `FitTrack password reset OTP: ${otp}. If you did not request this, you can ignore this email.`,
  };
}

export function buildVerificationEmail(verificationUrl) {
  return {
    html: buildEmailLayout({
      eyebrow: "Account Verification",
      title: "Confirm your email to activate FitTrack",
      intro:
        "Verify your email address to finish creating your account and continue with your fitness setup.",
      body: `
        <p style="margin:0;font-size:15px;line-height:1.8;color:#cbd5e1;">
          Once verified, you can complete your profile, track meals, and manage your sessions across devices.
        </p>
      `,
      ctaLabel: "Verify Email",
      ctaUrl: verificationUrl,
      note: "This verification link expires in 1 hour. If you did not sign up for FitTrack, no action is needed.",
    }),
    text: `Verify your FitTrack account: ${verificationUrl}`,
  };
}

export async function sendEmail({ to, subject, html, text }) {
  const from = `${resendFromName} <${resendFromEmail}>`;

  const { error } = await resend.emails.send({
    from,
    to,
    subject,
    html,
    text,
  });

  if (error) {
    throw new Error(error.message || "Failed to send email with Resend");
  }
}
