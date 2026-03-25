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
