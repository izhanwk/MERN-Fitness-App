import useragent from "useragent";
import Session from "../models/Session.js";
import { AppError } from "../utils/AppError.js";
import { getClientIp } from "../utils/request.js";
import { verifyRefreshToken } from "./tokenService.js";

export async function createSession({ req, userId, refreshToken }) {
  const agent = useragent.parse(req.headers["user-agent"] || "");
  const device = `${agent.os.toString()} ${agent.toAgent()}`.trim() || "Unknown device";
  const ip = getClientIp(req);

  await Session.updateMany({ userId }, { $set: { currentDevice: false } });

  const session = await Session.create({
    userId,
    device,
    ip,
    token: refreshToken,
    createdAt: new Date(),
    lastActive: new Date(),
    currentDevice: true,
  });

  return session;
}

export async function requireSession(sessionId, userId) {
  const session = await Session.findOne({ _id: sessionId, userId });
  if (!session) {
    throw new AppError(403, "Invalid or expired session", "INVALID_SESSION");
  }

  return session;
}

export async function touchSession(sessionId, userId) {
  const session = await requireSession(sessionId, userId);
  session.lastActive = new Date();
  session.currentDevice = true;
  await session.save();
  await Session.updateMany(
    { userId, _id: { $ne: sessionId } },
    { $set: { currentDevice: false } }
  );
  return session;
}

export async function listUserSessions(userId, currentSessionId) {
  const sessions = await Session.find({ userId }).sort({ createdAt: -1 }).lean();
  return sessions.map(({ token: _token, ...session }) => ({
    ...session,
    _id: session._id.toString(),
    userId: session.userId.toString(),
    currentDevice:
      Boolean(currentSessionId) && currentSessionId.toString() === session._id.toString(),
  }));
}

export async function revokeCurrentSession(sessionId, userId) {
  await Session.deleteOne({ _id: sessionId, userId });
}

export async function revokeOtherSession(targetSessionId, currentSessionId, userId) {
  if (targetSessionId === currentSessionId) {
    throw new AppError(400, "Cannot revoke active session", "ACTIVE_SESSION_REVOKE");
  }

  const session = await Session.findOne({ _id: targetSessionId, userId });
  if (!session) {
    throw new AppError(404, "Session not found", "SESSION_NOT_FOUND");
  }

  await session.deleteOne();
}

export async function validateRefreshSession(sessionId) {
  const session = await Session.findById(sessionId);
  if (!session) {
    throw new AppError(403, "Invalid or expired session", "INVALID_SESSION");
  }

  try {
    const decoded = verifyRefreshToken(session.token);
    if (session.userId.toString() !== decoded.userId) {
      await Session.deleteOne({ _id: sessionId });
      throw new AppError(403, "Invalid or expired session", "INVALID_SESSION");
    }

    session.lastActive = new Date();
    await session.save();
    return { session, decoded };
  } catch (error) {
    await Session.deleteOne({ _id: sessionId }).catch(() => undefined);
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(403, "Invalid or expired token", "INVALID_REFRESH_TOKEN");
  }
}
