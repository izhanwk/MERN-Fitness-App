// backend/get-gmail-refresh-token.js
import "dotenv/config"; // loads .env automatically
import express from "express";
import open from "open";
import { google } from "googleapis";

const PORT = 5000;
const REDIRECT_URI = `http://localhost:${PORT}/oauth2callback`;
const SCOPES = ["https://www.googleapis.com/auth/gmail.send"];

const { GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET } = process.env;

// 1) Validate env vars early
if (!GMAIL_CLIENT_ID || !GMAIL_CLIENT_SECRET) {
  console.error(
    "❌ Missing GMAIL_CLIENT_ID or GMAIL_CLIENT_SECRET in environment (.env)."
  );
  process.exit(1);
}

const app = express();

const oAuth2Client = new google.auth.OAuth2(
  GMAIL_CLIENT_ID,
  GMAIL_CLIENT_SECRET,
  REDIRECT_URI
);

// Generate consent URL (2) always print it as fallback
const authUrl = oAuth2Client.generateAuthUrl({
  access_type: "offline",
  prompt: "consent",
  scope: SCOPES,
});

app.get("/oauth2callback", async (req, res) => {
  try {
    const { code } = req.query;
    if (!code) {
      res
        .status(400)
        .send(
          "No code in callback URL. Did you paste the right redirect URI in Google Cloud?"
        );
      return;
    }
    const { tokens } = await oAuth2Client.getToken(code);
    console.log("\n===== REFRESH TOKEN (save this) =====");
    console.log(tokens.refresh_token);
    console.log("=====================================\n");
    res.send("All set! You can close this tab.");
    // Give the response a moment to flush, then exit
    setTimeout(() => server.close(() => process.exit(0)), 300);
  } catch (e) {
    console.error(
      "❌ Error getting tokens:",
      e?.response?.data || e.message || e
    );
    res.status(500).send("Something went wrong. Check terminal logs.");
  }
});

const server = app.listen(PORT, async () => {
  console.log(`\n✅ Local server listening on ${REDIRECT_URI}\n`);
  console.log(
    "👉 If your browser does not open, COPY this URL into the address bar:\n"
  );
  console.log(authUrl, "\n");
  try {
    await open(authUrl);
    console.log("Opened browser to Google consent page.");
  } catch {
    console.log(
      "Could not auto-open browser. Please paste the URL above manually."
    );
  }
});

// Helpful: fail fast if port 5000 is busy
server.on("error", (err) => {
  console.error("❌ Could not start local server:", err.message || err);
  console.error(
    "Is port 5000 already in use? If so, change PORT here and ALSO update the redirect URI in Google Cloud."
  );
  process.exit(1);
});
