const isTest = process.env.NODE_ENV === "test";

function parseOrigins(value) {
  if (!value) {
    return ["http://localhost:5173", "https://mern-fitness-app-one.vercel.app"];
  }

  return value
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}

export const config = {
  env: process.env.NODE_ENV || "development",
  isProduction: process.env.NODE_ENV === "production",
  isTest,
  port: Number(process.env.PORT || 5000),
  mongoUri:
    process.env.MONGODB_URI ||
    process.env.MONGODB_URL ||
    process.env.MONGO_URI ||
    (isTest ? "mongodb://127.0.0.1:27017/fitness-app-test" : ""),
  corsOrigins: parseOrigins(process.env.CORS_ORIGINS),
  auth: {
    accessSecret: process.env.SECRET_KEY || "dev-access-secret",
    refreshSecret: process.env.REFRESH || "dev-refresh-secret",
    emailVerifySecret: process.env.JWT_VERIFY || "dev-email-verify-secret",
    accessExpiry: process.env.JWT_ACCESS_EXPIRES_IN || "5m",
    refreshExpiry: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
    emailVerifyExpiry: process.env.JWT_EMAIL_VERIFY_EXPIRES_IN || "1h",
  },
  appBaseUrl: process.env.SERVER_BASE_URL || "",
  googleClientId: process.env.GOOGLE_CLIENT_ID || "",
  mail: {
    gmailClientId: process.env.GMAIL_CLIENT_ID || "",
    gmailClientSecret: process.env.GMAIL_CLIENT_SECRET || "",
    gmailRefreshToken: process.env.GMAIL_REFRESH_TOKEN || "",
    gmailSender: process.env.GMAIL_SENDER || process.env.EMAIL_USER || "",
  },
};

export function assertRequiredConfig() {
  const missing = [];

  if (!config.mongoUri && !config.isTest) {
    missing.push("MONGODB_URI");
  }

  if (!process.env.SECRET_KEY) {
    missing.push("SECRET_KEY");
  }

  if (!process.env.REFRESH) {
    missing.push("REFRESH");
  }

  if (!process.env.JWT_VERIFY) {
    missing.push("JWT_VERIFY");
  }

  return missing;
}
