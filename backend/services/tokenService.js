import jwt from "jsonwebtoken";
import { config } from "../config/env.js";

export function signAccessToken(user) {
  return jwt.sign(
    {
      userId: user.id || user._id?.toString(),
      email: user.email,
    },
    config.auth.accessSecret,
    { expiresIn: config.auth.accessExpiry }
  );
}

export function signRefreshToken(user) {
  return jwt.sign(
    {
      userId: user.id || user._id?.toString(),
      email: user.email,
    },
    config.auth.refreshSecret,
    { expiresIn: config.auth.refreshExpiry }
  );
}

export function signEmailVerificationToken(payload) {
  return jwt.sign(payload, config.auth.emailVerifySecret, {
    expiresIn: config.auth.emailVerifyExpiry,
  });
}

export function verifyAccessToken(token) {
  return jwt.verify(token, config.auth.accessSecret);
}

export function verifyRefreshToken(token) {
  return jwt.verify(token, config.auth.refreshSecret);
}

export function verifyEmailVerificationToken(token) {
  return jwt.verify(token, config.auth.emailVerifySecret);
}
