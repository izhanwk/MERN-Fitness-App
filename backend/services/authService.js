import bcrypt from "bcrypt";
import { OAuth2Client } from "google-auth-library";
import User from "../models/User.js";
import { config } from "../config/env.js";
import { AppError } from "../utils/AppError.js";
import { isProfileComplete } from "../utils/userProfile.js";
import { sendEmail } from "./emailService.js";
import { createSession, validateRefreshSession } from "./sessionService.js";
import {
  signAccessToken,
  signEmailVerificationToken,
  signRefreshToken,
  verifyEmailVerificationToken,
} from "./tokenService.js";

const googleClient = config.googleClientId
  ? new OAuth2Client(config.googleClientId)
  : null;

export async function registerUser({ email, password, req }) {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError(409, "User already exists", "USER_EXISTS");
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const verificationToken = signEmailVerificationToken({
    email,
    password: passwordHash,
  });
  const baseUrl =
    config.appBaseUrl || `${req.protocol}://${req.get("host")}`;
  const url = `${baseUrl}/api/auth/verify/${verificationToken}`;

  await sendEmail({
    to: email,
    subject: "Verify your email",
    html: `<h3>Click below to verify your email:</h3><a href="${url}">Click here to verify</a>`,
  });

  return { email };
}

export async function verifyRegistrationToken(token) {
  const decoded = verifyEmailVerificationToken(token);
  const existingUser = await User.findOne({ email: decoded.email });
  if (existingUser) {
    throw new AppError(409, "User already exists or verified", "USER_EXISTS");
  }

  await User.create({
    email: decoded.email,
    password: decoded.password,
    verified: true,
    authProvider: "local",
  });
}

export async function loginWithEmailPassword({ email, password, req }) {
  const user = await User.findOne({ email });
  if (!user || !user.password) {
    throw new AppError(
      401,
      "The information you entered is not correct",
      "INVALID_CREDENTIALS"
    );
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new AppError(401, "The password you entered is incorrect", "INVALID_CREDENTIALS");
  }

  return createAuthPayload({ user, req });
}

export async function loginWithGoogle({ credential, req }) {
  if (!googleClient) {
    throw new AppError(503, "Google sign-in is not configured", "GOOGLE_NOT_CONFIGURED");
  }

  const ticket = await googleClient.verifyIdToken({
    idToken: credential,
    audience: config.googleClientId,
  });

  const payload = ticket.getPayload();
  const email = payload?.email?.toLowerCase();
  const googleId = payload?.sub;
  const name = payload?.name;
  const picture = payload?.picture;

  if (!email || !googleId) {
    throw new AppError(400, "Unable to verify Google account", "GOOGLE_AUTH_FAILED");
  }

  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({
      email,
      password: null,
      verified: true,
      name: name || email,
      googleId,
      authProvider: "google",
      avatar: picture || "",
    });
  } else {
    user.googleId = user.googleId || googleId;
    user.authProvider = "google";
    user.verified = true;
    user.name = user.name || name || "";
    user.avatar = user.avatar || picture || "";
    await user.save();
  }

  return createAuthPayload({ user, req });
}

async function createAuthPayload({ user, req }) {
  const token = signAccessToken(user);
  const refresh = signRefreshToken(user);
  const session = await createSession({
    req,
    userId: user._id,
    refreshToken: refresh,
  });

  return {
    userId: user.id,
    email: user.email,
    token,
    refresh,
    sessionId: session._id.toString(),
    requiresProfileSetup: !isProfileComplete(user),
  };
}

export async function refreshAccessToken(sessionId) {
  const { decoded } = await validateRefreshSession(sessionId);
  const user =
    (await User.findById(decoded.userId)) ||
    (await User.findOne({ email: decoded.email }));

  if (!user) {
    throw new AppError(403, "Invalid refresh token", "INVALID_REFRESH_TOKEN");
  }

  return { token: signAccessToken(user) };
}
