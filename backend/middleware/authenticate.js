import mongoose from "mongoose";
import { AppError } from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { verifyAccessToken } from "../services/tokenService.js";
import { touchSession } from "../services/sessionService.js";

export const authenticate = asyncHandler(async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  const sessionId = req.headers["x-session-id"];

  if (!token) {
    throw new AppError(401, "No token provided", "AUTH_REQUIRED");
  }

  if (!sessionId) {
    throw new AppError(401, "No session provided", "SESSION_REQUIRED");
  }

  if (!mongoose.Types.ObjectId.isValid(sessionId)) {
    throw new AppError(403, "Invalid or expired session", "INVALID_SESSION");
  }

  try {
    const decoded = verifyAccessToken(token);
    req.user = decoded;
    req.email = decoded.email;
    req.userId = decoded.userId;
    req.sessionId = sessionId;

    await touchSession(sessionId, decoded.userId);
    next();
  } catch {
    throw new AppError(403, "Invalid or expired token", "INVALID_ACCESS_TOKEN");
  }
});
