import { google } from "googleapis";
import { config } from "../config/env.js";
import { AppError } from "../utils/AppError.js";

function buildOAuthClient() {
  if (
    !config.mail.gmailClientId ||
    !config.mail.gmailClientSecret ||
    !config.mail.gmailRefreshToken
  ) {
    return null;
  }

  const oAuth2Client = new google.auth.OAuth2(
    config.mail.gmailClientId,
    config.mail.gmailClientSecret
  );
  oAuth2Client.setCredentials({ refresh_token: config.mail.gmailRefreshToken });
  return oAuth2Client;
}

const oAuth2Client = buildOAuthClient();

function b64url(str) {
  return Buffer.from(str)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export async function sendEmail({ to, subject, html, text }) {
  if (!oAuth2Client || !config.mail.gmailSender) {
    throw new AppError(
      503,
      "Email delivery is not configured",
      "EMAIL_NOT_CONFIGURED"
    );
  }

  const gmail = google.gmail({ version: "v1", auth: oAuth2Client });
  const msg =
    `From: ${config.mail.gmailSender}\r\n` +
    `To: ${to}\r\n` +
    `Subject: ${subject}\r\n` +
    `MIME-Version: 1.0\r\n` +
    `Content-Type: text/html; charset=UTF-8\r\n\r\n` +
    (html ?? text ?? "");

  const raw = b64url(msg);
  const response = await gmail.users.messages.send({
    userId: "me",
    requestBody: { raw },
  });

  return response.data;
}
